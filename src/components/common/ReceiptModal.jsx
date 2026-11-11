import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Printer,
  Download,
  FileDown,
  Image as ImageIcon,
  Link2,
  Check
} from 'lucide-react';
import {
  formatRupiah,
  printReceipt,
  downloadReceiptPDF,
  downloadReceiptPNG,
  buildReceiptShareUrl
} from '../../utils/receiptExport';
import gnotaLogo from '../../assets/logo-gnota.png';

export default function ReceiptModal({ isOpen, onClose, data }) {
  const { copyToClipboard } = useApp();
  const [isExporting, setIsExporting] = useState(null); // 'pdf' | 'png' | null
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !data) return null;

  const receiptUrl = buildReceiptShareUrl(data);

  const handlePrint = async () => {
    await printReceipt(data);
  };

  const handleDownloadPDF = async () => {
    setIsExporting('pdf');
    try {
      await downloadReceiptPDF(data);
    } finally {
      setIsExporting(null);
    }
  };

  const handleDownloadPNG = async () => {
    setIsExporting('png');
    try {
      await downloadReceiptPNG(data);
    } finally {
      setIsExporting(null);
    }
  };

  const handleCopyUrl = () => {
    copyToClipboard(receiptUrl, `Link Kuitansi ${data.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Sticky Top Header Bar (Never clipped off-screen) */}
        <div className="bg-slate-100 px-4 sm:px-6 py-3 border-b border-slate-200 flex items-center justify-between gap-2 shrink-0 print:hidden">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
            <span className="text-xs font-bold text-slate-700 truncate">Kuitansi Resmi Sah GNOTA</span>
            <span className="hidden sm:inline-block font-mono text-[10px] bg-white border border-slate-200 text-gnota-700 px-2 py-0.5 rounded-md font-bold">
              {data.id}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleCopyUrl}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-colors"
              title="Salin Link URL Parameter Kuitansi"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Link2 className="w-3.5 h-3.5 text-gnota-600" />}
              <span className="hidden sm:inline">{copiedLink ? 'Tersalin' : 'Salin Link'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-200/70 p-1.5 rounded-lg border border-slate-200 transition-colors"
              aria-label="Tutup Kuitansi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Receipt Paper */}
        <div id="printable-receipt" className="p-4 sm:p-8 bg-white text-slate-800 overflow-y-auto flex-1">
          
          {/* Header Kop Surat */}
          <div className="border-b-2 border-gnota-800 pb-4 sm:pb-5 mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={gnotaLogo}
                alt="Logo Resmi Yayasan GNOTA"
                className="w-11 h-11 sm:w-14 sm:h-14 rounded-full object-cover shrink-0 bg-white shadow-xs"
              />
              <div>
                <h1 className="font-extrabold text-sm sm:text-lg text-gnota-900 tracking-tight leading-none">
                  YAYASAN GERAKAN NASIONAL ORANG TUA ASUH
                </h1>
                <p className="text-[9px] sm:text-[10px] text-slate-500 mt-1">
                  SK Kemenkumham RI No. AHU-0012984.AH.01.04 • Terdaftar Kemensos RI No. 343/HUK-PS/2018
                </p>
                <p className="text-[8px] sm:text-[9px] text-slate-400">
                  Gedung Pelindung Anak Indonesia, Jl. KH. Hasyim Ashari No. 125, Jakarta Pusat
                </p>
              </div>
            </div>

            <div className="sm:text-right shrink-0">
              <span className="inline-block bg-gnota-100 text-gnota-800 text-[10px] font-bold px-2 py-0.5 rounded border border-gnota-200">
                BUKTI PENERIMAAN DONASI
              </span>
              <p className="font-mono text-xs font-bold text-slate-700 mt-1">{data.id}</p>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider underline decoration-gnota-600 decoration-2">
              KUITANSI DONASI ORANG TUA ASUH
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">Waktu Transaksi: {data.tanggal}</p>
          </div>

          {/* Information Grid */}
          <div className="space-y-3 text-xs mb-8">
            <div className="grid grid-cols-3 py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Telah Diterima Dari</span>
              <span className="col-span-2 font-bold text-slate-900">: {data.donaturNama}</span>
            </div>

            <div className="grid grid-cols-3 py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Jumlah Donasi</span>
              <span className="col-span-2 font-extrabold text-gnota-800 text-sm">
                : {formatRupiah(data.nominal)}
              </span>
            </div>

            <div className="grid grid-cols-3 py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Untuk Program</span>
              <span className="col-span-2 font-semibold text-slate-800">: {data.program}</span>
            </div>

            <div className="grid grid-cols-3 py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Rincian Paket</span>
              <span className="col-span-2 text-slate-700">: {data.paketNama} (Baju seragam, sepatu, tas, & alat tulis)</span>
            </div>

            <div className="grid grid-cols-3 py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Anak Asuh Penerima</span>
              <span className="col-span-2 font-semibold text-emerald-800">: {data.anakAsuhNama || 'Antrean Penyaluran Nasional GNOTA'}</span>
            </div>

            <div className="grid grid-cols-3 py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Kanal Pembayaran</span>
              <span className="col-span-2 font-medium text-slate-700">: {data.metode}</span>
            </div>

            {data.pesanDoa && (
              <div className="grid grid-cols-3 py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Doa / Pesan</span>
                <span className="col-span-2 italic text-slate-600">: "{data.pesanDoa}"</span>
              </div>
            )}
          </div>

          {/* Footer Signatures */}
          <div className="pt-4 flex items-end justify-between text-xs">
            <div className="text-center">
              <div className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center p-1 mx-auto mb-1">
                <div className="text-[9px] text-slate-400 font-mono text-center">
                  QRIS / E-VALID
                  <br />
                  <span className="font-bold text-gnota-700">VERIFIED</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-400">Verifikasi Digital</span>
            </div>

            <div className="text-center">
              <p className="text-[11px] text-slate-500">Jakarta, {data.tanggal ? data.tanggal.split(' ')[0] : '2026-11-06'}</p>
              <p className="font-bold text-slate-800 text-xs mt-1">Pengurus Yayasan GNOTA</p>
              
              {/* Digital Stamp Simulation */}
              <div className="relative my-2">
                <div className="w-28 h-12 border-2 border-gnota-600/70 rounded-md rotate-[-6deg] mx-auto flex items-center justify-center text-gnota-700 font-extrabold text-[10px] uppercase tracking-wider bg-gnota-50/50">
                  ✓ SAH GNOTA
                </div>
              </div>

              <p className="font-bold text-slate-900 underline text-xs">{data.karyawanVerifikator || 'Dewi Lestari, S.E'}</p>
              <p className="text-[10px] text-slate-400">Divisi Keuangan & Donasi</p>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400 space-y-1">
            <p>Kuitansi ini dicetak secara sah melalui Sistem Manajemen Donasi GNOTA. Tidak memerlukan cap basah.</p>
            <p className="font-mono text-[9px] text-slate-400 truncate">
              Link Verifikasi: ?page=portal&kuitansi={data.id}
            </p>
          </div>

        </div>

        {/* Sticky Bottom Print & Download Action Bar (Always Accessible on Desktop & Mobile) */}
        <div className="bg-slate-50 px-4 sm:px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0 print:hidden">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 bg-gnota-700 hover:bg-gnota-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isExporting !== null}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors disabled:opacity-60"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{isExporting === 'pdf' ? 'Menyiapkan...' : 'Download PDF'}</span>
            </button>

            <button
              onClick={handleDownloadPNG}
              disabled={isExporting !== null}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-xs transition-colors disabled:opacity-60"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{isExporting === 'png' ? 'Menyiapkan...' : 'Download PNG'}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
