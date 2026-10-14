import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';
import { getMonthlyHistory, type DailyStats } from '../../lib/supabase/historyService';

// --- Cute Animated Ring Component ---
const ActivityRing = ({ steps = 0, calories = 0, hasPeriod = false, isSelected = false }) => {
  const stepGoal = 8000;
  const calGoal = 2000; // Adjust this based on your app's logic

  // Circle math for SVG dashes
  const r1 = 16;
  const r2 = 11;
  const circ1 = 2 * Math.PI * r1;
  const circ2 = 2 * Math.PI * r2;
  
  const stepPercent = Math.min(steps / stepGoal, 1);
  const calPercent = Math.min(calories / calGoal, 1);

  return (
    <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-purple-50 ring-4 ring-purple-100' : ''}`}>
      <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 44 44">
        {/* Steps Background & Foreground */}
        <circle cx="22" cy="22" r={r1} stroke="#f3f4f6" strokeWidth="3.5" fill="none" />
        <circle cx="22" cy="22" r={r1} stroke="#3b82f6" strokeWidth="3.5" fill="none"
          strokeDasharray={circ1} strokeDashoffset={circ1 - stepPercent * circ1}
          strokeLinecap="round" className="transition-all duration-1000 ease-out delay-100" />
        
        {/* Calories Background & Foreground */}
        <circle cx="22" cy="22" r={r2} stroke="#f3f4f6" strokeWidth="3.5" fill="none" />
        <circle cx="22" cy="22" r={r2} stroke="#f97316" strokeWidth="3.5" fill="none"
          strokeDasharray={circ2} strokeDashoffset={circ2 - calPercent * circ2}
          strokeLinecap="round" className="transition-all duration-1000 ease-out delay-300" />
      </svg>
      
      {/* Center Icon */}
      <span className={`relative z-10 text-[10px] ${hasPeriod ? 'animate-pulse' : 'animate-bounce-short'}`}>
        {hasPeriod ? '🩸' : (steps > 0 || calories > 0) ? '💖' : '🤍'}
      </span>
    </div>
  );
};

export const HistoryCalendar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [history, setHistory] = useState<Record<string, DailyStats>>({});
  const [loading, setLoading] = useState(true);
  
  // State for the expanded details panel
  const todayStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);

  // Touch state for swipe gestures
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

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

  // Swipe Handlers
  const minSwipeDistance = 40;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) nextMonth();
    else if (distance < -minSwipeDistance) prevMonth();
  };

  // Calendar Math
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  // Selected Day Data
  const selectedStats = history[selectedDateStr];
  const selectedDateObj = new Date(selectedDateStr);
  const formattedSelectedDate = selectedDateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 bg-white shadow-sm border-b border-gray-100">
        <button onClick={() => navigate('/')} className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900">← Back</button>
        <h1 className="text-xl font-bold text-gray-900">Activity History</h1>
        <div className="w-12"></div>
      </header>

      <main className="max-w-md p-4 mx-auto mt-2" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEndHandler}>
        
        {/* Month Navigation */}
        <div className="flex items-center justify-between p-4 mb-4 bg-white shadow-sm rounded-3xl">
          <button onClick={prevMonth} className="px-4 py-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 active:scale-95 transition-all">◀</button>
          <h2 className="font-bold text-gray-800">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={nextMonth} className="px-4 py-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 active:scale-95 transition-all">▶</button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-500 animate-pulse">Loading calendar...</div>
        ) : (
          <>
            {/* Clean, Borderless Calendar Grid */}
            <div className="p-5 bg-white shadow-sm rounded-3xl mb-6">
              <div className="grid grid-cols-7 gap-y-4 gap-x-1 mb-4 text-xs font-bold text-center text-gray-400">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i}>{d}</div>)}
              </div>
              
              <div className="grid grid-cols-7 gap-y-4 gap-x-1">
                {padding.map(p => <div key={`pad-${p}`} className="h-14" />)}
                
                {days.map(day => {
                  const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const stats = history[dateStr];
                  const isSelected = dateStr === selectedDateStr;

                  return (
                    <div 
                      key={day} 
                      onClick={() => setSelectedDateStr(dateStr)}
                      className="flex flex-col items-center justify-center cursor-pointer transform transition-transform active:scale-90"
                    >
                      <ActivityRing 
                        steps={stats?.steps || 0} 
                        calories={stats?.calories || 0} 
                        hasPeriod={stats?.hasPeriod || false} 
                        isSelected={isSelected}
                      />
                      <span className={`mt-1 text-[11px] font-bold ${isSelected ? 'text-purple-600' : 'text-gray-500'}`}>
                        {day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Samsung Health Style Expansion Panel */}
            <div className="p-6 bg-white shadow-lg rounded-3xl border border-gray-100 transition-all duration-300 animate-fade-in-up">
              <h3 className="text-lg font-bold text-gray-900 mb-5">{formattedSelectedDate}</h3>
              
              {selectedStats ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">👟</span>
                      <span className="font-semibold text-blue-900">Steps</span>
                    </div>
                    <span className="font-bold text-blue-700">{selectedStats.steps.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🍱</span>
                      <span className="font-semibold text-orange-900">Calories</span>
                    </div>
                    <span className="font-bold text-orange-700">{selectedStats.calories.toLocaleString()} kcal</span>
                  </div>

                  {selectedStats.weight && (
                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">⚖️</span>
                        <span className="font-semibold text-purple-900">Weight</span>
                      </div>
                      <span className="font-bold text-purple-700">{selectedStats.weight} kg</span>
                    </div>
                  )}

                  {selectedStats.hasPeriod && (
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🩸</span>
                        <span className="font-semibold text-red-900">Cycle</span>
                      </div>
                      <span className="font-bold text-red-700">Period Logged</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <span className="text-3xl mb-2 block">🤍</span>
                  <p className="text-sm font-medium text-gray-500">No activity logged for this day.</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
      
      {/* Quick CSS for the pop-in animation on the details card */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}