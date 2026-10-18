import { Suspense, lazy, useEffect, useState } from 'react';
import { useAuth } from '../../app/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase/client';

// Lazy load all tracking modules
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

// Updated with [NAME] placeholders
const FLIRTY_QUOTES = [
  "You look dangerously good today, [NAME]. Don't forget your water!",
  "Just a reminder that you're the prettiest girl I know. Now go log your steps.",
  "I was just thinking about you. (Also, drink some water).",
  "Looking at you makes me smile. Keep crushing it today, [NAME].",
  "You're literally glowing today.",
  "I'm saving my appetite for our next dinner date. Until then, log your meals, [NAME]!",
  "Hope your day is as beautiful as you are.",
  "Just dropping by to remind you how much I adore you.",
  "Take a break, drink some water, and remember you're amazing, [NAME].",
  "You make everything better just by existing.",
  "I love you more than you love ignoring your step count. (Go walk, [NAME]!)",
  "Hey [NAME], don't forget to take care of yourself today.",
  "Even the prettiest beach sunset has nothing on you.",
  "You always look so perfect, even when you're just logging your stats.",
  "My favorite time of day is whenever I'm talking to you.",
  "You're my favorite person to watch the sunset with.",
  "Stop looking so good and start logging your food, [NAME]!",
  "Just checking in on my favorite person in the world.",
  "I'd trade a perfect evening by the water just to see you smile.",
  "Walking is good for your heart, but you already have mine."
];

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState<string>('');
  
  const [quoteTemplate] = useState(() => FLIRTY_QUOTES[Math.floor(Math.random() * FLIRTY_QUOTES.length)]);

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

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning 🌸' : hour < 18 ? 'Good afternoon ☀️' : 'Good evening 🌙';
  
  // Dynamically inject the name right before rendering
  const finalQuote = quoteTemplate.replace(/\[NAME\]/g, displayName || 'gorgeous');

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="flex flex-col gap-2.5 max-w-md px-5 py-3.5 mx-auto">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{greeting}</h1>
            <p className="mt-0.5 text-xs font-medium text-gray-500 leading-snug">
              {finalQuote}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => navigate('/calendar')} className="px-3 py-1.5 text-xs font-medium text-purple-600 transition-colors bg-purple-50 rounded-md hover:bg-purple-100">Calendar</button>
            <button onClick={() => navigate('/companion')} className="px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors bg-blue-50 rounded-md hover:bg-blue-100">Friends</button>
            <button onClick={() => navigate('/settings')} className="px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors bg-gray-100 rounded-md hover:bg-gray-200">Settings</button>
            <button onClick={handleSignOut} className="px-3 py-1.5 text-xs font-medium text-red-600 transition-colors bg-red-50 rounded-md hover:bg-red-100">Sign Out</button>
          </div>
        </div>
      </header>

      <main className="max-w-md p-6 mx-auto space-y-6 overflow-x-hidden">
        <Suspense fallback={<div className="space-y-6"><TrackerSkeleton /><TrackerSkeleton /><TrackerSkeleton /></div>}>
          <div className="animate-slide-up" style={{ animationDelay: '0ms' }}>
            <WeeklyStepsChart />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '75ms' }}>
            <WaterTracker />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '150ms' }}>
            <StepTracker />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '225ms' }}>
            <MealTracker />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <PeriodTracker />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '375ms' }}>
            <WeightTracker />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '450ms' }}>
            <SleepTracker />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '525ms' }}>
            <MoodTracker />
          </div>
        </Suspense>
      </main>
    </div>
  );
};