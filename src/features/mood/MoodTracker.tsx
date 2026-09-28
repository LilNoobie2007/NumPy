import { useAuth } from '../../app/providers/AuthProvider';
import { logMood } from '../../lib/supabase/trackingServices';

export const MoodTracker = () => {
  const { user } = useAuth();
  const moods = ['Very Good', 'Good', 'Neutral', 'Low', 'Very Low'];
  const emojis = ['🥰', '🙂', '😐', '😔', '😴'];

  const handleMood = async (mood: string) => {
    if (!user) return;
    try {
      await logMood(user.id, mood);
      alert(`Mood logged: ${mood}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">✨ Mood</h2>
      <div className="flex justify-between gap-2">
        {moods.map((mood, i) => (
          <button 
            key={mood} 
            onClick={() => handleMood(mood)} 
            className="flex-1 py-3 text-2xl transition-colors border border-gray-100 rounded-xl hover:bg-gray-50 active:scale-95" 
            title={mood}
          >
            {emojis[i]}
          </button>
        ))}
      </div>
    </div>
  );
};