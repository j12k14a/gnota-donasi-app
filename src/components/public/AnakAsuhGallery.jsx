import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, School, Heart, CheckCircle2, UserCheck, Search, Filter } from 'lucide-react';

export default function AnakAsuhGallery({ onSelectChildForDonation }) {
  const { anakAsuh } = useApp();
  const [filterJenjang, setFilterJenjang] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChildren = anakAsuh.filter(child => {
    const matchesJenjang = filterJenjang === 'ALL' || child.jenjang === filterJenjang;
    const matchesSearch = child.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          child.sekolah.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          child.kota.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesJenjang && matchesSearch;
  });

  return (
    <section id="anak-asuh" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-gnota-700 font-bold text-xs uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-200 mb-2 shadow-xs">
              <UserCheck className="w-3.5 h-3.5 text-gnota-600" />
              Direktori Penerima Bantuan
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Calon Anak Asuh Menanti Uluran Tangan Anda
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-xl">
              Pilih anak asuh yang ingin Anda dampingi secara langsung. Anda akan mendapatkan kuitansi, sertifikat pengasuhan, dan kabar kemajuan belajar mereka setiap semester.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama, sekolah, kota..."
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-gnota-500 focus:outline-none w-56 shadow-xs"
              />
            </div>

            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-xs text-xs font-semibold">
              {['ALL', 'SD', 'SMP', 'SMA/SMK'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilterJenjang(tab)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filterJenjang === tab
                      ? 'bg-gnota-600 text-white font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab === 'ALL' ? 'Semua Jenjang' : tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Children Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChildren.map(child => {
            const isAssisted = child.status === 'Didampingi';

            return (
              <div
                key={child.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-lg transition-all flex flex-col group"
              >
                {/* Child Image & Badge */}
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  <img
                    src={child.foto}
                    alt={child.nama}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-white/95 backdrop-blur-md text-slate-800 font-extrabold text-xs px-2.5 py-1 rounded-full shadow-xs">
                      {child.jenjang} • {child.kelas}
                    </span>
                    <span className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] px-2 py-0.5 rounded-full">
                      {child.umur} Tahun
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    {isAssisted ? (
                      <span className="bg-emerald-500/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="w-3 h-3" />
                        Didampingi Ortu Asuh
                      </span>
                    ) : (
                      <span className="bg-amber-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm animate-pulse">
                        <Heart className="w-3 h-3 fill-white" />
                        Butuh Ortu Asuh
                      </span>
                    )}
                  </div>

                  {/* Name on image bottom */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="font-extrabold text-xl leading-tight drop-shadow-sm">{child.nama}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-200 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{child.kota}, {child.provinsi}</span>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start gap-2 text-xs text-slate-600 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <School className="w-4 h-4 text-gnota-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-800">{child.sekolah}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 italic">
                      "{child.cerita}"
                    </p>

                    <div className="border-t border-slate-100 pt-3 mb-4">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Kebutuhan Perlengkapan:</p>
                      <p className="text-xs text-slate-700 font-medium">
                        {child.kebutuhan}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    {isAssisted ? (
                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-2.5 rounded-xl flex items-center justify-between">
                        <span className="font-semibold truncate">Ortu Asuh: {child.ortuAsuhNama}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      </div>
                    ) : (
                      <button
                        onClick={() => onSelectChildForDonation(child)}
                        className="w-full bg-gnota-600 hover:bg-gnota-700 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
                      >
                        <Heart className="w-3.5 h-3.5 fill-white" />
                        <span>Jadikan Anak Asuh Saya</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
