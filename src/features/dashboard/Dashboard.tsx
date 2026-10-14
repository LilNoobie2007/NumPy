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

const FLIRTY_QUOTES = [
  "Looking at you is the only cardio I need, but you should still log your steps.",
  "You're doing amazing today, gorgeous.",
  "Are you a campfire? Because you're hot and I want s'mores. (Log your food!)",
  "You're my favorite distraction. Now back to your daily goals!",
  "I believe in you almost as much as I'm obsessed with you.",
  "Even the prettiest beach sunset has nothing on you. Stay hydrated!",
  "Did you smile today? If not, think of me. Also, drink some water.",
  "Just a daily reminder that you are absolutely stunning.",
  "Logging your stats makes you 100% hotter. Scientifically proven.",
  "Do you have a map? Because I just keep getting lost in your eyes... and I need you to track your steps.",
  "You must be tired because you've been running through my mind all day. Still need actual steps though!",
  "Good things come to those who sweat. You're already perfect, but let's see it.",
  "I'd give up my WiFi for you, but I need it to see if you logged your meals.",
  "You make my dopamine levels go crazy.",
  "If being beautiful was a crime, you'd be serving a life sentence. Drink your water.",
  "Is it hot in here, or is it just you crushing your daily goals?",
  "You're the only notification I actually want to see.",
  "Stop looking so good and start logging your food!",
  "My favorite place is right next to you, ideally watching a sunset.",
  "You're the CSS to my HTML. You make everything look good.",
  "I love you more than pizza. And that's saying a lot. Log your meals!",
  "I'm not a photographer, but I can definitely picture us together. Now, go walk.",
  "Are you a magician? Because whenever I look at you, everyone else disappears.",
  "Your smile is literally my favorite thing in the world.",
  "Drink a glass of water for every time you looked cute today. (You're gonna need a lot of water).",
  "Just checking in on the most gorgeous girl in the world.",
  "I hope your day is as beautiful as your face.",
  "You're the reason I look down at my phone and smile.",
  "Walking is good for your heart, but you already have mine.",
  "You are my today and all of my tomorrows.",
  "Don't forget to drink water, eat well, and remember how much I adore you.",
  "I was feeling off today, but then I remembered you exist.",
  "You're literally glowing. Keep it up!",
  "If I could rearrange the alphabet, I'd put U and I together.",
  "You're looking especially fine today. Don't forget to track your mood!"
];

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState<string>('');
  
  const [quote] = useState(() => FLIRTY_QUOTES[Math.floor(Math.random() * FLIRTY_QUOTES.length)]);

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

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      {/* Sleek, frosted glass sticky header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="flex flex-col gap-2.5 max-w-md px-5 py-3.5 mx-auto">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{greeting}</h1>
            <p className="mt-0.5 text-xs font-medium text-gray-500 leading-snug">
              {quote}
            </p>
          </div>
          {/* Tighter gaps and smaller text sizes to force a compact single line if possible */}
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