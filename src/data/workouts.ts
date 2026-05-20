export interface Workout {
  id: number;
  name: string;
  category: 'home' | 'gym';
  muscle: string;
  sets: number;
  reps: number;
  rest: number; // in seconds
  duration: string;
  lottieUrl: string;
  tutorial: string;
  tips: string[];
  commonErrors: string[];
}

export const workouts: Workout[] = [
  {
    id: 1,
    name: "Push Up",
    category: "home",
    muscle: "Chest, Shoulder, Triceps",
    sets: 3,
    reps: 12,
    rest: 60,
    duration: "10 menit",
    lottieUrl: "https://assets-v2.lottiefiles.com/a/6c1a4598-1177-11ee-9e88-bf9e8c56d70c/YDxF9XmjyX.lottie",
    tutorial: "Posisikan tubuh dalam posisi plank tinggi. Letakkan tangan Anda sedikit lebih lebar dari lebar bahu. Jaga agar tubuh Anda tetap lurus dari kepala hingga tumit. Turunkan tubuh dengan menekuk siku hingga dada hampir menyentuh lantai. Dorong tubuh kembali ke posisi awal dengan meluruskan lengan Anda.",
    tips: [
      "Jaga tubuh tetap dalam satu garis lurus, kencangkan otot inti (core)",
      "Tarik napas saat menurunkan tubuh, buang napas saat mendorong ke atas",
      "Siku harus membentuk sudut sekitar 45 derajat dengan tubuh Anda"
    ],
    commonErrors: [
      "Pinggul melorot ke bawah atau terangkat terlalu tinggi",
      "Siku melebar terlalu lebar (membentuk sudut 90 derajat)",
      "Gerakan tidak penuh (tidak turun cukup rendah)"
    ]
  },
  {
    id: 2,
    name: "Squat",
    category: "home",
    muscle: "Legs (Quads, Hamstrings), Glutes",
    sets: 4,
    reps: 15,
    rest: 60,
    duration: "12 menit",
    lottieUrl: "https://assets-v2.lottiefiles.com/a/bf1f7a6c-1175-11ee-ae9f-2359fb1b49ba/NZQJOYnhVs.lottie",
    tutorial: "Berdiri tegak dengan kaki dibuka selebar bahu. Rentangkan lengan ke depan atau letakkan di belakang kepala. Dorong pinggul ke belakang dan tekuk lutut seolah ingin duduk di kursi. Turunkan tubuh hingga paha sejajar dengan lantai. Dorong kembali ke atas menggunakan tumit untuk kembali ke posisi awal.",
    tips: [
      "Punggung harus tetap tegak dan dada membusung ke depan",
      "Lutut tidak boleh menekuk ke dalam, harus sejajar dengan arah jemari kaki",
      "Tekan tumit Anda ke lantai untuk mendorong tubuh ke atas"
    ],
    commonErrors: [
      "Lutut melampaui ujung jari kaki terlalu jauh",
      "Punggung melengkung ke depan",
      "Tumit terangkat dari lantai saat turun"
    ]
  },
  {
    id: 3,
    name: "Plank",
    category: "home",
    muscle: "Core, Abs, Shoulders",
    sets: 3,
    reps: 1, // 1 rep is holding for a duration
    rest: 45,
    duration: "8 menit",
    lottieUrl: "https://assets-v2.lottiefiles.com/a/dc68e41e-1189-11ee-a704-a3ee683b17ee/ygxWZwnPnw.lottie",
    tutorial: "Letakkan lengan bawah Anda di lantai dengan siku tepat di bawah bahu. Rentangkan kaki ke belakang dan bertumpulah pada jari kaki. Kencangkan otot perut, bokong, dan paha Anda. Pertahankan tubuh dalam garis lurus yang sempurna dari kepala hingga kaki Anda selama waktu yang ditentukan.",
    tips: [
      "Bernapaslah secara teratur, jangan menahan napas",
      "Kencangkan perut Anda seolah-olah akan dipukul",
      "Pandangan diarahkan ke lantai sedikit di depan tangan Anda"
    ],
    commonErrors: [
      "Pinggul melorot ke bawah yang menyebabkan punggung bagian bawah melengkung",
      "Mengangkat bokong terlalu tinggi ke atas",
      "Menundukkan kepala atau menengadah terlalu tinggi"
    ]
  },
  {
    id: 4,
    name: "Lunges",
    category: "home",
    muscle: "Quads, Hamstrings, Glutes",
    sets: 3,
    reps: 12, // per leg
    rest: 60,
    duration: "10 menit",
    lottieUrl: "https://assets-v2.lottiefiles.com/a/8c3bfbda-116a-11ee-ae27-27c841c68b90/3wj4p7PlV4.lottie",
    tutorial: "Berdiri tegak dengan kaki rapat. Ambil langkah besar ke depan dengan kaki kanan. Turunkan pinggul Anda sampai paha depan kanan sejajar dengan lantai dan lutut kiri berada tepat di atas lantai. Dorong kembali ke posisi awal dengan kaki depan dan ulangi untuk kaki kiri.",
    tips: [
      "Jaga agar tubuh tetap tegak selama gerakan",
      "Pastikan lutut depan Anda berada tepat di atas pergelangan kaki, tidak maju melewati jari kaki",
      "Lakukan gerakan secara terkontrol untuk menjaga keseimbangan"
    ],
    commonErrors: [
      "Lutut belakang menyentuh lantai terlalu keras",
      "Tubuh condong terlalu jauh ke depan",
      "Langkah kaki terlalu pendek sehingga membatasi ruang gerak lutut"
    ]
  },
  {
    id: 5,
    name: "Sit Up",
    category: "home",
    muscle: "Abs, Hip Flexors",
    sets: 3,
    reps: 15,
    rest: 60,
    duration: "10 menit",
    lottieUrl: "https://assets-v2.lottiefiles.com/a/a1cad384-116c-11ee-8fe2-6f27c3483533/fueGlvEAYX.lottie",
    tutorial: "Berbaring telentang di lantai dengan lutut ditekuk dan telapak kaki rata di lantai. Letakkan tangan Anda di belakang kepala atau menyilang di dada. Kencangkan otot perut, lalu angkat tubuh bagian atas hingga dada mendekati paha. Turunkan kembali tubuh secara perlahan ke posisi awal.",
    tips: [
      "Gunakan kekuatan otot perut untuk mengangkat tubuh, bukan menarik leher dengan tangan",
      "Lakukan gerakan turun secara perlahan untuk resistensi ekstra",
      "Hembuskan napas saat naik, tarik napas saat turun"
    ],
    commonErrors: [
      "Menarik leher ke depan menggunakan tangan secara agresif",
      "Mengangkat bokong atau kaki dari lantai saat tubuh naik",
      "Menggunakan momentum tubuh alih-alih kekuatan otot perut"
    ]
  },
  {
    id: 6,
    name: "Jumping Jack",
    category: "home",
    muscle: "Full Body, Cardio",
    sets: 3,
    reps: 30,
    rest: 45,
    duration: "8 menit",
    lottieUrl: "https://assets-v2.lottiefiles.com/a/8c2969a2-116a-11ee-ae24-8ba0ad01121d/PL84M8aMWv.lottie",
    tutorial: "Berdiri tegak dengan kedua lengan di samping tubuh dan kaki rapat. Lompatlah sambil membuka kedua kaki selebar bahu dan secara bersamaan angkat kedua tangan ke atas kepala hingga hampir bersentuhan. Lompat kembali dengan cepat ke posisi awal.",
    tips: [
      "Lompat dengan lembut bertumpu pada bagian depan kaki Anda untuk meredam benturan",
      "Jaga agar lengan Anda tetap lurus saat mengangkatnya ke atas",
      "Pertahankan ritme yang konsisten dan cepat"
    ],
    commonErrors: [
      "Mendarat dengan tumit terlalu keras yang dapat mencederai sendi",
      "Lengan tidak diangkat sepenuhnya ke atas kepala",
      "Menekuk lutut secara berlebihan saat mendarat"
    ]
  },
  {
    id: 7,
    name: "Glute Bridge",
    category: "home",
    muscle: "Glutes, Hamstrings, Lower Back",
    sets: 3,
    reps: 15,
    rest: 60,
    duration: "10 menit",
    lottieUrl: "https://assets-v2.lottiefiles.com/a/2d66a188-116e-11ee-94ed-c7f98f54e189/xj6SSR2eJX.lottie",
    tutorial: "Berbaring telentang dengan lutut ditekuk dan kaki rata di lantai selebar pinggul. Kencangkan perut dan bokong Anda. Dorong tumit Anda ke lantai untuk mengangkat pinggul Anda hingga tubuh membentuk garis lurus dari bahu hingga lutut. Tahan selama 2 detik di atas, lalu turunkan perlahan.",
    tips: [
      "Kencangkan bokong sekuat mungkin di puncak gerakan",
      "Jangan biarkan lutut Anda melebar atau merapat, pertahankan sejajar pinggul",
      "Jaga agar punggung bagian bawah tidak melengkung berlebihan di atas"
    ],
    commonErrors: [
      "Mendorong terlalu tinggi sehingga punggung bawah melengkung tidak nyaman",
      "Tidak mengangkat pinggul cukup tinggi untuk melatih glutes",
      "Melakukan gerakan terlalu cepat tanpa jeda di puncak gerakan"
    ]
  },
  {
    id: 8,
    name: "Mountain Climber",
    category: "home",
    muscle: "Core, Shoulders, Cardio",
    sets: 3,
    reps: 20, // per side
    rest: 45,
    duration: "9 menit",
    lottieUrl: "https://assets-v2.lottiefiles.com/a/8c27d682-116a-11ee-ae23-838ae461b028/yXjVtxnIso.lottie",
    tutorial: "Mulailah dalam posisi plank tinggi dengan tangan tepat di bawah bahu. Kencangkan otot perut Anda. Dorong lutut kanan Anda ke arah dada secepat mungkin tanpa membiarkan pinggul terangkat. Kembalikan kaki kanan ke posisi awal dan secara bergantian dorong lutut kiri ke dada.",
    tips: [
      "Jaga agar pinggul tetap sejajar dengan lantai, jangan memantul ke atas dan bawah",
      "Tangan harus tetap kokoh menopang tubuh tepat di bawah bahu",
      "Lakukan gerakan seperti berlari di lantai dengan kontrol otot perut"
    ],
    commonErrors: [
      "Pinggul terangkat terlalu tinggi sehingga beban bergeser ke kaki",
      "Menyeret kaki di lantai saat menarik lutut",
      "Posisi pundak mundur ke belakang tidak lagi di atas pergelangan tangan"
    ]
  },
  
  // GYM WORKOUTS
  {
    id: 9,
    name: "Bench Press",
    category: "gym",
    muscle: "Chest, Shoulders (Anterior), Triceps",
    sets: 4,
    reps: 10,
    rest: 90,
    duration: "15 menit",
    lottieUrl: "https://assets-v2.lottiefiles.com/a/7e29fad4-1182-11ee-a91b-0f315e1d0acd/2MbAZkcu8V.lottie",
    tutorial: "Berbaring telentang di atas bangku datar (bench). Pegang barbel dengan genggaman sedikit lebih lebar dari bahu. Angkat barbel dari rak dan tahan lurus di atas dada. Turunkan barbel secara perlahan hingga menyentuh dada bagian tengah. Dorong barbel kembali ke atas dengan kuat ke posisi awal.",
    tips: [
      "Selalu gunakan bantuan spotter (teman pendamping) saat mengangkat beban berat",
      "Jaga kaki Anda tetap rata di lantai untuk memberikan stabilitas",
      "Genggam barbel dengan erat dan pastikan pergelangan tangan tetap lurus"
    ],
    commonErrors: [
      "Mengangkat kaki dari lantai atau melengkungkan punggung secara berlebihan",
      "Memantulkan barbel dari dada untuk mendapatkan momentum dorongan",
      "Mengunci sendi siku terlalu keras di puncak gerakan"
    ]
  },
  {
    id: 10,
    name: "Lat Pulldown",
    category: "gym",
    muscle: "Back (Lats), Biceps, Shoulders",
    sets: 4,
    reps: 10,
    rest: 90,
    duration: "12 menit",
    lottieUrl: "https://assets-v2.lottiefiles.com/a/2de7198a-116e-11ee-9559-473e83062dcb/sJ3OWqDNoL.lottie",
    tutorial: "Duduk di mesin lat pulldown dan atur bantalan paha agar mengunci kaki Anda dengan pas. Pegang palang mesin dengan genggaman lebar ke arah luar. Tarik palang ke bawah ke arah dada bagian atas sambil merapatkan tulang belikat Anda. Tahan sejenak lalu biarkan palang kembali ke atas secara perlahan.",
    tips: [
      "Fokus pada menarik beban menggunakan otot punggung (siku ditarik ke bawah), bukan kekuatan lengan",
      "Condongkan tubuh sedikit ke belakang (sekitar 10-15 derajat) untuk memberi ruang bagi palang",
      "Kontrol gerakan naik secara lambat untuk merangsang serat otot secara maksimal"
    ],
    commonErrors: [
      "Menarik palang terlalu jauh ke bawah hingga menyentuh perut",
      "Mengayunkan tubuh ke depan dan belakang untuk membantu menarik beban",
      "Menggunakan genggaman yang terlalu lebar atau terlalu sempit secara tidak nyaman"
    ]
  },
  {
    id: 11,
    name: "Shoulder Press",
    category: "gym",
    muscle: "Shoulders (Deltoids), Triceps",
    sets: 4,
    reps: 10,
    rest: 90,
    duration: "12 menit",
    lottieUrl: "https://assets-v2.lottiefiles.com/a/e5ea62be-1171-11ee-8204-e7fe3e8cdc45/zjWa2YhPBM.lottie",
    tutorial: "Duduk tegak di bangku latihan dengan sandaran punggung disetel tegak. Pegang dua buah dumbbell setinggi bahu dengan telapak tangan menghadap ke depan. Dorong dumbbell ke atas kepala hingga lengan lurus, namun siku tidak terkunci. Turunkan kembali dumbbell secara terkontrol ke tinggi bahu.",
    tips: [
      "Pertahankan punggung Anda tetap menempel pada sandaran kursi",
      "Dorong dumbbell ke atas dalam lintasan melengkung hingga hampir bertemu di atas kepala",
      "Buang napas saat mendorong ke atas, tarik napas saat menurunkan dumbbell"
    ],
    commonErrors: [
      "Melengkungkan punggung bagian bawah sehingga menjauh dari sandaran kursi",
      "Mengunci siku terlalu keras di puncak gerakan",
      "Menurunkan dumbbell terlalu rendah hingga kehilangan tegangan pada otot bahu"
    ]
  },
  {
    id: 12,
    name: "Leg Press",
    category: "gym",
    muscle: "Quads, Glutes, Hamstrings",
    sets: 4,
    reps: 12,
    rest: 90,
    duration: "15 menit",
    lottieUrl: "https://assets-v2.lottiefiles.com/a/dc732190-1189-11ee-a70e-ab45a48260ad/ZROBPAI55W.lottie",
    tutorial: "Duduk di mesin leg press dan letakkan kaki Anda di atas platform setinggi dan selebar bahu. Lepaskan tuas pengaman mesin. Turunkan platform secara perlahan dengan menekuk lutut hingga membentuk sudut 90 derajat. Dorong kembali platform ke atas menggunakan kekuatan kaki Anda.",
    tips: [
      "Tekan platform menggunakan seluruh permukaan telapak kaki, terutama tumit",
      "Jaga punggung dan bokong Anda tetap menempel erat pada kursi mesin",
      "Buka lutut sejajar dengan arah jemari kaki saat platform turun"
    ],
    commonErrors: [
      "Mengunci lutut sepenuhnya di puncak gerakan (sangat berbahaya)",
      "Mengangkat bokong dari bantalan kursi saat platform diturunkan terlalu dalam",
      "Menaruh kaki terlalu rendah di platform yang menambah tekanan berlebih pada lutut"
    ]
  },
  {
    id: 13,
    name: "Cable Row",
    category: "gym",
    muscle: "Middle Back, Rhomboids, Lats, Biceps",
    sets: 4,
    reps: 10,
    rest: 90,
    duration: "12 menit",
    lottieUrl: "https://assets-v2.lottiefiles.com/a/b96dac7e-1189-11ee-814c-77fd8d07983b/wsuy6czYqi.lottie",
    tutorial: "Duduk di mesin seating cable row dengan kaki bertumpu pada platform depan. Tekuk lutut Anda sedikit. Pegang handle segitiga (V-bar). Tarik handle ke arah perut bagian bawah sambil menarik siku ke belakang dan membusungkan dada. Remas otot punggung Anda selama 1-2 detik, lalu lepaskan perlahan.",
    tips: [
      "Jaga agar punggung Anda tetap tegak selama menarik beban, jangan membungkuk",
      "Fokus pada menarik siku Anda sejauh mungkin ke belakang tubuh",
      "Pundak harus rileks ke bawah, jangan diangkat mendekati telinga saat menarik"
    ],
    commonErrors: [
      "Menggunakan momentum pinggul dengan mengayunkan tubuh ke depan-belakang",
      "Punggung melengkung atau membungkuk saat melepaskan beban ke depan",
      "Menarik pegangan menggunakan kekuatan biceps sepenuhnya tanpa melatih punggung"
    ]
  },
  {
    id: 14,
    name: "Dumbbell Curl",
    category: "gym",
    muscle: "Biceps, Forearms",
    sets: 3,
    reps: 12,
    rest: 60,
    duration: "10 menit",
    lottieUrl: "https://assets-v2.lottiefiles.com/a/7e30d732-1182-11ee-a920-b3627aa227e0/7tujEvB2wt.lottie",
    tutorial: "Berdiri tegak dengan dumbbell di masing-masing tangan di samping tubuh, telapak tangan menghadap ke dalam. Jaga siku tetap dekat dengan tubuh. Putar pergelangan tangan Anda saat mengangkat dumbbell hingga telapak tangan menghadap ke atas. Angkat hingga setinggi bahu, lalu turunkan perlahan.",
    tips: [
      "Jaga agar siku Anda tetap terkunci di samping tubuh, jangan biarkan maju ke depan",
      "Kencangkan biceps Anda sekuat mungkin di puncak gerakan",
      "Kontrol gerakan turun (eksentrik) selama minimal 2 detik"
    ],
    commonErrors: [
      "Mengayunkan tubuh untuk membantu mengangkat beban berat (menggunakan momentum)",
      "Membiarkan siku maju ke depan sehingga melatih otot bahu depan alih-alih biceps",
      "Tidak meluruskan lengan sepenuhnya di bagian bawah gerakan"
    ]
  },
  {
    id: 15,
    name: "Treadmill",
    category: "gym",
    muscle: "Cardio, Legs, Full Body Endurance",
    sets: 1, // 1 session
    reps: 1, // 1 duration
    rest: 0,
    duration: "20 menit",
    lottieUrl: "https://assets-v2.lottiefiles.com/a/dc69d87e-1189-11ee-a705-f7cb6318356f/i57pvwUoHh.lottie",
    tutorial: "Berdirilah di atas sabuk treadmill. Pasang klip pengaman pada pakaian Anda. Mulailah berjalan dengan kecepatan lambat (2-3 km/jam) untuk pemanasan selama 3 menit. Naikkan kecepatan ke joging (5-8 km/jam) atau lari (9+ km/jam) sesuai kemampuan Anda. Lakukan pendinginan di akhir sesi.",
    tips: [
      "Jaga postur tubuh tetap tegak dan pandangan lurus ke depan, jangan melihat kaki",
      "Gunakan ayunan tangan alami untuk membantu momentum lari Anda",
      "Mendaratlah dengan bagian tengah kaki Anda untuk meminimalkan beban benturan sendi"
    ],
    commonErrors: [
      "Berpegangan pada pegangan tangan treadmill secara terus menerus saat berlari",
      "Melompat dari treadmill saat sabuk masih berputar cepat",
      "Mendarat dengan tumit terlalu keras secara terus-menerus"
    ]
  },
  {
    id: 16,
    name: "Deadlift",
    category: "gym",
    muscle: "Hamstrings, Glutes, Lower Back, Core, Traps",
    sets: 4,
    reps: 8,
    rest: 120,
    duration: "15 menit",
    lottieUrl: "https://assets-v2.lottiefiles.com/a/7e2cdfe2-1182-11ee-a91d-f7ca939f1b3c/Ol2au5cYRD.lottie",
    tutorial: "Berdiri di depan barbel dengan kaki dibuka selebar pinggul. Posisi tulang kering harus berjarak sekitar 2-3 cm dari besi barbel. Bungkukkan badan dengan menekuk pinggul, lalu pegang barbel dengan lebar bahu. Tekuk lutut hingga tulang kering menyentuh besi. Busungkan dada, ratakan punggung, kencangkan core, lalu angkat barbel dengan meluruskan kaki dan pinggul secara bersamaan.",
    tips: [
      "Punggung harus selalu dalam posisi netral (lurus sempurna), jangan melengkung!",
      "Dorong lantai menggunakan kaki Anda untuk memulai angkatan",
      "Jaga barbel tetap sedekat mungkin dengan tubuh Anda sepanjang lintasan gerakan"
    ],
    commonErrors: [
      "Melengkungkan punggung saat mengangkat (sangat berisiko mencederai saraf tulang belakang)",
      "Posisi barbel terlalu jauh dari tubuh di depan kaki",
      "Melakukan gerakan hiper-ekstensi (melengkung ke belakang terlalu jauh) di puncak gerakan"
    ]
  }
];
