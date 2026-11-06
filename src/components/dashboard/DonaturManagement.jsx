import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Search, PlusCircle, Heart, Mail, Phone, MapPin, GraduationCap, X, CheckCircle2 } from 'lucide-react';

export default function DonaturManagement() {
  const { donaturs, anakAsuh, donations } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDonatur, setSelectedDonatur] = useState(null);

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const filteredDonaturs = donaturs.filter(d => 
    d.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.telepon.includes(searchTerm) ||
    d.kota.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Database Donatur & Orang Tua Asuh</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar donatur dermawan dan Orang Tua Asuh yang mendampingi pendidikan anak asuh GNOTA.
          </p>
        </div>
      </div>

      {/* Search Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama donatur, email, nomor HP, domisili..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-gnota-500 focus:outline-none"
          />
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Total Donatur Terdaftar: <strong className="text-slate-900">{donaturs.length}</strong>
        </div>
      </div>

      {/* Grid of Donaturs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDonaturs.map(donatur => {
          const isOrtuAsuh = donatur.statusOrtuAsuh === 'Aktif';
          const childrenAssigned = anakAsuh.filter(a => donatur.anakAsuhList && donatur.anakAsuhList.includes(a.id));

          return (
            <div
              key={donatur.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                    donatur.tipe === 'Perusahaan/CSR'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {donatur.tipe}
                  </span>
                  
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    isOrtuAsuh
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {isOrtuAsuh && <Heart className="w-3 h-3 fill-amber-500 text-amber-500" />}
                    <span>{isOrtuAsuh ? 'Orang Tua Asuh Aktif' : 'Donatur Lepas'}</span>
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900">{donatur.nama}</h3>
                <p className="text-[10px] font-mono text-slate-400 mb-3">{donatur.id} • Bergabung: {donatur.tanggalBergabung}</p>

                <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{donatur.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{donatur.telepon}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{donatur.kota}</span>
                  </div>
                </div>

                {/* Anak Asuh yang Dibiayai */}
                <div className="mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Anak Asuh yang Dampingi:
                  </span>
                  {childrenAssigned.length > 0 ? (
                    <div className="space-y-1.5">
                      {childrenAssigned.map(child => (
                        <div key={child.id} className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1.5 rounded-xl text-xs text-emerald-900">
                          <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div className="truncate">
                            <span className="font-bold">{child.nama}</span>
                            <span className="text-[10px] text-emerald-700 ml-1">({child.sekolah})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Belum terhubung ke anak asuh spesifik (Donasi Reguler)</span>
                  )}
                </div>
              </div>

              {/* Total Donasi & Detail Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Total Akumulasi Donasi:</span>
                  <span className="font-black text-gnota-800 text-sm">{formatRupiah(donatur.totalDonasi)}</span>
                </div>
                <button
                  onClick={() => setSelectedDonatur(donatur)}
                  className="text-xs font-bold text-gnota-600 hover:text-gnota-800 bg-gnota-50 px-3 py-1.5 rounded-xl transition-colors"
                >
                  Detail Profil
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Donatur Detail Modal */}
      {selectedDonatur && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-gnota-700 to-gnota-800 text-white p-6 relative">
              <button
                onClick={() => setSelectedDonatur(null)}
                className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="bg-yellow-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                {selectedDonatur.tipe}
              </span>
              <h3 className="text-xl font-extrabold text-white mt-1">{selectedDonatur.nama}</h3>
              <p className="text-xs text-gnota-200">{selectedDonatur.id} • {selectedDonatur.kota}</p>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <p className="text-slate-400">Total Donasi:</p>
                  <p className="text-base font-extrabold text-slate-900 mt-0.5">{formatRupiah(selectedDonatur.totalDonasi)}</p>
                </div>
                <div>
                  <p className="text-slate-400">Status Ortu Asuh:</p>
                  <p className="text-sm font-bold text-amber-600 mt-0.5">{selectedDonatur.statusOrtuAsuh}</p>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-800 mb-2">Histori Transaksi Donatur Ini:</p>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {donations.filter(d => d.donaturNama === selectedDonatur.nama || d.donaturId === selectedDonatur.id).map(d => (
                    <div key={d.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900">{d.program}</p>
                        <p className="text-[10px] text-slate-400">{d.id} • {d.tanggal}</p>
                      </div>
                      <span className="font-bold text-gnota-700">{formatRupiah(d.nominal)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setSelectedDonatur(null)}
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
