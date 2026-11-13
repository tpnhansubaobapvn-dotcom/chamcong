
function napTL2() {
  const key = 'KEYHERE';
  const META = [["bo.b64", "application/pdf", "B\u1ed8 V\u0102N B\u1ea2N BAN H\u00c0NH TH\u00c1NG 11-2026 - TR\u00ccNH K\u00dd - PHI\u00caN B\u1ea2N S\u1eecA L\u1ea6N 1", "VT:GD,HCNS,KT", "a646ed4735f5d1d3", "B\u1ed9 5 v\u0103n b\u1ea3n in tr\u00ecnh Gi\u00e1m \u0111\u1ed1c k\u00fd, \u0111\u00f3ng d\u1ea5u c\u00f9ng ng\u00e0y (73 trang): Quy\u1ebft \u0111\u1ecbnh ban h\u00e0nh 05/2026/Q\u0110-DCT (b\u1ea3n s\u1eeda l\u1ea7n 2); N\u1ed9i quy lao \u0111\u1ed9ng (l\u1ea7n 3); Quy ch\u1ebf L\u01b0\u01a1ng \u2013 Th\u01b0\u1edfng \u2013 Ph\u1ee5 c\u1ea5p 03/DCT-TL-QCLT-26 (l\u1ea7n 3); Quy ch\u1ebf b\u00e1n h\u00e0ng (l\u1ea7n 2); Quy ch\u1ebf ph\u00f2ng Mua h\u00e0ng 04/DCT-MH-QCMH-26 (l\u1ea7n 5). In 2 b\u1ed9: 1 l\u01b0u c\u00f4ng ty, 1 n\u1ed9p k\u00e8m h\u1ed3 s\u01a1 \u0111\u0103ng k\u00fd N\u1ed9i quy. Ch\u1ec9 Gi\u00e1m \u0111\u1ed1c, HCNS, K\u1ebf to\u00e1n xem."]];
  const kb = Utilities.newBlob(key).getBytes(), out = [];
  rows_(SH.DT).forEach(function (r) { if (String(r.TieuDe).indexOf('KHONG_AN_GI') === 0 && String(r.TrangThai) !== 'Ẩn') { setCell_(SH.DT, r._row, 'TrangThai', 'Ẩn'); out.push('an QCMH1'); } });
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
