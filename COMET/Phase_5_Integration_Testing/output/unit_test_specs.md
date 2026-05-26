# ĐẶC TẢ CHI TIẾT UNIT TEST: PROCESS CHECK-IN

Tài liệu này đặc tả các ca kiểm thử đơn vị (Unit Test Cases) để cô lập và xác minh tính đúng đắn của phương thức cốt lõi `AttendanceService.ProcessCheckin(AttendanceDto dto)` trong tầng Application.

---

## 📋 CÁC CA KIỂM THỬ ĐƠN VỊ (UNIT TEST CASES)

### 📌 UT-001: Token QR động không hợp lệ hoặc hết hạn (Layer 1 Check)
*   **Mục tiêu:** Đảm bảo hệ thống từ chối ngay lập tức khi Token QR hết hạn (> 15 giây) hoặc sai lệch.
*   **Thiết lập Mocks (Mock Setup):**
    *   `ICacheManager.GetTokenAsync("session:123:token")` $\rightarrow$ Trả về giá trị `null` hoặc chuỗi `TOKEN_SERVER_MOCK`.
    *   **Input DTO:** `SessionId = "123"`, `DynamicToken = "TOKEN_CLIENT_BAD"`.
*   **Kết quả mong đợi (Asserts):**
    *   Phương thức trả về kết quả Thất bại (`IsSuccess = False`).
    *   Thông báo lỗi trả về: *"QR code has expired or is invalid."*.
    *   Các Repository `IAttendanceRepository.AddAsync()` không bao giờ được gọi (0 lần).

---

### 📌 UT-002: Vị trí quét nằm ngoài bán kính cho phép (Layer 2 Check)
*   **Mục tiêu:** Xác minh giải thuật Haversine tính toán khoảng cách hoạt động chính xác và từ chối lưu trạng thái hợp lệ khi sinh viên ở xa phòng học.
*   **Thiết lập Mocks (Mock Setup):**
    *   `ICacheManager.GetTokenAsync(...)` $\rightarrow$ Trả về khớp 100% với `DynamicToken` trong DTO.
    *   `IRoomRepository.GetRoomGeoConfigAsync("session:123")` $\rightarrow$ Trả về `Latitude = 21.012345`, `Longitude = 105.534567`, `AllowedRadius = 20` (Phòng học chuẩn).
    *   **Input DTO:** Tọa độ GPS ở nhà sinh viên cách 5km: `Lat = 22.012345`, `Long = 106.534567`.
*   **Kết quả mong đợi (Asserts):**
    *   Phương thức trả về kết quả Thất bại (`IsSuccess = False`).
    *   Thông báo lỗi trả về: *"Location verification failed. You are outside the classroom."*.
    *   `IAttendanceRepository.AddAsync()` bắt buộc được gọi đúng **1 lần** với đối tượng `AttendanceRecord` có thuộc tính `Status = "Fraud_Declined"` và `VerificationMode = "QR"`.

---

### 📌 UT-003: Sai lệch Device UUID đã đăng ký (Layer 3 Check)
*   **Mục tiêu:** Ngăn chặn việc sinh viên đăng nhập tài khoản của bạn để quét mã điểm danh hộ trên điện thoại của mình.
*   **Thiết lập Mocks (Mock Setup):**
    *   `ICacheManager` và `IRoomRepository` trả về dữ liệu hợp lệ (Token khớp, GPS nằm trong phòng học khoảng cách 2 mét).
    *   `IAttendanceRepository.GetStudentProfileAsync("student:001")` $\rightarrow$ Trả về đối tượng `Student` có `DeviceUUID = "DEVICE_IPHONE_BOUND"`.
    *   **Input DTO:** Thiết bị thực tế đang quét gửi lên `DeviceUUID = "DEVICE_ANDROID_MOCK"`.
*   **Kết quả mong đợi (Asserts):**
    *   Phương thức trả về kết quả Thất bại (`IsSuccess = False`).
    *   Thông báo lỗi trả về: *"Device UUID mismatch. Attendance must be logged on your registered device."*.
    *   Không có bản ghi điểm danh hợp lệ nào được lưu trữ vĩnh viễn trong cơ sở dữ liệu.
