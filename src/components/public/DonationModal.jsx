import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X, Check, ChevronRight, ChevronLeft, Heart, ShieldCheck,
  CreditCard, QrCode, Building, Wallet, Sparkles, User, Mail, Phone, MessageSquare, Download
} from 'lucide-react';

export default function DonationModal({ isOpen, onClose, initialConfig, onShowReceipt }) {
  const { campaigns, anakAsuh, addDonation } = useApp();

  const [step, setStep] = useState(1);

  // Form State
  const [selectedProgram, setSelectedProgram] = useState('Satu Demi Satu untuk SD');
  const [selectedJenjang, setSelectedJenjang] = useState('SD');
  const [selectedPackageName, setSelectedPackageName] = useState('Paket 1 (1 Tahun Ajaran)');
  const [nominal, setNominal] = useState(250000);
  const [customNominal, setCustomNominal] = useState('');
  
  const [assignmentType, setAssignmentType] = useState('auto'); // 'auto' | 'manual'
  const [selectedChildId, setSelectedChildId] = useState('');

  const [donaturNama, setDonaturNama] = useState('');
  const [isAnonim, setIsAnonim] = useState(false);
  const [email, setEmail] = useState('');
  const [telepon, setTelepon] = useState('');
  const [tipeDonatur, setTipeDonatur] = useState('Individu');
  const [kota, setKota] = useState('');
  const [pesanDoa, setPesanDoa] = useState('Semoga bantuan ini bermanfaat dan menjadi jalan meraih cita-cita.');

  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdDonation, setCreatedDonation] = useState(null);

  // Pre-fill if opened with initial config
  useEffect(() => {
    if (initialConfig) {
      if (initialConfig.program) setSelectedProgram(initialConfig.program);
      if (initialConfig.jenjang) setSelectedJenjang(initialConfig.jenjang);
      if (initialConfig.defaultNominal) {
        setNominal(initialConfig.defaultNominal);
        setSelectedPackageName(`Paket Donasi (${formatRupiah(initialConfig.defaultNominal)})`);
      }
      if (initialConfig.child) {
        setAssignmentType('manual');
        setSelectedChildId(initialConfig.child.id);
        setSelectedJenjang(initialConfig.child.jenjang);
        if (initialConfig.child.jenjang === 'SD') {
          setSelectedProgram('Satu Demi Satu untuk SD');
          setNominal(250000);
        } else if (initialConfig.child.jenjang === 'SMP') {
          setSelectedProgram('Satu Demi Satu untuk SMP');
          setNominal(300000);
        } else {
          setSelectedProgram('Satu Demi Satu untuk SMA/SMK');
          setNominal(450000);
        }
      }
    }
  }, [initialConfig]);

  if (!isOpen) return null;

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleNext = () => {
    if (step === 3) {
      if (!isAnonim && !donaturNama.trim()) {
        alert('Mohon masukkan nama donatur atau pilih donasi anonim (Hamba Allah).');
        return;
      }
      if (!email && !telepon) {
        alert('Mohon masukkan email atau nomor WhatsApp untuk pengiriman kuitansi digital.');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleCompleteDonation = () => {
    setIsProcessing(true);

    const effectiveNominal = customNominal ? Number(customNominal) : nominal;
    const finalDonaturName = isAnonim ? 'Hamba Allah' : donaturNama;

    let targetChild = null;
    if (assignmentType === 'manual' && selectedChildId) {
      targetChild = anakAsuh.find(a => a.id === selectedChildId);
    } else {
      // Find first available waiting child
      targetChild = anakAsuh.find(a => a.status === 'Menunggu Donatur' && (a.jenjang === selectedJenjang || selectedJenjang === 'Semua Jenjang'));
    }

    setTimeout(() => {
      const newRecord = addDonation({
        donaturNama: finalDonaturName,
        email: email || 'donatur@gnota.or.id',
        telepon: telepon || '08129900000',
        tipe: isAnonim ? 'Donasi Anonim' : tipeDonatur,
        kota: kota || 'Indonesia',
        program: selectedProgram,
        paketNama: selectedPackageName,
        nominal: effectiveNominal,
        metode: paymentMethod,
        anakAsuhId: targetChild ? targetChild.id : null,
        anakAsuhNama: targetChild ? `${targetChild.nama} (${targetChild.sekolah})` : 'Antrean Bantuan Pendidikan GNOTA',
        pesanDoa: pesanDoa
      });

      setIsProcessing(false);
      setCreatedDonation(newRecord);
      setStep(5); // Success step
    }, 1200);
  };

  const waitingChildren = anakAsuh.filter(a => a.status === 'Menunggu Donatur');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-gnota-700 to-gnota-900 text-white p-4 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 sm:top-5 right-4 sm:right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-yellow-400 text-slate-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
              Orang Tua Asuh GNOTA
            </span>
            <span className="text-xs text-gnota-200">Langkah {step} dari 4</span>
          </div>
          
          <h2 className="text-lg sm:text-2xl font-extrabold text-white pr-8">
            {step === 1 && 'Pilih Paket Bantuan Pendidikan'}
            {step === 2 && 'Pilih Anak Asuh Penerima Bantuan'}
            {step === 3 && 'Data Diri Donatur / Orang Tua Asuh'}
            {step === 4 && 'Pilih Metode Pembayaran & Verifikasi'}
            {step === 5 && 'Donasi Berhasil Dicatat!'}
          </h2>
          
          <p className="text-[11px] sm:text-xs text-gnota-100 mt-1">
            {step < 5 ? 'Setiap donasi Anda 100% dialokasikan untuk perlengkapan sekolah anak asuh.' : 'Kuitansi digital resmi telah diterbitkan oleh sistem Yayasan GNOTA.'}
          </p>

          {/* Stepper Dots */}
          {step <= 4 && (
            <div className="flex items-center gap-2 mt-4">
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === step ? 'w-8 bg-yellow-400' : i < step ? 'w-4 bg-emerald-400' : 'w-3 bg-white/30'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          
          {/* STEP 1: Pilih Paket */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Pilih Jenjang Sekolah
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {[
                    { label: 'SD (Sekolah Dasar)', id: 'SD', program: 'Satu Demi Satu untuk SD' },
                    { label: 'SMP (Menengah)', id: 'SMP', program: 'Satu Demi Satu untuk SMP' },
                    { label: 'SMA / SMK', id: 'SMA/SMK', program: 'Satu Demi Satu untuk SMA/SMK' },
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedJenjang(item.id);
                        setSelectedProgram(item.program);
                        if (item.id === 'SD') setNominal(250000);
                        if (item.id === 'SMP') setNominal(300000);
                        if (item.id === 'SMA/SMK') setNominal(450000);
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        selectedJenjang === item.id
                          ? 'border-gnota-600 bg-gnota-50 ring-2 ring-gnota-200'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900">{item.id}</div>
                      <div className="text-[11px] text-slate-500">{item.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  2. Pilih Durasi Paket Bantuan
                </label>
                
                {selectedJenjang === 'SD' && (
                  <div className="space-y-2.5">
                    {[
                      { name: 'Paket 1', duration: '1 Tahun Ajaran', amount: 250000, desc: 'Baju, sepatu, tas, & alat tulis untuk 1 tahun ajaran' },
                      { name: 'Paket 2', duration: '3 Tahun Ajaran', amount: 750000, desc: 'Perlengkapan sekolah lengkap untuk 3 tahun ajaran berturut-turut' },
                      { name: 'Paket 3', duration: '6 Tahun Ajaran (Penuh)', amount: 1500000, desc: 'Pendampingan penuh sampai anak lulus SD' }
                    ].map(pkg => (
                      <div
                        key={pkg.name}
                        onClick={() => {
                          setNominal(pkg.amount);
                          setSelectedPackageName(`${pkg.name} (${pkg.duration})`);
                          setCustomNominal('');
                        }}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          nominal === pkg.amount && !customNominal
                            ? 'border-gnota-600 bg-gnota-50 ring-2 ring-gnota-200'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-slate-900">{pkg.name}</span>
                            <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium">{pkg.duration}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{pkg.desc}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-extrabold text-gnota-700">{formatRupiah(pkg.amount)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedJenjang === 'SMP' && (
                  <div className="space-y-2.5">
                    {[
                      { name: 'Paket 1', duration: '1 Tahun Ajaran', amount: 300000, desc: 'Baju seragam putih-biru, sepatu, tas & alat tulis 1 tahun' },
                      { name: 'Paket 2', duration: '3 Tahun Ajaran (Tuntas)', amount: 900000, desc: 'Bantuan tuntas 3 tahun ajaran sampai lulus SMP' }
                    ].map(pkg => (
                      <div
                        key={pkg.name}
                        onClick={() => {
                          setNominal(pkg.amount);
                          setSelectedPackageName(`${pkg.name} (${pkg.duration})`);
                          setCustomNominal('');
                        }}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          nominal === pkg.amount && !customNominal
                            ? 'border-gnota-600 bg-gnota-50 ring-2 ring-gnota-200'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-slate-900">{pkg.name}</span>
                            <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium">{pkg.duration}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{pkg.desc}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-extrabold text-gnota-700">{formatRupiah(pkg.amount)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedJenjang === 'SMA/SMK' && (
                  <div className="space-y-2.5">
                    {[
                      { name: 'Paket 1', duration: '1 Tahun Ajaran', amount: 450000, desc: 'Seragam, sepatu, tas ransel & penunjang modul kejuruan' },
                      { name: 'Paket 2', duration: '3 Tahun Ajaran (Tuntas)', amount: 1350000, desc: 'Pendampingan tuntas hingga lulus SMA/SMK' }
                    ].map(pkg => (
                      <div
                        key={pkg.name}
                        onClick={() => {
                          setNominal(pkg.amount);
                          setSelectedPackageName(`${pkg.name} (${pkg.duration})`);
                          setCustomNominal('');
                        }}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          nominal === pkg.amount && !customNominal
                            ? 'border-gnota-600 bg-gnota-50 ring-2 ring-gnota-200'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-slate-900">{pkg.name}</span>
                            <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium">{pkg.duration}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{pkg.desc}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-extrabold text-gnota-700">{formatRupiah(pkg.amount)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Nominal Kustom */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Atau Masukkan Nominal Kustom (Donasi Sukarela / Beasiswa Parsial):
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">Rp</span>
                  <input
                    type="number"
                    value={customNominal}
                    onChange={(e) => {
                      setCustomNominal(e.target.value);
                      setSelectedPackageName(`Donasi Kustom (${formatRupiah(e.target.value || 0)})`);
                    }}
                    placeholder="Contoh: 500000"
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-gnota-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Alokasi Anak Asuh */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Penentuan Penerima Bantuan
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div
                    onClick={() => setAssignmentType('auto')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      assignmentType === 'auto'
                        ? 'border-gnota-600 bg-gnota-50 ring-2 ring-gnota-200'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span className="font-bold text-sm text-slate-900">Alokasi Otomatis (Rekomendasi)</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Sistem GNOTA akan menyalurkan donasi ke anak yang paling darurat dan terancam putus sekolah dalam antrean resmi.
                    </p>
                  </div>

                  <div
                    onClick={() => setAssignmentType('manual')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      assignmentType === 'manual'
                        ? 'border-gnota-600 bg-gnota-50 ring-2 ring-gnota-200'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-gnota-600" />
                      <span className="font-bold text-sm text-slate-900">Pilih Anak Tertentu</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Anda memilih sendiri nama siswa dan sekolah yang ingin Anda dampingi sebagai Orang Tua Asuh.
                    </p>
                  </div>
                </div>

                {assignmentType === 'manual' && (
                  <div className="mt-4">
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Pilih dari Daftar Anak yang Masih Menunggu Donatur:
                    </label>
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {waitingChildren.map(child => (
                        <div
                          key={child.id}
                          onClick={() => setSelectedChildId(child.id)}
                          className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition-all ${
                            selectedChildId === child.id
                              ? 'border-gnota-600 bg-gnota-100/60 ring-2 ring-gnota-200'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img src={child.foto} alt={child.nama} className="w-9 h-9 rounded-full object-cover" />
                            <div>
                              <p className="font-bold text-slate-900">{child.nama}</p>
                              <p className="text-slate-500">{child.sekolah} • {child.kota}</p>
                            </div>
                          </div>
                          <span className="bg-gnota-200/80 text-gnota-800 text-[10px] font-bold px-2 py-0.5 rounded">
                            {child.jenjang}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">Transparansi Laporan Penyaluran</span>
                  Setelah paket seragam dan perlengkapan diserahkan kepada anak asuh, Anda akan menerima foto serah terima dan laporan perkembangan belajar secara berkala.
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Data Donatur */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Tipe Donatur */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tipe Donatur
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Individu', 'Perusahaan/CSR'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTipeDonatur(t)}
                      className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all ${
                        tipeDonatur === t
                          ? 'border-gnota-600 bg-gnota-50 text-gnota-800 ring-2 ring-gnota-200'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkbox Anonim */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Donasi Sebagai Anonim (Hamba Allah)</p>
                  <p className="text-[11px] text-slate-500">Nama Anda tidak akan ditampilkan di daftar donatur publik</p>
                </div>
                <input
                  type="checkbox"
                  checked={isAnonim}
                  onChange={(e) => setIsAnonim(e.target.checked)}
                  className="w-4 h-4 text-gnota-600 rounded border-slate-300 focus:ring-gnota-500"
                />
              </div>

              {!isAnonim && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Lengkap / Nama Perusahaan <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={donaturNama}
                      onChange={(e) => setDonaturNama(e.target.value)}
                      placeholder="Contoh: Bpk. Bambang Wijaya / PT Maju Bersama"
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-gnota-500"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email (Pengiriman Kuitansi Resmi) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-gnota-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    No WhatsApp / Telepon <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={telepon}
                      onChange={(e) => setTelepon(e.target.value)}
                      placeholder="081234567890"
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-gnota-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kota / Domisili Donatur
                </label>
                <input
                  type="text"
                  value={kota}
                  onChange={(e) => setKota(e.target.value)}
                  placeholder="Contoh: Jakarta Selatan / Surabaya"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-gnota-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pesan atau Doa untuk Anak Asuh
                </label>
                <textarea
                  rows="2"
                  value={pesanDoa}
                  onChange={(e) => setPesanDoa(e.target.value)}
                  placeholder="Tuliskan kata penyemangat untuk adik-adik kita..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-gnota-500"
                ></textarea>
              </div>
            </div>
          )}

          {/* STEP 4: Metode Bayar & Ringkasan */}
          {step === 4 && (
            <div className="space-y-6">
              {/* Ringkasan Donasi */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-200">
                  <span className="text-xs text-slate-500">Program:</span>
                  <span className="text-xs font-bold text-slate-800">{selectedProgram}</span>
                </div>
                <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-200">
                  <span className="text-xs text-slate-500">Pilihan Paket:</span>
                  <span className="text-xs font-semibold text-slate-700">{selectedPackageName}</span>
                </div>
                <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-200">
                  <span className="text-xs text-slate-500">Donatur:</span>
                  <span className="text-xs font-semibold text-slate-700">{isAnonim ? 'Hamba Allah (Anonim)' : donaturNama}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-sm font-bold text-slate-900">Total Nominal Donasi:</span>
                  <span className="text-lg font-black text-gnota-700">
                    {formatRupiah(customNominal ? Number(customNominal) : nominal)}
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Pilih Saluran Pembayaran
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'QRIS', label: 'QRIS (Gopay/OVO/BCA/Dana)', icon: QrCode },
                    { id: 'BCA Virtual Account', label: 'BCA Virtual Account', icon: Building },
                    { id: 'Mandiri Virtual Account', label: 'Mandiri Virtual Account', icon: Building },
                    { id: 'Transfer Bank Manual', label: 'Transfer Manual BCA/Mandiri', icon: CreditCard },
                  ].map(method => {
                    const Icon = method.icon;
                    return (
                      <div
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                          paymentMethod === method.id
                            ? 'border-gnota-600 bg-gnota-50 ring-2 ring-gnota-200'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${paymentMethod === method.id ? 'bg-gnota-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-800">{method.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Preview / QRIS Simulation */}
              {paymentMethod === 'QRIS' && (
                <div className="text-center p-4 bg-white border border-slate-200 rounded-2xl flex flex-col items-center">
                  <p className="text-xs font-bold text-slate-700 mb-2">Scan QRIS Nasional untuk Donasi</p>
                  <div className="w-36 h-36 bg-slate-900 rounded-xl p-2 flex items-center justify-center text-white mb-2 shadow-sm">
                    <QrCode className="w-28 h-28 text-white" />
                  </div>
                  <p className="text-[11px] text-slate-500">Mendukung GoPay, OVO, Dana, ShopeePay, BCA Mobile, Livin Mandiri, BRImo</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: SUCCESS & RECEIPT */}
          {step === 5 && createdDonation && (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Terverifikasi Sah
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
                  Terima Kasih, Orang Tua Asuh!
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  Donasi sebesar <strong className="text-slate-900">{formatRupiah(createdDonation.nominal)}</strong> telah tercatat di sistem Gerakan Nasional Orang Tua Asuh.
                </p>
              </div>

              {/* Quick Receipt Summary Card */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">No. Registrasi Kuitansi:</span>
                  <span className="font-mono font-bold text-gnota-700">{createdDonation.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Nama Donatur:</span>
                  <span className="font-semibold text-slate-800">{createdDonation.donaturNama}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Penerima Manfaat:</span>
                  <span className="font-semibold text-slate-800">{createdDonation.anakAsuhNama}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status Penyaluran:</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    Siap Disalurkan (Paket Seragam & Alat Tulis)
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onShowReceipt(createdDonation);
                    onClose();
                  }}
                  className="bg-gnota-700 hover:bg-gnota-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Lihat & Unduh Kuitansi Resmi</span>
                </button>
                <button
                  onClick={onClose}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-5 py-2.5 rounded-xl text-xs"
                >
                  Selesai
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer / Navigation Controls */}
        {step < 5 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
            {step > 1 ? (
              <button
                onClick={() => setStep(prev => prev - 1)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200/60 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-gnota-600 hover:bg-gnota-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
              >
                <span>Lanjutkan</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleCompleteDonation}
                disabled={isProcessing}
                className="flex items-center gap-2 px-7 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Memproses Transaksi...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Konfirmasi & Bayar Donasi</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
