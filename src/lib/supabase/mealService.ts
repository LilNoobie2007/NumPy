import { supabase } from './client';

export interface Meal {
  id?: string;
  meal_type: string;
  food_item: string;
  estimated_calories: number;
}

export const getTodayMeals = async (userId: string): Promise<Meal[]> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('meals')
    .select('id, meal_type, food_item, estimated_calories')
    .eq('user_id', userId)
    .gte('recorded_at', today.toISOString())
    .order('recorded_at', { ascending: true });

  if (error) {
    console.error('Error fetching meals:', error);
    return [];
  }

  return data || [];
};

export const logMeal = async (userId: string, meal: Omit<Meal, 'id'>): Promise<Meal> => {
  const { data, error } = await supabase
    .from('meals')
    .insert([{ user_id: userId, ...meal }])
    .select()
    .single();

  if (error) throw error;
  return data;
};