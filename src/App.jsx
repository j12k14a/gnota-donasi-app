import React, { useState, useEffect } from 'react';
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

const JENJANG_PROGRAM_MAP = {
  SD: 'Satu Demi Satu untuk SD',
  SMP: 'Satu Demi Satu untuk SMP',
  'SMA/SMK': 'Satu Demi Satu untuk SMA/SMK',
  'Semua Jenjang': 'Bantuan Pendidikan Anak Daerah 3T',
};

export default function App() {
  const {
    currentView,
    dashboardTab,
    navigateTo,
    urlVersion,
    syncUrlParams,
    buildPageUrl,
    toastMessage,
    copyToClipboard,
    donations,
    anakAsuh,
  } = useApp();

  // Modals state
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [donationConfig, setDonationConfig] = useState(null);

  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const [isCheckReceiptOpen, setIsCheckReceiptOpen] = useState(false);
  const [checkReceiptKode, setCheckReceiptKode] = useState('');
  const [isManualDonationOpen, setIsManualDonationOpen] = useState(false);

  // Sinkronkan state modal dari URL parameters (saat load awal atau tombol Back/Forward)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const kuitansiParam = params.get('kuitansi');
    const donasiParam = params.get('donasi');
    const cekParam = params.get('cek_kuitansi');
    const manualParam = params.get('catat_manual');

    // Jika step 5 pada DonationModal baru saja diselesaikan dan sudah aktif di layar, jangan timpa modal Donasi dengan ReceiptModal secara mendadak
    if (donasiParam === '1' && params.get('step') === '5' && isDonationOpen) {
      return;
    }

    if (kuitansiParam) {
      const existing = donations.find(d => d.id.toLowerCase() === kuitansiParam.toLowerCase());
      const resolvedReceipt = existing || (params.get('nominal') ? {
        id: kuitansiParam,
        donaturNama: params.get('donatur') || 'Donatur GNOTA',
        nominal: Number(params.get('nominal')) || 250000,
        program: params.get('program') || 'Satu Demi Satu untuk SD',
        paketNama: params.get('paket') || 'Paket Bantuan Pendidikan',
        anakAsuhNama: params.get('anak') || 'Antrean Penyaluran Nasional GNOTA',
        metode: params.get('metode') || 'QRIS',
        tanggal: params.get('tgl') || new Date().toISOString().replace('T', ' ').substring(0, 16),
        status: params.get('status') || 'Terverifikasi',
      } : null);

      if (resolvedReceipt) {
        setSelectedReceipt(resolvedReceipt);
        setIsReceiptOpen(true);
        setIsDonationOpen(false);
        setIsCheckReceiptOpen(false);
        setIsManualDonationOpen(false);
        return;
      }
    }

    if (donasiParam === '1' || donasiParam === 'true') {
      const jenjang = params.get('jenjang') || 'SD';
      const nominal = params.get('nominal') ? Number(params.get('nominal')) : undefined;
      const program = params.get('program') || JENJANG_PROGRAM_MAP[jenjang] || 'Satu Demi Satu untuk SD';
      const anakId = params.get('anak');
      const child = anakId ? anakAsuh.find(a => a.id === anakId) : undefined;
      const step = params.get('step') ? Number(params.get('step')) : 1;

      setDonationConfig({ program, jenjang, defaultNominal: nominal, child, step });
      setIsDonationOpen(true);
      setIsReceiptOpen(false);
      setIsCheckReceiptOpen(false);
      return;
    }

    if (cekParam === '1' || cekParam === 'true') {
      setCheckReceiptKode(params.get('kode') || '');
      setIsCheckReceiptOpen(true);
      setIsDonationOpen(false);
      setIsReceiptOpen(false);
      return;
    }

    if (manualParam === '1' || manualParam === 'true') {
      setIsManualDonationOpen(true);
      setIsReceiptOpen(false);
      return;
    }

    setIsDonationOpen(false);
    setIsReceiptOpen(false);
    setIsCheckReceiptOpen(false);
    setIsManualDonationOpen(false);
  }, [urlVersion]);

  const handleOpenDonation = (config = null) => {
    const jenjang = config?.child?.jenjang || config?.jenjang || 'SD';
    const defaultNominal = config?.defaultNominal || (jenjang === 'SMP' ? 300000 : jenjang === 'SMA/SMK' ? 450000 : 250000);
    setDonationConfig(config);
    setIsDonationOpen(true);
    setIsReceiptOpen(false);
    syncUrlParams({
      page: 'portal',
      menu: undefined,
      donasi: '1',
      jenjang,
      nominal: defaultNominal,
      anak: config?.child?.id || undefined,
      step: String(config?.step || 1),
    }, { clearModalParams: true });
  };

  const handleCloseDonation = () => {
    setIsDonationOpen(false);
    syncUrlParams({
      page: currentView === 'dashboard' ? 'dashboard' : 'portal',
      menu: currentView === 'dashboard' ? dashboardTab : undefined,
    }, { clearModalParams: true });
  };

  const handleShowReceipt = (donationData) => {
    if (!donationData) return;
    setSelectedReceipt(donationData);
    setIsReceiptOpen(true);
    setIsDonationOpen(false);
    setIsCheckReceiptOpen(false);
    setIsManualDonationOpen(false);

    syncUrlParams({
      page: currentView === 'dashboard' ? 'dashboard' : 'portal',
      menu: currentView === 'dashboard' ? dashboardTab : undefined,
      kuitansi: donationData.id,
      donatur: donationData.donaturNama,
      nominal: donationData.nominal,
      program: donationData.program,
      paket: donationData.paketNama,
      anak: donationData.anakAsuhNama,
      metode: donationData.metode,
      tgl: donationData.tanggal,
      status: donationData.status,
    }, { clearModalParams: true });
  };

  const handleCloseReceipt = () => {
    setIsReceiptOpen(false);
    syncUrlParams({
      page: currentView === 'dashboard' ? 'dashboard' : 'portal',
      menu: currentView === 'dashboard' ? dashboardTab : undefined,
    }, { clearModalParams: true });
  };

  const handleOpenCheckReceipt = () => {
    setCheckReceiptKode('');
    setIsCheckReceiptOpen(true);
    syncUrlParams({ page: 'portal', cek_kuitansi: '1' }, { clearModalParams: true });
  };

  const handleCloseCheckReceipt = () => {
    setIsCheckReceiptOpen(false);
    syncUrlParams({
      page: currentView === 'dashboard' ? 'dashboard' : 'portal',
    }, { clearModalParams: true });
  };

  const handleOpenManualDonation = () => {
    setIsManualDonationOpen(true);
    syncUrlParams({
      page: 'dashboard',
      menu: dashboardTab || 'overview',
      catat_manual: '1',
    }, { clearModalParams: true });
  };

  const handleCloseManualDonation = () => {
    setIsManualDonationOpen(false);
    syncUrlParams({
      page: 'dashboard',
      menu: dashboardTab || 'overview',
    }, { clearModalParams: true });
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
    ? buildPageUrl({ page: 'dashboard', menu: dashboardTab })
    : `?page=dashboard&menu=${dashboardTab}`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 overflow-x-hidden w-full max-w-full">
      
      {/* Top Universal Navbar */}
      <Navbar
        onOpenDonation={() => handleOpenDonation()}
        onOpenCheckReceipt={handleOpenCheckReceipt}
      />

      {/* Main View Router */}
      {currentView === 'public' ? (
        <main className="flex-1 min-w-0 w-full overflow-x-hidden">
          <HeroSection onOpenDonation={() => handleOpenDonation()} />
          <PaketDonasiSection onSelectPackage={(pkg) => handleOpenDonation(pkg)} />
          <AnakAsuhGallery onSelectChildForDonation={(child) => handleOpenDonation({ child })} />
          <Footer />
        </main>
      ) : (
        <div className="flex-1 flex flex-col md:flex-row bg-slate-100/60 min-w-0 w-full overflow-x-hidden">
          <DashboardSidebar onOpenManualDonation={handleOpenManualDonation} />
          
          <main className="flex-1 min-w-0 p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto overflow-x-hidden">
            {/* Top Page Link Bar for the Current Active Menu (Fully Mobile Responsive) */}
            <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-2.5 bg-white px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-slate-200/90 shadow-xs max-w-full">
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-500">
                <a
                  href="?page=portal"
                  onClick={(e) => { e.preventDefault(); navigateTo('public'); }}
                  className="hover:text-gnota-700 transition-colors hidden sm:inline"
                >
                  GNOTA
                </a>
                <ChevronRight className="w-3 h-3 text-slate-400 hidden sm:inline" />
                <a
                  href="?page=dashboard&menu=overview"
                  onClick={(e) => { e.preventDefault(); navigateTo('dashboard', 'overview'); }}
                  className="hover:text-gnota-700 font-semibold text-slate-700 transition-colors"
                >
                  Dashboard
                </a>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="font-extrabold text-gnota-800 bg-gnota-50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg border border-gnota-100 text-[11px] sm:text-xs">
                  {currentTabLabel}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden lg:flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl text-[11px] font-mono text-slate-600">
                  <Link2 className="w-3.5 h-3.5 text-gnota-600 shrink-0" />
                  <span className="truncate max-w-xs">{fullPageUrl}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(fullPageUrl, `Link ${currentTabLabel}`)}
                  className="flex items-center gap-1 bg-gnota-700 hover:bg-gnota-800 text-white px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl font-bold text-[11px] sm:text-xs shadow-xs transition-colors shrink-0"
                  title="Salin link langsung halaman ini untuk dibagikan"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Link</span>
                </button>
              </div>
            </div>

            {/* Content Tabs */}
            {dashboardTab === 'overview' && (
              <DashboardOverview
                onOpenManualDonation={handleOpenManualDonation}
                onShowReceipt={handleShowReceipt}
              />
            )}
            {dashboardTab === 'donations' && (
              <DonationManagement
                onOpenManualDonation={handleOpenManualDonation}
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
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-semibold border border-slate-700 animate-bounce print:hidden">
          <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Modals */}
      <DonationModal
        isOpen={isDonationOpen}
        onClose={handleCloseDonation}
        initialConfig={donationConfig}
        onShowReceipt={handleShowReceipt}
      />

      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={handleCloseReceipt}
        data={selectedReceipt}
      />

      <CekKuitansiModal
        isOpen={isCheckReceiptOpen}
        onClose={handleCloseCheckReceipt}
        initialKode={checkReceiptKode}
        onShowReceipt={handleShowReceipt}
      />

      <ManualDonationModal
        isOpen={isManualDonationOpen}
        onClose={handleCloseManualDonation}
        onShowReceipt={handleShowReceipt}
      />

    </div>
  );
}
