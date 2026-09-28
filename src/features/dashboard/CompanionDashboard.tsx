import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';
import { getCompanionRelationships, type Relationship } from '../../lib/supabase/relationshipService';
import { supabase } from '../../lib/supabase/client';

export const CompanionDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [following, setFollowing] = useState<Relationship[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Read-only data states
  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);
  const [latestMood, setLatestMood] = useState('Not logged yet');

  useEffect(() => {
    if (user) initialize();
  }, [user]);

  const initialize = async () => {
    if (!user) return;
    const rels = await getCompanionRelationships(user.id);
    const active = rels.filter(r => r.status === 'active');
    setFollowing(active);
    if (active.length > 0) {
      setActiveId(active[0].primary_user_id);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (activeId) loadCompanionData(activeId);
  }, [activeId]);

  const loadCompanionData = async (targetUserId: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isoString = today.toISOString();

    // 1. Fetch Steps
    const { data: stepData } = await supabase
      .from('step_logs')
      .select('steps')
      .eq('user_id', targetUserId)
      .gte('recorded_at', isoString);
    setSteps(stepData?.reduce((acc, log) => acc + log.steps, 0) || 0);

    // 2. Fetch Meals (Calories)
    const { data: mealData } = await supabase
      .from('meals')
      .select('estimated_calories')
      .eq('user_id', targetUserId)
      .gte('recorded_at', isoString);
    setCalories(mealData?.reduce((acc, log) => acc + log.estimated_calories, 0) || 0);

    // 3. Fetch Latest Mood
    const { data: moodData } = await supabase
      .from('mood_logs')
      .select('mood_level')
      .eq('user_id', targetUserId)
      .gte('recorded_at', isoString)
      .order('recorded_at', { ascending: false })
      .limit(1);
    setLatestMood(moodData?.[0]?.mood_level || 'Not logged yet');
  };

  if (loading) return <div className="p-4 text-center">Loading dashboard...</div>;

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <header className="sticky top-0 z-10 flex items-center gap-4 px-6 py-5 bg-white shadow-sm">
        <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-900">
          ← Back
        </button>
        <h1 className="text-xl font-bold text-gray-900">Companion View</h1>
      </header>

      <main className="max-w-md p-6 mx-auto space-y-6">
        {following.length === 0 ? (
          <div className="p-6 text-center bg-white border border-gray-100 shadow-sm rounded-2xl">
            <p className="text-gray-500">You are not following anyone yet.</p>
            <p className="mt-2 text-sm text-gray-400">Ask a friend for their code and add them in Settings.</p>
          </div>
        ) : (
          <>
            <div className="flex gap-2 pb-2 overflow-x-auto">
              {following.map(rel => (
                <button
                  key={rel.id}
                  onClick={() => setActiveId(rel.primary_user_id)}
                  className={`px-4 py-2 text-sm font-semibold rounded-xl whitespace-nowrap transition-colors ${
                    activeId === rel.primary_user_id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {rel.profiles?.display_name || 'Primary User'}
                </button>
              ))}
            </div>

            <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Today's Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between pb-3 border-b border-gray-50">
                  <span className="text-gray-500">👟 Steps</span>
                  <span className="font-semibold text-gray-900">{steps.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-gray-50">
                  <span className="text-gray-500">🍱 Calories</span>
                  <span className="font-semibold text-orange-600">{calories.toLocaleString()} kcal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">✨ Current Mood</span>
                  <span className="font-semibold text-purple-600">{latestMood}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};