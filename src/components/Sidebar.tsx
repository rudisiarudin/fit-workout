import { Home, Dumbbell, Calendar, History, BarChart2, Settings, Flame, Trophy } from 'lucide-react';
import ThemeToggle from './ThemeToggle';


type SidebarProps = {
  currentView: string;
  setView: (view: string) => void;
  streak: number;
  xp: number;
};

export default function Sidebar({ currentView, setView, streak, xp }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard Utama', desc: 'Ringkasan aktivitas hari ini', icon: Home },
    { id: 'workouts', label: 'Daftar Latihan', desc: 'Workout Rumah & Gym', icon: Dumbbell },
    { id: 'plans', label: 'Jadwal Pribadi', desc: 'Rancang rencana latihan', icon: Calendar },
    { id: 'history', label: 'Riwayat Latihan', desc: 'Log latihan sebelumnya', icon: History },
    { id: 'progress', label: 'Statistik Progres', desc: 'Grafik & berat badan', icon: BarChart2 },
    { id: 'settings', label: 'Pengaturan', desc: 'PWA, Tema & Pengingat', icon: Settings },
  ];

  const level = Math.floor(xp / 500) + 1;
  const currentXPInLevel = xp % 500;
  const levelProgressPercent = (currentXPInLevel / 500) * 100;

  return (
    <aside className="hidden md:flex flex-col w-72 h-screen fixed left-0 top-0 border-r border-zinc-200/50 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 px-5 py-6 z-40 select-none">
      
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 mb-8 cursor-pointer group" onClick={() => setView('dashboard')}>
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300">
          <Flame className="h-6 w-6 fill-current animate-pulse" />
        </div>
        <div>
          <h1 className="text-lg font-black tracking-tight text-zinc-800 dark:text-white leading-none">
            FitTrack
          </h1>
          <span className="text-[10px] font-bold text-brand-500 tracking-widest uppercase">Home & Gym</span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id || currentView.startsWith(item.id + '/');

          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-left border transition-all duration-300 active:scale-[0.98] ${
                isActive
                  ? 'bg-gradient-to-r from-brand-500 to-orange-500 text-white border-brand-500 shadow-md shadow-brand-500/10'
                  : 'bg-transparent border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'stroke-[2.5px]' : 'text-zinc-400 dark:text-zinc-500'}`} />
              <div className="leading-tight">
                <span className="text-xs font-black block tracking-wide">{item.label}</span>
                <span className={`text-[10px] block mt-0.5 font-medium ${isActive ? 'text-orange-100/90' : 'text-zinc-400'}`}>
                  {item.desc}
                </span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer Profile & Theme Controller */}
      <div className="mt-auto border-t border-zinc-100 dark:border-zinc-800/80 pt-4 space-y-3.5">
        
        {/* Daily Streak Card */}
        <div className="bg-gradient-to-br from-brand-500/5 to-orange-500/5 dark:from-brand-950/20 dark:to-zinc-950/40 border border-brand-100/30 dark:border-brand-900/20 p-3.5 rounded-2xl flex items-center gap-3">
          <div className="p-2 rounded-xl bg-brand-100/60 dark:bg-brand-950 text-brand-500">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h5 className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none">Weekly Target</h5>
            <span className="text-xs font-extrabold text-zinc-700 dark:text-zinc-250 mt-1 block">Workout Streak: {streak} Hari</span>
          </div>
        </div>

        {/* Level progress bar */}
        <div className="px-1 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
            <span>PROGRES LEVEL</span>
            <span>{currentXPInLevel}/500 XP</span>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-850 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-brand-500 to-orange-500 h-full transition-all duration-500" style={{ width: `${levelProgressPercent}%` }} />
          </div>
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between px-1 pt-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-brand-500 text-white font-extrabold text-xs flex items-center justify-center uppercase ring-2 ring-brand-100 dark:ring-zinc-900">
              FT
            </div>
            <div>
              <span className="text-xs font-black text-zinc-700 dark:text-zinc-250 block leading-tight">Fit User</span>
              <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-extrabold block mt-0.5 uppercase tracking-wide">LEVEL {level} ATHLETE</span>
            </div>
          </div>
          <ThemeToggle />
        </div>

      </div>

    </aside>
  );
}


