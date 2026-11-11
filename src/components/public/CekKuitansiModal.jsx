import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Search, CheckCircle2, Clock, Truck, FileText } from 'lucide-react';

export default function CekKuitansiModal({ isOpen, onClose, onShowReceipt }) {
  const { donations } = useApp();
  const [searchCode, setSearchCode] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    setHasSearched(true);
    const found = donations.find(d => 
      d.id.toLowerCase() === searchCode.trim().toLowerCase() ||
      d.telepon.includes(searchCode.trim()) ||
      d.email.toLowerCase() === searchCode.trim().toLowerCase()
    );
    setSearchResult(found || null);
  };

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 sm:top-5 right-4 sm:right-5 text-slate-400 hover:text-white p-2 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <Search className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Transparansi Donatur</span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white">Lacak & Cek Kuitansi Donasi</h3>
          <p className="text-xs text-slate-300 mt-1">
            Masukkan Nomor Donasi (contoh: <span className="font-mono text-yellow-300">DON-202611-001</span>), email, atau nomor HP Anda.
          </p>
        </div>

        {/* Search Input Form */}
        <div className="p-4 sm:p-6">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="DON-202611-001 / No WhatsApp..."
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gnota-500"
              />
              <button
                type="submit"
                className="bg-gnota-700 hover:bg-gnota-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs"
              >
                Cari
              </button>
            </div>
          </form>

          {/* Results */}
          {hasSearched && (
            <div>
              {searchResult ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono">NOMOR REGISTRASI</span>
                      <p className="font-bold text-slate-900 text-sm">{searchResult.id}</p>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      searchResult.status === 'Disalurkan'
                        ? 'bg-purple-100 text-purple-700'
                        : searchResult.status === 'Terverifikasi'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {searchResult.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <p><strong className="text-slate-600">Donatur:</strong> {searchResult.donaturNama}</p>
                    <p><strong className="text-slate-600">Program:</strong> {searchResult.program}</p>
                    <p><strong className="text-slate-600">Nominal:</strong> <span className="font-bold text-gnota-700">{formatRupiah(searchResult.nominal)}</span></p>
                    <p><strong className="text-slate-600">Penerima Manfaat:</strong> {searchResult.anakAsuhNama}</p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => onShowReceipt(searchResult)}
                      className="w-full bg-gnota-600 hover:bg-gnota-700 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Buka & Cetak Kuitansi Resmi</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500 text-xs">
                  Tidak ditemukan donasi dengan kata kunci tersebut. Coba gunakan contoh kode: <code className="font-bold text-gnota-700">DON-202611-001</code>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
