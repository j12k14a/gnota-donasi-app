import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Heart, LayoutDashboard, Globe, Search, Sparkles, Menu, X, Receipt } from 'lucide-react';
import gnotaLogo from '../../assets/logo-gnota.png';

export default function Navbar({ onOpenDonation, onOpenCheckReceipt }) {
  const { currentView, dashboardTab, donations, navigateTo } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pendingDonations = donations.filter(d => d.status === 'Menunggu Verifikasi').length;

  const handleNavClick = (e, view, tab = 'overview', section = null) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    navigateTo(view, tab, section);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs print:hidden overflow-x-hidden">
      {/* Top Banner Notice (Mobile Optimized) */}
      <div className="bg-gradient-to-r from-gnota-700 via-gnota-600 to-gnota-800 text-white text-[10px] sm:text-xs py-1 px-3 text-center flex items-center justify-center gap-1.5 font-medium">
        <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse shrink-0" />
        <span className="truncate">GNOTA — Mencegah Anak Indonesia Putus Sekolah Sejak 1996</span>
        <span className="hidden md:inline bg-yellow-400 text-slate-900 text-[10px] font-bold px-1.5 py-0.2 rounded ml-1 shrink-0">
          Terakreditasi A Kemensos
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-20 gap-1.5 sm:gap-2 min-w-0">
          
          {/* Logo & Brand Identity */}
          <a
            href="?page=portal"
            onClick={(e) => handleNavClick(e, 'public')}
            className="flex items-center gap-1.5 sm:gap-3 cursor-pointer group shrink-0 min-w-0"
            title="Ke Beranda Portal Donasi GNOTA (?page=portal)"
          >
            <img
              src={gnotaLogo}
              alt="Logo Resmi Yayasan GNOTA"
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover shadow-xs ring-2 ring-gnota-100 group-hover:scale-105 transition-transform shrink-0 bg-white"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-sm sm:text-xl text-gnota-800 tracking-tight leading-none">GNOTA</span>
                <span className="hidden sm:inline-block text-[9px] font-semibold bg-gnota-100 text-gnota-700 px-1 py-0.2 rounded">YAYASAN</span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium hidden sm:block leading-tight mt-0.5">
                Orang Tua Asuh
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links (Public Mode) */}
          {currentView === 'public' && (
            <nav className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-semibold text-slate-600">
              <a
                href="?page=portal&section=beranda"
                onClick={(e) => handleNavClick(e, 'public', 'overview', 'beranda')}
                className="hover:text-gnota-600 transition-colors"
              >
                Beranda
              </a>
              <a
                href="?page=portal&section=paket-donasi"
                onClick={(e) => handleNavClick(e, 'public', 'overview', 'paket-donasi')}
                className="hover:text-gnota-600 transition-colors"
              >
                Paket Donasi
              </a>
              <a
                href="?page=portal&section=anak-asuh"
                onClick={(e) => handleNavClick(e, 'public', 'overview', 'anak-asuh')}
                className="hover:text-gnota-600 transition-colors"
              >
                Anak Asuh
              </a>
              <a
                href="?page=portal&section=tentang"
                onClick={(e) => handleNavClick(e, 'public', 'overview', 'tentang')}
                className="hover:text-gnota-600 transition-colors"
              >
                Tentang Kami
              </a>
              <button 
                onClick={onOpenCheckReceipt}
                className="flex items-center gap-1.5 text-slate-500 hover:text-gnota-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              >
                <Search className="w-3.5 h-3.5" />
                Cek Kuitansi
              </button>
            </nav>
          )}

          {/* Right Action: Responsive Mode Switcher & CTA */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
            {/* View Switcher Toggle */}
            <div className="bg-slate-100 p-0.5 sm:p-1 rounded-xl flex items-center border border-slate-200 text-[11px] sm:text-xs font-semibold">
              <a
                href="?page=portal"
                onClick={(e) => handleNavClick(e, 'public')}
                className={`flex items-center gap-1 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all ${
                  currentView === 'public'
                    ? 'bg-white text-gnota-700 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Tampilan Website Publik Donatur (?page=portal)"
              >
                <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gnota-600" />
                <span>Portal</span>
              </a>
              
              <a
                href={`?page=dashboard&menu=${dashboardTab || 'overview'}`}
                onClick={(e) => handleNavClick(e, 'dashboard', dashboardTab || 'overview')}
                className={`relative flex items-center gap-1 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all ${
                  currentView === 'dashboard'
                    ? 'bg-gnota-700 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Dashboard Pencatatan Staf (?page=dashboard)"
              >
                <LayoutDashboard className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Staf</span>
                {pendingDonations > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute -top-0.5 -right-0.5 ring-1 ring-white"></span>
                )}
              </a>
            </div>

            {/* Quick Action Button (Desktop & Mobile) */}
            {currentView === 'public' ? (
              <button
                onClick={() => onOpenDonation()}
                className="flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-slate-950 font-bold px-2 sm:px-4 py-1 sm:py-2 rounded-xl shadow-xs text-[11px] sm:text-xs shrink-0 transition-transform active:scale-95"
              >
                <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-slate-950 text-slate-950" />
                <span className="hidden sm:inline">Beri Donasi</span>
                <span className="sm:hidden font-extrabold">Donasi</span>
              </button>
            ) : (
              <button
                onClick={() => onOpenDonation()}
                className="flex items-center gap-1 bg-gnota-600 hover:bg-gnota-700 text-white font-semibold px-2 sm:px-3.5 py-1 sm:py-2 rounded-xl text-[11px] sm:text-xs shadow-xs shrink-0 transition-transform active:scale-95"
              >
                <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>+ Catat</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1 sm:p-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu (Dropdown on Mobile) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 shadow-lg space-y-3 animate-in fade-in duration-200">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Navigasi Halaman (URL Parameter)
          </div>
          <div className="flex flex-col space-y-2 text-xs font-semibold text-slate-700">
            <a
              href="?page=portal"
              onClick={(e) => handleNavClick(e, 'public')}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100"
            >
              <span>🌐 Beranda Portal Donatur</span>
              <span className="text-[10px] font-mono text-slate-400">?page=portal</span>
            </a>
            <a
              href="?page=dashboard&menu=overview"
              onClick={(e) => handleNavClick(e, 'dashboard', 'overview')}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100"
            >
              <span>📊 Dashboard Staf Internal</span>
              <span className="text-[10px] font-mono text-slate-400">?page=dashboard</span>
            </a>
            <a
              href="?page=portal&section=paket-donasi"
              onClick={(e) => handleNavClick(e, 'public', 'overview', 'paket-donasi')}
              className="p-2 rounded-lg hover:bg-slate-50"
            >
              📦 Pilihan Paket Donasi (SD, SMP, SMA)
            </a>
            <a
              href="?page=portal&section=anak-asuh"
              onClick={(e) => handleNavClick(e, 'public', 'overview', 'anak-asuh')}
              className="p-2 rounded-lg hover:bg-slate-50"
            >
              🎒 Direktori Calon Anak Asuh
            </a>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenCheckReceipt();
              }}
              className="flex items-center gap-2 p-2 rounded-lg text-left text-gnota-700 bg-gnota-50 font-bold"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Cek & Lacak Kuitansi Donasi</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
