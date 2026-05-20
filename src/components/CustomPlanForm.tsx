import { useState } from 'react';
import { workouts as availableWorkouts } from '../data/workouts';
import { Plus, Trash2, Dumbbell, Home, Calendar, Check } from 'lucide-react';


type CustomPlanFormProps = {
  onSave: (plan: {
    id: string;
    name: string;
    category: 'home' | 'gym';
    days: string[];
    exercises: {
      id: number;
      name: string;
      sets: number;
      reps: number;
      rest: number;
      duration: string;
    }[];
  }) => void;
  onCancel: () => void;
};

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export default function CustomPlanForm({ onSave, onCancel }: CustomPlanFormProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'home' | 'gym'>('home');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<{
    id: number;
    name: string;
    sets: number;
    reps: number;
    rest: number;
    duration: string;
  }[]>([]);

  const [currentExerciseId, setCurrentExerciseId] = useState<string>('');
  const [setCount, setSetCount] = useState(3);
  const [repCount, setRepCount] = useState(12);
  const [restDuration, setRestDuration] = useState(60);

  // Filter available exercises based on category
  const exercisesForCategory = availableWorkouts.filter(w => w.category === category);

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleAddExercise = () => {
    if (!currentExerciseId) return;
    const selected = availableWorkouts.find(w => w.id === parseInt(currentExerciseId));
    if (!selected) return;

    // Check if already added
    if (selectedExercises.some(e => e.id === selected.id)) {
      alert("Gerakan ini sudah ditambahkan ke dalam daftar latihan!");
      return;
    }

    setSelectedExercises(prev => [
      ...prev,
      {
        id: selected.id,
        name: selected.name,
        sets: setCount,
        reps: repCount,
        rest: restDuration,
        duration: `${setCount * 3} menit`
      }
    ]);

    // Reset exercise form
    setCurrentExerciseId('');
  };

  const handleRemoveExercise = (id: number) => {
    setSelectedExercises(prev => prev.filter(e => e.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Masukkan nama program latihan terlebih dahulu!");
      return;
    }
    if (selectedDays.length === 0) {
      alert("Pilih minimal satu hari latihan untuk program ini!");
      return;
    }
    if (selectedExercises.length === 0) {
      alert("Tambahkan minimal satu gerakan ke dalam program latihan!");
      return;
    }

    onSave({
      id: Date.now().toString(),
      name,
      category,
      days: selectedDays,
      exercises: selectedExercises
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-6 rounded-3xl shadow-lg max-w-2xl mx-auto">
      
      {/* Title */}
      <div>
        <h3 className="text-xl font-black text-zinc-800 dark:text-white">Buat Custom Workout Plan</h3>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold">Rancang jadwal latihan pribadi Anda sendiri sesuai keinginan.</p>
      </div>

      {/* Program Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-450 uppercase tracking-widest">Nama Program Latihan</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contoh: Pembakar Lemak Pagi, Otot Dada Kekar..."
          className="form-input text-sm font-semibold"
          required
        />
      </div>

      {/* Kategori Utama */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-450 uppercase tracking-widest">Tempat / Kategori</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setCategory('home');
              setSelectedExercises([]); // clear incompatible ones
            }}
            className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-sm font-bold transition-all duration-300 ${
              category === 'home'
                ? 'bg-brand-500 text-white border-brand-500 shadow-md shadow-brand-500/10'
                : 'bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'
            }`}
          >
            <Home className="h-4.5 w-4.5" /> Workout Rumah
          </button>

          <button
            type="button"
            onClick={() => {
              setCategory('gym');
              setSelectedExercises([]); // clear incompatible ones
            }}
            className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-sm font-bold transition-all duration-300 ${
              category === 'gym'
                ? 'bg-brand-500 text-white border-brand-500 shadow-md shadow-brand-500/10'
                : 'bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'
            }`}
          >
            <Dumbbell className="h-4.5 w-4.5" /> Workout Gym
          </button>
        </div>
      </div>

      {/* Pilih Hari Latihan */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-450 uppercase tracking-widest flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5 text-brand-500" /> Pilih Hari Latihan
        </label>
        <div className="flex flex-wrap gap-1.5">
          {DAYS.map((day) => {
            const isSelected = selectedDays.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ${
                  isSelected
                    ? 'bg-brand-100 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 border border-brand-200 dark:border-brand-900/60 font-black'
                    : 'bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-zinc-500 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-800/60'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tambah Latihan Section */}
      <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-4 space-y-4">
        <h4 className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Pilih & Atur Gerakan</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-150 dark:border-zinc-800/40">
          {/* Dropdown Gerakan */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Pilih Gerakan</label>
            <select
              value={currentExerciseId}
              onChange={(e) => setCurrentExerciseId(e.target.value)}
              className="text-sm font-semibold p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-brand-500 outline-none"
            >
              <option value="">-- Pilih Latihan --</option>
              {exercisesForCategory.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name} ({ex.muscle})
                </option>
              ))}
            </select>
          </div>

          {/* Sets, Reps, Rest */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Set</label>
            <input
              type="number"
              min="1"
              max="10"
              value={setCount}
              onChange={(e) => setSetCount(parseInt(e.target.value) || 1)}
              className="text-xs font-bold p-2 rounded-lg"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Reps</label>
            <input
              type="number"
              min="1"
              max="50"
              value={repCount}
              onChange={(e) => setRepCount(parseInt(e.target.value) || 1)}
              className="text-xs font-bold p-2 rounded-lg"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Istirahat (detik)</label>
            <input
              type="number"
              min="10"
              step="5"
              value={restDuration}
              onChange={(e) => setRestDuration(parseInt(e.target.value) || 10)}
              className="text-xs font-bold p-2 rounded-lg"
            />
          </div>

          {/* Add exercise Button */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleAddExercise}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 bg-brand-500 hover:bg-brand-600 shadow-brand-500/10"
            >
              <Plus className="h-4 w-4" /> Tambah Gerakan
            </button>
          </div>
        </div>

        {/* Selected exercises list */}
        {selectedExercises.length > 0 && (
          <div className="space-y-2 mt-4">
            <h5 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Gerakan Terpilih ({selectedExercises.length})</h5>
            
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {selectedExercises.map((ex, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl transition-all"
                >
                  <div>
                    <h6 className="text-xs font-extrabold text-zinc-700 dark:text-zinc-200">{ex.name}</h6>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                      {ex.sets} Set × {ex.reps} Reps • Istirahat {ex.rest}s
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveExercise(ex.id)}
                    className="p-1.5 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-all active:scale-90"
                    title="Hapus Latihan"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800/80 pt-5">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-650 dark:text-zinc-350 font-bold text-sm transition-all"
        >
          Batal
        </button>
        <button
          type="submit"
          className="flex items-center gap-1.5 px-6 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-lg shadow-brand-500/10 hover:shadow-brand-500/25 transition-all"
        >
          <Check className="h-4 w-4" /> Simpan Program
        </button>
      </div>

    </form>
  );
}
