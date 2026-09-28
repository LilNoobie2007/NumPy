import { supabase } from './client';

export const logWeight = async (userId: string, weight: number, unit: string) => {
  const { error } = await supabase.from('weight_logs').insert([{ user_id: userId, weight, unit }]);
  if (error) throw error;
};

export const logSleep = async (userId: string, start: string, end: string, quality: string) => {
  const { error } = await supabase.from('sleep_logs').insert([{ user_id: userId, start_time: start, end_time: end, quality }]);
  if (error) throw error;
};

export const logExercise = async (userId: string, activity: string, duration: number) => {
  const { error } = await supabase.from('exercise_logs').insert([{ user_id: userId, activity_type: activity, duration_minutes: duration, intensity: 'Moderate' }]);
  if (error) throw error;
};

export const logMood = async (userId: string, mood: string) => {
  const { error } = await supabase.from('mood_logs').insert([{ user_id: userId, mood_level: mood }]);
  if (error) throw error;
};