import { useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Dumbbell, Activity } from 'lucide-react';


type WorkoutAnimationProps = {
  src: string;
  workoutName: string;
};

export default function WorkoutAnimation({ src, workoutName }: WorkoutAnimationProps) {
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if URL is placeholder
  const isPlaceholder = !src || src.startsWith('URL_LOTTIE') || src.includes('packages/lf20');

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl bg-white dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800/80 shadow-xl shadow-zinc-150/10 dark:shadow-none p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
      
      {/* Visual background element */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 dark:bg-brand-500/10 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-500/5 dark:bg-accent-500/10 rounded-full blur-3xl" />

      {isPlaceholder || hasError ? (
        <div className="flex flex-col items-center justify-center p-6 text-center animate-pulse-slow">
          <div className="w-24 h-24 rounded-full bg-brand-100 dark:bg-brand-950/50 flex items-center justify-center mb-4 text-brand-500 border border-brand-200 dark:border-brand-900/50">
            <Dumbbell className="h-12 w-12 animate-bounce" />
          </div>
          <h4 className="text-xl font-black text-zinc-800 dark:text-zinc-200 mb-1">{workoutName}</h4>
          <span className="text-xs text-brand-500 dark:text-brand-400 font-semibold tracking-wider uppercase mb-3 flex items-center gap-1.5 justify-center">
            <Activity className="h-3.5 w-3.5" /> Animasi Latihan Aktif
          </span>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
            {hasError ? "Koneksi offline. Menampilkan representasi statis gerakan." : "Lakukan gerakan sesuai dengan panduan instruksi di bawah ini secara perlahan dan terkontrol."}
          </p>
          
          {/* A gorgeous visual SVG representation for offline/loading fallback */}
          <div className="mt-6 w-full max-w-[240px] aspect-video rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-center overflow-hidden">
            <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand-500">
              <circle cx="50" cy="25" r="8" fill="currentColor" opacity="0.8" />
              <path d="M50 33V60M50 38L30 50M50 38L70 50M50 60L40 85M50 60L60 85" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      ) : (
        <div className="w-full relative min-h-[350px] flex items-center justify-center">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-zinc-900 z-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500"></div>
              <p className="text-xs text-zinc-400 mt-3 font-medium">Memuat animasi gerakan...</p>
            </div>
          )}
          <DotLottieReact
            src={src}
            loop
            autoplay
            style={{ width: '100%', height: '100%', maxWidth: '380px' }}
            dotLottieRefCallback={(dotLottie) => {
              if (dotLottie) {
                dotLottie.addEventListener('load', () => {
                  setLoading(false);
                });
                dotLottie.addEventListener('loadError', () => {
                  setHasError(true);
                  setLoading(false);
                });
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
