import { supabase } from './client';

export const getWeeklySteps = async (userId: string) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Get last 7 days including today
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('step_logs')
    .select('steps, recorded_at')
    .eq('user_id', userId)
    .gte('recorded_at', sevenDaysAgo.toISOString());

  if (error) {
    console.error('Error fetching weekly steps:', error);
    return [];
  }

  // Group by day for the chart
  const dailyTotals: Record<string, number> = {};
  data.forEach((log) => {
    const date = new Date(log.recorded_at).toLocaleDateString('en-US', { weekday: 'short' });
    dailyTotals[date] = (dailyTotals[date] || 0) + log.steps;
  });

  // Format for Recharts
  return Object.keys(dailyTotals).map(day => ({
    name: day,
    steps: dailyTotals[day]
  }));
};