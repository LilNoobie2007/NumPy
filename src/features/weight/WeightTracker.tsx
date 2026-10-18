import { useState } from 'react';
import { useAuth } from '../../app/providers/AuthProvider';
import { logWeight } from '../../lib/supabase/trackingServices';
import { triggerHaptic } from '../../lib/haptics';

export const WeightTracker = () => {
  const { user } = useAuth();
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState('kg');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !weight) return;

    // Physical vibration feedback
    triggerHaptic('success');

    try {
      await logWeight(user.id, parseFloat(weight), unit);
      setWeight('');
      alert('Weight logged successfully!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">⚖️ Weight</h2>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input 
          type="number" 
          step="0.1" 
          value={weight} 
          onChange={(e) => setWeight(e.target.value)} 
          placeholder="Enter weight" 
          className="flex-1 min-w-0 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500" 
          required 
        />
        <select 
          value={unit} 
          onChange={(e) => setUnit(e.target.value)} 
          className="shrink-0 px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="kg">kg</option>
        </select>
        <button 
          type="submit" 
          className="shrink-0 px-4 py-2 font-semibold text-white transition-all duration-200 bg-purple-500 rounded-xl hover:bg-purple-600 active:scale-90 active:bg-opacity-80"
        >
          Log
        </button>
      </form>
    </div>
  );
};