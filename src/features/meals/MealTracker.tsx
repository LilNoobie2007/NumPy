import { useState, useEffect } from 'react';
import { useAuth } from '../../app/providers/AuthProvider';
import { getTodayMeals, logMeal, type Meal } from '../../lib/supabase/mealService';

export const MealTracker = () => {
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [mealType, setMealType] = useState('Snack');
  const [foodItem, setFoodItem] = useState('');
  const [calories, setCalories] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) loadMeals();
  }, [user]);

  const loadMeals = async () => {
    if (!user) return;
    const todayMeals = await getTodayMeals(user.id);
    setMeals(todayMeals);
    setLoading(false);
  };

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !foodItem || !calories) return;
    
    setIsSubmitting(true);
    const calValue = parseInt(calories, 10);
    
    try {
      const newMeal = await logMeal(user.id, {
        meal_type: mealType,
        food_item: foodItem,
        estimated_calories: isNaN(calValue) ? 0 : calValue,
      });
      setMeals([...meals, newMeal]);
      setFoodItem('');
      setCalories('');
    } catch (error) {
      console.error("Failed to log meal", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-4 text-center text-gray-500 animate-pulse">Loading meals...</div>;

  const totalCalories = meals.reduce((sum, meal) => sum + meal.estimated_calories, 0);

  return (
    <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">🍱 Meals</h2>
        <span className="text-sm font-medium text-gray-500">
          {totalCalories.toLocaleString()} kcal total
        </span>
      </div>

      {meals.length > 0 && (
        <div className="mb-4 space-y-2">
          {meals.map((meal) => (
            <div key={meal.id} className="flex justify-between px-3 py-2 text-sm bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">
                <span className="mr-2 text-gray-400">{meal.meal_type}</span> 
                {meal.food_item}
              </span>
              <span className="text-orange-600">{meal.estimated_calories} kcal</span>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleAddMeal} className="pt-2 border-t border-gray-100 space-y-3">
        <select 
          value={mealType} 
          onChange={(e) => setMealType(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Other'].map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={foodItem}
            onChange={(e) => setFoodItem(e.target.value)}
            placeholder="What did you eat?"
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <input
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            placeholder="kcal"
            className="w-20 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 text-sm font-semibold text-orange-700 transition-colors bg-orange-50 rounded-lg hover:bg-orange-100 active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? 'Logging...' : '+ Log Meal'}
        </button>
      </form>
    </div>
  );
};