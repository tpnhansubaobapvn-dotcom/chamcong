# NHẬT KÝ PHỐI HỢP CLAUDE - ALADDIN - PHIÊN BẢN SỬA LẦN 1

Hai trợ lý cùng làm cho anh Phát: Claude (app chấm công trên Apps Script, web tuyendung.capvina.vn) và Aladdin (mua.capvina.vn). Ai làm gì ảnh hưởng tới bên kia thì ghi một dòng vào đây, mới nhất ở trên. Không ghi lương, mật khẩu, số liệu cá nhân vào tệp này.

## Mục tiêu chung anh Phát chốt ngày 20/11/2026
1. An toàn.
2. Tiện cho người dùng.
3. Quản lý, quản trị dễ.
4. Đào tạo nhanh, có danh mục, làm một lần dùng mãi cho người mới.
5. Phòng Hành chính nhân sự quản lý được bảo hiểm xã hội và hồ sơ ngay trên hệ thống.

## Trạng thái hiện tại
- App chấm công đang chạy: giao diện bản 103, mã máy chủ bản 80. Claude giữ nguyên, không lên bản mới trong lúc Aladdin sao chép, trừ lỗi gấp và sẽ ghi vào đây.
- App cũ là số liệu chính thức trong tháng chạy song song.

## Nhật ký
- 20/11/2026 22:15, Claude: gỡ bảng mức lương nhóm kinh doanh khỏi tài liệu cách tính (kho đang công khai); số vẫn nằm trong hằng NHOM_KD của mã ở dự án Apps Script.
- 20/11/2026 22:15, Claude: kế hoạch dọn kho công khai, làm khi máy văn phòng mở: (1) tạo kho riêng tư chứa toàn bộ mã nguồn và tài liệu, thêm capvina-vn; (2) kho chamcong công khai chỉ giữ 3 tệp vỏ index.html, sw.js, manifest.webmanifest, xóa thư mục MA-NGUON và lịch sử; (3) thêm capvina-vn quyền Write vào kho tuyendung; (4) rà quyền chia sẻ Sheet, Drive nhân sự, gỡ người đã nghỉ. Aladdin lấy mã từ dự án Apps Script (Mã.gs, Index.html) nếu kho đã dọn.
- 20/11/2026 21:40, Claude: thêm hai tài liệu bàn giao ở gốc kho chamcong (bàn giao mã nguồn; cách tính công, phép, chuyên cần, lương, KPI).
- 19/11/2026, Claude: bản 102 (ẩn thông báo đã đọc), bản 103 (sửa nút hiện mật khẩu tài khoản); rà lỗi trước khi bàn giao.

## Việc chờ Aladdin
- Chuyển mức lương, nấc hoa hồng từ mã sang bảng tham số: Claude đề nghị làm ở bản web mới, không sửa app cũ trước kỳ lương tháng 11. Aladdin thấy cần sửa cả app cũ thì ghi vào đây.

- 21/11/2026 (Ali): theo yêu cầu anh Phát, mã máy chủ lên bản sửa lần 81. Thay đổi duy nhất: hàm `uvXem_` cho trưởng phòng Kinh doanh Xích neo xem được mọi ứng viên khối kinh doanh (trước đây chỉ thấy vị trí có chữ "xích"). Trưởng phòng Kinh doanh cáp thép giữ nguyên. Giao diện không đổi (vẫn 103). Aladdin khi sao chép nhớ lấy quy tắc mới này.
- 21/11/2026 (Ali): mã máy chủ lên bản sửa lần 82. Anh Phát chốt lại: hai trưởng phòng kinh doanh (cáp thép và xích neo) xem được ứng viên khối kinh doanh của nhau. Hàm `uvXem_` bỏ hẳn điều kiện tách theo chữ "xích". Các khối khác giữ nguyên: trưởng phòng chỉ thấy ứng viên khối mình.

## 21/11/2026 14:17 – Code 83, giao diện 104 (bản triển khai Apps Script số 89)
- Lỗi anh Phát báo bằng video: bấm nút Zalo trên hồ sơ ứng viên thì điện thoại nhảy qua lại giữa trình duyệt và Zalo, không vào được khung chat. Nguyên nhân: cột SDT trong tab UngVien bị Sheet lưu thành số nên mất số 0 đầu (0898689569 thành 898689569), đường dẫn zalo.me sai số.
- Sửa: thêm hàm `sdtUV_` chuẩn hóa số khi đọc (9 số thì thêm 0; 84… thì đổi về 0…); khi ghi hồ sơ mới lưu SDT dạng chữ; so trùng hồ sơ theo số đã chuẩn hóa.
- Thêm: nút "Ghi lại trao đổi" trên thẻ ứng viên (3 chỗ) – ghi nội dung đã nhắn Zalo, gọi điện, phỏng vấn vào cột GhiChu kèm ngày giờ, người ghi, không đổi trạng thái (`capNhatUngVien` nhận thêm tt = 'Ghi chú', tối đa 2000 ký tự); lịch sử GhiChu hiện ngay dưới các nút.
- Aladdin làm theo trên web: (1) số điện thoại ứng viên phải lưu dạng chữ, giữ số 0 đầu; (2) có ô ghi lại trao đổi và hiện lịch sử trên hồ sơ ứng viên.
