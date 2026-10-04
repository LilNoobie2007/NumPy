import { useState } from 'react';
import { useAuth } from '../../app/providers/AuthProvider';
import { logMeal } from '../../lib/supabase/mealService';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export const MealTracker = () => {
  const { user } = useAuth();
  const [foodItem, setFoodItem] = useState('');
  const [calories, setCalories] = useState('');
  const [mealType, setMealType] = useState('Snack');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !calories || !foodItem.trim()) return;
    
    setIsSubmitting(true);
    try {
      await logMeal(user.id, {
        meal_type: mealType,
        food_item: foodItem.trim(),
        estimated_calories: parseInt(calories)
      });
        
      setFoodItem('');
      setCalories('');
      alert('Meal logged successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to log meal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">🍱 Meals</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Pill Selection */}
        <div className="flex flex-wrap gap-2">
          {MEAL_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setMealType(type)}
              className={`flex-1 min-w-[75px] py-2 text-sm font-medium rounded-xl transition-colors ${
                mealType === type
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={foodItem}
            onChange={(e) => setFoodItem(e.target.value)}
            placeholder="Name of dish (e.g. Oatmeal)"
            className="w-full px-4 py-3 text-sm font-medium text-gray-700 transition-colors border shadow-sm bg-gray-50 border-gray-100 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <div className="flex gap-2">
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="Calories"
              className="w-full px-4 py-3 text-sm font-medium text-gray-700 transition-colors border shadow-sm bg-gray-50 border-gray-100 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
              min="1"
            />
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6 py-3 font-semibold text-white transition-colors bg-orange-500 shadow-sm rounded-xl hover:bg-orange-600 active:scale-95 disabled:opacity-50"
            >
              Log
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};