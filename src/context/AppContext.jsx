import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialCampaigns,
  initialAnakAsuh,
  initialDonaturs,
  initialKaryawan,
  initialDonations
} from '../data/mockData';

const AppContext = createContext();

// Helper to parse route from URL hash
const parseHash = () => {
  const hash = window.location.hash.replace(/^#\/?/, '').trim();
  if (!hash || hash === 'portal' || hash === 'beranda' || hash === 'paket-donasi' || hash === 'anak-asuh' || hash === 'tentang') {
    return { view: 'public', tab: 'overview' };
  }
  if (hash.startsWith('dashboard')) {
    const parts = hash.split('/');
    const tabName = parts[1] || 'overview';
    const validTabs = ['overview', 'donations', 'targets', 'donaturs', 'anak-asuh', 'karyawan'];
    return {
      view: 'dashboard',
      tab: validTabs.includes(tabName) ? tabName : 'overview'
    };
  }
  return { view: 'public', tab: 'overview' };
};

export const AppProvider = ({ children }) => {
  // Navigation / View state based on URL Hash
  const initialNav = parseHash();
  const [currentView, setCurrentViewRaw] = useState(initialNav.view); // 'public' | 'dashboard'
  const [dashboardTab, setDashboardTabRaw] = useState(initialNav.tab); // 'overview' | 'donations' | 'targets' | 'donaturs' | 'anak-asuh' | 'karyawan'
  const [toastMessage, setToastMessage] = useState(null);

  // Sync state when URL hash changes (back/forward button, direct link)
  useEffect(() => {
    const handleHashChange = () => {
      const nav = parseHash();
      setCurrentViewRaw(nav.view);
      setDashboardTabRaw(nav.tab);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when programmatically switching views
  const setCurrentView = (view) => {
    if (view === 'public') {
      window.location.hash = '#/portal';
    } else {
      window.location.hash = `#/dashboard/${dashboardTab || 'overview'}`;
    }
  };

  const setDashboardTab = (tab) => {
    window.location.hash = `#/dashboard/${tab}`;
  };

  const navigateTo = (view, tab = 'overview') => {
    if (view === 'public') {
      window.location.hash = '#/portal';
    } else {
      window.location.hash = `#/dashboard/${tab}`;
    }
  };

  const copyToClipboard = (text, label = 'Link halaman') => {
    navigator.clipboard.writeText(text).then(() => {
      setToastMessage(`${label} berhasil disalin!`);
      setTimeout(() => setToastMessage(null), 3000);
    }).catch(() => {
      // Fallback
      const input = document.createElement('input');
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setToastMessage(`${label} berhasil disalin!`);
      setTimeout(() => setToastMessage(null), 3000);
    });
  };

  // Data state with LocalStorage persistence
  const [campaigns, setCampaigns] = useState(() => {
    const saved = localStorage.getItem('gnota_campaigns');
    return saved ? JSON.parse(saved) : initialCampaigns;
  });

  const [anakAsuh, setAnakAsuh] = useState(() => {
    const saved = localStorage.getItem('gnota_anakAsuh');
    return saved ? JSON.parse(saved) : initialAnakAsuh;
  });

  const [donaturs, setDonaturs] = useState(() => {
    const saved = localStorage.getItem('gnota_donaturs');
    return saved ? JSON.parse(saved) : initialDonaturs;
  });

  const [karyawan, setKaryawan] = useState(() => {
    const saved = localStorage.getItem('gnota_karyawan');
    return saved ? JSON.parse(saved) : initialKaryawan;
  });

  const [donations, setDonations] = useState(() => {
    const saved = localStorage.getItem('gnota_donations');
    return saved ? JSON.parse(saved) : initialDonations;
  });

  // Selected state for Modals
  const [activeDonationModal, setActiveDonationModal] = useState(null);
  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => {
    localStorage.setItem('gnota_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('gnota_anakAsuh', JSON.stringify(anakAsuh));
  }, [anakAsuh]);

  useEffect(() => {
    localStorage.setItem('gnota_donaturs', JSON.stringify(donaturs));
  }, [donaturs]);

  useEffect(() => {
    localStorage.setItem('gnota_karyawan', JSON.stringify(karyawan));
  }, [karyawan]);

  useEffect(() => {
    localStorage.setItem('gnota_donations', JSON.stringify(donations));
  }, [donations]);

  // Actions
  const addDonation = (donationData) => {
    const newId = `DON-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(donations.length + 1).padStart(3, '0')}`;
    const newDate = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    const newDonation = {
      id: newId,
      tanggal: newDate,
      status: 'Terverifikasi',
      karyawanVerifikator: 'Sistem Otomatis / Dewi Lestari, S.E',
      ...donationData
    };

    setDonations(prev => [newDonation, ...prev]);

    // Update campaign collected amount & donor count
    setCampaigns(prev => prev.map(c => {
      if (c.name.toLowerCase().includes(donationData.program.toLowerCase()) || donationData.program.toLowerCase().includes(c.jenjang.toLowerCase())) {
        return {
          ...c,
          collected: c.collected + Number(donationData.nominal),
          donorCount: c.donorCount + 1,
          studentsHelped: c.studentsHelped + 1
        };
      }
      return c;
    }));

    // Update or add Donatur
    if (donationData.donaturNama && donationData.donaturNama !== 'Hamba Allah') {
      setDonaturs(prev => {
        const existing = prev.find(d => d.email === donationData.email || d.telepon === donationData.telepon);
        if (existing) {
          return prev.map(d => d.id === existing.id ? {
            ...d,
            totalDonasi: d.totalDonasi + Number(donationData.nominal),
            anakAsuhList: donationData.anakAsuhId && !d.anakAsuhList.includes(donationData.anakAsuhId)
              ? [...d.anakAsuhList, donationData.anakAsuhId]
              : d.anakAsuhList
          } : d);
        } else {
          const newDnrId = `DNR-${String(prev.length + 1).padStart(3, '0')}`;
          return [...prev, {
            id: newDnrId,
            nama: donationData.donaturNama,
            tipe: donationData.tipe || 'Individu',
            email: donationData.email,
            telepon: donationData.telepon,
            kota: donationData.kota || 'Indonesia',
            statusOrtuAsuh: donationData.anakAsuhId ? 'Aktif' : 'Donatur Lepas',
            anakAsuhList: donationData.anakAsuhId ? [donationData.anakAsuhId] : [],
            totalDonasi: Number(donationData.nominal),
            tanggalBergabung: newDate.split(' ')[0]
          }];
        }
      });
    }

    // If assigned to a child, mark child as 'Didampingi'
    if (donationData.anakAsuhId) {
      setAnakAsuh(prev => prev.map(child => {
        if (child.id === donationData.anakAsuhId) {
          return {
            ...child,
            status: 'Didampingi',
            ortuAsuhNama: donationData.donaturNama
          };
        }
        return child;
      }));
    }

    return newDonation;
  };

  const updateDonationStatus = (donationId, newStatus, verifikatorName = 'Dewi Lestari, S.E') => {
    setDonations(prev => prev.map(d => {
      if (d.id === donationId) {
        return {
          ...d,
          status: newStatus,
          karyawanVerifikator: verifikatorName
        };
      }
      return d;
    }));
  };

  const addAnakAsuh = (childData) => {
    const newId = `AA-${String(anakAsuh.length + 1).padStart(3, '0')}`;
    const newChild = {
      id: newId,
      status: 'Menunggu Donatur',
      ortuAsuhId: null,
      ortuAsuhNama: null,
      foto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=500&q=80',
      ...childData
    };
    setAnakAsuh(prev => [newChild, ...prev]);
  };

  const updateAnakAsuh = (id, updatedData) => {
    setAnakAsuh(prev => prev.map(c => c.id === id ? { ...c, ...updatedData } : c));
  };

  const deleteAnakAsuh = (id) => {
    setAnakAsuh(prev => prev.filter(c => c.id !== id));
  };

  const addKaryawan = (karyawanData) => {
    const newId = `KRY-${String(karyawan.length + 1).padStart(3, '0')}`;
    const newKry = {
      id: newId,
      status: 'Aktif',
      tanggalMasuk: new Date().toISOString().split('T')[0],
      ...karyawanData
    };
    setKaryawan(prev => [...prev, newKry]);
  };

  const updateKaryawan = (id, updatedData) => {
    setKaryawan(prev => prev.map(k => k.id === id ? { ...k, ...updatedData } : k));
  };

  const updateCampaignTarget = (id, newTarget) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, target: Number(newTarget) } : c));
  };

  const resetAllDataToDefault = () => {
    localStorage.removeItem('gnota_campaigns');
    localStorage.removeItem('gnota_anakAsuh');
    localStorage.removeItem('gnota_donaturs');
    localStorage.removeItem('gnota_karyawan');
    localStorage.removeItem('gnota_donations');
    setCampaigns(initialCampaigns);
    setAnakAsuh(initialAnakAsuh);
    setDonaturs(initialDonaturs);
    setKaryawan(initialKaryawan);
    setDonations(initialDonations);
    window.location.hash = '#/portal';
  };

  // Aggregated Stats
  const totalDonasiTerkumpul = donations.reduce((sum, d) => sum + Number(d.nominal), 0) + 750000000;
  const totalTargetKeseluruhan = campaigns.reduce((sum, c) => sum + Number(c.target), 0);
  const totalAnakDidampingi = anakAsuh.filter(a => a.status === 'Didampingi').length;
  const totalAnakMenunggu = anakAsuh.filter(a => a.status === 'Menunggu Donatur').length;
  const totalOrtuAsuhAktif = donaturs.filter(d => d.statusOrtuAsuh === 'Aktif').length;

  return (
    <AppContext.Provider value={{
      currentView,
      setCurrentView,
      dashboardTab,
      setDashboardTab,
      navigateTo,
      toastMessage,
      copyToClipboard,
      campaigns,
      anakAsuh,
      donaturs,
      karyawan,
      donations,
      activeDonationModal,
      setActiveDonationModal,
      receiptData,
      setReceiptData,
      addDonation,
      updateDonationStatus,
      addAnakAsuh,
      updateAnakAsuh,
      deleteAnakAsuh,
      addKaryawan,
      updateKaryawan,
      updateCampaignTarget,
      resetAllDataToDefault,
      totalDonasiTerkumpul,
      totalTargetKeseluruhan,
      totalAnakDidampingi,
      totalAnakMenunggu,
      totalOrtuAsuhAktif
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
