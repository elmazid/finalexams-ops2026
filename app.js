/* ==========================================================================
   FINAL OPS 25 — TACTICAL STUDY ENGINE (app.js - BAGIAN 1/2)
   Database, Jadwal 7 Hari, 50 Kutipan Motivasi, & Peta Timeline 3-28 Nov
   ========================================================================== */

const STORAGE_KEY = 'final_ops_25_state_v1';
const EXAM_DATE = new Date(2026, 10, 29, 8, 0, 0); // 29 November 2026

// 1. DATA AWAL BAHTS (PERSISTENT SAMPAI KLIK TOMBOL SELESAI)
const DEFAULT_BAHTS = [
  {
    id: 'bahts_faraidh',
    title: 'Bahts Faraidh (Kompilasi Poin Kitab)',
    subtitle: 'Target: Eksekusi cepat 2–3 hari di Fase 1',
    completed: false,
    steps: [
      { id: 'bf_1', label: 'Kumpulkan Maraji & Poin', done: false },
      { id: 'bf_2', label: 'Tulis Pembahasan Inti', done: false },
      { id: 'bf_3', label: 'Rapikan Format & Finalisasi', done: false }
    ]
  },
  {
    id: 'bahts_fiqh',
    title: 'Bahts Fiqh (Riset Ilmiah 10 Halaman)',
    subtitle: 'Target: Cicil terukur ~1,5 halaman/hari',
    completed: false,
    steps: [
      { id: 'bfq_1', label: 'Khittoh & Referensi', done: false },
      { id: 'bfq_2', label: 'Hal 1–2', done: false },
      { id: 'bfq_3', label: 'Hal 3–4', done: false },
      { id: 'bfq_4', label: 'Hal 5–6', done: false },
      { id: 'bfq_5', label: 'Hal 7–8', done: false },
      { id: 'bfq_6', label: 'Hal 9–10', done: false },
      { id: 'bfq_7', label: 'Murojaah &Cek Khilaf/Dalil', done: false }
    ]
  }
];

// 2. MATRIKS JADWAL 7 HARI (AHAD = 0 ... SABTU = 6)
// Mengatur kapan mode Kuliah, Tidur, dan Jam Kosong Aktif
const WEEKLY_SCHEDULE = {
  0: { // Ahad
    name: 'Ahad',
    slots: [
      { start: '05:00', end: '07:45', type: 'free', theme: 'dawn', title: 'Sesi Fajar & Al-Qur’an', rec: 'Al-Qur’an + 1–2 Sesi Adilatul Ahkam (Opsi Workout Pagi)' },
      { start: '08:00', end: '11:00', type: 'class', theme: 'standby', title: 'Kuliah Pagi Ahad', rec: 'Fokus simak dosen & catat kisi-kisi penting.' },
      { start: '11:00', end: '13:00', type: 'free', theme: 'day', title: 'Jam Kosong Siang', rec: 'Makan Siang + Cicil Bahts / Nizhom Ijroat (1–2 Sesi)' },
      { start: '13:00', end: '17:00', type: 'free', theme: 'day', title: 'Blok Fokus Siang–Sore', rec: '3 Video Faraidh + Latihan Hitung / Uqud Tijariyah' },
      { start: '17:00', end: '19:00', type: 'class', theme: 'standby', title: 'Kuliah Sore Ahad', rec: 'Simak materi kuliah sore.' },
      { start: '19:30', end: '22:30', type: 'free', theme: 'night', title: 'Blok Malam Bidayatul Mujtahid', rec: 'Bedah Tahrir Khilaf Muamalat & Fiqihul Usroh' }
    ]
  },
  1: { // Senin (Rest Workout)
    name: 'Senin (Rest Day)',
    slots: [
      { start: '05:00', end: '07:45', type: 'free', theme: 'dawn', title: 'Sesi Fajar Penuh (Tanpa Workout)', rec: 'Hafalan Al-Qur’an + 2 Sesi Fokus Adilatul Ahkam' },
      { start: '08:00', end: '10:00', type: 'class', theme: 'standby', title: 'Kuliah Pagi Senin', rec: 'Fokus simak kuliah pagi.' },
      { start: '10:00', end: '13:00', type: 'free', theme: 'day', title: 'Golden Time Pagi–Siang', rec: 'Fokus Utama Eksekusi Bahts + Cicil Nizhom Ijroat' },
      { start: '13:00', end: '16:00', type: 'free', theme: 'day', title: 'Blok Siang', rec: '3 Video Faraidh + Pemahaman Konsep Uqud Tijariyah' },
      { start: '16:00', end: '18:00', type: 'class', theme: 'standby', title: 'Kuliah Sore Senin', rec: 'Simak perkuliahan sore.' },
      { start: '18:30', end: '22:30', type: 'free', theme: 'night', title: 'Blok Malam Intensif', rec: '4 Sesi Pomodoro: Fiqihul Muamalat & Fiqihul Usroh' }
    ]
  },
  2: { // Selasa
    name: 'Selasa',
    slots: [
      { start: '05:00', end: '07:45', type: 'free', theme: 'dawn', title: 'Sesi Fajar & Al-Qur’an', rec: 'Al-Qur’an + Adilatul Ahkam (atau Workout Pagi)' },
      { start: '08:00', end: '10:00', type: 'class', theme: 'standby', title: 'Kuliah Pagi Selasa', rec: 'Fokus simak perkuliahan.' },
      { start: '10:00', end: '13:30', type: 'free', theme: 'day', title: 'Jam Kosong Pagi–Siang (Leluasa)', rec: 'Workout (1,5 Jam) + Makan + 2 Sesi Bahts/Nizhom' },
      { start: '13:30', end: '17:30', type: 'free', theme: 'day', title: 'Blok Kosong Siang–Sore', rec: 'Kejar 3–4 Video Faraidh + Uqud Tijariyah' },
      { start: '17:30', end: '19:30', type: 'free', theme: 'sunset', title: 'Transisi Sore & Maghrib', rec: 'Opsi Workout Sore (jika belum) + Murojaah Ringan' },
      { start: '19:30', end: '22:30', type: 'free', theme: 'night', title: 'Blok Malam Bidayatul Mujtahid', rec: 'Fokus Aqwal & Dalil: Fiqihul Muamalat & Usroh' }
    ]
  },
  3: { // Rabu
    name: 'Rabu',
    slots: [
      { start: '05:00', end: '07:45', type: 'free', theme: 'dawn', title: 'Sesi Fajar & Al-Qur’an', rec: 'Al-Qur’an + 2 Sesi Adilatul Ahkam' },
      { start: '08:00', end: '10:00', type: 'class', theme: 'standby', title: 'Kuliah Pagi Rabu', rec: 'Fokus simak perkuliahan pagi.' },
      { start: '10:00', end: '13:00', type: 'free', theme: 'day', title: 'Jeda Siang Sebelum Kuliah Panjang', rec: 'Cicil Bahts / Video Faraidh (atau Workout Siang) + Makan' },
      { start: '13:00', end: '17:00', type: 'class', theme: 'standby', title: 'Maraton Kuliah Siang–Sore', rec: 'Hemat energi, catat poin penting dosen.' },
      { start: '17:00', end: '19:30', type: 'free', theme: 'sunset', title: 'Sesi Pelepas Penat Kuliah', rec: 'Workout Sore (Refresh Otak) & Istirahat Makan' },
      { start: '19:30', end: '22:30', type: 'free', theme: 'night', title: 'Blok Malam Terfokus', rec: '3 Sesi: Fiqihul Usroh / Muamalat + Cek Target Harian' }
    ]
  },
  4: { // Kamis (Rest Workout)
    name: 'Kamis (Rest Day)',
    slots: [
      { start: '05:00', end: '07:45', type: 'free', theme: 'dawn', title: 'Sesi Fajar Penuh (Rest Workout)', rec: 'Hafalan Al-Qur’an + 2 Sesi Adilatul Ahkam' },
      { start: '08:00', end: '10:00', type: 'class', theme: 'standby', title: 'Kuliah Pagi Kamis', rec: 'Simak kuliah dengan fokus.' },
      { start: '10:00', end: '15:00', type: 'free', theme: 'day', title: 'Blok Emas 5 Jam (10:00–15:00)', rec: 'Push Bahts + 3 Video Faraidh + Nizhom Ijroat (Selingi Makan)' },
      { start: '15:00', end: '17:00', type: 'class', theme: 'standby', title: 'Kuliah Sore Kamis', rec: 'Kuliah penutup pekan.' },
      { start: '17:00', end: '19:30', type: 'free', theme: 'sunset', title: 'Transisi Malam Jumat', rec: 'Murojaah Al-Qur’an & Rehat Sejenak' },
      { start: '19:30', end: '22:30', type: 'free', theme: 'night', title: 'Blok Malam Bidayatul Mujtahid', rec: 'Bedah Tahrir Khilaf Muamalat & Fiqihul Usroh' }
    ]
  },
  5: { // Jumat
    name: 'Jumat (Bebas Kuliah)',
    slots: [
      { start: '05:00', end: '08:30', type: 'free', theme: 'dawn', title: 'Sesi Fajar Panjang', rec: 'Al-Qur’an + 3 Sesi Adilatul Ahkam (Mumpung Otak Segar)' },
      { start: '08:30', end: '11:15', type: 'free', theme: 'day', title: 'Blok Dhuha Jumat', rec: 'Workout Pagi + Persiapan Sholat Jumat' },
      { start: '13:30', end: '17:30', type: 'free', theme: 'day', title: 'Blok Siang–Sore Leluasa', rec: 'Kejar 4 Video Faraidh + Eksekusi Bahts' },
      { start: '17:30', end: '19:30', type: 'free', theme: 'sunset', title: 'Sesi Senja Jumat', rec: 'Murojaah Al-Qur’an & Evaluasi Pekanan' },
      { start: '19:30', end: '22:30', type: 'free', theme: 'night', title: 'Blok Malam Akhir Pekan', rec: 'Fiqihul Muamalat & Usroh + Cicil Uqud Tijariyah' }
    ]
  },
  6: { // Sabtu
    name: 'Sabtu (Bebas Kuliah)',
    slots: [
      { start: '05:00', end: '08:30', type: 'free', theme: 'dawn', title: 'Sesi Fajar Akselerasi', rec: 'Al-Qur’an + 3 Sesi Adilatul Ahkam' },
      { start: '08:30', end: '12:30', type: 'free', theme: 'day', title: 'Blok Pagi–Siang Penuh', rec: 'Push Bahts / Nizhom Ijroat + Workout Sebelum Makan Siang' },
      { start: '13:30', end: '17:30', type: 'free', theme: 'day', title: 'Blok Sore Faraidh & Kasus', rec: '4 Video Faraidh + Latihan Soal Waris & Uqud Tijariyah' },
      { start: '17:30', end: '19:30', type: 'free', theme: 'sunset', title: 'Transisi Sore Sabtu', rec: 'Rehat Fisik & Persiapan Kuliah Ahad' },
      { start: '19:30', end: '22:30', type: 'free', theme: 'night', title: 'Blok Malam Bidayatul Mujtahid', rec: 'Rangkum Aqwal & Adillah Muamalat + Usroh' }
    ]
  }
};

// 3. DATABASE MOTIVASI 2 SHIFT (PAGI & SORE/MALAM)
const QUOTES_DB = [
  {
    am: { text: "Keberkahan umatku ada pada waktu paginya. Mulailah dengan Al-Qur'an dan materi tersulitmu saat pikiran masih jernih.", src: "Inspirasi Hadits Nabi صلى الله عليه وسلم" },
    pm: { text: "Ilmu tidak akan bisa diraih dengan tubuh yang bersantai-santai. Satu sesi 25 menit malam ini menentukan ketenanganmu di ruang ujian.", src: "Yahya bin Abi Katsir رحمه الله" }
  },
  {
    am: { text: "Barangsiapa menempuh jalan untuk mencari ilmu, Allah سبحانه وتعالى akan mudahkan baginya jalan menuju surga.", src: "HR. Muslim" },
    pm: { text: "Lelahnya belajar hanya sementara, namun penyesalan karena menyia-nyiakan waktu persiapan akan terasa panjang.", src: "Nasihat Imam Asy-Syafi'i رحمه الله" }
  },
  {
    am: { text: "Jangan menunggu mood datang baru bergerak. Eksekusi 5 menit pertama, maka fokus otak akan mengikuti dengan sendirinya.", src: "Prinsip Neuro-Disiplin" },
    pm: { text: "Jika jiwamu enggan menanggung beratnya menuntut ilmu sesaat, ia harus siap menanggung pedihnya kebodohan.", src: "Hikmah Ulama Salaf" }
  },
  {
    am: { text: "Bersegeralah melakukan amal shalih dan menyelesaikan tanggungan sebelum datang kesibukan yang mendadak.", src: "Taktik Manajemen Waktu Islam" },
    pm: { text: "Sedikit demi sedikit yang dilakukan secara konsisten setiap hari jauh lebih kokoh daripada sistem kebut semalam.", src: "Prinsip Istiqomah" }
  },
  {
    am: { text: "Ya Allah, berkahilah waktu pagi ini dan bukakanlah pemahaman yang tajam atas setiap bab fiqh yang kupelajari.", src: "Doa Penuntut Ilmu" },
    pm: { text: "Tidur tepat waktu di jam 22:30 adalah bagian dari strategi belajar; di saat itulah otak mengunci hafalanmu.", src: "Fisiologi Memori & Sirkadian" }
  },
  {
    am: { text: "Mukmin yang kuat lebih dicintai Allah سبحانه وتعالى. Jaga fisikmu, jaga ritme belajarmu, dan jangan pernah putus asa.", src: "Inspirasi HR. Muslim" },
    pm: { text: "Memahami titik khilaf ulama membutuhkan ketenangan pikiran. Cicil satu bab malam ini dengan penuh kesabaran.", src: "Metodologi Tafaqquh" }
  },
  {
    am: { text: "Hari baru adalah amunisi baru. Jika kemarin ada sesi yang terlewat, bayar tuntas di jam kosong hari ini.", src: "Mentalitas Taktis" },
    pm: { text: "Barangsiapa bersungguh-sungguh di atas jalur yang terukur, ia pasti akan sampai pada tujuannya.", src: "Kaidah Perjuangan" }
  },
  {
    am: { text: "Ilmu itu ibarat buruan, dan mencatat skemanya adalah pengikatnya. Ikatlah buruanmu dengan tali yang kokoh.", src: "Nasihat Imam Asy-Syafi'i رحمه الله" },
    pm: { text: "Saat rasa kantuk dan jenuh menyerang di sore hari, beralihlah ke latihan berhitung Faraidh agar otak kembali aktif.", src: "Strategi Kognitif" }
  },
  {
    am: { text: "Kesuksesan saat UAS tanggal 29 November nanti dibangun dari potongan-potongan 25 menit yang kamu menangkan pagi ini.", src: "Fokus Eksekusi" },
    pm: { text: "Jangan biarkan tumpukan halaman membuatmu gentar. Fokus saja menaklukkan 1 sesi Pomodoro di depan matamu.", src: "Prinsip Chunking" }
  }
];

// 4. PETA TIMELINE 25+ HARI EFEKTIF (3 NOVEMBER – 28 NOVEMBER 2026)
const TIMELINE_PLAN = [
  // FASE 1: 3 - 7 NOVEMBER
  { date: '2026-11-03', label: 'Selasa, 3 Nov', phase: 1, focus: 'Kick-off Fase 1: Bahts Faraidh #1, Video Faraidh 1–3, Adilatul Ahkam Bab 1', tasks: [
    { id: 't_quran', title: 'Murojaah & Ziyadah Al-Qur’an Pagi', slot: '05:00–07:45' },
    { id: 't_adilah', title: 'Adilatul Ahkam: Peta Konsep & Bab 1 (1–2 Sesi)', slot: '05:00–07:45' },
    { id: 't_bahts', title: 'Eksekusi Bahts Faraidh (Bagian 1)', slot: '10:00–13:00' },
    { id: 't_faraidh', title: 'Playlist Faraidh: Tonton & Catat Video #1–3', slot: '13:30–17:00' },
    { id: 't_muamalat', title: 'Fiqihul Muamalat (Materi Pasca-UTS 1): 1 Bab Khilaf', slot: '19:30–22:30' }
  ]},
  { date: '2026-11-04', label: 'Rabu, 4 Nov', phase: 1, focus: 'Bahts Faraidh #2, Video Faraidh 4–6, Fiqihul Usroh Bab 1', tasks: [
    { id: 't_quran', title: 'Murojaah & Ziyadah Al-Qur’an Pagi', slot: '05:00–07:45' },
    { id: 't_adilah', title: 'Adilatul Ahkam: Pendalaman Dalil & Istidlal (2 Sesi)', slot: '05:00–07:45' },
    { id: 't_bahts', title: 'Lanjutkan Bahts Faraidh (Bagian 2)', slot: '10:00–13:00' },
    { id: 't_faraidh', title: 'Playlist Faraidh: Video #4–6 (Sela Jam Kosong)', slot: '10:00–13:00' },
    { id: 't_usroh', title: 'Fiqihul Usroh (Bidayah): Bedah Khilaf & Dalil Bab 1', slot: '19:30–22:30' }
  ]},
  { date: '2026-11-05', label: 'Kamis, 5 Nov', phase: 1, focus: 'Tuntaskan Bahts Faraidh, Video Faraidh 7–9, Muamalat Lanjutan', tasks: [
    { id: 't_quran', title: 'Murojaah & Ziyadah Al-Qur’an Pagi', slot: '05:00–07:45' },
    { id: 't_adilah', title: 'Adilatul Ahkam: Bab 2 (2 Sesi Fokus)', slot: '05:00–07:45' },
    { id: 't_bahts', title: 'Finalisasi Bahts Faraidh Sampai Tuntas', slot: '10:00–15:00' },
    { id: 't_faraidh', title: 'Playlist Faraidh: Video #7–9 + Latihan', slot: '10:00–15:00' },
    { id: 't_muamalat', title: 'Fiqihul Muamalat (Materi UTS 2): Rangkum Aqwal & Dalil', slot: '19:30–22:30' }
  ]},
  { date: '2026-11-06', label: 'Jumat, 6 Nov', phase: 1, focus: 'Mulai Khittoh Bahts Fiqh, Cicil Nizhom Hal 1–5, Video Faraidh 10–13', tasks: [
    { id: 't_quran', title: 'Murojaah Al-Qur’an & Al-Kahfi Pagi', slot: '05:00–08:30' },
    { id: 't_adilah', title: 'Adilatul Ahkam: Bab 3 (2–3 Sesi)', slot: '05:00–08:30' },
    { id: 't_bahts', title: 'Bahts Fiqh: Buat Khittoh & Kumpulkan Referensi', slot: '13:30–17:30' },
    { id: 't_nizhom', title: 'Nizhom Ijroat Jazaiyyah: Baca & Tandai Hal 1–5', slot: '13:30–17:30' },
    { id: 't_faraidh', title: 'Playlist Faraidh: Video #10–13 (4 Video)', slot: '13:30–17:30' },
    { id: 't_usroh', title: 'Fiqihul Usroh: Bedah Tahrir Khilaf Bab 2', slot: '19:30–22:30' }
  ]},
  { date: '2026-11-07', label: 'Sabtu, 7 Nov', phase: 1, focus: 'Bahts Fiqh Hal 1–2, Nizhom Hal 6–10, Video Faraidh 14–17', tasks: [
    { id: 't_quran', title: 'Murojaah & Ziyadah Al-Qur’an Pagi', slot: '05:00–08:30' },
    { id: 't_adilah', title: 'Adilatul Ahkam: Review Bab 1–3 & Lanjut Bab 4', slot: '05:00–08:30' },
    { id: 't_bahts', title: 'Bahts Fiqh: Tulis Halaman 1–2', slot: '08:30–12:30' },
    { id: 't_nizhom', title: 'Nizhom Ijroat Jazaiyyah: Cicil Hal 6–10', slot: '08:30–12:30' },
    { id: 't_faraidh', title: 'Playlist Faraidh: Video #14–17', slot: '13:30–17:30' },
    { id: 't_muamalat', title: 'Fiqihul Muamalat: Bedah 2 Masalah Khilafiyah', slot: '19:30–22:30' }
  ]},

  // FASE 2: 8 - 21 NOVEMBER (EKSEKUSI MATERI BERAT)
  { date: '2026-11-08', label: 'Ahad, 8 Nov', phase: 2, focus: 'Masuk Fase 2: Bahts Fiqh Hal 3–4, Video Faraidh 18–20, Nizhom 11–15', tasks: [
    { id: 't_quran', title: 'Hafalan & Murojaah Al-Qur’an', slot: '05:00–07:45' },
    { id: 't_adilah', title: 'Adilatul Ahkam: Bab 5 (1–2 Sesi)', slot: '05:00–07:45' },
    { id: 't_bahts', title: 'Bahts Fiqh: Tulis Halaman 3–4', slot: '11:00–13:00' },
    { id: 't_faraidh', title: 'Playlist Faraidh: Video #18–20 + Hitung Kasus', slot: '13:00–17:00' },
    { id: 't_nizhom', title: 'Nizhom Ijroat: Cicil Hal 11–15', slot: '13:00–17:00' },
    { id: 't_usroh', title: 'Fiqihul Usroh: Bab 3 (Tahrir Khilaf & Dalil)', slot: '19:30–22:30' }
  ]},
  { date: '2026-11-09', label: 'Senin, 9 Nov', phase: 2, focus: 'Bahts Fiqh Hal 5–6, Video Faraidh 21–23, Nizhom 16–20', tasks: [
    { id: 't_quran', title: 'Hafalan & Murojaah Al-Qur’an', slot: '05:00–07:45' },
    { id: 't_adilah', title: 'Adilatul Ahkam: Bab 6 (2 Sesi Penuh)', slot: '05:00–07:45' },
    { id: 't_bahts', title: 'Bahts Fiqh: Tulis Halaman 5–6', slot: '10:00–13:00' },
    { id: 't_nizhom', title: 'Nizhom Ijroat: Cicil Hal 16–20', slot: '10:00–13:00' },
    { id: 't_faraidh', title: 'Playlist Faraidh: Video #21–23', slot: '13:00–16:00' },
    { id: 't_muamalat', title: 'Fiqihul Muamalat: Lanjutan Bab Pasca-UTS', slot: '18:30–22:30' }
  ]},
  { date: '2026-11-10', label: 'Selasa, 10 Nov', phase: 2, focus: 'Bahts Fiqh Hal 7–8, Video Faraidh 24–26, Nizhom 21–25 (50% Diktat)', tasks: [
    { id: 't_quran', title: 'Hafalan & Murojaah Al-Qur’an', slot: '05:00–07:45' },
    { id: 't_adilah', title: 'Adilatul Ahkam: Bab 7', slot: '05:00–07:45' },
    { id: 't_bahts', title: 'Bahts Fiqh: Tulis Halaman 7–8', slot: '10:00–13:30' },
    { id: 't_nizhom', title: 'Nizhom Ijroat: Cicil Hal 21–25 (Separuh Diktat!)', slot: '10:00–13:30' },
    { id: 't_faraidh', title: 'Playlist Faraidh: Video #24–26 (Separuh Playlist!)', slot: '13:30–17:30' },
    { id: 't_usroh', title: 'Fiqihul Usroh: Bab 4 (Aqwal & Adillah)', slot: '19:30–22:30' }
  ]},
  { date: '2026-11-11', label: 'Rabu, 11 Nov', phase: 2, focus: 'Bahts Fiqh Hal 9–10, Video Faraidh 27–29, Muamalat', tasks: [
    { id: 't_quran', title: 'Hafalan & Murojaah Al-Qur’an', slot: '05:00–07:45' },
    { id: 't_adilah', title: 'Adilatul Ahkam: Bab 8 (2 Sesi)', slot: '05:00–07:45' },
    { id: 't_bahts', title: 'Bahts Fiqh: Tulis Halaman 9–10', slot: '10:00–13:00' },
    { id: 't_faraidh', title: 'Playlist Faraidh: Video #27–29', slot: '10:00–13:00' },
    { id: 't_muamalat', title: 'Fiqihul Muamalat: Rangkum Skema Khilaf Malam', slot: '19:30–22:30' }
  ]},
  { date: '2026-11-12', label: 'Kamis, 12 Nov', phase: 2, focus: 'Finalisasi Total Bahts Fiqh, Video Faraidh 30–32, Nizhom 26–30', tasks: [
    { id: 't_quran', title: 'Hafalan & Murojaah Al-Qur’an', slot: '05:00–07:45' },
    { id: 't_adilah', title: 'Adilatul Ahkam: Bab 9', slot: '05:00–07:45' },
    { id: 't_bahts', title: 'Murojaah & Finalisasi Total Bahts Fiqh 10 Halaman', slot: '10:00–15:00' },
    { id: 't_nizhom', title: 'Nizhom Ijroat: Cicil Hal 26–30', slot: '10:00–15:00' },
    { id: 't_faraidh', title: 'Playlist Faraidh: Video #30–32', slot: '10:00–15:00' },
    { id: 't_usroh', title: 'Fiqihul Usroh: Bab 5 (Tahrir Khilaf)', slot: '19:30–22:30' }
  ]},
  { date: '2026-11-13', label: 'Jumat, 13 Nov', phase: 2, focus: 'Bebas Beban Bahts! Fokus Video Faraidh 33–36, Nizhom 31–35', tasks: [
    { id: 't_quran', title: 'Murojaah Al-Qur’an & Al-Kahfi', slot: '05:00–08:30' },
    { id: 't_adilah', title: 'Adilatul Ahkam: Bab 10 + Review Poin Sulit', slot: '05:00–08:30' },
    { id: 't_nizhom', title: 'Nizhom Ijroat: Cicil Hal 31–35', slot: '13:30–17:30' },
    { id: 't_faraidh', title: 'Playlist Faraidh: Video #33–36 (4 Video)', slot: '13:30–17:30' },
    { id: 't_muamalat', title: 'Fiqihul Muamalat: Review Materi Awal Semester', slot: '19:30–22:30' }
  ]},
  { date: '2026-11-14', label: 'Sabtu, 14 Nov', phase: 2, focus: 'Video Faraidh 37–40, Nizhom 36–40, Uqud Tijariyah Bab 1–2', tasks: [
    { id: 't_quran', title: 'Hafalan & Murojaah Al-Qur’an', slot: '05:00–08:30' },
    { id: 't_adilah', title: 'Adilatul Ahkam: Latihan Urai Argumen & Dalil', slot: '05:00–08:30' },
    { id: 't_nizhom', title: 'Nizhom Ijroat: Cicil Hal 36–40', slot: '08:30–12:30' },
    { id: 't_uqud', title: 'Uqud Tijariyah: Pahami Istilah & Kasus Bab 1–2', slot: '08:30–12:30' },
    { id: 't_faraidh', title: 'Playlist Faraidh: Video #37–40', slot: '13:30–17:30' },
    { id: 't_usroh', title: 'Fiqihul Usroh: Bab 6 (Aqwal & Adillah)', slot: '19:30–22:30' }
  ]},
  { date: '2026-11-15', label: 'Ahad, 15 Nov', phase: 2, focus: 'Video Faraidh 41–43, Nizhom 41–45, Muamalat & Usroh', tasks: [
    { id: 't_quran', title: 'Hafalan & Murojaah Al-Qur’an', slot: '05:00–07:45' },
    { id: 't_adilah', title: 'Adilatul Ahkam: Pemantapan Bab Tengah', slot: '05:00–07:45' },
    { id: 't_nizhom', title: 'Nizhom Ijroat: Cicil Hal 41–45', slot: '11:00–13:00' },
    { id: 't_faraidh', title: 'Playlist Faraidh: Video #41–43', slot: '13:00–17:00' },
    { id: 't_muamalat', title: 'Fiqihul Muamalat: Bedah Khilaf Lanjutan', slot: '19:30–22:30' }
  ]},
  { date: '2026-11-16', label: 'Senin, 16 Nov', phase: 2, focus: 'Khatam Diktat Nizhom (Hal 46–50+), Video Faraidh 44–46', tasks: [
    { id: 't_quran', title: 'Hafalan & Murojaah Al-Qur’an', slot: '05:00–07:45' },
    { id: 't_adilah', title: 'Adilatul Ahkam: Pemantapan Bab Akhir', slot: '05:00–07:45' },
    { id: 't_nizhom', title: 'Nizhom Ijroat: Tuntaskan Hal 46–50+ (Khatam Bacaan 1!)', slot: '10:00–13:00' },
    { id: 't_faraidh', title: 'Playlist Faraidh: Video #44–46', slot: '13:00–16:00' },
    { id: 't_usroh', title: 'Fiqihul Usroh: Bedah Khilaf Lanjutan', slot: '18:30–22:30' }
  ]},
  { date: '2026-11-17', label: 'Selasa, 17 Nov', phase: 2, focus: 'Khatam 49 Video Faraidh (#47–49)! Uqud Tijariyah Bab 3–4', tasks: [
    { id: 't_quran', title: 'Hafalan & Murojaah Al-Qur’an', slot: '05:00–07:45' },
    { id: 't_adilah', title: 'Adilatul Ahkam: Active Recall Tanpa Melihat Catatan', slot: '05:00–07:45' },
    { id: 't_uqud', title: 'Uqud Tijariyah: Konsep & Studi Kasus Bab 3–4', slot: '10:00–13:30' },
    { id: 't_faraidh', title: 'Playlist Faraidh: Tuntaskan Video #47–49 (KHATAM!)', slot: '13:30–17:30' },
    { id: 't_muamalat', title: 'Fiqihul Muamalat: Pemantapan Tahrir Khilaf', slot: '19:30–22:30' }
  ]},
  { date: '2026-11-18', label: 'Rabu, 18 Nov', phase: 2, focus: 'Latihan Soal Faraidh Komprehensif, Adilatul Ahkam, Usroh', tasks: [
    { id: 't_quran', title: 'Hafalan & Murojaah Al-Qur’an', slot: '05:00–07:45' },
    { id: 't_adilah', title: 'Adilatul Ahkam: Bedah Soal Tahun Lalu / Kisi-kisi', slot: '05:00–07:45' },
    { id: 't_faraidh', title: 'Faraidh: Praktik Mandiri Hitung 5 Kasus Waris', slot: '10:00–13:00' },
    { id: 't_usroh', title: 'Fiqihul Usroh: Rangkum Bab-bab Terakhir', slot: '19:30–22:30' }
  ]},
  { date: '2026-11-19', label: 'Kamis, 19 Nov', phase: 2, focus: 'Uqud Tijariyah Bab 5–6, Review Nizhom Ijroat, Muamalat', tasks: [
    { id: 't_quran', title: 'Hafalan & Murojaah Al-Qur’an', slot: '05:00–07:45' },
    { id: 't_adilah', title: 'Adilatul Ahkam: Uji Ingatan Kaidah & Dalil', slot: '05:00–07:45' },
    { id: 't_uqud', title: 'Uqud Tijariyah: Bab 5–6 & Transaksi Bank', slot: '10:00–15:00' },
    { id: 't_nizhom', title: 'Nizhom Ijroat: Review Cepat Poin Prosedur Penting', slot: '10:00–15:00' },
    { id: 't_muamalat', title: 'Fiqihul Muamalat: Simulasi Essay Tahrir Khilaf', slot: '19:30–22:30' }
  ]},
  { date: '2026-11-20', label: 'Jumat, 20 Nov', phase: 2, focus: 'Simulasi Hitung Faraidh (Ashabah, Hajb, Aul, Radd), Usroh', tasks: [
    { id: 't_quran', title: 'Murojaah Al-Qur’an & Al-Kahfi', slot: '05:00–08:30' },
    { id: 't_adilah', title: 'Adilatul Ahkam: Fokus Bab Paling Rawan Lupa', slot: '05:00–08:30' },
    { id: 't_faraidh', title: 'Faraidh: Drill Kasus Aul, Radd, & Munaskhot', slot: '13:30–17:30' },
    { id: 't_usroh', title: 'Fiqihul Usroh: Simulasi Essay Aqwal & Dalil', slot: '19:30–22:30' }
  ]},
  { date: '2026-11-21', label: 'Sabtu, 21 Nov', phase: 2, focus: 'Penutupan Fase 2: Khatamkan Seluruh Ringkasan Muamalat & Usroh', tasks: [
    { id: 't_quran', title: 'Hafalan & Murojaah Al-Qur’an', slot: '05:00–08:30' },
    { id: 't_adilah', title: 'Adilatul Ahkam: Review Menyeluruh Peta Konsep', slot: '05:00–08:30' },
    { id: 't_uqud', title: 'Uqud Tijariyah: Tuntaskan Seluruh Bab Tersisa', slot: '08:30–12:30' },
    { id: 't_muamalat', title: 'Muamalat & Usroh: Pastikan Semua Bab Punya Peta Khilaf', slot: '19:30–22:30' }
  ]},

  // FASE 3: 22 - 28 NOVEMBER (KONSOLIDASI & ACTIVE RECALL)
  { date: '2026-11-22', label: 'Ahad, 22 Nov', phase: 3, focus: 'Masuk Fase 3 (H-7 UAS): Active Recall Faraidh & Adilatul Ahkam', tasks: [
    { id: 't_quran', title: 'Murojaah Al-Qur’an (Uji Kelancaran Full)', slot: '05:00–07:45' },
    { id: 't_adilah', title: 'Adilatul Ahkam: Simulasi Tanya-Jawab Mandiri', slot: '05:00–07:45' },
    { id: 't_faraidh', title: 'Faraidh: Latihan Soal Tanpa Melihat Rumus', slot: '13:00–17:00' },
    { id: 't_muamalat', title: 'Muamalat: Recall Cepat Titik Khilaf Tiap Bab', slot: '19:30–22:30' }
  ]},
  { date: '2026-11-23', label: 'Senin, 23 Nov', phase: 3, focus: 'H-6 UAS: Pemantapan Nizhom Ijroat & Fiqihul Usroh', tasks: [
    { id: 't_quran', title: 'Murojaah Al-Qur’an', slot: '05:00–07:45' },
    { id: 't_nizhom', title: 'Nizhom Ijroat: Hafalkan Syarat & Tahapan Prosedur', slot: '10:00–13:00' },
    { id: 't_uqud', title: 'Uqud Tijariyah: Review Definisi & Hukum Akad', slot: '13:00–16:00' },
    { id: 't_usroh', title: 'Fiqihul Usroh: Recall Cepat Aqwal & Dalil Utama', slot: '18:30–22:30' }
  ]},
  { date: '2026-11-24', label: 'Selasa, 24 Nov', phase: 3, focus: 'H-5 UAS: Drill Faraidh & Muamalat', tasks: [
    { id: 't_quran', title: 'Murojaah Al-Qur’an', slot: '05:00–07:45' },
    { id: 't_adilah', title: 'Adilatul Ahkam: Review Ringkas 30 Menit', slot: '05:00–07:45' },
    { id: 't_faraidh', title: 'Faraidh: Kecepatan & Ketepatan Hitung Masail', slot: '13:30–17:30' },
    { id: 't_muamalat', title: 'Fiqihul Muamalat: Pemantapan Dalil Tarjih', slot: '19:30–22:30' }
  ]},
  { date: '2026-11-25', label: 'Rabu, 25 Nov', phase: 3, focus: 'H-4 UAS: Konsolidasi Nizhom, Uqud, & Usroh', tasks: [
    { id: 't_quran', title: 'Murojaah Al-Qur’an', slot: '05:00–07:45' },
    { id: 't_nizhom', title: 'Nizhom & Uqud: Uji Ingatan Poin Kunci', slot: '10:00–13:00' },
    { id: 't_usroh', title: 'Fiqihul Usroh: Pemantapan Bab Nikah–Thalaq', slot: '19:30–22:30' }
  ]},
  { date: '2026-11-26', label: 'Kamis, 26 Nov', phase: 3, focus: 'H-3 UAS: Fokus Matkul Hari-Hari Pertama Ujian', tasks: [
    { id: 't_quran', title: 'Murojaah Al-Qur’an', slot: '05:00–07:45' },
    { id: 't_adilah', title: 'Adilatul Ahkam & Faraidh: Pemanasan Akhir', slot: '10:00–15:00' },
    { id: 't_muamalat', title: 'Fokus Matkul Ujian Pekan Pertama', slot: '19:30–22:30' }
  ]},
  { date: '2026-11-27', label: 'Jumat, 27 Nov', phase: 3, focus: 'H-2 UAS: Murojaah Terfokus Matkul Ujian Hari Pertama & Kedua', tasks: [
    { id: 't_quran', title: 'Murojaah Al-Qur’an & Doa Pagi', slot: '05:00–08:30' },
    { id: 't_faraidh', title: 'Bedah Kisi-kisi Matkul Ujian Hari Pertama', slot: '13:30–17:30' },
    { id: 't_muamalat', title: 'Active Recall Ringkasan Matkul Hari Pertama', slot: '19:30–22:30' }
  ]},
  { date: '2026-11-28', label: 'Sabtu, 28 Nov', phase: 3, focus: 'H-1 UAS: Persiapan Tenang Matkul Esok Hari & Tidur Tepat 22:00', tasks: [
    { id: 't_quran', title: 'Murojaah Al-Qur’an & Ketenangan Hati', slot: '05:00–08:30' },
    { id: 't_faraidh', title: 'Review Santai & Mantapkan Poin Matkul Besok', slot: '08:30–16:00' },
    { id: 't_muamalat', title: 'Siapkan Alat Tulis, Berdoa, & Tidur Awal 22:00', slot: '19:30–21:30' }
  ]}
];
/* ==========================================================================
   FINAL OPS 25 — TACTICAL STUDY ENGINE (app.js - BAGIAN 2/2)
   Mesin Logika Jam Kosong, Spillover, Tracker, & UI Controller
   ========================================================================== */

let appState = {
  bahts: DEFAULT_BAHTS,
  faraidhCount: 0,
  dailyCompleted: {},
  timelineNotes: {},
  streak: 0,
  lastActiveDate: ''
};

// LOAD STATE FROM LOCALSTORAGE
function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      appState = { ...appState, ...parsed };
    }
  } catch (e) {
    console.error('Gagal memuat state:', e);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch (e) {
    console.error('Gagal menyimpan state:', e);
  }
}

// HELPER: FORMAT TANGGAL YYYY-MM-DD LOKAL
function getTodayDateString(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// INIT UTAMA SAAT HALAMAN DIBUKA
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  checkStreakAndResetDaily();
  initApp();
  setInterval(updateLiveEngine, 1000);
});

function checkStreakAndResetDaily() {
  const todayStr = getTodayDateString();
  if (appState.lastActiveDate !== todayStr) {
    // Hari baru, reset centang harian tapi pertahankan bahts & faraidh
    appState.dailyCompleted = {};
    if (appState.lastActiveDate) {
      // Cek apakah kemarin sempat aktif, jika ya tambah streak
      const lastDate = new Date(appState.lastActiveDate);
      const currDate = new Date(todayStr);
      const diffDays = Math.round((currDate - lastDate) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        appState.streak += 1;
      } else if (diffDays > 1) {
        appState.streak = 1;
      }
    } else {
      appState.streak = 1;
    }
    appState.lastActiveDate = todayStr;
    saveState();
  }
}

function initApp() {
  updateHeaderInfo();
  updateReadinessAndStreak();
  renderBahtsSection();
  renderFaraidhTracker();
  renderDailyTasks();
  renderWeeklyScheduleTabs();
  renderTimelineView('all');
  updateLiveEngine();
}

// HEADER & COUNTDOWN
function updateHeaderInfo() {
  const now = new Date();
  const diffTime = EXAM_DATE - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  document.getElementById('countdown-days').innerText = Math.max(0, diffDays);

  // Tentukan Fase
  const todayStr = getTodayDateString(now);
  let phaseText = 'FASE 1 • PONDASI & ELIMINASI';
  let badgeEl = document.getElementById('current-phase-badge');

  if (todayStr >= '2026-11-08' && todayStr <= '2026-11-21') {
    phaseText = 'FASE 2 • EKSEKUSI MATERI BERAT';
  } else if (todayStr >= '2026-11-22') {
    phaseText = 'FASE 3 • KONSOLIDASI & RECALL';
  }
  if (badgeEl) badgeEl.innerText = phaseText;

  // Tanggal Hari Ini string Indonesia
  const options = { weekday: 'long', day: 'numeric', month: 'short' };
  document.getElementById('current-date-str').innerText = now.toLocaleDateString('id-ID', options);

  // Quote Shift & Day Index
  renderQuotes(now);
}

function renderQuotes(now) {
  const hour = now.getHours();
  const isMorning = hour >= 5 && hour < 13.5;
  const shiftLabel = isMorning ? 'BOOST PAGI — SIANG' : 'BOOST SORE — MALAM';
  document.getElementById('quote-shift-label').innerText = shiftLabel;

  // Pilih quote berdasarkan hari ke-N dari 3 Nov
  const startDate = new Date(2026, 10, 3);
  const diffTime = Math.abs(now - startDate);
  const dayIdx = Math.floor(diffTime / (1000 * 60 * 60 * 24)) % QUOTES_DB.length;
  
  document.getElementById('quote-day-index').innerText = `Hari #${Math.min(25, dayIdx + 1)} / 25`;
  
  const qData = QUOTES_DB[dayIdx];
  const activeQ = isMorning ? qData.am : qData.pm;
  document.getElementById('quote-content').innerText = `"${activeQ.text}"`;
  document.getElementById('quote-author').innerText = `— ${activeQ.src}`;
}

// DOPAMINE READINESS & STREAK
function updateReadinessAndStreak() {
  // Hitung progress global: Faraidh (bobot 30%), Bahts (bobot 30%), Daily Tasks (bobot 40%)
  const faraidhPct = (appState.faraidhCount / 49) * 30;
  
  let bahtsDone = 0;
  let bahtsTotal = 0;
  appState.bahts.forEach(b => {
    b.steps.forEach(s => {
      bahtsTotal++;
      if (s.done) bahtsDone++;
    });
    if (b.completed) bahtsDone += 2; // bonus jika selesai total
  });
  const bahtsPct = bahtsTotal > 0 ? Math.min(30, (bahtsDone / (bahtsTotal + 4)) * 30) : 0;

  // Daily Tasks hari ini
  const todayStr = getTodayDateString();
  const todayPlan = TIMELINE_PLAN.find(p => p.date === todayStr) || TIMELINE_PLAN[0];
  let taskTotal = todayPlan.tasks.length;
  let taskDone = 0;
  todayPlan.tasks.forEach(t => {
    if (appState.dailyCompleted[t.id]) taskDone++;
  });
  const taskPct = taskTotal > 0 ? (taskDone / taskTotal) * 40 : 0;

  const totalReadiness = Math.round(faraidhPct + bahtsPct + taskPct);

  document.getElementById('global-readiness-text').innerText = `${totalReadiness}%`;
  document.getElementById('global-readiness-bar').style.width = `${totalReadiness}%`;
  document.getElementById('streak-counter').innerText = `🔥 ${appState.streak}`;
}

// LIVE CIRCADIAN ENGINE & SPILLOVER RECOM
function updateLiveEngine() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const timeStr = String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0');
  
  const clockEl = document.getElementById('live-clock');
  if (clockEl) clockEl.innerText = timeStr;

  const dayOfWeek = now.getDay(); // 0 = Ahad ... 6 = Sabtu
  const scheduleDay = WEEKLY_SCHEDULE[dayOfWeek];

  let currentSlot = null;
  for (let slot of scheduleDay.slots) {
    if (timeStr >= slot.start && timeStr < slot.end) {
      currentSlot = slot;
      break;
    }
  }

  const radarCard = document.getElementById('circadian-radar');
  const radarDot = document.getElementById('radar-dot');
  const radarModeText = document.getElementById('radar-mode-text');
  const slotTitle = document.getElementById('radar-slot-title');
  const slotDesc = document.getElementById('radar-slot-desc');
  const recContainer = document.getElementById('radar-recommendations');

  if (!currentSlot) {
    // Di luar jam terdaftar (misal malam lewat 22:30 atau dini hari sebelum 05:00)
    radarCard.className = 'radar-card radar-standby';
    radarDot.className = 'pulse-dot off';
    radarModeText.innerText = 'WAKTU ISTIRAHAT / DI LUAR JADWAL';
    slotTitle.innerText = 'Patuhi Jam Tidur (22:30 – 05:00)';
    slotDesc.innerText = 'Pulihkan memori jangka panjang dan istirahatkan fisik.';
    recContainer.innerText = 'Matikan layar, siapkan fisik untuk sesi Subuh esok hari.';
    return;
  }

  // Set Theme & Tampilan berdasarkan Circadian Window
  radarCard.className = `radar-card radar-${currentSlot.theme}`;
  radarDot.className = 'pulse-dot';

  if (currentSlot.type === 'class') {
    radarModeText.innerText = 'JAM KULIAH BERLANGSUNG';
    slotTitle.innerText = currentSlot.title;
    slotDesc.innerText = currentSlot.rec;
    recContainer.innerText = 'Fokus penuh di kelas. Catat kisi-kisi dosen. Jangan buka materi lain.';
  } else {
    radarModeText.innerText = 'JAM KOSONG AKTIF — EKSEKUSI';
    slotTitle.innerText = currentSlot.title;
    slotDesc.innerText = `Rentang Waktu: ${currentSlot.start} - ${currentSlot.end}`;
    
    // SPILLOVER LOGIC: Cek task hari ini yang belum selesai untuk dimasukkan sebagai rekomendasi
    const todayStr = getTodayDateString();
    const todayPlan = TIMELINE_PLAN.find(p => p.date === todayStr) || TIMELINE_PLAN[0];
    const uncompletedTasks = todayPlan.tasks.filter(t => !appState.dailyCompleted[t.id]);

    if (uncompletedTasks.length > 0) {
      let recHtml = `Default Slot: ${currentSlot.rec}<br>`;
      recHtml += `<span style="color: #34D399; font-weight: 700;">⚡ Spillover Prioritas Belum Selesai:</span> ${uncompletedTasks[0].title}`;
      recContainer.innerHTML = recHtml;
    } else {
      recContainer.innerText = currentSlot.rec;
    }
  }
}

// RENDER BAHTS SECTION (PERSISTENT AUTO-ROLLOVER)
function renderBahtsSection() {
  const container = document.getElementById('bahts-container');
  const summaryBadge = document.getElementById('bahts-status-summary');
  if (!container) return;

  let activeCount = 0;
  let html = '';

  appState.bahts.forEach(b => {
    if (!b.completed) activeCount++;
    html += `
      <div class="bahts-card" style="${b.completed ? 'opacity: 0.55; border-color: rgba(16,185,129,0.3);' : ''}">
        <div class="bahts-top">
          <div>
            <div class="bahts-title">${b.title} ${b.completed ? '✅ (SELESAI)' : ''}</div>
            <div class="bahts-sub">${b.subtitle}</div>
          </div>
        </div>
        <div class="bahts-steps">
    `;

    b.steps.forEach(s => {
      html += `<div class="step-chip ${s.done ? 'done' : ''}" onclick="toggleBahtsStep('${b.id}', '${s.id}')">${s.label}</div>`;
    });

    html += `
        </div>
        <button class="btn-finish-bahts" onclick="toggleBahtsComplete('${b.id}')">
          ${b.completed ? '↩️ Batalkan Status Selesai' : '✓ Tandai Selesai Total (Hapus Tanggungan)'}
        </button>
      </div>
    `;
  });

  container.innerHTML = html;
  summaryBadge.innerText = `${activeCount} Masih Aktif`;
  updateReadinessAndStreak();
}

function toggleBahtsStep(bahtsId, stepId) {
  const b = appState.bahts.find(item => item.id === bahtsId);
  if (b) {
    const s = b.steps.find(st => st.id === stepId);
    if (s) {
      s.done = !s.done;
      saveState();
      renderBahtsSection();
    }
  }
}

function toggleBahtsComplete(bahtsId) {
  const b = appState.bahts.find(item => item.id === bahtsId);
  if (b) {
    b.completed = !b.completed;
    if (b.completed) {
      b.steps.forEach(s => s.done = true);
    }
    saveState();
    renderBahtsSection();
  }
}

// RENDER FARAIDH TRACKER
function renderFaraidhTracker() {
  const bar = document.getElementById('faraidh-bar');
  const badge = document.getElementById('faraidh-pct-badge');
  const paceInfo = document.getElementById('faraidh-pace-info');
  if (!bar) return;

  const count = appState.faraidhCount;
  const pct = Math.round((count / 49) * 100);

  bar.style.width = `${pct}%`;
  badge.innerText = `${count} / 49 Video (${pct}%)`;

  let paceMsg = 'Target: ~3 video/hari';
  if (count >= 49) {
    paceMsg = '🏆 Luar Biasa! Playlist Faraidh Khatam Total!';
  } else if (count >= 30) {
    paceMsg = '🔥 Sangat Cepat! Menjelang garis akhir Faraidh.';
  }
  paceInfo.innerText = paceMsg;
  updateReadinessAndStreak();
}

function updateFaraidh(delta) {
  appState.faraidhCount = Math.max(0, Math.min(49, appState.faraidhCount + delta));
  saveState();
  renderFaraidhTracker();
}

// DAILY FLEXIBLE CHECKLIST
function renderDailyTasks() {
  const container = document.getElementById('daily-tasks-container');
  const badge = document.getElementById('daily-progress-badge');
  if (!container) return;

  const todayStr = getTodayDateString();
  const todayPlan = TIMELINE_PLAN.find(p => p.date === todayStr) || TIMELINE_PLAN[0];

  let completedCount = 0;
  let html = '';

  todayPlan.tasks.forEach(t => {
    const isDone = !!appState.dailyCompleted[t.id];
    if (isDone) completedCount++;

    html += `
      <div class="task-item ${isDone ? 'completed' : ''}" onclick="toggleDailyTask('${t.id}')">
        <div class="task-checkbox">${isDone ? '✓' : ''}</div>
        <div class="task-body">
          <div class="task-title">${t.title}</div>
          <div class="task-meta">
            <span>Rekomendasi Slot:</span>
            <span class="slot-tag">${t.slot}</span>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  badge.innerText = `${completedCount}/${todayPlan.tasks.length} Selesai`;
  updateReadinessAndStreak();
}

function toggleDailyTask(taskId) {
  appState.dailyCompleted[taskId] = !appState.dailyCompleted[taskId];
  saveState();
  renderDailyTasks();
  updateLiveEngine(); // perbarui spillover rekomendasi jam kosong
}

// WEEKLY FREE SLOTS TABS (AHAD - SABTU)
function renderWeeklyScheduleTabs() {
  const tabsContainer = document.getElementById('day-tabs-container');
  const slotsList = document.getElementById('day-slots-list');
  if (!tabsContainer || !slotsList) return;

  let tabsHtml = '';
  for (let dayNum = 0; dayNum <= 6; dayNum++) {
    const dayData = WEEKLY_SCHEDULE[dayNum];
    const isToday = new Date().getDay() === dayNum;
    tabsHtml += `
      <button class="day-btn ${isToday ? 'active' : ''}" onclick="switchScheduleDay(${dayNum}, this)">
        ${dayData.name} ${isToday ? '• (Hari Ini)' : ''}
      </button>
    `;
  }
  tabsContainer.innerHTML = tabsHtml;
  renderDaySlots(new Date().getDay());
}

function switchScheduleDay(dayNum, btnEl) {
  document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
  btnEl.classList.add('active');
  renderDaySlots(dayNum);
}

function renderDaySlots(dayNum) {
  const slotsList = document.getElementById('day-slots-list');
  const dayData = WEEKLY_SCHEDULE[dayNum];

  let html = '';
  dayData.slots.forEach(s => {
    const isClass = s.type === 'class';
    html += `
      <div class="slot-row" style="${isClass ? 'color: #94A3B8;' : 'color: #F8FAFC;'}">
        <span style="font-weight: 700; min-width: 95px;">${s.start} - ${s.end}</span>
        <span style="flex: 1; padding: 0 8px;"><b>${s.title}</b><br><span style="font-size: 0.72rem; color: var(--text-muted);">${s.rec}</span></span>
        <span style="font-size: 0.68rem; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: ${isClass ? 'rgba(148,163,184,0.1)' : 'rgba(16,185,129,0.12)'}; color: ${isClass ? '#94A3B8' : '#34D399'}; height: fit-content;">${isClass ? 'Kuliah' : 'Kosong'}</span>
      </div>
    `;
  });
  slotsList.innerHTML = html;
}

// TAB 2: TIMELINE 25 HARI
function renderTimelineView(phaseFilter) {
  const container = document.getElementById('timeline-container');
  if (!container) return;

  const todayStr = getTodayDateString();
  let html = '';

  TIMELINE_PLAN.forEach(p => {
    if (phaseFilter !== 'all' && p.phase !== phaseFilter) return;

    const isToday = p.date === todayStr;
    const userNote = appState.timelineNotes[p.date] || '';

    html += `
      <div class="tl-card ${isToday ? 'today' : ''}">
        <div class="tl-header">
          <div class="tl-date">${p.label} ${isToday ? '⭐ (HARI INI)' : ''}</div>
          <div class="tl-phase">Fase ${p.phase}</div>
        </div>
        <div style="font-size: 0.82rem; font-weight: 600; color: var(--accent-cyan); margin-bottom: 8px;">
          🎯 ${p.focus}
        </div>
        <div style="font-size: 0.76rem; color: var(--text-muted); margin-bottom: 6px;">
          <b>Target Eksekusi:</b>
          <ul style="padding-left: 16px; margin-top: 2px;">
    `;

    p.tasks.forEach(t => {
      const isDone = appState.dailyCompleted && p.date === todayStr && appState.dailyCompleted[t.id];
      html += `<li style="${isDone ? 'text-decoration: line-through; color: #64748B;' : ''}">${t.title} <span style="color:var(--accent-amber)">(${t.slot})</span></li>`;
    });

    html += `
          </ul>
        </div>
        <input type="text" class="tl-note-input" placeholder="Catatan tambahan / jadwal UTS dadakan..." value="${userNote}" oninput="saveTimelineNote('${p.date}', this.value)" />
      </div>
    `;
  });

  container.innerHTML = html;
}

function filterTimeline(phase, btnEl) {
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  btnEl.classList.add('active');
  renderTimelineView(phase);
}

function saveTimelineNote(dateStr, val) {
  appState.timelineNotes[dateStr] = val;
  saveState();
}

// TAB SWITCHER
function switchTab(tabName) {
  const cmdTab = document.getElementById('tab-command');
  const tlTab = document.getElementById('tab-timeline');
  const btnCmd = document.getElementById('nav-btn-command');
  const btnTl = document.getElementById('nav-btn-timeline');

  if (tabName === 'command') {
    cmdTab.classList.remove('hidden');
    tlTab.classList.add('hidden');
    btnCmd.classList.add('active');
    btnTl.classList.remove('active');
  } else {
    cmdTab.classList.add('hidden');
    tlTab.classList.remove('hidden');
    btnCmd.classList.remove('active');
    btnTl.classList.add('active');
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

