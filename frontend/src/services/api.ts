// frontend/src/services/api.ts
import axios from 'axios';
import type {
  Profile,
  Note,
  SummaryRequest,
  ProfileCreate,
  NoteCreate,
  SummaryResponse
} from '/Users/razer256g4/USYD/Med app fast api/frontend/src/services/types';  
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = {
  profiles: {
    getAll: async (): Promise<Profile[]> => {
      const response = await axios.get<Profile[]>(`${API_URL}/profiles`);
      return response.data;
    },
    create: async (profile: ProfileCreate): Promise<Profile> => {
      const response = await axios.post<Profile>(`${API_URL}/profiles`, profile);
      return response.data;
    },
    delete: async (id: number): Promise<void> => {
      await axios.delete(`${API_URL}/profiles/${id}`);
    }
  },
  notes: {
    getByProfile: (profileId: number) => 
      axios.get<Note[]>(`${API_URL}/notes/${profileId}`),
    create: (note: NoteCreate) => axios.post<Note>(`${API_URL}/notes`, note)
  },
  summaries: {
    generate: (data: SummaryRequest) => 
      axios.post<SummaryResponse>(`${API_URL}/summaries`, data)
  }
};