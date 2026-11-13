
function napTL2() {
  const key = 'KEYHERE';
  const META = [["qcmh5.b64", "application/pdf", "QUY CH\u1ebe PH\u00d2NG MUA H\u00c0NG - BAN H\u00c0NH L\u1ea6N \u0110\u1ea6U - PHI\u00caN B\u1ea2N S\u1eecA L\u1ea6N 5", "PB:Ph\u00f2ng V\u1eadt t\u01b0", "8b4978190d242738", "Quy ch\u1ebf ph\u00f2ng Mua h\u00e0ng (Ph\u00f2ng V\u1eadt t\u01b0): ch\u1ee9c n\u0103ng nhi\u1ec7m v\u1ee5, quy tr\u00ecnh t\u1ea1o s\u1ea3n ph\u1ea9m, t\u00ecm ngu\u1ed3n h\u00e0ng, b\u00e1o gi\u00e1 cho Kinh doanh, quy tr\u00ecnh mua h\u00e0ng 15 b\u01b0\u1edbc (c\u00f3 s\u01a1 \u0111\u1ed3), h\u1ee3p \u0111\u1ed3ng, thanh to\u00e1n, nghi\u1ec7m thu, ch\u1ed1ng h\u1ed1i l\u1ed9, b\u1ea3o m\u1eadt, tr\u00e1ch nhi\u1ec7m, th\u01b0\u1edfng. Thay b\u1ea3n s\u1eeda l\u1ea7n 1."]];
  const kb = Utilities.newBlob(key).getBytes(), out = [];
  rows_(SH.DT).forEach(function (r) { if (String(r.TieuDe).indexOf('QUY CHẾ PHÒNG MUA HÀNG - BAN HÀNH LẦN ĐẦU - PHIÊN BẢN SỬA LẦN 1') === 0 && String(r.TrangThai) !== 'Ẩn') { setCell_(SH.DT, r._row, 'TrangThai', 'Ẩn'); out.push('an QCMH1'); } });
  META.filter(function (d) { return DATA_TL[d[0]]; }).forEach(function (d, n) {
    if (rows_(SH.DT).some(function (r) { return String(r.TieuDe) === d[2]; })) { out.push(d[0] + ' da co'); return; }
    const enc = Utilities.base64Decode(DATA_TL[d[0]]);
    const dec = new Array(enc.length);
    for (let i = 0; i < enc.length; i += 32) {
      const c = i / 32;
      const ks = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, kb.concat([(c >>> 24) & 255, (c >>> 16) & 255, (c >>> 8) & 255, c & 255].map(function (x) { return x > 127 ? x - 256 : x; })));
      for (let j = 0; j < 32 && i + j < enc.length; j++) { const v = (enc[i + j] ^ ks[j]) & 255; dec[i + j] = v > 127 ? v - 256 : v; }
    }
    const h = bam_(dec).slice(0, 16);
    if (h !== d[4]) throw new Error('Sai ma ' + d[0] + ' ' + h);
    const f = luuTep_('DT_FOLDER', 'HỆ THỐNG CHẤM CÔNG - TÀI LIỆU ĐÀO TẠO', { mime: d[1], data: Utilities.base64Encode(dec) }, d[2]);
    append_(SH.DT, { MaDT: 'DT' + Utilities.formatDate(new Date(), TZ, 'yyMMddHHmmss') + n, TieuDe: d[2], NoiDung: d[5], Link: '', TepDinhKem: f.getId(), ApDung: d[3], NguoiTao: 'Hành chính nhân sự', ThoiGian: new Date(), TrangThai: 'Hiện', ChuDe: 'Nội quy, quy chế', CauHoi: '' });
    out.push(d[0] + ' ok ' + h);
  });
  Logger.log('KQ ' + out.join(' ; '));
}
