import { useState } from 'react';
import { Calendar, Clock, Dumbbell, Home, ChevronDown, ChevronUp, CheckCircle, AlertCircle, FileText } from 'lucide-react';


type WorkoutHistoryCardProps = {
  session: {
    id: string;
    date: string;
    workoutName: string;
    category: 'home' | 'gym';
    duration: number; // in seconds
    caloriesBurned: number;
    completed: boolean;
    notes?: string;
    exercises: {
      name: string;
      sets: {
        setNumber: number;
        reps: number;
        weight?: number;
        completed: boolean;
      }[];
    }[];
  };
};

export default function WorkoutHistoryCard({ session }: WorkoutHistoryCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isGym = session.category === 'gym';

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden transition-all duration-300">
      
      {/* Header section */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-5 flex items-center justify-between cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors"
      >
        <div className="flex items-start gap-3">
          <div className={`p-3 rounded-2xl ${
            isGym ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500' : 'bg-brand-50 dark:bg-brand-950/30 text-brand-500'
          }`}>
            {isGym ? <Dumbbell className="h-6 w-6" /> : <Home className="h-6 w-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-base font-extrabold text-zinc-800 dark:text-white">
                {session.workoutName}
              </h4>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                session.completed
                  ? 'bg-accent-50 dark:bg-accent-950/30 text-accent-600 dark:text-accent-400 border border-accent-100 dark:border-accent-900/30'
                  : 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30'
              }`}>
                {session.completed ? (
                  <>
                    <CheckCircle className="h-3 w-3 fill-current" /> Selesai
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3" /> Belum Selesai
                  </>
                )}
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500 mt-1 font-semibold flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> {formatDate(session.date)}
              </span>
              <span className="flex items-center gap-1 border-l border-zinc-200 dark:border-zinc-800 pl-3">
                <Clock className="h-3.5 w-3.5" /> {formatDuration(session.duration)}
              </span>
              {session.caloriesBurned > 0 && (
                <span className="flex items-center gap-1 border-l border-zinc-200 dark:border-zinc-800 pl-3 text-brand-500 font-bold">
                  🔥 {session.caloriesBurned} kkal
                </span>
              )}
            </div>
          </div>
        </div>

        <button className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>

      {/* Details section */}
      {isOpen && (
        <div className="px-5 pb-5 pt-1 border-t border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-950/20">
          
          {/* Exercises sets list */}
          <div className="space-y-4 mt-3">
            <h5 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Daftar Set Latihan</h5>
            
            {session.exercises.map((ex, exIdx) => (
              <div key={exIdx} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-150 dark:border-zinc-800/80">
                <h6 className="text-sm font-extrabold text-zinc-800 dark:text-zinc-100 flex items-center gap-1.5 mb-2">
                  <span className="w-1.5 h-3 bg-brand-500 rounded-full inline-block"></span>
                  {ex.name}
                </h6>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {ex.sets.map((set, setIdx) => (
                    <div 
                      key={setIdx} 
                      className={`p-2 rounded-xl border flex flex-col justify-between ${
                        set.completed
                          ? 'bg-accent-50/30 dark:bg-accent-950/10 border-accent-100 dark:border-accent-900/30 text-zinc-700 dark:text-zinc-300'
                          : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-400'
                      }`}
                    >
                      <span className="font-bold text-zinc-400 dark:text-zinc-500">Set {set.setNumber}</span>
                      <div className="flex items-baseline justify-between mt-1 font-extrabold">
                        <span>{set.reps} Reps</span>
                        {set.weight !== undefined && set.weight > 0 && (
                          <span className="text-brand-500 text-[10px]">{set.weight} kg</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Notes details */}
          {session.notes && (
            <div className="mt-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 flex gap-2.5 items-start">
              <FileText className="h-4.5 w-4.5 text-zinc-400 dark:text-zinc-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Catatan Pribadi</span>
                <p className="text-xs text-zinc-650 dark:text-zinc-355 font-medium mt-0.5">{session.notes}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
