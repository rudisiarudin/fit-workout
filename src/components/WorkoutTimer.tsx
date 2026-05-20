import { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';

type WorkoutTimerProps = {
  isActive: boolean;
  onTimeChange?: (seconds: number) => void;
  initialSeconds?: number;
};

export default function WorkoutTimer({ isActive, onTimeChange, initialSeconds = 0 }: WorkoutTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isPaused, setIsPaused] = useState(!isActive);

  useEffect(() => {
    setIsPaused(!isActive);
  }, [isActive]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;


    if (!isPaused) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          const next = prev + 1;
          if (onTimeChange) onTimeChange(next);
          return next;
        });
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPaused, onTimeChange]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return [
      hrs > 0 ? String(hrs).padStart(2, '0') : null,
      String(mins).padStart(2, '0'),
      String(secs).padStart(2, '0'),
    ].filter(Boolean).join(':');
  };

  const handleReset = () => {
    setSeconds(0);
    if (onTimeChange) onTimeChange(0);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-900/40 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/60 shadow-inner">
      <div className="flex items-center gap-2 mb-2 text-zinc-500 dark:text-zinc-400 text-sm font-semibold tracking-wider uppercase">
        <Timer className="h-4 w-4 text-brand-500 animate-pulse" /> Durasi Latihan
      </div>

      <div className="text-4xl md:text-5xl font-black tracking-tight font-mono text-zinc-800 dark:text-white drop-shadow-sm select-none my-1">
        {formatTime(seconds)}
      </div>

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm shadow-md transition-all duration-300 active:scale-95 ${
            isPaused
              ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-brand-500/20'
              : 'bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200'
          }`}
        >
          {isPaused ? (
            <>
              <Play className="h-4 w-4 fill-current" /> Mulai
            </>
          ) : (
            <>
              <Pause className="h-4 w-4 fill-current" /> Jeda
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          className="p-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-500 dark:text-zinc-400 transition-all duration-300 active:scale-90"
          title="Reset Timer"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
