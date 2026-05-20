import { useEffect, useState } from 'react';
import { FastForward, Plus, Volume2, VolumeX, Flame } from 'lucide-react';


type RestTimerProps = {
  duration: number; // in seconds
  onComplete: () => void;
};

export default function RestTimer({ duration, onComplete }: RestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (soundEnabled) {
        playBeep();
      }
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete, soundEnabled]);

  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.4); // play for 400ms
    } catch (e) {
      console.warn("Audio context not allowed or failed to initialize", e);
    }
  };

  const handleAdd15 = () => {
    setTimeLeft((prev) => prev + 15);
  };

  const percent = (timeLeft / duration) * 100;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-brand-500/10 to-orange-500/5 dark:from-brand-950/20 dark:to-zinc-950 border border-brand-200/40 dark:border-brand-900/30 rounded-3xl shadow-xl shadow-brand-500/5 relative overflow-hidden text-center max-w-sm mx-auto">
      
      {/* Visual top bar icon */}
      <div className="absolute top-3 right-3 flex gap-2">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-1.5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 dark:text-zinc-500 transition-all active:scale-90"
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>
      </div>

      <span className="text-xs font-bold text-brand-600 dark:text-brand-400 tracking-widest uppercase mb-3 flex items-center gap-1">
        <Flame className="h-3.5 w-3.5 fill-current animate-pulse text-brand-500" /> WAKTU ISTIRAHAT
      </span>

      {/* Circle countdown visualizer */}
      <div className="relative w-36 h-36 flex items-center justify-center mb-5">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="72"
            cy="72"
            r="60"
            className="stroke-zinc-200 dark:stroke-zinc-800"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="72"
            cy="72"
            r="60"
            className="stroke-brand-500 transition-all duration-1000 ease-linear"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={376.8}
            strokeDashoffset={376.8 - (376.8 * percent) / 100}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold text-zinc-800 dark:text-white font-mono leading-none">
            {timeLeft}
          </span>
          <span className="text-[10px] text-zinc-400 font-semibold mt-1">detik lagi</span>
        </div>
      </div>

      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-5 max-w-[240px]">
        Atur napas Anda, minum sedikit air, dan bersiaplah untuk set berikutnya!
      </p>

      {/* Buttons */}
      <div className="flex items-center gap-3 w-full">
        <button
          onClick={handleAdd15}
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-800/60 text-zinc-700 dark:text-zinc-300 font-bold text-sm transition-all duration-300 active:scale-95"
        >
          <Plus className="h-4 w-4" /> +15s
        </button>

        <button
          onClick={onComplete}
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-lg shadow-brand-500/15 transition-all duration-300 active:scale-95"
        >
          Lewati <FastForward className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
