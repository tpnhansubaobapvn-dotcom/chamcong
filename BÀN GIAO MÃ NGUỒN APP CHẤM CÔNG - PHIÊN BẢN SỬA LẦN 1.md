# BÀN GIAO MÃ NGUỒN APP CHẤM CÔNG - PHIÊN BẢN SỬA LẦN 1

Ngày chốt: 19/11/2026 (tối). Dùng để sao chép sang mua.capvina.vn.

## Bản đang chạy
- Giao diện: phiên bản sửa lần 103. Mã máy chủ (Apps Script): phiên bản sửa lần 81.
- Hai tệp nguồn mới nhất luôn là `MA-NGUON/index-moi-nhat.html` (giao diện) và `MA-NGUON/code-moi-nhat.gs` (máy chủ). Các tệp "PHIÊN BẢN SỬA LẦN N" là bản lưu từng lần sửa.
- `index.html`, `sw.js`, `manifest.webmanifest` ở gốc kho là trang vỏ trên GitHub Pages, tự tải giao diện từ Apps Script.

## Dữ liệu
Toàn bộ dữ liệu nằm trong một Google Sheet, mỗi trang tính là một bảng. Tên bảng khai trong hằng `SH`, tên cột khai trong hằng `HEADERS` ở đầu `code-moi-nhat.gs`:
NhanVien, DiemChamCong, ThamSo, ChamCong, DonTu, NhatKy, QuyChe, MoTaCongViec, BacLuong, SoLieuThang, NgayLe, ViPham, GiaoViec, DonHangLoi, VinhDanh, HopDong, BanGiao, HoSoNV, TaiSan, TaiSanLog, ViecDotXuat, BaoCaoKD, ViPhamKD, DaoTao, DaoTaoHoc, DeXuatDaoTao, DaoTaoBinhLuan, UngVien, LichViecHCNS, VanBanKy, ThongBaoCT, ThongBaoDoc, DaoTaoMo.
Tệp đính kèm (ảnh chấm công, chứng từ, tài liệu đào tạo) nằm trong các thư mục Google Drive, mã thư mục lưu ở Script Properties.

## Phân quyền
Cột `VaiTro` của NhanVien: GD (Giám đốc, quản trị), HCNS, KT (kế toán), TP (trưởng phòng), NV. Mọi hàm máy chủ nhận `token` và tự kiểm quyền bằng `auth_`.

## Quy tắc bắt buộc giữ khi làm lại
- Mỗi nhân viên chỉ thấy lương của mình; bảng lương chỉ GD, HCNS, kế toán xem.
- Trưởng phòng chỉ thấy ứng viên, nhân viên của phòng mình.
- Báo sự cố giữa các phòng: Kinh doanh không thấy sự cố của Vật tư, Kho, Kế toán (hàm `xemDH_`, `nhomDH_`).
- Không chuyển mật khẩu, mã PIN (các cột `PinHash`, `MatKhauHash`, cột `MatKhau` của TaiSan).
- Chấm công chỉ tính khi trong phạm vi điểm chấm công và có ảnh.

## Đã kiểm tra tối 19/11/2026
- Hai tệp không lỗi cú pháp; không còn hàm tạm; mọi lời gọi từ giao diện đều có hàm tương ứng ở máy chủ.
- Chạy thật 21 hàm đọc dữ liệu bằng 4 vai trò (GD, HCNS, TP, NV): không hàm nào lỗi.
- Đã sửa: nút "Hiện" mật khẩu tài khoản công ty trong mục tài sản gọi hàm chưa được viết.

## Điểm yếu đã biết (nên làm tốt hơn ở bản mới)
- Tải trang đầu chậm, khoảng 8 đến 9 giây cho một lần `taiDuLieu`, do đọc Google Sheet.
- Ẩn thông báo đã đọc chỉ lưu trên từng máy (localStorage), chưa theo tài khoản.
- Các hàm ghi dữ liệu (nộp đơn, chấm công, duyệt, ký) chưa có bộ kiểm thử tự động.
