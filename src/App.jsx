import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ReceiptModal from './components/common/ReceiptModal';
import { Link2, Copy, Check, ChevronRight } from 'lucide-react';

// Public Components
import HeroSection from './components/public/HeroSection';
import PaketDonasiSection from './components/public/PaketDonasiSection';
import AnakAsuhGallery from './components/public/AnakAsuhGallery';
import DonationModal from './components/public/DonationModal';
import CekKuitansiModal from './components/public/CekKuitansiModal';

// Dashboard Components
import DashboardSidebar from './components/dashboard/DashboardSidebar';
import DashboardOverview from './components/dashboard/DashboardOverview';
import DonationManagement from './components/dashboard/DonationManagement';
import TargetManagement from './components/dashboard/TargetManagement';
import DonaturManagement from './components/dashboard/DonaturManagement';
import AnakAsuhManagement from './components/dashboard/AnakAsuhManagement';
import KaryawanManagement from './components/dashboard/KaryawanManagement';
import ManualDonationModal from './components/dashboard/ManualDonationModal';

export default function App() {
  const { currentView, dashboardTab, toastMessage, copyToClipboard } = useApp();

  // Modals state
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [donationConfig, setDonationConfig] = useState(null);

  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const [isCheckReceiptOpen, setIsCheckReceiptOpen] = useState(false);
  const [isManualDonationOpen, setIsManualDonationOpen] = useState(false);

  const handleOpenDonation = (config = null) => {
    setDonationConfig(config);
    setIsDonationOpen(true);
  };

  const handleShowReceipt = (donationData) => {
    setSelectedReceipt(donationData);
    setIsReceiptOpen(true);
  };

  const tabLabels = {
    overview: 'Ringkasan & KPI',
    donations: 'Pencatatan Donasi',
    targets: 'Target Program',
    donaturs: 'Donatur & Ortu Asuh',
    'anak-asuh': 'Penerima Donasi',
    karyawan: 'Staf & Karyawan'
  };

  const currentTabLabel = tabLabels[dashboardTab] || 'Ringkasan & KPI';
  const fullPageUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}#/dashboard/${dashboardTab}`
    : `#/dashboard/${dashboardTab}`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Top Universal Navbar */}
      <Navbar
        onOpenDonation={() => handleOpenDonation()}
        onOpenCheckReceipt={() => setIsCheckReceiptOpen(true)}
      />

      {/* Main View Router */}
      {currentView === 'public' ? (
        <main className="flex-1">
          <HeroSection onOpenDonation={() => handleOpenDonation()} />
          <PaketDonasiSection onSelectPackage={(pkg) => handleOpenDonation(pkg)} />
          <AnakAsuhGallery onSelectChildForDonation={(child) => handleOpenDonation({ child })} />
          <Footer />
        </main>
      ) : (
        <div className="flex-1 flex flex-col md:flex-row bg-slate-100/60">
          <DashboardSidebar onOpenManualDonation={() => setIsManualDonationOpen(true)} />
          
          <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
            {/* Top Page Link Bar for the Current Active Menu */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200/90 shadow-xs">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <a href="#/portal" className="hover:text-gnota-700 transition-colors">GNOTA</a>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <a href="#/dashboard/overview" className="hover:text-gnota-700 font-semibold text-slate-700 transition-colors">
                  Dashboard Staf
                </a>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-extrabold text-gnota-800 bg-gnota-50 px-2.5 py-1 rounded-lg border border-gnota-100">
                  {currentTabLabel}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl text-[11px] font-mono text-slate-600">
                  <Link2 className="w-3.5 h-3.5 text-gnota-600 shrink-0" />
                  <span className="truncate max-w-xs">{fullPageUrl}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(fullPageUrl, `Link ${currentTabLabel}`)}
                  className="flex items-center gap-1.5 bg-gnota-700 hover:bg-gnota-800 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-xs transition-colors"
                  title="Salin link langsung halaman ini untuk dibagikan"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Link Halaman</span>
                </button>
              </div>
            </div>

            {/* Content Tabs */}
            {dashboardTab === 'overview' && (
              <DashboardOverview
                onOpenManualDonation={() => setIsManualDonationOpen(true)}
                onShowReceipt={handleShowReceipt}
              />
            )}
            {dashboardTab === 'donations' && (
              <DonationManagement
                onOpenManualDonation={() => setIsManualDonationOpen(true)}
                onShowReceipt={handleShowReceipt}
              />
            )}
            {dashboardTab === 'targets' && <TargetManagement />}
            {dashboardTab === 'donaturs' && <DonaturManagement />}
            {dashboardTab === 'anak-asuh' && <AnakAsuhManagement />}
            {dashboardTab === 'karyawan' && <KaryawanManagement />}
          </main>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold border border-slate-700 animate-bounce">
          <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Modals */}
      <DonationModal
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
        initialConfig={donationConfig}
        onShowReceipt={handleShowReceipt}
      />

      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        data={selectedReceipt}
      />

      <CekKuitansiModal
        isOpen={isCheckReceiptOpen}
        onClose={() => setIsCheckReceiptOpen(false)}
        onShowReceipt={handleShowReceipt}
      />

      <ManualDonationModal
        isOpen={isManualDonationOpen}
        onClose={() => setIsManualDonationOpen(false)}
        onShowReceipt={handleShowReceipt}
      />

    </div>
  );
}
