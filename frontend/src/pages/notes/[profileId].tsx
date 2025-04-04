// src/pages/notes/[profileId].tsx
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import SummaryGenerator from '../../components/SummaryGenerator';
import type {
  Profile,
  Note,
  SummaryRequest,
} from '/Users/razer256g4/USYD/Med app fast api/frontend/src/services/types';  

export default function NotesPage() {
  const router = useRouter();
  const profileId = Number(router.query.profileId);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    if (profileId) loadNotes();
  }, [profileId]);

  const loadNotes = async () => {
    try {
      const { data } = await api.notes.getByProfile(profileId);
      setNotes(data);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    try {
      await api.notes.create({
        profile_id: profileId,
        content: newNote.trim()
      });
      setNewNote('');
      loadNotes();
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 text-blue-600 hover:text-blue-700 flex items-center"
        >
          ← Back to Profiles
        </button>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add new observation..."
            className="w-full p-4 border rounded-lg mb-4"
            rows={3}
          />
          <button
            onClick={addNote}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Add Note
          </button>
        </div>

        <SummaryGenerator profileId={profileId} />

        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-gray-800 whitespace-pre-wrap">{note.content}</p>
              <p className="mt-2 text-sm text-gray-500">
                {new Date(note.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}