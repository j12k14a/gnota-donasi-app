import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Target, TrendingUp, Edit3, Check, X, Sparkles, AlertCircle } from 'lucide-react';

export default function TargetManagement() {
  const { campaigns, updateCampaignTarget, totalDonasiTerkumpul, totalTargetKeseluruhan } = useApp();

  const [editingId, setEditingId] = useState(null);
  const [newTargetValue, setNewTargetValue] = useState('');

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleStartEdit = (camp) => {
    setEditingId(camp.id);
    setNewTargetValue(camp.target.toString());
  };

  const handleSaveEdit = (id) => {
    if (newTargetValue && !isNaN(newTargetValue)) {
      updateCampaignTarget(id, Number(newTargetValue));
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manajemen Target Donasi</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola sasaran dana beasiswa perlengkapan sekolah GNOTA tahun ajaran 2026/2027.
          </p>
        </div>
      </div>

      {/* Target Summary Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-4 sm:p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-5 h-5 text-amber-200" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">Akumulasi Target Keseluruhan</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black">{formatRupiah(totalTargetKeseluruhan)}</h3>
          <p className="text-xs text-amber-100 mt-1">
            Realisasi terkumpul saat ini: <strong className="text-white">{formatRupiah(totalDonasiTerkumpul)}</strong> ({Math.min(100, Math.round((totalDonasiTerkumpul / totalTargetKeseluruhan) * 100))}%)
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl border border-white/20">
          <p className="text-xs text-amber-100 font-semibold">Sisa Kebutuhan Dana:</p>
          <p className="text-lg sm:text-xl font-black text-white mt-0.5">
            {formatRupiah(Math.max(0, totalTargetKeseluruhan - totalDonasiTerkumpul))}
          </p>
        </div>
      </div>

      {/* Program Targets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map(camp => {
          const prog = Math.min(100, Math.round((camp.collected / camp.target) * 100));
          const isEditing = editingId === camp.id;
          const sisaTarget = Math.max(0, camp.target - camp.collected);

          return (
            <div key={camp.id} className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-gnota-50 text-gnota-700 text-xs font-bold px-3 py-1 rounded-full border border-gnota-100">
                    Jenjang: {camp.jenjang}
                  </span>
                  <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
                    {prog}% Tercapai
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 mb-1">{camp.name}</h3>
                <p className="text-xs text-slate-500 mb-4">{camp.description}</p>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200 mb-4">
                  <div
                    className="bg-gradient-to-r from-gnota-600 to-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${prog}%` }}
                  ></div>
                </div>

                {/* Numbers Comparison */}
                <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Dana Terkumpul:</span>
                    <span className="font-extrabold text-emerald-700">{formatRupiah(camp.collected)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Target Dana:</span>
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={newTargetValue}
                          onChange={(e) => setNewTargetValue(e.target.value)}
                          className="w-32 px-2 py-1 bg-white border border-gnota-400 rounded text-xs font-bold"
                        />
                        <button
                          onClick={() => handleSaveEdit(camp.id)}
                          className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                          title="Simpan"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1 bg-slate-300 text-slate-700 rounded hover:bg-slate-400"
                          title="Batal"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900">{formatRupiah(camp.target)}</span>
                        <button
                          onClick={() => handleStartEdit(camp)}
                          className="text-slate-400 hover:text-gnota-600 p-1 rounded"
                          title="Ubah Target"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                    <span className="text-slate-500">Kekurangan Dana:</span>
                    <span className="font-bold text-amber-700">{formatRupiah(sisaTarget)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Estimasi Anak Terbantu:</span>
                    <span className="font-bold text-slate-800">{camp.studentsHelped} Siswa</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>{camp.donorCount} Donatur Terlibat</span>
                <span>{camp.packages.length} Opsi Paket</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
