export const initialCampaigns = [
  {
    id: 'sd-satu-demi-satu',
    name: 'Satu Demi Satu untuk SD',
    jenjang: 'SD',
    target: 500000000,
    collected: 387500000,
    donorCount: 420,
    studentsHelped: 1550,
    description: 'Paket bantuan berupa baju, sepatu, tas, dan alat tulis untuk siswa sekolah dasar rawan putus sekolah.',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
    packages: [
      { id: 'sd-1', name: 'Paket 1', duration: '1 Tahun Ajaran', amount: 250000, desc: 'Baju, sepatu, tas, & alat tulis untuk 1 tahun' },
      { id: 'sd-2', name: 'Paket 2', duration: '3 Tahun Ajaran', amount: 750000, desc: 'Perlengkapan sekolah lengkap untuk 3 tahun ajaran' },
      { id: 'sd-3', name: 'Paket 3', duration: '6 Tahun Ajaran', amount: 1500000, desc: 'Pendampingan penuh sampai lulus SD' }
    ]
  },
  {
    id: 'smp-satu-demi-satu',
    name: 'Satu Demi Satu untuk SMP',
    jenjang: 'SMP',
    target: 400000000,
    collected: 279000000,
    donorCount: 295,
    studentsHelped: 930,
    description: 'Paket bantuan berupa seragam putih-biru, sepatu, tas, buku pelajaran, dan alat tulis untuk siswa SMP.',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    packages: [
      { id: 'smp-1', name: 'Paket 1', duration: '1 Tahun Ajaran', amount: 300000, desc: 'Seragam, sepatu, & perlengkapan belajar 1 tahun' },
      { id: 'smp-2', name: 'Paket 2', duration: '3 Tahun Ajaran', amount: 900000, desc: 'Bantuan tuntas 3 tahun sampai lulus SMP' }
    ]
  },
  {
    id: 'sma-satu-demi-satu',
    name: 'Satu Demi Satu untuk SMA/SMK',
    jenjang: 'SMA/SMK',
    target: 350000000,
    collected: 215000000,
    donorCount: 180,
    studentsHelped: 475,
    description: 'Paket bantuan penunjang pendidikan vokasi & menengah atas bagi anak berprestasi dari keluarga prasejahtera.',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    packages: [
      { id: 'sma-1', name: 'Paket 1', duration: '1 Tahun Ajaran', amount: 450000, desc: 'Seragam, sepatu, tas, & penunjang modul kejuruan' },
      { id: 'sma-2', name: 'Paket 2', duration: '3 Tahun Ajaran', amount: 1350000, desc: 'Biaya perlengkapan belajar tuntas hingga lulus' }
    ]
  },
  {
    id: 'khusus-pelosok-3t',
    name: 'Bantuan Pendidikan Anak Daerah 3T',
    jenjang: 'Semua Jenjang',
    target: 250000000,
    collected: 168000000,
    donorCount: 145,
    studentsHelped: 420,
    description: 'Ekspedisi penyaluran paket sekolah untuk anak-anak di daerah Terdepan, Terluar, dan Tertinggal.',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
    packages: [
      { id: '3t-1', name: 'Paket Ekspedisi 1 Anak', duration: '1 Tahun', amount: 400000, desc: 'Seragam tahan cuaca, tas ransel anti air, sepatu, & buku' },
      { id: '3t-2', name: 'Paket Kolektif 1 Kelas', duration: '1 Tahun', amount: 4000000, desc: 'Bantuan 10 anak di pelosok perbatasan' }
    ]
  }
];

export const initialAnakAsuh = [
  {
    id: 'AA-001',
    nama: 'Budi Santoso',
    jenjang: 'SD',
    kelas: 'Kelas 4',
    umur: 10,
    sekolah: 'SDN 02 Karanganyar',
    kota: 'Cilacap',
    provinsi: 'Jawa Tengah',
    kebutuhan: 'Sepatu (ukuran 35), tas sekolah, dan buku tulis',
    status: 'Didampingi',
    ortuAsuhId: 'DNR-001',
    ortuAsuhNama: 'Ir. Hendra Wijaya',
    cerita: 'Budi anak pertama dari 3 bersaudara. Ayahnya bekerja sebagai buruh tani lepas. Budi bercita-cita menjadi guru matematika.',
    foto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'AA-002',
    nama: 'Siti Rahmawati',
    jenjang: 'SD',
    kelas: 'Kelas 2',
    umur: 8,
    sekolah: 'SDN 01 Labuan',
    kota: 'Pandeglang',
    provinsi: 'Banten',
    kebutuhan: 'Seragam merah putih, sepatu, dan perlengkapan menggambar',
    status: 'Menunggu Donatur',
    ortuAsuhId: null,
    ortuAsuhNama: null,
    cerita: 'Siti gemar menggambar dan bercita-cita menjadi arsitek. Ibunya seorang penenun tradisional.',
    foto: 'https://images.unsplash.com/photo-1595454223600-91fb57147db1?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'AA-003',
    nama: 'Ahmad Faiz',
    jenjang: 'SMP',
    kelas: 'Kelas 8',
    umur: 14,
    sekolah: 'SMPN 3 Cisolok',
    kota: 'Sukabumi',
    provinsi: 'Jawa Barat',
    kebutuhan: 'Seragam putih-biru, tas ransel, buku penunjang sains',
    status: 'Didampingi',
    ortuAsuhId: 'DNR-002',
    ortuAsuhNama: 'PT Sinar Makmur Abadi (CSR)',
    cerita: 'Faiz aktif dalam lomba sains madrasah tingkat kecamatan. Ia ingin menjadi teknisi komputer.',
    foto: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'AA-004',
    nama: 'Maria Magdalena K.',
    jenjang: 'SD',
    kelas: 'Kelas 5',
    umur: 11,
    sekolah: 'SD Inpres Oebelo',
    kota: 'Kupang',
    provinsi: 'Nusa Tenggara Timur',
    kebutuhan: 'Sepatu sekolah, seragam pramuka & batik, perlengkapan belajar',
    status: 'Menunggu Donatur',
    ortuAsuhId: null,
    ortuAsuhNama: null,
    cerita: 'Setiap hari Maria berjalan kaki 3 km ke sekolah demi meraih impian menjadi dokter anak.',
    foto: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'AA-005',
    nama: 'Rian Pratama',
    jenjang: 'SMP',
    kelas: 'Kelas 7',
    umur: 13,
    sekolah: 'SMP Terbuka 04',
    kota: 'Banyumas',
    provinsi: 'Jawa Tengah',
    kebutuhan: 'Sepatu, seragam olahraga, tas sekolah',
    status: 'Didampingi',
    ortuAsuhId: 'DNR-004',
    ortuAsuhNama: 'Dra. Ratna Kusuma',
    cerita: 'Rian adalah yatim sejak usia 6 tahun. Membantu sang ibu berjualan kue di pasar sebelum berangkat sekolah.',
    foto: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'AA-006',
    nama: 'Nurul Hidayah',
    jenjang: 'SMA/SMK',
    kelas: 'Kelas 11 SMK',
    umur: 16,
    sekolah: 'SMK Negeri 1 Wonosari',
    kota: 'Gunungkidul',
    provinsi: 'DI Yogyakarta',
    kebutuhan: 'Perlengkapan praktek multimedia, tas laptop sekolah, seragam kejuruan',
    status: 'Menunggu Donatur',
    ortuAsuhId: null,
    ortuAsuhNama: null,
    cerita: 'Nurul memiliki nilai akademik peringkat 3 paralel di jurusannya, bertekad memutus mata rantai kemiskinan keluarga.',
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80'
  }
];

export const initialDonaturs = [
  {
    id: 'DNR-001',
    nama: 'Ir. Hendra Wijaya',
    tipe: 'Individu',
    email: 'hendra.wijaya@gmail.com',
    telepon: '081288991234',
    kota: 'Jakarta Selatan',
    statusOrtuAsuh: 'Aktif',
    anakAsuhList: ['AA-001'],
    totalDonasi: 1500000,
    tanggalBergabung: '2025-03-12'
  },
  {
    id: 'DNR-002',
    nama: 'PT Sinar Makmur Abadi (CSR)',
    tipe: 'Perusahaan/CSR',
    email: 'csr@sinarmakmur.co.id',
    telepon: '0215566778',
    kota: 'Surabaya',
    statusOrtuAsuh: 'Aktif',
    anakAsuhList: ['AA-003'],
    totalDonasi: 15000000,
    tanggalBergabung: '2025-01-15'
  },
  {
    id: 'DNR-003',
    nama: 'dr. Andi Firmansyah',
    tipe: 'Individu',
    email: 'andi.firmansyah@yahoo.com',
    telepon: '08119988776',
    kota: 'Bandung',
    statusOrtuAsuh: 'Donatur Lepas',
    anakAsuhList: [],
    totalDonasi: 500000,
    tanggalBergabung: '2026-02-10'
  },
  {
    id: 'DNR-004',
    nama: 'Dra. Ratna Kusuma',
    tipe: 'Individu',
    email: 'ratna.kusuma@kemdikbud.go.id',
    telepon: '081377665544',
    kota: 'Semarang',
    statusOrtuAsuh: 'Aktif',
    anakAsuhList: ['AA-005'],
    totalDonasi: 900000,
    tanggalBergabung: '2025-09-01'
  }
];

export const initialKaryawan = [
  {
    id: 'KRY-001',
    nik: 'GNOTA-2022-01',
    nama: 'Bambang Triyono, S.Sos',
    jabatan: 'Koordinator Penyaluran Donasi',
    divisi: 'Program & Lapangan',
    email: 'bambang.t@gnota.or.id',
    telepon: '081290887711',
    wilayah: 'Jawa Tengah & DI Yogyakarta',
    status: 'Aktif',
    tanggalMasuk: '2022-04-01'
  },
  {
    id: 'KRY-002',
    nik: 'GNOTA-2023-04',
    nama: 'Dewi Lestari, S.E',
    jabatan: 'Verifikator Keuangan & Akuntansi',
    divisi: 'Keuangan & Donasi',
    email: 'dewi.lestari@gnota.or.id',
    telepon: '081388992200',
    wilayah: 'Pusat (Jakarta)',
    status: 'Aktif',
    tanggalMasuk: '2023-02-15'
  },
  {
    id: 'KRY-003',
    nik: 'GNOTA-2024-02',
    nama: 'Rizky Maulana',
    jabatan: 'Staf Layanan Donatur & CRM',
    divisi: 'Kemitraan & Hubungan Donatur',
    email: 'rizky.m@gnota.or.id',
    telepon: '085711223344',
    wilayah: 'Pusat (Jakarta)',
    status: 'Aktif',
    tanggalMasuk: '2024-01-10'
  },
  {
    id: 'KRY-004',
    nik: 'GNOTA-2024-09',
    nama: 'Fransiskus Xaverius, S.Pd',
    jabatan: 'Fasilitator Wilayah Timur',
    divisi: 'Program & Lapangan',
    email: 'frans.x@gnota.or.id',
    telepon: '082199881122',
    wilayah: 'NTT & Maluku',
    status: 'Aktif',
    tanggalMasuk: '2024-08-01'
  }
];

export const initialDonations = [
  {
    id: 'DON-202611-001',
    tanggal: '2026-11-05 10:15',
    donaturId: 'DNR-001',
    donaturNama: 'Ir. Hendra Wijaya',
    email: 'hendra.wijaya@gmail.com',
    telepon: '081288991234',
    tipe: 'Orang Tua Asuh',
    program: 'Satu Demi Satu untuk SD',
    paketNama: 'Paket 3 (6 Tahun Ajaran Penuh)',
    nominal: 1500000,
    metode: 'BCA Virtual Account',
    status: 'Disalurkan',
    karyawanVerifikator: 'Dewi Lestari, S.E',
    anakAsuhId: 'AA-001',
    anakAsuhNama: 'Budi Santoso (SDN 02 Karanganyar)',
    pesanDoa: 'Semoga Budi rajin belajar dan kelak menjadi guru yang membanggakan orang tua.'
  },
  {
    id: 'DON-202611-002',
    tanggal: '2026-11-04 14:30',
    donaturId: 'DNR-002',
    donaturNama: 'PT Sinar Makmur Abadi (CSR)',
    email: 'csr@sinarmakmur.co.id',
    telepon: '0215566778',
    tipe: 'Program CSR',
    program: 'Satu Demi Satu untuk SMP',
    paketNama: 'Paket 2 (3 Tahun Ajaran)',
    nominal: 15000000,
    metode: 'Bank Mandiri Transfer',
    status: 'Disalurkan',
    karyawanVerifikator: 'Dewi Lestari, S.E',
    anakAsuhId: 'AA-003',
    anakAsuhNama: 'Ahmad Faiz (SMPN 3 Cisolok)',
    pesanDoa: 'Dukungan pendidikan untuk anak-anak calon penerus kemajuan teknologi bangsa.'
  },
  {
    id: 'DON-202611-003',
    tanggal: '2026-11-05 16:45',
    donaturId: 'DNR-003',
    donaturNama: 'dr. Andi Firmansyah',
    email: 'andi.firmansyah@yahoo.com',
    telepon: '08119988776',
    tipe: 'Donasi Umum',
    program: 'Satu Demi Satu untuk SD',
    paketNama: 'Paket 2 (3 Tahun Ajaran)',
    nominal: 750000,
    metode: 'QRIS',
    status: 'Terverifikasi',
    karyawanVerifikator: 'Dewi Lestari, S.E',
    anakAsuhId: null,
    anakAsuhNama: 'Alokasi Otomatis GNOTA (Antrean Bantuan)',
    pesanDoa: 'Semoga berkah untuk adik-adik yang membutuhkan perlengkapan sekolah.'
  },
  {
    id: 'DON-202611-004',
    tanggal: '2026-11-06 09:12',
    donaturId: 'DNR-004',
    donaturNama: 'Dra. Ratna Kusuma',
    email: 'ratna.kusuma@kemdikbud.go.id',
    telepon: '081377665544',
    tipe: 'Orang Tua Asuh',
    program: 'Satu Demi Satu untuk SMP',
    paketNama: 'Paket 2 (3 Tahun Ajaran)',
    nominal: 900000,
    metode: 'BRI Virtual Account',
    status: 'Disalurkan',
    karyawanVerifikator: 'Dewi Lestari, S.E',
    anakAsuhId: 'AA-005',
    anakAsuhNama: 'Rian Pratama (SMP Terbuka 04)',
    pesanDoa: 'Terus semangat Nak Rian, jangan pernah menyerah pada keadaan.'
  },
  {
    id: 'DON-202611-005',
    tanggal: '2026-11-06 13:20',
    donaturId: null,
    donaturNama: 'Hamba Allah',
    email: 'anonim@gnota.or.id',
    telepon: '081299001122',
    tipe: 'Donasi Anonim',
    program: 'Bantuan Pendidikan Anak Daerah 3T',
    paketNama: 'Paket Ekspedisi 1 Anak',
    nominal: 400000,
    metode: 'QRIS',
    status: 'Menunggu Verifikasi',
    karyawanVerifikator: null,
    anakAsuhId: null,
    anakAsuhNama: 'Penyaluran Daerah 3T (Kupang/Pelosok)',
    pesanDoa: 'Lillahitaala untuk pendidikan anak pelosok.'
  }
];
