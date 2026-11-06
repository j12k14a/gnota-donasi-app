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
  ExternalLink
} from 'lucide-react';

export default function DashboardSidebar({ onOpenManualDonation }) {
  const { dashboardTab, setDashboardTab, donations, resetAllDataToDefault, setCurrentView } = useApp();

  const pendingCount = donations.filter(d => d.status === 'Menunggu Verifikasi').length;

  const navItems = [
    { id: 'overview', label: 'Ringkasan & KPI', icon: LayoutDashboard },
    { id: 'donations', label: 'Pencatatan Donasi', icon: Receipt, badge: pendingCount > 0 ? pendingCount : null },
    { id: 'targets', label: 'Target Program', icon: Target },
    { id: 'donaturs', label: 'Donatur & Ortu Asuh', icon: Users },
    { id: 'anak-asuh', label: 'Penerima Donasi', icon: GraduationCap },
    { id: 'karyawan', label: 'Staf & Karyawan', icon: Briefcase },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-5rem)] border-r border-slate-800">
      
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

      {/* Navigation List */}
      <nav className="p-3 space-y-1 flex-1">
        <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Menu Manajemen GNOTA
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = dashboardTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setDashboardTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gnota-700 text-white shadow-xs'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-800 space-y-2 text-xs">
        <button
          onClick={() => setCurrentView('public')}
          className="w-full flex items-center justify-between px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-[11px]"
        >
          <span>Buka Portal Donatur</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

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
  );
}
