import { supabase } from './client';

export const getTodaySteps = async (userId: string): Promise<number> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('step_logs')
    .select('steps')
    .eq('user_id', userId)
    .gte('recorded_at', today.toISOString());

  if (error) {
    console.error('Error fetching steps:', error);
    return 0;
  }

  return data.reduce((total, log) => total + log.steps, 0);
};

export const logSteps = async (userId: string, steps: number): Promise<void> => {
  const { error } = await supabase
    .from('step_logs')
    .insert([{ user_id: userId, steps }]);

  if (error) throw error;
};