import { supabase } from './client';

export interface DailyStats {
  steps: number;
  calories: number;
  weight?: number;
  hasPeriod: boolean;
}

export const getMonthlyHistory = async (userId: string, year: number, month: number): Promise<Record<string, DailyStats>> => {
  // JavaScript months are 0-indexed (0 = Jan, 11 = Dec)
  const startDate = new Date(year, month, 1).toISOString();
  const endDate = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

  const stats: Record<string, DailyStats> = {};

  const [stepsRes, mealsRes, weightRes, periodRes] = await Promise.all([
    supabase.from('step_logs').select('steps, recorded_at').eq('user_id', userId).gte('recorded_at', startDate).lte('recorded_at', endDate),
    supabase.from('meals').select('estimated_calories, recorded_at').eq('user_id', userId).gte('recorded_at', startDate).lte('recorded_at', endDate),
    supabase.from('weight_logs').select('weight, recorded_at').eq('user_id', userId).gte('recorded_at', startDate).lte('recorded_at', endDate),
    supabase.from('period_logs').select('start_date').eq('user_id', userId).gte('start_date', startDate).lte('start_date', endDate)
  ]);

  const toDateStr = (iso: string) => iso.split('T')[0];
  const initDay = (d: string) => {
    if (!stats[d]) stats[d] = { steps: 0, calories: 0, hasPeriod: false };
  };

  stepsRes.data?.forEach(row => {
    const d = toDateStr(row.recorded_at);
    initDay(d);
    stats[d].steps += row.steps;
  });

  mealsRes.data?.forEach(row => {
    const d = toDateStr(row.recorded_at);
    initDay(d);
    stats[d].calories += row.estimated_calories;
  });

  weightRes.data?.forEach(row => {
    const d = toDateStr(row.recorded_at);
    initDay(d);
    stats[d].weight = row.weight; // Keeps the latest logged weight for that day
  });

  periodRes.data?.forEach(row => {
    const d = toDateStr(row.start_date);
    initDay(d);
    stats[d].hasPeriod = true;
  });

  return stats;
};