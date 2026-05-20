import { Home, Dumbbell, Calendar, History, BarChart2, Settings } from 'lucide-react';


type BottomNavigationProps = {
  currentView: string;
  setView: (view: string) => void;
};

export default function BottomNavigation({ currentView, setView }: BottomNavigationProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'workouts', label: 'Latihan', icon: Dumbbell },
    { id: 'plans', label: 'Rencana', icon: Calendar },
    { id: 'history', label: 'Riwayat', icon: History },
    { id: 'progress', label: 'Statistik', icon: BarChart2 },
    { id: 'settings', label: 'Setelan', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bottom-nav-glass border-t border-zinc-200/50 dark:border-zinc-800/60 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.04)] dark:shadow-none">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id || currentView.startsWith(item.id + '/');

          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className="flex flex-col items-center justify-center flex-1 h-full py-1.5 transition-all duration-300 relative group"
            >
              {/* Highlight Dot for Active State */}
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-brand-500 rounded-b-full shadow-lg shadow-brand-500/50 animate-pulse" />
              )}
              
              <Icon 
                className={`h-5.5 w-5.5 transition-transform duration-300 group-active:scale-75 ${
                  isActive 
                    ? 'text-brand-500 scale-110 stroke-[2.5px]' 
                    : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-350'
                }`} 
              />
              <span className={`text-[9px] mt-1 font-extrabold tracking-wide transition-colors ${
                isActive 
                  ? 'text-brand-500 font-black' 
                  : 'text-zinc-400 dark:text-zinc-500'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
