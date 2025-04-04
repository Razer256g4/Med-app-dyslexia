// frontend/src/services/types.ts
export interface ProfileCreate {
  name: string;
  age: number;
  height: number;
  weight: number;
}

// Update existing Profile interface
export interface Profile extends ProfileCreate {
  id: number;
  created_at: string;
}

export interface NoteCreate {
  profile_id: number;
  content: string;
}

export interface Note extends NoteCreate {
  id: number;
  created_at: string;
}

export interface SummaryRequest {
  profile_id: number;
  range: 'weekly' | 'monthly' | 'custom';
  start_date?: string;
  end_date?: string;
}

export interface SummaryResponse {
  summary: string;
  start_date: string;
  end_date: string;
  note_count: number;
}
