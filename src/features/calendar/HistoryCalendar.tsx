import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';
import { getMonthlyHistory, type DailyStats } from '../../lib/supabase/historyService';

export const HistoryCalendar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [history, setHistory] = useState<Record<string, DailyStats>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMonth = async () => {
      if (!user) return;
      setLoading(true);
      const data = await getMonthlyHistory(user.id, currentDate.getFullYear(), currentDate.getMonth());
      setHistory(data);
      setLoading(false);
    };
    loadMonth();
  }, [user, currentDate]);

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  // Calendar Math
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 bg-white shadow-sm">
        <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-900">← Back</button>
        <h1 className="text-xl font-bold text-gray-900">Activity History</h1>
        <div className="w-12"></div> {/* Spacer for centering */}
      </header>

      <main className="max-w-md p-4 mx-auto mt-4 space-y-4">
        <div className="flex items-center justify-between p-4 bg-white shadow-sm rounded-2xl">
          <button onClick={prevMonth} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">◀</button>
          <h2 className="font-bold text-gray-800">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={nextMonth} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">▶</button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-500 animate-pulse">Loading calendar...</div>
        ) : (
          <div className="p-4 bg-white shadow-sm rounded-2xl">
            <div className="grid grid-cols-7 gap-1 mb-2 text-xs font-semibold text-center text-gray-400">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {padding.map(p => <div key={`pad-${p}`} className="h-20 bg-gray-50 rounded-xl" />)}
              
              {days.map(day => {
                const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const stats = history[dateStr];
                const isPeriod = stats?.hasPeriod;

                return (
                  <div 
                    key={day} 
                    className={`h-24 p-1 border overflow-hidden rounded-xl flex flex-col items-center ${isPeriod ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-white'}`}
                  >
                    <span className={`text-xs font-bold mb-1 ${isPeriod ? 'text-red-700' : 'text-gray-700'}`}>
                      {day}
                    </span>
                    
                    {stats && (
                      <div className="w-full space-y-0.5 text-[9px] font-medium leading-tight text-gray-600">
                        {stats.steps > 0 && <div className="truncate">👟 {stats.steps >= 1000 ? (stats.steps/1000).toFixed(1)+'k' : stats.steps}</div>}
                        {stats.calories > 0 && <div className="truncate text-orange-600">🍱 {stats.calories}</div>}
                        {stats.weight && <div className="truncate text-purple-600">⚖️ {stats.weight}</div>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};