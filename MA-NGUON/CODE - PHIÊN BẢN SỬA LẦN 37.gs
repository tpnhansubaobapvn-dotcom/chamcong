/**
 * APP CHẤM CÔNG VÀ ĐƠN TỪ - GIAI ĐOẠN 1 - PHIÊN BẢN SỬA LẦN 37 (vai trò, mô tả công việc, trách nhiệm, quyền hạn trong hồ sơ từng người: quản trị ghi, nhân viên chỉ xem; công nợ từng đơn: còn phải thu, quá hạn, nợ xấu theo Điều 14; báo cáo doanh số kinh doanh theo Quy chế bán hàng 04/2026 và Phụ lục 01: nhân viên nạp, trưởng phòng, kế toán, giám đốc duyệt; vi phạm quy chế bán hàng; tự tính hoa hồng, thưởng hiệu quả vào bảng lương; việc giao đột xuất: giao bằng giọng nói, nhận việc ký PIN, tóm tắt bên phải; đăng nhập bằng tên đăng nhập và mật khẩu, nút đăng xuất; tài sản, công cụ, tài khoản được cấp có ký PIN và lịch sử thay đổi; tạm ẩn cơ cấu lương bậc mới; tăng tốc tải dữ liệu, thông báo trên máy; sao lưu dữ liệu tự động hằng đêm; HCNS trình duyệt bảng lương trước khi Giám đốc duyệt; số điện thoại trong hồ sơ; tài khoản phụ không hiện trên sơ đồ, nhiều người duyệt cùng lúc; thêm người ngay trên sơ đồ tổ chức; trang hồ sơ riêng từng nhân viên, nạp hồ sơ, sửa thông tin; biên bản bàn giao khi nghỉ việc, in và nạp bản đã ký; đơn xin nghỉ việc duyệt 2 bước, in đơn lưu hồ sơ; duyệt chi lương và tạm ứng 2 cấp theo từng công ty; lưu hợp đồng thử việc, hợp đồng lao động từng người, cảnh báo hết hạn; sinh nhật sắp tới, vinh danh nhân viên xuất sắc tháng; trang quản trị nhân sự toàn công ty theo sơ đồ tổ chức; bắt buộc định vị chính xác khi chấm công; nạp bản mô tả công việc theo chức danh, nhận file Word; trang tài khoản chuyên nghiệp, túi lịch sử mọi mục, đề nghị cập nhật hồ sơ; cơ cấu lương theo bậc hiện trong app; đơn hàng bị trả, treo, lỗi trong tháng; kế thừa phép tồn từ bảng lương tháng 9, công ty trả lương; giao việc tháng có nạp tài liệu, lịch sử, ảnh chấm công đóng dấu giờ và vị trí; nộp và đánh giá KPI hằng tháng, vi phạm nhắc nhở và văn bản; trình duyệt có tệp đã ký, ghi chú duyệt, tiền tăng ca tạm tính; bậc lương, tạm ứng, thưởng, KPI, doanh số, lập bảng lương, phiếu lương; ảnh đại diện, menu trái, tăng ca, chuyên cần, vai trò; giao diện web riêng qua GitHub, chấm công chụp ảnh trên máy tính/điện thoại, bảng theo dõi hôm nay, báo cáo sáng)
 * Dán toàn bộ nội dung này vào file Code.gs trong Apps Script.
 * Lần đầu: chọn hàm CAI_DAT_LAN_DAU rồi bấm Chạy.
 */

const SH = { NV: 'NhanVien', DIEM: 'DiemChamCong', TS: 'ThamSo', CC: 'ChamCong', DON: 'DonTu', LOG: 'NhatKy', QC: 'QuyChe', MT: 'MoTaCongViec', BL: 'BacLuong', SL: 'SoLieuThang', LE: 'NgayLe', VP: 'ViPham', GV: 'GiaoViec', DH: 'DonHangLoi', VD: 'VinhDanh', HD: 'HopDong', BG: 'BanGiao', HS: 'HoSoNV', TSAN: 'TaiSan', TSLOG: 'TaiSanLog', VX: 'ViecDotXuat', BCKD: 'BaoCaoKD', VPKD: 'ViPhamKD' };
const TZ = 'Asia/Ho_Chi_Minh';
const LOAI_DON = ['Nghỉ phép năm', 'Nghỉ không lương', 'Nghỉ đột xuất', 'Tăng ca', 'Tạm ứng lương', 'Trình duyệt', 'Đánh giá KPI', 'Xin nghỉ việc'];

const HEADERS = {
  NhanVien: ['MaNV', 'HoTen', 'Gmail', 'PhongBan', 'ChucVu', 'VaiTro', 'GmailDuyet', 'DiemChamCong', 'PhepNam', 'TrangThai', 'PinHash', 'Khoi', 'AnhDaiDien', 'Bac', 'NgayVaoLam', 'ThuViec', 'SoTaiKhoan', 'NganHang', 'PhepTon', 'CongTy', 'NgaySinh', 'SoDienThoai', 'MatKhauHash', 'NhomKD', 'HoaHongQuy'],
  DiemChamCong: ['TenDiem', 'ViDo', 'KinhDo', 'BanKinh_m'],
  ThamSo: ['ThamSo', 'GiaTri', 'GhiChu'],
  ChamCong: ['ThoiGian', 'MaNV', 'HoTen', 'PhongBan', 'Loai', 'ViDo', 'KinhDo', 'DoChinhXac_m', 'KhoangCach_m', 'Diem', 'DiTre_phut', 'HinhThuc', 'AnhID', 'VeSom_phut'],
  DonTu: ['MaDon', 'NgayTao', 'MaNV', 'HoTen', 'PhongBan', 'LoaiDon', 'TuNgay', 'DenNgay', 'NuaNgay', 'SoNgay', 'SoGio', 'LyDo', 'DotXuat', 'GmailDuyet', 'TrangThai', 'NguoiDuyet', 'ThoiGianDuyet', 'GhiChuDuyet', 'LinkPDF', 'SoTien', 'TepDinhKem', 'ThangKPI', 'DiemTuCham', 'DiemDuyet', 'BuocDuyet', 'LichSuDuyet'],
  NhatKy: ['ThoiGian', 'Gmail', 'HanhDong', 'ChiTiet'],
  QuyChe: ['PhongBan', 'LoaiVanBan', 'TieuDe', 'NoiDung', 'TuKhoa', 'HinhThucKyLuat'],
  MoTaCongViec: ['ChucVu', 'VaiTro', 'TrachNhiem', 'QuyenHan', 'MaNV', 'TepDinhKem', 'MaMT', 'NgayHieuLuc', 'NguoiCapNhat', 'ThoiGianCapNhat', 'MoTaCV'],
  BacLuong: ['Bac', 'Nhom', 'LuongCB', 'AnTrua', 'XangXe', 'KPIToiDa', 'CCToiDa'],
  SoLieuThang: ['Thang', 'MaNV', 'HoTen', 'Loai', 'GiaTri', 'GhiChu', 'NguoiNhap', 'ThoiGian', 'TepDinhKem', 'MaSL'],
  BaoCaoKD: ['MaBC', 'Thang', 'MaNV', 'HoTen', 'PhongBan', 'TrangThai', 'DonHang', 'TongGiaTri', 'DSGhiNhan', 'LichSu', 'GhiChu', 'NgayNop', 'CapNhat'],
  ViPhamKD: ['MaVP', 'Thang', 'MaNV', 'HoTen', 'Loai', 'SoTien', 'NoiDung', 'NguoiGhi', 'ThoiGian', 'TrangThai'],
  ViecDotXuat: ['MaVX', 'NgayGiao', 'NguoiGiao', 'GmailGiao', 'MaNV', 'HoTen', 'NoiDung', 'HanChot', 'TrangThai', 'NgayNhan', 'NgayXong', 'GhiChu'],
  HoSoNV: ['MaHS', 'MaNV', 'HoTen', 'LoaiHS', 'TenTep', 'TepDinhKem', 'GhiChu', 'NguoiNap', 'ThoiGian'],
  BanGiao: ['MaBG', 'MaDon', 'MaNV', 'HoTen', 'NguoiNhan', 'NgayBanGiao', 'NoiDung', 'TepDinhKem', 'TrangThai', 'NguoiLap', 'ThoiGian'],
  HopDong: ['MaHD', 'MaNV', 'HoTen', 'LoaiHD', 'SoHD', 'NgayKy', 'TuNgay', 'DenNgay', 'TepDinhKem', 'GhiChu', 'NguoiNap', 'ThoiGian'],
  TaiSan: ['MaTS', 'MaNV', 'HoTen', 'Loai', 'Ten', 'MaSo', 'TenDangNhap', 'MatKhau', 'NgayCap', 'TinhTrang', 'GhiChu', 'CapNhat', 'NguoiCapNhat'],
  TaiSanLog: ['ThoiGian', 'MaTS', 'MaNV', 'HoTen', 'NguoiSua', 'NoiDung'],
  VinhDanh: ['Thang', 'MaNV', 'HoTen', 'PhongBan', 'DanhHieu', 'LyDo', 'NguoiLap', 'ThoiGian'],
  GiaoViec: ['MaGV', 'ThoiGian', 'Thang', 'MaNV', 'HoTen', 'PhongBan', 'NoiDung', 'TepDinhKem', 'NguoiGiao', 'GmailNguoiGiao'],
  NgayLe: ['Ngay', 'TenNgayLe'],
  ViPham: ['MaVP', 'ThoiGian', 'MaNV', 'HoTen', 'PhongBan', 'Loai', 'NoiDung', 'TepDinhKem', 'NguoiLap', 'GmailNguoiLap'],
  DonHangLoi: ['MaDH', 'ThoiGian', 'Thang', 'SoDonHang', 'KhachHang', 'Loai', 'GiaTri', 'MaNV', 'HoTen', 'PhongBan', 'NguyenNhan', 'LoiCuaBoPhan', 'HuongXuLy', 'TrangThai', 'TepDinhKem', 'NguoiLap', 'GmailNguoiLap', 'NguoiCapNhat', 'ThoiGianCapNhat']
};

/* ================= GIAO DIỆN ================= */

const WEB_SHIM = "var API_URL='%URL%';" +
  "function mkRun(){var ok=function(){},fail=function(){};var p=new Proxy({},{get:function(t,n){" +
  "if(n==='withSuccessHandler')return function(f){ok=f;return p;};" +
  "if(n==='withFailureHandler')return function(f){fail=f;return p;};" +
  "return function(){var a=[].slice.call(arguments);fetch(API_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({fn:n,args:a})})" +
  ".then(function(r){return r.json();}).then(function(j){if(j.ok)ok(j.data);else fail({message:j.error});})" +
  ".catch(function(){fail({message:'Mất kết nối mạng, thử lại.'});});};}});return p;}" +
  "window.google={script:{}};Object.defineProperty(window.google.script,'run',{get:mkRun});";

const API_FN = {
  guiMaOTP: guiMaOTP, xacNhanOTP: xacNhanOTP, dangNhapMK: dangNhapMK, datMatKhau: datMatKhau, dangXuat: dangXuat, datPIN: datPIN, taiDuLieu: taiDuLieu,
  chamCong: chamCong, chamCongAnh: chamCongAnh, guiDon: guiDon, duyetDon: duyetDon, taiQuyChe: taiQuyChe,
  hoiNoiQuy: hoiNoiQuy, baoCaoHomNay: baoCaoHomNay, xemAnh: xemAnh, datAnhDaiDien: datAnhDaiDien, taiMoTa: taiMoTa, xemTep: xemTep, lapViPham: lapViPham, dsViPham: dsViPham,
  giaoViec: giaoViec, dsGiaoViec: dsGiaoViec, lichSuSoLieu: lichSuSoLieu, dsBangLuong: dsBangLuong,
  dsNhanVienTatCa: dsNhanVienTatCa, lichSu: lichSu, deNghiCapNhat: deNghiCapNhat, duyetBangLuong: duyetBangLuong, tomTatBangLuong: tomTatBangLuong, thongBao: thongBao, trinhDuyetLuong: trinhDuyetLuong, napMoTa: napMoTa, luuMoTaNV: luuMoTaNV, quanTriCongTy: quanTriCongTy, datNgaySinh: datNgaySinh, luuVinhDanh: luuVinhDanh, napHopDong: napHopDong, luuBanGiao: luuBanGiao, hoSoNhanVien: hoSoNhanVien, capNhatHoSoNV: capNhatHoSoNV, napHoSo: napHoSo, themNhanVien: themNhanVien, luuTaiSan: luuTaiSan, lichSuTaiSan: lichSuTaiSan, taiBaoCaoKD: taiBaoCaoKD, luuDonKD: luuDonKD, xoaDonKD: xoaDonKD, nopBaoCaoKD: nopBaoCaoKD, dsBaoCaoKD: dsBaoCaoKD, duyetBaoCaoKD: duyetBaoCaoKD, ghiViPhamKD: ghiViPhamKD, goViPhamKD: goViPhamKD, datNhomKD: datNhomKD, xemTepKD: xemTepKD, giaoViecDX: giaoViecDX, capNhatViecDX: capNhatViecDX, lapDonHangLoi: lapDonHangLoi, dsDonHangLoi: dsDonHangLoi, capNhatDonHangLoi: capNhatDonHangLoi,
  lapBangLuong: lapBangLuong, congBoLuong: congBoLuong, phieuLuong: phieuLuong, dsNhanVienQL: dsNhanVienQL, nhapSoLieu: nhapSoLieu
};

function doPost(e) {
  let out;
  try {
    const req = JSON.parse(e.postData.contents);
    const fn = API_FN[req.fn];
    if (!fn) throw new Error('Chức năng không hợp lệ.');
    out = { ok: true, data: fn.apply(null, Array.isArray(req.args) ? req.args : []) };
  } catch (err) {
    out = { ok: false, error: String((err && err.message) || err) };
  }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  if (e && e.parameter && e.parameter.src === 'web') {
    const html = HtmlService.createHtmlOutputFromFile('Index').getContent();
    const shim = '<script>' + WEB_SHIM.replace('%URL%', ScriptApp.getService().getUrl()) + '</script>';
    return ContentService.createTextOutput(html.replace('<script>', shim + '\n<script>')).setMimeType(ContentService.MimeType.TEXT);
  }
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Chấm công')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/* ================= CÀI ĐẶT LẦN ĐẦU ================= */

function CAI_DAT_LAN_DAU() {
  const ss = SpreadsheetApp.getActive();
  ss.setSpreadsheetTimeZone(TZ);
  PropertiesService.getScriptProperties().setProperty('SS_ID', ss.getId());

  Object.keys(HEADERS).forEach(function (name) {
    let s = ss.getSheetByName(name);
    if (!s) s = ss.insertSheet(name);
    if (s.getLastRow() === 0) {
      s.getRange(1, 1, 1, HEADERS[name].length).setValues([HEADERS[name]]).setFontWeight('bold').setBackground('#E6F1FB');
      s.setFrozenRows(1);
    } else {
      const h = s.getRange(1, 1, 1, Math.max(1, s.getLastColumn())).getValues()[0];
      HEADERS[name].forEach(function (k) {
        if (h.indexOf(k) < 0) s.getRange(1, s.getLastColumn() + 1).setValue(k).setFontWeight('bold').setBackground('#E6F1FB');
      });
    }
  });

  const ts = ss.getSheetByName(SH.TS);
  ts.getRange('B:B').setNumberFormat('@');
  if (ts.getLastRow() === 1) {
    ts.getRange(2, 1, 9, 3).setValues([
      ['TenCongTy', 'CÔNG TY CỔ PHẦN SX DÂY CÁP THÉP VIỆT NAM', 'In trên đơn PDF'],
      ['GioVao', '08:00', 'Giờ vào làm'],
      ['GioRa', '17:00', 'Giờ tan làm'],
      ['PhutChoPhepTre', '5', 'Trễ quá số phút này mới tính đi trễ'],
      ['SoNgayBaoTruocPhep', '3', 'Nghỉ phép năm và nghỉ không lương phải nộp trước ít nhất bấy nhiêu ngày (ngày lịch)'],
      ['NgayCongThu7', '0.5', 'Một ngày thứ 7 nghỉ tính bằng bao nhiêu ngày phép'],
      ['GmailGiamDoc', '', 'Người duyệt mặc định khi nhân viên chưa có người duyệt'],
      ['BanKinhMacDinh_m', '50', 'Bán kính GPS mặc định nếu điểm chưa ghi'],
      ['SoBanSaoLuuGiuLai', '12', 'Giữ bao nhiêu bản sao lưu hằng tuần']
    ]);
  }

  const coSan = ts.getRange(1, 1, ts.getLastRow(), 1).getValues().map(function (r) { return String(r[0]); });
  [['GioRaThu7VP', '12:00', 'Giờ kết thúc thứ Bảy khối văn phòng'],
   ['GioRaThu7Kho', '16:00', 'Giờ kết thúc thứ Bảy bộ phận kho'],
   ['GioBaoCaoSang', '08:15', 'Giờ gửi báo cáo chấm công buổi sáng'],
   ['GmailNhanBaoCao', '', 'Gmail nhận báo cáo sáng; để trống thì gửi Gmail giám đốc'],
   ['TyLeBHNLD', '10.5', 'Tỷ lệ % BHXH, BHYT, BHTN người lao động đóng trên lương cơ bản'],
   ['LuongToiThieuVung', '5310000', 'Lương tối thiểu vùng I (sàn lương thử việc)'],
   ['PhuCapThamNien', '100000', 'Phụ cấp thâm niên mỗi năm làm việc'],
   ['GioChuanVP', '7.5', 'Số giờ làm việc bình thường/ngày khối văn phòng'],
   ['GioChuanKho', '7', 'Số giờ làm việc bình thường/ngày bộ phận kho'],
   ['GmailHCNS', 'tpnhansubaobap.vn@gmail.com', 'Gmail HCNS nhận đề nghị cập nhật hồ sơ'],
   ['DoChinhXacToiDa', '100', 'Sai số vị trí tối đa (mét) được phép khi chấm công'],
   ['DuyetLuongBB1', 'phuongct39@gmail.com', 'Công ty Bao Báp - bước 1 duyệt chi lương, tạm ứng (Giám đốc)'],
   ['DuyetLuongBB2', 'ketoanbaobapvn@gmail.com', 'Công ty Bao Báp - bước 2 duyệt và lập lệnh chi (Kế toán)'],
   ['DuyetLuongCAP1', 'vattubaobap@gmail.com,vattucapthepvietnam@gmail.com', 'Công ty Dây Cáp Thép - bước 1 duyệt chi lương, tạm ứng (một trong các Gmail, cách nhau dấu phẩy)'],
   ['DuyetLuongCAP2', 'ketoandaycapthepvietnam@gmail.com', 'Công ty Dây Cáp Thép - bước 2 duyệt và lập lệnh chi (Kế toán)'],
   ['NgayTamUngTu', '15', 'Ngày bắt đầu được đề nghị tạm ứng trong tháng'],
   ['NgayTamUngDen', '20', 'Ngày cuối được đề nghị tạm ứng trong tháng'],
   ['HeSoChietKhau', '8.67', 'Điều 8 Quy chế bán hàng: doanh số bị trừ = chiết khấu × hệ số (1,3 ÷ 15%). Kế toán sửa khi thuế suất, tỷ suất lợi nhuận thay đổi'],
   ['KD_ApDungTu', '2026-11', 'Tháng bắt đầu tính lương kinh doanh theo Phụ lục 01 và báo cáo doanh số'],
   ['NacHoaHong', '400:1,800:1.2,1000:1.4,2000:1.6,4000:1.8,8000:2', 'Nấc hoa hồng nhân viên kinh doanh: doanh số ghi nhận từ X triệu: Y%'],
   ['NacHoaHongQL', '400:1,800:1.2,1000:1.4,2000:1.6,4000:1.8,8000:2', 'Nấc hoa hồng trưởng phòng, tính trên doanh số cả đội'],
   ['DSToiThieuNV', '200000000', 'Doanh số nhân viên dưới mức này thì không có thưởng hiệu quả'],
   ['DSToiThieuQL', '2000000000', 'Doanh số đội của trưởng phòng dưới mức này thì không có thưởng hiệu quả'],
   ['HienCoCauBac', 'Không', 'Có: nhân viên thấy cơ cấu lương theo bậc mới. Không: tạm ẩn đến khi Giám đốc chốt bậc'],
   ['MocPhep', '2026-10', 'Tháng bắt đầu tính phép trên app; cột PhepTon trang NhanVien là phép còn lại tính đến trước tháng này'],
   ['PhepMoiThang', '1', 'Số ngày phép cộng thêm mỗi tháng']
  ].forEach(function (x) { if (coSan.indexOf(x[0]) < 0) ts.appendRow(x); });
  if (coSan.indexOf('BaoNguoiDuyet') < 0) ts.appendRow(['BaoNguoiDuyet', 'Có', 'Có = báo ngắn qua Gmail cho riêng người duyệt khi có đơn mới; Không = tắt']);
  if (coSan.indexOf('GuiMailThongBao') < 0) ts.appendRow(['GuiMailThongBao', 'Không', 'Có = gửi thêm email báo đơn; Không = chỉ báo và duyệt trong app']);

  const qc = ss.getSheetByName(SH.QC);
  if (qc.getLastRow() === 1) {
    qc.getRange(2, 1, 2, 6).setValues([
      ['Tất cả', 'Nội quy', 'MẪU - Giờ làm việc, đi trễ, về sớm', 'Đây là dòng mẫu. HCNS thay bằng nội dung chính thức trong nội quy lao động của công ty.', 'đi trễ, trễ giờ, về sớm, chấm công, quên chấm', 'Ghi theo nội quy lao động chính thức'],
      ['Kinh doanh', 'Quy chế phòng ban', 'MẪU - Quy chế phòng kinh doanh', 'Đây là dòng mẫu. HCNS dán quy chế riêng của phòng kinh doanh vào đây.', 'hoa hồng, doanh số, khách hàng, công nợ, chiết khấu', '']
    ]);
    qc.getRange('D:D').setWrap(true);
    qc.setColumnWidth(4, 420);
  }

  const blS = ss.getSheetByName(SH.BL);
  if (blS.getLastRow() === 1) blS.getRange(2, 1, BAC_LUONG.length, 7).setValues(BAC_LUONG);
  blS.getRange('C:G').setNumberFormat('#,##0');
  ss.getSheetByName(SH.SL).getRange('A:A').setNumberFormat('@');
  ss.getSheetByName(SH.LE).getRange('A:A').setNumberFormat('@');
  ss.getSheetByName(SH.GV).getRange('C:C').setNumberFormat('@');
  const nvH = ss.getSheetByName(SH.NV).getRange(1, 1, 1, ss.getSheetByName(SH.NV).getLastColumn()).getValues()[0];
  ['Bac', 'NgayVaoLam', 'SoTaiKhoan'].forEach(function (k) {
    const c = nvH.indexOf(k);
    if (c >= 0) ss.getSheetByName(SH.NV).getRange(1, c + 1, 1000, 1).setNumberFormat('@');
  });

  const mt = ss.getSheetByName(SH.MT);
  if (mt.getLastRow() === 1) {
    mt.getRange(2, 1, 1, 4).setValues([['Nhân viên kinh doanh', 'MẪU - HCNS nhập vai trò theo Bản mô tả công việc đã duyệt.', 'MẪU - Mỗi trách nhiệm một dòng.', 'MẪU - Quyền hạn được giao.']]);
    mt.getRange('B:D').setWrap(true);
  }

  const nv = ss.getSheetByName(SH.NV);
  nv.getRange('A:J').setNumberFormat('@');
  if (nv.getLastRow() === 1) {
    nv.getRange(2, 1, 2, 10).setValues([
      ['NV001', 'Nguyễn Văn Mẫu', 'nhanvienmau@gmail.com', 'Kinh doanh', 'Nhân viên kinh doanh', 'NV', 'truongphongmau@gmail.com', 'Văn phòng kho Tân Đông Hiệp', '12', 'Đang làm'],
      ['TP001', 'Trần Văn Trưởng Phòng', 'truongphongmau@gmail.com', 'Kinh doanh', 'Trưởng phòng kinh doanh', 'TP', '', 'Văn phòng kho Tân Đông Hiệp', '12', 'Đang làm']
    ]);
  }

  ss.getSheetByName(SH.DON).getRange('G:H').setNumberFormat('@');

  const diem = ss.getSheetByName(SH.DIEM);
  if (diem.getLastRow() === 1) {
    diem.getRange(2, 1, 1, 4).setValues([['Văn phòng kho Tân Đông Hiệp', '10.9068367', '106.7918026', '50']]);
  }

  const dv = SpreadsheetApp.newDataValidation().requireValueInList(['NV', 'TP', 'HCNS', 'GD'], true).build();
  nv.getRange('F2:F500').setDataValidation(dv);
  const dv2 = SpreadsheetApp.newDataValidation().requireValueInList(['Đang làm', 'Nghỉ việc'], true).build();
  nv.getRange('J2:J500').setDataValidation(dv2);

  const def = ss.getSheetByName('Sheet1') || ss.getSheetByName('Trang tính1');
  if (def && def.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(def);

  rootFolder_();
  backupFolder_();

  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'SAO_LUU_HANG_TUAN') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('SAO_LUU_HANG_TUAN').timeBased().onWeekDay(ScriptApp.WeekDay.SUNDAY).atHour(23).create();
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'BAO_CAO_SANG') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('BAO_CAO_SANG').timeBased().everyMinutes(15).create();

  Logger.log('Cài đặt xong. Hãy điền sheet NhanVien, DiemChamCong, ThamSo rồi triển khai ứng dụng web.');
}

/* ================= TIỆN ÍCH ================= */

let SS_ = null, MEMO_ = null;
function ss_() {
  if (SS_) return SS_;
  const id = PropertiesService.getScriptProperties().getProperty('SS_ID');
  SS_ = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActive();
  return SS_;
}
function coMemo_(fn) { const cu = MEMO_; MEMO_ = MEMO_ || {}; try { return fn(); } finally { MEMO_ = cu; } }
function sh_(n) {
  const s = ss_().getSheetByName(n);
  if (!s) throw new Error('Thiếu sheet ' + n + '. Hãy chạy CAI_DAT_LAN_DAU.');
  return s;
}
function rows_(n) {
  if (MEMO_ && MEMO_[n]) return MEMO_[n].slice();
  const kq = rowsDoc_(n);
  if (MEMO_) MEMO_[n] = kq;
  return kq.slice();
}
function rowsDoc_(n) {
  const v = sh_(n).getDataRange().getValues();
  const h = v.shift();
  return v.map(function (r, i) {
    const o = { _row: i + 2 };
    h.forEach(function (k, j) { o[k] = r[j]; });
    return o;
  }).filter(function (o) { return h.some(function (k) { return o[k] !== ''; }); });
}
function header_(n) {
  const s = sh_(n);
  return s.getRange(1, 1, 1, s.getLastColumn()).getValues()[0];
}
function append_(n, obj) {
  if (MEMO_) delete MEMO_[n];
  const h = header_(n);
  sh_(n).appendRow(h.map(function (k) { return obj[k] === undefined ? '' : obj[k]; }));
}
function setCell_(n, row, col, val) {
  if (MEMO_) delete MEMO_[n];
  const h = header_(n);
  const c = h.indexOf(col);
  if (c < 0) throw new Error('Thiếu cột ' + col + ' trong sheet ' + n);
  sh_(n).getRange(row, c + 1).setValue(val);
}
function ts_() {
  const m = {};
  rows_(SH.TS).forEach(function (r) {
    let v = r.GiaTri;
    if (v instanceof Date) v = Utilities.formatDate(v, TZ, 'HH:mm');
    m[String(r.ThamSo).trim()] = String(v).trim();
  });
  return m;
}
function log_(gmail, act, detail) {
  try { append_(SH.LOG, { ThoiGian: new Date(), Gmail: gmail, HanhDong: act, ChiTiet: detail || '' }); } catch (e) {}
}
function norm_(e) { return String(e || '').trim().toLowerCase(); }
function ymd_(d) {
  if (!d) return '';
  if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  return Utilities.formatDate(new Date(d), TZ, 'yyyy-MM-dd');
}
function fmtD_(d) { return d ? Utilities.formatDate(new Date(d), TZ, 'dd/MM/yyyy') : ''; }
function fmtDT_(d) { return d ? Utilities.formatDate(new Date(d), TZ, 'HH:mm dd/MM/yyyy') : ''; }
function fmtT_(d) { return d ? Utilities.formatDate(new Date(d), TZ, 'HH:mm') : ''; }
function ymdToVN_(s) { const p = String(s).split('-'); return p[2] + '/' + p[1] + '/' + p[0]; }
function utc_(s) { const p = String(s).split('-').map(Number); return Date.UTC(p[0], p[1] - 1, p[2]); }
function dayDiff_(a, b) { return Math.round((utc_(b) - utc_(a)) / 864e5); }
function addDays_(s, n) { return Utilities.formatDate(new Date(utc_(s) + n * 864e5), 'UTC', 'yyyy-MM-dd'); }
function esc_(s) {
  return String(s === undefined || s === null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function dist_(lat1, lng1, lat2, lng2) {
  const R = 6371000, toR = Math.PI / 180;
  const dLat = (lat2 - lat1) * toR, dLng = (lng2 - lng1) * toR;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * toR) * Math.cos(lat2 * toR) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function demNgay_(tu, den, thu7) {
  let n = 0;
  for (let d = tu; d <= den; d = addDays_(d, 1)) {
    const w = new Date(utc_(d)).getUTCDay();
    if (w === 0) continue;
    n += (w === 6) ? thu7 : 1;
  }
  return n;
}

/* ================= ĐĂNG NHẬP ================= */

function nvByEmail_(email) {
  email = norm_(email);
  return rows_(SH.NV).find(function (r) {
    return norm_(r.Gmail) === email && String(r.TrangThai).trim() !== 'Nghỉ việc';
  });
}

function guiMaOTP(email) {
  email = norm_(email);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, msg: 'Gmail chưa đúng định dạng.' };
  const nv = nvByEmail_(email);
  if (!nv) { log_(email, 'Đăng nhập bị từ chối', 'Không có trong danh sách'); return { ok: false, msg: 'Gmail này không có trong danh sách nhân viên. Liên hệ HCNS.' }; }
  const c = CacheService.getScriptCache();
  if (c.get('otpwait_' + email)) return { ok: false, msg: 'Mã vừa được gửi. Đợi 1 phút rồi thử lại.' };
  const code = String(Math.floor(100000 + Math.random() * 900000));
  c.put('otp_' + email, code, 600);
  c.put('otptry_' + email, '0', 600);
  c.put('otpwait_' + email, '1', 60);
  MailApp.sendEmail({
    to: email,
    subject: 'Mã đăng nhập app chấm công: ' + code,
    htmlBody: '<p>Chào ' + esc_(nv.HoTen) + ',</p><p>Mã đăng nhập của bạn là <b style="font-size:20px">' + code +
      '</b></p><p>Mã có hiệu lực 10 phút. Không đưa mã này cho bất kỳ ai.</p>'
  });
  log_(email, 'Gửi mã đăng nhập', '');
  return { ok: true };
}

function xacNhanOTP(email, code) {
  email = norm_(email);
  const c = CacheService.getScriptCache();
  const real = c.get('otp_' + email);
  if (!real) return { ok: false, msg: 'Mã đã hết hạn. Bấm gửi mã mới.' };
  const tries = Number(c.get('otptry_' + email) || 0) + 1;
  c.put('otptry_' + email, String(tries), 600);
  if (tries > 5) { c.remove('otp_' + email); return { ok: false, msg: 'Nhập sai quá 5 lần. Bấm gửi mã mới.' }; }
  if (String(code).trim() !== real) return { ok: false, msg: 'Mã chưa đúng.' };
  c.remove('otp_' + email);
  const token = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
  PropertiesService.getScriptProperties().setProperty('tk_' + token, JSON.stringify({ e: email, x: Date.now() + 30 * 864e5, o: Date.now() }));
  log_(email, 'Đăng nhập', '');
  return { ok: true, token: token };
}

function auth_(token) {
  if (!token) throw new Error('HET_PHIEN');
  const p = PropertiesService.getScriptProperties();
  const raw = p.getProperty('tk_' + token);
  if (!raw) throw new Error('HET_PHIEN');
  const t = JSON.parse(raw);
  if (Date.now() > t.x) { p.deleteProperty('tk_' + token); throw new Error('HET_PHIEN'); }
  const nv = nvByEmail_(t.e);
  if (!nv) { p.deleteProperty('tk_' + token); throw new Error('HET_PHIEN'); }
  return nv;
}

function dangNhapMK(ten, mk) {
  ten = String(ten || '').trim().toLowerCase();
  mk = String(mk || '');
  if (!ten || !mk) return { ok: false, msg: 'Nhập tên đăng nhập và mật khẩu.' };
  const c = CacheService.getScriptCache(), khoa = 'mktry_' + ten;
  const lan = Number(c.get(khoa) || 0);
  if (lan >= 5) return { ok: false, msg: 'Nhập sai quá 5 lần. Đợi 15 phút hoặc đăng nhập bằng mã gửi Gmail.' };
  const nv = rows_(SH.NV).find(function (r) {
    return String(r.TrangThai).trim() !== 'Nghỉ việc' && r.Gmail && (norm_(r.Gmail) === ten || String(r.MaNV).toLowerCase() === ten);
  });
  if (!nv || !String(nv.MatKhauHash || '') || String(nv.MatKhauHash) !== hash_('MK#' + mk, nv.Gmail)) {
    c.put(khoa, String(lan + 1), 900);
    log_(ten, 'Đăng nhập mật khẩu sai', '');
    return { ok: false, msg: nv && !String(nv.MatKhauHash || '') ? 'Tài khoản này chưa đặt mật khẩu. Đăng nhập bằng mã gửi Gmail rồi đặt mật khẩu trong Tài khoản của tôi.' : 'Tên đăng nhập hoặc mật khẩu chưa đúng.' };
  }
  c.remove(khoa);
  const email = norm_(nv.Gmail);
  const token = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
  PropertiesService.getScriptProperties().setProperty('tk_' + token, JSON.stringify({ e: email, x: Date.now() + 30 * 864e5 }));
  log_(email, 'Đăng nhập bằng mật khẩu', '');
  return { ok: true, token: token, email: email };
}

function datMatKhau(token, mkCu, mkMoi) {
  const nv = auth_(token);
  mkMoi = String(mkMoi || '');
  if (mkMoi.length < 6) return { ok: false, msg: 'Mật khẩu ít nhất 6 ký tự.' };
  if (String(nv.MatKhauHash || '')) {
    let moiOTP = false;
    try { const t = JSON.parse(PropertiesService.getScriptProperties().getProperty('tk_' + token) || '{}'); moiOTP = t.o && Date.now() - t.o < 15 * 60000; } catch (e) {}
    if (!moiOTP && String(nv.MatKhauHash) !== hash_('MK#' + String(mkCu || ''), nv.Gmail)) return { ok: false, msg: 'Mật khẩu cũ chưa đúng. Quên mật khẩu: đăng xuất, đăng nhập bằng mã gửi Gmail rồi đặt lại trong 15 phút.' };
  }
  setCell_(SH.NV, nv._row, 'MatKhauHash', hash_('MK#' + mkMoi, nv.Gmail));
  log_(nv.Gmail, String(nv.MatKhauHash || '') ? 'Đổi mật khẩu đăng nhập' : 'Đặt mật khẩu đăng nhập', '');
  return { ok: true };
}

function dangXuat(token) {
  const nv = auth_(token);
  PropertiesService.getScriptProperties().deleteProperty('tk_' + token);
  log_(nv.Gmail, 'Đăng xuất', '');
  return { ok: true };
}

/* ================= MÃ PIN KÝ ================= */

function hash_(pin, email) {
  const b = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, 'capvina#' + norm_(email) + '#' + String(pin));
  return b.map(function (x) { return ((x + 256) % 256).toString(16).padStart(2, '0'); }).join('');
}

function checkPin_(nv, pin) {
  if (!nv.PinHash) throw new Error('Bạn chưa đặt mã PIN ký. Vào tab Tôi để đặt.');
  const c = CacheService.getScriptCache(), k = 'pinsai_' + norm_(nv.Gmail);
  const sai = Number(c.get(k) || 0);
  if (sai >= 5) throw new Error('Nhập sai PIN quá 5 lần. Thử lại sau 15 phút.');
  if (hash_(pin, nv.Gmail) !== nv.PinHash) {
    c.put(k, String(sai + 1), 900);
    throw new Error('Mã PIN chưa đúng.');
  }
  c.remove(k);
}

function datPIN(token, pinCu, pinMoi) {
  const nv = auth_(token);
  if (!/^\d{4}$/.test(String(pinMoi))) return { ok: false, msg: 'PIN phải gồm đúng 4 chữ số.' };
  if (nv.PinHash) checkPin_(nv, pinCu);
  setCell_(SH.NV, nv._row, 'PinHash', hash_(pinMoi, nv.Gmail));
  log_(nv.Gmail, nv.PinHash ? 'Đổi PIN' : 'Đặt PIN', '');
  return { ok: true };
}

/* ================= DỮ LIỆU MÀN HÌNH ================= */

function donView_(d) {
  return {
    ma: d.MaDon, ten: d.HoTen, phong: d.PhongBan, loai: d.LoaiDon,
    tu: fmtD_(d.TuNgay), den: fmtD_(d.DenNgay), nuaNgay: d.NuaNgay === 'Có',
    soNgay: Number(d.SoNgay || 0), soGio: Number(d.SoGio || 0), soTien: Number(d.SoTien || 0), lyDo: d.LyDo,
    dotXuat: d.DotXuat === 'Có', trangThai: d.TrangThai, nguoiDuyet: d.NguoiDuyet,
    thoiGianDuyet: fmtDT_(d.ThoiGianDuyet), ghiChu: d.GhiChuDuyet, pdf: d.LinkPDF, ngayTao: fmtDT_(d.NgayTao), tep: String(d.TepDinhKem || ''), thangKPI: thangCua_(d.ThangKPI), diemTu: d.DiemTuCham === '' ? '' : Number(d.DiemTuCham), diemDuyet: d.DiemDuyet === '' ? '' : Number(d.DiemDuyet), buoc: String(d.BuocDuyet || ''), lichSuDuyet: String(d.LichSuDuyet || '')
  };
}

function dsGmail_(s) { return String(s || '').split(/[,;\s]+/).map(norm_).filter(String); }

function coQuyenDuyet_(nv, d) {
  if (String(d.MaNV) === String(nv.MaNV)) return false;
  if (dsGmail_(d.GmailDuyet).indexOf(norm_(nv.Gmail)) >= 0) return true;
  if (d.LoaiDon === 'Tạm ứng lương') return false;
  return String(nv.VaiTro).trim() === 'GD';
}

function ctyCua_(nv) { return String((nv && nv.CongTy) || '').trim().toUpperCase() === 'CAP' ? 'CAP' : 'BB'; }
const TEN_CTY = { BB: 'Công ty TNHH Bao Báp Việt Nam', CAP: 'Công ty CP SX Dây Cáp Thép Việt Nam' };

function phepDaDung_(maNV, year, dons) {
  return dons.filter(function (d) {
    return String(d.MaNV) === String(maNV) && d.LoaiDon === 'Nghỉ phép năm' &&
      (d.TrangThai === 'Đã duyệt' || d.TrangThai === 'Chờ duyệt') && ymd_(d.TuNgay).slice(0, 4) === year;
  }).reduce(function (s, d) { return s + Number(d.SoNgay || 0); }, 0);
}

function coCauLuong_(nv, t, today) {
  try {
    const b = bacCua_(nv);
    if (!b) return null;
    const tv = String(nv.ThuViec || '').trim() === 'Có', hs = tv ? 0.85 : 1;
    let tn = 0;
    if (nv.NgayVaoLam && !tv) tn = Math.min(Math.max(Math.floor((utc_(today) - utc_(ymd_(nv.NgayVaoLam))) / (365.25 * 864e5)), 0), 20) * Number(t.PhuCapThamNien || 100000);
    const lcb = tv ? Math.max(Number(b.LuongCB) * 0.85, Number(t.LuongToiThieuVung || 5310000)) : Number(b.LuongCB) + tn;
    const nhom = String(b.Nhom).trim().toUpperCase();
    return { bac: String(b.Bac), nhom: nhom, thuViec: tv, lcbBac: Number(b.LuongCB), thamNien: tn, lcb: Math.round(lcb),
      an: Math.round(Number(b.AnTrua) * hs), xang: nhom === 'C' ? 0 : Math.round(Number(b.XangXe) * hs),
      kpi: Math.round(Number(b.KPIToiDa) * hs), cc: Math.round(Number(b.CCToiDa) * hs),
      bhxh: tv ? 0 : Math.round(lcb * Number(t.TyLeBHNLD || 10.5) / 100) };
  } catch (e) { return null; }
}

function phepConLai_(nv, dons, today) {
  const t = ts_();
  const moc = String(t.MocPhep || '');
  if (/^\d{4}-\d{2}$/.test(moc) && String(nv.PhepTon === undefined ? '' : nv.PhepTon).trim() !== '') {
    const p = moc.split('-').map(Number), q = today.slice(0, 7).split('-').map(Number);
    const soThang = Math.max(0, (q[0] - p[0]) * 12 + (q[1] - p[1]) + 1);
    const daDung = dons.filter(function (d) {
      return String(d.MaNV) === String(nv.MaNV) && d.LoaiDon === 'Nghỉ phép năm' && (d.TrangThai === 'Đã duyệt' || d.TrangThai === 'Chờ duyệt') && ymd_(d.TuNgay) >= moc + '-01';
    }).reduce(function (s, d) { return s + Number(d.SoNgay || 0); }, 0);
    const tong = Number(nv.PhepTon) + soThang * Number(t.PhepMoiThang || 1);
    return { tong: tong, daDung: daDung, conLai: Math.max(0, tong - daDung) };
  }
  const tong = Number(nv.PhepNam || 12), daDung = phepDaDung_(nv.MaNV, today.slice(0, 4), dons);
  return { tong: tong, daDung: daDung, conLai: Math.max(0, tong - daDung) };
}

function taiDuLieu(token) { return coMemo_(function () { return taiDuLieu_(token); }); }
function taiDuLieu_(token) {
  const nv = auth_(token);
  const t = ts_();
  const today = ymd_(new Date()), month = today.slice(0, 7), year = today.slice(0, 4);

  const cc = rows_(SH.CC).filter(function (r) { return String(r.MaNV) === String(nv.MaNV); });
  const homNay = cc.filter(function (r) { return ymd_(r.ThoiGian) === today; });
  const vao = homNay.find(function (r) { return r.Loai === 'VAO'; });
  const raList = homNay.filter(function (r) { return r.Loai === 'RA'; });
  const ra = raList.length ? raList[raList.length - 1] : null;
  const vaoThang = cc.filter(function (r) { return r.Loai === 'VAO' && ymd_(r.ThoiGian).slice(0, 7) === month; });
  const soNgay = {};
  vaoThang.forEach(function (r) { soNgay[ymd_(r.ThoiGian)] = 1; });

  const dons = rows_(SH.DON);
  const cuaToi = dons.filter(function (d) { return String(d.MaNV) === String(nv.MaNV); }).slice(-20).reverse().map(donView_);
  const phepTT = phepConLai_(nv, dons, today);
  const vt = String(nv.VaiTro).trim();
  const choDuyet = (vt === 'TP' || vt === 'GD')
    ? dons.filter(function (d) { return d.TrangThai === 'Chờ duyệt' && coQuyenDuyet_(nv, d); }).map(donView_)
    : [];

  const tcInfo = { luongGio: 0, gio: 0, tien: 0, le: [] };
  try {
    const leTC = ngayLe_();
    tcInfo.le = Object.keys(leTC);
    const bTC = bacCua_(nv);
    if (bTC) {
      const khoiTC = khoi_(nv), chuanTC = soNgayChuan_(month, khoiTC, leTC);
      const tvTC = String(nv.ThuViec || '').trim() === 'Có';
      let tnTC = 0;
      if (nv.NgayVaoLam && !tvTC) tnTC = Math.min(Math.max(Math.floor((utc_(today) - utc_(ymd_(nv.NgayVaoLam))) / (365.25 * 864e5)), 0), 20) * Number(t.PhuCapThamNien || 100000);
      const lcbTC = tvTC ? Math.max(Number(bTC.LuongCB) * 0.85, Number(t.LuongToiThieuVung || 5310000)) : Number(bTC.LuongCB) + tnTC;
      tcInfo.luongGio = Math.round(lcbTC / chuanTC / (khoiTC === 'KHO' ? Number(t.GioChuanKho || 7) : Number(t.GioChuanVP || 7.5)));
      dons.filter(function (d) { return String(d.MaNV) === String(nv.MaNV) && d.LoaiDon === 'Tăng ca' && d.TrangThai === 'Đã duyệt' && ymd_(d.TuNgay).slice(0, 7) === month; })
        .forEach(function (d) {
          const iso = ymd_(d.TuNgay), w = new Date(utc_(iso)).getUTCDay(), g = Number(d.SoGio || 0);
          tcInfo.gio += g;
          tcInfo.tien += tcInfo.luongGio * (leTC[iso] ? 3 : (w === 0 ? 2 : 1.5)) * g;
        });
      tcInfo.tien = Math.round(tcInfo.tien);
    }
  } catch (e) {}
  let anh = '';
  if (nv.AnhDaiDien) { try { anh = 'data:image/jpeg;base64,' + Utilities.base64Encode(DriveApp.getFileById(String(nv.AnhDaiDien)).getBlob().getBytes()); } catch (e) {} }
  return {
    congTy: t.TenCongTy || '', anh: anh, tangCa: tcInfo, coCau: hienBac_(nv, t) ? coCauLuong_(nv, t, today) : null, coCauAn: !hienBac_(nv, t), hoSo: anBac_(hoSo_(nv, t, today), nv, t), taiSan: taiSanCua_(nv.MaNV, true), gpsMax: Number(t.DoChinhXacToiDa || 100), bangTin: bangTin_(today), hopDong: hopDongCua_(nv.MaNV, today), choDuyetLuong: choDuyetLuong_(nv), viecDX: viecDX_(nv), moTa: moTaNV_(nv), kd: !!nhomKD_(nv), choDuyetKD: kdChoToi_(nv), banGiao: bgCua_(nv.MaNV), serverNow: Date.now(), lichSuCC: lichSuCC_(cc),
    diemCC: rows_(SH.DIEM).map(function (p) { return { ten: String(p.TenDiem), lat: Number(p.ViDo), lng: Number(p.KinhDo), r: Number(p.BanKinh_m || 50) }; }), chuyenCan: chuyenCan_(nv, cc, month, today),
    nv: { ma: nv.MaNV, ten: nv.HoTen, gmail: nv.Gmail, phong: nv.PhongBan, chucVu: nv.ChucVu, vaiTro: vt, coPin: !!nv.PinHash, coMK: !!String(nv.MatKhauHash || '') },
    homNay: { ngay: ymdToVN_(today), vao: vao ? fmtT_(vao.ThoiGian) : '', ra: ra ? fmtT_(ra.ThoiGian) : '', diem: vao ? vao.Diem : '', tre: vao ? Number(vao.DiTre_phut || 0) : 0 },
    thang: { ten: month.slice(5) + '/' + year, soNgay: Object.keys(soNgay).length, soLanTre: vaoThang.filter(function (r) { return Number(r.DiTre_phut) > 0; }).length },
    phep: phepTT,
    dons: cuaToi,
    choDuyet: choDuyet,
    baoTruoc: Number(t.SoNgayBaoTruocPhep || 3),
    homNayISO: today,
    gioVao: t.GioVao || '08:00'
  };
}

/* ================= CHẤM CÔNG ================= */

function chamCong(token, lat, lng, acc) {
  const nv = auth_(token);
  lat = Number(lat); lng = Number(lng); acc = Number(acc || 0);
  if (!isFinite(lat) || !isFinite(lng)) return { ok: false, msg: 'Không lấy được vị trí. Bật GPS và cho phép quyền vị trí.' };
  if (acc > 300) return { ok: false, msg: 'GPS chưa đủ chính xác (sai số ' + Math.round(acc) + ' m). Ra chỗ thoáng rồi thử lại.' };

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const t = ts_();
    const now = new Date(), today = ymd_(now);
    const homNay = rows_(SH.CC).filter(function (r) { return String(r.MaNV) === String(nv.MaNV) && ymd_(r.ThoiGian) === today; });
    const loai = homNay.some(function (r) { return r.Loai === 'VAO'; }) ? 'RA' : 'VAO';

    const cho = String(nv.DiemChamCong || '').split(',').map(function (s) { return s.trim(); }).filter(String);
    const ds = rows_(SH.DIEM).filter(function (p) { return !cho.length || cho.indexOf(String(p.TenDiem).trim()) >= 0; });
    if (!ds.length) return { ok: false, msg: 'Bạn chưa được gán điểm chấm công. Báo HCNS.' };

    let best = null;
    ds.forEach(function (p) {
      const k = dist_(lat, lng, Number(p.ViDo), Number(p.KinhDo));
      if (!best || k < best.k) best = { p: p, k: k };
    });
    const banKinh = Number(best.p.BanKinh_m || t.BanKinhMacDinh_m || 50);
    if (best.k > banKinh) {
      log_(nv.Gmail, 'Chấm công ngoài vùng', best.p.TenDiem + ' cách ' + Math.round(best.k) + ' m');
      return { ok: false, msg: 'Bạn đang cách ' + best.p.TenDiem + ' khoảng ' + Math.round(best.k) + ' m, ngoài vùng cho phép (' + banKinh + ' m). Ra gần cửa hoặc chỗ thoáng, đợi vài giây rồi bấm lại.' };
    }

    let tre = 0;
    if (loai === 'VAO') {
      const gv = String(t.GioVao || '08:00').split(':').map(Number);
      const nowMin = Number(Utilities.formatDate(now, TZ, 'H')) * 60 + Number(Utilities.formatDate(now, TZ, 'm'));
      const lech = nowMin - (gv[0] * 60 + (gv[1] || 0));
      tre = lech > Number(t.PhutChoPhepTre || 0) ? lech : 0;
    }

    append_(SH.CC, {
      ThoiGian: now, MaNV: nv.MaNV, HoTen: nv.HoTen, PhongBan: nv.PhongBan, Loai: loai,
      ViDo: lat, KinhDo: lng, DoChinhXac_m: Math.round(acc), KhoangCach_m: Math.round(best.k), Diem: best.p.TenDiem, DiTre_phut: tre
    });
    return { ok: true, loai: loai, gio: fmtT_(now), diem: best.p.TenDiem, tre: tre };
  } finally {
    lock.releaseLock();
  }
}

/* ================= ĐƠN TỪ ================= */

function guiDon(token, f, pin) {
  const nv = auth_(token);
  checkPin_(nv, pin);
  const t = ts_();
  const today = ymd_(new Date());
  f = f || {};
  const loai = f.loai;
  if (LOAI_DON.indexOf(loai) < 0) throw new Error('Chọn loại đơn.');
  if (loai === 'Tạm ứng lương') return guiTamUng_(nv, f, t);
  if (loai === 'Trình duyệt') return guiTrinh_(nv, f, t);
  if (loai === 'Đánh giá KPI') return guiKPI_(nv, f, t);
  if (loai === 'Xin nghỉ việc') return guiNghiViec_(nv, f, t);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(f.tu || '')) throw new Error('Chọn ngày bắt đầu.');
  const den = loai === 'Tăng ca' ? f.tu : (/^\d{4}-\d{2}-\d{2}$/.test(f.den || '') ? f.den : f.tu);
  if (den < f.tu) throw new Error('Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.');
  let lyDo = String(f.lyDo || '').trim();
  if (!lyDo) throw new Error('Nhập lý do.');
  if (loai === 'Tăng ca') {
    if (!String(f.khoiLuong || '').trim()) throw new Error('Ghi khối lượng việc đã làm trong giờ hành chính (Điều 19.8 Quy chế lương).');
    lyDo += ' | Giờ: ' + String(f.gioBD || '') + '–' + String(f.gioKT || '') + ' | Đã làm trong giờ: ' + String(f.khoiLuong).trim();
  }

  const bt = Number(t.SoNgayBaoTruocPhep || 3);
  const diff = dayDiff_(today, f.tu);
  if (loai === 'Nghỉ phép năm' || loai === 'Nghỉ không lương') {
    if (diff < bt) throw new Error(loai + ' phải nộp trước ít nhất ' + bt + ' ngày, sớm nhất là ngày ' + ymdToVN_(addDays_(today, bt)) + '. Trường hợp khẩn cấp hãy chọn "Nghỉ đột xuất".');
  }
  if (loai === 'Nghỉ đột xuất' && diff < -7) throw new Error('Đơn nghỉ đột xuất chỉ được nộp bổ sung trong vòng 7 ngày.');

  let soNgay = 0, soGio = 0;
  const nua = !!f.nuaNgay && f.tu === den && loai !== 'Tăng ca';
  if (loai === 'Tăng ca') {
    soGio = Number(f.soGio);
    if (!(soGio > 0 && soGio <= 12)) throw new Error('Số giờ tăng ca phải từ 0,5 đến 12.');
  } else {
    soNgay = nua ? 0.5 : demNgay_(f.tu, den, Number(t.NgayCongThu7 || 0.5));
    if (soNgay <= 0) throw new Error('Khoảng ngày này không có ngày làm việc.');
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const dons = rows_(SH.DON);
    if (loai === 'Nghỉ phép năm') {
      const con = phepConLai_(nv, dons, today).conLai;
      if (soNgay > con) throw new Error('Bạn chỉ còn ' + con + ' ngày phép. Phần vượt hãy nộp đơn nghỉ không lương.');
    }
    const trung = dons.some(function (d) {
      return String(d.MaNV) === String(nv.MaNV) && d.LoaiDon !== 'Tăng ca' && loai !== 'Tăng ca' &&
        (d.TrangThai === 'Chờ duyệt' || d.TrangThai === 'Đã duyệt') &&
        !(ymd_(d.DenNgay) < f.tu || ymd_(d.TuNgay) > den);
    });
    if (trung) throw new Error('Bạn đã có đơn nghỉ trùng ngày này.');

    const gmailDuyet = norm_(nv.GmailDuyet) || norm_(t.GmailGiamDoc);
    if (!gmailDuyet) throw new Error('Chưa cài người duyệt cho bạn. Báo HCNS.');

    const ma = 'DT' + Utilities.formatDate(new Date(), TZ, 'yyMMddHHmmss') + Math.floor(Math.random() * 90 + 10);
    append_(SH.DON, {
      MaDon: ma, NgayTao: new Date(), MaNV: nv.MaNV, HoTen: nv.HoTen, PhongBan: nv.PhongBan, LoaiDon: loai,
      TuNgay: f.tu, DenNgay: den, NuaNgay: nua ? 'Có' : '', SoNgay: soNgay, SoGio: soGio, LyDo: lyDo,
      DotXuat: loai === 'Nghỉ đột xuất' ? 'Có' : '', GmailDuyet: gmailDuyet, TrangThai: 'Chờ duyệt'
    });
    log_(nv.Gmail, 'Ký và gửi đơn', ma + ' ' + loai);

    if (t.BaoNguoiDuyet !== 'Không') try {
      const link = ScriptApp.getService().getUrl();
      MailApp.sendEmail({
        to: gmailDuyet,
        subject: 'Có đơn cần duyệt: ' + loai + ' - ' + nv.HoTen,
        htmlBody: '<p>' + esc_(nv.HoTen) + ' (' + esc_(nv.PhongBan) + ') vừa gửi <b>' + esc_(loai) + '</b> ngày ' +
          ymdToVN_(f.tu) + (den !== f.tu ? ' đến ' + ymdToVN_(den) : '') + '.</p>' +
          '<p><a href="' + link + '" style="display:inline-block;padding:10px 16px;background:#1F3A4D;color:#ffffff;border-radius:8px;text-decoration:none">Mở app để duyệt</a></p>'
      });
    } catch (e) { log_(nv.Gmail, 'Lỗi gửi mail báo duyệt', e.message); }
    return { ok: true, ma: ma };
  } finally {
    lock.releaseLock();
  }
}

function duyetDon(token, maDon, dongY, ghiChu, pin, diem) {
  const nv = auth_(token);
  checkPin_(nv, pin);
  ghiChu = String(ghiChu || '').trim();
  if (!dongY && !ghiChu) throw new Error('Nhập lý do trả lại để nhân viên biết sửa.');

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  let d;
  try {
    d = rows_(SH.DON).find(function (x) { return x.MaDon === maDon; });
    if (!d) throw new Error('Không tìm thấy đơn.');
    if (d.TrangThai !== 'Chờ duyệt') throw new Error('Đơn này đã được xử lý rồi.');
    if (!coQuyenDuyet_(nv, d)) throw new Error('Bạn không có quyền duyệt đơn này.');
    if (dongY && (d.LoaiDon === 'Tạm ứng lương' || d.LoaiDon === 'Xin nghỉ việc') && String(d.BuocDuyet || '1') !== '2') {
      const nvTU = rows_(SH.NV).find(function (r) { return String(r.MaNV) === String(d.MaNV); }) || {};
      const b2 = dsGmail_(ts_()['DuyetLuong' + ctyCua_(nvTU) + (d.LoaiDon === 'Xin nghỉ việc' ? '1' : '2')]).join(',');
      if (b2) {
        setCell_(SH.DON, d._row, 'BuocDuyet', '2');
        setCell_(SH.DON, d._row, 'GmailDuyet', b2);
        setCell_(SH.DON, d._row, 'LichSuDuyet', String(d.LichSuDuyet || '') + 'Bước 1 duyệt: ' + nv.HoTen + ', ' + fmtDT_(new Date()) + (ghiChu ? ' – ' + ghiChu : '') + '\n');
        log_(nv.Gmail, 'Duyệt bước 1 tạm ứng', maDon);
        try { MailApp.sendEmail({ to: b2, subject: (d.LoaiDon === 'Xin nghỉ việc' ? 'Đơn xin nghỉ việc chờ Giám đốc duyệt: ' : 'Tạm ứng chờ lập lệnh chi: ') + d.HoTen, htmlBody: '<p>' + esc_(nv.HoTen) + ' đã duyệt bước 1 ' + (d.LoaiDon === 'Xin nghỉ việc' ? 'đơn xin nghỉ việc' : 'tạm ứng ' + fmtTien_(d.SoTien) + ' đồng') + ' của ' + esc_(d.HoTen) + '. Mời duyệt bước 2 trên app.</p>' }); } catch (e) {}
        return { ok: true, buoc: 2 };
      }
    }
    var diemD = null;
    if (dongY && d.LoaiDon === 'Đánh giá KPI') {
      diemD = Number(diem);
      if (diem === '' || diem === null || diem === undefined || !(diemD >= 0 && diemD <= 100)) throw new Error('Nhập điểm đánh giá từ 0 đến 100.');
      if (trangThaiBL_(thangCua_(d.ThangKPI)) === 'Đã công bố') throw new Error('Bảng lương tháng này đã công bố, không chấm điểm được nữa.');
    }
    const now = new Date();
    const tt = dongY ? 'Đã duyệt' : 'Trả lại';
    setCell_(SH.DON, d._row, 'TrangThai', tt);
    setCell_(SH.DON, d._row, 'NguoiDuyet', nv.HoTen);
    setCell_(SH.DON, d._row, 'ThoiGianDuyet', now);
    setCell_(SH.DON, d._row, 'GhiChuDuyet', ghiChu || (dongY && d.LoaiDon === 'Tạm ứng lương' ? 'Đã duyệt, lập lệnh chi' : dongY && d.LoaiDon === 'Xin nghỉ việc' ? 'Đồng ý cho nghỉ việc' : ''));
    if (d.LoaiDon === 'Tạm ứng lương' || d.LoaiDon === 'Xin nghỉ việc') setCell_(SH.DON, d._row, 'LichSuDuyet', String(d.LichSuDuyet || '') + (dongY ? (d.LoaiDon === 'Xin nghỉ việc' ? 'Giám đốc duyệt: ' : 'Bước 2 duyệt, lập lệnh chi: ') : 'Trả lại: ') + nv.HoTen + ', ' + fmtDT_(now) + (ghiChu ? ' – ' + ghiChu : '') + '\n');
    if (diemD !== null) {
      setCell_(SH.DON, d._row, 'DiemDuyet', diemD);
      d.DiemDuyet = diemD;
      append_(SH.SL, { Thang: thangCua_(d.ThangKPI), MaNV: d.MaNV, HoTen: d.HoTen, Loai: 'Điểm KPI', GiaTri: diemD,
        GhiChu: 'Duyệt đánh giá ' + d.MaDon + (ghiChu ? ': ' + ghiChu : ''), NguoiNhap: nv.HoTen, ThoiGian: now });
    }
    d.TrangThai = tt; d.NguoiDuyet = nv.HoTen; d.ThoiGianDuyet = now; d.GhiChuDuyet = ghiChu;
    log_(nv.Gmail, dongY ? 'Duyệt đơn' : 'Trả lại đơn', maDon);
  } finally {
    lock.releaseLock();
  }

  const nguoiNop = rows_(SH.NV).find(function (r) { return String(r.MaNV) === String(d.MaNV); });
  let pdf = null;
  if (dongY) {
    try {
      pdf = taoPDF_(d, nv);
      setCell_(SH.DON, d._row, 'LinkPDF', pdf.getUrl());
    } catch (e) { log_(nv.Gmail, 'Lỗi tạo PDF', maDon + ' ' + e.message); }
  }
  if (ts_().GuiMailThongBao === 'Có') try {
    const to = [nguoiNop ? nguoiNop.Gmail : '', nv.Gmail].filter(String).join(',');
    const opt = {
      to: to,
      subject: (dongY ? 'Đã duyệt: ' : 'Trả lại: ') + d.LoaiDon + ' - ' + d.HoTen + ' (' + maDon + ')',
      htmlBody: '<p>Đơn <b>' + esc_(d.LoaiDon) + '</b> của ' + esc_(d.HoTen) + ' đã được <b>' +
        (dongY ? 'duyệt' : 'trả lại') + '</b> bởi ' + esc_(nv.HoTen) + '.</p>' +
        (ghiChu ? '<p>Ghi chú: ' + esc_(ghiChu) + '</p>' : '') + (dongY ? '<p>Bản PDF đính kèm.</p>' : '')
    };
    if (pdf) opt.attachments = [pdf.getBlob()];
    MailApp.sendEmail(opt);
  } catch (e) { log_(nv.Gmail, 'Lỗi gửi mail kết quả', e.message); }
  return { ok: true };
}

/* ================= NỘI QUY, QUY CHẾ, HỎI ĐÁP ================= */

function boDau_(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
}

function quyCheCuaToi_(nv) {
  const pb = norm_(nv.PhongBan);
  return rows_(SH.QC).filter(function (r) {
    const p = norm_(r.PhongBan);
    return (p === '' || p === 'tất cả' || p === pb) && String(r.TieuDe || r.NoiDung).trim() !== '';
  });
}

function taiQuyChe(token) {
  const nv = auth_(token);
  return quyCheCuaToi_(nv).map(function (r) {
    return { pb: r.PhongBan, loai: r.LoaiVanBan, tieuDe: r.TieuDe, noiDung: String(r.NoiDung), kyLuat: String(r.HinhThucKyLuat || '') };
  });
}

const TU_BO_QUA = ['bi', 'la', 'co', 'khong', 'the', 'nao', 'gi', 'toi', 'em', 'anh', 'chi', 'minh', 'neu', 'thi', 'va', 'cua', 'duoc', 'sao', 'nhu', 'lam', 'cho', 'hoi', 've'];

function hoiNoiQuy(token, cauHoi) {
  const nv = auth_(token);
  cauHoi = String(cauHoi || '').slice(0, 300);
  const q = boDau_(cauHoi).replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  if (q.length < 2) return { ok: false, msg: 'Nhập câu hỏi, ví dụ: đi trễ bị xử lý thế nào?' };
  const words = q.split(' ').filter(function (w) { return w.length >= 2 && TU_BO_QUA.indexOf(w) < 0; });
  const kq = quyCheCuaToi_(nv).map(function (r) {
    const txt = boDau_(r.TieuDe + ' ' + r.NoiDung + ' ' + r.HinhThucKyLuat);
    let s = 0;
    String(r.TuKhoa || '').split(',').map(function (k) { return boDau_(k).trim(); }).filter(String)
      .forEach(function (k) { if (q.indexOf(k) >= 0) s += 5; });
    words.forEach(function (w) { if (txt.indexOf(w) >= 0) s += 1; });
    return { r: r, s: s };
  }).filter(function (x) { return x.s >= 2; })
    .sort(function (a, b) { return b.s - a.s; }).slice(0, 3)
    .map(function (x) { return { tieuDe: x.r.TieuDe, noiDung: String(x.r.NoiDung), kyLuat: String(x.r.HinhThucKyLuat || '') }; });
  log_(nv.Gmail, 'Hỏi nội quy', cauHoi);
  return { ok: true, ketQua: kq };
}

/* ================= PDF VÀ LƯU TRỮ ================= */

function getOrCreate_(parent, name) {
  const it = parent.getFoldersByName(name);
  return it.hasNext() ? it.next() : parent.createFolder(name);
}
function rootFolder_() {
  const p = PropertiesService.getScriptProperties();
  const id = p.getProperty('ROOT_FOLDER');
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) {} }
  const f = DriveApp.createFolder('HỆ THỐNG CHẤM CÔNG - ĐƠN TỪ ĐÃ DUYỆT');
  p.setProperty('ROOT_FOLDER', f.getId());
  return f;
}
function backupFolder_() {
  const p = PropertiesService.getScriptProperties();
  const id = p.getProperty('BACKUP_FOLDER');
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) {} }
  const f = DriveApp.createFolder('HỆ THỐNG CHẤM CÔNG - SAO LƯU');
  p.setProperty('BACKUP_FOLDER', f.getId());
  return f;
}

function taoPDF_(d, nguoiDuyet) {
  const t = ts_();
  const tu = fmtD_(d.TuNgay), den = fmtD_(d.DenNgay);
  const thoiGian = d.LoaiDon === 'Xin nghỉ việc' ? 'Ngày làm việc cuối cùng ' + fmtD_(d.TuNgay) : d.LoaiDon === 'Cập nhật hồ sơ' ? 'Ngày đề nghị ' + fmtD_(d.NgayTao) : d.LoaiDon === 'Đánh giá KPI' ? 'Tháng ' + thangCua_(d.ThangKPI) + ', tự chấm ' + d.DiemTuCham + ' điểm, duyệt ' + d.DiemDuyet + ' điểm' : d.LoaiDon === 'Trình duyệt' ? 'Ngày trình ' + fmtD_(d.NgayTao) : d.LoaiDon === 'Tạm ứng lương' ? 'Số tiền ' + fmtTien_(d.SoTien) + ' đồng' : d.LoaiDon === 'Tăng ca'
    ? tu + ', ' + d.SoGio + ' giờ'
    : (tu === den ? tu : tu + ' đến ' + den) + (d.NuaNgay === 'Có' ? ' (nửa ngày)' : '') + ', ' + d.SoNgay + ' ngày';
  const row = function (k, v) { return '<tr><td style="padding:6px 8px;color:#555;width:38%">' + k + '</td><td style="padding:6px 8px">' + esc_(v) + '</td></tr>'; };
  const html =
    '<html><body style="font-family:Arial,sans-serif;font-size:13px;color:#222;padding:24px">' +
    '<p style="margin:0;font-weight:bold">' + esc_(t.TenCongTy || '') + '</p>' +
    '<h2 style="text-align:center;margin:24px 0 4px">ĐƠN ' + esc_(String(d.LoaiDon).toUpperCase()) + '</h2>' +
    '<p style="text-align:center;margin:0 0 20px;color:#555">Mã đơn: ' + esc_(d.MaDon) + '</p>' +
    '<table style="width:100%;border-collapse:collapse;border:1px solid #ccc">' +
    row('Họ và tên', d.HoTen) + row('Mã nhân viên', d.MaNV) + row('Phòng ban', d.PhongBan) +
    row('Loại đơn', d.LoaiDon + (d.DotXuat === 'Có' ? ' (đột xuất)' : '')) + row('Thời gian', thoiGian) + row('Lý do', d.LyDo) +
    '</table>' +
    '<table style="width:100%;margin-top:28px"><tr>' +
    '<td style="width:50%;vertical-align:top;text-align:center"><b>Người đề nghị</b><br><br>' + esc_(d.HoTen) +
    '<br><span style="color:#555">Đã ký điện tử bằng mã PIN<br>' + esc_(fmtDT_(d.NgayTao)) + '</span></td>' +
    '<td style="width:50%;vertical-align:top;text-align:center"><b>Người duyệt</b><br><br>' + esc_(nguoiDuyet.HoTen) +
    '<br><span style="color:#555">Đã duyệt bằng mã PIN<br>' + esc_(fmtDT_(d.ThoiGianDuyet)) + '</span>' +
    (d.GhiChuDuyet ? '<br>Ghi chú: ' + esc_(d.GhiChuDuyet) : '') + '</td></tr></table>' +
    '<p style="margin-top:36px;font-size:11px;color:#777">Văn bản tạo tự động từ hệ thống chấm công của công ty. ' +
    'Người ký được xác thực bằng Gmail công ty cấp và mã PIN cá nhân. Đơn đã khóa, không chỉnh sửa sau khi duyệt.</p>' +
    '</body></html>';
  const blob = Utilities.newBlob(html, 'text/html', 'don.html').getAs('application/pdf')
    .setName(d.MaDon + ' - ' + d.HoTen + ' - ' + d.LoaiDon + '.pdf');
  const year = ymd_(d.TuNgay).slice(0, 4);
  const folder = getOrCreate_(getOrCreate_(rootFolder_(), year), d.MaNV + ' - ' + d.HoTen);
  return folder.createFile(blob);
}

/* ================= SAO LƯU HẰNG TUẦN ================= */

function SAO_LUU_HANG_TUAN() {
  const ss = ss_();
  const folder = backupFolder_();
  DriveApp.getFileById(ss.getId()).makeCopy('SAO LƯU ' + Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd'), folder);

  const giu = Number(ts_().SoBanSaoLuuGiuLai || 12);
  const files = [];
  const it = folder.getFiles();
  while (it.hasNext()) files.push(it.next());
  files.sort(function (a, b) { return b.getDateCreated() - a.getDateCreated(); });
  files.slice(giu).forEach(function (f) { f.setTrashed(true); });

  const p = PropertiesService.getScriptProperties();
  const all = p.getProperties();
  Object.keys(all).forEach(function (k) {
    if (k.indexOf('tk_') !== 0) return;
    try { if (Date.now() > JSON.parse(all[k]).x) p.deleteProperty(k); } catch (e) { p.deleteProperty(k); }
  });
  log_('hệ thống', 'Sao lưu hằng tuần', '');
}

/* ================= LƯƠNG: BẬC LƯƠNG, TẠM ỨNG, SỐ LIỆU THÁNG, BẢNG LƯƠNG ================= */

const BAC_LUONG = [
  ['A.1', 'A', 5700000, 1200000, 800000, 2500000, 800000], ['A.2', 'A', 6500000, 1200000, 800000, 3700000, 800000],
  ['A.3', 'A', 7300000, 1200000, 800000, 4900000, 800000], ['A.4', 'A', 8100000, 1200000, 800000, 6100000, 800000],
  ['A.5', 'A', 9000000, 1200000, 800000, 6800000, 1200000], ['A.6', 'A', 10000000, 1200000, 800000, 7800000, 1200000],
  ['A.7', 'A', 11000000, 1200000, 800000, 8200000, 1800000], ['A.8', 'A', 12000000, 1200000, 800000, 10200000, 1800000],
  ['A.9', 'A', 14000000, 1200000, 800000, 10500000, 2500000], ['A.10', 'A', 17000000, 1200000, 800000, 11500000, 2500000],
  ['B.1', 'B', 5700000, 1200000, 800000, 1300000, 800000], ['B.2', 'B', 6200000, 1200000, 800000, 1800000, 800000],
  ['B.3', 'B', 6900000, 1200000, 800000, 2200000, 1200000], ['B.4', 'B', 7700000, 1200000, 800000, 2900000, 1200000],
  ['B.5', 'B', 8600000, 1200000, 800000, 3400000, 1800000], ['B.6', 'B', 10000000, 1200000, 800000, 5000000, 1800000],
  ['B.7', 'B', 11000000, 1200000, 800000, 7000000, 1800000], ['B.8', 'B', 13000000, 1200000, 800000, 9000000, 1800000],
  ['C.1', 'C', 5700000, 1200000, 0, 1400000, 200000], ['C.2', 'C', 6000000, 1200000, 0, 1400000, 400000],
  ['C.3', 'C', 7000000, 1200000, 0, 5500000, 750000], ['C.4', 'C', 9000000, 1200000, 0, 7500000, 1000000]
];
const LOAI_SL = ['Điểm KPI', 'Đạt 4b', 'Tiền 4c', 'Doanh số thực thu', 'Thưởng', 'Khấu trừ'];

function fmtTien_(n) { return String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
function thangCua_(v) { return v instanceof Date ? Utilities.formatDate(v, TZ, 'yyyy-MM') : String(v || '').trim(); }
function ngayLe_() { const m = {}; rows_(SH.LE).forEach(function (r) { if (r.Ngay) m[ymd_(r.Ngay)] = String(r.TenNgayLe || 'Lễ'); }); return m; }
function heSoNgay_(iso, khoi) { const w = new Date(utc_(iso)).getUTCDay(); if (w === 0) return 0; if (w === 6) return khoi === 'KHO' ? 1 : 0.5; return 1; }
function soNgayThang_(thang) { const p = thang.split('-').map(Number); return new Date(Date.UTC(p[0], p[1], 0)).getUTCDate(); }
function soNgayChuan_(thang, khoi, le) {
  let s = 0;
  for (let d = 1; d <= soNgayThang_(thang); d++) { const iso = thang + '-' + String(d).padStart(2, '0'); if (!le[iso]) s += heSoNgay_(iso, khoi); }
  return s;
}
function bacCua_(nv) {
  const b = String(nv.Bac || '').trim().toUpperCase();
  return b ? (rows_(SH.BL).find(function (r) { return String(r.Bac).trim().toUpperCase() === b; }) || null) : null;
}
function tyLeHH_(ds, bac) {
  const tr = ds / 1e6;
  const k = bac === 'C.3' ? [[2000, 0], [4000, 1.0], [8000, 1.2], [Infinity, 1.6]]
    : bac === 'C.4' ? [[5000, 0], [7000, 0.5], [9000, 0.6], [14000, 1.0], [Infinity, 1.4]]
    : [[400, 0], [800, 1.0], [1000, 1.2], [2000, 1.4], [4000, 1.6], [8000, 1.8], [Infinity, 2.0]];
  for (let i = 0; i < k.length; i++) if (tr < k[i][0]) return k[i][1];
  return 0;
}
function quyenLuong_(nv) { const v = String(nv.VaiTro).trim(); return v === 'GD' || v === 'HCNS' || v === 'KT'; }
function trangThaiBL_(thang) { return PropertiesService.getScriptProperties().getProperty('BL_' + thang) || ''; }

function guiTamUng_(nv, f, t) {
  const tien = Math.round(Number(f.soTien));
  if (!(tien > 0)) throw new Error('Nhập số tiền tạm ứng.');
  const lyDo = String(f.lyDo || '').trim();
  if (!lyDo) throw new Error('Nhập lý do.');
  const now = new Date(), today = ymd_(now), thang = today.slice(0, 7);
  if (String(nv.ThuViec || '').trim() === 'Có') throw new Error('Theo quy chế lương, nhân viên đang thử việc chưa được tạm ứng lương.');
  const ngayTU = Number(today.slice(8)), tuN = Number(t.NgayTamUngTu || 15), denN = Number(t.NgayTamUngDen || 20);
  if (ngayTU < tuN || ngayTU > denN) throw new Error('Chỉ được đề nghị tạm ứng từ ngày ' + tuN + ' đến ngày ' + denN + ' hằng tháng.');
  const b = bacCua_(nv);
  if (b) {
    const khoi = khoi_(nv), chuan = soNgayChuan_(thang, khoi, ngayLe_());
    const daLam = {};
    rows_(SH.CC).forEach(function (r) { if (String(r.MaNV) === String(nv.MaNV) && r.Loai === 'VAO' && ymd_(r.ThoiGian).slice(0, 7) === thang) daLam[ymd_(r.ThoiGian)] = 1; });
    const soNgay = Object.keys(daLam).reduce(function (s, d) { return s + heSoNgay_(d, khoi); }, 0);
    const toiDa = Math.floor(Number(b.LuongCB) * 0.5 * soNgay / chuan);
    const daUng = rows_(SH.DON).filter(function (d) {
      return String(d.MaNV) === String(nv.MaNV) && d.LoaiDon === 'Tạm ứng lương' && (d.TrangThai === 'Đã duyệt' || d.TrangThai === 'Chờ duyệt') && ymd_(d.TuNgay).slice(0, 7) === thang;
    }).reduce(function (s, d) { return s + Number(d.SoTien || 0); }, 0);
    if (tien + daUng > toiDa) throw new Error('Theo Điều 17.6 Quy chế lương, tạm ứng tối đa 50% lương cơ bản của số ngày đã làm. Tháng này bạn còn ứng được tối đa ' + fmtTien_(Math.max(0, toiDa - daUng)) + ' đồng.');
  }
  const gmailDuyet = dsGmail_(t['DuyetLuong' + ctyCua_(nv) + '1']).join(',') || norm_(t.GmailGiamDoc);
  if (!gmailDuyet) throw new Error('Chưa cài người duyệt tạm ứng. Báo HCNS.');
  const ma = 'TU' + Utilities.formatDate(now, TZ, 'yyMMddHHmmss') + Math.floor(Math.random() * 90 + 10);
  append_(SH.DON, {
    MaDon: ma, NgayTao: now, MaNV: nv.MaNV, HoTen: nv.HoTen, PhongBan: nv.PhongBan, LoaiDon: 'Tạm ứng lương',
    TuNgay: today, DenNgay: today, SoNgay: 0, SoGio: 0, SoTien: tien, LyDo: lyDo, GmailDuyet: gmailDuyet, TrangThai: 'Chờ duyệt', BuocDuyet: '1'
  });
  log_(nv.Gmail, 'Ký và gửi đơn', ma + ' Tạm ứng ' + tien);
  if (t.BaoNguoiDuyet !== 'Không') {
    try {
      MailApp.sendEmail({ to: gmailDuyet, subject: 'Có đơn cần duyệt: Tạm ứng lương - ' + nv.HoTen,
        htmlBody: '<p>' + esc_(nv.HoTen) + ' xin tạm ứng <b>' + fmtTien_(tien) + ' đồng</b>.</p><p><a href="' + ScriptApp.getService().getUrl() + '">Mở app để duyệt</a></p>' });
    } catch (e) {}
  }
  return { ok: true, ma: ma };
}

function guiNghiViec_(nv, f, t) {
  const cuoi = String(f.tu || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cuoi)) throw new Error('Chọn ngày làm việc cuối cùng.');
  const now = new Date(), today = ymd_(now);
  if (cuoi < today) throw new Error('Ngày làm việc cuối cùng không được trước hôm nay.');
  const lyDo = String(f.lyDo || '').trim();
  if (!lyDo) throw new Error('Nhập lý do xin nghỉ việc.');
  const trung = rows_(SH.DON).some(function (d) { return String(d.MaNV) === String(nv.MaNV) && d.LoaiDon === 'Xin nghỉ việc' && d.TrangThai === 'Chờ duyệt'; });
  if (trung) throw new Error('Bạn đã có đơn xin nghỉ việc đang chờ duyệt.');
  let canBao = 30, loaiHD = 'chưa có hợp đồng trên app';
  try {
    const hd = rows_(SH.HD).filter(function (r) { return String(r.MaNV) === String(nv.MaNV) && r.LoaiHD !== 'Phụ lục hợp đồng' && r.LoaiHD !== 'Thỏa thuận bảo mật, cam kết'; }).pop();
    if (hd) {
      loaiHD = String(hd.LoaiHD).toLowerCase();
      if (hd.LoaiHD === 'Hợp đồng thử việc') canBao = 0;
      else if (hd.LoaiHD === 'Hợp đồng lao động không xác định thời hạn') canBao = 45;
      else if (hd.LoaiHD === 'Hợp đồng lao động xác định thời hạn' && hd.TuNgay && hd.DenNgay) canBao = (utc_(ymd_(hd.DenNgay)) - utc_(ymd_(hd.TuNgay))) / 864e5 < 365 ? 3 : 30;
    } else if (String(nv.ThuViec || '').trim() === 'Có') { canBao = 0; loaiHD = 'đang thử việc'; }
  } catch (e) {}
  const baoTruoc = Math.round((utc_(cuoi) - utc_(today)) / 864e5);
  const ghiBao = 'Báo trước ' + baoTruoc + ' ngày' + (canBao ? ' (yêu cầu ' + canBao + ' ngày theo Điều 35 BLLĐ, ' + loaiHD + ')' + (baoTruoc < canBao ? ' – CHƯA ĐỦ thời hạn báo trước' : '') : ' (' + loaiHD + ', không bắt buộc báo trước)');
  const banGiao = String(f.banGiao || '').trim().slice(0, 300);
  const gmail1 = norm_(nv.GmailDuyet) || dsGmail_(t['DuyetLuong' + ctyCua_(nv) + '1']).join(',') || norm_(t.GmailGiamDoc);
  if (!gmail1) throw new Error('Chưa cài người duyệt cho bạn. Báo HCNS.');
  const ma = 'NV' + Utilities.formatDate(now, TZ, 'yyMMddHHmmss') + Math.floor(Math.random() * 90 + 10);
  append_(SH.DON, { MaDon: ma, NgayTao: now, MaNV: nv.MaNV, HoTen: nv.HoTen, PhongBan: nv.PhongBan, LoaiDon: 'Xin nghỉ việc',
    TuNgay: cuoi, DenNgay: cuoi, SoNgay: 0, SoGio: 0, LyDo: lyDo + (banGiao ? '\nBàn giao công việc cho: ' + banGiao : '') + '\n' + ghiBao,
    GmailDuyet: gmail1, TrangThai: 'Chờ duyệt', BuocDuyet: '1' });
  log_(nv.Gmail, 'Ký và gửi đơn xin nghỉ việc', ma);
  if (t.BaoNguoiDuyet !== 'Không') {
    try { MailApp.sendEmail({ to: gmail1, subject: 'Đơn xin nghỉ việc: ' + nv.HoTen, htmlBody: '<p>' + esc_(nv.HoTen) + ' xin nghỉ việc, ngày làm việc cuối ' + ymdToVN_(cuoi) + '.</p><p><a href="' + ScriptApp.getService().getUrl() + '">Mở app để duyệt</a></p>' }); } catch (e) {}
  }
  return { ok: true, ma: ma };
}

function guiTrinh_(nv, f, t) {
  const tieuDe = String(f.tieuDe || '').trim();
  if (!tieuDe) throw new Error('Nhập tiêu đề tờ trình, đề xuất.');
  const ghiChu = String(f.lyDo || '').trim();
  const tep = f.file || {};
  if (!tep.data || !/^[A-Za-z0-9+\/=]+$/.test(String(tep.data))) throw new Error('Chưa đính kèm bản đã ký (ảnh hoặc PDF).');
  if (['image/jpeg', 'application/pdf'].indexOf(tep.mime) < 0) throw new Error('Chỉ nhận ảnh hoặc PDF.');
  if (String(tep.data).length > 11000000) throw new Error('Tệp quá lớn, tối đa khoảng 8 MB.');
  const gmailDuyet = f.capDuyet === 'GD' ? (norm_(t.GmailGiamDoc) || norm_(nv.GmailDuyet)) : (norm_(nv.GmailDuyet) || norm_(t.GmailGiamDoc));
  if (!gmailDuyet) throw new Error('Chưa cài người duyệt cho bạn. Báo HCNS.');
  const now = new Date(), today = ymd_(now);
  const ma = 'TT' + Utilities.formatDate(now, TZ, 'yyMMddHHmmss') + Math.floor(Math.random() * 90 + 10);
  const p = PropertiesService.getScriptProperties();
  let root = null;
  const id = p.getProperty('TRINH_FOLDER');
  if (id) { try { root = DriveApp.getFolderById(id); } catch (e) {} }
  if (!root) { root = DriveApp.createFolder('HỆ THỐNG CHẤM CÔNG - HỒ SƠ TRÌNH DUYỆT'); p.setProperty('TRINH_FOLDER', root.getId()); }
  const folder = getOrCreate_(root, Utilities.formatDate(now, TZ, 'yyyy-MM'));
  const file = folder.createFile(Utilities.newBlob(Utilities.base64Decode(String(tep.data)), tep.mime,
    ma + ' - ' + nv.HoTen + ' - ' + tieuDe.slice(0, 60) + (tep.mime === 'application/pdf' ? '.pdf' : '.jpg')));
  append_(SH.DON, {
    MaDon: ma, NgayTao: now, MaNV: nv.MaNV, HoTen: nv.HoTen, PhongBan: nv.PhongBan, LoaiDon: 'Trình duyệt',
    TuNgay: today, DenNgay: today, SoNgay: 0, SoGio: 0, LyDo: tieuDe + (ghiChu ? ' — ' + ghiChu : ''),
    GmailDuyet: gmailDuyet, TrangThai: 'Chờ duyệt', TepDinhKem: file.getId()
  });
  log_(nv.Gmail, 'Trình duyệt', ma + ' ' + tieuDe);
  if (t.BaoNguoiDuyet !== 'Không') {
    try {
      MailApp.sendEmail({ to: gmailDuyet, subject: 'Có đề xuất cần duyệt: ' + tieuDe + ' - ' + nv.HoTen,
        htmlBody: '<p>' + esc_(nv.HoTen) + ' vừa trình: <b>' + esc_(tieuDe) + '</b>.</p>' + (ghiChu ? '<p>Ghi chú trình: ' + esc_(ghiChu) + '</p>' : '') +
          '<p><a href="' + ScriptApp.getService().getUrl() + '">Mở app để xem bản đã ký và duyệt</a></p>' });
    } catch (e) {}
  }
  return { ok: true, ma: ma };
}

const DUOI_TEP = { 'image/jpeg': '.jpg', 'application/pdf': '.pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx' };

function luuTep_(propKey, tenThuMuc, tep, ten) {
  if (!tep || !tep.data || !/^[A-Za-z0-9+\/=]+$/.test(String(tep.data))) throw new Error('Tệp đính kèm không hợp lệ.');
  if (!DUOI_TEP[tep.mime]) throw new Error('Chỉ nhận ảnh, PDF hoặc Word (.docx).');
  if (String(tep.data).length > 11000000) throw new Error('Tệp quá lớn, tối đa khoảng 8 MB.');
  const p = PropertiesService.getScriptProperties();
  let root = null;
  const id = p.getProperty(propKey);
  if (id) { try { root = DriveApp.getFolderById(id); } catch (e) {} }
  if (!root) { root = DriveApp.createFolder(tenThuMuc); p.setProperty(propKey, root.getId()); }
  const folder = getOrCreate_(root, Utilities.formatDate(new Date(), TZ, 'yyyy-MM'));
  return folder.createFile(Utilities.newBlob(Utilities.base64Decode(String(tep.data)), tep.mime, ten + DUOI_TEP[tep.mime]));
}

function guiKPI_(nv, f, t) {
  const thang = String(f.thang || '');
  if (!/^\d{4}-\d{2}$/.test(thang)) throw new Error('Chọn tháng đánh giá.');
  const diemTu = Number(f.diemTu);
  if (f.diemTu === '' || !(diemTu >= 0 && diemTu <= 100)) throw new Error('Nhập điểm tự đánh giá từ 0 đến 100.');
  const trung = rows_(SH.DON).some(function (d) {
    return String(d.MaNV) === String(nv.MaNV) && d.LoaiDon === 'Đánh giá KPI' && thangCua_(d.ThangKPI) === thang && (d.TrangThai === 'Chờ duyệt' || d.TrangThai === 'Đã duyệt');
  });
  if (trung) throw new Error('Bạn đã nộp đánh giá tháng này rồi. Nếu bị trả lại thì nộp lại được.');
  const gmailDuyet = norm_(nv.GmailDuyet) || norm_(t.GmailGiamDoc);
  if (!gmailDuyet) throw new Error('Chưa cài người duyệt cho bạn. Báo HCNS.');
  const now = new Date(), today = ymd_(now);
  const ma = 'KP' + Utilities.formatDate(now, TZ, 'yyMMddHHmmss') + Math.floor(Math.random() * 90 + 10);
  const file = luuTep_('KPI_FOLDER', 'HỆ THỐNG CHẤM CÔNG - HỒ SƠ ĐÁNH GIÁ KPI', f.file, ma + ' - ' + nv.HoTen + ' - KPI ' + thang);
  const ghiChu = String(f.lyDo || '').trim();
  append_(SH.DON, {
    MaDon: ma, NgayTao: now, MaNV: nv.MaNV, HoTen: nv.HoTen, PhongBan: nv.PhongBan, LoaiDon: 'Đánh giá KPI',
    TuNgay: today, DenNgay: today, SoNgay: 0, SoGio: 0, LyDo: 'KPI tháng ' + thang.slice(5) + '/' + thang.slice(0, 4) + ', tự chấm ' + diemTu + ' điểm' + (ghiChu ? ' — ' + ghiChu : ''),
    GmailDuyet: gmailDuyet, TrangThai: 'Chờ duyệt', TepDinhKem: file.getId(), ThangKPI: thang, DiemTuCham: diemTu
  });
  log_(nv.Gmail, 'Nộp đánh giá KPI', ma + ' ' + thang);
  if (t.BaoNguoiDuyet !== 'Không') {
    try {
      MailApp.sendEmail({ to: gmailDuyet, subject: 'Có đánh giá KPI cần chấm: ' + nv.HoTen + ' tháng ' + thang,
        htmlBody: '<p>' + esc_(nv.HoTen) + ' nộp tự đánh giá KPI tháng ' + thang + ', tự chấm ' + diemTu + ' điểm.</p><p><a href="' + ScriptApp.getService().getUrl() + '">Mở app để chấm điểm</a></p>' });
    } catch (e) {}
  }
  return { ok: true, ma: ma };
}

function quyenVoiNV_(nv, target) {
  const vt = String(nv.VaiTro).trim();
  if (vt === 'GD' || vt === 'HCNS') return true;
  if (vt !== 'TP') return false;
  return String(target.MaNV) !== String(nv.MaNV) && (norm_(target.GmailDuyet) === norm_(nv.Gmail) || norm_(target.PhongBan) === norm_(nv.PhongBan));
}

function lapViPham(token, f) {
  const nv = auth_(token);
  f = f || {};
  const target = rows_(SH.NV).find(function (r) { return String(r.MaNV) === String(f.ma); });
  if (!target) throw new Error('Chọn nhân viên.');
  if (!quyenVoiNV_(nv, target)) throw new Error('Bạn không có quyền lập vi phạm cho nhân viên này.');
  const loai = f.loai === 'Vi phạm có văn bản' ? 'Vi phạm có văn bản' : 'Nhắc nhở';
  const noiDung = String(f.noiDung || '').trim().slice(0, 2000);
  if (!noiDung) throw new Error('Nhập nội dung vi phạm.');
  const now = new Date();
  const ma = 'VP' + Utilities.formatDate(now, TZ, 'yyMMddHHmmss') + Math.floor(Math.random() * 90 + 10);
  let tepId = '';
  if (f.file && f.file.data) tepId = luuTep_('VIPHAM_FOLDER', 'HỆ THỐNG CHẤM CÔNG - HỒ SƠ VI PHẠM', f.file, ma + ' - ' + target.HoTen).getId();
  append_(SH.VP, { MaVP: ma, ThoiGian: now, MaNV: target.MaNV, HoTen: target.HoTen, PhongBan: target.PhongBan, Loai: loai,
    NoiDung: noiDung, TepDinhKem: tepId, NguoiLap: nv.HoTen, GmailNguoiLap: nv.Gmail });
  log_(nv.Gmail, 'Lập ' + loai, ma + ' ' + target.MaNV);
  return { ok: true, ma: ma };
}

function dsViPham(token) {
  const nv = auth_(token);
  const all = rows_(SH.VP);
  const v = function (r) { return { ma: r.MaVP, gio: fmtDT_(r.ThoiGian), ten: r.HoTen, phong: r.PhongBan, loai: r.Loai, noiDung: String(r.NoiDung), tep: String(r.TepDinhKem || ''), nguoiLap: r.NguoiLap }; };
  const ds = rows_(SH.NV);
  return {
    cuaToi: all.filter(function (r) { return String(r.MaNV) === String(nv.MaNV); }).slice(-30).reverse().map(v),
    quanLy: laQuanLy_(nv) ? all.filter(function (r) {
      const tg = ds.find(function (x) { return String(x.MaNV) === String(r.MaNV); });
      return tg && quyenVoiNV_(nv, tg);
    }).slice(-50).reverse().map(v) : []
  };
}

function lichSuCC_(cc) {
  const m = {};
  cc.forEach(function (r) { const d = ymd_(r.ThoiGian); (m[d] = m[d] || []).push(r); });
  return Object.keys(m).sort().reverse().slice(0, 31).map(function (d) {
    const rs = m[d];
    const vao = rs.find(function (r) { return r.Loai === 'VAO'; });
    const ras = rs.filter(function (r) { return r.Loai === 'RA'; });
    const ra = ras.length ? ras[ras.length - 1] : null;
    return { ngay: ymdToVN_(d), vao: vao ? fmtT_(vao.ThoiGian) : '', ra: ra ? fmtT_(ra.ThoiGian) : '',
      tre: vao ? Number(vao.DiTre_phut || 0) : 0, veSom: ra ? Number(ra.VeSom_phut || 0) : 0, diem: vao ? String(vao.Diem || '') : '',
      anhVao: vao ? String(vao.AnhID || '') : '', anhRa: ra ? String(ra.AnhID || '') : '' };
  });
}

function giaoViec(token, f) {
  const nv = auth_(token);
  f = f || {};
  if (['GD', 'HCNS', 'TP'].indexOf(String(nv.VaiTro).trim()) < 0) throw new Error('Bạn không có quyền giao việc.');
  if (!/^\d{4}-\d{2}$/.test(String(f.thang || ''))) throw new Error('Chọn tháng.');
  const noiDung = String(f.noiDung || '').trim().slice(0, 3000);
  if (!noiDung) throw new Error('Nhập nội dung giao việc, mục tiêu tháng.');
  const ds = rows_(SH.NV).filter(function (r) {
    return String(r.MaNV).trim() && String(r.TrangThai).trim() !== 'Nghỉ việc' && String(r.MaNV) !== String(nv.MaNV) && quyenVoiNV_(nv, r);
  });
  const nhan = f.ma === '*' ? ds : ds.filter(function (r) { return String(r.MaNV) === String(f.ma); });
  if (!nhan.length) throw new Error('Chọn nhân viên nhận việc.');
  const now = new Date();
  const ma = 'GV' + Utilities.formatDate(now, TZ, 'yyMMddHHmmss') + Math.floor(Math.random() * 90 + 10);
  let tep = '';
  if (f.file && f.file.data) tep = luuTep_('GIAOVIEC_FOLDER', 'HỆ THỐNG CHẤM CÔNG - GIAO VIỆC, KẾ HOẠCH THÁNG', f.file, ma + ' - giao việc tháng ' + f.thang).getId();
  nhan.forEach(function (r, i) {
    append_(SH.GV, { MaGV: ma + (nhan.length > 1 ? '-' + (i + 1) : ''), ThoiGian: now, Thang: f.thang, MaNV: r.MaNV, HoTen: r.HoTen, PhongBan: r.PhongBan,
      NoiDung: noiDung, TepDinhKem: tep, NguoiGiao: nv.HoTen, GmailNguoiGiao: nv.Gmail });
  });
  log_(nv.Gmail, 'Giao việc tháng', f.thang + ' cho ' + nhan.length + ' người');
  return { ok: true, soNguoi: nhan.length };
}

function dsGiaoViec(token) {
  const nv = auth_(token);
  const all = rows_(SH.GV);
  const v = function (r) { return { ma: String(r.MaGV), gio: fmtDT_(r.ThoiGian), thang: thangCua_(r.Thang), ten: r.HoTen, noiDung: String(r.NoiDung), tep: String(r.TepDinhKem || ''), nguoiGiao: r.NguoiGiao }; };
  return {
    cuaToi: all.filter(function (r) { return String(r.MaNV) === String(nv.MaNV); }).slice(-24).reverse().map(v),
    daGiao: all.filter(function (r) { return norm_(r.GmailNguoiGiao) === norm_(nv.Gmail); }).slice(-50).reverse().map(v)
  };
}

function lichSuSoLieu(token, thang) {
  const nv = auth_(token);
  if (!quyenLuong_(nv) && String(nv.VaiTro).trim() !== 'TP') throw new Error('Bạn không có quyền xem.');
  const ds = rows_(SH.NV);
  return rows_(SH.SL).filter(function (r) {
    if (thangCua_(r.Thang) !== String(thang)) return false;
    if (quyenLuong_(nv)) return true;
    const tg = ds.find(function (x) { return String(x.MaNV) === String(r.MaNV); });
    return tg && quyenVoiNV_(nv, tg);
  }).slice(-100).reverse().map(function (r) {
    return { ma: String(r.MaSL || ''), gio: fmtDT_(r.ThoiGian), ten: r.HoTen, loai: r.Loai, giaTri: r.GiaTri, ghiChu: String(r.GhiChu || ''), nguoiNhap: r.NguoiNhap, tep: String(r.TepDinhKem || '') };
  });
}

function dsBangLuong(token) {
  const nv = auth_(token);
  if (!quyenLuong_(nv)) throw new Error('Bạn không có quyền xem bảng lương.');
  const ss = ss_(), props = PropertiesService.getScriptProperties().getProperties();
  return ss.getSheets().map(function (s) { return s.getName(); }).filter(function (n) { return /^BL \d{4}-\d{2}$/.test(n); }).sort().reverse()
    .map(function (n) { const th = n.slice(3); return { thang: th, trangThai: props['BL_' + th] || 'Nháp', url: ss.getUrl() + '#gid=' + ss.getSheetByName(n).getSheetId(),
      ct: { BB: moTaDuyetBL_(th, 'BB'), CAP: moTaDuyetBL_(th, 'CAP') } }; });
}

function xemTep(token, ma) {
  const nv = auth_(token);
  ma = String(ma || '');
  let d = rows_(SH.DON).find(function (x) { return x.MaDon === ma; });
  let ok = false;
  if (d) ok = String(d.MaNV) === String(nv.MaNV) || norm_(d.GmailDuyet) === norm_(nv.Gmail) || ['GD', 'HCNS'].indexOf(String(nv.VaiTro).trim()) >= 0;
  else if (ma.indexOf('SL') === 0) {
    d = rows_(SH.SL).find(function (x) { return String(x.MaSL) === ma; });
    if (d) { const tg = rows_(SH.NV).find(function (x) { return String(x.MaNV) === String(d.MaNV); }); ok = quyenLuong_(nv) || (tg && quyenVoiNV_(nv, tg)); }
  } else if (ma.indexOf('GV') === 0) {
    d = rows_(SH.GV).find(function (x) { return String(x.MaGV) === ma; });
    if (d) ok = String(d.MaNV) === String(nv.MaNV) || norm_(d.GmailNguoiGiao) === norm_(nv.Gmail) || ['GD', 'HCNS'].indexOf(String(nv.VaiTro).trim()) >= 0;
  } else {
    if (ma.indexOf('HS') === 0) {
      const hs = rows_(SH.HS).find(function (x) { return String(x.MaHS) === ma; });
      if (!hs || !hs.TepDinhKem) throw new Error('Không có tệp.');
      if (String(hs.MaNV) !== String(nv.MaNV) && ['GD', 'HCNS'].indexOf(String(nv.VaiTro).trim()) < 0) throw new Error('Bạn không có quyền xem hồ sơ này.');
      const fhs = DriveApp.getFileById(String(hs.TepDinhKem)), bhs = fhs.getBlob();
      return { ten: fhs.getName(), mime: bhs.getContentType(), data: Utilities.base64Encode(bhs.getBytes()) };
    }
    if (ma.indexOf('BG') === 0) {
      const bg = rows_(SH.BG).find(function (x) { return String(x.MaBG) === ma; });
      if (!bg || !bg.TepDinhKem) throw new Error('Chưa nạp biên bản đã ký.');
      if (String(bg.MaNV) !== String(nv.MaNV) && ['GD', 'HCNS'].indexOf(String(nv.VaiTro).trim()) < 0) throw new Error('Bạn không có quyền xem biên bản này.');
      const fbg = DriveApp.getFileById(String(bg.TepDinhKem)), bbg = fbg.getBlob();
      return { ten: fbg.getName(), mime: bbg.getContentType(), data: Utilities.base64Encode(bbg.getBytes()) };
    }
    if (ma.indexOf('HD') === 0) {
      const hd = rows_(SH.HD).find(function (x) { return String(x.MaHD) === ma; });
      if (!hd || !hd.TepDinhKem) throw new Error('Không có tệp đính kèm.');
      if (String(hd.MaNV) !== String(nv.MaNV) && ['GD', 'HCNS'].indexOf(String(nv.VaiTro).trim()) < 0) throw new Error('Bạn không có quyền xem hợp đồng này.');
      const fhd = DriveApp.getFileById(String(hd.TepDinhKem)), bhd = fhd.getBlob();
      return { ten: fhd.getName(), mime: bhd.getContentType(), data: Utilities.base64Encode(bhd.getBytes()) };
    }
    if (ma.indexOf('MT') === 0) {
      const mt = rows_(SH.MT).find(function (x) { return String(x.MaMT) === ma; });
      if (!mt || !mt.TepDinhKem) throw new Error('Không có tệp đính kèm.');
      const fmt = DriveApp.getFileById(String(mt.TepDinhKem)), bmt = fmt.getBlob();
      return { ten: fmt.getName(), mime: bmt.getContentType(), data: Utilities.base64Encode(bmt.getBytes()) };
    }
    if (ma.indexOf('DH') === 0) {
      d = rows_(SH.DH).find(function (x) { return String(x.MaDH) === ma; });
      if (d) ok = xemDH_(auth_(token), d);
      if (!d || !d.TepDinhKem) throw new Error('Không có tệp đính kèm.');
      if (!ok) throw new Error('Bạn không có quyền xem tệp này.');
      const fdh = DriveApp.getFileById(String(d.TepDinhKem)), bdh = fdh.getBlob();
      return { ten: fdh.getName(), mime: bdh.getContentType(), data: Utilities.base64Encode(bdh.getBytes()) };
    }
    d = rows_(SH.VP).find(function (x) { return x.MaVP === ma; });
    if (d) { const tg = rows_(SH.NV).find(function (x) { return String(x.MaNV) === String(d.MaNV); }); ok = String(d.MaNV) === String(nv.MaNV) || (tg && quyenVoiNV_(nv, tg)); }
  }
  if (!d || !d.TepDinhKem) throw new Error('Không có tệp đính kèm.');
  if (!ok) throw new Error('Bạn không có quyền xem tệp này.');
  const f = DriveApp.getFileById(String(d.TepDinhKem)), b = f.getBlob();
  return { ten: f.getName(), mime: b.getContentType(), data: Utilities.base64Encode(b.getBytes()) };
}

/* ================= ĐƠN HÀNG BỊ TRẢ, TREO, LỖI ================= */

const LOAI_DH = ['Khách trả hàng', 'Đơn treo, chưa giao được', 'Treo công nợ quá hạn', 'Đơn lỗi (sai hàng, sai giá, sai số lượng)'];

function dsNhanVienTatCa(token) {
  auth_(token);
  return rows_(SH.NV).filter(function (r) { return String(r.MaNV).trim() && String(r.TrangThai).trim() !== 'Nghỉ việc' && String(r.TrangThai).trim() !== 'Tài khoản phụ'; })
    .map(function (r) { return { ma: String(r.MaNV), ten: r.HoTen, phong: r.PhongBan }; });
}

function xemDH_(nv, r) {
  const vt = String(nv.VaiTro).trim();
  if (vt === 'GD' || vt === 'HCNS' || vt === 'KT') return true;
  if (String(r.MaNV) === String(nv.MaNV) || norm_(r.GmailNguoiLap) === norm_(nv.Gmail)) return true;
  if (vt === 'TP') {
    const tg = rows_(SH.NV).find(function (x) { return String(x.MaNV) === String(r.MaNV); });
    return !!tg && (norm_(tg.GmailDuyet) === norm_(nv.Gmail) || norm_(tg.PhongBan) === norm_(nv.PhongBan));
  }
  return false;
}

function lapDonHangLoi(token, f) {
  const nv = auth_(token);
  f = f || {};
  if (LOAI_DH.indexOf(f.loai) < 0) throw new Error('Chọn loại.');
  const soDon = String(f.soDon || '').trim().slice(0, 100);
  if (!soDon) throw new Error('Nhập số đơn hàng hoặc số hóa đơn.');
  const target = rows_(SH.NV).find(function (r) { return String(r.MaNV) === String(f.ma); });
  if (!target) throw new Error('Chọn nhân viên phụ trách đơn.');
  const giaTri = Math.round(Number(f.giaTri || 0));
  if (!(giaTri >= 0)) throw new Error('Giá trị đơn không hợp lệ.');
  const nguyenNhan = String(f.nguyenNhan || '').trim().slice(0, 2000);
  if (!nguyenNhan) throw new Error('Ghi nguyên nhân.');
  const now = new Date();
  const thang = /^\d{4}-\d{2}$/.test(String(f.thang || '')) ? f.thang : ymd_(now).slice(0, 7);
  const ma = 'DH' + Utilities.formatDate(now, TZ, 'yyMMddHHmmss') + Math.floor(Math.random() * 90 + 10);
  let tep = '';
  if (f.file && f.file.data) tep = luuTep_('DONHANG_FOLDER', 'HỆ THỐNG CHẤM CÔNG - ĐƠN HÀNG BỊ TRẢ, TREO, LỖI', f.file, ma + ' - ' + soDon.replace(/[\/\\]/g, '-')).getId();
  append_(SH.DH, { MaDH: ma, ThoiGian: now, Thang: thang, SoDonHang: soDon, KhachHang: String(f.khachHang || '').trim().slice(0, 200), Loai: f.loai,
    GiaTri: giaTri, MaNV: target.MaNV, HoTen: target.HoTen, PhongBan: target.PhongBan, NguyenNhan: nguyenNhan,
    LoiCuaBoPhan: String(f.loiCua || '').trim().slice(0, 100), HuongXuLy: String(f.huongXuLy || '').trim().slice(0, 1000),
    TrangThai: 'Đang xử lý', TepDinhKem: tep, NguoiLap: nv.HoTen, GmailNguoiLap: nv.Gmail });
  log_(nv.Gmail, 'Ghi đơn hàng ' + f.loai, ma + ' ' + soDon);
  return { ok: true, ma: ma };
}

function dsDonHangLoi(token, thang) {
  const nv = auth_(token);
  thang = String(thang || '');
  const ds = rows_(SH.DH).filter(function (r) { return thangCua_(r.Thang) === thang && xemDH_(nv, r); });
  const tong = {};
  ds.forEach(function (r) {
    const k = String(r.HoTen);
    tong[k] = tong[k] || { ten: k, so: 0, giaTri: 0, dangXuLy: 0 };
    tong[k].so++; tong[k].giaTri += Number(r.GiaTri || 0);
    if (r.TrangThai !== 'Đã xử lý') tong[k].dangXuLy++;
  });
  const vt = String(nv.VaiTro).trim();
  return {
    quanLy: ['GD', 'HCNS', 'KT', 'TP'].indexOf(vt) >= 0,
    tongHop: Object.keys(tong).map(function (k) { return tong[k]; }).sort(function (a, b) { return b.giaTri - a.giaTri; }),
    ds: ds.slice().reverse().map(function (r) {
      return { ma: String(r.MaDH), gio: fmtDT_(r.ThoiGian), soDon: String(r.SoDonHang), khach: String(r.KhachHang || ''), loai: r.Loai, giaTri: Number(r.GiaTri || 0),
        ten: r.HoTen, phong: r.PhongBan, nguyenNhan: String(r.NguyenNhan), loiCua: String(r.LoiCuaBoPhan || ''), huong: String(r.HuongXuLy || ''),
        trangThai: r.TrangThai, tep: String(r.TepDinhKem || ''), nguoiLap: r.NguoiLap, capNhat: r.NguoiCapNhat ? r.NguoiCapNhat + ', ' + fmtDT_(r.ThoiGianCapNhat) : '' };
    })
  };
}

function capNhatDonHangLoi(token, ma, trangThai, huong) {
  const nv = auth_(token);
  const r = rows_(SH.DH).find(function (x) { return String(x.MaDH) === String(ma); });
  if (!r) throw new Error('Không tìm thấy đơn.');
  const vt = String(nv.VaiTro).trim();
  if (!(['GD', 'HCNS', 'KT', 'TP'].indexOf(vt) >= 0 && xemDH_(nv, r)) && norm_(r.GmailNguoiLap) !== norm_(nv.Gmail)) throw new Error('Bạn không có quyền cập nhật đơn này.');
  if (['Đang xử lý', 'Đã xử lý'].indexOf(trangThai) < 0) throw new Error('Trạng thái không hợp lệ.');
  setCell_(SH.DH, r._row, 'TrangThai', trangThai);
  if (String(huong || '').trim()) setCell_(SH.DH, r._row, 'HuongXuLy', String(huong).trim().slice(0, 1000));
  setCell_(SH.DH, r._row, 'NguoiCapNhat', nv.HoTen);
  setCell_(SH.DH, r._row, 'ThoiGianCapNhat', new Date());
  log_(nv.Gmail, 'Cập nhật đơn hàng lỗi', ma + ' ' + trangThai);
  return { ok: true };
}

/* ================= HỒ SƠ TÀI KHOẢN, LỊCH SỬ ================= */

function hoSo_(nv, t, today) {
  try {
    const gd = dsGmail_(nv.GmailDuyet)[0] || norm_(t.GmailGiamDoc);
    const ql = rows_(SH.NV).find(function (r) { return norm_(r.Gmail) === gd; });
    let tn = '';
    if (nv.NgayVaoLam) {
      const a = ymd_(nv.NgayVaoLam).split('-').map(Number), b = today.split('-').map(Number);
      const th = (b[0] - a[0]) * 12 + (b[1] - a[1]) - (b[2] < a[2] ? 1 : 0);
      if (th >= 0) tn = (th >= 12 ? Math.floor(th / 12) + ' năm ' : '') + (th % 12) + ' tháng';
    }
    const ct = String(nv.CongTy || '').trim().toUpperCase();
    return {
      ngayVao: nv.NgayVaoLam ? ymdToVN_(ymd_(nv.NgayVaoLam)) : '', thamNien: tn, thuViec: String(nv.ThuViec || '').trim() === 'Có',
      congTy: ct === 'BB' ? 'Công ty TNHH Bao Báp Việt Nam' : ct === 'CAP' ? 'Công ty CP SX Dây Cáp Thép Việt Nam' : '',
      quanLy: ql && norm_(ql.Gmail) !== norm_(nv.Gmail) ? ql.HoTen + (ql.ChucVu ? ' · ' + ql.ChucVu : '') : '',
      diemCC: String(nv.DiemChamCong || '') || 'Tất cả văn phòng', bac: String(nv.Bac || ''), khoi: khoi_(nv) === 'KHO' ? 'Kho' : 'Văn phòng',
      ngaySinh: nv.NgaySinh ? ymdToVN_(ymd_(nv.NgaySinh)) : ''
    };
  } catch (e) { return {}; }
}

function deNghiCapNhat(token, noiDung) {
  const nv = auth_(token);
  noiDung = String(noiDung || '').trim().slice(0, 2000);
  if (!noiDung) throw new Error('Ghi nội dung cần cập nhật.');
  const tsH = ts_();
  const hcns = norm_(tsH.GmailHCNS) || norm_(tsH.GmailGiamDoc);
  const now = new Date(), today = ymd_(now);
  const ma = 'CN' + Utilities.formatDate(now, TZ, 'yyMMddHHmmss') + Math.floor(Math.random() * 90 + 10);
  append_(SH.DON, { MaDon: ma, NgayTao: now, MaNV: nv.MaNV, HoTen: nv.HoTen, PhongBan: nv.PhongBan, LoaiDon: 'Cập nhật hồ sơ',
    TuNgay: today, DenNgay: today, SoNgay: 0, SoGio: 0, LyDo: noiDung, GmailDuyet: hcns, TrangThai: 'Chờ duyệt' });
  log_(nv.Gmail, 'Đề nghị cập nhật hồ sơ', ma);
  return { ok: true };
}

function lichSu(token, loai, thang, ma) {
  const nv = auth_(token);
  thang = String(thang || '');
  if (!/^\d{4}-\d{2}$/.test(thang)) throw new Error('Chọn tháng.');
  const vt = String(nv.VaiTro).trim(), toanBo = vt === 'GD' || vt === 'HCNS' || vt === 'KT';
  const nvMap = {};
  rows_(SH.NV).forEach(function (r) { nvMap[String(r.MaNV)] = r; });
  const duocXem = function (maNV) {
    if (String(maNV) === String(nv.MaNV) || toanBo) return true;
    const tg = nvMap[String(maNV)];
    return vt === 'TP' && !!tg && quyenVoiNV_(nv, tg);
  };
  const loc = function (maNV) { return (!ma || ma === '*' || String(maNV) === String(ma)) && duocXem(maNV); };
  let out = [];
  if (loai === 'chamcong') {
    const m = {};
    rows_(SH.CC).forEach(function (r) {
      const d = ymd_(r.ThoiGian);
      if (d.slice(0, 7) !== thang || !loc(r.MaNV)) return;
      const k = r.MaNV + '|' + d;
      (m[k] = m[k] || { ten: r.HoTen, phong: r.PhongBan, ngay: d, rs: [] }).rs.push(r);
    });
    out = Object.keys(m).map(function (k) {
      const x = m[k];
      const vao = x.rs.find(function (r) { return r.Loai === 'VAO'; });
      const ras = x.rs.filter(function (r) { return r.Loai === 'RA'; });
      const ra = ras.length ? ras[ras.length - 1] : null;
      const tre = vao ? Number(vao.DiTre_phut || 0) : 0, som = ra ? Number(ra.VeSom_phut || 0) : 0;
      return { iso: x.ngay, ngay: ymdToVN_(x.ngay), ten: x.ten, phong: x.phong,
        tieuDe: 'Vào ' + (vao ? fmtT_(vao.ThoiGian) : '--:--') + ' · Ra ' + (ra ? fmtT_(ra.ThoiGian) : '--:--'),
        chiTiet: (tre ? 'Trễ ' + tre + ' phút. ' : '') + (som ? 'Về sớm ' + som + ' phút. ' : '') + (vao ? String(vao.Diem || '') : ''),
        trangThai: tre ? 'Đi trễ' : (!ra ? 'Thiếu giờ ra' : (som ? 'Về sớm' : 'Đủ')),
        anhVao: vao ? String(vao.AnhID || '') : '', anhRa: ra ? String(ra.AnhID || '') : '' };
    }).sort(function (a, b) { return b.iso.localeCompare(a.iso) || String(a.ten).localeCompare(String(b.ten)); });
  } else if (loai === 'tangca' || loai === 'don' || loai === 'kpi') {
    rows_(SH.DON).filter(function (d) {
      const ok = loai === 'tangca' ? d.LoaiDon === 'Tăng ca' : loai === 'kpi' ? d.LoaiDon === 'Đánh giá KPI' : (d.LoaiDon !== 'Tăng ca' && d.LoaiDon !== 'Đánh giá KPI');
      const th = loai === 'kpi' ? thangCua_(d.ThangKPI) : ymd_(d.NgayTao).slice(0, 7);
      return ok && th === thang && loc(d.MaNV);
    }).reverse().forEach(function (d) {
      const v = donView_(d);
      let mt = '';
      if (v.loai === 'Tăng ca') mt = v.tu + ', ' + v.soGio + ' giờ';
      else if (v.loai === 'Tạm ứng lương') mt = fmtTien_(v.soTien) + ' đồng';
      else if (v.loai === 'Đánh giá KPI') mt = 'tự chấm ' + v.diemTu + (v.diemDuyet !== '' ? ', duyệt ' + v.diemDuyet : '') + ' điểm';
      else if (v.loai !== 'Trình duyệt' && v.loai !== 'Cập nhật hồ sơ') mt = (v.tu === v.den ? v.tu : v.tu + ' – ' + v.den) + ', ' + v.soNgay + ' ngày';
      out.push({ ngay: v.ngayTao, ten: v.ten, phong: v.phong, tieuDe: v.loai + (mt ? ' · ' + mt : ''), chiTiet: String(v.lyDo || ''),
        trangThai: v.trangThai, ghiChu: v.nguoiDuyet ? 'Duyệt: ' + v.nguoiDuyet + (v.ghiChu ? ' · ' + v.ghiChu : '') : '', tep: v.tep ? v.ma : '' });
    });
    if (loai === 'kpi') rows_(SH.GV).filter(function (r) { return thangCua_(r.Thang) === thang && loc(r.MaNV); }).reverse().forEach(function (r) {
      out.push({ ngay: fmtDT_(r.ThoiGian), ten: r.HoTen, phong: r.PhongBan, tieuDe: 'Giao việc tháng', chiTiet: String(r.NoiDung), trangThai: '',
        ghiChu: 'Người giao: ' + r.NguoiGiao, tep: r.TepDinhKem ? String(r.MaGV) : '' });
    });
  } else if (loai === 'vipham') {
    rows_(SH.VP).filter(function (r) { return fmtD_(r.ThoiGian).slice(3) === thang.slice(5) + '/' + thang.slice(0, 4) && loc(r.MaNV); }).reverse().forEach(function (r) {
      out.push({ ngay: fmtDT_(r.ThoiGian), ten: r.HoTen, phong: r.PhongBan, tieuDe: r.Loai, chiTiet: String(r.NoiDung), trangThai: '', ghiChu: 'Người lập: ' + r.NguoiLap, tep: r.TepDinhKem ? String(r.MaVP) : '' });
    });
  } else if (loai === 'solieu') {
    rows_(SH.SL).filter(function (r) { return thangCua_(r.Thang) === thang && loc(r.MaNV); }).reverse().forEach(function (r) {
      const gt = typeof r.GiaTri === 'number' && r.Loai !== 'Điểm KPI' ? fmtTien_(r.GiaTri) + ' đ' : String(r.GiaTri) + (r.Loai === 'Điểm KPI' ? ' điểm' : '');
      out.push({ ngay: fmtDT_(r.ThoiGian), ten: r.HoTen, phong: '', tieuDe: r.Loai + ' · ' + gt, chiTiet: String(r.GhiChu || ''), trangThai: '', ghiChu: 'Người nhập: ' + r.NguoiNhap, tep: r.TepDinhKem ? String(r.MaSL) : '' });
    });
  } else if (loai === 'donhang') {
    rows_(SH.DH).filter(function (r) { return thangCua_(r.Thang) === thang && (loc(r.MaNV) || norm_(r.GmailNguoiLap) === norm_(nv.Gmail)); }).reverse().forEach(function (r) {
      out.push({ ngay: fmtDT_(r.ThoiGian), ten: r.HoTen, phong: r.PhongBan, tieuDe: r.SoDonHang + ' · ' + r.Loai + ' · ' + fmtTien_(r.GiaTri) + ' đ', chiTiet: String(r.NguyenNhan), trangThai: r.TrangThai, ghiChu: r.HuongXuLy ? 'Xử lý: ' + r.HuongXuLy : '', tep: r.TepDinhKem ? String(r.MaDH) : '' });
    });
  }
  return out.slice(0, 300);
}

/* ================= HỢP ĐỒNG LAO ĐỘNG ================= */

const LOAI_HD = ['Hợp đồng thử việc', 'Hợp đồng lao động xác định thời hạn', 'Hợp đồng lao động không xác định thời hạn', 'Phụ lục hợp đồng', 'Hợp đồng cộng tác viên, dịch vụ', 'Thỏa thuận bảo mật, cam kết'];

function hdView_(r, today) {
  const den = r.DenNgay ? ymd_(r.DenNgay) : '';
  const con = den ? Math.round((utc_(den) - utc_(today)) / 864e5) : null;
  const tt = r.LoaiHD === 'Phụ lục hợp đồng' || r.LoaiHD === 'Thỏa thuận bảo mật, cam kết' ? 'Kèm theo'
    : !den ? 'Không thời hạn' : con < 0 ? 'Đã hết hạn' : con <= 30 ? 'Sắp hết hạn' : 'Đang hiệu lực';
  return { ma: String(r.MaHD), loai: String(r.LoaiHD), so: String(r.SoHD || ''), ngayKy: r.NgayKy ? ymdToVN_(ymd_(r.NgayKy)) : '',
    tu: r.TuNgay ? ymdToVN_(ymd_(r.TuNgay)) : '', den: den ? ymdToVN_(den) : '', con: con, trangThai: tt, ghiChu: String(r.GhiChu || ''),
    tep: !!r.TepDinhKem, nguoiNap: String(r.NguoiNap || '') };
}

function hopDongCua_(maNV, today) {
  try { return rows_(SH.HD).filter(function (r) { return String(r.MaNV) === String(maNV); }).reverse().map(function (r) { return hdView_(r, today); }); }
  catch (e) { return []; }
}

function napHopDong(token, f) {
  const nv = auth_(token), vt = String(nv.VaiTro).trim();
  if (vt !== 'GD' && vt !== 'HCNS') throw new Error('Chỉ Giám đốc và HCNS được nạp hợp đồng.');
  f = f || {};
  const tg = rows_(SH.NV).find(function (r) { return String(r.MaNV) === String(f.ma); });
  if (!tg) throw new Error('Không tìm thấy nhân viên.');
  if (LOAI_HD.indexOf(f.loai) < 0) throw new Error('Chọn loại hợp đồng.');
  const ngay = function (v) { return /^\d{4}-\d{2}-\d{2}$/.test(String(v || '')) ? String(v) : ''; };
  const tu = ngay(f.tuNgay), den = ngay(f.denNgay);
  if (!tu) throw new Error('Nhập ngày bắt đầu hiệu lực.');
  if (den && den < tu) throw new Error('Ngày kết thúc phải sau ngày bắt đầu.');
  if ((f.loai === 'Hợp đồng thử việc' || f.loai === 'Hợp đồng lao động xác định thời hạn') && !den) throw new Error('Loại hợp đồng này phải có ngày kết thúc.');
  if (!f.file || !f.file.data) throw new Error('Nạp file hợp đồng đã ký.');
  const now = new Date();
  const ma = 'HD' + Utilities.formatDate(now, TZ, 'yyMMddHHmmss') + Math.floor(Math.random() * 90 + 10);
  const file = luuTep_('HOPDONG_FOLDER', 'HỆ THỐNG CHẤM CÔNG - HỢP ĐỒNG LAO ĐỘNG', f.file, ma + ' - ' + tg.HoTen + ' - ' + f.loai);
  const sh = sh_(SH.HD), h = header_(SH.HD);
  ['NgayKy', 'TuNgay', 'DenNgay'].forEach(function (k) { const c = h.indexOf(k); if (c >= 0) sh.getRange(1, c + 1, 2000, 1).setNumberFormat('@'); });
  append_(SH.HD, { MaHD: ma, MaNV: tg.MaNV, HoTen: tg.HoTen, LoaiHD: f.loai, SoHD: String(f.soHD || '').trim().slice(0, 60), NgayKy: ngay(f.ngayKy),
    TuNgay: tu, DenNgay: den, TepDinhKem: file.getId(), GhiChu: String(f.ghiChu || '').trim().slice(0, 300), NguoiNap: nv.HoTen, ThoiGian: now });
  if (f.loai === 'Hợp đồng thử việc') {
    setCell_(SH.NV, tg._row, 'ThuViec', 'Có');
    if (!tg.NgayVaoLam) setCell_(SH.NV, tg._row, 'NgayVaoLam', tu);
  } else if (f.loai.indexOf('Hợp đồng lao động') === 0) {
    setCell_(SH.NV, tg._row, 'ThuViec', '');
    if (!tg.NgayVaoLam) setCell_(SH.NV, tg._row, 'NgayVaoLam', tu);
  }
  log_(nv.Gmail, 'Nạp hợp đồng', ma + ' ' + tg.HoTen + ' ' + f.loai);
  return { ok: true };
}

/* ================= DUYỆT CHI LƯƠNG 2 CẤP THEO CÔNG TY ================= */

function ttDuyetBL_(thang, cty) {
  try { return JSON.parse(PropertiesService.getScriptProperties().getProperty('BLD_' + thang + '_' + cty) || '') || { buoc: 0, lichSu: [] }; }
  catch (e) { return { buoc: 0, lichSu: [] }; }
}

function moTaDuyetBL_(thang, cty) {
  const s = ttDuyetBL_(thang, cty);
  return s.buoc >= 2 ? 'Đã duyệt, lập lệnh chi' : s.buoc === 1 ? 'Chờ kế toán duyệt' : s.trinh ? 'Chờ giám đốc duyệt' : 'Chưa trình duyệt';
}

function bangLuongCty_(thang, cty) {
  const sh = ss_().getSheetByName('BL ' + thang);
  if (!sh) return null;
  const v = sh.getDataRange().getValues(), h = v[0].map(String);
  const iTen = h.indexOf('Họ tên'), iTL = h.indexOf('THỰC LĨNH'), iTN = h.indexOf('TỔNG THU NHẬP'), iCty = h.indexOf('Công ty');
  const nvMap = {};
  rows_(SH.NV).forEach(function (r) { nvMap[String(r.MaNV)] = r; });
  const ds = [];
  v.slice(1).forEach(function (r) {
    if (!String(r[0]).trim() || String(r[1]) === 'TỔNG CỘNG' || String(r[iTen]) === 'TỔNG CỘNG') return;
    const c = iCty >= 0 && /^(BB|CAP)$/.test(String(r[iCty])) ? String(r[iCty]) : ctyCua_(nvMap[String(r[0])]);
    if (c !== cty) return;
    ds.push({ ten: String(r[iTen]), tongTN: Number(r[iTN]) || 0, thucLinh: Number(r[iTL]) || 0 });
  });
  return ds;
}

function choDuyetLuong_(nv) {
  try {
    const t = ts_(), g = norm_(nv.Gmail), out = [];
    ss_().getSheets().map(function (s) { return s.getName(); }).filter(function (n) { return /^BL \d{4}-\d{2}$/.test(n); }).sort().reverse().slice(0, 3)
      .forEach(function (n) {
        const th = n.slice(3);
        ['BB', 'CAP'].forEach(function (c) {
          const st = ttDuyetBL_(th, c);
          if (st.buoc >= 2) return;
          if (!st.trinh && st.buoc < 1) return;
          if (dsGmail_(t['DuyetLuong' + c + (st.buoc + 1)]).indexOf(g) < 0) return;
          const ds = bangLuongCty_(th, c) || [];
          if (!ds.length) return;
          out.push({ thang: th, cty: c, tenCty: TEN_CTY[c], buoc: st.buoc + 1, soNguoi: ds.length,
            tong: ds.reduce(function (s, x) { return s + x.thucLinh; }, 0) });
        });
      });
    return out;
  } catch (e) { return []; }
}

function tomTatBangLuong(token, thang, cty) {
  const nv = auth_(token), t = ts_();
  const coQuyen = quyenLuong_(nv) || [1, 2].some(function (b) { return dsGmail_(t['DuyetLuong' + cty + b]).indexOf(norm_(nv.Gmail)) >= 0; });
  if (!coQuyen) throw new Error('Bạn không có quyền xem bảng lương này.');
  const ds = bangLuongCty_(thang, cty);
  if (!ds) throw new Error('Chưa có bảng lương tháng này.');
  return { thang: thang, cty: cty, tenCty: TEN_CTY[cty], ds: ds, trangThai: moTaDuyetBL_(thang, cty), lichSu: ttDuyetBL_(thang, cty).lichSu };
}

function trinhDuyetLuong(token, thang, cty) {
  const nv = auth_(token), t = ts_();
  if (!quyenLuong_(nv)) throw new Error('Chỉ HCNS, kế toán được trình duyệt bảng lương.');
  if (!/^\d{4}-\d{2}$/.test(String(thang)) || !TEN_CTY[cty]) throw new Error('Thiếu tháng hoặc công ty.');
  const ds = bangLuongCty_(thang, cty);
  if (!ds || !ds.length) throw new Error('Bảng lương tháng này chưa có người của công ty này.');
  const st = ttDuyetBL_(thang, cty);
  if (st.trinh || st.buoc >= 1) throw new Error('Bảng lương này đã trình duyệt rồi.');
  st.trinh = true;
  st.lichSu = (st.lichSu || []).concat(['HCNS trình duyệt: ' + nv.HoTen + ', ' + fmtDT_(new Date())]);
  PropertiesService.getScriptProperties().setProperty('BLD_' + thang + '_' + cty, JSON.stringify(st));
  log_(nv.Gmail, 'Trình duyệt bảng lương', thang + ' ' + cty);
  try { MailApp.sendEmail({ to: dsGmail_(t['DuyetLuong' + cty + '1']).join(','), subject: 'Bảng lương ' + thang + ' chờ Giám đốc duyệt - ' + TEN_CTY[cty], htmlBody: '<p>HCNS đã trình bảng lương tháng ' + thang + ' (' + ds.length + ' người). Mời Giám đốc mở app để xem và duyệt.</p>' }); } catch (e) {}
  return { ok: true };
}

function duyetBangLuong(token, thang, cty, pin, ghiChu) {
  const nv = auth_(token), t = ts_();
  checkPin_(nv, pin);
  if (!/^\d{4}-\d{2}$/.test(String(thang)) || !TEN_CTY[cty]) throw new Error('Thiếu tháng hoặc công ty.');
  if (!ss_().getSheetByName('BL ' + thang)) throw new Error('Chưa có bảng lương tháng này.');
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const st = ttDuyetBL_(thang, cty);
    if (st.buoc >= 2) throw new Error('Bảng lương công ty này đã duyệt xong.');
    if (!st.trinh && st.buoc < 1) throw new Error('HCNS chưa trình duyệt bảng lương này.');
    const buoc = st.buoc + 1;
    if (dsGmail_(t['DuyetLuong' + cty + buoc]).indexOf(norm_(nv.Gmail)) < 0) throw new Error(buoc === 1 ? 'Bước này chờ Giám đốc duyệt.' : 'Bước này chờ kế toán duyệt và lập lệnh chi.');
    st.buoc = buoc;
    st.lichSu = (st.lichSu || []).concat([(buoc === 1 ? 'Giám đốc duyệt: ' : 'Kế toán duyệt, lập lệnh chi: ') + nv.HoTen + ', ' + fmtDT_(new Date()) + (ghiChu ? ' – ' + String(ghiChu).slice(0, 200) : '')]);
    const p = PropertiesService.getScriptProperties();
    p.setProperty('BLD_' + thang + '_' + cty, JSON.stringify(st));
    if (buoc === 2) p.setProperty('BL_' + thang + '_' + cty, 'Đã công bố');
    log_(nv.Gmail, 'Duyệt chi lương bước ' + buoc, thang + ' ' + cty);
    if (buoc === 1) { try { MailApp.sendEmail({ to: dsGmail_(t['DuyetLuong' + cty + '2']).join(','), subject: 'Bảng lương ' + thang + ' chờ lập lệnh chi - ' + TEN_CTY[cty], htmlBody: '<p>' + esc_(nv.HoTen) + ' đã duyệt bảng lương tháng ' + thang + '. Mời kế toán duyệt và lập lệnh chi trên app.</p>' }); } catch (e) {} }
    return { ok: true, buoc: buoc };
  } finally { lock.releaseLock(); }
}

/* ================= BIÊN BẢN BÀN GIAO ================= */

function bgView_(r) {
  let nd = [];
  try { nd = JSON.parse(r.NoiDung || '[]'); } catch (e) {}
  return { maBG: String(r.MaBG), maDon: String(r.MaDon || ''), maNV: String(r.MaNV), ten: String(r.HoTen || ''), nguoiNhan: String(r.NguoiNhan || ''),
    ngay: r.NgayBanGiao ? ymd_(r.NgayBanGiao) : '', noiDung: nd, tep: !!r.TepDinhKem, trangThai: String(r.TrangThai || ''),
    nguoiLap: String(r.NguoiLap || ''), capNhat: fmtDT_(r.ThoiGian) };
}

function bgCua_(maNV) {
  try { return rows_(SH.BG).filter(function (r) { return String(r.MaNV) === String(maNV); }).map(bgView_); } catch (e) { return []; }
}

function luuBanGiao(token, f) {
  const nv = auth_(token), vt = String(nv.VaiTro).trim();
  f = f || {};
  let maNV = String(f.ma || nv.MaNV);
  if (f.maDon) {
    const d = rows_(SH.DON).find(function (x) { return x.MaDon === f.maDon; });
    if (!d) throw new Error('Không tìm thấy đơn.');
    maNV = String(d.MaNV);
  }
  const tg = rows_(SH.NV).find(function (r) { return String(r.MaNV) === maNV; });
  if (!tg) throw new Error('Không tìm thấy nhân viên.');
  if (vt !== 'GD' && vt !== 'HCNS' && String(nv.MaNV) !== maNV && !quyenVoiNV_(nv, tg)) throw new Error('Bạn không có quyền lập biên bản này.');
  const nd = (Array.isArray(f.noiDung) ? f.noiDung : []).slice(0, 30).map(function (x) {
    return { hm: String(x.hm || '').slice(0, 100), ct: String(x.ct || '').slice(0, 1500), tt: String(x.tt || '').slice(0, 200) };
  });
  const now = new Date();
  const r = f.maBG ? rows_(SH.BG).find(function (x) { return String(x.MaBG) === String(f.maBG); })
    : (f.maDon ? rows_(SH.BG).find(function (x) { return String(x.MaDon) === String(f.maDon); }) : null);
  const ma = r ? String(r.MaBG) : 'BG' + Utilities.formatDate(now, TZ, 'yyMMddHHmmss') + Math.floor(Math.random() * 90 + 10);
  const o = { NguoiNhan: String(f.nguoiNhan || '').slice(0, 150), NgayBanGiao: /^\d{4}-\d{2}-\d{2}$/.test(String(f.ngay || '')) ? f.ngay : '',
    NoiDung: JSON.stringify(nd), NguoiLap: nv.HoTen, ThoiGian: now };
  if (f.file && f.file.data) {
    o.TepDinhKem = luuTep_('BANGIAO_FOLDER', 'HỆ THỐNG CHẤM CÔNG - BIÊN BẢN BÀN GIAO', f.file, ma + ' - ' + tg.HoTen).getId();
    o.TrangThai = 'Đã ký, đã nạp';
  }
  const c = header_(SH.BG).indexOf('NgayBanGiao');
  if (c >= 0) sh_(SH.BG).getRange(1, c + 1, 2000, 1).setNumberFormat('@');
  if (r) Object.keys(o).forEach(function (k) { setCell_(SH.BG, r._row, k, o[k]); });
  else {
    o.MaBG = ma; o.MaDon = String(f.maDon || ''); o.MaNV = tg.MaNV; o.HoTen = tg.HoTen;
    if (!o.TrangThai) o.TrangThai = 'Bản nháp';
    append_(SH.BG, o);
  }
  log_(nv.Gmail, 'Lưu biên bản bàn giao', ma + ' ' + tg.HoTen + (o.TepDinhKem ? ' (đã nạp bản ký)' : ''));
  return { ok: true, maBG: ma };
}

/* ================= HỒ SƠ RIÊNG TỪNG NHÂN VIÊN ================= */

function hoSoNhanVien(token, ma) { return coMemo_(function () { return hoSoNhanVien_(token, ma); }); }
function hoSoNhanVien_(token, ma) {
  const nv = auth_(token), vt = String(nv.VaiTro).trim();
  if (vt !== 'GD' && vt !== 'HCNS' && String(nv.MaNV) !== String(ma)) throw new Error('Bạn không có quyền xem hồ sơ này.');
  const ds = rows_(SH.NV);
  const r = ds.find(function (x) { return String(x.MaNV) === String(ma); });
  if (!r) throw new Error('Không tìm thấy nhân viên.');
  const today = ymd_(new Date()), thang = today.slice(0, 7);
  const ql = ds.find(function (x) { return r.GmailDuyet && norm_(x.Gmail) === dsGmail_(r.GmailDuyet)[0]; });
  const dons = rows_(SH.DON);
  let cong = 0, tre = 0;
  rows_(SH.CC).forEach(function (c) {
    if (String(c.MaNV) === String(ma) && c.Loai === 'VAO' && ymd_(c.ThoiGian).slice(0, 7) === thang) { cong++; if (Number(c.DiTre_phut) > 0) tre++; }
  });
  let hs = [];
  try { hs = rows_(SH.HS).filter(function (x) { return String(x.MaNV) === String(ma); }).reverse().map(function (x) {
    return { ma: String(x.MaHS), loai: String(x.LoaiHS), ten: String(x.TenTep || ''), ghiChu: String(x.GhiChu || ''), nguoiNap: String(x.NguoiNap || ''), luc: fmtDT_(x.ThoiGian) };
  }); } catch (e) {}
  let vp = 0;
  try { vp = rows_(SH.VP).filter(function (x) { return String(x.MaNV) === String(ma); }).length; } catch (e) {}
  return {
    ma: String(r.MaNV), ten: r.HoTen, gmail: String(r.Gmail || ''), phong: String(r.PhongBan || ''), chucVu: String(r.ChucVu || ''), vaiTro: String(r.VaiTro || ''),
    gmailDuyet: String(r.GmailDuyet || ''), quanLy: ql ? ql.HoTen : '', bac: String(r.Bac || ''), ngayVao: r.NgayVaoLam ? ymd_(r.NgayVaoLam) : '',
    ngaySinh: r.NgaySinh ? ymd_(r.NgaySinh) : '', thuViec: String(r.ThuViec || '').trim() === 'Có', congTy: String(r.CongTy || ''), khoi: String(r.Khoi || ''),
    trangThai: String(r.TrangThai || ''), sdt: String(r.SoDienThoai || ''), anh: anhNho_(r.AnhDaiDien), congThang: cong, treThang: tre, phep: phepConLai_(r, dons, today),
    hoSo: hs, hopDong: hopDongCua_(ma, today), donGan: dons.filter(function (d) { return String(d.MaNV) === String(ma); }).slice(-10).reverse().map(donView_),
    moTa: moTaNV_(r),
    nhomKD: String(r.NhomKD || ''), hhQuy: String(r.HoaHongQuy || '') === 'Có',
    viPham: vp, banGiao: bgCua_(ma), taiSan: taiSanCua_(ma, vt === 'GD' || String(nv.MaNV) === String(ma)),
    dsBac: rows_(SH.BL).map(function (b) { return String(b.Bac); }).filter(String),
    dsQuanLy: ds.filter(function (x) { return x.Gmail && String(x.TrangThai).trim() !== 'Nghỉ việc' && ['GD', 'TP', 'HCNS', 'KT'].indexOf(String(x.VaiTro).trim()) >= 0; })
      .map(function (x) { return { ten: x.HoTen, gmail: norm_(x.Gmail) }; })
  };
}

function capNhatHoSoNV(token, ma, f) {
  const nv = auth_(token), vt = String(nv.VaiTro).trim();
  if (vt !== 'GD' && vt !== 'HCNS') throw new Error('Chỉ Giám đốc và HCNS được sửa hồ sơ.');
  const r = rows_(SH.NV).find(function (x) { return String(x.MaNV) === String(ma); });
  if (!r) throw new Error('Không tìm thấy nhân viên.');
  f = f || {};
  const ngay = function (v) { v = String(v || ''); if (v && !/^\d{4}-\d{2}-\d{2}$/.test(v)) throw new Error('Ngày không hợp lệ.'); return v; };
  const map = { phong: 'PhongBan', chucVu: 'ChucVu', ngaySinh: 'NgaySinh', ngayVao: 'NgayVaoLam', bac: 'Bac', thuViec: 'ThuViec', congTy: 'CongTy', gmailDuyet: 'GmailDuyet', trangThai: 'TrangThai', khoi: 'Khoi', sdt: 'SoDienThoai' };
  const v = {
    phong: String(f.phong || '').trim().slice(0, 100), chucVu: String(f.chucVu || '').trim().slice(0, 100), ngaySinh: ngay(f.ngaySinh), ngayVao: ngay(f.ngayVao),
    bac: String(f.bac || '').trim(), thuViec: f.thuViec ? 'Có' : '', congTy: f.congTy === 'CAP' ? 'CAP' : f.congTy === 'BB' ? 'BB' : '',
    gmailDuyet: dsGmail_(f.gmailDuyet).join(','), trangThai: ['Đang làm', 'Tạm nghỉ', 'Nghỉ việc', 'Tài khoản phụ'].indexOf(f.trangThai) >= 0 ? f.trangThai : 'Đang làm', khoi: f.khoi === 'KHO' ? 'KHO' : 'VP',
    sdt: String(f.sdt || '').replace(/[^0-9+ ]/g, '').trim().slice(0, 15)
  };
  if (v.bac && !rows_(SH.BL).some(function (b) { return String(b.Bac) === v.bac; })) throw new Error('Bậc lương không có trong bảng bậc.');
  const h = header_(SH.NV);
  ['NgaySinh', 'NgayVaoLam', 'Bac', 'ThuViec', 'CongTy', 'SoDienThoai'].forEach(function (k) { const c = h.indexOf(k); if (c >= 0) sh_(SH.NV).getRange(r._row, c + 1).setNumberFormat('@'); });
  const doi = [];
  Object.keys(map).forEach(function (k) {
    const cu = map[k] === 'NgaySinh' || map[k] === 'NgayVaoLam' ? (r[map[k]] ? ymd_(r[map[k]]) : '') : String(r[map[k]] === undefined ? '' : r[map[k]]);
    if (String(v[k]) !== cu) { setCell_(SH.NV, r._row, map[k], v[k]); doi.push(map[k] + ': ' + cu + ' → ' + v[k]); }
  });
  try { CacheService.getScriptCache().remove('BANGTIN'); } catch (e) {}
  log_(nv.Gmail, 'Sửa hồ sơ nhân viên', r.MaNV + ' ' + doi.join('; '));
  return { ok: true, soThayDoi: doi.length };
}

function napHoSo(token, f) {
  const nv = auth_(token), vt = String(nv.VaiTro).trim();
  f = f || {};
  const ma = String(f.ma || nv.MaNV);
  if (vt !== 'GD' && vt !== 'HCNS' && ma !== String(nv.MaNV)) throw new Error('Bạn không có quyền nạp hồ sơ cho người khác.');
  const r = rows_(SH.NV).find(function (x) { return String(x.MaNV) === ma; });
  if (!r) throw new Error('Không tìm thấy nhân viên.');
  const loai = String(f.loai || '').trim().slice(0, 80);
  if (!loai) throw new Error('Chọn loại hồ sơ.');
  if (!f.file || !f.file.data) throw new Error('Chọn file hồ sơ.');
  const now = new Date();
  const maHS = 'HS' + Utilities.formatDate(now, TZ, 'yyMMddHHmmss') + Math.floor(Math.random() * 90 + 10);
  const file = luuTep_('HOSO_FOLDER', 'HỆ THỐNG CHẤM CÔNG - HỒ SƠ NHÂN VIÊN', f.file, maHS + ' - ' + r.HoTen + ' - ' + loai);
  append_(SH.HS, { MaHS: maHS, MaNV: r.MaNV, HoTen: r.HoTen, LoaiHS: loai, TenTep: file.getName(), TepDinhKem: file.getId(),
    GhiChu: String(f.ghiChu || '').trim().slice(0, 300), NguoiNap: nv.HoTen, ThoiGian: now });
  log_(nv.Gmail, 'Nạp hồ sơ nhân viên', maHS + ' ' + r.HoTen + ' ' + loai);
  return { ok: true };
}

function themNhanVien(token, f) {
  const nv = auth_(token), vt = String(nv.VaiTro).trim();
  if (vt !== 'GD' && vt !== 'HCNS') throw new Error('Chỉ Giám đốc và HCNS được thêm nhân sự.');
  f = f || {};
  const ten = String(f.ten || '').trim().replace(/\s+/g, ' ').slice(0, 80);
  if (ten.split(' ').length < 2) throw new Error('Nhập đủ họ và tên.');
  const gmail = norm_(f.gmail);
  if (gmail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(gmail)) throw new Error('Gmail không hợp lệ.');
  const ds = rows_(SH.NV);
  if (gmail && ds.some(function (r) { return norm_(r.Gmail) === gmail; })) throw new Error('Gmail này đã có trong danh sách nhân viên.');
  const vaiTro = ['NV', 'TP', 'KT', 'HCNS', 'GD'].indexOf(f.vaiTro) >= 0 ? f.vaiTro : 'NV';
  if (vaiTro === 'GD' && vt !== 'GD') throw new Error('Chỉ Giám đốc được cấp vai trò Giám đốc.');
  const ngay = function (v) { v = String(v || ''); return /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : ''; };
  const now = new Date();
  let ma = String(f.ma || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!ma) ma = 'NV' + Utilities.formatDate(now, TZ, 'yyMMddHHmm');
  if (ds.some(function (r) { return String(r.MaNV).toUpperCase() === ma; })) ma = ma + Math.floor(Math.random() * 90 + 10);
  const h = header_(SH.NV);
  append_(SH.NV, { MaNV: ma, HoTen: ten, Gmail: gmail, PhongBan: String(f.phong || '').trim().slice(0, 100), ChucVu: String(f.chucVu || '').trim().slice(0, 100),
    VaiTro: vaiTro, GmailDuyet: norm_(f.gmailDuyet), DiemChamCong: '', PhepNam: '12', TrangThai: 'Đang làm', Khoi: f.khoi === 'KHO' ? 'KHO' : 'VP',
    NgayVaoLam: ngay(f.ngayVao), ThuViec: f.thuViec ? 'Có' : '', CongTy: f.congTy === 'BB' ? 'BB' : 'CAP', NgaySinh: ngay(f.ngaySinh), PhepTon: '0' });
  const r = rows_(SH.NV).find(function (x) { return String(x.MaNV) === ma; });
  if (r) ['MaNV', 'NgayVaoLam', 'NgaySinh', 'PhepTon', 'ThuViec', 'CongTy'].forEach(function (k) { const c = h.indexOf(k); if (c >= 0) sh_(SH.NV).getRange(r._row, c + 1).setNumberFormat('@'); });
  try { CacheService.getScriptCache().remove('BANGTIN'); } catch (e) {}
  log_(nv.Gmail, 'Thêm nhân sự', ma + ' ' + ten + ' ' + (f.phong || '') + ' ' + (f.chucVu || ''));
  return { ok: true, ma: ma };
}

/* ================= TÀI SẢN, CÔNG CỤ, TÀI KHOẢN ĐƯỢC CẤP ================= */

function hienBac_(nv, t) { return String(t.HienCoCauBac || '').trim() === 'Có' || quyenLuong_(nv); }
function anBac_(h, nv, t) { if (h && !hienBac_(nv, t)) h.bac = ''; return h; }

function taiSanCua_(maNV, xemMK) {
  try {
    return rows_(SH.TSAN).filter(function (r) { return String(r.MaNV) === String(maNV); }).map(function (r) {
      return { ma: String(r.MaTS), loai: String(r.Loai || ''), ten: String(r.Ten || ''), maSo: String(r.MaSo || ''), tenDN: String(r.TenDangNhap || ''),
        coMK: !!String(r.MatKhau || ''), mk: xemMK ? String(r.MatKhau || '') : '', ngayCap: r.NgayCap ? ymd_(r.NgayCap) : '',
        tinhTrang: String(r.TinhTrang || ''), ghiChu: String(r.GhiChu || ''), capNhat: r.CapNhat ? fmtDT_(r.CapNhat) : '', nguoi: String(r.NguoiCapNhat || '') };
    });
  } catch (e) { return []; }
}

function luuTaiSan(token, f, pin) {
  const nv = auth_(token), vt = String(nv.VaiTro).trim();
  checkPin_(nv, pin);
  f = f || {};
  const ma = String(f.ma || nv.MaNV);
  if (vt !== 'GD' && vt !== 'HCNS' && ma !== String(nv.MaNV)) throw new Error('Bạn chỉ cập nhật được tài sản của chính mình.');
  const tg = rows_(SH.NV).find(function (r) { return String(r.MaNV) === ma; });
  if (!tg) throw new Error('Không tìm thấy nhân viên.');
  const ten = String(f.ten || '').trim().slice(0, 150);
  if (!ten) throw new Error('Nhập tên tài sản hoặc tài khoản.');
  const tt = ['Đang dùng tốt', 'Hỏng, cần sửa', 'Mất', 'Đã thu hồi', 'Đã đổi mật khẩu'].indexOf(f.tinhTrang) >= 0 ? f.tinhTrang : 'Đang dùng tốt';
  const now = new Date();
  const moi = { Loai: String(f.loai || '').slice(0, 60), Ten: ten, MaSo: String(f.maSo || '').trim().slice(0, 80), TenDangNhap: String(f.tenDN || '').trim().slice(0, 120),
    NgayCap: /^\d{4}-\d{2}-\d{2}$/.test(String(f.ngayCap || '')) ? f.ngayCap : '', TinhTrang: tt, GhiChu: String(f.ghiChu || '').trim().slice(0, 300) };
  if (f.matKhau !== undefined && f.matKhau !== null && String(f.matKhau) !== '') moi.MatKhau = String(f.matKhau).slice(0, 200);
  const nhan = { Loai: 'loại', Ten: 'tên', MaSo: 'mã số', TenDangNhap: 'tên đăng nhập', NgayCap: 'ngày cấp', TinhTrang: 'tình trạng', GhiChu: 'ghi chú' };
  const r = f.maTS ? rows_(SH.TSAN).find(function (x) { return String(x.MaTS) === String(f.maTS); }) : null;
  if (f.maTS && !r) throw new Error('Không tìm thấy tài sản.');
  if (r && String(r.MaNV) !== ma) throw new Error('Tài sản không thuộc nhân viên này.');
  const c = header_(SH.TSAN).indexOf('NgayCap');
  if (c >= 0) sh_(SH.TSAN).getRange(1, c + 1, 2000, 1).setNumberFormat('@');
  let maTS, doi = [];
  if (r) {
    maTS = String(r.MaTS);
    Object.keys(nhan).forEach(function (k) {
      const cu = k === 'NgayCap' ? (r.NgayCap ? ymd_(r.NgayCap) : '') : String(r[k] === undefined ? '' : r[k]);
      if (String(moi[k]) !== cu) { setCell_(SH.TSAN, r._row, k, moi[k]); doi.push(nhan[k] + ': "' + cu + '" → "' + moi[k] + '"'); }
    });
    if (moi.MatKhau !== undefined && moi.MatKhau !== String(r.MatKhau || '')) { setCell_(SH.TSAN, r._row, 'MatKhau', moi.MatKhau); doi.push('đổi mật khẩu'); }
    if (!doi.length) return { ok: true, soThayDoi: 0 };
    setCell_(SH.TSAN, r._row, 'CapNhat', now); setCell_(SH.TSAN, r._row, 'NguoiCapNhat', nv.HoTen);
  } else {
    maTS = 'TS' + Utilities.formatDate(now, TZ, 'yyMMddHHmmss') + Math.floor(Math.random() * 90 + 10);
    const o = Object.assign({ MaTS: maTS, MaNV: tg.MaNV, HoTen: tg.HoTen, MatKhau: moi.MatKhau || '', CapNhat: now, NguoiCapNhat: nv.HoTen }, moi);
    append_(SH.TSAN, o);
    doi.push('cấp mới: ' + (moi.Loai ? moi.Loai + ' – ' : '') + ten + ', tình trạng ' + tt + (moi.MatKhau ? ', có mật khẩu' : ''));
  }
  append_(SH.TSLOG, { ThoiGian: now, MaTS: maTS, MaNV: tg.MaNV, HoTen: tg.HoTen, NguoiSua: nv.HoTen + ' (ký PIN)', NoiDung: doi.join('; ') });
  log_(nv.Gmail, 'Cập nhật tài sản, tài khoản', maTS + ' ' + tg.HoTen);
  return { ok: true, soThayDoi: doi.length };
}

function lichSuTaiSan(token, maTS) {
  const nv = auth_(token), vt = String(nv.VaiTro).trim();
  const r = rows_(SH.TSAN).find(function (x) { return String(x.MaTS) === String(maTS); });
  if (!r) throw new Error('Không tìm thấy tài sản.');
  if (vt !== 'GD' && vt !== 'HCNS' && String(r.MaNV) !== String(nv.MaNV)) throw new Error('Bạn không có quyền xem.');
  return rows_(SH.TSLOG).filter(function (x) { return String(x.MaTS) === String(maTS); }).reverse()
    .map(function (x) { return { luc: fmtDT_(x.ThoiGian), nguoi: String(x.NguoiSua || ''), noiDung: String(x.NoiDung || '') }; });
}

function quanTriCongTy(token) { return coMemo_(function () { return quanTriCongTy_(token); }); }
function quanTriCongTy_(token) {
  const nv = auth_(token), vt = String(nv.VaiTro).trim();
  if (vt !== 'GD' && vt !== 'HCNS') throw new Error('Chỉ Giám đốc và HCNS được xem trang quản trị.');
  const now = new Date(), today = ymd_(now), thang = today.slice(0, 7);
  const hn = tinhHomNay_(null, now);
  const ttMap = {};
  hn.list.forEach(function (x) { ttMap[x.ma] = x; });
  const hdMap = {};
  rows_(SH.HD).forEach(function (r) { const k = String(r.MaNV); (hdMap[k] = hdMap[k] || []).push(hdView_(r, today)); });
  const tre = {}, cong = {};
  rows_(SH.CC).forEach(function (r) {
    if (ymd_(r.ThoiGian).slice(0, 7) !== thang || r.Loai !== 'VAO') return;
    const k = String(r.MaNV);
    cong[k] = (cong[k] || 0) + 1;
    if (Number(r.DiTre_phut) > 0) tre[k] = (tre[k] || 0) + 1;
  });
  const ds = rows_(SH.NV).filter(function (r) {
    return String(r.MaNV).trim() && String(r.TrangThai).trim() !== 'Nghỉ việc' && String(r.MaNV) !== 'HCNS01' && String(r.TrangThai).trim() !== 'Tài khoản phụ';
  }).map(function (r) {
    const k = String(r.MaNV);
    return { ma: k, ten: r.HoTen, phong: String(r.PhongBan || ''), chucVu: String(r.ChucVu || ''), vaiTro: String(r.VaiTro || ''),
      gmail: String(r.Gmail || ''), bac: String(r.Bac || ''), ngayVao: r.NgayVaoLam ? ymdToVN_(ymd_(r.NgayVaoLam)) : '',
      thuViec: String(r.ThuViec || '').trim() === 'Có', congTy: String(r.CongTy || ''), khoi: khoi_(r),
      tt: ttMap[k] || null, treThang: tre[k] || 0, congThang: cong[k] || 0, hd: (hdMap[k] || []).reverse() };
  });
  const cho = rows_(SH.DON).filter(function (d) { return d.TrangThai === 'Chờ duyệt'; }).map(donView_).reverse();
  const nghiViec = rows_(SH.DON).filter(function (d) { return d.LoaiDon === 'Xin nghỉ việc' && (d.TrangThai === 'Chờ duyệt' || (d.TrangThai === 'Đã duyệt' && ymd_(d.TuNgay) >= ymd_(new Date(Date.now() - 30 * 864e5)))); }).map(donView_).reverse();
  let banGiao = [];
  try { banGiao = rows_(SH.BG).slice(-80).map(bgView_); } catch (e) {}
  return { ngay: hn.ngay, gio: hn.gio, chuNhat: hn.chuNhat, ds: ds, choDuyet: cho, nghiViec: nghiViec, banGiao: banGiao };
}

/* ================= SINH NHẬT, VINH DANH ================= */

function anhNho_(id) {
  if (!id) return '';
  try { return 'data:image/jpeg;base64,' + Utilities.base64Encode(DriveApp.getFileById(String(id)).getBlob().getBytes()); } catch (e) { return ''; }
}

function bangTin_(today) {
  const cache = CacheService.getScriptCache();
  try { const c = cache.get('BANGTIN'); if (c) { const o = JSON.parse(c); if (o.ngay === today) return o; } } catch (e) {}
  const ds = rows_(SH.NV).filter(function (r) { return String(r.MaNV).trim() && String(r.TrangThai).trim() !== 'Nghỉ việc' && String(r.MaNV) !== 'HCNS01' && String(r.TrangThai).trim() !== 'Tài khoản phụ'; });
  const t0 = utc_(today), nam = Number(today.slice(0, 4));
  const sinhNhat = [];
  ds.forEach(function (r) {
    if (!r.NgaySinh) return;
    const ns = ymd_(r.NgaySinh);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(ns)) return;
    let ngay = nam + ns.slice(4);
    let con = Math.round((utc_(ngay) - t0) / 864e5);
    if (con < 0) { ngay = (nam + 1) + ns.slice(4); con = Math.round((utc_(ngay) - t0) / 864e5); }
    if (con <= 30) sinhNhat.push({ ten: r.HoTen, phong: String(r.PhongBan || ''), ngay: ns.slice(8, 10) + '/' + ns.slice(5, 7), con: con, anhId: String(r.AnhDaiDien || '') });
  });
  sinhNhat.sort(function (a, b) { return a.con - b.con; });
  const p = today.split('-').map(Number), tt = p[1] === 1 ? (p[0] - 1) + '-12' : p[0] + '-' + String(p[1] - 1).padStart(2, '0');
  let vinh = rows_(SH.VD).filter(function (r) { return thangCua_(r.Thang) === tt; }).map(function (r) {
    const nv = ds.find(function (x) { return String(x.MaNV) === String(r.MaNV); }) || {};
    return { ten: r.HoTen, phong: String(r.PhongBan || ''), danhHieu: String(r.DanhHieu || ''), lyDo: String(r.LyDo || ''), anhId: String(nv.AnhDaiDien || '') };
  });
  if (!vinh.length) {
    const moi = {};
    rows_(SH.SL).forEach(function (r) { if (thangCua_(r.Thang) === tt && (r.Loai === 'Điểm KPI' || r.Loai === 'Doanh số thực thu')) moi[r.MaNV + '|' + r.Loai] = Number(r.GiaTri) || 0; });
    const nhom = [
      { re: /kinh doanh/i, loai: 'Doanh số thực thu', hieu: 'Best seller', min: 1 },
      { re: /vật tư|mua hàng/i, loai: 'Điểm KPI', hieu: 'Mua hàng giỏi nhất', min: 80 },
      { re: /kho/i, loai: 'Điểm KPI', hieu: 'Nhân viên kho xuất sắc', min: 80 },
      { re: /kế toán/i, loai: 'Điểm KPI', hieu: 'Kế toán xuất sắc', min: 80 },
      { re: /marketing/i, loai: 'Điểm KPI', hieu: 'Marketing xuất sắc', min: 80 }
    ];
    nhom.forEach(function (g) {
      let best = null;
      ds.forEach(function (r) {
        if (!g.re.test(String(r.PhongBan || ''))) return;
        const v = moi[r.MaNV + '|' + g.loai];
        if (v !== undefined && v >= g.min && (!best || v > best.v)) best = { r: r, v: v };
      });
      if (best) vinh.push({ ten: best.r.HoTen, phong: String(best.r.PhongBan || ''), danhHieu: g.hieu + ' ' + String(best.r.PhongBan || ''),
        lyDo: g.loai === 'Doanh số thực thu' ? 'Doanh số thực thu cao nhất phòng' : 'Điểm KPI ' + best.v, anhId: String(best.r.AnhDaiDien || '') });
    });
  }
  const anh = function (x) { x.anh = anhNho_(x.anhId); delete x.anhId; return x; };
  const out = { ngay: today, sinhNhat: sinhNhat.slice(0, 6).map(anh), vinhDanh: { thang: tt.slice(5) + '/' + tt.slice(0, 4), ds: vinh.slice(0, 6).map(anh) } };
  try { cache.put('BANGTIN', JSON.stringify(out), 1800); } catch (e) {}
  return out;
}

function datNgaySinh(token, ns) {
  const nv = auth_(token);
  ns = String(ns || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ns) || Number(ns.slice(0, 4)) < 1950 || Number(ns.slice(0, 4)) > 2012) throw new Error('Ngày sinh không hợp lệ.');
  if (nv.NgaySinh) throw new Error('Ngày sinh đã có. Muốn sửa, gửi đề nghị cập nhật hồ sơ cho HCNS.');
  const c = header_(SH.NV).indexOf('NgaySinh');
  if (c >= 0) sh_(SH.NV).getRange(nv._row, c + 1).setNumberFormat('@');
  setCell_(SH.NV, nv._row, 'NgaySinh', ns);
  try { CacheService.getScriptCache().remove('BANGTIN'); } catch (e) {}
  return { ok: true };
}

function luuVinhDanh(token, f) {
  const nv = auth_(token), vt = String(nv.VaiTro).trim();
  if (vt !== 'GD' && vt !== 'HCNS') throw new Error('Chỉ Giám đốc và HCNS được vinh danh.');
  f = f || {};
  if (!/^\d{4}-\d{2}$/.test(String(f.thang || ''))) throw new Error('Chọn tháng.');
  const tg = rows_(SH.NV).find(function (r) { return String(r.MaNV) === String(f.ma); });
  if (!tg) throw new Error('Chọn nhân viên.');
  const dh = String(f.danhHieu || '').trim().slice(0, 100);
  if (!dh) throw new Error('Nhập danh hiệu.');
  append_(SH.VD, { Thang: f.thang, MaNV: tg.MaNV, HoTen: tg.HoTen, PhongBan: tg.PhongBan, DanhHieu: dh, LyDo: String(f.lyDo || '').trim().slice(0, 300), NguoiLap: nv.HoTen, ThoiGian: new Date() });
  try { CacheService.getScriptCache().remove('BANGTIN'); } catch (e) {}
  log_(nv.Gmail, 'Vinh danh', f.thang + ' ' + tg.HoTen + ' ' + dh);
  return { ok: true };
}

function dsNhanVienQL(token) {
  const nv = auth_(token), vt = String(nv.VaiTro).trim();
  if (!quyenLuong_(nv) && vt !== 'TP') throw new Error('Bạn không có quyền nhập số liệu.');
  return rows_(SH.NV).filter(function (r) {
    if (!String(r.MaNV).trim() || String(r.TrangThai).trim() === 'Nghỉ việc') return false;
    if (quyenLuong_(nv)) return true;
    return String(r.MaNV) !== String(nv.MaNV) && (norm_(r.GmailDuyet) === norm_(nv.Gmail) || norm_(r.PhongBan) === norm_(nv.PhongBan));
  }).map(function (r) { return { ma: String(r.MaNV), ten: r.HoTen, phong: r.PhongBan, bac: String(r.Bac || ''), nhomKD: String(r.NhomKD || ''), hhQuy: String(r.HoaHongQuy || '') === 'Có' }; });
}

function nhapSoLieu(token, f) {
  const nv = auth_(token), vt = String(nv.VaiTro).trim();
  f = f || {};
  if (LOAI_SL.indexOf(f.loai) < 0) throw new Error('Chọn loại số liệu.');
  if (!/^\d{4}-\d{2}$/.test(String(f.thang || ''))) throw new Error('Chọn tháng.');
  if (trangThaiBL_(f.thang) === 'Đã công bố') throw new Error('Bảng lương tháng này đã công bố, không nhập thêm được.');
  const target = rows_(SH.NV).find(function (r) { return String(r.MaNV) === String(f.ma); });
  if (!target) throw new Error('Không tìm thấy nhân viên.');
  if (!quyenLuong_(nv)) {
    if (vt !== 'TP') throw new Error('Bạn không có quyền nhập số liệu.');
    if (f.loai !== 'Điểm KPI' && f.loai !== 'Đạt 4b') throw new Error('Trưởng phòng chỉ nhập Điểm KPI và Đạt 4b.');
    if (String(target.MaNV) === String(nv.MaNV)) throw new Error('Không tự chấm cho chính mình.');
    if (!(norm_(target.GmailDuyet) === norm_(nv.Gmail) || norm_(target.PhongBan) === norm_(nv.PhongBan))) throw new Error('Nhân viên này không thuộc phòng bạn.');
  }
  let gt;
  if (f.loai === 'Đạt 4b') gt = f.giaTri === 'Có' ? 'Có' : 'Không';
  else {
    gt = Number(f.giaTri);
    if (!(gt >= 0)) throw new Error('Giá trị không hợp lệ.');
    if (f.loai === 'Điểm KPI' && gt > 100) throw new Error('Điểm KPI tối đa 100.');
  }
  const maSL = 'SL' + Utilities.formatDate(new Date(), TZ, 'yyMMddHHmmss') + Math.floor(Math.random() * 90 + 10);
  let tepSL = '';
  if (f.file && f.file.data) tepSL = luuTep_('SOLIEU_FOLDER', 'HỆ THỐNG CHẤM CÔNG - CĂN CỨ KPI THƯỞNG', f.file, maSL + ' - ' + target.HoTen + ' - ' + f.loai).getId();
  append_(SH.SL, { Thang: f.thang, MaNV: target.MaNV, HoTen: target.HoTen, Loai: f.loai, GiaTri: gt,
    GhiChu: String(f.ghiChu || '').slice(0, 300), NguoiNhap: nv.HoTen, ThoiGian: new Date(), TepDinhKem: tepSL, MaSL: maSL });
  log_(nv.Gmail, 'Nhập số liệu tháng', f.thang + ' ' + target.MaNV + ' ' + f.loai + ' ' + gt);
  return { ok: true };
}

function lapBangLuong(token, thang) { return coMemo_(function () { return lapBangLuong_(token, thang); }); }
function lapBangLuong_(token, thang) {
  const nguoi = auth_(token);
  if (!quyenLuong_(nguoi)) throw new Error('Chỉ giám đốc, HCNS, kế toán được lập bảng lương.');
  if (!/^\d{4}-\d{2}$/.test(String(thang || ''))) throw new Error('Chọn tháng.');
  if (trangThaiBL_(thang) === 'Đã công bố') throw new Error('Bảng lương tháng này đã công bố, không lập lại được. Cần sửa thì sửa trực tiếp trong sheet.');
  const t = ts_(), le = ngayLe_(), bl = rows_(SH.BL);
  const sl = rows_(SH.SL).filter(function (r) { return thangCua_(r.Thang) === thang; });
  const ccAll = rows_(SH.CC).filter(function (r) { return ymd_(r.ThoiGian).slice(0, 7) === thang; });
  const dons = rows_(SH.DON);
  const nd = soNgayThang_(thang), lastDay = thang + '-' + String(nd).padStart(2, '0');
  const today = ymd_(new Date());
  const tyLeBH = Number(t.TyLeBHNLD || 10.5) / 100, lttv = Number(t.LuongToiThieuVung || 5310000), pcTN = Number(t.PhuCapThamNien || 100000);
  const nghiCoLuong = ['Nghỉ phép năm', 'Nghỉ đột xuất'];
  const dsNVAll = rows_(SH.NV), kdTu = String(t.KD_ApDungTu || '2026-11');
  const out = [], canhBao = [];
  let tong = 0;
  rows_(SH.NV).filter(function (r) { return String(r.MaNV).trim() && String(r.TrangThai).trim() !== 'Nghỉ việc'; }).forEach(function (nv) {
    const kdNhom = thang >= kdTu ? nhomKD_(nv) : null;
    const b = kdNhom ? { Bac: String(nv.NhomKD), Nhom: 'C', LuongCB: kdNhom.luong, AnTrua: kdNhom.pc, XangXe: 0, KPIToiDa: kdNhom.hq, CCToiDa: kdNhom.cc }
      : bl.find(function (x) { return String(x.Bac).trim().toUpperCase() === String(nv.Bac || '').trim().toUpperCase(); });
    if (!b) { canhBao.push(nv.HoTen + ': chưa nhập Bậc lương'); return; }
    const bac = String(b.Bac).trim().toUpperCase(), nhom = String(b.Nhom).trim().toUpperCase();
    const khoi = khoi_(nv), chuan = soNgayChuan_(thang, khoi, le);
    const tv = String(nv.ThuViec || '').trim() === 'Có', hs = tv ? 0.85 : 1;
    let tn = 0;
    if (nv.NgayVaoLam && !tv) {
      const yrs = Math.floor((utc_(lastDay) - utc_(ymd_(nv.NgayVaoLam))) / (365.25 * 864e5));
      tn = Math.min(Math.max(yrs, 0), 20) * pcTN;
    }
    const lcbHD = tv ? Math.max(Number(b.LuongCB) * 0.85, lttv) : Number(b.LuongCB) + tn;
    const mine = ccAll.filter(function (r) { return String(r.MaNV) === String(nv.MaNV); });
    const daLam = {};
    mine.forEach(function (r) { if (r.Loai === 'VAO') daLam[ymd_(r.ThoiGian)] = 1; });
    const donNV = dons.filter(function (d) { return String(d.MaNV) === String(nv.MaNV) && d.TrangThai === 'Đã duyệt'; });
    let ngayTT = 0, ngayTL = 0;
    for (let d = 1; d <= nd; d++) {
      const iso = thang + '-' + String(d).padStart(2, '0');
      if (le[iso]) continue;
      const h = heSoNgay_(iso, khoi);
      if (!h) continue;
      if (daLam[iso]) { ngayTT += h; ngayTL += h; continue; }
      const don = donNV.find(function (x) { return nghiCoLuong.indexOf(x.LoaiDon) >= 0 && ymd_(x.TuNgay) <= iso && ymd_(x.DenNgay) >= iso; });
      if (don) ngayTL += don.NuaNgay === 'Có' ? h * 0.5 : h;
    }
    const slNV = sl.filter(function (r) { return String(r.MaNV) === String(nv.MaNV); });
    const slLast = function (loai) { const a = slNV.filter(function (r) { return r.Loai === loai; }); return a.length ? a[a.length - 1].GiaTri : ''; };
    const slSum = function (loai) { return slNV.filter(function (r) { return r.Loai === loai; }).reduce(function (s, r) { return s + Number(r.GiaTri || 0); }, 0); };
    const r2 = Math.round(lcbHD / chuan * ngayTL);
    const r3a = Math.round(Number(b.AnTrua) * hs / chuan * ngayTT);
    const r3b = nhom === 'C' ? 0 : Math.round(Number(b.XangXe) * hs / chuan * ngayTT);
    const cc = chuyenCan_(nv, mine, thang, today);
    const r5 = Math.round(Number(b.CCToiDa) * hs * cc.tyLe / 100);
    const r5b = (cc.diem === 0 && ngayTT > 0) ? Math.round(Number(b.CCToiDa) * hs * 0.4) : 0;
    const ghi = ['Chuyên cần ' + cc.diem + ' điểm, ' + cc.tyLe + '%'];
    let r4 = 0;
    const kd = kdNhom ? tinhKD_(nv, thang, true, dsNVAll) : null;
    if (kd) { r4 = Math.round(kd.thuongHQ * hs); kd.ghi.forEach(function (g) { ghi.push(g); }); if (kd.phongToa || kd.tamGiu) canhBao.push(nv.HoTen + ': đang phong tỏa thu nhập có điều kiện'); }
    else if (nhom === 'C') {
      if (bac === 'C.1' || bac === 'C.2') { r4 = String(slLast('Đạt 4b')).trim() === 'Có' ? Math.round(Number(b.KPIToiDa) * hs) : 0; ghi.push('4b ' + (slLast('Đạt 4b') || 'chưa nhập')); }
      else r4 = Math.round(Math.min(Number(slLast('Tiền 4c') || 0), Number(b.KPIToiDa)) * hs);
    } else {
      const dk = Number(slLast('Điểm KPI') || 0);
      r4 = dk >= 50 ? Math.round(Number(b.KPIToiDa) * hs * Math.min(dk, 100) / 100) : 0;
      ghi.push('KPI ' + (slLast('Điểm KPI') === '' ? 'chưa nhập' : dk + ' điểm'));
    }
    let r8 = 0;
    if (kd) r8 = kd.hoaHong;
    else if (nhom === 'C') {
      const dsv = Number(slLast('Doanh số thực thu') || 0), tl = tyLeHH_(dsv, bac);
      r8 = Math.round(dsv * tl / 100);
      ghi.push('Doanh số ' + fmtTien_(dsv) + ' × ' + tl + '%');
    }
    const thuong = slSum('Thưởng'), kt = slSum('Khấu trừ');
    const luongGio = lcbHD / chuan / (khoi === 'KHO' ? Number(t.GioChuanKho || 7) : Number(t.GioChuanVP || 7.5));
    let tc = 0, gioTC = 0;
    donNV.filter(function (x) { return x.LoaiDon === 'Tăng ca' && ymd_(x.TuNgay).slice(0, 7) === thang; }).forEach(function (x) {
      const iso = ymd_(x.TuNgay), w = new Date(utc_(iso)).getUTCDay();
      tc += luongGio * (le[iso] ? 3 : (w === 0 ? 2 : 1.5)) * Number(x.SoGio || 0);
      gioTC += Number(x.SoGio || 0);
    });
    if (gioTC) ghi.push('Tăng ca ' + gioTC + ' giờ');
    const ung = donNV.filter(function (x) { return x.LoaiDon === 'Tạm ứng lương' && ymd_(x.TuNgay).slice(0, 7) === thang; })
      .reduce(function (s, x) { return s + Number(x.SoTien || 0); }, 0);
    const bh = tv ? 0 : Math.round(lcbHD * tyLeBH);
    const gross = r2 + r3a + r3b + r4 + r5 + r5b + r8 + thuong + Math.round(tc);
    tong += gross - bh - ung - kt;
    out.push([nv.MaNV, nv.HoTen, nv.PhongBan, bac, tv ? 'Có' : '', chuan, ngayTL, ngayTT, Math.round(lcbHD), r2, r3a, r3b, r4, r5, r5b, r8, thuong,
      Math.round(tc), '', bh, '', ung, kt, '', String(nv.SoTaiKhoan || ''), String(nv.NganHang || ''), ghi.join('; ')]);
  });
  const ss = ss_(), ten = 'BL ' + thang;
  let sh = ss.getSheetByName(ten);
  if (sh && String(sh.getRange(1, 3).getValue()) === 'Chức vụ') throw new Error('Bảng lương tháng này đã nạp từ file của kế toán, không lập lại tự động.');
  if (['BB', 'CAP'].some(function (c) { return PropertiesService.getScriptProperties().getProperty('BLD_' + thang + '_' + c); })) throw new Error('Bảng lương tháng này đang trong quy trình duyệt chi, không lập lại.');
  if (sh) sh.clear(); else sh = ss.insertSheet(ten);
  const head = ['Mã NV', 'Họ tên', 'Phòng ban', 'Bậc', 'Thử việc', 'Ngày công chuẩn', 'Ngày tính lương', 'Ngày làm thực tế', 'Lương cơ bản HĐ',
    '(2) Lương theo công', '(3a) Ăn giữa ca', '(3b) Xăng xe', '(4) Thưởng hiệu suất', '(5) Chuyên cần', '(5b) Chuyên cần xuất sắc', '(8) Hoa hồng',
    'Thưởng khác', 'Tiền tăng ca', 'TỔNG THU NHẬP', 'BHXH-BHYT-BHTN (NLĐ)', 'Thuế TNCN (kế toán nhập)', 'Tạm ứng', 'Khấu trừ khác', 'THỰC LĨNH',
    'Số tài khoản', 'Ngân hàng', 'Ghi chú'];
  sh.getRange(1, 1, 1, head.length).setValues([head]).setFontWeight('bold').setBackground('#E6F1FB').setWrap(true);
  if (out.length) {
    sh.getRange(2, 25, out.length, 1).setNumberFormat('@');
    out.forEach(function (r, i) { const row = i + 2; r[18] = '=SUM(J' + row + ':R' + row + ')'; r[23] = '=S' + row + '-T' + row + '-U' + row + '-V' + row + '-W' + row; });
    sh.getRange(2, 1, out.length, head.length).setValues(out);
    const tr = out.length + 2;
    sh.getRange(tr, 2).setValue('TỔNG CỘNG').setFontWeight('bold');
    'IJKLMNOPQRSTUVWX'.split('').forEach(function (c) { sh.getRange(c + tr).setFormula('=SUM(' + c + '2:' + c + (tr - 1) + ')').setFontWeight('bold'); });
    sh.getRange(2, 9, out.length + 1, 16).setNumberFormat('#,##0');
  }
  sh.setFrozenRows(1);
  sh.setFrozenColumns(2);
  PropertiesService.getScriptProperties().setProperty('BL_' + thang, 'Nháp');
  log_(nguoi.Gmail, 'Lập bảng lương', thang);
  return { ok: true, url: ss.getUrl() + '#gid=' + sh.getSheetId(), soNV: out.length, canhBao: canhBao, tong: tong };
}

function congBoLuong(token, thang, pin) {
  const nv = auth_(token);
  if (String(nv.VaiTro).trim() !== 'GD') throw new Error('Chỉ Giám đốc được công bố phiếu lương.');
  checkPin_(nv, pin);
  if (!ss_().getSheetByName('BL ' + thang)) throw new Error('Chưa lập bảng lương tháng này.');
  PropertiesService.getScriptProperties().setProperty('BL_' + thang, 'Đã công bố');
  log_(nv.Gmail, 'Công bố phiếu lương', thang);
  return { ok: true };
}

function phieuLuong(token) {
  const nv = auth_(token);
  const props = PropertiesService.getScriptProperties().getProperties(), ss = ss_();
  const cty = ctyCua_(nv), thangs = {};
  Object.keys(props).forEach(function (k) {
    if (k.indexOf('BL_') !== 0 || props[k] !== 'Đã công bố') return;
    const th = k.slice(3, 10), duoi = k.slice(10);
    if (!duoi || duoi === '_' + cty) thangs[th] = 1;
  });
  return Object.keys(thangs).sort().reverse().slice(0, 6)
    .map(function (th) {
      const sh = ss.getSheetByName('BL ' + th);
      if (!sh) return null;
      const v = sh.getDataRange().getValues(), h = v[0];
      const row = v.find(function (r, i) { return i > 0 && String(r[0]) === String(nv.MaNV); });
      if (!row) return null;
      const dong = [];
      h.forEach(function (k, j) { if (j >= 5 && j <= 23) dong.push([k, row[j]]); });
      return { thang: th, dong: dong };
    }).filter(Boolean);
}

/* ================= ẢNH ĐẠI DIỆN, VAI TRÒ, CHUYÊN CẦN ================= */

function datAnhDaiDien(token, anh) {
  const nv = auth_(token);
  const m = /^data:image\/jpeg;base64,([A-Za-z0-9+\/=]+)$/.exec(String(anh || ''));
  if (!m || m[1].length > 200000) return { ok: false, msg: 'Ảnh không hợp lệ, chọn ảnh khác.' };
  const p = PropertiesService.getScriptProperties();
  let f = null;
  const id = p.getProperty('AVATAR_FOLDER');
  if (id) { try { f = DriveApp.getFolderById(id); } catch (e) {} }
  if (!f) { f = DriveApp.createFolder('HỆ THỐNG CHẤM CÔNG - ẢNH ĐẠI DIỆN'); p.setProperty('AVATAR_FOLDER', f.getId()); }
  if (nv.AnhDaiDien) { try { DriveApp.getFileById(String(nv.AnhDaiDien)).setTrashed(true); } catch (e) {} }
  const file = f.createFile(Utilities.newBlob(Utilities.base64Decode(m[1]), 'image/jpeg', nv.MaNV + '.jpg'));
  setCell_(SH.NV, nv._row, 'AnhDaiDien', file.getId());
  try { CacheService.getScriptCache().remove('BANGTIN'); } catch (e) {}
  log_(nv.Gmail, 'Đổi ảnh đại diện', '');
  return { ok: true };
}

function taiMoTa(token) {
  const nv = auth_(token);
  const all = rows_(SH.MT);
  const rieng = function (r) { return String(r.MaNV || '').trim() !== ''; };
  const theoNV = all.filter(function (r) { return rieng(r) && String(r.MaNV) === String(nv.MaNV); });
  const theoCD = all.filter(function (r) { return !rieng(r) && norm_(r.ChucVu) === norm_(nv.ChucVu); });
  const ds = theoNV.length ? theoNV : theoCD;
  const v = function (r) {
    return { ma: String(r.MaMT || ''), chucVu: String(r.ChucVu || ''), rieng: rieng(r), vaiTro: String(r.VaiTro || ''), trachNhiem: String(r.TrachNhiem || ''),
      quyenHan: String(r.QuyenHan || ''), moTaCV: String(r.MoTaCV || ''), tep: String(r.TepDinhKem || ''), hieuLuc: r.NgayHieuLuc ? fmtD_(r.NgayHieuLuc) : '',
      capNhat: r.NguoiCapNhat ? r.NguoiCapNhat + ', ' + fmtDT_(r.ThoiGianCapNhat) : '' };
  };
  const vt = String(nv.VaiTro).trim();
  const out = { hienHanh: ds.length ? v(ds[ds.length - 1]) : null, lichSu: ds.slice(0, -1).reverse().map(v), quanTri: vt === 'GD' || vt === 'HCNS' };
  if (out.quanTri) {
    const cds = {};
    rows_(SH.NV).forEach(function (r) {
      const cd = String(r.ChucVu || '').trim();
      if (cd && String(r.TrangThai).trim() !== 'Nghỉ việc') cds[cd] = (cds[cd] || 0) + 1;
    });
    out.danhMuc = Object.keys(cds).sort().map(function (cd) {
      const r = all.filter(function (x) { return !rieng(x) && norm_(x.ChucVu) === norm_(cd) && x.TepDinhKem; }).pop();
      return { chucVu: cd, soNguoi: cds[cd], ma: r ? String(r.MaMT || '') : '', hieuLuc: r && r.NgayHieuLuc ? fmtD_(r.NgayHieuLuc) : '' };
    });
  }
  return out;
}

function moTaNV_(r) {
  try {
    const all = rows_(SH.MT), rieng = function (x) { return String(x.MaNV || '').trim() !== ''; };
    const nv = all.filter(function (x) { return rieng(x) && String(x.MaNV) === String(r.MaNV); });
    const cd = all.filter(function (x) { return !rieng(x) && norm_(x.ChucVu) === norm_(r.ChucVu); });
    const x = (nv.length ? nv : cd).pop();
    if (!x) return null;
    return { rieng: rieng(x), chucVu: String(x.ChucVu || ''), vaiTro: String(x.VaiTro || ''), moTaCV: String(x.MoTaCV || ''), trachNhiem: String(x.TrachNhiem || ''),
      quyenHan: String(x.QuyenHan || ''), hieuLuc: x.NgayHieuLuc ? fmtD_(x.NgayHieuLuc) : '', capNhat: x.NguoiCapNhat ? x.NguoiCapNhat + ', ' + fmtDT_(x.ThoiGianCapNhat) : '',
      tep: String(x.TepDinhKem || ''), ma: String(x.MaMT || '') };
  } catch (e) { return null; }
}

function luuMoTaNV(token, ma, f) {
  const nv = auth_(token), vt = String(nv.VaiTro).trim();
  if (vt !== 'GD' && vt !== 'HCNS') throw new Error('Chỉ Giám đốc, HCNS được ghi vai trò, mô tả công việc.');
  const tg = rows_(SH.NV).find(function (r) { return String(r.MaNV) === String(ma); });
  if (!tg) throw new Error('Không tìm thấy nhân viên.');
  f = f || {};
  const g = function (k, n) { return String(f[k] || '').trim().slice(0, n); };
  const v = { vaiTro: g('vaiTro', 3000), moTaCV: g('moTaCV', 5000), trachNhiem: g('trachNhiem', 5000), quyenHan: g('quyenHan', 3000) };
  if (!v.vaiTro && !v.moTaCV && !v.trachNhiem && !v.quyenHan) throw new Error('Ghi ít nhất một mục.');
  const cu = moTaNV_(tg), now = new Date();
  append_(SH.MT, { ChucVu: String(tg.ChucVu || ''), VaiTro: v.vaiTro, MoTaCV: v.moTaCV, TrachNhiem: v.trachNhiem, QuyenHan: v.quyenHan, MaNV: tg.MaNV,
    TepDinhKem: cu ? cu.tep : '', MaMT: 'MT' + Utilities.formatDate(now, TZ, 'yyMMddHHmmss') + Math.floor(Math.random() * 90 + 10),
    NgayHieuLuc: /^\d{4}-\d{2}-\d{2}$/.test(String(f.hieuLuc || '')) ? f.hieuLuc : ymd_(now), NguoiCapNhat: nv.HoTen, ThoiGianCapNhat: now });
  log_(nv.Gmail, 'Ghi vai trò, mô tả công việc', tg.HoTen);
  return { ok: true };
}

function napMoTa(token, f) {
  const nv = auth_(token), vt = String(nv.VaiTro).trim();
  if (vt !== 'GD' && vt !== 'HCNS') throw new Error('Chỉ Giám đốc, HCNS được nạp bản mô tả công việc.');
  f = f || {};
  let chucVu = String(f.chucVu || '').trim(), maNV = '';
  if (f.ma && f.ma !== '*') {
    const tg = rows_(SH.NV).find(function (r) { return String(r.MaNV) === String(f.ma); });
    if (!tg) throw new Error('Không tìm thấy nhân viên.');
    maNV = tg.MaNV;
    if (!chucVu) chucVu = String(tg.ChucVu || '');
  }
  if (!chucVu) throw new Error('Nhập chức danh.');
  if (!f.file || !f.file.data) throw new Error('Nạp file bản mô tả công việc.');
  const now = new Date();
  const ma = 'MT' + Utilities.formatDate(now, TZ, 'yyMMddHHmmss') + Math.floor(Math.random() * 90 + 10);
  const file = luuTep_('MOTA_FOLDER', 'HỆ THỐNG CHẤM CÔNG - BẢN MÔ TẢ CÔNG VIỆC', f.file, ma + ' - ' + chucVu + (maNV ? ' - ' + maNV : ''));
  append_(SH.MT, { ChucVu: chucVu, VaiTro: String(f.vaiTro || '').trim().slice(0, 3000), TrachNhiem: String(f.trachNhiem || '').trim().slice(0, 5000),
    QuyenHan: String(f.quyenHan || '').trim().slice(0, 3000), MaNV: maNV, TepDinhKem: file.getId(), MaMT: ma,
    NgayHieuLuc: /^\d{4}-\d{2}-\d{2}$/.test(String(f.hieuLuc || '')) ? f.hieuLuc : ymd_(now), NguoiCapNhat: nv.HoTen, ThoiGianCapNhat: now });
  log_(nv.Gmail, 'Nạp bản mô tả công việc', ma + ' ' + chucVu);
  return { ok: true };
}

function chuyenCan_(nv, cc, month, today) {
  const days = {};
  cc.forEach(function (r) {
    const d = ymd_(r.ThoiGian);
    if (d.slice(0, 7) === month) (days[d] = days[d] || []).push(r);
  });
  const sk = [];
  let lanNho = 0, diem = 0;
  Object.keys(days).sort().forEach(function (d) {
    const rs = days[d];
    const vao = rs.find(function (r) { return r.Loai === 'VAO'; });
    const ras = rs.filter(function (r) { return r.Loai === 'RA'; });
    const ra = ras.length ? ras[ras.length - 1] : null;
    const ev = [];
    if (vao && Number(vao.DiTre_phut) > 0) ev.push(['Đi trễ', Number(vao.DiTre_phut)]);
    if (ra && Number(ra.VeSom_phut) > 0) ev.push(['Về sớm', Number(ra.VeSom_phut)]);
    ev.forEach(function (e) {
      const ph = e[1];
      let p;
      if (ph <= 5) { lanNho++; p = lanNho >= 4 ? 0.5 : 0; }
      else if (ph <= 15) p = 1; else if (ph <= 30) p = 2; else if (ph <= 60) p = 3; else p = 4;
      diem += p;
      sk.push({ ngay: ymdToVN_(d), loai: e[0], phut: ph, diem: p });
    });
    if (vao && !ra && d < today) { diem += 4; sk.push({ ngay: ymdToVN_(d), loai: 'Thiếu giờ ra', phut: 0, diem: 4 }); }
  });
  const tyLe = diem <= 2 ? 100 : (diem >= 7 ? 0 : 100 - Math.ceil((diem - 2) / 0.5) * 10);
  return { diem: diem, tyLe: tyLe, xuatSac: diem === 0, suKien: sk };
}

/* ================= CHẤM CÔNG BẰNG ẢNH VÀ BẢNG THEO DÕI HÔM NAY ================= */

function khoi_(nv) {
  const k = String(nv.Khoi || '').trim().toUpperCase();
  if (k) return k === 'KHO' ? 'KHO' : 'VP';
  return norm_(nv.PhongBan) === 'kho' ? 'KHO' : 'VP';
}
function phut_(hhmm) { const p = String(hhmm || '0:0').split(':').map(Number); return p[0] * 60 + (p[1] || 0); }
function nowMin_(d) { return Number(Utilities.formatDate(d, TZ, 'H')) * 60 + Number(Utilities.formatDate(d, TZ, 'm')); }
function thu_(d) { return Number(Utilities.formatDate(d, TZ, 'u')); }
function gioKetThuc_(nv, d, t) {
  if (thu_(d) === 6) return khoi_(nv) === 'KHO' ? (t.GioRaThu7Kho || '16:00') : (t.GioRaThu7VP || '12:00');
  return t.GioRa || '17:00';
}
function laQuanLy_(nv) { const v = String(nv.VaiTro).trim(); return v === 'TP' || v === 'GD' || v === 'HCNS'; }

function folderAnh_(d) {
  const p = PropertiesService.getScriptProperties();
  let root = null;
  const id = p.getProperty('PHOTO_FOLDER');
  if (id) { try { root = DriveApp.getFolderById(id); } catch (e) {} }
  if (!root) { root = DriveApp.createFolder('HỆ THỐNG CHẤM CÔNG - ẢNH CHẤM CÔNG'); p.setProperty('PHOTO_FOLDER', root.getId()); }
  return getOrCreate_(getOrCreate_(root, Utilities.formatDate(d, TZ, 'yyyy-MM')), Utilities.formatDate(d, TZ, 'dd'));
}

function chamCongAnh(token, anh, lat, lng, acc) {
  const nv = auth_(token);
  const m = /^data:image\/jpeg;base64,([A-Za-z0-9+\/=]+)$/.exec(String(anh || ''));
  if (!m) return { ok: false, msg: 'Chưa chụp được ảnh. Cho phép camera rồi thử lại.' };
  if (m[1].length > 400000) return { ok: false, msg: 'Ảnh quá lớn, chụp lại.' };
  const gpsMax = Number(ts_().DoChinhXacToiDa || 100);
  if (lat === null || lat === undefined || lat === '' || lng === null || lng === undefined || lng === '' || !isFinite(Number(lat)) || !isFinite(Number(lng))) return { ok: false, msg: 'Chưa lấy được vị trí. Cho phép định vị rồi chấm lại.' };
  if (!(Number(acc) <= gpsMax)) return { ok: false, msg: 'Vị trí chưa đủ chính xác (sai số ' + Math.round(Number(acc) || 0) + ' m, cho phép tối đa ' + gpsMax + ' m). Bật GPS rồi chấm lại.' };
  const bytes = Utilities.base64Decode(m[1]);
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const t = ts_();
    const now = new Date(), today = ymd_(now);
    const homNay = rows_(SH.CC).filter(function (r) { return String(r.MaNV) === String(nv.MaNV) && ymd_(r.ThoiGian) === today; });
    const loai = homNay.some(function (r) { return r.Loai === 'VAO'; }) ? 'RA' : 'VAO';
    const n = nowMin_(now);
    let tre = 0, veSom = 0;
    if (loai === 'VAO') tre = Math.max(0, n - phut_(t.GioVao || '08:00'));
    else veSom = Math.max(0, phut_(gioKetThuc_(nv, now, t)) - n);
    let diemTen = String(nv.DiemChamCong || ''), kc = '', vd = '', kd = '', dcx = '';
    if (lat !== null && lat !== undefined && lat !== '' && lng !== null && lng !== undefined && lng !== '' && isFinite(Number(lat)) && isFinite(Number(lng))) {
      vd = Number(lat); kd = Number(lng); dcx = Math.round(Number(acc) || 0);
      let best = null;
      rows_(SH.DIEM).forEach(function (p) { const k = dist_(vd, kd, Number(p.ViDo), Number(p.KinhDo)); if (!best || k < best.k) best = { p: p, k: k }; });
      if (best) { kc = Math.round(best.k); diemTen = best.k <= Number(best.p.BanKinh_m || 50) * 3 ? best.p.TenDiem : 'Ngoài văn phòng'; }
    }
    const file = folderAnh_(now).createFile(Utilities.newBlob(bytes, 'image/jpeg',
      nv.MaNV + '_' + loai + '_' + Utilities.formatDate(now, TZ, 'HHmmss') + '.jpg'));
    append_(SH.CC, {
      ThoiGian: now, MaNV: nv.MaNV, HoTen: nv.HoTen, PhongBan: nv.PhongBan, Loai: loai,
      Diem: diemTen, ViDo: vd, KinhDo: kd, DoChinhXac_m: dcx, KhoangCach_m: kc, DiTre_phut: tre, VeSom_phut: veSom, HinhThuc: 'Ảnh', AnhID: file.getId()
    });
    return { ok: true, loai: loai, gio: fmtT_(now), tre: tre, veSom: veSom };
  } finally {
    lock.releaseLock();
  }
}

function tinhHomNay_(xem, now) {
  const t = ts_();
  const today = ymd_(now), n = nowMin_(now);
  const vt = xem ? String(xem.VaiTro).trim() : 'GD';
  const ds = rows_(SH.NV).filter(function (r) {
    if (String(r.TrangThai).trim() === 'Nghỉ việc' || String(r.TrangThai).trim() === 'Tài khoản phụ' || !String(r.MaNV).trim() || !String(r.Gmail || '').trim()) return false;
    if (!xem || vt === 'GD' || vt === 'HCNS') return true;
    return norm_(r.GmailDuyet) === norm_(xem.Gmail) || norm_(r.PhongBan) === norm_(xem.PhongBan);
  });
  const cc = rows_(SH.CC).filter(function (r) { return ymd_(r.ThoiGian) === today; });
  const dons = rows_(SH.DON);
  const batDau = phut_(t.GioVao || '08:00');
  const list = ds.map(function (nv) {
    const mine = cc.filter(function (r) { return String(r.MaNV) === String(nv.MaNV); });
    const vao = mine.find(function (r) { return r.Loai === 'VAO'; });
    const ras = mine.filter(function (r) { return r.Loai === 'RA'; });
    const ra = ras.length ? ras[ras.length - 1] : null;
    const nghi = dons.find(function (d) {
      return String(d.MaNV) === String(nv.MaNV) && d.TrangThai === 'Đã duyệt' && d.LoaiDon !== 'Tăng ca' && d.LoaiDon !== 'Tạm ứng lương' && d.LoaiDon !== 'Trình duyệt' && d.LoaiDon !== 'Đánh giá KPI' && d.LoaiDon !== 'Cập nhật hồ sơ' && d.LoaiDon !== 'Xin nghỉ việc' &&
        ymd_(d.TuNgay) <= today && ymd_(d.DenNgay) >= today;
    });
    const ketThuc = phut_(gioKetThuc_(nv, now, t));
    let tt;
    if (vao) tt = Number(vao.DiTre_phut) > 0 ? 'tre' : 'dung';
    else if (nghi) tt = 'nghi';
    else tt = n >= batDau ? 'vang' : 'cho';
    return {
      ma: String(nv.MaNV), ten: nv.HoTen, phong: nv.PhongBan, tt: tt,
      vao: vao ? fmtT_(vao.ThoiGian) : '', tre: vao ? Number(vao.DiTre_phut || 0) : 0,
      ra: ra ? fmtT_(ra.ThoiGian) : '', veSom: ra ? Number(ra.VeSom_phut || 0) : 0,
      chuaRa: !!vao && !ra && n >= ketThuc + 30, nghi: nghi ? nghi.LoaiDon : '',
      anhVao: vao ? String(vao.AnhID || '') : '', anhRa: ra ? String(ra.AnhID || '') : ''
    };
  });
  return { ngay: ymdToVN_(today), gio: fmtT_(now), chuNhat: thu_(now) === 7, list: list };
}

function baoCaoHomNay(token) {
  const nv = auth_(token);
  if (!laQuanLy_(nv)) throw new Error('Chỉ trưởng phòng, giám đốc, HCNS xem được bảng này.');
  return tinhHomNay_(nv, new Date());
}

function xemAnh(token, id) {
  const nv = auth_(token);
  const r = rows_(SH.CC).find(function (x) { return String(x.AnhID) === String(id); });
  if (!r) throw new Error('Không tìm thấy ảnh.');
  if (String(r.MaNV) !== String(nv.MaNV) && !laQuanLy_(nv)) throw new Error('Bạn không có quyền xem ảnh này.');
  return 'data:image/jpeg;base64,' + Utilities.base64Encode(DriveApp.getFileById(id).getBlob().getBytes());
}

function BAO_CAO_SANG() {
  const now = new Date();
  if (thu_(now) === 7) return;
  const t = ts_();
  const moc = phut_(t.GioBaoCaoSang || '08:15'), n = nowMin_(now);
  if (n < moc || n > moc + 60) return;
  const p = PropertiesService.getScriptProperties(), today = ymd_(now);
  if (p.getProperty('BAOCAO_SANG') === today) return;
  p.setProperty('BAOCAO_SANG', today);
  const to = norm_(t.GmailNhanBaoCao) || norm_(t.GmailGiamDoc);
  if (!to) return;
  const r = tinhHomNay_(null, now);
  const vang = r.list.filter(function (x) { return x.tt === 'vang'; });
  const tre = r.list.filter(function (x) { return x.tt === 'tre'; });
  const nghi = r.list.filter(function (x) { return x.tt === 'nghi'; });
  const li = function (a, f) { return a.length ? '<ul>' + a.map(function (x) { return '<li>' + f(x) + '</li>'; }).join('') + '</ul>' : '<p>Không có</p>'; };
  MailApp.sendEmail({
    to: to,
    subject: 'Chấm công ' + r.ngay + ': ' + vang.length + ' chưa có mặt, ' + tre.length + ' đi trễ',
    htmlBody: '<p><b>Chưa có mặt (' + vang.length + ')</b></p>' + li(vang, function (x) { return esc_(x.ten) + ' - ' + esc_(x.phong); }) +
      '<p><b>Đi trễ (' + tre.length + ')</b></p>' + li(tre, function (x) { return esc_(x.ten) + ' - trễ ' + x.tre + ' phút'; }) +
      '<p><b>Nghỉ có phép (' + nghi.length + ')</b></p>' + li(nghi, function (x) { return esc_(x.ten) + ' - ' + esc_(x.nghi); }) +
      '<p><a href="' + ScriptApp.getService().getUrl() + '">Mở app xem chi tiết và ảnh chấm công</a></p>'
  });
}


/* ================= SAO LƯU TỰ ĐỘNG HẰNG ĐÊM ================= */

/* ================= VIỆC GIAO ĐỘT XUẤT ================= */

/* ================= BÁO CÁO DOANH SỐ KINH DOANH (QUY CHẾ BÁN HÀNG 04/2026, PHỤ LỤC 01) ================= */

const NHOM_KD = {
  KD_CAO: { ten: 'Kinh doanh kinh nghiệm cao', luong: 6000000, pc: 1200000, hq: 1400000, cc: 400000, ql: false },
  KD_MOI: { ten: 'Kinh doanh dưới 3 năm', luong: 5700000, pc: 1200000, hq: 1400000, cc: 200000, ql: false },
  QL45: { ten: 'Quản lý 4–5 người', luong: 7000000, pc: 1200000, hq: 5500000, cc: 750000, ql: true },
  QL6: { ten: 'Quản lý trên 6 người', luong: 7000000, pc: 1200000, hq: 7500000, cc: 750000, ql: true }
};
const CT_KD = [['dh', 'Đơn đặt hàng ký, đóng dấu'], ['bbgn', 'Biên bản giao nhận'], ['bbnt', 'Biên bản nghiệm thu'], ['anhGN', 'Ảnh giao nhận thực tế'], ['anhHang', 'Ảnh hàng hóa đã giao'], ['banGoc', 'Bản gốc đã nộp Kế toán']];
const VP_KD = {
  D19: 'Không theo dõi đơn hàng (Điều 19): trừ 50% thưởng hiệu quả',
  D234: 'Đổi trả xử lý không đúng hạn (Điều 23.4): trừ 50% thưởng hiệu quả',
  D17: 'Thiệt hại do làm sai quy trình (Điều 17): NV 35%, quản lý 35%',
  D18: 'Nợ xấu (Điều 18): phong tỏa thu nhập có điều kiện',
  D22: 'Đang xác minh gian lận (Điều 22): tạm giữ thưởng, hoa hồng'
};
const TT_KD = ['Nháp', 'Chờ trưởng phòng', 'Chờ kế toán', 'Chờ giám đốc', 'Đã duyệt', 'Trả lại'];

function nhomKD_(nv) { return NHOM_KD[String(nv.NhomKD || '').trim()] || null; }
function nacHH_(ds, chuoi) {
  const k = String(chuoi || '400:1,800:1.2,1000:1.4,2000:1.6,4000:1.8,8000:2').split(',').map(function (x) { const p = x.split(':'); return [Number(p[0]) * 1e6, Number(p[1])]; })
    .filter(function (p) { return p[0] >= 0 && p[1] >= 0; }).sort(function (a, b) { return a[0] - b[0]; });
  let tl = 0;
  k.forEach(function (p) { if (ds >= p[0]) tl = p[1]; });
  return tl;
}
function dsDon_(d, heSo) {
  const du = CT_KD.every(function (c) { return d.ct && d.ct[c[0]]; });
  if (!du) return { ghiNhan: 0, treo: true, tru: 0, tyLe: 1 };
  const gt = Number(d.giaTri) || 0, ck = Number(d.ck) || 0, tru = Math.round(ck * heSo);
  let con = Math.max(gt - tru, 0);
  const s = Number(d.duoiSan) || 0;
  const tyLe = s <= 0 ? 1 : s < 5 ? 0.7 : s < 10 ? 0.6 : s < 15 ? 0.5 : 0.4;
  return { ghiNhan: Math.round(con * tyLe), treo: false, tru: tru, tyLe: tyLe };
}
function noDon_(d, homNay) {
  const no = Math.max(Math.round(Number(d.conNo) || 0), 0);
  if (!no) return { no: 0, ngay: 0, tt: '' };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(d.ngayGiao || ''))) return { no: no, ngay: 0, tt: 'Chưa ghi ngày giao' };
  const ngay = Math.floor((utc_(homNay) - utc_(d.ngayGiao)) / 864e5);
  return { no: no, ngay: ngay, tt: ngay >= 40 ? 'Nợ xấu' : ngay >= 21 ? 'Quá hạn' : 'Trong hạn' };
}
function tongNo_(don, homNay) {
  const s = { no: 0, quaHan: 0, noXau: 0 };
  don.forEach(function (d) { const n = noDon_(d, homNay); s.no += n.no; if (n.tt === 'Quá hạn') s.quaHan += n.no; if (n.tt === 'Nợ xấu') s.noXau += n.no; });
  return s;
}
function heSoCK_(t) { return Number(t.HeSoChietKhau || 8.67) || 8.67; }
function bcKDRow_(ma, thang) {
  try { return rows_(SH.BCKD).find(function (r) { return String(r.MaNV) === String(ma) && thangCua_(r.Thang) === thang; }) || null; } catch (e) { return null; }
}
function donCuaBC_(r) { try { return JSON.parse(String(r && r.DonHang || '[]')) || []; } catch (e) { return []; } }
function buocKD_(tt) { return TT_KD.indexOf(tt); }
function nguoiDuyetKD_(r, nv, dsNV) {
  const tt = String(r.TrangThai || ''), vt = String(nv.VaiTro).trim();
  const chu = dsNV.find(function (x) { return String(x.MaNV) === String(r.MaNV); });
  if (!chu) return false;
  if (tt === 'Chờ trưởng phòng') {
    const ql = dsGmail_(chu.GmailDuyet);
    return ql.length ? ql.indexOf(norm_(nv.Gmail)) >= 0 : vt === 'GD';
  }
  if (tt === 'Chờ kế toán') return vt === 'KT';
  if (tt === 'Chờ giám đốc') return vt === 'GD';
  return false;
}
function vpKDCua_(ma, thang) {
  try { return rows_(SH.VPKD).filter(function (x) { return String(x.MaNV) === String(ma) && thangCua_(x.Thang) === thang && String(x.TrangThai) !== 'Đã gỡ'; }); } catch (e) { return []; }
}
function dangPhongToa_(ma) {
  try { return rows_(SH.VPKD).some(function (x) { return String(x.MaNV) === String(ma) && (x.Loai === 'D18' || x.Loai === 'D22') && String(x.TrangThai) !== 'Đã gỡ'; }); } catch (e) { return false; }
}
function dsBCThang_(nv, thang, chiDuyet) {
  const r = bcKDRow_(nv.MaNV, thang);
  if (!r || (chiDuyet && r.TrangThai !== 'Đã duyệt')) return 0;
  return Number(r.DSGhiNhan) || 0;
}

function tinhKD_(nv, thang, chiDuyet, dsNV) {
  const nh = nhomKD_(nv);
  if (!nh) return null;
  const t = ts_(), ghi = [];
  dsNV = dsNV || rows_(SH.NV);
  let dsCN = dsBCThang_(nv, thang, chiDuyet), dsTinh = dsCN, dsDoi = 0;
  if (nh.ql) {
    dsDoi = dsCN;
    dsNV.forEach(function (x) { if (String(x.MaNV) !== String(nv.MaNV) && nhomKD_(x) && dsGmail_(x.GmailDuyet).indexOf(norm_(nv.Gmail)) >= 0 && String(x.TrangThai).trim() !== 'Nghỉ việc') dsDoi += dsBCThang_(x, thang, chiDuyet); });
    dsTinh = dsDoi;
    ghi.push('Doanh số đội ' + fmtTien_(dsDoi));
  } else ghi.push('Doanh số ghi nhận ' + fmtTien_(dsCN));
  const quy = String(nv.HoaHongQuy || '').trim() === 'Có';
  let dsHH = dsTinh, tl = nacHH_(dsTinh, nh.ql ? (t.NacHoaHongQL || t.NacHoaHong) : t.NacHoaHong), hh = 0;
  if (quy) {
    const m = Number(thang.slice(5));
    if (m % 3) { tl = 0; ghi.push('Hoa hồng tính theo quý, chi vào tháng ' + (m + 3 - m % 3)); }
    else {
      dsHH = 0;
      for (let i = 0; i < 3; i++) { const d = new Date(Date.UTC(Number(thang.slice(0, 4)), m - 1 - i, 1)); const th = Utilities.formatDate(d, 'UTC', 'yyyy-MM'); dsHH += th === thang ? dsTinh : dsBCThang_(nv, th, chiDuyet); }
      tl = nacHH_(dsHH / 3, nh.ql ? (t.NacHoaHongQL || t.NacHoaHong) : t.NacHoaHong);
      ghi.push('Doanh số quý ' + fmtTien_(dsHH));
    }
  }
  hh = Math.round(dsHH * tl / 100);
  ghi.push('Hoa hồng ' + tl + '%');
  const min = nh.ql ? Number(t.DSToiThieuQL || 2e9) : Number(t.DSToiThieuNV || 2e8);
  let kpi = '';
  try { const a = rows_(SH.SL).filter(function (r) { return String(r.MaNV) === String(nv.MaNV) && thangCua_(r.Thang) === thang && r.Loai === 'Điểm KPI'; }); if (a.length) kpi = Number(a[a.length - 1].GiaTri); } catch (e) {}
  let hq = 0;
  if (dsTinh < min) ghi.push('Doanh số dưới ' + fmtTien_(min) + ': không có thưởng hiệu quả');
  else if (kpi === '') ghi.push('Chưa có điểm KPI: thưởng hiệu quả 0');
  else if (kpi < 50) ghi.push('KPI ' + kpi + ' điểm dưới 50: thưởng hiệu quả 0');
  else { hq = Math.round(nh.hq * Math.min(kpi, 100) / 100); ghi.push('KPI ' + kpi + ' điểm'); }
  const vp = vpKDCua_(nv.MaNV, thang);
  const giam50 = vp.filter(function (x) { return x.Loai === 'D19' || x.Loai === 'D234'; }).length;
  if (giam50 && hq) { hq = Math.round(hq * Math.pow(0.5, giam50)); ghi.push('Trừ 50% thưởng hiệu quả × ' + giam50 + ' lần'); }
  const thietHai = vp.filter(function (x) { return x.Loai === 'D17'; }).reduce(function (s, x) { return s + (Number(x.SoTien) || 0); }, 0);
  let truTH = 0, chuyenBoiThuong = 0;
  if (thietHai) {
    truTH = Math.min(thietHai, hh + hq);
    chuyenBoiThuong = thietHai - truTH;
    const truHH = Math.min(truTH, hh); hh -= truHH; hq -= (truTH - truHH);
    ghi.push('Trừ thiệt hại ' + fmtTien_(truTH) + (chuyenBoiThuong ? ', còn ' + fmtTien_(chuyenBoiThuong) + ' xử lý bồi thường theo Nội quy' : ''));
  }
  const phongToa = dangPhongToa_(nv.MaNV);
  const thuong = hq, hoaHong = hh;
  if (phongToa) ghi.push('Đang phong tỏa thu nhập có điều kiện (nợ xấu hoặc đang xác minh): tạm giữ thưởng hiệu quả ' + fmtTien_(hq) + ', hoa hồng ' + fmtTien_(hh));
  const r = bcKDRow_(nv.MaNV, thang);
  if (chiDuyet && (!r || r.TrangThai !== 'Đã duyệt')) ghi.push('Báo cáo doanh số chưa được duyệt đủ: chưa tính thưởng, hoa hồng');
  const khongChi = phongToa || (chiDuyet && (!r || r.TrangThai !== 'Đã duyệt'));
  return { nhom: String(nv.NhomKD), tenNhom: nh.ten, ql: nh.ql, luong: nh.luong, pc: nh.pc, hqToiDa: nh.hq, cc: nh.cc,
    dsCaNhan: dsCN, dsDoi: dsDoi, dsTinh: dsTinh, tyLe: tl, kpi: kpi, toiThieu: min,
    thuongHQ: khongChi ? 0 : thuong, hoaHong: khongChi ? 0 : hoaHong, tamGiu: phongToa ? thuong + hoaHong : 0,
    thietHai: thietHai, truThietHai: truTH, boiThuongThem: chuyenBoiThuong, phongToa: phongToa, quy: quy, ghi: ghi };
}

function bcView_(r) {
  if (!r) return null;
  const t = ts_(), hs = heSoCK_(t);
  const homNay = ymd_(new Date());
  const don = donCuaBC_(r).map(function (d, i) { const k = dsDon_(d, hs), n = noDon_(d, homNay); return Object.assign({ i: i }, d, { ghiNhan: k.ghiNhan, treo: k.treo, truCK: k.tru, tyLeSan: k.tyLe, tuoiNo: n.ngay, ttNo: n.tt }); });
  return { cn: tongNo_(donCuaBC_(r), homNay), ma: String(r.MaBC), thang: thangCua_(r.Thang), maNV: String(r.MaNV), ten: String(r.HoTen), phong: String(r.PhongBan || ''), trangThai: String(r.TrangThai || 'Nháp'),
    don: don, tongGiaTri: Number(r.TongGiaTri) || 0, dsGhiNhan: Number(r.DSGhiNhan) || 0, lichSu: String(r.LichSu || ''), ghiChu: String(r.GhiChu || ''), capNhat: r.CapNhat ? fmtDT_(r.CapNhat) : '' };
}
function tongBC_(don, hs) {
  let g = 0, n = 0;
  don.forEach(function (d) { g += Number(d.giaTri) || 0; n += dsDon_(d, hs).ghiNhan; });
  return { tong: g, ghiNhan: n };
}

function taiBaoCaoKD(token, thang, ma) {
  return coMemo_(function () {
    const nv = auth_(token), ds = rows_(SH.NV);
    if (!/^\d{4}-\d{2}$/.test(String(thang || ''))) throw new Error('Chọn tháng.');
    const tg = ma ? ds.find(function (x) { return String(x.MaNV) === String(ma); }) : nv;
    if (!tg) throw new Error('Không tìm thấy nhân viên.');
    if (String(tg.MaNV) !== String(nv.MaNV) && !quyenVoiNV_(nv, tg) && !quyenLuong_(nv)) throw new Error('Bạn không có quyền xem báo cáo này.');
    const vp = vpKDCua_(tg.MaNV, thang).map(function (x) { return { ma: String(x.MaVP), loai: String(x.Loai), ten: VP_KD[x.Loai] || x.Loai, soTien: Number(x.SoTien) || 0, noiDung: String(x.NoiDung || ''), nguoi: String(x.NguoiGhi || ''), luc: fmtDT_(x.ThoiGian) }; });
    return { nhom: nhomKD_(tg) ? String(tg.NhomKD) : '', bc: bcView_(bcKDRow_(tg.MaNV, thang)), tinh: tinhKD_(tg, thang, false, ds), viPham: vp,
      ct: CT_KD, heSo: heSoCK_(ts_()), apDungTu: String(ts_().KD_ApDungTu || '2026-11') };
  });
}

function luuDonKD(token, thang, d, idx) {
  const nv = auth_(token), t = ts_();
  if (!nhomKD_(nv)) throw new Error('Bạn chưa được xếp nhóm lương kinh doanh. Báo quản lý hoặc HCNS.');
  if (!/^\d{4}-\d{2}$/.test(String(thang || ''))) throw new Error('Chọn tháng.');
  d = d || {};
  const soDon = String(d.soDon || '').trim().slice(0, 60), khach = String(d.khach || '').trim().slice(0, 150);
  if (!soDon || !khach) throw new Error('Nhập số đơn và khách hàng.');
  const gt = Math.round(Number(d.giaTri) || 0);
  if (!(gt > 0)) throw new Error('Nhập giá trị đơn chưa VAT.');
  let r = bcKDRow_(nv.MaNV, thang);
  if (r && ['Nháp', 'Trả lại'].indexOf(String(r.TrangThai)) < 0) throw new Error('Báo cáo tháng này đã nộp, không sửa được. Cần sửa thì nhờ người duyệt trả lại.');
  const don = donCuaBC_(r);
  const cu = (idx !== '' && idx !== null && idx !== undefined && don[Number(idx)]) ? don[Number(idx)] : null;
  const ct = {}; CT_KD.forEach(function (c) { ct[c[0]] = !!(d.ct && d.ct[c[0]]); });
  const moi = { soDon: soDon, khach: khach, ngayGiao: /^\d{4}-\d{2}-\d{2}$/.test(String(d.ngayGiao || '')) ? d.ngayGiao : '', giaTri: gt,
    ck: Math.max(Math.round(Number(d.ck) || 0), 0), duoiSan: Math.max(Number(d.duoiSan) || 0, 0), daThu: Math.max(Math.round(Number(d.daThu) || 0), 0), conNo: Math.max(Math.round(Number(d.conNo) || 0), 0),
    ct: ct, ghiChu: String(d.ghiChu || '').trim().slice(0, 300), tep: cu ? (cu.tep || []) : [] };
  if (moi.ck > 0 && !d.file && !(cu && cu.ckDuyet)) throw new Error('Có chiết khấu thì phải đính kèm ảnh Giám đốc duyệt chiết khấu (Điều 5.3).');
  if (d.file && d.file.data) {
    const f = luuTep_('KD_FOLDER', 'HỆ THỐNG CHẤM CÔNG - CHỨNG TỪ KINH DOANH', d.file, thang + ' - ' + nv.HoTen + ' - ' + soDon + ' - ' + String(d.loaiTep || 'chứng từ'));
    moi.tep = moi.tep.concat([{ id: f.getId(), loai: String(d.loaiTep || 'Chứng từ').slice(0, 60) }]);
  }
  moi.ckDuyet = moi.tep.some(function (x) { return /chiết khấu/i.test(x.loai); }) || !!(cu && cu.ckDuyet);
  if (cu) don[Number(idx)] = moi; else don.push(moi);
  const tg = tongBC_(don, heSoCK_(t)), now = new Date();
  const c = header_(SH.BCKD).indexOf('Thang');
  if (c >= 0) sh_(SH.BCKD).getRange(1, c + 1, 2000, 1).setNumberFormat('@');
  if (r) {
    setCell_(SH.BCKD, r._row, 'DonHang', JSON.stringify(don)); setCell_(SH.BCKD, r._row, 'TongGiaTri', tg.tong); setCell_(SH.BCKD, r._row, 'DSGhiNhan', tg.ghiNhan); setCell_(SH.BCKD, r._row, 'CapNhat', now);
  } else {
    append_(SH.BCKD, { MaBC: 'BC' + Utilities.formatDate(now, TZ, 'yyMMddHHmmss') + Math.floor(Math.random() * 90 + 10), Thang: thang, MaNV: nv.MaNV, HoTen: nv.HoTen, PhongBan: nv.PhongBan,
      TrangThai: 'Nháp', DonHang: JSON.stringify(don), TongGiaTri: tg.tong, DSGhiNhan: tg.ghiNhan, LichSu: '', GhiChu: '', NgayNop: '', CapNhat: now });
  }
  return { ok: true };
}

function xoaDonKD(token, thang, idx) {
  const nv = auth_(token), r = bcKDRow_(nv.MaNV, thang);
  if (!r) throw new Error('Chưa có báo cáo.');
  if (['Nháp', 'Trả lại'].indexOf(String(r.TrangThai)) < 0) throw new Error('Báo cáo đã nộp, không xóa được.');
  const don = donCuaBC_(r); don.splice(Number(idx), 1);
  const tg = tongBC_(don, heSoCK_(ts_()));
  setCell_(SH.BCKD, r._row, 'DonHang', JSON.stringify(don)); setCell_(SH.BCKD, r._row, 'TongGiaTri', tg.tong); setCell_(SH.BCKD, r._row, 'DSGhiNhan', tg.ghiNhan); setCell_(SH.BCKD, r._row, 'CapNhat', new Date());
  return { ok: true };
}

function nopBaoCaoKD(token, thang, pin, ghiChu) {
  const nv = auth_(token);
  checkPin_(nv, pin);
  const r = bcKDRow_(nv.MaNV, thang);
  if (!r || !donCuaBC_(r).length) throw new Error('Thêm ít nhất 1 đơn hàng trước khi nộp. Tháng không có đơn thì vẫn thêm 1 dòng ghi "Không có đơn".');
  if (['Nháp', 'Trả lại'].indexOf(String(r.TrangThai)) < 0) throw new Error('Báo cáo đã nộp rồi.');
  const now = new Date();
  setCell_(SH.BCKD, r._row, 'TrangThai', 'Chờ trưởng phòng');
  setCell_(SH.BCKD, r._row, 'NgayNop', now);
  if (ghiChu) setCell_(SH.BCKD, r._row, 'GhiChu', String(ghiChu).slice(0, 500));
  setCell_(SH.BCKD, r._row, 'LichSu', (r.LichSu ? r.LichSu + '\n' : '') + fmtDT_(now) + ' · ' + nv.HoTen + ' ký PIN nộp');
  const ql = dsGmail_(nv.GmailDuyet);
  try { if (ql.length) MailApp.sendEmail({ to: ql.join(','), subject: 'Báo cáo doanh số ' + thang + ' của ' + nv.HoTen + ' chờ duyệt', htmlBody: '<p>' + esc_(nv.HoTen) + ' đã nộp báo cáo doanh số tháng ' + thang + '. Mở app, mục Tiền lương, KPI → Chốt tháng kinh doanh để duyệt.</p>' }); } catch (e) {}
  log_(nv.Gmail, 'Nộp báo cáo doanh số', thang);
  return { ok: true };
}

function dsBaoCaoKD(token, thang) {
  return coMemo_(function () {
    const nv = auth_(token), ds = rows_(SH.NV), vt = String(nv.VaiTro).trim();
    if (vt === 'NV') throw new Error('Bạn không có quyền xem.');
    const kd = ds.filter(function (x) { return nhomKD_(x) && String(x.TrangThai).trim() !== 'Nghỉ việc' && (quyenLuong_(nv) || quyenVoiNV_(nv, x) || String(x.MaNV) === String(nv.MaNV)); });
    return kd.map(function (x) {
      const r = bcKDRow_(x.MaNV, thang), k = tinhKD_(x, thang, false, ds), cn = tongNo_(donCuaBC_(r), ymd_(new Date()));
      return { conNo: cn.no, noQuaHan: cn.quaHan, noXau: cn.noXau, maNV: String(x.MaNV), ten: x.HoTen, phong: String(x.PhongBan || ''), nhom: k.tenNhom, ql: k.ql, trangThai: r ? String(r.TrangThai) : 'Chưa nộp',
        soDon: r ? donCuaBC_(r).length : 0, tong: r ? Number(r.TongGiaTri) || 0 : 0, dsGhiNhan: r ? Number(r.DSGhiNhan) || 0 : 0, dsTinh: k.dsTinh, tyLe: k.tyLe,
        hoaHong: k.hoaHong, thuongHQ: k.thuongHQ, phongToa: k.phongToa, soViPham: vpKDCua_(x.MaNV, thang).length, duocDuyet: r ? nguoiDuyetKD_(r, nv, ds) : false };
    });
  });
}

function duyetBaoCaoKD(token, thang, dsMa, dongY, ghiChu, pin) {
  const nv = auth_(token);
  checkPin_(nv, pin);
  const ds = rows_(SH.NV);
  dsMa = (Array.isArray(dsMa) ? dsMa : [dsMa]).map(String);
  if (!dongY && !String(ghiChu || '').trim()) throw new Error('Ghi lý do trả lại.');
  const now = new Date();
  let n = 0;
  rows_(SH.BCKD).forEach(function (r) {
    if (thangCua_(r.Thang) !== thang || dsMa.indexOf(String(r.MaNV)) < 0) return;
    if (!nguoiDuyetKD_(r, nv, ds)) return;
    const tt = String(r.TrangThai);
    const sau = !dongY ? 'Trả lại' : tt === 'Chờ trưởng phòng' ? 'Chờ kế toán' : tt === 'Chờ kế toán' ? 'Chờ giám đốc' : 'Đã duyệt';
    setCell_(SH.BCKD, r._row, 'TrangThai', sau);
    setCell_(SH.BCKD, r._row, 'LichSu', (r.LichSu ? r.LichSu + '\n' : '') + fmtDT_(now) + ' · ' + nv.HoTen + (dongY ? ' duyệt' : ' trả lại') + (ghiChu ? ': ' + String(ghiChu).slice(0, 300) : ''));
    n++;
    if (!dongY) { const chu = ds.find(function (x) { return String(x.MaNV) === String(r.MaNV); }); try { if (chu && chu.Gmail) MailApp.sendEmail({ to: norm_(chu.Gmail), subject: 'Báo cáo doanh số ' + thang + ' bị trả lại', htmlBody: '<p>' + esc_(nv.HoTen) + ' trả lại: ' + esc_(String(ghiChu)) + '</p><p>Mở app, mục Hiệu quả công việc để sửa và nộp lại.</p>' }); } catch (e) {} }
  });
  if (!n) throw new Error('Không có báo cáo nào đang chờ bạn duyệt.');
  log_(nv.Gmail, (dongY ? 'Duyệt' : 'Trả lại') + ' báo cáo doanh số', thang + ' · ' + n + ' báo cáo');
  return { ok: true, so: n };
}

function ghiViPhamKD(token, f, pin) {
  const nv = auth_(token);
  checkPin_(nv, pin);
  f = f || {};
  const ds = rows_(SH.NV), tg = ds.find(function (x) { return String(x.MaNV) === String(f.ma); });
  if (!tg) throw new Error('Chọn nhân viên.');
  if (!VP_KD[f.loai]) throw new Error('Chọn loại vi phạm.');
  if (!/^\d{4}-\d{2}$/.test(String(f.thang || ''))) throw new Error('Chọn tháng.');
  const vt = String(nv.VaiTro).trim();
  if (f.loai === 'D22' && vt !== 'GD') throw new Error('Chỉ Giám đốc ghi trường hợp đang xác minh gian lận.');
  if (!quyenVoiNV_(nv, tg) && vt !== 'KT') throw new Error('Bạn chỉ ghi vi phạm cho cấp dưới của mình.');
  const noiDung = String(f.noiDung || '').trim().slice(0, 1000);
  if (!noiDung) throw new Error('Ghi nội dung, số đơn liên quan.');
  const now = new Date(), c = header_(SH.VPKD).indexOf('Thang');
  if (c >= 0) sh_(SH.VPKD).getRange(1, c + 1, 2000, 1).setNumberFormat('@');
  const them = function (nguoi, soTien, nd) {
    append_(SH.VPKD, { MaVP: 'VK' + Utilities.formatDate(now, TZ, 'yyMMddHHmmss') + Math.floor(Math.random() * 900 + 100), Thang: f.thang, MaNV: nguoi.MaNV, HoTen: nguoi.HoTen,
      Loai: f.loai, SoTien: soTien, NoiDung: nd, NguoiGhi: nv.HoTen + ' (ký PIN)', ThoiGian: now, TrangThai: 'Hiệu lực' });
  };
  if (f.loai === 'D17') {
    const tong = Math.round(Number(f.soTien) || 0);
    if (!(tong > 0)) throw new Error('Nhập tổng thiệt hại theo Biên bản xác định thiệt hại.');
    them(tg, Math.round(tong * 0.35), noiDung + ' · tổng thiệt hại ' + fmtTien_(tong) + ', phần nhân viên 35%');
    const ql = ds.find(function (x) { return x.Gmail && dsGmail_(tg.GmailDuyet).indexOf(norm_(x.Gmail)) >= 0; });
    if (ql) them(ql, Math.round(tong * 0.35), noiDung + ' · tổng thiệt hại ' + fmtTien_(tong) + ', phần quản lý 35% (nhân viên ' + tg.HoTen + ')');
  } else {
    them(tg, 0, noiDung);
    if (f.loai === 'D18' || f.loai === 'D19') { const ql = ds.find(function (x) { return x.Gmail && dsGmail_(tg.GmailDuyet).indexOf(norm_(x.Gmail)) >= 0; }); if (ql && nhomKD_(ql)) them(ql, 0, noiDung + ' (liên đới, nhân viên ' + tg.HoTen + ')'); }
  }
  try { if (tg.Gmail) MailApp.sendEmail({ to: norm_(tg.Gmail), subject: 'Ghi nhận vi phạm quy chế bán hàng tháng ' + f.thang, htmlBody: '<p>' + esc_(VP_KD[f.loai]) + '</p><p>' + esc_(noiDung) + '</p><p>Bạn có quyền giải trình theo Nội quy lao động.</p>' }); } catch (e) {}
  log_(nv.Gmail, 'Ghi vi phạm quy chế bán hàng', tg.HoTen + ' ' + f.loai);
  return { ok: true };
}

function goViPhamKD(token, ma, pin, lyDo) {
  const nv = auth_(token);
  checkPin_(nv, pin);
  const vt = String(nv.VaiTro).trim();
  if (['GD', 'KT', 'HCNS'].indexOf(vt) < 0) throw new Error('Chỉ Giám đốc, kế toán, HCNS được gỡ.');
  const r = rows_(SH.VPKD).find(function (x) { return String(x.MaVP) === String(ma); });
  if (!r) throw new Error('Không tìm thấy.');
  if (r.Loai === 'D22' && vt !== 'GD') throw new Error('Chỉ Giám đốc gỡ trường hợp xác minh gian lận.');
  setCell_(SH.VPKD, r._row, 'TrangThai', 'Đã gỡ');
  setCell_(SH.VPKD, r._row, 'NoiDung', String(r.NoiDung) + ' | Gỡ ' + fmtDT_(new Date()) + ' bởi ' + nv.HoTen + (lyDo ? ': ' + String(lyDo).slice(0, 200) : ''));
  log_(nv.Gmail, 'Gỡ vi phạm quy chế bán hàng', ma);
  return { ok: true };
}

function kdChoToi_(nv) {
  try {
    const ds = rows_(SH.NV);
    return rows_(SH.BCKD).filter(function (r) { return ['Chờ trưởng phòng', 'Chờ kế toán', 'Chờ giám đốc'].indexOf(String(r.TrangThai)) >= 0 && nguoiDuyetKD_(r, nv, ds); })
      .map(function (r) { return { thang: thangCua_(r.Thang), ten: String(r.HoTen) }; });
  } catch (e) { return []; }
}

function xemTepKD(token, maNV, thang, id) {
  const nv = auth_(token);
  const tg = rows_(SH.NV).find(function (x) { return String(x.MaNV) === String(maNV); });
  if (!tg) throw new Error('Không tìm thấy nhân viên.');
  if (String(tg.MaNV) !== String(nv.MaNV) && !quyenVoiNV_(nv, tg) && !quyenLuong_(nv)) throw new Error('Bạn không có quyền xem chứng từ này.');
  const co = donCuaBC_(bcKDRow_(maNV, thang)).some(function (d) { return (d.tep || []).some(function (x) { return x.id === id; }); });
  if (!co) throw new Error('Không tìm thấy chứng từ.');
  const f = DriveApp.getFileById(id), b = f.getBlob();
  return { mime: b.getContentType(), data: Utilities.base64Encode(b.getBytes()), ten: f.getName() };
}

function datNhomKD(token, ma, nhom, quy) {
  const nv = auth_(token);
  const tg = rows_(SH.NV).find(function (x) { return String(x.MaNV) === String(ma); });
  if (!tg) throw new Error('Không tìm thấy nhân viên.');
  if (!quyenVoiNV_(nv, tg)) throw new Error('Bạn chỉ xếp nhóm cho cấp dưới của mình.');
  const v = NHOM_KD[nhom] ? nhom : '';
  setCell_(SH.NV, tg._row, 'NhomKD', v);
  setCell_(SH.NV, tg._row, 'HoaHongQuy', quy ? 'Có' : '');
  log_(nv.Gmail, 'Xếp nhóm lương kinh doanh', tg.HoTen + ': ' + (v || 'bỏ') + (quy ? ', hoa hồng theo quý' : ''));
  return { ok: true };
}

function vxView_(r, today) {
  const han = r.HanChot ? ymd_(r.HanChot) : '';
  return { ma: String(r.MaVX), ngayGiao: fmtDT_(r.NgayGiao), nguoiGiao: String(r.NguoiGiao || ''), maNV: String(r.MaNV), ten: String(r.HoTen || ''),
    noiDung: String(r.NoiDung || ''), han: han ? ymdToVN_(han) : '', trangThai: String(r.TrangThai || ''), ngayNhan: r.NgayNhan ? fmtDT_(r.NgayNhan) : '',
    ngayXong: r.NgayXong ? fmtDT_(r.NgayXong) : '', ghiChu: String(r.GhiChu || ''), quaHan: !!han && han < today && r.TrangThai !== 'Hoàn thành' && r.TrangThai !== 'Đã hủy' };
}

function viecDX_(nv) {
  try {
    const today = ymd_(new Date()), moc = Date.now() - 7 * 864e5;
    const conHien = function (r) { return r.TrangThai !== 'Đã hủy' && (r.TrangThai !== 'Hoàn thành' || (r.NgayXong && new Date(r.NgayXong).getTime() > moc)); };
    const ds = rows_(SH.VX);
    return {
      choToi: ds.filter(function (r) { return String(r.MaNV) === String(nv.MaNV) && conHien(r); }).reverse().slice(0, 20).map(function (r) { return vxView_(r, today); }),
      toiGiao: ds.filter(function (r) { return norm_(r.GmailGiao) === norm_(nv.Gmail) && conHien(r); }).reverse().slice(0, 30).map(function (r) { return vxView_(r, today); })
    };
  } catch (e) { return { choToi: [], toiGiao: [] }; }
}

function giaoViecDX(token, f, pin) {
  const nv = auth_(token);
  checkPin_(nv, pin);
  f = f || {};
  const noiDung = String(f.noiDung || '').trim().slice(0, 1000);
  if (!noiDung) throw new Error('Nhập hoặc nói nội dung công việc.');
  const dsMa = (Array.isArray(f.dsMa) ? f.dsMa : [f.dsMa]).map(String).filter(String);
  if (!dsMa.length) throw new Error('Chọn người nhận việc.');
  const han = /^\d{4}-\d{2}-\d{2}$/.test(String(f.han || '')) ? f.han : '';
  const ds = rows_(SH.NV), now = new Date();
  const c = header_(SH.VX).indexOf('HanChot');
  if (c >= 0) sh_(SH.VX).getRange(1, c + 1, 2000, 1).setNumberFormat('@');
  const ten = [];
  dsMa.forEach(function (ma, k) {
    const tg = ds.find(function (r) { return String(r.MaNV) === ma; });
    if (!tg) throw new Error('Không tìm thấy nhân viên ' + ma + '.');
    if (!quyenVoiNV_(nv, tg)) throw new Error('Bạn không có quyền giao việc cho ' + tg.HoTen + '.');
    append_(SH.VX, { MaVX: 'VX' + Utilities.formatDate(now, TZ, 'yyMMddHHmmss') + k + Math.floor(Math.random() * 90 + 10), NgayGiao: now, NguoiGiao: nv.HoTen, GmailGiao: norm_(nv.Gmail),
      MaNV: tg.MaNV, HoTen: tg.HoTen, NoiDung: noiDung, HanChot: han, TrangThai: 'Chờ nhận' });
    ten.push(tg.HoTen);
    if (tg.Gmail) { try { MailApp.sendEmail({ to: norm_(tg.Gmail), subject: 'Việc giao đột xuất từ ' + nv.HoTen, htmlBody: '<p>' + esc_(nv.HoTen) + ' giao việc cho bạn' + (han ? ', hạn ' + ymdToVN_(han) : '') + ':</p><p><b>' + esc_(noiDung) + '</b></p><p>Mở app, bấm <b>Nhận việc</b> và nhập mã PIN để xác nhận.</p>' }); } catch (e) {} }
  });
  log_(nv.Gmail, 'Giao việc đột xuất', ten.join(', ') + ': ' + noiDung.slice(0, 80));
  return { ok: true, soNguoi: ten.length };
}

function capNhatViecDX(token, maVX, hd, pin, ghiChu) {
  const nv = auth_(token);
  checkPin_(nv, pin);
  const r = rows_(SH.VX).find(function (x) { return String(x.MaVX) === String(maVX); });
  if (!r) throw new Error('Không tìm thấy việc.');
  const now = new Date(), gc = String(ghiChu || '').trim().slice(0, 300);
  if (hd === 'nhan' || hd === 'xong') {
    if (String(r.MaNV) !== String(nv.MaNV)) throw new Error('Chỉ người được giao mới nhận hoặc báo xong việc này.');
    if (hd === 'nhan') { if (r.TrangThai !== 'Chờ nhận') throw new Error('Việc này đã được nhận.'); setCell_(SH.VX, r._row, 'TrangThai', 'Đang làm'); setCell_(SH.VX, r._row, 'NgayNhan', now); }
    else {
      setCell_(SH.VX, r._row, 'TrangThai', 'Hoàn thành'); setCell_(SH.VX, r._row, 'NgayXong', now);
      if (!r.NgayNhan) setCell_(SH.VX, r._row, 'NgayNhan', now);
      try { if (r.GmailGiao) MailApp.sendEmail({ to: r.GmailGiao, subject: nv.HoTen + ' đã hoàn thành việc giao', htmlBody: '<p><b>' + esc_(String(r.NoiDung)) + '</b></p>' + (gc ? '<p>Ghi chú: ' + esc_(gc) + '</p>' : '') }); } catch (e) {}
    }
  } else if (hd === 'huy') {
    if (norm_(r.GmailGiao) !== norm_(nv.Gmail) && String(nv.VaiTro).trim() !== 'GD') throw new Error('Chỉ người giao mới hủy được việc này.');
    setCell_(SH.VX, r._row, 'TrangThai', 'Đã hủy');
  } else throw new Error('Thao tác không hợp lệ.');
  if (gc) setCell_(SH.VX, r._row, 'GhiChu', (r.GhiChu ? r.GhiChu + ' | ' : '') + gc);
  log_(nv.Gmail, 'Việc đột xuất: ' + hd, maVX);
  return { ok: true };
}

function thongBao(token) {
  return coMemo_(function () {
    const nv = auth_(token), t = ts_(), today = ymd_(new Date());
    const dons = rows_(SH.DON);
    const cho = dons.filter(function (d) { return d.TrangThai === 'Chờ duyệt' && coQuyenDuyet_(nv, d); }).length;
    const cua = dons.filter(function (d) { return String(d.MaNV) === String(nv.MaNV) && d.TrangThai !== 'Chờ duyệt'; }).slice(-8)
      .map(function (d) { return { ma: String(d.MaDon), loai: String(d.LoaiDon), tt: String(d.TrangThai) }; });
    const cc = rows_(SH.CC).filter(function (r) { return String(r.MaNV) === String(nv.MaNV) && ymd_(r.ThoiGian) === today; });
    let vx = 0;
    try { vx = rows_(SH.VX).filter(function (r) { return String(r.MaNV) === String(nv.MaNV) && r.TrangThai === 'Chờ nhận'; }).length; } catch (e) {}
    return { cho: cho, luong: choDuyetLuong_(nv).length, vx: vx, cua: cua, vao: cc.some(function (r) { return r.Loai === 'VAO'; }),
      ra: cc.some(function (r) { return r.Loai === 'RA'; }), gioVao: t.GioVao || '08:00', gioRa: t.GioRa || '17:00', ngay: today };
  });
}

function SAO_LUU_HANG_NGAY() {
  const it = DriveApp.getFoldersByName('SAO LƯU HỆ THỐNG CHẤM CÔNG');
  const folder = it.hasNext() ? it.next() : DriveApp.createFolder('SAO LƯU HỆ THỐNG CHẤM CÔNG');
  const ten = 'SAO LƯU DỮ LIỆU CHẤM CÔNG ' + Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH-mm');
  DriveApp.getFileById(ss_().getId()).makeCopy(ten, folder);
  const ds = [];
  const fi = folder.getFiles();
  while (fi.hasNext()) { const f = fi.next(); if (f.getName().indexOf('SAO LƯU DỮ LIỆU CHẤM CÔNG') === 0) ds.push(f); }
  ds.sort(function (a, b) { return b.getDateCreated() - a.getDateCreated(); });
  ds.slice(30).forEach(function (f) { f.setTrashed(true); });
  Logger.log('Đã sao lưu: ' + ten + ' (giữ ' + Math.min(ds.length, 30) + ' bản)');
}

function CAI_SAO_LUU_TU_DONG() {
  ScriptApp.getProjectTriggers().forEach(function (tr) { if (tr.getHandlerFunction() === 'SAO_LUU_HANG_NGAY') ScriptApp.deleteTrigger(tr); });
  ScriptApp.newTrigger('SAO_LUU_HANG_NGAY').timeBased().everyDays(1).atHour(1).inTimezone(TZ).create();
  SAO_LUU_HANG_NGAY();
  Logger.log('XONG CAI SAO LUU');
}
