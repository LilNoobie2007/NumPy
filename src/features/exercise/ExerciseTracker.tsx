import { useState } from 'react';
import { useAuth } from '../../app/providers/AuthProvider';
import { logExercise } from '../../lib/supabase/trackingServices';

export const ExerciseTracker = () => {
  const { user } = useAuth();
  const [activity, setActivity] = useState('');
  const [duration, setDuration] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activity || !duration) return;
    try {
      await logExercise(user.id, activity, parseInt(duration, 10));
      setActivity('');
      setDuration('');
      alert('Exercise logged successfully!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">🏃 Exercise</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" value={activity} onChange={(e) => setActivity(e.target.value)} placeholder="Activity (e.g., Running)" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500" required />
        <div className="flex gap-2">
          <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Minutes" className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500" required />
          <button type="submit" className="px-4 py-2 font-semibold text-white transition-colors bg-teal-500 rounded-xl hover:bg-teal-600 active:scale-95">Log</button>
        </div>
      </form>
    </div>
  );
};