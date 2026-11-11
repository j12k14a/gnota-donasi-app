import React from 'react';
import { useApp } from '../../context/AppContext';
import { Heart, Mail, Phone, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import gnotaLogo from '../../assets/logo-gnota.png';

export default function Footer() {
  const { navigateTo } = useApp();

  const handlePaketClick = (e) => {
    e.preventDefault();
    navigateTo('public', 'overview', 'paket-donasi');
  };

  return (
    <footer id="tentang" className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: About GNOTA */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={gnotaLogo}
                alt="Logo Resmi Yayasan GNOTA"
                className="w-11 h-11 rounded-full object-cover bg-white shadow-md ring-2 ring-white/20 shrink-0"
              />
              <div>
                <h3 className="font-bold text-white text-lg tracking-tight">Yayasan GNOTA</h3>
                <p className="text-xs text-slate-400">Gerakan Nasional Orang Tua Asuh</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Lembaga nirlaba independen yang menggalang kepedulian masyarakat untuk menjadi Orang Tua Asuh bagi anak-anak usia sekolah dari keluarga prasejahtera agar tidak putus sekolah.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>SK Kemensos RI No. 343/HUK-PS/2018</span>
            </div>
          </div>

          {/* Col 2: Program Bantuan */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4">Paket Donasi Anak Asuh</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="?page=portal&section=paket-donasi" onClick={handlePaketClick} className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gnota-400"></span>
                  Satu Demi Satu untuk SD (Rp 250.000 / thn)
                </a>
              </li>
              <li>
                <a href="?page=portal&section=paket-donasi" onClick={handlePaketClick} className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gnota-400"></span>
                  Satu Demi Satu untuk SMP (Rp 300.000 / thn)
                </a>
              </li>
              <li>
                <a href="?page=portal&section=paket-donasi" onClick={handlePaketClick} className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gnota-400"></span>
                  Satu Demi Satu untuk SMA/SMK (Rp 450.000 / thn)
                </a>
              </li>
              <li>
                <a href="?page=portal&section=paket-donasi" onClick={handlePaketClick} className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gnota-400"></span>
                  Bantuan Pendidikan Daerah 3T (Pelosok)
                </a>
              </li>
              <li>
                <a href="?page=portal&section=paket-donasi" onClick={handlePaketClick} className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gnota-400"></span>
                  Kemitraan CSR Perusahaan
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Rekening Resmi Yayasan */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4">Rekening Resmi Donasi</h4>
            <div className="space-y-3 text-xs">
              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                <p className="font-semibold text-white">Bank Central Asia (BCA)</p>
                <p className="font-mono text-amber-400 text-sm font-bold">084 303 5555</p>
                <p className="text-slate-400 text-[11px]">a.n. Yayasan GNOTA</p>
              </div>
              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                <p className="font-semibold text-white">Bank Mandiri</p>
                <p className="font-mono text-amber-400 text-sm font-bold">122 00 9988 7776</p>
                <p className="text-slate-400 text-[11px]">a.n. Yayasan Orang Tua Asuh</p>
              </div>
            </div>
          </div>

          {/* Col 4: Sekretariat & Kontak */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4">Sekretariat Pengurus</h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gnota-400 shrink-0 mt-0.5" />
                <span>Gedung Pelindung Anak Indonesia, Jl. KH. Hasyim Ashari No. 125, Jakarta Pusat 10150</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gnota-400 shrink-0" />
                <span>(021) 6386 4500 / 0812-9900-GNOTA</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gnota-400 shrink-0" />
                <span>donasi@gnota.or.id</span>
              </div>
              <div className="pt-2">
                <a
                  href="https://www.instagram.com/yayasangnota/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-gnota-400 hover:text-white transition-colors"
                >
                  Instagram: @yayasangnota
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Yayasan Gerakan Nasional Orang Tua Asuh (GNOTA). Seluruh Hak Dilindungi.</p>
          <div className="flex items-center gap-4">
            <span>Transparansi Laporan</span>
            <span>•</span>
            <span>Kebijakan Privasi Donatur</span>
            <span>•</span>
            <span>Akreditasi Kemensos</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
