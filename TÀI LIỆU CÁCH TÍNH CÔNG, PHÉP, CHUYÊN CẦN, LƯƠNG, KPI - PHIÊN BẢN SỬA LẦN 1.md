# TÀI LIỆU CÁCH TÍNH CÔNG, PHÉP, CHUYÊN CẦN, LƯƠNG, KPI - PHIÊN BẢN SỬA LẦN 1

Viết ngày 20/11/2026, theo đúng mã máy chủ phiên bản sửa lần 80 (`MA-NGUON/code-moi-nhat.gs`). Tài liệu mô tả app ĐANG tính thế nào. Chỗ nào khác với Quy chế lương, Nội quy bản giấy thì hỏi lại anh Phát trước khi làm theo. Tên hàm ghi trong ngoặc để đối chiếu mã.

Tham số lấy từ bảng `ThamSo`; số ghi dưới đây là giá trị mặc định trong mã khi bảng để trống.

## 1. Chấm công (`chamCong`, `chamCongAnh`)
- Mỗi ngày: lần chấm đầu là VAO, các lần sau là RA; giờ ra tính theo lần RA cuối cùng.
- Phải trong bán kính của điểm chấm công được gán cho nhân viên (cột `BanKinh_m` của điểm, mặc định 50 m). Sai số GPS trên 300 m thì từ chối. Chấm công chính thức là chấm kèm ảnh.
- Giờ vào chuẩn `GioVao` 08:00. Đi trễ = số phút sau giờ vào, nếu vượt `PhutChoPhepTre` (mặc định 0).
- Giờ ra chuẩn `GioRa` 17:00. Thứ bảy: khối Văn phòng 12:00 (`GioRaThu7VP`), khối Kho 17:00 (`GioRaThu7Kho`). Về sớm = số phút trước giờ ra.
- Khối (`khoi_`): cột `Khoi` của nhân viên; để trống thì phòng "Kho" là KHO, còn lại là VP.

## 2. Ngày công chuẩn (`heSoNgay_`, `soNgayChuan_`)
- Thứ hai đến thứ sáu: 1 công. Chủ nhật: 0.
- Thứ bảy: khối Kho 1 công, khối Văn phòng 0,5 công.
- Ngày lễ trong bảng `NgayLe` không tính vào công chuẩn.
- Công chuẩn của tháng = tổng hệ số các ngày trong tháng, trừ ngày lễ.

## 3. Phép năm (`phepConLai_`, `phepDaDung_`)
- Cách mới (khi `ThamSo.MocPhep` có dạng yyyy-MM): mỗi tháng được `PhepMoiThang` ngày (mặc định 1), tính từ tháng mốc, hoặc từ tháng vào làm nếu vào sau mốc, cộng `PhepTon` của nhân viên. Đã dùng = các đơn "Nghỉ phép năm" trạng thái Chờ duyệt hoặc Đã duyệt từ mốc.
- Cách cũ (không có mốc): tổng = `PhepNam` (mặc định 12 ngày mỗi năm); đã dùng = đơn nghỉ phép năm cộng phần nghỉ ốm trả bằng phép (cột `TinhPhep`) trong năm.
- Đang thử việc: phép vẫn tích lũy nhưng số còn dùng được là 0.

## 4. Các loại đơn nghỉ và giấy tờ
- Loại đơn: Nghỉ phép năm, Nghỉ không lương, Nghỉ đột xuất, Nghỉ ốm đau, Nghỉ thai sản khám thai, Nghỉ việc riêng có lương, Tăng ca, Tạm ứng lương, Trình duyệt, Đánh giá KPI, Xin nghỉ việc.
- Có lương khi tính công: Nghỉ phép năm, Nghỉ đột xuất, Nghỉ việc riêng có lương. Nghỉ ốm của người chưa tham gia BHXH: các ngày đầu được trả bằng phép năm theo cột `TinhPhep`, phần còn lại không lương.
- Nghỉ đột xuất và Nghỉ ốm đau phải bổ sung giấy tờ trong 3 ngày làm việc sau ngày nghỉ cuối (`hanGiayTo_`); quá hạn thì bị tính điểm chuyên cần (mục 5).

## 5. Điểm chuyên cần (`chuyenCan_`)
Tính theo tháng, cộng dồn điểm:
- Đi trễ hoặc về sớm đến 5 phút: 3 lần đầu trong tháng 0 điểm, từ lần thứ 4 mỗi lần 0,5 điểm.
- Trên 5 đến 15 phút: 1 điểm. Trên 15 đến 30 phút: 2 điểm. Trên 30 đến 60 phút: 3 điểm. Trên 60 phút: 4 điểm.
- Có giờ vào nhưng thiếu giờ ra (ngày đã qua): 4 điểm.
- Từ ngày `CC_VangTu` (mặc định 19/11/2026):
  - Nghỉ đột xuất, nghỉ ốm quá hạn mà không có giấy tờ: 5 điểm mỗi ngày, nghỉ nửa ngày 4 điểm.
  - Ngày làm việc không chấm công và không có đơn: 7 điểm mỗi ngày (chỉ xét khi trong tháng người đó có chấm công ít nhất một lần).
- Tỷ lệ hưởng chuyên cần: đến 2 điểm hưởng 100%; từ 7 điểm trở lên 0%; ở giữa cứ mỗi 0,5 điểm vượt quá 2 thì trừ 10%.
- 0 điểm cả tháng và có đi làm: thêm "chuyên cần xuất sắc" bằng 40% mức chuyên cần tối đa.

## 6. Cơ cấu lương (`coCauLuong_`, bảng `BacLuong`)
Mỗi nhân viên có một Bậc; bảng `BacLuong` cho từng bậc: Nhóm (A, B, C), LuongCB, AnTrua, XangXe, KPIToiDa, CCToiDa.
- Thâm niên: mỗi năm đủ `PhuCapThamNien` 100.000 đ, tối đa 20 năm, cộng vào lương cơ bản; thử việc không có.
- Thử việc: lương cơ bản = 85% lương bậc, không thấp hơn `LuongToiThieuVung` 5.310.000 đ. Các khoản phụ cấp, KPI, chuyên cần nhân hệ số thử việc (`hsTV_`): 0,85 nếu cả tháng thử việc; tháng hết thử việc giữa chừng thì chia theo số ngày.
- Nhóm C (kinh doanh) không có xăng xe.
- BHXH, BHYT, BHTN phần người lao động: `TyLeBHNLD` 10,5% trên lương cơ bản; thử việc 0.

## 7. Bảng lương tháng (`lapBangLuong_`)
Với mỗi nhân viên chưa nghỉ việc:
- Ngày làm thực tế = tổng hệ số các ngày có chấm VAO. Ngày tính lương = ngày làm thực tế + ngày nghỉ có lương (nửa ngày tính một nửa). Đang thử việc: ngày nghỉ không có lương.
- (2) Lương theo công = lương cơ bản hợp đồng ÷ công chuẩn × ngày tính lương.
- (3a) Ăn giữa ca = AnTrua × hệ số thử việc ÷ công chuẩn × ngày làm thực tế.
- (3b) Xăng xe = tương tự, nhóm C bằng 0.
- (4) Thưởng hiệu suất:
  - Nhóm A, B: điểm KPI tháng (bảng `SoLieuThang`, loại "Điểm KPI"). Dưới 50 điểm: 0. Từ 50: KPIToiDa × điểm ÷ 100, tối đa 100 điểm.
  - Kinh doanh theo quy chế mới: xem mục 8.
  - Nhóm C kiểu cũ: bậc C.1, C.2 được đủ KPIToiDa nếu "Đạt 4b" = Có; bậc khác lấy "Tiền 4c", không vượt KPIToiDa.
- (5) Chuyên cần = CCToiDa × hệ số thử việc × tỷ lệ chuyên cần. (5b) Chuyên cần xuất sắc theo mục 5.
- (8) Hoa hồng: kinh doanh theo mục 8.
- Thưởng khác, Khấu trừ khác: cộng các dòng "Thưởng", "Khấu trừ" trong `SoLieuThang`.
- Tăng ca: lương giờ = lương cơ bản ÷ công chuẩn ÷ giờ chuẩn (Văn phòng 7,5 giờ, Kho 7 giờ). Ngày thường × 1,5; chủ nhật × 2; ngày lễ × 3. Lấy từ đơn "Tăng ca" đã duyệt.
- Tổng thu nhập = (2) + (3a) + (3b) + (4) + (5) + (5b) + (8) + thưởng khác + tăng ca.
- Thực lĩnh = tổng thu nhập − bảo hiểm − thuế TNCN (kế toán nhập tay) − tạm ứng (đơn "Tạm ứng lương" đã duyệt trong tháng) − khấu trừ khác.
- Kết quả ghi ra trang tính "BL yyyy-MM". Trạng thái: Nháp, khóa khi đã nhập tay, trình duyệt, duyệt chi theo từng công ty, công bố. Đã công bố thì không lập lại. Nhân viên chỉ xem phiếu lương của mình (`phieuLuong`).

## 8. Kinh doanh theo quy chế mới (`tinhKD_`, áp dụng từ tháng `KD_ApDungTu`, mặc định 2026-11)
Nhóm kinh doanh (cột `NhomKD`), mỗi tháng:

| Nhóm | Lương | Phụ cấp | Thưởng hiệu quả tối đa | Chuyên cần tối đa |
|---|---|---|---|---|
| KD_CAO, kinh nghiệm cao | 6.000.000 | 1.200.000 | 1.400.000 | 400.000 |
| KD_MOI, dưới 3 năm | 5.700.000 | 1.200.000 | 1.400.000 | 200.000 |
| QL45, quản lý 4 đến 5 người | 7.000.000 | 1.200.000 | 5.500.000 | 750.000 |
| QL6, quản lý trên 6 người | 7.000.000 | 1.200.000 | 7.500.000 | 750.000 |

- Doanh số ghi nhận của một đơn (`dsDon_`): phải đủ 6 chứng từ (đơn đặt hàng ký đóng dấu, biên bản giao nhận, biên bản nghiệm thu, ảnh giao nhận, ảnh hàng đã giao, bản gốc nộp Kế toán); thiếu thì đơn bị treo, ghi nhận 0. Giá trị ghi nhận = (giá trị đơn − chiết khấu × `HeSoChietKhau` 8,67) × tỷ lệ theo mức bán dưới giá sàn: không dưới sàn 100%; dưới 5% còn 70%; dưới 10% còn 60%; dưới 15% còn 50%; từ 15% còn 40%.
- Quản lý tính theo doanh số đội: của mình cộng các nhân viên kinh doanh có người duyệt là mình.
- Hoa hồng (`nacHH_`, chuỗi `NacHoaHong` mặc định "400:1, 800:1.2, 1000:1.4, 2000:1.6, 4000:1.8, 8000:2", đơn vị triệu đồng : phần trăm): tỷ lệ theo nấc doanh số, nhân trên toàn bộ doanh số tính hoa hồng. Quản lý dùng `NacHoaHongQL` nếu có. Người có `HoaHongQuy` = Có: tính theo quý, chi vào tháng cuối quý, tỷ lệ theo doanh số bình quân tháng của quý.
- Thưởng hiệu quả: doanh số dưới mức tối thiểu (nhân viên 200 triệu, quản lý 2 tỷ) thì 0; chưa có điểm KPI hoặc KPI dưới 50 thì 0; còn lại = mức tối đa × điểm KPI ÷ 100.
- Vi phạm: Điều 19 hoặc Điều 23.4 mỗi lần trừ 50% thưởng hiệu quả; Điều 17 trừ số tiền thiệt hại vào hoa hồng rồi thưởng hiệu quả, phần còn thiếu xử lý bồi thường theo Nội quy; Điều 18 (nợ xấu) phong tỏa, tạm giữ thưởng và hoa hồng.
- Báo cáo doanh số tháng chưa được duyệt đủ thì chưa chi thưởng, hoa hồng.

Kinh doanh kiểu cũ (trước tháng áp dụng): hoa hồng = "Doanh số thực thu" × tỷ lệ theo bậc (`tyLeHH_`).

## 9. Hai pháp nhân
Cột `CongTy` của nhân viên: CAP là Công ty CP SX Dây Cáp Thép Việt Nam, còn lại là Bao Báp. Bảng lương được trình và duyệt chi riêng theo từng công ty.

## 10. Chỗ cần xác nhận lại với anh Phát khi làm bản mới
- Các con số trong mục 5, 6, 8 lấy từ mã và bảng tham số, chưa đối chiếu từng dòng với Quy chế lương bản ký mới nhất.
- Thuế TNCN hiện do kế toán nhập tay, app không tự tính.
- Hiệu quả công việc và trừ tiền theo vi phạm cho Phòng Vật tư: anh Phát đang rà soát, chưa đưa vào app.
