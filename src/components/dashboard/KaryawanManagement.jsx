import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Briefcase, PlusCircle, Search, Mail, Phone, MapPin, CheckCircle2, X } from 'lucide-react';

export default function KaryawanManagement() {
  const { karyawan, addKaryawan } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Employee State
  const [nama, setNama] = useState('');
  const [jabatan, setJabatan] = useState('Verifikator Keuangan & Donasi');
  const [divisi, setDivisi] = useState('Keuangan & Donasi');
  const [email, setEmail] = useState('');
  const [telepon, setTelepon] = useState('');
  const [wilayah, setWilayah] = useState('Pusat (Jakarta)');

  const filteredKaryawan = karyawan.filter(k =>
    k.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.jabatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.divisi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.wilayah.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!nama.trim()) {
      alert('Nama karyawan wajib diisi!');
      return;
    }

    addKaryawan({
      nik: `GNOTA-${new Date().getFullYear()}-${String(karyawan.length + 1).padStart(2, '0')}`,
      nama,
      jabatan,
      divisi,
      email: email || `${nama.toLowerCase().replace(/\s+/g, '.')}@gnota.or.id`,
      telepon: telepon || '081234567890',
      wilayah
    });

    setIsAddModalOpen(false);
    setNama('');
    setEmail('');
    setTelepon('');
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manajemen Staf & Karyawan Yayasan</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Petugas verifikator donasi, fasilitator lapangan, dan pengelola penyaluran beasiswa sekolah GNOTA.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gnota-600 hover:bg-gnota-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Tambah Petugas / Staf Baru</span>
        </button>
      </div>

      {/* Search Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama karyawan, jabatan, wilayah tugas..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-gnota-500 focus:outline-none"
          />
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Total Karyawan Aktif: <strong className="text-slate-900">{karyawan.length} Petugas</strong>
        </div>
      </div>

      {/* Karyawan Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredKaryawan.map(k => (
          <div
            key={k.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="bg-purple-50 text-purple-700 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border border-purple-100">
                  {k.divisi}
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {k.status}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gnota-700 to-slate-800 text-white font-bold flex items-center justify-center text-base shadow-sm">
                  {k.nama.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{k.nama}</h3>
                  <p className="text-xs text-gnota-700 font-semibold">{k.jabatan}</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{k.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{k.telepon}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{k.wilayah}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>NIP: {k.nik}</span>
              <span>Sejak {k.tanggalMasuk}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-gnota-700 to-gnota-800 text-white p-6 relative">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-extrabold text-white">Tambah Data Karyawan / Staf</h3>
              <p className="text-xs text-gnota-200 mt-0.5">Input data petugas yayasan yang mengelola sistem donasi.</p>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Siti Nurhaliza, S.E"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jabatan *</label>
                  <input
                    type="text"
                    required
                    value={jabatan}
                    onChange={(e) => setJabatan(e.target.value)}
                    placeholder="Contoh: Verifikator Donasi"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Divisi *</label>
                  <select
                    value={divisi}
                    onChange={(e) => setDivisi(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Keuangan & Donasi">Keuangan & Donasi</option>
                    <option value="Program & Lapangan">Program & Lapangan</option>
                    <option value="Kemitraan & Hubungan Donatur">Kemitraan & Donatur</option>
                    <option value="Sekretariat & Umum">Sekretariat & Umum</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Resmi</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="siti.n@gnota.or.id"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. WhatsApp / HP</label>
                  <input
                    type="tel"
                    value={telepon}
                    onChange={(e) => setTelepon(e.target.value)}
                    placeholder="081299887766"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Wilayah Penugasan</label>
                <input
                  type="text"
                  value={wilayah}
                  onChange={(e) => setWilayah(e.target.value)}
                  placeholder="Contoh: DKI Jakarta / Jawa Barat"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gnota-600 hover:bg-gnota-700 text-white rounded-xl font-bold"
                >
                  Simpan Staf Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
