# ĐẶC TẢ CHI TIẾT USE CASE: UC02 - ĐĂNG KÝ DEVICE UUID

---

## 📄 UC02: REGISTER DEVICE UUID (ĐĂNG KÝ MÃ ĐỊNH DANH THIẾT BỊ)

### 1. Thông tin chung (Metadata)
*   **Mã số (ID):** UC02
*   **Tên Use Case:** Register Device UUID
*   **Người tạo:** SWD392 Team
*   **Ngày tạo:** 2026-05-28
*   **Độ ưu tiên (Priority):** High
*   **Tác nhân chính (Primary Actor):** Student
*   **Tác nhân phụ (Secondary Actors):** Email OTP Service, Mobile Device Hardware

### 2. Mô tả ngắn (Description)
Use case này liên kết tài khoản sinh viên với một thiết bị di động duy nhất bằng `DeviceUUID` để ngăn điểm danh hộ bằng nhiều thiết bị hoặc nhiều tài khoản trên cùng một điện thoại.

### 3. Tiền điều kiện (Preconditions)
*   **PRE-1:** Sinh viên đã đăng nhập thành công vào Mobile App.
*   **PRE-2:** Hồ sơ sinh viên chưa có `DeviceUUID` đang hoạt động hoặc sinh viên đã hoàn tất yêu cầu reset thiết bị.

### 4. Hậu điều kiện (Postconditions)
*   **POST-1 (Thành công):** `DeviceUUID` của thiết bị hiện tại được lưu vào hồ sơ sinh viên.
*   **POST-2 (Thất bại):** Thiết bị không được liên kết và sinh viên không thể tiếp tục điểm danh bằng QR/PIN.

### 5. Luồng sự kiện chính (Normal Flow)
1.  Sinh viên đăng nhập vào ứng dụng AFAS trên thiết bị di động.
2.  Ứng dụng kiểm tra hồ sơ sinh viên có `DeviceUUID` đang hoạt động hay chưa.
3.  Nếu `DeviceUUID` đang trống, ứng dụng lấy mã định danh thiết bị từ hệ điều hành.
4.  Ứng dụng hiển thị thông báo thiết bị này sẽ trở thành thiết bị điểm danh chính.
5.  Sinh viên xác nhận liên kết thiết bị.
6.  Server lưu `DeviceUUID` vào hồ sơ sinh viên.
7.  Ứng dụng hiển thị trạng thái thiết bị đã được liên kết.

### 6. Luồng thay thế (Alternative Flows)
*   **A3.1: Sinh viên yêu cầu reset thiết bị**
    1.  Sinh viên đăng nhập trên thiết bị mới và hệ thống phát hiện tài khoản đã liên kết thiết bị khác.
    2.  Sinh viên chọn **Request Device Reset**.
    3.  Hệ thống gửi mã OTP đến email FPT đã đăng ký.
    4.  Sinh viên nhập OTP hợp lệ.
    5.  Server xóa `DeviceUUID` cũ, nhận `DeviceUUID` mới và lưu vào hồ sơ sinh viên.

### 7. Luồng ngoại lệ (Exceptions)
*   **E4.1: OTP không hợp lệ quá số lần cho phép**
    1.  Nếu sinh viên nhập sai OTP 3 lần, hệ thống khóa quy trình reset trong 24 giờ.
    2.  Ứng dụng hiển thị thông báo yêu cầu sinh viên thử lại sau hoặc liên hệ hỗ trợ.

### 8. Quy tắc nghiệp vụ (Business Rules)
*   **BR-01:** Mỗi tài khoản sinh viên chỉ được liên kết với một `DeviceUUID` đang hoạt động tại một thời điểm.
*   **BR-02:** Reset thiết bị phải xác thực bằng OTP gửi về email trường của sinh viên.
