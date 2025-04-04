// src/components/SummaryGenerator.tsx
import { useState } from 'react';
import { api } from '../services/api';
import type { SummaryRequest, SummaryResponse } from '../services/types';

interface SummaryGeneratorProps {
  profileId: number;
}

export default function SummaryGenerator({ profileId }: SummaryGeneratorProps) {
  const [range, setRange] = useState<SummaryRequest['range']>('weekly');
  const [customDates, setCustomDates] = useState<{ start: string; end: string }>({ 
    start: '', 
    end: '' 
  });
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const generateSummary = async () => {
    setLoading(true);
    try {
      const request: SummaryRequest = {
        profile_id: profileId,
        range,
        ...(range === 'custom' && {
          start_date: customDates.start,
          end_date: customDates.end
        })
      };
  
      // Call through the proper API client structure
      const { data } = await api.summaries.generate(request);
      setSummary(data);
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Generate Summary</h2>
      <div className="space-y-4">
        <select
          value={range}
          onChange={(e) => setRange(e.target.value as SummaryRequest['range'])}
          className="w-full p-2 border rounded-lg"
        >
          <option value="weekly">Last Week</option>
          <option value="monthly">Last Month</option>
          <option value="custom">Custom Range</option>
        </select>

        {range === 'custom' && (
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={customDates.start}
              onChange={(e) => setCustomDates({ ...customDates, start: e.target.value })}
              className="p-2 border rounded-lg"
            />
            <input
              type="date"
              value={customDates.end}
              onChange={(e) => setCustomDates({ ...customDates, end: e.target.value })}
              className="p-2 border rounded-lg"
            />
          </div>
        )}

        <button
          onClick={generateSummary}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Generating...' : 'Generate Summary'}
        </button>

        {summary && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">
              Summary ({new Date(summary.start_date).toLocaleDateString()} -{' '}
              {new Date(summary.end_date).toLocaleDateString()})
            </h3>
            <div className="whitespace-pre-wrap text-gray-700">
              {summary.summary}
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Analyzed {summary.note_count} notes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}