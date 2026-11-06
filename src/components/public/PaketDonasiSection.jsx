import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Heart, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function PaketDonasiSection({ onSelectPackage }) {
  const { campaigns } = useApp();

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <section id="paket-donasi" className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading matching GNOTA original */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 text-gnota-700 font-bold text-xs uppercase tracking-widest bg-gnota-50 px-3 py-1 rounded-full border border-gnota-100 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Pilihan Program Donasi
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 uppercase tracking-tight">
            DONASI & PAKET ORANG TUA ASUH
          </h2>
          <div className="w-16 h-1 bg-gnota-600 mx-auto mt-3 rounded-full"></div>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
            Setiap paket donasi secara langsung disalurkan dalam bentuk kebutuhan riil anak asuh: seragam lengkap, sepatu sekolah, tas ransel, dan perlengkapan alat tulis.
          </p>
        </div>

        {/* List of Donation Programs (Directly inspired by GNOTA http://www.gnota.or.id/beri-donasi/) */}
        <div className="space-y-16">
          
          {/* Card 1: SATU DEMI SATU UNTUK SD */}
          <div className="bg-slate-50/70 rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-8 lg:gap-12">
            {/* Circular image badge */}
            <div className="shrink-0 relative group">
              <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 border-white shadow-xl ring-8 ring-gnota-100/70">
                <img
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80"
                  alt="Anak SD GNOTA"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="absolute bottom-2 right-2 bg-gnota-700 text-white font-bold text-xs px-3 py-1 rounded-full shadow-md">
                Tingkat SD
              </span>
            </div>

            {/* Content Details */}
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-gnota-800 tracking-tight uppercase">
                  SATU DEMI SATU UNTUK SD
                </h3>
              </div>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-5">
                Paket bantuan berupa: <strong className="text-slate-800">baju, sepatu, tas, dan alat tulis</strong>, untuk siswa sekolah dasar dengan perhitungan setiap anak menerima:
              </p>

              {/* Package Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs hover:border-gnota-400 transition-colors">
                  <div className="text-xs font-semibold text-slate-500">Paket 1</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">Rp 250.000</div>
                  <div className="text-[11px] text-gnota-600 font-medium">untuk 1 tahun ajaran</div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-gnota-300 ring-2 ring-gnota-100 shadow-xs relative">
                  <span className="absolute -top-2 right-3 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    FAVORIT
                  </span>
                  <div className="text-xs font-semibold text-slate-500">Paket 2</div>
                  <div className="text-lg font-bold text-gnota-700 mt-0.5">Rp 750.000</div>
                  <div className="text-[11px] text-gnota-600 font-medium">untuk 3 tahun ajaran</div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs hover:border-gnota-400 transition-colors">
                  <div className="text-xs font-semibold text-slate-500">Paket 3</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">Rp 1.500.000</div>
                  <div className="text-[11px] text-gnota-600 font-medium">untuk 6 tahun ajaran (Tuntas)</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onSelectPackage({ program: 'Satu Demi Satu untuk SD', jenjang: 'SD', defaultNominal: 250000 })}
                  className="bg-gnota-600 hover:bg-gnota-700 text-white font-bold px-7 py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm uppercase tracking-wider"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>BERI DONASI SD</span>
                </button>
                <span className="text-xs text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Kuitansi Resmi & Laporan Penyaluran
                </span>
              </div>
            </div>
          </div>


          {/* Card 2: SATU DEMI SATU UNTUK SMP */}
          <div className="bg-slate-50/70 rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-8 lg:gap-12">
            {/* Circular image badge */}
            <div className="shrink-0 relative group">
              <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 border-white shadow-xl ring-8 ring-amber-100/70">
                <img
                  src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80"
                  alt="Anak SMP GNOTA"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="absolute bottom-2 right-2 bg-amber-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow-md">
                Tingkat SMP
              </span>
            </div>

            {/* Content Details */}
            <div className="flex-1 text-left">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gnota-800 tracking-tight uppercase mb-2">
                SATU DEMI SATU UNTUK SMP
              </h3>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-5">
                Paket bantuan berupa: <strong className="text-slate-800">baju, sepatu, tas, dan alat tulis</strong>, untuk siswa sekolah menengah tingkat pertama dengan perhitungan setiap anak menerima:
              </p>

              {/* Package Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 max-w-lg">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs hover:border-gnota-400 transition-colors">
                  <div className="text-xs font-semibold text-slate-500">Paket 1</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">Rp 300.000</div>
                  <div className="text-[11px] text-gnota-600 font-medium">untuk 1 tahun ajaran</div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs hover:border-gnota-400 transition-colors">
                  <div className="text-xs font-semibold text-slate-500">Paket 2</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">Rp 900.000</div>
                  <div className="text-[11px] text-gnota-600 font-medium">untuk 3 tahun ajaran (Tuntas SMP)</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onSelectPackage({ program: 'Satu Demi Satu untuk SMP', jenjang: 'SMP', defaultNominal: 300000 })}
                  className="bg-gnota-600 hover:bg-gnota-700 text-white font-bold px-7 py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm uppercase tracking-wider"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>BERI DONASI SMP</span>
                </button>
                <span className="text-xs text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Kuitansi Resmi & Laporan Penyaluran
                </span>
              </div>
            </div>
          </div>


          {/* Card 3: SMA/SMK & Bantuan Khusus */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SMA */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-purple-100 text-purple-700 font-bold text-xs px-3 py-1 rounded-full">
                    Tingkat SMA / SMK
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Mulai Rp 450.000/thn</span>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">SATU DEMI SATU UNTUK SMA/SMK</h4>
                <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
                  Bantuan perlengkapan penunjang kejuruan & vokasi agar siswa dari keluarga dhuafa dapat menyelesaikan jenjang pendidikan 12 tahun.
                </p>
              </div>
              <button
                onClick={() => onSelectPackage({ program: 'Satu Demi Satu untuk SMA/SMK', jenjang: 'SMA/SMK', defaultNominal: 450000 })}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <Heart className="w-3.5 h-3.5 text-yellow-400" />
                <span>Beri Donasi SMA/SMK</span>
              </button>
            </div>

            {/* Custom / Pelosok 3T */}
            <div className="bg-gradient-to-br from-gnota-700 to-gnota-900 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-yellow-400 text-slate-950 font-bold text-xs px-3 py-1 rounded-full">
                    Program Khusus 3T
                  </span>
                  <span className="text-xs text-gnota-200 font-medium">Donasi Bebas</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">BANTUAN DAERAH TERPENCIL (3T)</h4>
                <p className="text-xs sm:text-sm text-gnota-100 mb-4 leading-relaxed">
                  Ekspedisi pengiriman perlengkapan sekolah ke wilayah pulau terluar dan pegunungan pelosok perbatasan Nusantara.
                </p>
              </div>
              <button
                onClick={() => onSelectPackage({ program: 'Bantuan Pendidikan Anak Daerah 3T', jenjang: 'Semua Jenjang', defaultNominal: 200000 })}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <Heart className="w-3.5 h-3.5 fill-slate-950" />
                <span>Donasi Daerah 3T</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
