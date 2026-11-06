import React from 'react';
import { X, Printer, ShieldCheck, Download, CheckCircle2 } from 'lucide-react';

export default function ReceiptModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 flex flex-col">
        
        {/* Top Action Bar */}
        <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold text-slate-700">Kuitansi Resmi Sah GNOTA</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gnota-700 hover:bg-gnota-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div id="printable-receipt" className="p-8 bg-white text-slate-800">
          
          {/* Header Kop Surat */}
          <div className="border-b-2 border-gnota-800 pb-5 mb-6 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gnota-700 font-black text-white text-lg">
                GN
              </div>
              <div>
                <h1 className="font-extrabold text-lg text-gnota-900 tracking-tight leading-none">
                  YAYASAN GERAKAN NASIONAL ORANG TUA ASUH
                </h1>
                <p className="text-[10px] text-slate-500 mt-1">
                  SK Kemenkumham RI No. AHU-0012984.AH.01.04 • Terdaftar Kemensos RI No. 343/HUK-PS/2018
                </p>
                <p className="text-[9px] text-slate-400">
                  Gedung Pelindung Anak Indonesia, Jl. KH. Hasyim Ashari No. 125, Jakarta Pusat
                </p>
              </div>
            </div>

            <div className="text-right">
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

          <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400">
            Kuitansi ini dicetak secara sah melalui Sistem Manajemen Donasi GNOTA. Tidak memerlukan cap basah.
          </div>

        </div>

      </div>
    </div>
  );
}
