import { useState, useEffect } from 'react';
import { useAuth } from '../../app/providers/AuthProvider';
import { getTodaySteps, logSteps } from '../../lib/supabase/stepService';

export const StepTracker = () => {
  const { user } = useAuth();
  const [total, setTotal] = useState(0);
  const [inputSteps, setInputSteps] = useState('');
  const [loading, setLoading] = useState(true);
  const dailyGoal = 8000;

  useEffect(() => {
    if (user) loadSteps();
  }, [user]);

  const loadSteps = async () => {
    if (!user) return;
    const currentTotal = await getTodaySteps(user.id);
    setTotal(currentTotal);
    setLoading(false);
  };

  const handleAddSteps = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !inputSteps) return;
    
    const amount = parseInt(inputSteps, 10);
    if (isNaN(amount) || amount <= 0) return;

    setTotal(prev => prev + amount);
    setInputSteps('');
    
    try {
      await logSteps(user.id, amount);
    } catch (error) {
      console.error("Failed to log steps", error);
      setTotal(prev => prev - amount);
    }
  };

  if (loading) return <div className="p-4 text-center text-gray-500 animate-pulse">Loading steps...</div>;

  const progressPercentage = Math.min((total / dailyGoal) * 100, 100);

  return (
    <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">👟 Steps</h2>
        <span className="text-sm font-medium text-gray-500">
          {total.toLocaleString()} / {dailyGoal.toLocaleString()}
        </span>
      </div>
      
      <div className="w-full h-3 mb-6 overflow-hidden bg-gray-100 rounded-full">
        <div 
          className="h-full transition-all duration-500 ease-out bg-green-500 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <form onSubmit={handleAddSteps} className="flex gap-2">
        <input
          type="number"
          value={inputSteps}
          onChange={(e) => setInputSteps(e.target.value)}
          placeholder="Enter steps (e.g. 1000)"
          className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="px-4 py-2 font-semibold text-white transition-colors bg-green-500 rounded-xl hover:bg-green-600 active:scale-95"
        >
          Add
        </button>
      </form>
    </div>
  );
};