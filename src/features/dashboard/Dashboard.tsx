import { Suspense, lazy, useEffect, useState } from 'react';
import { useAuth } from '../../app/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase/client';

// Lazy load all tracking modules to prevent network bottlenecks
const WeeklyStepsChart = lazy(() => import('./WeeklyStepsChart').then(m => ({ default: m.WeeklyStepsChart })));
const WaterTracker = lazy(() => import('../water/WaterTracker').then(m => ({ default: m.WaterTracker })));
const StepTracker = lazy(() => import('../steps/StepTracker').then(m => ({ default: m.StepTracker })));
const MealTracker = lazy(() => import('../meals/MealTracker').then(m => ({ default: m.MealTracker })));
const WeightTracker = lazy(() => import('../weight/WeightTracker').then(m => ({ default: m.WeightTracker })));
const SleepTracker = lazy(() => import('../sleep/SleepTracker').then(m => ({ default: m.SleepTracker })));
const MoodTracker = lazy(() => import('../mood/MoodTracker').then(m => ({ default: m.MoodTracker })));
const PeriodTracker = lazy(() => import('../period/PeriodTracker').then(m => ({ default: m.PeriodTracker })));

const TrackerSkeleton = () => (
  <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl animate-pulse">
    <div className="w-1/3 h-6 mb-4 bg-gray-200 rounded-lg"></div>
    <div className="w-full h-12 bg-gray-100 rounded-xl"></div>
  </div>
);

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState<string>('');

  // Fetch the user's customized display name
  useEffect(() => {
    const fetchName = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single();
      
      if (data?.display_name) {
        setDisplayName(data.display_name);
      }
    };
    fetchName();
  }, [user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // Dynamic Greeting Logic
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning 🌸' : hour < 18 ? 'Good afternoon ☀️' : 'Good evening 🌙';

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center justify-between max-w-md px-6 py-5 mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{greeting}</h1>
            {/* Display Name renders here, falling back to Today's Progress if loading */}
            <p className="text-sm font-medium text-gray-500">{displayName || "Today's Progress"}</p>
          </div>
          <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <button onClick={() => navigate('/calendar')} className="px-3 py-1 text-sm font-medium text-purple-600 transition-colors bg-purple-50 rounded-lg hover:bg-purple-100 whitespace-nowrap">Calendar</button>
            <button onClick={() => navigate('/companion')} className="px-3 py-1 text-sm font-medium text-blue-600 transition-colors bg-blue-50 rounded-lg hover:bg-blue-100 whitespace-nowrap">Friends</button>
            <button onClick={() => navigate('/settings')} className="px-3 py-1 text-sm font-medium text-gray-600 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200 whitespace-nowrap">Settings</button>
            <button onClick={handleSignOut} className="px-3 py-1 text-sm font-medium text-red-600 transition-colors bg-red-50 rounded-lg hover:bg-red-100 whitespace-nowrap">Sign Out</button>
          </div>
        </div>
      </header>

      <main className="max-w-md p-6 mx-auto space-y-6">
        <Suspense fallback={<div className="space-y-6"><TrackerSkeleton /><TrackerSkeleton /><TrackerSkeleton /></div>}>
          <WeeklyStepsChart />
          <WaterTracker />
          <StepTracker />
          <MealTracker />
          <PeriodTracker />
          <WeightTracker />
          <SleepTracker />
          <MoodTracker />
        </Suspense>
      </main>
    </div>
  );
};