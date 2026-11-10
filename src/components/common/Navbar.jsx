import React from 'react';
import { useApp } from '../../context/AppContext';
import { Heart, LayoutDashboard, Globe, Search, Sparkles } from 'lucide-react';

export default function Navbar({ onOpenDonation, onOpenCheckReceipt }) {
  const { currentView, dashboardTab, donations } = useApp();

  const pendingDonations = donations.filter(d => d.status === 'Menunggu Verifikasi').length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-gnota-700 via-gnota-600 to-gnota-800 text-white text-xs py-1.5 px-4 text-center flex items-center justify-center gap-2 font-medium">
        <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
        <span>Gerakan Nasional Orang Tua Asuh (GNOTA) — Mencegah Anak Indonesia Putus Sekolah Sejak 1996</span>
        <span className="hidden md:inline bg-yellow-400 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full ml-2">
          Terakreditasi A Kemensos RI
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity (Link to #/portal) */}
          <a
            href="#/portal"
            className="flex items-center gap-3 cursor-pointer group"
            title="Ke Beranda Portal Donasi GNOTA"
          >
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-gnota-600 to-gnota-800 shadow-md ring-4 ring-gnota-100 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-xl tracking-tighter">GN</span>
              <span className="text-yellow-400 font-black text-xl tracking-tighter">OTA</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl text-gnota-800 tracking-tight">GNOTA</span>
                <span className="text-[10px] font-semibold bg-gnota-100 text-gnota-700 px-1.5 py-0.5 rounded">YAYASAN</span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">Gerakan Nasional Orang Tua Asuh</p>
            </div>
          </a>

          {/* Navigation Links (Public Mode) */}
          {currentView === 'public' && (
            <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
              <a href="#beranda" className="hover:text-gnota-600 transition-colors">Beranda</a>
              <a href="#paket-donasi" className="hover:text-gnota-600 transition-colors">Paket Donasi</a>
              <a href="#anak-asuh" className="hover:text-gnota-600 transition-colors">Anak Asuh</a>
              <a href="#tentang" className="hover:text-gnota-600 transition-colors">Tentang Kami</a>
              <button 
                onClick={onOpenCheckReceipt}
                className="flex items-center gap-1.5 text-slate-500 hover:text-gnota-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              >
                <Search className="w-3.5 h-3.5" />
                Cek Kuitansi Donasi
              </button>
            </nav>
          )}

          {/* Right Action: Mode Switcher & Primary CTA */}
          <div className="flex items-center gap-3">
            {/* View Switcher Toggle with Real Hyperlinks */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 text-xs font-semibold">
              <a
                href="#/portal"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  currentView === 'public'
                    ? 'bg-white text-gnota-700 shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Tampilan Halaman Website Publik Donatur (Link: #/portal)"
              >
                <Globe className="w-3.5 h-3.5 text-gnota-600" />
                <span className="hidden sm:inline">Portal Donatur</span>
              </a>
              
              <a
                href={`#/dashboard/${dashboardTab || 'overview'}`}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  currentView === 'dashboard'
                    ? 'bg-gnota-700 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Buka Halaman Dashboard Staf Internal (Link: #/dashboard)"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard Staf</span>
                {pendingDonations > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 absolute -top-0.5 -right-0.5 ring-2 ring-white"></span>
                )}
              </a>
            </div>

            {/* Quick Action Button */}
            {currentView === 'public' ? (
              <button
                onClick={() => onOpenDonation()}
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-slate-900 font-bold px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 text-sm"
              >
                <Heart className="w-4 h-4 fill-slate-900 text-slate-900" />
                <span>Beri Donasi</span>
              </button>
            ) : (
              <button
                onClick={() => onOpenDonation()}
                className="flex items-center gap-2 bg-gnota-600 hover:bg-gnota-700 text-white font-semibold px-3.5 py-2 rounded-xl text-xs shadow-sm transition-all"
              >
                <Heart className="w-3.5 h-3.5" />
                <span className="hidden md:inline">+ Catat Donasi</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
