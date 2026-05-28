# ĐẶC TẢ CHI TIẾT USE CASE: UC05 - ĐIỂM DANH BẰNG PIN DỰ PHÒNG

---

## 📄 UC05: PIN FALLBACK CHECK-IN (ĐIỂM DANH BẰNG MÃ PIN DỰ PHÒNG)

### 1. Thông tin chung (Metadata)
*   **Mã số (ID):** UC05
*   **Tên Use Case:** PIN Fallback Check-in
*   **Người tạo:** SWD392 Team
*   **Ngày tạo:** 2026-05-28
*   **Độ ưu tiên (Priority):** High
*   **Tác nhân chính (Primary Actor):** Student
*   **Tác nhân phụ (Secondary Actors):** Mobile Device Hardware

### 2. Mô tả ngắn (Description)
Use case này cho phép sinh viên nhập mã PIN 6 chữ số hiển thị trên màn hình giảng viên để điểm danh khi camera bị lỗi hoặc không thể quét QR, trong khi vẫn áp dụng kiểm tra GPS và `DeviceUUID`.

### 3. Tiền điều kiện (Preconditions)
*   **PRE-1:** Sinh viên đã đăng nhập thành công.
*   **PRE-2:** Phiên QR/PIN động của buổi học đang hoạt động.
*   **PRE-3:** Thiết bị sinh viên đã được liên kết `DeviceUUID`.

### 4. Hậu điều kiện (Postconditions)
*   **POST-1 (Thành công):** Sinh viên được ghi nhận điểm danh bằng `VerificationMode = PIN`.
*   **POST-2 (Thất bại):** Hệ thống từ chối điểm danh hoặc lưu `Fraud_Declined` nếu vi phạm geofence.

### 5. Luồng sự kiện chính (Normal Flow)
1.  Sinh viên chọn **PIN Check-in** trên ứng dụng.
2.  Ứng dụng yêu cầu xác thực Face ID/Touch ID cục bộ.
3.  Sinh viên xác thực sinh trắc học thành công.
4.  Ứng dụng hiển thị màn hình nhập 6 chữ số.
5.  Sinh viên nhập mã PIN đang hiển thị trên màn hình máy chiếu.
6.  Ứng dụng thu thập GPS, Public IP/Wi-Fi SSID và `DeviceUUID`.
7.  Ứng dụng gửi mã PIN và telemetry lên server.
8.  Server xác thực mã PIN còn hiệu lực trong cửa sổ 30 giây.
9.  Server kiểm tra geofence bằng Haversine và đối khớp `DeviceUUID`.
10. Server ghi nhận điểm danh với `VerificationMode = PIN` và trạng thái `Present` hoặc `Late`.

### 6. Luồng thay thế (Alternative Flows)
*   Không có.

### 7. Luồng ngoại lệ (Exceptions)
*   **E8.1: PIN hết hạn**
    1.  Nếu mã PIN được tạo quá 30 giây trước đó, server từ chối yêu cầu.
    2.  Ứng dụng yêu cầu sinh viên nhập mã PIN mới.
*   **E9.1: GPS ngoài phạm vi**
    1.  Nếu vị trí sinh viên vượt quá `AllowedRadius`, server lưu bản ghi `Fraud_Declined`.
    2.  Ứng dụng hiển thị thông báo xác thực vị trí thất bại.
*   **E9.2: GPS không khả dụng**
    1.  Nếu ứng dụng không lấy được GPS, yêu cầu bị chặn trước khi gửi.
    2.  Ứng dụng yêu cầu sinh viên bật dịch vụ định vị.
*   **E9.3: Điểm danh trùng**
    1.  Nếu đã có `AttendanceRecord` cho sinh viên trong phiên này, server trả về kết quả hiện có.
    2.  Hệ thống không tạo bản ghi mới.

### 8. Quy tắc nghiệp vụ (Business Rules)
*   **BR-01:** Mã PIN phải tự động làm mới sau mỗi 30 giây.
*   **BR-02:** PIN fallback vẫn bắt buộc kiểm tra GPS và `DeviceUUID`.
