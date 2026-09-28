import { supabase } from './client';

export const getTodayWaterTotal = async (userId: string): Promise<number> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('water_logs')
    .select('amount')
    .eq('user_id', userId)
    .gte('recorded_at', today.toISOString());

  if (error) {
    console.error('Error fetching water logs:', error);
    return 0;
  }

  return data.reduce((total, log) => total + log.amount, 0);
};

export const logWater = async (userId: string, amount: number): Promise<void> => {
  const { error } = await supabase
    .from('water_logs')
    .insert([{ user_id: userId, amount }]);

  if (error) throw error;
};