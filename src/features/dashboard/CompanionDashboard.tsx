import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';
import { getCompanionRelationships, type Relationship } from '../../lib/supabase/relationshipService';
import { supabase } from '../../lib/supabase/client';

const MetricCard = ({ icon, title, value, color, bg }: { icon: string, title: string, value: string | number, color: string, bg: string }) => (
  <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-2xl">
    <div className={`w-10 h-10 flex items-center justify-center rounded-full ${bg} ${color} mb-3 text-lg`}>
      {icon}
    </div>
    <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">{title}</p>
    <p className="mt-1 text-lg font-bold text-gray-900 truncate">{value}</p>
  </div>
);

export const CompanionDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [following, setFollowing] = useState<Relationship[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize selectedDate to today's local date (YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });

  const [metrics, setMetrics] = useState({
    steps: 0,
    calories: 0,
    water: 0,
    mood: 'No data',
    weight: 'No data',
    periodFlow: null as string | null,
  });

  useEffect(() => {
    if (user) initialize();
  }, [user]);

  const initialize = async () => {
    if (!user) return;
    const rels = await getCompanionRelationships(user.id);
    const active = rels.filter(r => r.status === 'active');
    setFollowing(active);
    if (active.length > 0) setActiveId(active[0].primary_user_id);
    setLoading(false);
  };

  // Re-fetch when the active partner OR the selected date changes
  useEffect(() => {
    if (activeId) loadCompanionData(activeId, selectedDate);
  }, [activeId, selectedDate]);

  const loadCompanionData = async (targetUserId: string, dateStr: string) => {
    // Safely parse local date to avoid timezone offset bugs
    const [year, month, day] = dateStr.split('-').map(Number);
    
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

    const startIso = startOfDay.toISOString();
    const endIso = endOfDay.toISOString();

    const [
      { data: stepData },
      { data: mealData },
      { data: waterData },
      { data: moodData },
      { data: weightData },
      { data: periodData }
    ] = await Promise.all([
      supabase.from('step_logs').select('steps').eq('user_id', targetUserId).gte('recorded_at', startIso).lte('recorded_at', endIso),
      supabase.from('meals').select('estimated_calories').eq('user_id', targetUserId).gte('recorded_at', startIso).lte('recorded_at', endIso),
      supabase.from('water_logs').select('amount').eq('user_id', targetUserId).gte('recorded_at', startIso).lte('recorded_at', endIso),
      supabase.from('mood_logs').select('mood_level').eq('user_id', targetUserId).gte('recorded_at', startIso).lte('recorded_at', endIso).order('recorded_at', { ascending: false }).limit(1),
      supabase.from('weight_logs').select('weight').eq('user_id', targetUserId).gte('recorded_at', startIso).lte('recorded_at', endIso).order('recorded_at', { ascending: false }).limit(1),
      supabase.from('period_logs').select('flow_intensity').eq('user_id', targetUserId).eq('start_date', dateStr).limit(1)
    ]);

    setMetrics({
      steps: stepData?.reduce((acc, log) => acc + log.steps, 0) || 0,
      calories: mealData?.reduce((acc, log) => acc + log.estimated_calories, 0) || 0,
      water: waterData?.reduce((acc, log) => acc + log.amount, 0) || 0,
      mood: moodData?.[0]?.mood_level || 'No data',
      weight: weightData?.[0]?.weight ? `${weightData[0].weight} kg` : 'No data',
      periodFlow: periodData?.[0]?.flow_intensity || null,
    });
  };

  // Helper to check if selected date is today
  const isToday = () => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    return selectedDate === todayStr;
  };

  if (loading) return <div className="p-4 text-center text-gray-500 animate-pulse">Loading dashboard...</div>;

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center gap-4 px-6 py-5 mx-auto max-w-md">
          <button onClick={() => navigate('/')} className="text-gray-400 transition-colors hover:text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Partner View</h1>
        </div>
      </header>

      <main className="max-w-md p-6 mx-auto space-y-6">
        {following.length === 0 ? (
          <div className="p-6 text-center bg-white border border-gray-100 shadow-sm rounded-2xl">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-blue-50 rounded-full text-blue-500 text-xl">👥</div>
            <p className="font-medium text-gray-900">No partner connected yet.</p>
            <p className="mt-1 text-sm text-gray-500">Add a friend code in Settings to view their stats here.</p>
          </div>
        ) : (
          <>
            <div className="flex gap-2 pb-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {following.map(rel => (
                <button
                  key={rel.id}
                  onClick={() => setActiveId(rel.primary_user_id)}
                  className={`px-5 py-2 text-sm font-semibold rounded-xl whitespace-nowrap transition-colors shadow-sm ${
                    activeId === rel.primary_user_id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {rel.profiles?.display_name || 'Primary User'}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {/* Header with Date Picker */}
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold tracking-wider text-gray-500 uppercase">
                  {isToday() ? "Today's Overview" : "Daily Overview"}
                </h2>
                <input
                  type="date"
                  value={selectedDate}
                  max={new Date().toISOString().split('T')[0]} // Prevent selecting future dates
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-200 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <MetricCard 
                  icon="👟" title="Steps" value={metrics.steps.toLocaleString()} 
                  color="text-green-600" bg="bg-green-50" 
                />
                <MetricCard 
                  icon="💧" title="Water" value={`${metrics.water} ml`} 
                  color="text-blue-600" bg="bg-blue-50" 
                />
                <MetricCard 
                  icon="🍱" title="Calories" value={`${metrics.calories} kcal`} 
                  color="text-orange-600" bg="bg-orange-50" 
                />
                <MetricCard 
                  icon="✨" title="Mood" value={metrics.mood} 
                  color="text-purple-600" bg="bg-purple-50" 
                />
                <MetricCard 
                  icon="⚖️" title="Weight" value={metrics.weight} 
                  color="text-gray-600" bg="bg-gray-100" 
                />
                {metrics.periodFlow && (
                  <MetricCard 
                    icon="🩸" title="Cycle" value={`${metrics.periodFlow} Flow`} 
                    color="text-red-600" bg="bg-red-50" 
                  />
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};