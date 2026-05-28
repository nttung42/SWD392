# NHẬT KÝ PHÂN TÍCH ĐỐI TƯỢNG (OBJECT ANALYSIS DECISION LOG - ADR)

Tài liệu này ghi lại các quyết định phân loại vai trò đối tượng phân tích (Analysis Objects) theo mô hình phân tích COMET của Hassan Gomaa cho hệ thống **AFAS**.

---

## 📋 PHÂN LOẠI ĐỐI TƯỢNG PHÂN TÍCH (STEREOTYPES CLASSIFICATION)

Các lớp đối tượng trong hệ thống được phân rã thành 3 nhóm cốt lõi phục vụ lập sơ đồ tương tác động:

### 1. Boundary Classes (Lớp biên - «boundary»)
Chịu trách nhiệm xử lý các luồng tương tác giữa Tác nhân ngoài và Hệ thống:
*   `«boundary» StudentAppForm`: Giao diện di động (Mobile App/Web) dành cho Sinh viên thực hiện đăng nhập, xem lịch sử và quét QR.
*   `«boundary» LecturerWebPortal`: Giao diện Web Portal dành cho Giảng viên xem lớp học phần, kích hoạt phiên điểm danh QR và theo dõi real-time.
*   `«boundary» AdminWebPortal`: Giao diện Web Portal dành cho Quản trị viên quản trị hệ thống, cấu hình tọa độ phòng học.
*   `«boundary» GoogleAuthGateway`: Cổng tích hợp API Google OAuth 2.0 xác thực tài khoản.
*   `«boundary» SchoolWifiGateway`: API xác thực chéo địa chỉ IP nội bộ của trạm phát Wi-Fi.

### 2. Control Classes (Lớp điều khiển - «control»)
Chịu trách nhiệm điều phối toàn bộ logic nghiệp vụ, thực hiện chuỗi thuật toán xác thực chống gian lận:
*   `«control» AuthenticationController`: Điều phối đăng nhập và xác thực phiên.
*   `«control» DeviceBindingController`: Điều phối đăng ký và khóa cứng `DeviceUUID`.
*   `«control» AttendanceController`: **Bộ não của hệ thống**, chịu trách nhiệm gọi thuật toán xác thực QR động, GPS Geofencing (Haversine), Wi-Fi check và Face ID matching.
*   `«control» SessionController`: Điều phối việc tạo, cập nhật mã QR động và mã PIN động mỗi 10/30 giây.
*   `«control» RoomConfigurationController`: Điều phối cập nhật tọa độ GPS và bán kính động của phòng học.

### 3. Entity Classes (Lớp thực thể - «entity»)
Lưu giữ dữ liệu lâu dài và các trạng thái của hệ thống:
*   `«entity» Account`, `«entity» Student`, `«entity» Lecturer`
*   `«entity» Subject`, `«entity» ClassSection`, `«entity» Room`
*   `«entity» Session`, `«entity» AttendanceVersion`, `«entity» AttendanceRecord`

---

## 📝 DANH SÁCH CÁC QUYẾT ĐỊNH ĐÃ GHI NHẬN (DECISION LIST)

### 📌 [ANA-ADR-001]: Cơ chế xác thực sinh trắc học Face ID
*   **Quyết định:** Face ID / Touch ID được thực hiện thông qua API sinh trắc học cục bộ trên Mobile App (Local Device Authentication API). App di động gọi cơ chế xác thực của hệ điều hành và chỉ gửi tín hiệu `BiometricVerified = True` cho Server khi xác thực thành công. Ảnh selfie chỉ được gửi trong luồng dự phòng khi thiết bị không hỗ trợ hoặc xác thực cục bộ thất bại; Server xác minh tạm thời rồi xóa ngay sau khi xử lý. Việc này tránh việc Server phải chạy model AI so khớp khuôn mặt nặng nề trong luồng chính, giảm độ trễ phản hồi xuống `< 2 giây` như yêu cầu phi chức năng.
