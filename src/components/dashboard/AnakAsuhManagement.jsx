import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, Search, PlusCircle, MapPin, School, Heart, CheckCircle2, Trash2, X } from 'lucide-react';

export default function AnakAsuhManagement() {
  const { anakAsuh, addAnakAsuh, deleteAnakAsuh } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJenjang, setFilterJenjang] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Child Form State
  const [nama, setNama] = useState('');
  const [jenjang, setJenjang] = useState('SD');
  const [kelas, setKelas] = useState('Kelas 4');
  const [umur, setUmur] = useState(10);
  const [sekolah, setSekolah] = useState('');
  const [kota, setKota] = useState('');
  const [provinsi, setProvinsi] = useState('');
  const [kebutuhan, setKebutuhan] = useState('');
  const [cerita, setCerita] = useState('');

  const filteredChildren = anakAsuh.filter(c => {
    const matchesJenjang = filterJenjang === 'ALL' || c.jenjang === filterJenjang;
    const matchesSearch = c.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.sekolah.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.kota.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesJenjang && matchesSearch;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!nama.trim() || !sekolah.trim()) {
      alert('Nama dan sekolah wajib diisi!');
      return;
    }

    addAnakAsuh({
      nama,
      jenjang,
      kelas,
      umur: Number(umur),
      sekolah,
      kota: kota || 'Cilacap',
      provinsi: provinsi || 'Jawa Tengah',
      kebutuhan: kebutuhan || 'Baju seragam, sepatu, dan tas ransel',
      cerita: cerita || 'Siswa rajin dan berprestasi dari keluarga prasejahtera yang bertekad melanjutkan sekolah.'
    });

    setIsAddModalOpen(false);
    // Reset Form
    setNama('');
    setSekolah('');
    setKota('');
    setProvinsi('');
    setKebutuhan('');
    setCerita('');
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Database Penerima Bantuan (Anak Asuh)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar anak-anak prasejahtera yang berhak menerima paket seragam dan alat tulis dari para Orang Tua Asuh.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gnota-600 hover:bg-gnota-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Tambah Anak Asuh Baru</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari siswa, nama sekolah, kota/kabupaten..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-gnota-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto no-scrollbar max-w-full">
          {['ALL', 'SD', 'SMP', 'SMA/SMK'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilterJenjang(tab)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                filterJenjang === tab
                  ? 'bg-white text-gnota-800 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'ALL' ? 'Semua Jenjang' : tab}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium shrink-0">
          Total Terdata: <strong className="text-slate-900">{anakAsuh.length} Anak</strong>
        </div>
      </div>

      {/* Children Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[740px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Anak Asuh</th>
                <th className="py-3.5 px-4">Jenjang & Kelas</th>
                <th className="py-3.5 px-4">Asal Sekolah</th>
                <th className="py-3.5 px-4">Daerah / Kota</th>
                <th className="py-3.5 px-4">Kebutuhan Perlengkapan</th>
                <th className="py-3.5 px-4">Status Pengasuhan</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredChildren.map(child => (
                <tr key={child.id} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* Avatar & Name */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img src={child.foto} alt={child.nama} className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-slate-100" />
                      <div>
                        <div className="font-extrabold text-slate-900">{child.nama}</div>
                        <div className="text-[10px] font-mono text-slate-400">{child.id} • {child.umur} Tahun</div>
                      </div>
                    </div>
                  </td>

                  {/* Jenjang */}
                  <td className="py-3.5 px-4">
                    <span className="bg-gnota-50 text-gnota-800 text-[11px] font-bold px-2 py-0.5 rounded border border-gnota-100">
                      {child.jenjang}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{child.kelas}</div>
                  </td>

                  {/* Sekolah */}
                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    {child.sekolah}
                  </td>

                  {/* Lokasi */}
                  <td className="py-3.5 px-4 text-slate-600">
                    <div>{child.kota}</div>
                    <div className="text-[10px] text-slate-400">{child.provinsi}</div>
                  </td>

                  {/* Kebutuhan */}
                  <td className="py-3.5 px-4 text-slate-600 max-w-[200px]">
                    <span className="line-clamp-2">{child.kebutuhan}</span>
                  </td>

                  {/* Status & Ortu Asuh */}
                  <td className="py-3.5 px-4">
                    {child.status === 'Didampingi' ? (
                      <div>
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Didampingi
                        </span>
                        <div className="text-[10px] text-slate-600 font-semibold mt-1">
                          Ortu: {child.ortuAsuhNama || 'Terhubung'}
                        </div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        <Heart className="w-3 h-3 text-amber-600" />
                        Menunggu Donatur
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        if (confirm(`Hapus data ${child.nama}?`)) {
                          deleteAnakAsuh(child.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                      title="Hapus Data"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Child Modal */}
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
              <h3 className="text-xl font-extrabold text-white">Tambah Data Penerima Bantuan (Anak Asuh)</h3>
              <p className="text-xs text-gnota-200 mt-0.5">Input data siswa yang membutuhkan paket perlengkapan sekolah.</p>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Siswa *</label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Rian Anggara"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenjang *</label>
                  <select
                    value={jenjang}
                    onChange={(e) => setJenjang(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="SD">SD</option>
                    <option value="SMP">SMP</option>
                    <option value="SMA/SMK">SMA/SMK</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kelas</label>
                  <input
                    type="text"
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                    placeholder="Kelas 3"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Usia (Thn)</label>
                  <input
                    type="number"
                    value={umur}
                    onChange={(e) => setUmur(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Sekolah *</label>
                <input
                  type="text"
                  required
                  value={sekolah}
                  onChange={(e) => setSekolah(e.target.value)}
                  placeholder="Contoh: SDN 01 Wonosari"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kota / Kabupaten</label>
                  <input
                    type="text"
                    value={kota}
                    onChange={(e) => setKota(e.target.value)}
                    placeholder="Contoh: Cilacap"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Provinsi</label>
                  <input
                    type="text"
                    value={provinsi}
                    onChange={(e) => setProvinsi(e.target.value)}
                    placeholder="Contoh: Jawa Tengah"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Rincian Kebutuhan Spesifik</label>
                <input
                  type="text"
                  value={kebutuhan}
                  onChange={(e) => setKebutuhan(e.target.value)}
                  placeholder="Contoh: Sepatu no. 36, seragam batik, tas ransel"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cerita Singkat / Latar Belakang</label>
                <textarea
                  rows="2"
                  value={cerita}
                  onChange={(e) => setCerita(e.target.value)}
                  placeholder="Kondisi ekonomi keluarga atau cita-cita siswa..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                ></textarea>
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
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
