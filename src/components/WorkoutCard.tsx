import { type Workout } from '../data/workouts';
import { Dumbbell, Home, Play, ArrowRight } from 'lucide-react';

type WorkoutCardProps = {
  workout: Workout;
  onSelect: (id: number) => void;
  onStart: (workout: Workout) => void;
};


export default function WorkoutCard({ workout, onSelect, onStart }: WorkoutCardProps) {
  const isGym = workout.category === 'gym';

  return (
    <div className="group relative flex flex-col justify-between p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 shadow-md hover:shadow-xl dark:shadow-none transition-all duration-300 hover:scale-[1.02] overflow-hidden">
      
      {/* Decorative top corner accent */}
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity ${
        isGym ? 'bg-indigo-500' : 'bg-brand-500'
      }`} />

      <div>
        {/* Category Badge & Muscle */}
        <div className="flex items-center justify-between mb-3 relative z-10">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
            isGym 
              ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40' 
              : 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-brand-900/40'
          }`}>
            {isGym ? <Dumbbell className="h-3 w-3" /> : <Home className="h-3 w-3" />}
            {isGym ? 'Gym' : 'Rumah'}
          </span>
          <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500">
            {workout.muscle.split(',')[0]}
          </span>
        </div>

        {/* Workout Name */}
        <h4 className="text-lg font-extrabold text-zinc-800 dark:text-white group-hover:text-brand-500 transition-colors mb-2">
          {workout.name}
        </h4>

        {/* Target Muscles */}
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 line-clamp-1">
          Melatih: {workout.muscle}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800/40 text-center mb-5">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase">Sets</span>
            <span className="text-sm font-extrabold text-zinc-700 dark:text-zinc-200">{workout.sets}x</span>
          </div>
          <div className="flex flex-col items-center border-x border-zinc-150 dark:border-zinc-800/60">
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase">Reps</span>
            <span className="text-sm font-extrabold text-zinc-700 dark:text-zinc-200">
              {workout.reps === 1 ? 'Hold' : `${workout.reps}`}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase">Durasi</span>
            <span className="text-xs font-black text-brand-500 mt-0.5">{workout.duration}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 mt-auto">
        <button
          onClick={() => onSelect(workout.id)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-750 transition-all duration-300"
        >
          Detail <ArrowRight className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onStart(workout)}
          className="p-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/10 hover:shadow-brand-500/25 transition-all duration-300 active:scale-95 flex items-center justify-center"
          title="Mulai Latihan"
        >
          <Play className="h-4 w-4 fill-current" />
        </button>
      </div>
    </div>
  );
}
