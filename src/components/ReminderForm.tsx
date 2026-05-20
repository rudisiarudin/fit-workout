import { useEffect, useState } from 'react';
import { Bell, BellOff, Check, GlassWater, Apple, Dumbbell } from 'lucide-react';


type Reminder = {
  id: string;
  type: 'workout' | 'water' | 'meal';
  days: string[];
  time: string;
  enabled: boolean;
};

type ReminderFormProps = {
  onSave: (reminders: Reminder[]) => void;
  initialReminders?: Reminder[];
};

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export default function ReminderForm({ onSave, initialReminders = [] }: ReminderFormProps) {
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    if (initialReminders.length > 0) return initialReminders;
    const saved = localStorage.getItem('fittrack_reminders');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', type: 'workout', days: ['Senin', 'Rabu', 'Jumat'], time: '08:00', enabled: true },
      { id: '2', type: 'water', days: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'], time: '12:00', enabled: false },
      { id: '3', type: 'meal', days: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'], time: '07:30', enabled: false }
    ];
  });

  const [notificationPermission, setNotificationPermission] = useState<string>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert("Browser Anda tidak mendukung notifikasi push web.");
      return;
    }
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    if (permission === 'granted') {
      new Notification("FitTrack Aktif!", {
        body: "Anda akan mendapatkan pemberitahuan jadwal latihan tepat waktu.",
        icon: "/favicon.svg"
      });
    }
  };

  const handleToggle = (id: string) => {
    setReminders(prev =>
      prev.map(r => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleTimeChange = (id: string, time: string) => {
    setReminders(prev =>
      prev.map(r => (r.id === id ? { ...r, time } : r))
    );
  };

  const handleToggleDay = (id: string, day: string) => {
    setReminders(prev =>
      prev.map(r => {
        if (r.id !== id) return r;
        const days = r.days.includes(day)
          ? r.days.filter(d => d !== day)
          : [...r.days, day];
        return { ...r, days };
      })
    );
  };

  const handleSave = () => {
    localStorage.setItem('fittrack_reminders', JSON.stringify(reminders));
    onSave(reminders);
    alert("Jadwal pengingat berhasil disimpan!");
  };

  return (
    <div className="space-y-6 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-6 rounded-3xl shadow-lg max-w-xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-850 pb-4">
        <div>
          <h3 className="text-lg font-black text-zinc-800 dark:text-white flex items-center gap-2">
            <Bell className="h-5 w-5 text-brand-500 animate-swing" /> Pengingat & Notifikasi PWA
          </h3>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold mt-0.5">Jangan lewatkan waktu latihan dan hidrasi penting Anda.</p>
        </div>
      </div>

      {/* Browser notification permission banner */}
      <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/80 flex items-start gap-3">
        {notificationPermission === 'granted' ? (
          <div className="p-2 rounded-xl bg-accent-50 dark:bg-accent-950/20 text-accent-500 shrink-0">
            <Bell className="h-5 w-5" />
          </div>
        ) : (
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 shrink-0">
            <BellOff className="h-5 w-5" />
          </div>
        )}
        <div className="flex-1">
          <h4 className="text-sm font-bold text-zinc-700 dark:text-zinc-200">
            {notificationPermission === 'granted' 
              ? 'Pemberitahuan PWA Aktif' 
              : 'Aktifkan Notifikasi di Perangkat Anda'}
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            {notificationPermission === 'granted'
              ? 'Anda akan menerima pengingat instan langsung di desktop dan layar kunci HP Anda.'
              : 'FitTrack membutuhkan izin browser untuk memunculkan notifikasi jadwal harian.'}
          </p>
          {notificationPermission !== 'granted' && (
            <button
              onClick={requestNotificationPermission}
              className="mt-3 px-4 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              Izinkan Notifikasi
            </button>
          )}
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-4">
        {reminders.map((reminder) => {
          const isWorkout = reminder.type === 'workout';
          const isWater = reminder.type === 'water';

          return (
            <div 
              key={reminder.id}
              className={`p-4 rounded-2xl border transition-all ${
                reminder.enabled
                  ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm'
                  : 'bg-zinc-50/50 dark:bg-zinc-950/30 border-zinc-150 dark:border-zinc-850 opacity-70'
              }`}
            >
              {/* Type toggle */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${
                    reminder.enabled
                      ? isWorkout 
                        ? 'bg-brand-50 dark:bg-brand-950/20 text-brand-500'
                        : isWater
                          ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-500'
                          : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                  }`}>
                    {isWorkout && <Dumbbell className="h-4 w-4" />}
                    {isWater && <GlassWater className="h-4 w-4" />}
                    {reminder.type === 'meal' && <Apple className="h-4 w-4" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-zinc-700 dark:text-zinc-250">
                      {isWorkout && 'Pengingat Workout'}
                      {isWater && 'Pengingat Minum Air'}
                      {reminder.type === 'meal' && 'Pengingat Makan'}
                    </h4>
                    <span className="text-[10px] text-zinc-400 font-semibold">
                      {reminder.enabled ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                </div>

                {/* Switch button */}
                <button
                  onClick={() => handleToggle(reminder.id)}
                  className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-all duration-300 ${
                    reminder.enabled ? 'bg-brand-500 justify-end' : 'bg-zinc-300 dark:bg-zinc-800 justify-start'
                  }`}
                  type="button"
                >
                  <span className="w-5 h-5 rounded-full bg-white shadow-md block" />
                </button>
              </div>

              {/* Time and days setup - only if enabled */}
              {reminder.enabled && (
                <div className="space-y-3 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 animate-fadeIn">
                  
                  {/* Select Time */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Pilih Jam Pengingat</span>
                    <input
                      type="time"
                      value={reminder.time}
                      onChange={(e) => handleTimeChange(reminder.id, e.target.value)}
                      className="text-sm font-bold bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-xl text-brand-500 cursor-pointer outline-none"
                    />
                  </div>

                  {/* Choose Days */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Pilih Hari Aktif</span>
                    <div className="flex flex-wrap gap-1">
                      {DAYS.map((day) => {
                        const hasDay = reminder.days.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleToggleDay(reminder.id, day)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                              hasDay
                                ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900'
                                : 'bg-zinc-50 dark:bg-zinc-950 text-zinc-400 dark:text-zinc-500 border border-zinc-200/40 dark:border-zinc-800/40'
                            }`}
                          >
                            {day.substring(0, 3)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-lg shadow-brand-500/10 hover:shadow-brand-500/25 transition-all duration-300 active:scale-[0.98]"
        type="button"
      >
        <Check className="h-4.5 w-4.5" /> Simpan Semua Pengingat
      </button>

    </div>
  );
}
