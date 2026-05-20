import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';


export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-700 dark:text-zinc-300 transition-all duration-300 active:scale-95"
      aria-label="Toggle theme"
      id="theme-toggle-btn"
    >
      {darkMode ? (
        <Sun className="h-5.5 w-5.5 text-amber-500 animate-spin-slow" />
      ) : (
        <Moon className="h-5.5 w-5.5 text-indigo-600" />
      )}
    </button>
  );
}
