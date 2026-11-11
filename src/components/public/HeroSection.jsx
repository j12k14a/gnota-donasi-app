import React from 'react';
import { useApp } from '../../context/AppContext';
import { Heart, Users, GraduationCap, Award, ChevronRight, TrendingUp } from 'lucide-react';

export default function HeroSection({ onOpenDonation }) {
  const { totalDonasiTerkumpul, totalTargetKeseluruhan, anakAsuh, donaturs } = useApp();

  const percentage = Math.min(100, Math.round((totalDonasiTerkumpul / totalTargetKeseluruhan) * 100));

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <section id="beranda" className="relative bg-gradient-to-b from-gnota-50 via-white to-slate-50 pt-6 sm:pt-10 pb-12 sm:pb-16 overflow-hidden">
      
      {/* Decorative Blur Circles */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 left-10 w-72 h-72 bg-gnota-200/50 rounded-full blur-3xl"></div>
        <div className="absolute top-10 right-10 w-80 h-80 bg-amber-200/40 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gnota-100 text-gnota-800 text-[10px] sm:text-xs font-bold tracking-wide uppercase mb-3 sm:mb-4 border border-gnota-200 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-gnota-600 animate-ping shrink-0"></span>
            <span className="truncate">Program Donasi Perlengkapan Sekolah 2026/2027</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Satu Demi Satu Membantu Anak Indonesia <span className="text-gnota-600 underline decoration-yellow-400 decoration-wavy decoration-2">Tetap Bersekolah</span>
          </h1>
          <p className="mt-3 sm:mt-5 text-xs sm:text-base text-slate-600 leading-relaxed font-normal px-2">
            Jadilah <strong className="text-slate-900 font-semibold">Orang Tua Asuh</strong>. Donasi Anda langsung diwujudkan menjadi seragam sekolah, tas, sepatu, dan alat tulis bagi anak-anak prasejahtera rawan putus sekolah.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-4 px-4 sm:px-0">
            <button
              onClick={() => onOpenDonation()}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-gnota-600 to-gnota-700 hover:from-gnota-700 hover:to-gnota-800 text-white font-bold px-6 py-3 sm:py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all text-sm active:scale-98"
            >
              <Heart className="w-4 h-4 fill-white text-white" />
              <span>Beri Donasi Sekarang</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <a
              href="#anak-asuh"
              className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-5 py-3 sm:py-3.5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all text-sm active:scale-98"
            >
              <Users className="w-4 h-4 text-gnota-600" />
              <span>Lihat Calon Anak Asuh</span>
            </a>
          </div>
        </div>

        {/* Live Target & Progress Tracker Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-4 sm:p-8 shadow-lg border border-slate-100 relative mb-8 sm:mb-12">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-slate-100">
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-gnota-600 tracking-wider uppercase">Capaian Donasi Nasional</span>
              <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
                {formatRupiah(totalDonasiTerkumpul)}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                dari target tahun ajaran {formatRupiah(totalTargetKeseluruhan)}
              </p>
            </div>

            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl self-start sm:self-auto">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 shrink-0" />
              <div>
                <p className="text-[9px] sm:text-[11px] text-amber-700 font-semibold uppercase">Tingkat Capaian</p>
                <p className="text-base sm:text-xl font-black text-amber-900 leading-none mt-0.5">{percentage}%</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="pt-4 sm:pt-6">
            <div className="flex justify-between text-[11px] sm:text-xs font-semibold text-slate-600 mb-2">
              <span>Progres Dana Bantuan Terkumpul</span>
              <span className="text-gnota-700 font-bold">{percentage}% Tercapai</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 sm:h-4 overflow-hidden p-0.5 border border-slate-200">
              <div
                className="bg-gradient-to-r from-gnota-500 via-gnota-600 to-amber-500 h-full rounded-full transition-all duration-1000 ease-out shadow-inner"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>

          {/* 4 Stat Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 mt-6 pt-5 border-t border-slate-100 text-center">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-center text-gnota-600 mb-1">
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <p className="text-base sm:text-xl font-extrabold text-slate-900 leading-none">3.375+</p>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-1">Anak Terbantu</p>
            </div>

            <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-center text-amber-500 mb-1">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <p className="text-base sm:text-xl font-extrabold text-slate-900 leading-none">{donaturs.length * 350}+</p>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-1">Orang Tua Asuh</p>
            </div>

            <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-center text-emerald-600 mb-1">
                <Award className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <p className="text-base sm:text-xl font-extrabold text-slate-900 leading-none">100%</p>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-1">Tepat Sasaran</p>
            </div>

            <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-center text-purple-600 mb-1">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <p className="text-base sm:text-xl font-extrabold text-slate-900 leading-none">34</p>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-1">Kab/Kota</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
