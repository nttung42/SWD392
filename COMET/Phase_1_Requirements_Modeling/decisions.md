# NHẬT KÝ QUYẾT ĐỊNH YÊU CẦU (REQUIREMENTS DECISION LOG - ADR)

File này ghi lại tất cả các quyết định nghiệp vụ, phạm vi phần mềm và giải pháp công nghệ đã được chốt giữa bạn (Con người) và AI Agent trong giai đoạn **Phase 1: Requirements Modeling** của Dự án **Hệ thống Điểm danh Chống Gian lận**.

---

## 📝 DANH SÁCH CÁC QUYẾT ĐỊNH ĐÃ GHI NHẬN (DECISION LIST)

### 📌 [REQ-ADR-001]: Đa nền tảng cho phân hệ Sinh viên
*   **Ngày quyết định:** 2026-05-26
*   **Trạng thái:** Đã phê duyệt
*   **Bối cảnh (Context):** Sinh viên có các thiết bị di động khác nhau chạy hệ điều hành khác nhau (iOS, Android). Một số sinh viên có thể muốn sử dụng trình duyệt Web di động khi máy điện thoại hết dung lượng hoặc không muốn cài app.
*   **Quyết định đề xuất (Decision):** 
    *   Phát triển đa nền tảng: Cung cấp cả **Mobile App** (React Native hoặc Flutter) và **Mobile Web Responsive**.
    *   *Lưu ý:* Phân hệ Mobile App sẽ là ưu tiên cao nhất cho chống gian lận (vì có quyền truy cập sâu vào phần cứng để lấy Device UUID và Face ID), còn Mobile Web sẽ có một số hạn chế về quyền phần cứng và có cơ chế cảnh báo mức độ tin cậy thấp hơn.

### 📌 [REQ-ADR-002]: Hệ quản trị cơ sở dữ liệu
*   **Ngày quyết định:** 2026-05-26
*   **Trạng thái:** Đã phê duyệt
*   **Bối cảnh (Context):** Hệ thống phục vụ quy mô ~8.000 sinh viên, đòi hỏi tính toàn vẹn dữ liệu cực kỳ cao cho nghiệp vụ điểm danh và khả năng mở rộng tốt.
*   **Quyết định đề xuất (Decision):** Sử dụng hệ quản trị cơ sở dữ liệu quan hệ **PostgreSQL** để đảm bảo hiệu năng cao, hỗ trợ tốt các kiểu dữ liệu địa lý (PostGIS nếu mở rộng sau này) và tính toàn vẹn ACID.

### 📌 [REQ-ADR-003]: Cơ chế Geofencing Điểm (GPS Point) & Bán kính cấu hình động (Dynamic Radius)
*   **Ngày quyết định:** 2026-05-26
*   **Trạng thái:** Đã phê duyệt
*   **Bối cảnh (Context):** Mỗi phòng học trong trường có kích thước khác nhau (Giảng đường lớn so với phòng lab nhỏ). Hơn nữa, sai số GPS tại các vị trí phòng học bị che khuất trong nhà là khác nhau.
*   **Quyết định đề xuất (Decision):**
    *   Mỗi phòng học trong danh mục của Admin sẽ được cấu hình bằng 1 tọa độ điểm GPS gốc (Kinh độ, Vĩ độ).
    *   Đi kèm thuộc tính **Bán kính sai số động (Dynamic Radius)** tính bằng mét (ví dụ: Giảng đường lớn config 35m, phòng lab nhỏ config 15m). Hệ thống sẽ tính khoảng cách bằng công thức Haversine và so sánh với bán kính động của phòng đó.

### 📌 [REQ-ADR-004]: Yêu cầu kết nối Internet và Phương án Dự phòng (Fallback) khi mất mạng
*   **Ngày quyết định:** 2026-05-26
*   **Trạng thái:** Đã phê duyệt
*   **Bối cảnh (Context):** Hệ thống yêu cầu sinh viên phải có kết nối Internet để gửi dữ liệu xác thực tức thời lên Server. Tuy nhiên, sự cố mất mạng Wi-Fi trường hoặc nghẽn mạng 4G đầu giờ học là rất phổ biến.
*   **Quyết định đề xuất (Decision):** Thiết lập 3 cơ chế dự phòng (Fallback) phân cấp như sau:
    1.  **Fallback 1 - Ghi nhận ngoại tuyến (Offline Caching trên App):** Nếu điện thoại sinh viên không có mạng, ứng dụng di động sẽ cho phép quét mã QR và đóng gói một file dữ liệu mã hóa (chứa Token QR đã quét, GPS lúc quét, Device UUID, ảnh khuôn mặt và Timestamp chụp vị trí). Payload này được ký số và lưu cục bộ trên bộ nhớ đệm an toàn của thiết bị (Secure Storage). Khi điện thoại có mạng trở lại (trong vòng tối đa 2 giờ), App sẽ tự động đồng bộ (Sync) lên Server. Server sẽ giải mã và kiểm tra tính hợp lệ của Timestamp lúc quét ngoại tuyến.
    2.  **Fallback 2 - Mã Pin bảo phòng (Lecturer PIN Code):** Giảng viên hiển thị một mã PIN bảo mật 6 số ngẫu nhiên đổi sau 30 giây trên máy chiếu (song song với QR). Sinh viên có thể tự ghi nhớ/chụp lại mã PIN này để tự điểm danh bù bằng tay trên Web Portal sau khi có mạng.
    3.  **Fallback 3 - Điểm danh thủ công:** Giảng viên chủ động tích điểm danh thủ công trên Web Portal cho những trường hợp gặp sự cố phần cứng/mạng bất khả kháng.

### 📌 [REQ-ADR-005]: Tích hợp xác thực mạng Wi-Fi trường & Sinh trắc học Face ID
*   **Ngày quyết định:** 2026-05-26
*   **Trạng thái:** Đã phê duyệt
*   **Bối cảnh (Context):** Chống tối đa việc chia sẻ tài khoản đăng nhập hộ hoặc sử dụng các ứng dụng giả lập GPS (Fake GPS) trên Android/iOS.
*   **Quyết định đề xuất (Decision):**
    *   **Lớp bảo mật mạng:** Khi gửi yêu cầu điểm danh, App/Web sẽ lấy địa chỉ IP công cộng (Gateway IP) hoặc thông tin tên Wi-Fi (SSID/BSSID) của thiết bị đang kết nối. Server sẽ kiểm tra chéo xem có trùng khớp với danh sách IP Gateway Wi-Fi nội bộ của trường hay không.
    *   **Lớp bảo mật sinh trắc:** Sử dụng xác thực khuôn mặt **Face ID** làm minh chứng học tập bắt buộc trước khi nhấn nút "Gửi điểm danh". Hệ thống sẽ chụp ảnh selfie nhanh và sử dụng cơ chế so khớp khuôn mặt để tránh việc sinh viên đưa máy cho bạn cầm hộ vào lớp điểm danh.
