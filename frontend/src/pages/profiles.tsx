// src/pages/profiles.tsx
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Link from 'next/link';
import type {
  Profile,
  Note,
  SummaryRequest,
  ProfileCreate
} from '/Users/razer256g4/USYD/Med app fast api/frontend/src/services/types';  


export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProfile, setNewProfile] = useState({
    name: '',
    age: '',
    height: '',
    weight: ''
  });

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const profilesData = await api.profiles.getAll();
      setProfiles(profilesData);  // Now properly typed as Profile[]
    } catch (error) {
      console.error('Error loading profiles:', error);
    }
  };
  
  const createProfile = async () => {
    try {
      const newProfileData: ProfileCreate = {
        name: newProfile.name,
        age: Number(newProfile.age),
        height: Number(newProfile.height),
        weight: Number(newProfile.weight)
      };
      
      const createdProfile = await api.profiles.create(newProfileData);
      setProfiles(prev => [...prev, createdProfile]);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };
  const deleteProfile = async (id: number) => {
    if (confirm('Are you sure you want to delete this profile?')) {
      try {
        await api.profiles.delete(id);
        loadProfiles();
      } catch (error) {
        console.error('Error deleting profile:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Children Profiles</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Add Child
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white p-6 rounded-xl shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">New Profile</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                className="p-2 border rounded-lg"
                value={newProfile.name}
                onChange={(e) => setNewProfile({...newProfile, name: e.target.value})}
              />
              <input
                type="number"
                placeholder="Age"
                className="p-2 border rounded-lg"
                value={newProfile.age}
                onChange={(e) => setNewProfile({...newProfile, age: e.target.value})}
              />
              <input
                type="number"
                placeholder="Height (cm)"
                className="p-2 border rounded-lg"
                value={newProfile.height}
                onChange={(e) => setNewProfile({...newProfile, height: e.target.value})}
              />
              <input
                type="number"
                placeholder="Weight (kg)"
                className="p-2 border rounded-lg"
                value={newProfile.weight}
                onChange={(e) => setNewProfile({...newProfile, weight: e.target.value})}
              />
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={createProfile}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Save Profile
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profiles.map((profile) => (
            <div key={profile.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{profile.name}</h3>
                <button
                  onClick={() => deleteProfile(profile.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
              <div className="space-y-2 text-gray-600">
                <p><span className="font-medium">Age:</span> {profile.age} years</p>
                <p><span className="font-medium">Height:</span> {profile.height} cm</p>
                <p><span className="font-medium">Weight:</span> {profile.weight} kg</p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
              <Link
                href={`/notes/${profile.id}`}
                className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Notes
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}