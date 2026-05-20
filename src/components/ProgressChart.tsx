import { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import { Calendar, Clock, Flame, Dumbbell, Scale, TrendingUp } from 'lucide-react';

type ProgressChartProps = {
  historyData: any[];
  bodyWeightData: { date: string; weight: number }[];
};

export default function ProgressChart({ historyData, bodyWeightData }: ProgressChartProps) {
  const [activeTab, setActiveTab] = useState<'activity' | 'duration' | 'calories' | 'lifts' | 'weight'>('activity');
  const [selectedLift, setSelectedLift] = useState<string>('Bench Press');

  // Process data for Activity (completed workouts per week or day)
  // Let's group last 7 days of training sessions
  const last7DaysData = () => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const result = days.map(day => ({ name: day, count: 0, duration: 0, calories: 0 }));
    
    historyData.forEach(session => {
      if (session.completed) {
        const dateObj = new Date(session.date);
        const dayName = days[dateObj.getDay()];
        const index = result.findIndex(item => item.name === dayName);
        if (index !== -1) {
          result[index].count += 1;
          result[index].duration += Math.round(session.duration / 60); // mins
          result[index].calories += session.caloriesBurned || 0;
        }
      }
    });

    // Rotate to make today the last element
    const todayIndex = new Date().getDay();
    const rotated = [...result.slice(todayIndex + 1), ...result.slice(0, todayIndex + 1)];
    return rotated;
  };

  const chartData = last7DaysData();

  // Process data for Gym Weight Progression
  const getLiftProgressionData = (exerciseName: string) => {
    const data: { date: string; maxWeight: number }[] = [];
    
    // Sort history chronologically
    const sortedHistory = [...historyData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sortedHistory.forEach((session) => {
      // Find matching exercise in this session
      const exercise = session.exercises?.find((e: any) => e.name.toLowerCase() === exerciseName.toLowerCase());
      if (exercise && exercise.sets && exercise.sets.length > 0) {
        // Find max weight in this session's sets
        const maxWeight = Math.max(...exercise.sets.map((s: any) => s.weight || 0));
        if (maxWeight > 0) {
          const dateStr = new Date(session.date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
          data.push({
            date: dateStr,
            maxWeight: maxWeight
          });
        }
      }
    });

    // Fallback static dummy points if there's not enough data, to show the cool line chart nicely
    if (data.length === 0) {
      return [
        { date: '1 Mei', maxWeight: 40 },
        { date: '5 Mei', maxWeight: 45 },
        { date: '10 Mei', maxWeight: 45 },
        { date: '15 Mei', maxWeight: 50 },
        { date: '20 Mei', maxWeight: 55 }
      ];
    }

    return data;
  };

  const liftData = getLiftProgressionData(selectedLift);

  // Available Gym Exercises with weights in history
  const gymExercisesWithWeights = Array.from(
    new Set(
      historyData
        .flatMap(session => session.exercises || [])
        .filter(ex => ex.sets?.some((s: any) => (s.weight || 0) > 0))
        .map(ex => ex.name)
    )
  );

  const fallbackGymExercises = ['Bench Press', 'Deadlift', 'Leg Press', 'Dumbbell Curl', 'Shoulder Press'];
  const availableLifts = gymExercisesWithWeights.length > 0 ? gymExercisesWithWeights : fallbackGymExercises;

  // Custom tooltips
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl shadow-xl">
          <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">{label}</p>
          <p className="text-sm font-extrabold text-brand-500">
            {payload[0].name === 'count' && `${payload[0].value} Latihan Selesai`}
            {payload[0].name === 'duration' && `${payload[0].value} Menit Latihan`}
            {payload[0].name === 'calories' && `${payload[0].value} kkal Terbakar`}
            {payload[0].name === 'maxWeight' && `${payload[0].value} kg (Beban Maks)`}
            {payload[0].name === 'weight' && `${payload[0].value} kg (Berat Badan)`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800/80 rounded-3xl p-5 shadow-xl shadow-zinc-150/5 dark:shadow-none">
      
      {/* Tabs headers */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6 border-b border-zinc-100 dark:border-zinc-800/60 pb-4">
        <div>
          <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-brand-500" /> Analisis Progres Workout
          </h3>
          <p className="text-xs text-zinc-400 font-medium">Lacak peningkatan performa, konsistensi, dan tubuh Anda</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200/40 dark:border-zinc-800/40">
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
              activeTab === 'activity'
                ? 'bg-white dark:bg-zinc-800 text-brand-500 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" /> Konsistensi
          </button>
          <button
            onClick={() => setActiveTab('duration')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
              activeTab === 'duration'
                ? 'bg-white dark:bg-zinc-800 text-brand-500 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Clock className="h-3.5 w-3.5" /> Durasi
          </button>
          <button
            onClick={() => setActiveTab('calories')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
              activeTab === 'calories'
                ? 'bg-white dark:bg-zinc-800 text-brand-500 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Flame className="h-3.5 w-3.5" /> Kalori
          </button>
          <button
            onClick={() => setActiveTab('lifts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
              activeTab === 'lifts'
                ? 'bg-white dark:bg-zinc-800 text-brand-500 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Dumbbell className="h-3.5 w-3.5" /> Beban Gym
          </button>
          <button
            onClick={() => setActiveTab('weight')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
              activeTab === 'weight'
                ? 'bg-white dark:bg-zinc-800 text-brand-500 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Scale className="h-3.5 w-3.5" /> Berat Badan
          </button>
        </div>
      </div>

      {/* Lift Selector if Active Tab is lifts */}
      {activeTab === 'lifts' && (
        <div className="flex items-center gap-2 mb-4 bg-zinc-50 dark:bg-zinc-900/40 p-2.5 rounded-2xl border border-zinc-150 dark:border-zinc-800/40 w-fit">
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Pilih Gerakan:</span>
          <select
            value={selectedLift}
            onChange={(e) => setSelectedLift(e.target.value)}
            className="text-xs font-bold text-brand-500 bg-transparent border-none py-0.5 px-2 focus:ring-0 focus:border-transparent select-none cursor-pointer outline-none"
          >
            {availableLifts.map((lift) => (
              <option key={lift} value={lift} className="dark:bg-zinc-950 dark:text-white">
                {lift}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Chart container */}
      <div className="h-72 w-full mt-2 select-none">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'activity' ? (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ea580c" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-800/50" />
              <XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#a1a1aa', fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="count" fill="url(#colorCount)" radius={[8, 8, 0, 0]} />
            </BarChart>
          ) : activeTab === 'duration' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-800/50" />
              <XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#a1a1aa', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="duration" name="duration" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorDuration)" />
            </AreaChart>
          ) : activeTab === 'calories' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-800/50" />
              <XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#a1a1aa', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="calories" name="calories" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCalories)" />
            </AreaChart>
          ) : activeTab === 'lifts' ? (
            <LineChart data={liftData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-800/50" />
              <XAxis dataKey="date" tick={{ fill: '#a1a1aa', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#a1a1aa', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="maxWeight" name="maxWeight" stroke="#f97316" strokeWidth={3.5} dot={{ r: 5, strokeWidth: 2, stroke: '#f97316', fill: '#fff' }} activeDot={{ r: 7 }} />
            </LineChart>
          ) : (
            <AreaChart data={bodyWeightData.length > 0 ? bodyWeightData.map(d => ({ ...d, date: new Date(d.date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }) })) : [
              { date: '1 Mei', weight: 70 },
              { date: '5 Mei', weight: 69.5 },
              { date: '10 Mei', weight: 69.2 },
              { date: '15 Mei', weight: 68.8 },
              { date: '20 Mei', weight: 68.5 }
            ]} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-800/50" />
              <XAxis dataKey="date" tick={{ fill: '#a1a1aa', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis domain={['auto', 'auto']} tick={{ fill: '#a1a1aa', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="weight" name="weight" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
