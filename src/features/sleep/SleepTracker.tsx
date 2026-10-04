import { useState } from 'react';
import { useAuth } from '../../app/providers/AuthProvider';
import { logSleep } from '../../lib/supabase/trackingServices';

export const SleepTracker = () => {
  const { user } = useAuth();
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !start || !end) return;
    try {
      await logSleep(user.id, new Date(start).toISOString(), new Date(end).toISOString(), 'Good');
      setStart('');
      setEnd('');
      alert('Sleep logged successfully!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">🌙 Sleep</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Stacked Vertically to prevent clipping */}
        <div className="space-y-3">
          <div>
            <label className="block mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">Bedtime</label>
            <input 
              type="datetime-local" 
              value={start} 
              onChange={(e) => setStart(e.target.value)} 
              className="w-full px-4 py-3 text-sm font-medium text-gray-700 transition-colors border shadow-sm bg-gray-50 border-gray-100 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              required 
            />
          </div>
          <div>
            <label className="block mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">Wake up</label>
            <input 
              type="datetime-local" 
              value={end} 
              onChange={(e) => setEnd(e.target.value)} 
              className="w-full px-4 py-3 text-sm font-medium text-gray-700 transition-colors border shadow-sm bg-gray-50 border-gray-100 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              required 
            />
          </div>
        </div>
        
        <button type="submit" className="w-full px-4 py-3 font-semibold text-white transition-colors bg-indigo-500 shadow-sm rounded-xl hover:bg-indigo-600 active:scale-95">
          Log Sleep
        </button>
      </form>
    </div>
  );
};