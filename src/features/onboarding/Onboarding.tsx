import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';
import { supabase } from '../../lib/supabase/client';

export const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !displayName.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          display_name: displayName.trim(),
          setup_completed: true 
        })
        .eq('id', user.id);

      if (error) throw error;
      
      // Force reload to update any app state, then go to dashboard
      window.location.href = '/';
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to save profile. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-sm rounded-3xl">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
            <span className="text-2xl">👋</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to NumPy</h1>
          <p className="mt-2 text-sm text-gray-500">Let's get your profile set up so your companions know it's you.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="How should we call you?"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={2}
              maxLength={30}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 font-semibold text-white transition-colors bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Complete Setup'}
          </button>
        </form>
      </div>
    </div>
  );
};