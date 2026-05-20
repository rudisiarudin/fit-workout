import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Venus,
  Mars,
  Scale,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Activity,
  Target,
  User,
  Heart,
  TrendingUp,
  Flame,
  Award,
  Zap,
  Lock
} from 'lucide-react';

export interface UserProfile {
  gender: 'male' | 'female' | '';
  age: number;
  height: number;
  weight: number;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | '';
  goal: 'lose_weight' | 'gain_muscle' | 'keep_fit' | 'improve_stamina' | '';
  isCompleted: boolean;
}

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<number>(0); // 0 is the FITFUEL Splash Screen
  const [profile, setProfile] = useState<UserProfile>({
    gender: '',
    age: 25,
    height: 170,
    weight: 65,
    activityLevel: 'moderately_active',
    goal: '',
    isCompleted: false
  });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  // BMI Calculator Helper
  const heightInMeters = profile.height / 100;
  const bmi = profile.weight / (heightInMeters * heightInMeters);

  const getBmiCategory = (bmiVal: number) => {
    if (bmiVal < 18.5) return { label: 'Sangat Kurus (Underweight)', color: 'text-blue-500 bg-blue-500/10' };
    if (bmiVal < 25) return { label: 'Ideal (Normal)', color: 'text-emerald-500 bg-emerald-500/10 animate-pulse' };
    if (bmiVal < 30) return { label: 'Gemuk (Overweight)', color: 'text-amber-500 bg-amber-500/10' };
    return { label: 'Obesitas (Obese)', color: 'text-red-500 bg-red-500/10' };
  };

  const bmiCat = getBmiCategory(bmi);

  // Health Stats Calculations (BMR & TDEE)
  const calculateStats = () => {
    const { gender, weight, height, age, activityLevel, goal } = profile;
    if (!gender || !activityLevel || !goal) return { bmr: 0, tdee: 0, targetCalories: 0 };

    // Harris-Benedict formula for BMR
    let bmr = 0;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    // Activity multiplier
    let multiplier = 1.2;
    if (activityLevel === 'sedentary') multiplier = 1.2;
    else if (activityLevel === 'lightly_active') multiplier = 1.375;
    else if (activityLevel === 'moderately_active') multiplier = 1.55;
    else if (activityLevel === 'very_active') multiplier = 1.725;

    const tdee = bmr * multiplier;

    // Calorie Goal Adjustment
    let targetCalories = tdee;
    if (goal === 'lose_weight') targetCalories = tdee - 500; // Caloric deficit
    else if (goal === 'gain_muscle') targetCalories = tdee + 300; // Caloric surplus

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories)
    };
  };

  const stats = calculateStats();

  const handleFinish = () => {
    onComplete({ ...profile, isCompleted: true });
  };

  // Step transitions settings
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  // Step 0: FitFuel Splash Screen
  if (step === 0) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col justify-end text-white z-50">
        
        {/* Lightning Bolt */}
        <div className="absolute inset-0 flex items-start justify-center opacity-30 pointer-events-none z-0">
          <Zap className="w-[150vw] h-[150vw] max-w-[800px] max-h-[800px] text-[#0055ff] fill-[#0055ff] transform -rotate-12 -translate-y-10" />
        </div>

        {/* Main Photo */}
        <div className="absolute inset-0 z-10 flex items-start justify-center overflow-hidden pointer-events-none">
          <img 
            src="/image/banner.png" 
            alt="Athletes" 
            className="w-full h-full object-cover object-center scale-125 origin-bottom -translate-y-8 mix-blend-lighten" 
          />
        </div>

        {/* Text & Controls (Fixed at bottom) */}
        <div className="relative z-30 w-full px-6 pb-4 pt-32 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 mb-1 drop-shadow-lg">
            <Zap className="h-10 w-10 text-[#0055ff] fill-[#0055ff]" />
            <h1 className="text-[36px] font-black italic tracking-tight uppercase">FIT-ME</h1>
          </div>
          <p className="text-[#00ff66] font-extrabold uppercase tracking-wider text-[12px] mb-6 drop-shadow-md">Untuk Pria & Wanita</p>
          
          <p className="text-zinc-300 text-center text-[12px] max-w-[240px] mx-auto leading-relaxed mb-6">
            Program workout personal untuk pria dan wanita.
          </p>
          
          <button 
            onClick={() => setStep(1)}
            className="w-full bg-[#0055ff] hover:bg-blue-600 text-white font-bold py-4 rounded-xl text-[15px] transition-all active:scale-95 shadow-[0_0_20px_rgba(0,85,255,0.4)]"
          >
            Mulai Sekarang
          </button>
          <p className="text-center text-xs text-zinc-400 mt-5 mb-2">
            Sudah punya akun? <span className="text-[#0055ff] font-bold cursor-pointer">Masuk</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] md:min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-0 md:px-4 md:py-8 relative overflow-hidden transition-colors duration-300">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00d2ff]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Card Container */}
      <div className="w-full h-[100dvh] md:h-auto md:min-h-[600px] max-w-4xl bg-black md:bg-zinc-900 border-none md:border md:border-zinc-800/80 shadow-none md:shadow-2xl rounded-none md:rounded-3xl relative z-10 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        
        {/* Left Side: Premium Fitness Illustration */}
        <div className="hidden md:flex md:col-span-5 relative bg-zinc-950 flex-col justify-between p-8 text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="/image/banner.png" 
              alt="Fitness Illustration" 
              className="w-full h-full object-cover opacity-60 mix-blend-lighten scale-105 hover:scale-110 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-[#00d2ff]/15 z-10 mix-blend-overlay" />
          </div>

          <div className="relative z-20">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-brand-500 text-white font-black text-xs leading-none">FT</span>
              <span className="font-black text-sm tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-cyan-400">FitTrack Pro</span>
            </div>
          </div>

          <div className="relative z-20 space-y-3 mt-auto">
            <span className="text-[9px] font-black tracking-widest text-brand-400 uppercase block">RANCANG METABOLISME KUSTOM</span>
            <h1 className="text-xl font-black leading-tight text-white">
              Satu Langkah Menuju Tubuh Sehat Impian Anda
            </h1>
            <p className="text-[11px] text-zinc-400 font-semibold leading-relaxed">
              Analisis kebutuhan kalori, BMI, dan status gizi Anda dihitung secara dinamis demi kenyamanan olahraga Anda.
            </p>
          </div>
        </div>

        {/* Right Side: Step Wizard Form */}
        <div className="col-span-1 md:col-span-7 p-6 md:p-8 flex flex-col justify-between h-[100dvh] md:h-auto md:min-h-[580px] relative z-20">
          
          {/* Dynamic Full Screen Image Behind Everything (Only active for Step 1) */}
          {step === 1 && (
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-none md:rounded-r-[2rem]">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={profile.gender}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  src={profile.gender === 'male' ? '/image/man.png' : '/image/woman.png'} 
                  className="absolute inset-0 w-full h-full object-cover object-top mix-blend-lighten scale-[1.05] -translate-y-4 md:scale-100 md:translate-y-0"
                  alt={profile.gender}
                />
              </AnimatePresence>
            </div>
          )}

          {/* Premium Header & Segmented Progress Bar */}
          <div className="w-full mb-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {step > 1 ? (
                  <button 
                    onClick={prevStep}
                    className="w-9 h-9 rounded-full bg-zinc-900/80 border border-zinc-850 flex items-center justify-center text-zinc-450 hover:text-white transition-all active:scale-90"
                    title="Kembali"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-brand-500/10 flex items-center justify-center text-[#0055ff]">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <span className="text-sm font-black text-white tracking-wide">Konfigurasi Profil</span>
              </div>
              <span className="text-xs font-semibold text-zinc-500">Langkah {step} dari 4</span>
            </div>
            
            {/* Segmented 4-Pill Indicator */}
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div 
                  key={s} 
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    s <= step ? 'bg-[#0055ff] shadow-[0_0_8px_rgba(0,85,255,0.4)]' : 'bg-zinc-850'
                  }`} 
                />
              ))}
            </div>
          </div>


        {/* Dynamic content rendering with Framer Motion transitions */}
        <div className="flex-1 flex flex-col justify-stretch min-h-0 relative z-10">
          <AnimatePresence mode="wait" custom={step}>
            <motion.div
              key={step}
              custom={step}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="w-full flex-1 flex flex-col justify-between"
            >
              {/* STEP 1: GENDER */}
              {step === 1 && (
                <div className="flex flex-col h-full relative">
                  
                  {/* Content Container - 100% Transparent, no dark overlay */}
                  <div className="relative z-10 flex flex-col h-full justify-end pb-2 pt-48 bg-transparent">
                    {/* Title */}
                    <div className="text-center mb-6 mt-auto">
                      <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-[0_4px_10px_rgba(0,0,0,1)]">
                        Pilih Jenis Kelamin
                      </h2>
                      <p className="text-sm text-zinc-300 mt-1.5 font-semibold tracking-wide drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">
                        Untuk akurasi metabolisme (BMR) harian.
                      </p>
                    </div>

                    {/* Sleek Segmented Control (Pill UI) */}
                    <div className="w-full max-w-sm mx-auto">
                      <div className="flex bg-zinc-900/80 rounded-full p-1.5 border border-zinc-800/80 backdrop-blur-xl shadow-2xl">
                        <button
                          onClick={() => setProfile({ ...profile, gender: 'male' })}
                          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-full text-sm font-black tracking-widest transition-all duration-300 ${
                            profile.gender === 'male' 
                              ? 'bg-gradient-to-r from-[#0055ff] to-[#00a6ff] text-white shadow-[0_4px_20px_rgba(0,85,255,0.45)]' 
                              : 'text-zinc-400 hover:text-white bg-transparent'
                          }`}
                        >
                          <Mars className="w-5 h-5" /> PRIA
                        </button>
                        <button
                          onClick={() => setProfile({ ...profile, gender: 'female' })}
                          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-full text-sm font-black tracking-widest transition-all duration-300 ${
                            profile.gender === 'female' 
                              ? 'bg-gradient-to-r from-[#ff0055] to-[#ff4080] text-white shadow-[0_4px_20px_rgba(255,0,85,0.45)]' 
                              : 'text-zinc-400 hover:text-white bg-transparent'
                          }`}
                        >
                          <Venus className="w-5 h-5" /> WANITA
                        </button>
                      </div>
                    </div>

                    {/* Dynamic Action Area: Only shown once gender is selected to avoid crowdedness */}
                    <AnimatePresence>
                      {profile.gender && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, y: 15 }}
                          animate={{ opacity: 1, height: 'auto', y: 0 }}
                          exit={{ opacity: 0, height: 0, y: 15 }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                          className="w-full max-w-sm mx-auto overflow-hidden flex flex-col"
                        >
                          {/* Action Button: Lanjutkan */}
                          <button
                            onClick={nextStep}
                            className="w-full flex items-center justify-center gap-2 py-4.5 rounded-2xl bg-gradient-to-r from-[#0055ff] to-[#00a6ff] text-white font-black text-sm uppercase tracking-wider transition-all shadow-[0_10px_35px_rgba(0,85,255,0.35)] hover:shadow-[0_10px_35px_rgba(0,85,255,0.55)] active:scale-[0.99] mt-6"
                          >
                            Lanjutkan <ChevronRight className="h-4.5 w-4.5" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                </div>
              )}

              {/* STEP 2: METRICS */}
              {step === 2 && (
                <div className="space-y-4 my-auto w-full">
                  <div className="text-center">
                    <h2 className="text-2xl md:text-3xl font-black text-zinc-800 dark:text-white leading-tight">
                      Berapa Ukuran Fisik Anda?
                    </h2>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 max-w-xs mx-auto font-medium">
                      Gunakan penggeser atau ketik langsung angka fisik Anda.
                    </p>
                  </div>

                  <div className="space-y-5 max-w-sm mx-auto pt-2 bg-transparent">
                    {/* Age Input */}
                    <div className="py-3 border-b border-zinc-900">
                      <div className="flex items-center justify-between text-xs font-bold text-zinc-400 mb-2">
                        <span className="tracking-widest uppercase">USIA</span>
                        <span className="text-sm font-black text-[#0055ff]">{profile.age} Tahun</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="12"
                          max="80"
                          value={profile.age}
                          onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
                          className="flex-1 accent-[#0055ff] h-1 bg-zinc-900 rounded-lg cursor-pointer"
                        />
                        <input
                          type="number"
                          value={profile.age}
                          onChange={(e) => setProfile({ ...profile, age: Math.max(12, Math.min(80, parseInt(e.target.value) || 25)) })}
                          className="w-16 py-1 px-2 text-center text-xs font-black border-none bg-zinc-900 text-white rounded-lg focus:ring-1 focus:ring-[#0055ff] outline-none"
                        />
                      </div>
                    </div>

                    {/* Height Input */}
                    <div className="py-3 border-b border-zinc-900">
                      <div className="flex items-center justify-between text-xs font-bold text-zinc-400 mb-2">
                        <span className="tracking-widest uppercase">TINGGI BADAN</span>
                        <span className="text-sm font-black text-[#0055ff]">{profile.height} cm</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="100"
                          max="220"
                          value={profile.height}
                          onChange={(e) => setProfile({ ...profile, height: parseInt(e.target.value) })}
                          className="flex-1 accent-[#0055ff] h-1 bg-zinc-900 rounded-lg cursor-pointer"
                        />
                        <input
                          type="number"
                          value={profile.height}
                          onChange={(e) => setProfile({ ...profile, height: Math.max(100, Math.min(220, parseInt(e.target.value) || 170)) })}
                          className="w-16 py-1 px-2 text-center text-xs font-black border-none bg-zinc-900 text-white rounded-lg focus:ring-1 focus:ring-[#0055ff] outline-none"
                        />
                      </div>
                    </div>

                    {/* Weight Input */}
                    <div className="py-3 border-b border-zinc-900">
                      <div className="flex items-center justify-between text-xs font-bold text-zinc-400 mb-2">
                        <span className="tracking-widest uppercase">BERAT BADAN</span>
                        <span className="text-sm font-black text-[#0055ff]">{profile.weight} kg</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="30"
                          max="180"
                          value={profile.weight}
                          onChange={(e) => setProfile({ ...profile, weight: parseInt(e.target.value) })}
                          className="flex-1 accent-[#0055ff] h-1 bg-zinc-900 rounded-lg cursor-pointer"
                        />
                        <input
                          type="number"
                          value={profile.weight}
                          onChange={(e) => setProfile({ ...profile, weight: Math.max(30, Math.min(180, parseFloat(e.target.value) || 60)) })}
                          className="w-16 py-1 px-2 text-center text-xs font-black border-none bg-zinc-900 text-white rounded-lg focus:ring-1 focus:ring-[#0055ff] outline-none"
                        />
                      </div>
                    </div>

                    {/* Real-time BMI Display */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0055ff]/10 to-[#00d2ff]/10 border border-[#0055ff]/20 backdrop-blur-md flex items-center justify-between gap-4 mt-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#0055ff]/10 flex items-center justify-center text-[#0055ff] shrink-0 shadow-[0_0_15px_rgba(0,85,255,0.15)]">
                          <Scale className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider block">Indeks Massa Tubuh (BMI)</span>
                          <span className="text-xs font-bold text-zinc-350 mt-0.5 block">Status: <strong className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${bmiCat.color}`}>{bmiCat.label}</strong></span>
                        </div>
                      </div>
                      <span className="text-xl font-black text-white leading-none shrink-0">{bmi.toFixed(1)}</span>
                    </div>

                    {/* Action Button: Lanjutkan */}
                    <button
                      onClick={nextStep}
                      className="w-full flex items-center justify-center gap-2 py-4.5 rounded-2xl bg-gradient-to-r from-[#0055ff] to-[#00a6ff] text-white font-black text-sm uppercase tracking-wider transition-all shadow-[0_10px_35px_rgba(0,85,255,0.25)] hover:shadow-[0_10px_35px_rgba(0,85,255,0.45)] active:scale-[0.99] mt-6"
                    >
                      Lanjutkan <ChevronRight className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: GOAL / TARGET */}
              {step === 3 && (
                <div className="space-y-3 my-auto w-full">
                  <div className="text-center mb-2">
                    <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                      Apa Target Kebugaran Anda?
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto font-medium">
                      Ini menentukan rancangan kalori & latihan harian Anda.
                    </p>
                  </div>

                  <div className="space-y-2.5 max-w-sm mx-auto">
                    {[
                      { key: 'lose_weight', icon: <TrendingUp className="h-5 w-5 rotate-180" />, label: 'Turunkan Berat Badan', desc: 'Membakar lemak, tubuh ramping & efisien.' },
                      { key: 'gain_muscle', icon: <Award className="h-5 w-5" />, label: 'Bangun Massa Otot', desc: 'Meningkatkan otot, kekuatan & tonus tubuh.' },
                      { key: 'keep_fit', icon: <Heart className="h-5 w-5" />, label: 'Jaga Kebugaran', desc: 'Gaya hidup aktif, bugar & metabolisme lancar.' },
                      { key: 'improve_stamina', icon: <Activity className="h-5 w-5" />, label: 'Tingkatkan Stamina', desc: 'Daya tahan jantung, napas panjang, energi ekstra.' },
                    ].map(({ key, icon, label, desc }) => (
                      <button
                        key={key}
                        onClick={() => setProfile({ ...profile, goal: key as UserProfile['goal'] })}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-200 active:scale-[0.99] ${
                          profile.goal === key
                            ? 'border-[#0055ff] bg-[#0055ff]/10 shadow-[0_0_20px_rgba(0,85,255,0.2)]'
                            : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                          profile.goal === key ? 'bg-[#0055ff] text-white shadow-[0_0_15px_rgba(0,85,255,0.4)]' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {icon}
                        </div>
                        <div className="leading-tight flex-1">
                          <span className={`text-sm font-black block ${ profile.goal === key ? 'text-white' : 'text-zinc-300' }`}>{label}</span>
                          <span className="text-[10px] text-zinc-500 block mt-0.5">{desc}</span>
                        </div>
                        {profile.goal === key && (
                          <div className="w-5 h-5 rounded-full bg-[#0055ff] flex items-center justify-center shrink-0">
                            <ChevronRight className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="max-w-sm mx-auto w-full pt-1">
                    <button
                      onClick={nextStep}
                      disabled={!profile.goal}
                      className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-black text-sm uppercase tracking-wider transition-all ${
                        !profile.goal
                          ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#0055ff] to-[#00a6ff] shadow-[0_10px_35px_rgba(0,85,255,0.3)] hover:shadow-[0_10px_35px_rgba(0,85,255,0.5)] active:scale-[0.99]'
                      }`}
                    >
                      Lanjutkan <ChevronRight className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: RESULTS SCREEN */}
              {step === 4 && (
                <div className="space-y-4 my-auto w-full">
                  {/* Header */}
                  <div className="text-center">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#00a6ff] bg-[#0055ff]/10 px-3 py-1 rounded-full mb-2">
                      <Sparkles className="h-3.5 w-3.5" /> Analisis Selesai
                    </span>
                    <h2 className="text-2xl font-black text-white leading-tight">
                      Profil Kebugaran Anda
                    </h2>
                  </div>

                  {/* Stat Rows */}
                  <div className="space-y-2.5 max-w-sm mx-auto">
                    <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400"><Flame className="h-4 w-4" /></div>
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">BMR Harian</span>
                      </div>
                      <span className="text-base font-black text-white">{stats.bmr} <span className="text-[10px] font-medium text-zinc-500">kkal</span></span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400"><Activity className="h-4 w-4" /></div>
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">TDEE Harian</span>
                      </div>
                      <span className="text-base font-black text-white">{stats.tdee} <span className="text-[10px] font-medium text-zinc-500">kkal</span></span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-gradient-to-r from-[#0055ff]/15 to-[#00d2ff]/10 border border-[#0055ff]/30">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#0055ff]/20 flex items-center justify-center text-[#0055ff]"><Target className="h-4 w-4" /></div>
                        <span className="text-xs font-black text-[#00a6ff] uppercase tracking-wider">Target Kalori</span>
                      </div>
                      <span className="text-base font-black text-[#0055ff]">{stats.targetCalories} <span className="text-[10px] font-medium text-[#0055ff]/70">kkal</span></span>
                    </div>
                  </div>

                  {/* Advice Block */}
                  <div className="max-w-sm mx-auto p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                    <h4 className="text-xs font-black text-white flex items-center gap-1.5 mb-1.5 uppercase tracking-wide">
                      <Target className="h-4 w-4 text-[#0055ff]" /> Rencana Latihan
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {profile.goal === 'lose_weight' && `Batasi asupan ~${stats.targetCalories} kkal/hari. Lakukan 'Home Workout' 3-4x seminggu untuk membakar lemak.`}
                      {profile.goal === 'gain_muscle' && `Konsumsi surplus sehat ~${stats.targetCalories} kkal/hari dengan protein tinggi. Latihan kekuatan 'Gym Workout' berbeban berat.`}
                      {profile.goal === 'keep_fit' && `Jaga asupan seimbang di ~${stats.targetCalories} kkal/hari. Kombinasikan latihan Home & Gym secara fleksibel.`}
                      {profile.goal === 'improve_stamina' && `Penuhi energi ~${stats.targetCalories} kkal/hari. Latihan repetisi tinggi dengan istirahat antar-set minimal.`}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="max-w-sm mx-auto w-full">
                    <button
                      onClick={handleFinish}
                      className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-[#0055ff] to-[#00a6ff] text-white font-black text-sm uppercase tracking-wider transition-all shadow-[0_10px_35px_rgba(0,85,255,0.35)] hover:shadow-[0_10px_35px_rgba(0,85,255,0.55)] active:scale-[0.99]"
                    >
                      Mulai Perjalanan! 🚀
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  </div>
);
}
