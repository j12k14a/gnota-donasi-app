import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ReceiptModal from './components/common/ReceiptModal';

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
  const { currentView, dashboardTab } = useApp();

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
