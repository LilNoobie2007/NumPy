import { supabase } from './client';

export const logPeriod = async (userId: string, flow: string) => {
  const today = new Date().toISOString().split('T')[0];
  const { error } = await supabase
    .from('period_logs')
    .insert([{ user_id: userId, start_date: today, flow_intensity: flow }]);
    
  if (error) throw error;
};