import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialCampaigns,
  initialAnakAsuh,
  initialDonaturs,
  initialKaryawan,
  initialDonations
} from '../data/mockData';

const AppContext = createContext();

const VALID_DASHBOARD_TABS = ['overview', 'donations', 'targets', 'donaturs', 'anak-asuh', 'karyawan'];

/**
 * Mengurai state rute dan modal dari URL Query Parameters (?page=...&menu=...)
 * maupun fallback legacy hash (#/dashboard/... atau #paket-donasi).
 */
export const parseUrlRoute = () => {
  const params = new URLSearchParams(window.location.search);
  const hash = window.location.hash.replace(/^#\/?/, '').trim();

  const pageParam = params.get('page');
  const menuParam = params.get('menu') || params.get('tab');
  const sectionParam = params.get('section');

  // Legacy hash compatibility (#/dashboard/donations -> view: dashboard, tab: donations)
  if (hash.startsWith('dashboard')) {
    const parts = hash.split('/');
    const tabName = parts[1] || 'overview';
    return {
      view: 'dashboard',
      tab: VALID_DASHBOARD_TABS.includes(tabName) ? tabName : 'overview',
      section: null,
      params,
      legacyHash: true,
    };
  }

  if (pageParam === 'dashboard') {
    const tabName = menuParam || 'overview';
    return {
      view: 'dashboard',
      tab: VALID_DASHBOARD_TABS.includes(tabName) ? tabName : 'overview',
      section: null,
      params,
      legacyHash: false,
    };
  }

  const knownSections = ['beranda', 'paket-donasi', 'anak-asuh', 'tentang'];
  const resolvedSection = sectionParam || (knownSections.includes(hash) ? hash : null);

  return {
    view: 'public',
    tab: 'overview',
    section: resolvedSection,
    params,
    legacyHash: Boolean(hash),
  };
};

/**
 * Memperbarui URL query parameters pada address bar browser tanpa me-reload halaman.
 */
export const updateUrlParams = (updates = {}, { replace = false, clearModalParams = false } = {}) => {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);

  if (clearModalParams) {
    ['donasi', 'jenjang', 'program', 'nominal', 'anak', 'step', 'kuitansi', 'donatur', 'paket', 'metode', 'tgl', 'status', 'cek_kuitansi', 'kode', 'catat_manual'].forEach((k) => {
      params.delete(k);
    });
  }

  Object.entries(updates).forEach(([key, val]) => {
    if (val === undefined || val === null || val === '') {
      params.delete(key);
    } else {
      params.set(key, String(val));
    }
  });

  if (!params.get('page')) {
    params.set('page', 'portal');
  }

  const nextSearch = `?${params.toString()}`;
  const nextUrl = `${window.location.pathname}${nextSearch}`;

  if (window.location.search !== nextSearch || window.location.hash) {
    if (replace) {
      window.history.replaceState(null, '', nextUrl);
    } else {
      window.history.pushState(null, '', nextUrl);
    }
  }
};

export const AppProvider = ({ children }) => {
  const initialNav = parseUrlRoute();
  const [currentView, setCurrentViewRaw] = useState(initialNav.view); // 'public' | 'dashboard'
  const [dashboardTab, setDashboardTabRaw] = useState(initialNav.tab); // 'overview' | ...
  const [urlVersion, setUrlVersion] = useState(0); // memicu re-evaluasi modal berbasis URL
  const [toastMessage, setToastMessage] = useState(null);

  // Normalisasi awal agar address bar langsung menampilkan ?page=portal atau ?page=dashboard&menu=...
  useEffect(() => {
    const nav = parseUrlRoute();
    const initialUpdates = {
      page: nav.view === 'dashboard' ? 'dashboard' : 'portal',
      menu: nav.view === 'dashboard' ? nav.tab : undefined,
      section: nav.view === 'public' && nav.section ? nav.section : undefined,
    };
    updateUrlParams(initialUpdates, { replace: true });

    if (nav.view === 'public' && nav.section) {
      setTimeout(() => {
        document.getElementById(nav.section)?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }, []);

  // Sinkronkan state ketika tombol Back/Forward browser ditekan atau hash berubah
  useEffect(() => {
    const syncFromBrowser = () => {
      const nav = parseUrlRoute();
      setCurrentViewRaw(nav.view);
      setDashboardTabRaw(nav.tab);
      setUrlVersion((v) => v + 1);
      if (nav.legacyHash) {
        updateUrlParams(
          {
            page: nav.view === 'dashboard' ? 'dashboard' : 'portal',
            menu: nav.view === 'dashboard' ? nav.tab : undefined,
            section: nav.view === 'public' && nav.section ? nav.section : undefined,
          },
          { replace: true }
        );
      }
    };

    window.addEventListener('popstate', syncFromBrowser);
    window.addEventListener('hashchange', syncFromBrowser);
    return () => {
      window.removeEventListener('popstate', syncFromBrowser);
      window.removeEventListener('hashchange', syncFromBrowser);
    };
  }, []);

  const syncUrlParams = (updates, options) => {
    updateUrlParams(updates, options);
  };

  const navigateTo = (view, tab = 'overview', section = null) => {
    if (view === 'public') {
      setCurrentViewRaw('public');
      updateUrlParams(
        { page: 'portal', menu: undefined, section: section || undefined },
        { clearModalParams: true }
      );
      setUrlVersion((v) => v + 1);
      if (section) {
        setTimeout(() => {
          document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
        }, 60);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      const targetTab = VALID_DASHBOARD_TABS.includes(tab) ? tab : 'overview';
      setCurrentViewRaw('dashboard');
      setDashboardTabRaw(targetTab);
      updateUrlParams(
        { page: 'dashboard', menu: targetTab, section: undefined },
        { clearModalParams: true }
      );
      setUrlVersion((v) => v + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const setCurrentView = (view) => {
    if (view === 'public') {
      navigateTo('public');
    } else {
      navigateTo('dashboard', dashboardTab || 'overview');
    }
  };

  const setDashboardTab = (tab) => {
    navigateTo('dashboard', tab);
  };

  const buildPageUrl = (paramsObj = {}) => {
    const params = new URLSearchParams();
    Object.entries(paramsObj).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        params.set(k, String(v));
      }
    });
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };

  const copyToClipboard = (text, label = 'Link halaman') => {
    navigator.clipboard.writeText(text).then(() => {
      setToastMessage(`${label} berhasil disalin!`);
      setTimeout(() => setToastMessage(null), 3000);
    }).catch(() => {
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
    navigateTo('public');
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
      urlVersion,
      syncUrlParams,
      buildPageUrl,
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
