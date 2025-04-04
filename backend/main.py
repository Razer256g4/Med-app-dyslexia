from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
import requests

# Initialize FastAPI
app = FastAPI()

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Setup
def get_db_connection():
    conn = sqlite3.connect('dyslexia.db')
    conn.row_factory = sqlite3.Row
    return conn

# Initialize tables
def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            age INTEGER NOT NULL,
            height REAL NOT NULL,
            weight REAL NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            profile_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(profile_id) REFERENCES profiles(id)
        )''')
    conn.commit()
    conn.close()

init_db()

# Pydantic Models
class ProfileCreate(BaseModel):
    name: str
    age: int
    height: float
    weight: float

class NoteCreate(BaseModel):
    profile_id: int
    content: str

class SummaryRequest(BaseModel):
    profile_id: int
    range: str  # weekly/monthly/custom
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

# Helper Functions
def get_profile(cursor: sqlite3.Cursor, profile_id: int):
    cursor.execute('SELECT * FROM profiles WHERE id = ?', (profile_id,))
    profile = cursor.fetchone()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

# API Endpoints
@app.post("/profiles")
def create_profile(profile: ProfileCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('''
            INSERT INTO profiles (name, age, height, weight)
            VALUES (?, ?, ?, ?)
        ''', (profile.name, profile.age, profile.height, profile.weight))
        conn.commit()
        return {"id": cursor.lastrowid, **profile.dict()}
    except sqlite3.Error as e:
        conn.rollback()
        raise HTTPException(500, f"Database error: {str(e)}")
    finally:
        conn.close()

@app.get("/profiles")
def get_all_profiles():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('SELECT * FROM profiles')
        profiles = [dict(row) for row in cursor.fetchall()]
        return profiles
    except sqlite3.Error as e:
        raise HTTPException(500, f"Database error: {str(e)}")
    finally:
        conn.close()

@app.post("/notes")
def create_note(note: NoteCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        get_profile(cursor, note.profile_id)  # Validate profile exists
        cursor.execute('''
            INSERT INTO notes (profile_id, content)
            VALUES (?, ?)
        ''', (note.profile_id, note.content))
        conn.commit()
        return {"id": cursor.lastrowid, **note.dict()}
    except sqlite3.Error as e:
        conn.rollback()
        raise HTTPException(500, f"Database error: {str(e)}")
    finally:
        conn.close()

@app.get("/notes/{profile_id}")
def get_notes(profile_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('SELECT * FROM notes WHERE profile_id = ?', (profile_id,))
        notes = [dict(row) for row in cursor.fetchall()]
        return notes
    except sqlite3.Error as e:
        raise HTTPException(500, f"Database error: {str(e)}")
    finally:
        conn.close()

@app.post("/summaries/{profile_id}")
def generate_summary(request: SummaryRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Calculate date range
        end_date = datetime.now()
        if request.range == "weekly":
            start_date = end_date - timedelta(days=7)
        elif request.range == "monthly":
            start_date = end_date - timedelta(days=30)
        elif request.range == "custom":
            if not request.start_date or not request.end_date:
                raise HTTPException(400, "Custom range requires start/end dates")
            start_date = request.start_date
            end_date = request.end_date
        else:
            raise HTTPException(400, "Invalid range parameter")

        # Get notes in range
        cursor.execute('''
            SELECT content FROM notes
            WHERE profile_id = ? 
            AND datetime(created_at) BETWEEN datetime(?) AND datetime(?)
        ''', (request.profile_id, start_date, end_date))
        notes = [row[0] for row in cursor.fetchall()]
        
        if not notes:
            raise HTTPException(404, "No notes found in selected period")

        # Generate summary with DeepSeek
        prompt = (
            "Generate detailed dyslexia progress report from these notes:\n- "
            + "\n- ".join(notes)
            + "\n\nInclude sections:\n1. Key Observations\n2. Progress Areas\n3. Recommendations"
        )
        
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "deepseek",
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.7,
                    "max_tokens": 1000
                }
            },
            timeout=45
        )
        response.raise_for_status()
        summary = response.json()["response"]

        return {
            "summary": summary,
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "note_count": len(notes)
        }
    except requests.RequestException as e:
        raise HTTPException(503, f"AI service error: {str(e)}")
    except KeyError:
        raise HTTPException(503, "Unexpected response from AI service")
    finally:
        conn.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)