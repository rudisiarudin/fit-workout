import { useState, useEffect } from 'react';
import { workouts, type Workout } from './data/workouts';
import Sidebar from './components/Sidebar';
import BottomNavigation from './components/BottomNavigation';
import WorkoutCard from './components/WorkoutCard';
import WorkoutAnimation from './components/WorkoutAnimation';
import WorkoutTimer from './components/WorkoutTimer';
import RestTimer from './components/RestTimer';
import ProgressChart from './components/ProgressChart';
import WorkoutHistoryCard from './components/WorkoutHistoryCard';
import CustomPlanForm from './components/CustomPlanForm';
import ReminderForm from './components/ReminderForm';

import {
  Flame,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Play,
  Sparkles,
  ChevronRight,
  Scale,
  PlusCircle,
  Award,
  GlassWater,
  Activity,
  Undo2,
  Home,
  Dumbbell,
  Shield,
  Crown,
  Trophy
} from 'lucide-react';


interface SetRecord {
  setNumber: number;
  reps: number;
  weight?: number;
  completed: boolean;
}

interface ExerciseRecord {
  name: string;
  sets: SetRecord[];
}

interface ActiveWorkout {
  workout: Workout;
  secondsElapsed: number;
  notes: string;
  exercises: ExerciseRecord[];
}

interface HistorySession {
  id: string;
  date: string;
  workoutName: string;
  category: 'home' | 'gym';
  duration: number; // in seconds
  caloriesBurned: number;
  completed: boolean;
  notes?: string;
  exercises: ExerciseRecord[];
}

interface CustomPlan {
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
}

interface Badge {
  id: string;
  name: string;
  desc: string;
  icon: string;
  color: string;
}

const BADGES: Badge[] = [
  { id: 'first_workout', name: 'Iron Starter', desc: 'Menyelesaikan workout pertama Anda', icon: 'Award', color: 'from-amber-400 to-orange-500' },
  { id: 'streak_3', name: 'Konsistensi Perunggu', desc: 'Melatih tubuh 3 hari berturut-turut', icon: 'Flame', color: 'from-orange-450 to-red-550' },
  { id: 'streak_10', name: 'Pejuang 10 Hari', desc: 'Rutinitas olahraga 10 hari berturut-turut', icon: 'Trophy', color: 'from-indigo-400 to-purple-600' },
  { id: 'streak_30', name: 'Juara Sebulan', desc: 'Melatih tubuh 30 hari berturut-turut', icon: 'Shield', color: 'from-teal-400 to-emerald-600' },
  { id: 'streak_100', name: 'Legenda FitTrack', desc: 'Melatih tubuh 100 hari berturut-turut!', icon: 'Crown', color: 'from-yellow-400 to-amber-600' },
  { id: 'home_master', name: 'Calisthenics Master', desc: 'Menyelesaikan workout Rumah pertama', icon: 'Home', color: 'from-blue-450 to-indigo-550' },
  { id: 'gym_master', name: 'Monster Gym', desc: 'Menyelesaikan angkatan Gym pertama', icon: 'Dumbbell', color: 'from-red-500 to-zinc-800' },
  { id: 'hydration_hero', name: 'H2O Elite', desc: 'Minum 2000ml air dalam satu hari', icon: 'GlassWater', color: 'from-cyan-400 to-blue-500' }
];

interface BodyWeightRecord {
  date: string;
  weight: number;
}

export default function App() {
  const [currentView, setView] = useState<string>('dashboard');
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(null);

  // States with localStorage persistence
  const [historyData, setHistoryData] = useState<HistorySession[]>([]);
  const [plansData, setPlansData] = useState<CustomPlan[]>([]);
  const [bodyWeightData, setBodyWeightData] = useState<BodyWeightRecord[]>([]);
  const [waterIntake, setWaterIntake] = useState<number>(0); // ml today

  // Leveling and Achievement states
  const [xp, setXp] = useState<number>(350);
  const [streak, setStreak] = useState<number>(4);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(['first_workout', 'streak_3']);

  // Active workout states
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkout | null>(null);
  const [showRestTimer, setShowRestTimer] = useState<boolean>(false);
  const [currentRestDuration, setCurrentRestDuration] = useState<number>(60);

  // Custom weight tracking inputs
  const [weightInput, setWeightInput] = useState<string>('');
  const [showPlanForm, setShowPlanForm] = useState<boolean>(false);

  // Load initial/persistent data
  useEffect(() => {
    // 1. History loading & fallback mockup
    const savedHistory = localStorage.getItem('fittrack_history');
    if (savedHistory) {
      setHistoryData(JSON.parse(savedHistory));
    } else {
      // Mock history to make dashboard & graphs stunning immediately
      const mockHistory: HistorySession[] = [
        {
          id: 'mock1',
          date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
          workoutName: 'Push Up',
          category: 'home',
          duration: 620,
          caloriesBurned: 155,
          completed: true,
          notes: 'Terasa lelah di set terakhir tapi berhasil menyelesaikannya.',
          exercises: [
            {
              name: 'Push Up',
              sets: [
                { setNumber: 1, reps: 12, completed: true },
                { setNumber: 2, reps: 12, completed: true },
                { setNumber: 3, reps: 10, completed: true }
              ]
            }
          ]
        },
        {
          id: 'mock2',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          workoutName: 'Bench Press',
          category: 'gym',
          duration: 940,
          caloriesBurned: 235,
          completed: true,
          notes: 'Menambahkan beban 5kg di set ke-3. Mantap!',
          exercises: [
            {
              name: 'Bench Press',
              sets: [
                { setNumber: 1, reps: 10, weight: 40, completed: true },
                { setNumber: 2, reps: 10, weight: 45, completed: true },
                { setNumber: 3, reps: 8, weight: 45, completed: true },
                { setNumber: 4, reps: 8, weight: 50, completed: true }
              ]
            }
          ]
        },
        {
          id: 'mock3',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          workoutName: 'Squat',
          category: 'home',
          duration: 720,
          caloriesBurned: 180,
          completed: true,
          exercises: [
            {
              name: 'Squat',
              sets: [
                { setNumber: 1, reps: 15, completed: true },
                { setNumber: 2, reps: 15, completed: true },
                { setNumber: 3, reps: 15, completed: true },
                { setNumber: 4, reps: 12, completed: true }
              ]
            }
          ]
        },
        {
          id: 'mock4',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Yesterday
          workoutName: 'Deadlift',
          category: 'gym',
          duration: 1100,
          caloriesBurned: 275,
          completed: true,
          notes: 'Fokus pada form punggung bawah.',
          exercises: [
            {
              name: 'Deadlift',
              sets: [
                { setNumber: 1, reps: 8, weight: 60, completed: true },
                { setNumber: 2, reps: 8, weight: 65, completed: true },
                { setNumber: 3, reps: 8, weight: 70, completed: true },
                { setNumber: 4, reps: 6, weight: 80, completed: true }
              ]
            }
          ]
        }
      ];
      setHistoryData(mockHistory);
      localStorage.setItem('fittrack_history', JSON.stringify(mockHistory));
    }

    // 2. Custom plans
    const savedPlans = localStorage.getItem('fittrack_plans');
    if (savedPlans) {
      setPlansData(JSON.parse(savedPlans));
    } else {
      const defaultPlan: CustomPlan = {
        id: 'plan_default_1',
        name: 'Rencana Pemula Rumah',
        category: 'home',
        days: ['Senin', 'Kamis'],
        exercises: [
          { id: 1, name: 'Push Up', sets: 3, reps: 10, rest: 60, duration: '9 menit' },
          { id: 2, name: 'Squat', sets: 3, reps: 12, rest: 60, duration: '9 menit' }
        ]
      };
      setPlansData([defaultPlan]);
      localStorage.setItem('fittrack_plans', JSON.stringify([defaultPlan]));
    }

    // 3. Body weight loading
    const savedWeight = localStorage.getItem('fittrack_bodyweight');
    if (savedWeight) {
      setBodyWeightData(JSON.parse(savedWeight));
    } else {
      const mockWeight: BodyWeightRecord[] = [
        { date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), weight: 72.5 },
        { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), weight: 72.1 },
        { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), weight: 71.8 },
        { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), weight: 71.4 },
        { date: new Date().toISOString(), weight: 71.0 }
      ];
      setBodyWeightData(mockWeight);
      localStorage.setItem('fittrack_bodyweight', JSON.stringify(mockWeight));
    }

    // 4. Water intake
    const savedWater = localStorage.getItem('fittrack_today_water');
    const waterDate = localStorage.getItem('fittrack_water_date');
    const todayStr = new Date().toDateString();

    if (waterDate === todayStr && savedWater) {
      setWaterIntake(parseInt(savedWater));
    } else {
      setWaterIntake(0);
      localStorage.setItem('fittrack_today_water', '0');
      localStorage.setItem('fittrack_water_date', todayStr);
    }

    // 5. XP, Streak, and Badges loading
    const savedXp = localStorage.getItem('fittrack_xp');
    if (savedXp) {
      setXp(parseInt(savedXp));
    } else {
      localStorage.setItem('fittrack_xp', '350');
    }

    const savedStreak = localStorage.getItem('fittrack_streak');
    if (savedStreak) {
      setStreak(parseInt(savedStreak));
    } else {
      localStorage.setItem('fittrack_streak', '4');
    }

    const savedBadges = localStorage.getItem('fittrack_badges');
    if (savedBadges) {
      setUnlockedBadges(JSON.parse(savedBadges));
    } else {
      localStorage.setItem('fittrack_badges', JSON.stringify(['first_workout', 'streak_3']));
    }

    // Apply dark class on load if relevant
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    }
  }, []);

  // Save history helper
  const saveHistoryToStorage = (newHistory: HistorySession[]) => {
    setHistoryData(newHistory);
    localStorage.setItem('fittrack_history', JSON.stringify(newHistory));
  };

  // check and award badges helper
  const checkAndAwardBadges = (_currentXp: number, currentStreak: number, activeCat?: 'home' | 'gym', hasHydratedGoal?: boolean) => {
    // Start with current state from localstorage or hook
    const savedBadges = localStorage.getItem('fittrack_badges');
    const badges: string[] = savedBadges ? JSON.parse(savedBadges) : [...unlockedBadges];
    let awardedNew = false;

    const award = (id: string) => {
      if (!badges.includes(id)) {
        badges.push(id);
        awardedNew = true;
      }
    };

    // 1. first_workout
    award('first_workout');

    // 2. streak milestones
    if (currentStreak >= 3) award('streak_3');
    if (currentStreak >= 10) award('streak_10');
    if (currentStreak >= 30) award('streak_30');
    if (currentStreak >= 100) award('streak_100');

    // 3. Category mastery
    if (activeCat === 'home') award('home_master');
    if (activeCat === 'gym') award('gym_master');

    // 4. Hydration milestone
    if (hasHydratedGoal) award('hydration_hero');

    if (awardedNew) {
      setUnlockedBadges(badges);
      localStorage.setItem('fittrack_badges', JSON.stringify(badges));
      
      const newBadges = badges.filter(b => !unlockedBadges.includes(b));
      if (newBadges.length > 0) {
        const badgeNames = newBadges.map(id => BADGES.find(b => b.id === id)?.name || id).join(', ');
        alert(`🏆 SELAMAT! Anda telah membuka lencana baru: ${badgeNames}! Buka Dashboard Utama untuk melihat.`);
      }
    }
  };

  // Select recommend card on Dashboard
  const getDailyRecommendation = () => {
    const today = new Date().getDay();
    // Deterministic selection based on day
    return workouts[today % workouts.length];
  };

  const recommendedWorkout = getDailyRecommendation();

  // Navigation handlers
  const navigateToWorkoutDetail = (id: number) => {
    setSelectedWorkoutId(id);
    setView('workout-detail');
  };

  // active workout initiation
  const startWorkoutTracking = (workout: Workout) => {
    const exercises: ExerciseRecord[] = [
      {
        name: workout.name,
        sets: Array.from({ length: workout.sets }, (_, i) => ({
          setNumber: i + 1,
          reps: workout.reps,
          weight: workout.category === 'gym' ? 20 : undefined, // default bar weight mockup
          completed: false
        }))
      }
    ];

    setActiveWorkout({
      workout,
      secondsElapsed: 0,
      notes: '',
      exercises
    });

    setCurrentRestDuration(workout.rest);
    setView('tracker');
  };

  // Launch a custom plan in tracker
  const startCustomPlanTracking = (plan: CustomPlan) => {
    // Generate exercises records
    const exercises: ExerciseRecord[] = plan.exercises.map((e) => ({
      name: e.name,
      sets: Array.from({ length: e.sets }, (_, i) => ({
        setNumber: i + 1,
        reps: e.reps,
        weight: plan.category === 'gym' ? 20 : undefined,
        completed: false
      }))
    }));

    // Wrap the first exercise to start tracking
    const workoutWrapper: Workout = {
      id: plan.exercises[0].id,
      name: plan.name,
      category: plan.category,
      muscle: plan.exercises.map(ex => ex.name).join(', '),
      sets: plan.exercises.reduce((acc, curr) => acc + curr.sets, 0),
      reps: plan.exercises[0].reps,
      rest: plan.exercises[0].rest,
      duration: plan.exercises.length * 5 + ' menit',
      lottieUrl: 'https://lottie.host/8e76dc61-a664-47ea-b4a2-45f10a503e4c/p8oT97mtK8.lottie',
      tutorial: `Program latihan kustom pribadi dengan ${plan.exercises.length} gerakan.`,
      tips: ['Ikuti instruksi masing-masing gerakan', 'Jaga hidrasi Anda tetap optimal'],
      commonErrors: ['Jangan terburu-buru melakukan gerakan']
    };

    setActiveWorkout({
      workout: workoutWrapper,
      secondsElapsed: 0,
      notes: `Rencana program pribadi: ${plan.name}`,
      exercises
    });

    setCurrentRestDuration(plan.exercises[0].rest);
    setView('tracker');
  };

  // Set checklists toggle
  const toggleSetCompleted = (exIndex: number, setIndex: number) => {
    if (!activeWorkout) return;

    const updated = { ...activeWorkout };
    const currentSet = updated.exercises[exIndex].sets[setIndex];
    const newStatus = !currentSet.completed;
    currentSet.completed = newStatus;

    setActiveWorkout(updated);

    // If set is marked completed, trigger rest timer
    if (newStatus) {
      setShowRestTimer(true);

      // Award 10 XP for checking a set!
      const nextXp = xp + 10;
      setXp(nextXp);
      localStorage.setItem('fittrack_xp', String(nextXp));

      // Check for hydration/milestones
      checkAndAwardBadges(nextXp, streak, activeWorkout.workout.category, waterIntake >= 2000);
    }
  };

  // Update reps/weight dynamically during tracking
  const updateSetDetails = (exIndex: number, setIndex: number, field: 'reps' | 'weight', val: number) => {
    if (!activeWorkout) return;
    const updated = { ...activeWorkout };
    if (field === 'reps') {
      updated.exercises[exIndex].sets[setIndex].reps = val;
    } else {
      updated.exercises[exIndex].sets[setIndex].weight = val;
    }
    setActiveWorkout(updated);
  };

  // Finished session
  const finishActiveWorkout = () => {
    if (!activeWorkout) return;

    const totalSeconds = activeWorkout.secondsElapsed;
    // Estimate calories burned: 0.25 calories per second on average
    const calories = Math.round(totalSeconds * 0.25);

    const newSession: HistorySession = {
      id: 'session_' + Date.now(),
      date: new Date().toISOString(),
      workoutName: activeWorkout.workout.name,
      category: activeWorkout.workout.category,
      duration: totalSeconds,
      caloriesBurned: calories,
      completed: true,
      notes: activeWorkout.notes,
      exercises: activeWorkout.exercises
    };

    const updatedHistory = [newSession, ...historyData];
    saveHistoryToStorage(updatedHistory);

    // Award 100 XP for finishing a workout!
    const nextXp = xp + 100;
    setXp(nextXp);
    localStorage.setItem('fittrack_xp', String(nextXp));

    // Calculate Streak
    let nextStreak = streak;
    const lastSession = historyData[0]; // historyData is sorted descending by date!
    const today = new Date();
    const todayStr = today.toDateString();
    
    if (lastSession) {
      const lastDate = new Date(lastSession.date);
      const lastDateStr = lastDate.toDateString();
      
      const oneDayMs = 24 * 60 * 60 * 1000;
      const yesterdayStr = new Date(Date.now() - oneDayMs).toDateString();
      
      if (lastDateStr === yesterdayStr) {
        nextStreak = streak + 1;
      } else if (lastDateStr !== todayStr) {
        nextStreak = 1;
      }
    } else {
      nextStreak = 1;
    }
    
    setStreak(nextStreak);
    localStorage.setItem('fittrack_streak', String(nextStreak));

    // Check and award badges
    checkAndAwardBadges(nextXp, nextStreak, activeWorkout.workout.category, waterIntake >= 2000);

    // Alert
    alert(`Hebat! Anda telah menyelesaikan workout "${activeWorkout.workout.name}" selama ${Math.floor(totalSeconds / 60)} menit. Terbakar sekitar ${calories} kalori! 🎉 +100 XP diperoleh!`);
    
    // Clear and redirect
    setActiveWorkout(null);
    setShowRestTimer(false);
    setView('history');
  };

  // Add water tracker ml
  const handleWaterAdd = (amount: number) => {
    const next = Math.max(0, waterIntake + amount);
    setWaterIntake(next);
    localStorage.setItem('fittrack_today_water', String(next));
    
    // Check if hydration goal met to award hydration_hero badge
    if (next >= 2000) {
      checkAndAwardBadges(xp, streak, undefined, true);
    }
  };

  // Add body weight data point
  const handleAddWeightRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(weightInput);
    if (isNaN(parsed) || parsed <= 20 || parsed > 300) {
      alert("Masukkan berat badan yang valid! (20kg - 300kg)");
      return;
    }

    const newRecord: BodyWeightRecord = {
      date: new Date().toISOString(),
      weight: parsed
    };

    const updated = [...bodyWeightData, newRecord];
    setBodyWeightData(updated);
    localStorage.setItem('fittrack_bodyweight', JSON.stringify(updated));
    setWeightInput('');
    alert("Data berat badan berhasil direkam!");
  };

  // Custom Plan Saving
  const handleSaveCustomPlan = (newPlan: CustomPlan) => {
    const updated = [newPlan, ...plansData];
    setPlansData(updated);
    localStorage.setItem('fittrack_plans', JSON.stringify(updated));
    setShowPlanForm(false);
    alert(`Program "${newPlan.name}" sukses dibuat!`);
  };

  const handleDeletePlan = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus program pribadi ini?")) {
      const updated = plansData.filter(p => p.id !== id);
      setPlansData(updated);
      localStorage.setItem('fittrack_plans', JSON.stringify(updated));
    }
  };

  // Statistics summaries for dashboard
  const getDashboardStats = () => {
    // 1. Total workouts this week (last 7 days)
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const completedThisWeek = historyData.filter(
      (s) => new Date(s.date).getTime() > sevenDaysAgo && s.completed
    );

    // 2. Cumulative training duration (minutes)
    const totalDurationMins = Math.round(
      historyData.reduce((acc, curr) => acc + curr.duration, 0) / 60
    );

    // 3. Cumulative calories
    const totalCalories = historyData.reduce((acc, curr) => acc + (curr.caloriesBurned || 0), 0);

    return {
      workoutsCount: completedThisWeek.length,
      durationMins: totalDurationMins,
      calories: totalCalories
    };
  };

  const stats = getDashboardStats();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex transition-colors duration-300">
      
      {/* 1. Sidebar desktop navigation */}
      <Sidebar currentView={currentView} setView={setView} streak={streak} xp={xp} />

      {/* 2. Main content area wrapper */}
      <main className="flex-1 md:pl-72 pb-24 md:pb-8 max-w-7xl mx-auto w-full px-4 md:px-8 py-6 relative">
        
        {/* Active workout sticky mini-banner */}
        {activeWorkout && currentView !== 'tracker' && (
          <div className="fixed top-4 right-4 z-40 bg-brand-500 text-white rounded-2xl px-4 py-2.5 shadow-lg border border-brand-400 flex items-center gap-3 animate-bounce max-w-[280px]">
            <Activity className="h-5 w-5 fill-current shrink-0 animate-pulse text-white" />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider block opacity-90">Workout Aktif</span>
              <p className="text-xs font-black truncate">{activeWorkout.workout.name}</p>
            </div>
            <button
              onClick={() => setView('tracker')}
              className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[10px] font-black uppercase transition-all"
            >
              Buka
            </button>
          </div>
        )}

        {/* --------------------- VIEWS ROUTER --------------------- */}

        {/* VIEW: DASHBOARD */}
        {currentView === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Header greeting */}
            <div className="flex items-center justify-between flex-wrap gap-4 bg-gradient-to-r from-brand-500/10 to-orange-500/5 dark:from-brand-950/20 dark:to-zinc-900/40 p-6 rounded-3xl border border-brand-200/20 dark:border-brand-900/20">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-brand-600 dark:text-brand-400 flex items-center gap-1.5 mb-1.5">
                  <Sparkles className="h-4 w-4 text-brand-500 animate-spin-slow" /> FitTrack Home & Gym
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-zinc-800 dark:text-white leading-tight">
                  Halo, Atlet Fit! 👋
                </h2>
                <p className="text-sm text-zinc-550 dark:text-zinc-400 mt-1 max-w-md font-semibold">
                  Mari capai target kebugaran Anda hari ini dengan rutinitas teratur dan hidrasi optimal.
                </p>
              </div>

              {/* Water Drink tracker on Dashboard */}
              <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-4 rounded-2xl border border-zinc-150 dark:border-zinc-800 shadow-sm flex flex-col items-center justify-center text-center w-full sm:w-56 shrink-0">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1 mb-1">
                  <GlassWater className="h-4 w-4 text-blue-500 fill-current" /> Target Air Minum
                </span>
                <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">{waterIntake} / 2000 ml</span>
                <div className="w-full bg-zinc-100 dark:bg-zinc-950 h-2 rounded-full mt-2.5 overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (waterIntake / 2000) * 100)}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 mt-3 w-full">
                  <button
                    onClick={() => handleWaterAdd(-250)}
                    className="flex-1 text-[10px] font-black bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-850 p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 transition-all text-zinc-500"
                  >
                    -250ml
                  </button>
                  <button
                    onClick={() => handleWaterAdd(250)}
                    className="flex-1 text-[10px] font-black bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 text-blue-500 p-1.5 rounded-lg border border-blue-200/50 dark:border-blue-900/30 transition-all"
                  >
                    +250ml
                  </button>
                </div>
              </div>
            </div>

            {/* Metrics cards grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Card 1: Completed workouts this week */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 p-5 rounded-3xl flex items-center gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-brand-500/5 dark:bg-brand-500/10 rounded-full blur-xl" />
                <div className="p-3 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-500">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-zinc-800 dark:text-white leading-none">{stats.workoutsCount}</h4>
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-1 block">Workout Minggu Ini</span>
                </div>
              </div>

              {/* Card 2: Total calories */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 p-5 rounded-3xl flex items-center gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-accent-500/5 dark:bg-accent-500/10 rounded-full blur-xl" />
                <div className="p-3 rounded-2xl bg-accent-50 dark:bg-accent-950 text-accent-500">
                  <Flame className="h-6 w-6 fill-current" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-zinc-800 dark:text-white leading-none">{stats.calories}</h4>
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-1 block">Total Kalori (kkal)</span>
                </div>
              </div>

              {/* Card 3: Total Duration */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 p-5 rounded-3xl flex items-center gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-xl" />
                <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-500">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-zinc-800 dark:text-white leading-none">{stats.durationMins}</h4>
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-1 block">Durasi Latihan (menit)</span>
                </div>
              </div>

              {/* Card 4: Streak and target progress */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 p-5 rounded-3xl flex items-center gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-xl" />
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-500">
                  <Award className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-black text-zinc-800 dark:text-white leading-none">
                    {Math.min(100, Math.round((stats.workoutsCount / 5) * 100))}%
                  </h4>
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-1 block">Target 5 Workout/Minggu</span>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-950 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-amber-500 h-full" style={{ width: `${Math.min(100, (stats.workoutsCount / 5) * 100)}%` }} />
                  </div>
                </div>
              </div>

            </div>

            {/* Split layout: recommended workout and quick chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Daily recommended exercise */}
              <div className="bg-gradient-to-br from-white to-zinc-50/50 dark:from-zinc-900 dark:to-zinc-950 border border-zinc-150 dark:border-zinc-800/80 p-6 rounded-3xl shadow-sm flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black uppercase text-brand-500 tracking-wider flex items-center gap-1">
                      <Sparkles className="h-4 w-4" /> Rekomendasi Hari Ini
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
                      Selasa Fit
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-zinc-800 dark:text-white mb-2">{recommendedWorkout.name}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
                    Gerakan penarget {recommendedWorkout.muscle} yang ideal dilakukan hari ini untuk menjaga metabolisme tubuh tetap aktif.
                  </p>

                  <div className="flex items-center gap-4 py-2.5 px-4 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/50 rounded-2xl text-center mb-6">
                    <div className="flex-1 text-center">
                      <span className="text-[9px] text-zinc-400 font-bold uppercase block">Reps</span>
                      <span className="text-sm font-extrabold text-zinc-700 dark:text-zinc-250 block">{recommendedWorkout.reps}x</span>
                    </div>
                    <div className="flex-1 text-center border-l border-zinc-150 dark:border-zinc-800">
                      <span className="text-[9px] text-zinc-400 font-bold uppercase block">Sets</span>
                      <span className="text-sm font-extrabold text-zinc-700 dark:text-zinc-250 block">{recommendedWorkout.sets} Set</span>
                    </div>
                    <div className="flex-1 text-center border-l border-zinc-150 dark:border-zinc-800">
                      <span className="text-[9px] text-zinc-400 font-bold uppercase block">Durasi</span>
                      <span className="text-xs font-black text-brand-500 block mt-0.5">{recommendedWorkout.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateToWorkoutDetail(recommendedWorkout.id)}
                    className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-xs font-bold text-zinc-700 dark:text-zinc-300 transition-all text-center"
                  >
                    Lihat Tutorial
                  </button>
                  <button
                    onClick={() => startWorkoutTracking(recommendedWorkout)}
                    className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/10 hover:shadow-brand-500/25 transition-all text-center"
                  >
                    Mulai Sekarang
                  </button>
                </div>
              </div>

              {/* Right Column: Chart preview */}
              <div className="lg:col-span-2">
                <ProgressChart historyData={historyData} bodyWeightData={bodyWeightData} />
              </div>

            </div>

            {/* Gamification Achievements Grid */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 p-6 rounded-3xl shadow-sm mt-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-black text-zinc-800 dark:text-white flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500 fill-current animate-bounce" /> Piala & Pencapaian Rutinitas
                  </h3>
                  <p className="text-xs text-zinc-400 dark:text-zinc-555 mt-0.5">
                    Dapatkan lencana kehormatan dengan konsisten berolahraga dan mencatatkan kemajuan Anda!
                  </p>
                </div>
                <div className="px-3.5 py-1.5 rounded-full bg-brand-500/5 dark:bg-brand-500/10 border border-brand-100/20 dark:border-brand-900/10 text-xs font-black text-brand-500">
                  Lencana Unlocked: {unlockedBadges.length} / {BADGES.length}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {BADGES.map((badge) => {
                  const isUnlocked = unlockedBadges.includes(badge.id);
                  return (
                    <div
                      key={badge.id}
                      className={`relative overflow-hidden p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center justify-center ${
                        isUnlocked
                          ? 'bg-zinc-50/50 dark:bg-zinc-950/20 border-zinc-200/60 dark:border-zinc-850 shadow-sm scale-100 hover:scale-[1.03]'
                          : 'bg-zinc-50/20 dark:bg-zinc-950/5 border-zinc-200/20 dark:border-zinc-850/30 opacity-60'
                      }`}
                    >
                      {/* Gradient Badge Glow */}
                      {isUnlocked && (
                        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${badge.color}`} />
                      )}

                      {/* Icon container */}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-transform ${
                          isUnlocked
                            ? `bg-gradient-to-br ${badge.color} text-white shadow-md shadow-brand-500/10 scale-100`
                            : 'bg-zinc-200 dark:bg-zinc-850 text-zinc-400'
                        }`}
                      >
                        {badge.id === 'first_workout' && <Award className="h-5 w-5" />}
                        {badge.id === 'streak_3' && <Flame className="h-5 w-5" />}
                        {badge.id === 'streak_10' && <Trophy className="h-5 w-5" />}
                        {badge.id === 'streak_30' && <Shield className="h-5 w-5" />}
                        {badge.id === 'streak_100' && <Crown className="h-5 w-5" />}
                        {badge.id === 'home_master' && <Home className="h-5 w-5" />}
                        {badge.id === 'gym_master' && <Dumbbell className="h-5 w-5" />}
                        {badge.id === 'hydration_hero' && <GlassWater className="h-5 w-5" />}
                      </div>

                      <h4 className={`text-xs font-black tracking-tight ${isUnlocked ? 'text-zinc-850 dark:text-zinc-200' : 'text-zinc-450 dark:text-zinc-600'}`}>
                        {badge.name}
                      </h4>
                      <p className="text-[10px] text-zinc-450 dark:text-zinc-550 leading-tight mt-1 max-w-[120px]">
                        {badge.desc}
                      </p>

                      {/* Locked Lock visual overlay */}
                      {!isUnlocked && (
                        <div className="absolute top-2 right-2 bg-zinc-200 dark:bg-zinc-850 text-zinc-400 dark:text-zinc-500 p-1 rounded-full text-[8px]">
                          🔒
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* VIEW: WORKOUTS LIST */}
        {currentView === 'workouts' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-zinc-800 dark:text-white">Pilih Jenis Mode Workout</h2>
              <p className="text-sm text-zinc-450 dark:text-zinc-500 font-semibold mt-0.5">Mulai latihan di rumah dengan berat tubuh sendiri atau latihan di gym dengan beban.</p>
            </div>

            {/* Navigation links for home / gym workouts selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Home Workout Card Link */}
              <div 
                onClick={() => setView('workouts/home')}
                className="group relative cursor-pointer overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-brand-500 to-orange-600 text-white border border-brand-500/30 shadow-lg shadow-brand-500/10 hover:shadow-brand-500/25 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/10 rounded-full blur-xl group-hover:scale-110 transition-transform" />
                <Home className="h-9 w-9 text-brand-100" />
                <h3 className="text-xl font-black mt-4">Workout di Rumah</h3>
                <p className="text-xs text-brand-100/90 mt-1 max-w-[220px]">
                  Latihan tanpa alat penunjang beban. Squat, push up, plank, dan gerakan kalistenik harian.
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase mt-6 tracking-widest text-white/90 bg-white/20 px-3 py-1 rounded-full">
                  Lihat 8 Gerakan <ChevronRight className="h-3 w-3" />
                </span>
              </div>

              {/* Gym Workout Card Link */}
              <div 
                onClick={() => setView('workouts/gym')}
                className="group relative cursor-pointer overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-indigo-650 to-indigo-800 bg-indigo-600 text-white border border-indigo-500/30 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/10 rounded-full blur-xl group-hover:scale-110 transition-transform" />
                <Dumbbell className="h-9 w-9 text-indigo-100" />
                <h3 className="text-xl font-black mt-4">Workout di Gym</h3>
                <p className="text-xs text-indigo-100/90 mt-1 max-w-[220px]">
                  Maksimalkan otot Anda dengan alat barbel, kabel, treadmill, mesin leg press dan pulldown.
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase mt-6 tracking-widest text-white/90 bg-white/20 px-3 py-1 rounded-full">
                  Lihat 8 Gerakan <ChevronRight className="h-3 w-3" />
                </span>
              </div>

            </div>

            {/* Custom plans on workouts list page */}
            {plansData.length > 0 && (
              <div className="mt-8 pt-4 border-t border-zinc-150 dark:border-zinc-800/80">
                <h3 className="text-base font-black text-zinc-800 dark:text-white mb-4">Program Kustom Pribadi Anda</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {plansData.map((plan) => (
                    <div key={plan.id} className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] font-black uppercase bg-zinc-100 dark:bg-zinc-950 px-2 py-0.5 rounded-md text-zinc-500">
                            {plan.category === 'gym' ? 'Gym' : 'Rumah'}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-bold">{plan.days.join(', ')}</span>
                        </div>
                        <h4 className="text-sm font-extrabold text-zinc-850 dark:text-white">{plan.name}</h4>
                        <p className="text-[11px] text-zinc-400 mt-0.5">{plan.exercises.length} Gerakan kustom</p>
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <button
                          onClick={() => startCustomPlanTracking(plan)}
                          className="flex-1 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-sm transition-all"
                        >
                          Mulai Latihan
                        </button>
                        <button
                          onClick={() => handleDeletePlan(plan.id)}
                          className="px-2 py-1.5 rounded-lg border border-red-200/50 hover:bg-red-50 text-red-500 dark:hover:bg-red-950/20 text-xs font-bold transition-all"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* VIEW: WORKOUTS HOME CATEGORY */}
        {currentView === 'workouts/home' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setView('workouts')}
                className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 dark:text-zinc-500 transition-all"
              >
                <Undo2 className="h-5 w-5" />
              </button>
              <div>
                <h2 className="text-2xl font-black text-zinc-800 dark:text-white">Workout di Rumah</h2>
                <p className="text-sm text-zinc-450 dark:text-zinc-500 font-semibold mt-0.5">Daftar gerakan untuk melatih ketahanan fisik tanpa alat penunjang berat.</p>
              </div>
            </div>

            {/* Grid display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {workouts.filter(w => w.category === 'home').map((w) => (
                <WorkoutCard 
                  key={w.id} 
                  workout={w} 
                  onSelect={navigateToWorkoutDetail} 
                  onStart={startWorkoutTracking} 
                />
              ))}
            </div>
          </div>
        )}

        {/* VIEW: WORKOUTS GYM CATEGORY */}
        {currentView === 'workouts/gym' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setView('workouts')}
                className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 dark:text-zinc-500 transition-all"
              >
                <Undo2 className="h-5 w-5" />
              </button>
              <div>
                <h2 className="text-2xl font-black text-zinc-800 dark:text-white">Workout di Gym</h2>
                <p className="text-sm text-zinc-450 dark:text-zinc-500 font-semibold mt-0.5">Daftar gerakan menarget otot dengan bantuan mesin pembeban, dumbbell, dan barbell.</p>
              </div>
            </div>

            {/* Grid display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {workouts.filter(w => w.category === 'gym').map((w) => (
                <WorkoutCard 
                  key={w.id} 
                  workout={w} 
                  onSelect={navigateToWorkoutDetail} 
                  onStart={startWorkoutTracking} 
                />
              ))}
            </div>
          </div>
        )}

        {/* VIEW: WORKOUT DETAIL (TUTORIALS) */}
        {currentView === 'workout-detail' && selectedWorkoutId !== null && (
          (() => {
            const workout = workouts.find(w => w.id === selectedWorkoutId);
            if (!workout) return <p>Gerakan tidak ditemukan.</p>;

            return (
              <div className="space-y-6">
                
                {/* Header Back Button */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setView(workout.category === 'gym' ? 'workouts/gym' : 'workouts/home')}
                    className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 dark:text-zinc-500 transition-all"
                  >
                    <Undo2 className="h-5 w-5" />
                  </button>
                  <div>
                    <h2 className="text-2xl font-black text-zinc-800 dark:text-white">Detail Tutorial Gerakan</h2>
                    <p className="text-sm text-zinc-400 dark:text-zinc-500 font-semibold">Pelajari instruksi, tip keselamatan, serta kesalahan umum sebelum memulai.</p>
                  </div>
                </div>

                {/* 2 columns layout on desktop, single on mobile */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Left Column: Animation & Muscle targets */}
                  <div className="space-y-4">
                    <WorkoutAnimation src={workout.lottieUrl} workoutName={workout.name} />
                    
                    {/* Muscles Info */}
                    <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Otot Utama Dilatih</span>
                        <h4 className="text-base font-extrabold text-zinc-700 dark:text-zinc-250 mt-0.5">{workout.muscle}</h4>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        workout.category === 'gym' 
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' 
                          : 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400'
                      }`}>
                        {workout.category === 'gym' ? 'Gym' : 'Rumah'}
                      </span>
                    </div>

                    {/* Stats details */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-4 rounded-2xl text-center">
                        <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase block">Rekomendasi</span>
                        <span className="text-sm font-extrabold text-zinc-800 dark:text-white block mt-0.5">{workout.sets} Set</span>
                      </div>
                      <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-4 rounded-2xl text-center">
                        <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase block">Target Reps</span>
                        <span className="text-sm font-extrabold text-zinc-800 dark:text-white block mt-0.5">{workout.reps} Reps</span>
                      </div>
                      <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-4 rounded-2xl text-center">
                        <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase block">Istirahat</span>
                        <span className="text-sm font-extrabold text-brand-500 block mt-0.5">{workout.rest}s</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Descriptions, Tips, Errors */}
                  <div className="space-y-4">
                    
                    {/* Tutorial Description */}
                    <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl">
                      <h3 className="text-sm font-extrabold text-zinc-800 dark:text-white mb-2 flex items-center gap-1.5">
                        <span className="w-1.5 h-3 bg-brand-500 rounded-full inline-block"></span> Panduan Cara Melakukan
                      </h3>
                      <p className="text-xs text-zinc-600 dark:text-zinc-350 leading-relaxed font-medium">
                        {workout.tutorial}
                      </p>
                    </div>

                    {/* Tips and Safety */}
                    <div className="p-6 bg-emerald-500/[0.03] dark:bg-emerald-500/[0.01] border border-emerald-500/20 dark:border-emerald-900/20 rounded-3xl">
                      <h3 className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
                        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" /> Tips Keamanan & Keberhasilan
                      </h3>
                      <ul className="space-y-2 text-xs text-zinc-650 dark:text-zinc-350 font-semibold pl-1.5">
                        {workout.tips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-500 text-sm mt-0.5">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Common Errors */}
                    <div className="p-6 bg-red-500/[0.03] dark:bg-red-500/[0.01] border border-red-500/20 dark:border-red-900/20 rounded-3xl">
                      <h3 className="text-sm font-extrabold text-red-600 dark:text-red-400 mb-3 flex items-center gap-1.5">
                        <AlertCircle className="h-4.5 w-4.5 text-red-500" /> Kesalahan Umum yang Harus Dihindari
                      </h3>
                      <ul className="space-y-2 text-xs text-zinc-650 dark:text-zinc-355 font-semibold pl-1.5">
                        {workout.commonErrors.map((err, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-red-500 text-sm mt-0.5">•</span>
                            <span>{err}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Start active workout button */}
                    <button
                      onClick={() => startWorkoutTracking(workout)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-lg shadow-brand-500/10 hover:shadow-brand-500/25 transition-all duration-300"
                    >
                      <Play className="h-4.5 w-4.5 fill-current" /> Mulai Latihan Ini Sekarang
                    </button>

                  </div>

                </div>

              </div>
            );
          })()
        )}

        {/* VIEW: TRACKER (ACTIVE WORKOUT) */}
        {currentView === 'tracker' && (
          (() => {
            if (!activeWorkout) {
              return (
                <div className="p-12 text-center bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl max-w-md mx-auto">
                  <Dumbbell className="h-12 w-12 text-zinc-300 mx-auto mb-4 animate-bounce" />
                  <h3 className="text-lg font-extrabold text-zinc-700 dark:text-white">Tidak ada latihan yang berjalan</h3>
                  <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">Silakan pilih salah satu gerakan dari daftar latihan untuk melacak set Anda.</p>
                  <button
                    onClick={() => setView('workouts')}
                    className="mt-5 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-all shadow-md"
                  >
                    Cari Latihan
                  </button>
                </div>
              );
            }

            return (
              <div className="space-y-6 max-w-3xl mx-auto">
                
                {/* REST TIMER POPUP OVERLAY */}
                {showRestTimer && (
                  <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <RestTimer 
                      duration={currentRestDuration} 
                      onComplete={() => setShowRestTimer(false)} 
                    />
                  </div>
                )}

                {/* Header title */}
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase text-brand-500 tracking-wider flex items-center gap-1.5">
                      <Activity className="h-4 w-4 text-brand-500 animate-pulse" /> Workout Sedang Berlangsung
                    </span>
                    <h2 className="text-2xl font-black text-zinc-800 dark:text-white mt-1">
                      {activeWorkout.workout.name}
                    </h2>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm("Apakah Anda yakin ingin membatalkan sesi workout ini? Semua progres akan hilang.")) {
                        setActiveWorkout(null);
                        setView('dashboard');
                      }
                    }}
                    className="px-4 py-2 rounded-xl border border-red-200/50 hover:bg-red-50 text-red-500 dark:hover:bg-red-950/20 text-xs font-bold transition-all active:scale-95"
                  >
                    Batal
                  </button>
                </div>

                {/* Timer block */}
                <WorkoutTimer 
                  isActive={true} 
                  onTimeChange={(sec) => {
                    const updated = { ...activeWorkout };
                    updated.secondsElapsed = sec;
                    setActiveWorkout(updated);
                  }}
                  initialSeconds={activeWorkout.secondsElapsed}
                />

                {/* Checklist sets panel */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-5 rounded-3xl shadow-md">
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-3 mb-4">
                    <h3 className="text-sm font-extrabold text-zinc-800 dark:text-white uppercase tracking-wider">Set Checklist</h3>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase">Centang setelah menyelesaikan set</span>
                  </div>

                  {activeWorkout.exercises.map((ex, exIdx) => (
                    <div key={exIdx} className="space-y-3">
                      <h4 className="text-xs font-black text-brand-550 dark:text-brand-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-3 bg-brand-500 rounded-full inline-block"></span> {ex.name}
                      </h4>

                      <div className="space-y-2">
                        {ex.sets.map((set, setIdx) => (
                          <div 
                            key={setIdx}
                            className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                              set.completed
                                ? 'bg-accent-50/20 dark:bg-accent-950/10 border-accent-200/40 dark:border-accent-900/20'
                                : 'bg-zinc-50/50 dark:bg-zinc-950/30 border-zinc-150 dark:border-zinc-850'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500">SET {set.setNumber}</span>
                              
                              {/* Reps Input */}
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  min="1"
                                  value={set.reps}
                                  onChange={(e) => updateSetDetails(exIdx, setIdx, 'reps', parseInt(e.target.value) || 1)}
                                  className="w-11 py-1 px-1 text-center text-xs font-bold border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg outline-none"
                                />
                                <span className="text-[10px] text-zinc-400 font-bold">Reps</span>
                              </div>

                              {/* Weight Input (Gym only) */}
                              {set.weight !== undefined && (
                                <div className="flex items-center gap-1 pl-2 border-l border-zinc-200 dark:border-zinc-800">
                                  <input
                                    type="number"
                                    min="0"
                                    step="2.5"
                                    value={set.weight}
                                    onChange={(e) => updateSetDetails(exIdx, setIdx, 'weight', parseFloat(e.target.value) || 0)}
                                    className="w-14 py-1 px-1 text-center text-xs font-bold border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg outline-none"
                                  />
                                  <span className="text-[10px] text-zinc-400 font-bold">kg</span>
                                </div>
                              )}
                            </div>

                            {/* Checkmark Button */}
                            <button
                              onClick={() => toggleSetCompleted(exIdx, setIdx)}
                              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                                set.completed
                                  ? 'bg-accent-500 border-accent-500 text-white shadow-md'
                                  : 'bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-transparent hover:border-zinc-400'
                              }`}
                            >
                              <CheckCircle2 className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Personal Notes */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-5 rounded-3xl">
                  <h3 className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Catatan Latihan Pribadi</h3>
                  <textarea
                    value={activeWorkout.notes}
                    onChange={(e) => {
                      const updated = { ...activeWorkout };
                      updated.notes = e.target.value;
                      setActiveWorkout(updated);
                    }}
                    placeholder="Masukkan perasaan Anda hari ini, catatan pompa otot, beban maksimal baru, dll..."
                    className="w-full text-xs font-semibold p-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 h-20 resize-none transition-all"
                  />
                </div>

                {/* Finish Button */}
                <button
                  onClick={finishActiveWorkout}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 to-orange-500 hover:from-brand-600 hover:to-orange-600 text-white font-bold text-sm shadow-xl shadow-brand-500/10 hover:shadow-brand-500/25 transition-all duration-300 active:scale-[0.98]"
                >
                  <CheckCircle2 className="h-5 w-5 fill-current" /> Selesai Sesi Workout
                </button>

              </div>
            );
          })()
        )}

        {/* VIEW: WORKOUT HISTORY */}
        {currentView === 'history' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div>
              <h2 className="text-2xl font-black text-zinc-800 dark:text-white">Riwayat Workout</h2>
              <p className="text-sm text-zinc-450 dark:text-zinc-500 font-semibold mt-0.5">Catatan seluruh sesi latihan kebugaran yang telah diselesaikan.</p>
            </div>

            {historyData.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl">
                <Calendar className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-zinc-700 dark:text-zinc-200">Belum ada riwayat terekam</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">Selesaikan sesi latihan pertama Anda menggunakan tombol Mulai di menu detail tutorial.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {historyData.map((session) => (
                  <WorkoutHistoryCard key={session.id} session={session} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW: PROGRESS & ANALYTICS */}
        {currentView === 'progress' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-zinc-800 dark:text-white">Progress & Grafik Perkembangan</h2>
              <p className="text-sm text-zinc-450 dark:text-zinc-500 font-semibold mt-0.5">Analisis hasil performa angkatan beban dan berat badan harian secara visual.</p>
            </div>

            {/* Weight Input Panel */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-5 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-2xl">
              <div>
                <h3 className="text-sm font-extrabold text-zinc-800 dark:text-white flex items-center gap-1.5">
                  <Scale className="h-4.5 w-4.5 text-brand-500" /> Log Berat Badan Harian
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Pantau fluktuasi berat badan secara berkala agar diet Anda terkontrol.</p>
              </div>

              <form onSubmit={handleAddWeightRecord} className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="20"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  placeholder="Contoh: 69.5"
                  className="w-28 py-2 px-3 text-xs font-bold border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl outline-none"
                  required
                />
                <span className="text-xs font-bold text-zinc-400 pr-1">kg</span>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-black uppercase transition-all shadow-md active:scale-95"
                >
                  Simpan
                </button>
              </form>
            </div>

            {/* Dynamic Charts component */}
            <ProgressChart historyData={historyData} bodyWeightData={bodyWeightData} />

          </div>
        )}

        {/* VIEW: WORKOUT PLANS */}
        {currentView === 'plans' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-2xl font-black text-zinc-800 dark:text-white">Custom Workout Plans</h2>
                <p className="text-sm text-zinc-450 dark:text-zinc-500 font-semibold mt-0.5">Rancang program program pribadi mingguan Anda sendiri secara presisi.</p>
              </div>

              {!showPlanForm && (
                <button
                  onClick={() => setShowPlanForm(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  <PlusCircle className="h-4 w-4" /> Rencana Baru
                </button>
              )}
            </div>

            {/* Display form if active */}
            {showPlanForm ? (
              <CustomPlanForm 
                onSave={handleSaveCustomPlan} 
                onCancel={() => setShowPlanForm(false)} 
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {plansData.length === 0 ? (
                  <div className="p-12 text-center bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-3xl md:col-span-2">
                    <Calendar className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-zinc-700 dark:text-zinc-200">Belum ada program dibuat</h3>
                    <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">Tekan tombol Rencana Baru untuk merakit rutinitas gerakan gym atau rumah Anda sendiri.</p>
                  </div>
                ) : (
                  plansData.map((plan) => (
                    <div 
                      key={plan.id}
                      className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-5 rounded-3xl flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            plan.category === 'gym' 
                              ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650' 
                              : 'bg-brand-50 dark:bg-brand-950/40 text-brand-600'
                          }`}>
                            {plan.category === 'gym' ? 'Gym' : 'Rumah'}
                          </span>
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold flex items-center gap-1">
                            📅 {plan.days.join(', ')}
                          </span>
                        </div>

                        <h3 className="text-lg font-black text-zinc-800 dark:text-white">{plan.name}</h3>
                        
                        <div className="space-y-1.5 mt-4">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Daftar Gerakan ({plan.exercises.length})</span>
                          <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                            {plan.exercises.map((ex, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs py-1 px-2.5 bg-zinc-50 dark:bg-zinc-950/45 border border-zinc-150 dark:border-zinc-800 rounded-xl">
                                <span className="font-extrabold text-zinc-700 dark:text-zinc-300">{ex.name}</span>
                                <span className="text-[10px] text-zinc-400 font-semibold">{ex.sets} Set × {ex.reps} Reps</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
                        <button
                          onClick={() => startCustomPlanTracking(plan)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/10 hover:shadow-brand-500/25 transition-all duration-300 active:scale-95"
                        >
                          <Play className="h-3.5 w-3.5 fill-current" /> Jalankan Program
                        </button>
                        <button
                          onClick={() => handleDeletePlan(plan.id)}
                          className="px-3 py-2.5 rounded-xl border border-red-200/50 hover:bg-red-50 text-red-500 dark:hover:bg-red-950/20 text-xs font-bold transition-all"
                          title="Hapus Program"
                        >
                          Hapus
                        </button>
                      </div>

                    </div>
                  ))
                )}

              </div>
            )}

          </div>
        )}

        {/* VIEW: SETTINGS */}
        {currentView === 'settings' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-zinc-800 dark:text-white">Pengaturan FitTrack</h2>
              <p className="text-sm text-zinc-455 dark:text-zinc-500 font-semibold mt-0.5">Konfigurasi preferensi tema perangkat, alarm pengingat, dan status notifikasi PWA.</p>
            </div>

            {/* Reminder Form component */}
            <ReminderForm 
              onSave={(rem) => console.log("Saved reminders:", rem)} 
            />

            {/* Reset App Panel */}
            <div className="bg-red-500/[0.03] dark:bg-red-500/[0.01] border border-red-500/20 dark:border-red-900/20 p-6 rounded-3xl max-w-xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-extrabold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                  <AlertCircle className="h-4.5 w-4.5" /> Zona Bahaya (Reset Aplikasi)
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Menghapus permanen seluruh data riwayat workout, jadwal custom, dan progres berat badan Anda dari memori perangkat.
                </p>
              </div>

              <button
                onClick={() => {
                  if (confirm("⚠️ PERINGATAN: Apakah Anda yakin ingin menghapus seluruh data FitTrack di perangkat ini? Aksi ini tidak dapat dibatalkan.")) {
                    localStorage.clear();
                    alert("Aplikasi berhasil direset ke setelan awal. Halaman akan dimuat ulang.");
                    window.location.reload();
                  }
                }}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase transition-all shadow-md active:scale-95 shrink-0"
              >
                Hapus Semua Data
              </button>
            </div>

          </div>
        )}

      </main>

      {/* 3. Bottom mobile navigation */}
      <BottomNavigation currentView={currentView} setView={setView} />

    </div>
  );
}
