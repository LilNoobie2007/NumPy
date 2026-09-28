import { useState } from 'react';
import { useAuth } from '../../app/providers/AuthProvider';
import { logPeriod } from '../../lib/supabase/periodService';

export const PeriodTracker = () => {
  const { user } = useAuth();
  const [step, setStep] = useState<'ask' | 'flow' | 'done'>('ask');

  const handleLog = async (flow: string) => {
    if (!user) return;
    try {
      await logPeriod(user.id, flow);
      setStep('done');
    } catch (error) {
      console.error(error);
      alert('Failed to log period.');
    }
  };

  return (
    <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">🩸 Cycle</h2>
      
      {step === 'ask' && (
        <div>
          <p className="mb-3 text-sm text-gray-600">Are you on your period today?</p>
          <div className="flex gap-2">
            <button 
              onClick={() => setStep('flow')} 
              className="flex-1 py-2 text-sm font-medium text-red-600 transition-colors bg-red-50 rounded-xl hover:bg-red-100"
            >
              Yes
            </button>
            <button 
              onClick={() => setStep('done')} 
              className="flex-1 py-2 text-sm font-medium text-gray-600 transition-colors bg-gray-50 rounded-xl hover:bg-gray-100"
            >
              No
            </button>
          </div>
        </div>
      )}

      {step === 'flow' && (
        <div>
          <p className="mb-3 text-sm text-gray-600">How is your flow?</p>
          <div className="flex gap-2">
            {['Light', 'Medium', 'Heavy'].map(flow => (
              <button 
                key={flow} 
                onClick={() => handleLog(flow)} 
                className="flex-1 py-2 text-sm font-medium text-red-600 transition-colors bg-red-50 rounded-xl hover:bg-red-100 active:scale-95"
              >
                {flow}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'done' && (
        <div className="py-2 text-center bg-gray-50 rounded-xl">
          <p className="text-sm font-medium text-gray-600">Logged for today! 🌸</p>
        </div>
      )}
    </div>
  );
};