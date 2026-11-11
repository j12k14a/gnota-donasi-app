import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Receipt,
  Target,
  Users,
  GraduationCap,
  Briefcase,
  RotateCcw,
  PlusCircle,
  ExternalLink,
  Link2
} from 'lucide-react';

export default function DashboardSidebar({ onOpenManualDonation }) {
  const { dashboardTab, donations, resetAllDataToDefault, copyToClipboard, navigateTo, buildPageUrl } = useApp();

  const pendingCount = donations.filter(d => d.status === 'Menunggu Verifikasi').length;

  const navItems = [
    { id: 'overview', label: 'Ringkasan & KPI', shortLabel: 'Ringkasan', icon: LayoutDashboard, path: '?page=dashboard&menu=overview' },
    { id: 'donations', label: 'Pencatatan Donasi', shortLabel: 'Pencatatan', icon: Receipt, path: '?page=dashboard&menu=donations', badge: pendingCount > 0 ? pendingCount : null },
    { id: 'targets', label: 'Target Program', shortLabel: 'Target', icon: Target, path: '?page=dashboard&menu=targets' },
    { id: 'donaturs', label: 'Donatur & Ortu Asuh', shortLabel: 'Donatur', icon: Users, path: '?page=dashboard&menu=donaturs' },
    { id: 'anak-asuh', label: 'Penerima Donasi', shortLabel: 'Penerima', icon: GraduationCap, path: '?page=dashboard&menu=anak-asuh' },
    { id: 'karyawan', label: 'Staf & Karyawan', shortLabel: 'Karyawan', icon: Briefcase, path: '?page=dashboard&menu=karyawan' },
  ];

  const handleCopyLink = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    const fullUrl = buildPageUrl({ page: 'dashboard', menu: item.id });
    copyToClipboard(fullUrl, `Link Menu "${item.label}"`);
  };

  return (
    <>
      {/* MOBILE VIEW (Horizontal Swipeable Tab Bar at the top of Dashboard) */}
      <div className="md:hidden w-full bg-slate-900 border-b border-slate-800 px-3 py-2.5 shrink-0 shadow-sm print:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Menu Manajemen GNOTA
          </span>
          <button
            onClick={onOpenManualDonation}
            className="bg-gnota-600 hover:bg-gnota-700 text-white font-bold px-2.5 py-1 rounded-lg text-[10px] flex items-center gap-1 shadow-xs"
          >
            <PlusCircle className="w-3 h-3" />
            <span>+ Donasi</span>
          </button>
        </div>

        {/* Scrollable Horizontal Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = dashboardTab === item.id;

            return (
              <a
                key={item.id}
                href={item.path}
                onClick={(e) => { e.preventDefault(); navigateTo('dashboard', item.id); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-gnota-700 text-white shadow-xs font-bold ring-1 ring-gnota-400'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.shortLabel}</span>
                {item.badge && (
                  <span className="bg-amber-500 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-full">
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}
        </div>
      </div>

      {/* DESKTOP VIEW (Classic Left Sidebar) */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-col shrink-0 min-h-[calc(100vh-5rem)] border-r border-slate-800 print:hidden">
        
        {/* Quick Action Button */}
        <div className="p-4 border-b border-slate-800">
          <button
            onClick={onOpenManualDonation}
            className="w-full bg-gnota-600 hover:bg-gnota-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Catat Donasi Baru</span>
          </button>
        </div>

        {/* Navigation List with Real Hyperlinks */}
        <nav className="p-3 space-y-1.5 flex-1">
          <div className="flex items-center justify-between px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <span>MENU MANAJEMEN GNOTA</span>
            <span className="text-[9px] font-mono text-slate-600 lowercase">url param</span>
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = dashboardTab === item.id;

            return (
              <div key={item.id} className="relative group flex items-center">
                <a
                  href={item.path}
                  onClick={(e) => { e.preventDefault(); navigateTo('dashboard', item.id); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gnota-700 text-white shadow-xs'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                  title={`Kunjungi halaman ${item.label} (${item.path})`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 ml-1">
                    {item.badge && (
                      <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {/* Copy Link Action on Hover */}
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => handleCopyLink(e, item)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleCopyLink(e, item); }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-700/80 rounded text-slate-300 hover:text-amber-400 transition-opacity cursor-pointer"
                      title={`Salin URL ${item.label}`}
                    >
                      <Link2 className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </a>
              </div>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2 text-xs">
          <a
            href="?page=portal"
            onClick={(e) => { e.preventDefault(); navigateTo('public'); }}
            className="w-full flex items-center justify-between px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-[11px]"
            title="Ke Halaman Utama Portal Donatur (?page=portal)"
          >
            <span>Buka Portal Donatur</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => {
              if (confirm('Kembalikan semua data simulasi ke data awal?')) {
                resetAllDataToDefault();
              }
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-amber-400 transition-colors text-[11px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data Demo</span>
          </button>
        </div>

      </aside>
    </>
  );
}
