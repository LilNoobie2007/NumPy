import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../app/providers/AuthProvider';
import { getWeeklySteps } from '../../lib/supabase/statsService';

export const WeeklyStepsChart = () => {
  const { user } = useAuth();
  const [data, setData] = useState<{ name: string; steps: number }[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        const weeklyData = await getWeeklySteps(user.id);
        setData(weeklyData);
      }
    };
    loadData();
  }, [user]);

  if (data.length === 0) return null;

  return (
    <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">📊 7-Day Step Trend</h2>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#6B7280' }} 
            />
            <Tooltip 
              cursor={{ fill: '#F3F4F6' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar 
             dataKey="steps" 
             fill="#22C55E" 
             radius={[4, 4, 0, 0]} 
             maxBarSize={40} 
             />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};