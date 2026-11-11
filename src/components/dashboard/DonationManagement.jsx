import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Filter,
  PlusCircle,
  FileText,
  CheckCircle2,
  Clock,
  Truck,
  Download,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

export default function DonationManagement({ onOpenManualDonation, onShowReceipt }) {
  const { donations, updateDonationStatus, karyawan } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const filteredDonations = donations.filter(d => {
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    const matchesSearch = d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.donaturNama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (d.anakAsuhNama && d.anakAsuhNama.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const totalFilteredAmount = filteredDonations.reduce((sum, d) => sum + Number(d.nominal), 0);

  const handleExportCSV = () => {
    const headers = ['ID Donasi,Tanggal,Nama Donatur,Tipe,Program,Paket,Nominal,Metode,Status,Verifikator,Penerima Manfaat\n'];
    const rows = filteredDonations.map(d => 
      `"${d.id}","${d.tanggal}","${d.donaturNama}","${d.tipe}","${d.program}","${d.paketNama}",${d.nominal},"${d.metode}","${d.status}","${d.karyawanVerifikator || '-'}","${d.anakAsuhNama || '-'}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `laporan-donasi-gnota-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Top Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Pencatatan Donasi Masuk</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar transaksi donasi, verifikasi bukti pembayaran, dan kuitansi resmi Orang Tua Asuh.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={onOpenManualDonation}
            className="flex items-center gap-2 px-4 py-2 bg-gnota-600 hover:bg-gnota-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Catat Donasi Baru</span>
          </button>
        </div>
      </div>

      {/* Filter & Summary Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari ID transaksi, nama donatur, anak asuh..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-gnota-500 focus:outline-none"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto no-scrollbar max-w-full">
          {[
            { id: 'ALL', label: 'Semua' },
            { id: 'Menunggu Verifikasi', label: 'Menunggu' },
            { id: 'Terverifikasi', label: 'Terverifikasi' },
            { id: 'Disalurkan', label: 'Disalurkan' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-white text-gnota-800 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Subtotal Pill */}
        <div className="text-xs bg-gnota-50 border border-gnota-100 px-3.5 py-1.5 rounded-xl text-gnota-800 shrink-0">
          <span className="text-slate-500">Total Filter: </span>
          <strong className="text-gnota-700 font-extrabold">{formatRupiah(totalFilteredAmount)}</strong>
        </div>

      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">No. Kuitansi / Tanggal</th>
                <th className="py-3.5 px-4">Donatur (Ortu Asuh)</th>
                <th className="py-3.5 px-4">Program & Paket</th>
                <th className="py-3.5 px-4">Nominal</th>
                <th className="py-3.5 px-4">Metode & Verifikator</th>
                <th className="py-3.5 px-4">Penerima Manfaat</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDonations.length > 0 ? (
                filteredDonations.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* ID & Date */}
                    <td className="py-4 px-4 font-mono">
                      <div className="font-bold text-gnota-700">{d.id}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{d.tanggal}</div>
                    </td>

                    {/* Donatur */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900">{d.donaturNama}</div>
                      <div className="text-[11px] text-slate-500">{d.email} • {d.telepon}</div>
                      <span className="inline-block mt-1 text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                        {d.tipe}
                      </span>
                    </td>

                    {/* Program & Package */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-800">{d.program}</div>
                      <div className="text-[11px] text-slate-500">{d.paketNama}</div>
                      {d.pesanDoa && (
                        <div className="text-[10px] text-slate-400 italic line-clamp-1 mt-0.5 max-w-[200px]">
                          "{d.pesanDoa}"
                        </div>
                      )}
                    </td>

                    {/* Nominal */}
                    <td className="py-4 px-4">
                      <div className="text-sm font-extrabold text-slate-900">{formatRupiah(d.nominal)}</div>
                    </td>

                    {/* Method & Verifikator */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-700">{d.metode}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Staf: {d.karyawanVerifikator || 'Belum ditugaskan'}
                      </div>
                    </td>

                    {/* Penerima Manfaat */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800 max-w-[180px] truncate">
                        {d.anakAsuhNama || 'Alokasi Otomatis'}
                      </div>
                      {d.anakAsuhId && (
                        <span className="text-[10px] font-mono text-gnota-600 font-bold">
                          ID: {d.anakAsuhId}
                        </span>
                      )}
                    </td>

                    {/* Status with Action Toggle */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          d.status === 'Disalurkan'
                            ? 'bg-purple-100 text-purple-700'
                            : d.status === 'Terverifikasi'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {d.status === 'Disalurkan' && <Truck className="w-3 h-3" />}
                          {d.status === 'Terverifikasi' && <CheckCircle2 className="w-3 h-3" />}
                          {d.status === 'Menunggu Verifikasi' && <Clock className="w-3 h-3" />}
                          <span>{d.status}</span>
                        </span>

                        {/* Status Change Shortcut */}
                        {d.status === 'Menunggu Verifikasi' && (
                          <button
                            onClick={() => updateDonationStatus(d.id, 'Terverifikasi')}
                            className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-0.5 rounded shadow-xs"
                          >
                            ✓ Verifikasi
                          </button>
                        )}

                        {d.status === 'Terverifikasi' && (
                          <button
                            onClick={() => updateDonationStatus(d.id, 'Disalurkan')}
                            className="text-[10px] bg-purple-600 hover:bg-purple-700 text-white font-bold px-2 py-0.5 rounded shadow-xs"
                          >
                            📦 Tandai Disalurkan
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => onShowReceipt(d)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gnota-50 hover:bg-gnota-100 text-gnota-700 rounded-lg text-xs font-bold transition-colors shadow-xs"
                        title="Buka Kuitansi Resmi"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Kuitansi</span>
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    Tidak ditemukan pencatatan donasi sesuai filter pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
