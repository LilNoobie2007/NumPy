import { useState, useEffect } from 'react';
import { useAuth } from '../../app/providers/AuthProvider';
import { getTodayWaterTotal, logWater } from '../../lib/supabase/waterService';

export const WaterTracker = () => {
  const { user } = useAuth();
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const dailyGoal = 2200; // 2.2L as per standard config

  useEffect(() => {
    if (user) loadWater();
  }, [user]);

  const loadWater = async () => {
    if (!user) return;
    const currentTotal = await getTodayWaterTotal(user.id);
    setTotal(currentTotal);
    setLoading(false);
  };

  const handleAddWater = async (amount: number) => {
    if (!user) return;
    
    // Optimistic UI update for speed
    setTotal(prev => prev + amount);
    
    try {
      await logWater(user.id, amount);
    } catch (error) {
      console.error("Failed to log water", error);
      // Revert if database fails
      setTotal(prev => prev - amount);
    }
  };

  if (loading) return <div className="p-4 text-center text-gray-500 animate-pulse">Loading water data...</div>;

  const progressPercentage = Math.min((total / dailyGoal) * 100, 100);

  return (
    <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-blue-900">💧 Water</h2>
        <span className="text-sm font-medium text-gray-500">
          {(total / 1000).toFixed(1)} L / {(dailyGoal / 1000).toFixed(1)} L
        </span>
      </div>
      
      <div className="w-full h-3 mb-6 overflow-hidden bg-gray-100 rounded-full">
        <div 
          className="h-full transition-all duration-500 ease-out bg-blue-500 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[250, 500, 750].map((amount) => (
          <button
            key={amount}
            onClick={() => handleAddWater(amount)}
            className="px-2 py-3 text-sm font-semibold text-blue-700 transition-colors bg-blue-50 rounded-xl hover:bg-blue-100 active:scale-95"
          >
            +{amount} ml
          </button>
        ))}
      </div>
    </div>
  );
};