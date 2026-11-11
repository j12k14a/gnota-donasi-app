import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, PlusCircle, CheckCircle2, User, DollarSign, Heart, ShieldCheck } from 'lucide-react';

export default function ManualDonationModal({ isOpen, onClose, onShowReceipt }) {
  const { campaigns, anakAsuh, donaturs, karyawan, addDonation } = useApp();

  const [donaturNama, setDonaturNama] = useState('');
  const [email, setEmail] = useState('');
  const [telepon, setTelepon] = useState('');
  const [tipe, setTipe] = useState('Individu');
  const [program, setProgram] = useState('Satu Demi Satu untuk SD');
  const [paketNama, setPaketNama] = useState('Paket 1 (1 Tahun Ajaran)');
  const [nominal, setNominal] = useState(250000);
  const [metode, setMetode] = useState('Transfer Bank Manual BCA');
  const [selectedChildId, setSelectedChildId] = useState('');
  const [verifikator, setVerifikator] = useState(karyawan[0]?.nama || 'Dewi Lestari, S.E');
  const [pesanDoa, setPesanDoa] = useState('Donasi langsung melalui kantor sekretariat Yayasan GNOTA.');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!donaturNama.trim()) {
      alert('Nama donatur wajib diisi!');
      return;
    }

    const targetChild = anakAsuh.find(a => a.id === selectedChildId);

    const newRecord = addDonation({
      donaturNama,
      email: email || 'donatur@gnota.or.id',
      telepon: telepon || '08129900000',
      tipe,
      program,
      paketNama,
      nominal: Number(nominal),
      metode,
      karyawanVerifikator: verifikator,
      anakAsuhId: targetChild ? targetChild.id : null,
      anakAsuhNama: targetChild ? `${targetChild.nama} (${targetChild.sekolah})` : 'Antrean Bantuan Pendidikan GNOTA',
      pesanDoa
    });

    onClose();
    onShowReceipt(newRecord);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-gnota-900 text-white p-4 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 sm:top-5 right-4 sm:right-5 text-white/80 hover:text-white p-2 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase">
              Entri Staf Internal
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white">Pencatatan Donasi Masuk (Manual)</h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Input donasi tunai, transfer rekening yayasan, atau hibah kemitraan CSR.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Donatur / Perusahaan *</label>
              <input
                type="text"
                required
                value={donaturNama}
                onChange={(e) => setDonaturNama(e.target.value)}
                placeholder="Nama Donatur / PT"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tipe Donatur</label>
              <select
                value={tipe}
                onChange={(e) => setTipe(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="Individu">Individu / Perorangan</option>
                <option value="Perusahaan/CSR">Perusahaan / CSR</option>
                <option value="Donasi Anonim">Anonim (Hamba Allah)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@donatur.com"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">No. WhatsApp</label>
              <input
                type="tel"
                value={telepon}
                onChange={(e) => setTelepon(e.target.value)}
                placeholder="081234567890"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Program Donasi *</label>
              <select
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                {campaigns.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nominal Donasi (Rp) *</label>
              <input
                type="number"
                required
                value={nominal}
                onChange={(e) => setNominal(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Metode Pembayaran</label>
              <select
                value={metode}
                onChange={(e) => setMetode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="Transfer Bank BCA">Transfer Bank BCA</option>
                <option value="Transfer Bank Mandiri">Transfer Bank Mandiri</option>
                <option value="Tunai / Kas Sekretariat">Tunai / Kas Sekretariat</option>
                <option value="QRIS">QRIS</option>
                <option value="BCA Virtual Account">BCA Virtual Account</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Staf Verifikator *</label>
              <select
                value={verifikator}
                onChange={(e) => setVerifikator(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                {karyawan.map(k => (
                  <option key={k.id} value={k.nama}>{k.nama} ({k.jabatan})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Child Assignment */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Pilih Anak Asuh (Opsional):</label>
            <select
              value={selectedChildId}
              onChange={(e) => setSelectedChildId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="">-- Alokasikan Otomatis ke Antrean Nasional GNOTA --</option>
              {anakAsuh.map(c => (
                <option key={c.id} value={c.id}>
                  {c.nama} ({c.jenjang} - {c.sekolah}, {c.kota}) - [{c.status}]
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Catatan / Doa</label>
            <input
              type="text"
              value={pesanDoa}
              onChange={(e) => setPesanDoa(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          {/* Action */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gnota-700 hover:bg-gnota-800 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan & Terbitkan Kuitansi</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
