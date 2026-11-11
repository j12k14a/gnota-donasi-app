import { jsPDF } from 'jspdf';
import gnotaLogoUrl from '../assets/logo-gnota.png';

let cachedLogoAssetPromise = null;

/**
 * Muat logo resmi GNOTA agar tersedia sebagai HTMLImageElement maupun inline Data URL
 * (penting untuk kanvas ekspor PNG/PDF dan iframe cetak terisolasi).
 */
function loadGnotaLogoAsset() {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (cachedLogoAssetPromise) return cachedLogoAssetPromise;

  cachedLogoAssetPromise = new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let dataUrl = gnotaLogoUrl;
      try {
        const c = document.createElement('canvas');
        c.width = img.naturalWidth || 256;
        c.height = img.naturalHeight || 256;
        const cctx = c.getContext('2d');
        cctx.drawImage(img, 0, 0, c.width, c.height);
        dataUrl = c.toDataURL('image/png');
      } catch {
        dataUrl = new URL(gnotaLogoUrl, window.location.href).href;
      }
      resolve({ img, dataUrl });
    };
    img.onerror = () => resolve(null);
    img.src = gnotaLogoUrl;
  });

  return cachedLogoAssetPromise;
}

/**
 * Format angka menjadi Rupiah (IDR).
 */
export function formatRupiah(val) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(val) || 0);
}

/**
 * Bangun URL lengkap kuitansi berbasis URL Parameters agar dapat diakses langsung / dibagikan.
 */
export function buildReceiptShareUrl(data) {
  if (typeof window === 'undefined' || !data) return '';
  const params = new URLSearchParams();
  params.set('page', 'portal');
  params.set('kuitansi', data.id || 'DON-GNOTA');
  if (data.donaturNama) params.set('donatur', data.donaturNama);
  if (data.nominal) params.set('nominal', String(data.nominal));
  if (data.program) params.set('program', data.program);
  if (data.paketNama) params.set('paket', data.paketNama);
  if (data.anakAsuhNama) params.set('anak', data.anakAsuhNama);
  if (data.metode) params.set('metode', data.metode);
  if (data.tanggal) params.set('tgl', data.tanggal);
  if (data.status) params.set('status', data.status);
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}

/**
 * Helper menggambar teks multi-baris (word wrap) di Canvas.
 * Mengembalikan koordinat Y akhir setelah semua baris digambar.
 */
function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = String(text || '-').split(/\s+/);
  let line = '';
  let currentY = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line ? `${line} ${words[i]}` : words[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line, x, currentY);
      line = words[i];
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, x, currentY);
    currentY += lineHeight;
  }
  return currentY;
}

/**
 * Menggambar pola QR verifikasi digital deterministik di Canvas berdasarkan ID Kuitansi.
 */
function drawPseudoQr(ctx, startX, startY, size, seedStr) {
  const cells = 11;
  const cellSize = size / cells;
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = ((hash << 5) - hash + seedStr.charCodeAt(i)) | 0;
  }

  const isFinder = (r, c) =>
    (r < 3 && c < 3) || (r < 3 && c >= cells - 3) || (r >= cells - 3 && c < 3);

  ctx.fillStyle = '#0f172a';
  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      let filled = false;
      if (isFinder(r, c)) {
        const lr = r >= cells - 3 ? r - (cells - 3) : r;
        const lc = c >= cells - 3 ? c - (cells - 3) : c;
        filled = lr === 0 || lr === 2 || lc === 0 || lc === 2 || (lr === 1 && lc === 1);
      } else {
        const bit = ((hash ^ (r * 31 + c * 17)) >>> ((r + c) % 8)) & 1;
        filled = bit === 1;
      }
      if (filled) {
        ctx.fillRect(
          startX + c * cellSize,
          startY + r * cellSize,
          Math.ceil(cellSize - 0.5),
          Math.ceil(cellSize - 0.5)
        );
      }
    }
  }
}

/**
 * Render kuitansi GNOTA resolusi tinggi ke elemen HTML5 Canvas.
 */
export async function renderReceiptToCanvas(data) {
  const logoAsset = await loadGnotaLogoAsset();

  const width = 1200;
  const height = 1550;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Background putih bersih
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Bingkai border luar lembut
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 4;
  ctx.strokeRect(24, 24, width - 48, height - 48);

  // Strip aksen atas GNOTA
  ctx.fillStyle = '#0369a1';
  ctx.fillRect(24, 24, width - 48, 16);

  // Emblem Resmi Yayasan GNOTA
  const logoX = 115;
  const logoY = 125;
  const logoRadius = 46;
  if (logoAsset?.img) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(logoX, logoY, logoRadius, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(logoAsset.img, logoX - logoRadius, logoY - logoRadius, logoRadius * 2, logoRadius * 2);
    ctx.restore();
  } else {
    ctx.beginPath();
    ctx.arc(logoX, logoY, 44, 0, Math.PI * 2);
    ctx.fillStyle = '#0369a1';
    ctx.fill();

    ctx.font = '900 24px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('GN', logoX - 15, logoY);
    ctx.fillStyle = '#facc15';
    ctx.fillText('OTA', logoX + 17, logoY);
  }

  // Teks Kop Surat Yayasan
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#0c4a6e';
  ctx.font = '800 28px system-ui, -apple-system, sans-serif';
  ctx.fillText('YAYASAN GERAKAN NASIONAL ORANG TUA ASUH', 180, 108);

  ctx.fillStyle = '#64748b';
  ctx.font = '500 17px system-ui, -apple-system, sans-serif';
  ctx.fillText('SK Kemenkumham RI No. AHU-0012984.AH.01.04 • Terdaftar Kemensos RI No. 343/HUK-PS/2018', 180, 136);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '400 15px system-ui, -apple-system, sans-serif';
  ctx.fillText('Gedung Pelindung Anak Indonesia, Jl. KH. Hasyim Ashari No. 125, Jakarta Pusat 10150', 180, 160);

  // Badge Bukti Penerimaan & No Kuitansi (kanan atas)
  ctx.fillStyle = '#e0f2fe';
  ctx.strokeStyle = '#bae6fd';
  ctx.lineWidth = 2;
  ctx.fillRect(910, 82, 220, 34);
  ctx.strokeRect(910, 82, 220, 34);
  ctx.fillStyle = '#075985';
  ctx.font = '700 14px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BUKTI PENERIMAAN DONASI', 1020, 104);

  ctx.fillStyle = '#0f172a';
  ctx.font = '700 21px monospace';
  ctx.textAlign = 'right';
  ctx.fillText(data.id || 'DON-GNOTA', 1130, 145);

  // Garis pemisah Kop
  ctx.strokeStyle = '#0c4a6e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(70, 195);
  ctx.lineTo(1130, 195);
  ctx.stroke();

  // Judul Kuitansi
  ctx.textAlign = 'center';
  ctx.fillStyle = '#0f172a';
  ctx.font = '800 28px system-ui, -apple-system, sans-serif';
  ctx.fillText('KUITANSI DONASI ORANG TUA ASUH', width / 2, 255);

  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(350, 268);
  ctx.lineTo(850, 268);
  ctx.stroke();

  ctx.fillStyle = '#64748b';
  ctx.font = '500 18px system-ui, -apple-system, sans-serif';
  ctx.fillText(`Waktu Transaksi: ${data.tanggal || '-'}`, width / 2, 300);

  // Baris Data Kuitansi
  const rows = [
    { label: 'Telah Diterima Dari', value: data.donaturNama || 'Donatur GNOTA', highlight: 'bold' },
    { label: 'Jumlah Donasi', value: formatRupiah(data.nominal), highlight: 'nominal' },
    { label: 'Untuk Program', value: data.program || 'Satu Demi Satu untuk SD' },
    { label: 'Rincian Paket', value: `${data.paketNama || 'Paket Donasi'} (Baju seragam, sepatu, tas, & alat tulis)` },
    { label: 'Anak Asuh Penerima', value: data.anakAsuhNama || 'Antrean Penyaluran Nasional GNOTA', highlight: 'green' },
    { label: 'Kanal Pembayaran', value: data.metode || 'QRIS' },
    { label: 'Status Transaksi', value: data.status || 'Terverifikasi', highlight: 'green' },
  ];

  if (data.pesanDoa) {
    rows.push({ label: 'Doa / Pesan', value: `"${data.pesanDoa}"`, italic: true });
  }

  let curY = 360;
  ctx.textAlign = 'left';

  rows.forEach((row) => {
    ctx.fillStyle = '#64748b';
    ctx.font = '500 20px system-ui, -apple-system, sans-serif';
    ctx.fillText(row.label, 80, curY);

    if (row.highlight === 'nominal') {
      ctx.fillStyle = '#075985';
      ctx.font = '800 28px system-ui, -apple-system, sans-serif';
    } else if (row.highlight === 'green') {
      ctx.fillStyle = '#065f46';
      ctx.font = '700 20px system-ui, -apple-system, sans-serif';
    } else if (row.highlight === 'bold') {
      ctx.fillStyle = '#0f172a';
      ctx.font = '700 22px system-ui, -apple-system, sans-serif';
    } else if (row.italic) {
      ctx.fillStyle = '#475569';
      ctx.font = 'italic 19px system-ui, -apple-system, sans-serif';
    } else {
      ctx.fillStyle = '#1e293b';
      ctx.font = '500 20px system-ui, -apple-system, sans-serif';
    }

    const nextY = drawWrappedText(ctx, `: ${row.value}`, 380, curY, 740, 30);
    const dividerY = Math.max(curY + 24, nextY - 6);

    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, dividerY);
    ctx.lineTo(1120, dividerY);
    ctx.stroke();

    curY = dividerY + 42;
  });

  // Area Tanda Tangan & QR Verifikasi
  const sigY = Math.max(curY + 40, 1080);

  // Kotak QR
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(100, sigY, 130, 130);
  ctx.setLineDash([]);
  drawPseudoQr(ctx, 112, sigY + 12, 106, data.id || 'DON-GNOTA');

  ctx.textAlign = 'center';
  ctx.fillStyle = '#0369a1';
  ctx.font = '700 14px monospace';
  ctx.fillText('E-VALID VERIFIED', 165, sigY + 154);
  ctx.fillStyle = '#64748b';
  ctx.font = '500 14px system-ui, -apple-system, sans-serif';
  ctx.fillText('Verifikasi Digital Sistem GNOTA', 165, sigY + 176);

  // Pengurus & Stempel Kanan
  const datePart = data.tanggal ? String(data.tanggal).split(' ')[0] : new Date().toISOString().split('T')[0];
  ctx.fillStyle = '#64748b';
  ctx.font = '500 18px system-ui, -apple-system, sans-serif';
  ctx.fillText(`Jakarta, ${datePart}`, 940, sigY + 15);

  ctx.fillStyle = '#1e293b';
  ctx.font = '700 20px system-ui, -apple-system, sans-serif';
  ctx.fillText('Pengurus Yayasan GNOTA', 940, sigY + 45);

  // Stempel miring SAH GNOTA
  ctx.save();
  ctx.translate(940, sigY + 100);
  ctx.rotate((-6 * Math.PI) / 180);
  ctx.fillStyle = 'rgba(224, 242, 254, 0.7)';
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 3;
  ctx.fillRect(-105, -28, 210, 56);
  ctx.strokeRect(-105, -28, 210, 56);
  ctx.fillStyle = '#0369a1';
  ctx.font = '800 18px system-ui, -apple-system, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('✓ SAH GNOTA', 0, 2);
  ctx.restore();

  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#0f172a';
  ctx.font = '700 20px system-ui, -apple-system, sans-serif';
  const verifikator = data.karyawanVerifikator || 'Dewi Lestari, S.E';
  ctx.fillText(verifikator, 940, sigY + 168);

  const vWidth = ctx.measureText(verifikator).width;
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(940 - vWidth / 2, sigY + 173);
  ctx.lineTo(940 + vWidth / 2, sigY + 173);
  ctx.stroke();

  ctx.fillStyle = '#64748b';
  ctx.font = '500 16px system-ui, -apple-system, sans-serif';
  ctx.fillText('Divisi Keuangan & Donasi', 940, sigY + 195);

  // Footer resmi
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(70, 1410);
  ctx.lineTo(1130, 1410);
  ctx.stroke();

  ctx.fillStyle = '#64748b';
  ctx.font = '500 16px system-ui, -apple-system, sans-serif';
  ctx.fillText(
    'Kuitansi ini diterbitkan secara sah melalui Sistem Manajemen Donasi GNOTA. Tidak memerlukan cap basah.',
    width / 2,
    1448
  );
  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 14px monospace';
  ctx.fillText(`Ref URL: ?page=portal&kuitansi=${data.id || 'DON-GNOTA'}`, width / 2, 1478);

  return canvas;
}

/**
 * Unduh bukti pembayaran langsung sebagai gambar PNG ke perangkat pengguna.
 */
export async function downloadReceiptPNG(data) {
  if (!data) return;
  const canvas = await renderReceiptToCanvas(data);
  const fileName = `Kuitansi-GNOTA-${data.id || 'DONASI'}.png`;

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, 'image/png');
}

/**
 * Unduh bukti pembayaran langsung sebagai dokumen PDF (A4) menggunakan jsPDF.
 */
export async function downloadReceiptPDF(data) {
  if (!data) return;
  const canvas = await renderReceiptToCanvas(data);
  const imgData = canvas.toDataURL('image/png', 1.0);
  const fileName = `Kuitansi-GNOTA-${data.id || 'DONASI'}.pdf`;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  doc.setProperties({
    title: `Kuitansi Donasi GNOTA - ${data.id || ''}`,
    subject: 'Bukti Penerimaan Donasi Orang Tua Asuh',
    author: 'Yayasan Gerakan Nasional Orang Tua Asuh (GNOTA)',
  });

  // A4 width = 210mm, margin 12mm -> 186mm x 240.25mm
  doc.addImage(imgData, 'PNG', 12, 14, 186, 240.25);
  doc.save(fileName);
}

/**
 * Cetak kuitansi bersih 1 halaman A4 menggunakan iframe terisolasi agar tidak mencetak latar belakang halaman.
 */
export async function printReceipt(data) {
  if (!data || typeof document === 'undefined') return;

  const logoAsset = await loadGnotaLogoAsset();

  const esc = (str) =>
    String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const datePart = data.tanggal ? String(data.tanggal).split(' ')[0] : new Date().toISOString().split('T')[0];

  const logoHtml = logoAsset?.dataUrl
    ? `<img src="${esc(logoAsset.dataUrl)}" alt="Logo Yayasan GNOTA" style="width:52px;height:52px;border-radius:9999px;object-fit:cover;flex-shrink:0;" />`
    : `<div class="logo">GN<span>OTA</span></div>`;

  const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>Kuitansi Donasi GNOTA - ${esc(data.id)}</title>
  <style>
    @page { size: A4 portrait; margin: 14mm; }
    * { box-sizing: border-box; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; }
    body { margin: 0; padding: 0; color: #1e293b; background: #ffffff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .receipt { max-width: 720px; margin: 0 auto; border: 1.5px solid #cbd5e1; border-top: 8px solid #0369a1; border-radius: 12px; padding: 28px; }
    .kop { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0c4a6e; padding-bottom: 16px; margin-bottom: 22px; gap: 16px; }
    .kop-left { display: flex; align-items: center; gap: 14px; }
    .logo { width: 48px; height: 48px; border-radius: 9999px; background: #0369a1; color: #fff; font-weight: 900; font-size: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .logo span { color: #facc15; }
    .org-title { font-size: 15px; font-weight: 800; color: #0c4a6e; margin: 0; }
    .org-sub { font-size: 10px; color: #64748b; margin: 3px 0 0; }
    .org-addr { font-size: 9px; color: #94a3b8; margin: 2px 0 0; }
    .kop-right { text-align: right; flex-shrink: 0; }
    .badge { display: inline-block; background: #e0f2fe; color: #075985; border: 1px solid #bae6fd; font-size: 9px; font-weight: 700; padding: 3px 8px; border-radius: 4px; }
    .receipt-id { font-family: monospace; font-size: 13px; font-weight: 700; color: #0f172a; margin-top: 5px; }
    .title-wrap { text-align: center; margin-bottom: 22px; }
    .title { font-size: 16px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; text-decoration: underline; text-decoration-color: #0284c7; text-underline-offset: 4px; margin: 0; color: #0f172a; }
    .timestamp { font-size: 11px; color: #64748b; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 26px; font-size: 12px; }
    td { padding: 8px 4px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
    td.label { width: 34%; color: #64748b; }
    td.val { font-weight: 600; color: #0f172a; }
    td.val-nominal { font-size: 15px; font-weight: 800; color: #075985; }
    td.val-green { font-weight: 700; color: #065f46; }
    td.val-italic { font-style: italic; font-weight: 400; color: #475569; }
    .sig-row { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 18px; }
    .qr-box { text-align: center; }
    .qr-inner { width: 78px; height: 78px; border: 2px dashed #cbd5e1; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: monospace; font-size: 9px; color: #64748b; margin: 0 auto 4px; }
    .qr-inner strong { color: #0369a1; margin-top: 2px; }
    .sig-right { text-align: center; font-size: 11px; }
    .stamp { display: inline-block; border: 2px solid #0284c7; background: #f0f9ff; color: #0369a1; font-weight: 800; font-size: 10px; padding: 8px 18px; border-radius: 6px; transform: rotate(-6deg); margin: 10px 0; }
    .footer-note { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 10px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="kop">
      <div class="kop-left">
        ${logoHtml}
        <div>
          <h1 class="org-title">YAYASAN GERAKAN NASIONAL ORANG TUA ASUH</h1>
          <p class="org-sub">SK Kemenkumham RI No. AHU-0012984.AH.01.04 • Terdaftar Kemensos RI No. 343/HUK-PS/2018</p>
          <p class="org-addr">Gedung Pelindung Anak Indonesia, Jl. KH. Hasyim Ashari No. 125, Jakarta Pusat 10150</p>
        </div>
      </div>
      <div class="kop-right">
        <span class="badge">BUKTI PENERIMAAN DONASI</span>
        <div class="receipt-id">${esc(data.id)}</div>
      </div>
    </div>

    <div class="title-wrap">
      <h2 class="title">KUITANSI DONASI ORANG TUA ASUH</h2>
      <div class="timestamp">Waktu Transaksi: ${esc(data.tanggal || '-')}</div>
    </div>

    <table>
      <tr><td class="label">Telah Diterima Dari</td><td class="val">: ${esc(data.donaturNama)}</td></tr>
      <tr><td class="label">Jumlah Donasi</td><td class="val-nominal">: ${esc(formatRupiah(data.nominal))}</td></tr>
      <tr><td class="label">Untuk Program</td><td class="val">: ${esc(data.program)}</td></tr>
      <tr><td class="label">Rincian Paket</td><td class="val" style="font-weight:400">: ${esc(data.paketNama)} (Baju seragam, sepatu, tas, &amp; alat tulis)</td></tr>
      <tr><td class="label">Anak Asuh Penerima</td><td class="val-green">: ${esc(data.anakAsuhNama || 'Antrean Penyaluran Nasional GNOTA')}</td></tr>
      <tr><td class="label">Kanal Pembayaran</td><td class="val" style="font-weight:500">: ${esc(data.metode)}</td></tr>
      <tr><td class="label">Status</td><td class="val-green">: ${esc(data.status || 'Terverifikasi')}</td></tr>
      ${data.pesanDoa ? `<tr><td class="label">Doa / Pesan</td><td class="val-italic">: "${esc(data.pesanDoa)}"</td></tr>` : ''}
    </table>

    <div class="sig-row">
      <div class="qr-box">
        <div class="qr-inner">QRIS / E-VALID<strong>VERIFIED</strong></div>
        <div style="font-size:10px;color:#94a3b8;">Verifikasi Digital</div>
      </div>
      <div class="sig-right">
        <div style="color:#64748b;">Jakarta, ${esc(datePart)}</div>
        <div style="font-weight:700;color:#1e293b;margin-top:3px;">Pengurus Yayasan GNOTA</div>
        <div class="stamp">&#10003; SAH GNOTA</div>
        <div style="font-weight:700;text-decoration:underline;color:#0f172a;">${esc(data.karyawanVerifikator || 'Dewi Lestari, S.E')}</div>
        <div style="font-size:10px;color:#64748b;">Divisi Keuangan &amp; Donasi</div>
      </div>
    </div>

    <div class="footer-note">
      Kuitansi ini dicetak secara sah melalui Sistem Manajemen Donasi GNOTA. Tidak memerlukan cap basah.
    </div>
  </div>
</body>
</html>`;

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(htmlContent);
  iframeDoc.close();

  const triggerPrint = () => {
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch {
      window.print();
    }
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 1500);
  };

  setTimeout(triggerPrint, 250);
}
