import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  Target,
  Users,
  GraduationCap,
  Briefcase,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  FileText
} from 'lucide-react';

export default function DashboardOverview({ onOpenManualDonation, onShowReceipt }) {
  const {
    donations,
    campaigns,
    anakAsuh,
    donaturs,
    karyawan,
    totalDonasiTerkumpul,
    totalTargetKeseluruhan
  } = useApp();

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const percentage = Math.min(100, Math.round((totalDonasiTerkumpul / totalTargetKeseluruhan) * 100));
  const recentDonations = donations.slice(0, 5);

  return (
    <div className="space-y-5 sm:space-y-8">
      
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-gnota-800 to-slate-900 text-white rounded-3xl p-5 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
            <span className="bg-yellow-400 text-slate-950 font-bold text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full uppercase">
              Sistem Informasi Donasi
            </span>
            <span className="text-[10px] sm:text-xs text-slate-300">Yayasan GNOTA</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
            Dashboard Pengelolaan Donasi & Ortu Asuh
          </h1>
          <p className="text-[11px] sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Pantau arus donasi masuk, realisasi target beasiswa seragam, relasi donatur dengan anak asuh, dan verifikasi staf internal.
          </p>
        </div>

        <button
          onClick={onOpenManualDonation}
          className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold text-xs px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl shadow-md transition-all shrink-0 flex items-center justify-center gap-1.5 active:scale-95"
        >
          <span>+ Catat Donasi Manual</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Cards Grid (Mobile 2-cols, Desktop 5-cols) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-4">
        
        {/* 1. Jumlah Donasi */}
        <a
          href="#/dashboard/donations"
          className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-gnota-300 cursor-pointer transition-all block group"
          title="Ke Halaman Pencatatan Donasi (#/dashboard/donations)"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider group-hover:text-gnota-700 transition-colors">Donasi</span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-gnota-50 text-gnota-600 group-hover:bg-gnota-100 transition-colors">
              <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <h3 className="text-sm sm:text-xl font-extrabold text-slate-900 leading-tight">{formatRupiah(totalDonasiTerkumpul)}</h3>
          <p className="text-[10px] sm:text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span className="font-bold text-gnota-600">{donations.length}</span> transaksi
          </p>
        </a>

        {/* 2. Target Program */}
        <a
          href="#/dashboard/targets"
          className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-300 cursor-pointer transition-all block group"
          title="Ke Halaman Target Program (#/dashboard/targets)"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider group-hover:text-amber-700 transition-colors">Target</span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors">
              <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <h3 className="text-sm sm:text-xl font-extrabold text-slate-900 leading-tight">{formatRupiah(totalTargetKeseluruhan)}</h3>
          <p className="text-[10px] sm:text-xs text-amber-600 font-bold mt-1">
            {percentage}% Terpenuhi
          </p>
        </a>

        {/* 3. Donator & Ortu Asuh */}
        <a
          href="#/dashboard/donaturs"
          className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 cursor-pointer transition-all block group"
          title="Ke Halaman Donatur & Ortu Asuh (#/dashboard/donaturs)"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider group-hover:text-blue-700 transition-colors">Donatur</span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <h3 className="text-base sm:text-xl font-extrabold text-slate-900">{donaturs.length}</h3>
          <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">
            {donaturs.filter(d => d.statusOrtuAsuh === 'Aktif').length} Ortu Aktif
          </p>
        </a>

        {/* 4. Penerima Donasi (Anak Asuh) */}
        <a
          href="#/dashboard/anak-asuh"
          className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 cursor-pointer transition-all block group"
          title="Ke Halaman Penerima Donasi (#/dashboard/anak-asuh)"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider group-hover:text-emerald-700 transition-colors">Penerima</span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
              <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <h3 className="text-base sm:text-xl font-extrabold text-slate-900">{anakAsuh.length} Siswa</h3>
          <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">
            {anakAsuh.filter(a => a.status === 'Didampingi').length} Dibiayai
          </p>
        </a>

        {/* 5. Karyawan (Spans 2 cols on mobile) */}
        <a
          href="#/dashboard/karyawan"
          className="col-span-2 lg:col-span-1 bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-purple-300 cursor-pointer transition-all block group"
          title="Ke Halaman Staf & Karyawan (#/dashboard/karyawan)"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider group-hover:text-purple-700 transition-colors">Staf & Karyawan</span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-100 transition-colors">
              <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <h3 className="text-base sm:text-xl font-extrabold text-slate-900">{karyawan.length} Petugas</h3>
          <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">
            Verifikator & Lapangan
          </p>
        </a>

      </div>

      {/* Program Target Progress Breakdown */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">Progres Target Paket Bantuan</h3>
            <p className="text-[11px] sm:text-xs text-slate-500">Capaian penggalangan donasi seragam & perlengkapan sekolah</p>
          </div>
          <a
            href="#/dashboard/targets"
            className="text-[11px] sm:text-xs font-bold text-gnota-700 hover:text-gnota-800 flex items-center gap-1 shrink-0"
            title="Kelola Target (#/dashboard/targets)"
          >
            <span>Target</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {campaigns.map(camp => {
            const prog = Math.min(100, Math.round((camp.collected / camp.target) * 100));
            return (
              <div key={camp.id} className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-800 truncate pr-2">{camp.name}</span>
                  <span className="font-extrabold text-gnota-700 shrink-0">{prog}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 sm:h-2.5 overflow-hidden mb-2">
                  <div
                    className="bg-gradient-to-r from-gnota-600 to-amber-500 h-full rounded-full"
                    style={{ width: `${prog}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500">
                  <span>Terkumpul: <strong>{formatRupiah(camp.collected)}</strong></span>
                  <span>Target: {formatRupiah(camp.target)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Donations Table (Scrollable Container with Minimum Width) */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">Pencatatan Donasi Terbaru</h3>
            <p className="text-[11px] sm:text-xs text-slate-500">Histori transaksi donasi masuk secara real-time</p>
          </div>
          <a
            href="#/dashboard/donations"
            className="text-[11px] sm:text-xs font-bold text-gnota-700 hover:text-gnota-800 flex items-center gap-1 shrink-0"
            title="Lihat Semua Transaksi Donasi (#/dashboard/donations)"
          >
            <span>Semua ({donations.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="overflow-x-auto -mx-1 sm:mx-0">
          <table className="w-full text-left text-xs min-w-[620px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[11px]">
                <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-bold">ID & Waktu</th>
                <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-bold">Donatur</th>
                <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-bold">Program</th>
                <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-bold">Nominal</th>
                <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-bold">Penerima</th>
                <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-bold">Status</th>
                <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentDonations.map(d => (
                <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 sm:px-4 font-mono">
                    <div className="font-bold text-slate-900">{d.id}</div>
                    <div className="text-[10px] text-slate-400">{d.tanggal}</div>
                  </td>
                  <td className="py-3 px-3 sm:px-4">
                    <div className="font-bold text-slate-800">{d.donaturNama}</div>
                    <div className="text-[10px] text-slate-400">{d.tipe}</div>
                  </td>
                  <td className="py-3 px-3 sm:px-4">
                    <div className="font-medium text-slate-800">{d.program}</div>
                    <div className="text-[10px] text-slate-400">{d.paketNama}</div>
                  </td>
                  <td className="py-3 px-3 sm:px-4 font-extrabold text-gnota-800">
                    {formatRupiah(d.nominal)}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-slate-600 truncate max-w-[140px]">
                    {d.anakAsuhNama}
                  </td>
                  <td className="py-3 px-3 sm:px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      d.status === 'Disalurkan'
                        ? 'bg-purple-100 text-purple-700'
                        : d.status === 'Terverifikasi'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {d.status === 'Disalurkan' && <CheckCircle2 className="w-3 h-3" />}
                      {d.status === 'Terverifikasi' && <CheckCircle2 className="w-3 h-3" />}
                      {d.status === 'Menunggu Verifikasi' && <Clock className="w-3 h-3" />}
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-right">
                    <button
                      onClick={() => onShowReceipt(d)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-gnota-600 hover:text-gnota-800 bg-gnota-50 hover:bg-gnota-100 px-2 py-1 rounded-lg transition-colors"
                      title="Lihat Kuitansi"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Kuitansi</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
