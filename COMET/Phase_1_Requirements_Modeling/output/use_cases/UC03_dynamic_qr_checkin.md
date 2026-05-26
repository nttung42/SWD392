# ĐẶC TẢ CHI TIẾT USE CASE: UC03 - ĐIỂM DANH BẰNG QUÉT QR ĐỘNG

---

## 📄 UC03: DYNAMIC QR CODE CHECK-IN (ĐIỂM DANH BẰNG QR ĐỘNG)

### 1. Thông tin chung (Metadata)
*   **Mã số (ID):** UC03
*   **Tên Use Case:** Dynamic QR Code Check-in
*   **Người tạo:** [Tên sinh viên / Agent]
*   **Ngày tạo:** 2026-05-26
*   **Độ ưu tiên (Priority):** High (Cốt lõi hệ thống)
*   **Tác nhân chính (Primary Actor):** Student (Sinh viên)
*   **Tác nhân phụ (Secondary Actors):** Không có

### 2. Mô tả ngắn (Description)
Use case này cho phép Sinh viên sử dụng ứng dụng di động AFAS (hoặc Web di động) thực hiện quét mã QR động hiển thị trên máy chiếu của Giảng viên để ghi nhận điểm danh có mặt trong lớp học. Hệ thống sẽ tự động xác thực GPS, Wi-Fi nội bộ, Device UUID và Face ID của sinh viên để phòng chống điểm danh hộ hoặc gian lận từ xa.

### 3. Tiền điều kiện (Preconditions)
*   **PRE-1:** Sinh viên đã đăng nhập thành công vào ứng dụng di động bằng tài khoản Google trường FPTU.
*   **PRE-2:** Điện thoại sinh viên đã được cấp quyền truy cập Camera, Định vị vị trí (GPS) và quyền Xác thực sinh trắc học (Face ID / Vân tay).
*   **PRE-3:** Giảng viên đã kích hoạt phiên điểm danh QR động (`AttendanceVersion`) của buổi học hiện hành trên máy chiếu.

### 4. Hậu điều kiện (Postconditions)
*   **POST-1 (Thành công):** Bản ghi điểm danh `AttendanceRecord` được tạo với trạng thái `Present` hoặc `Late`. Tên sinh viên sáng xanh trên màn hình theo dõi của Giảng viên theo thời gian thực (WebSocket). Ảnh selfie xác thực Face ID bị xóa ngay lập tức khỏi Server sau khi đối khớp thành công.
*   **POST-2 (Thất bại/Gian lận):** Bản ghi điểm danh được tạo với trạng thái `Fraud_Declined` hoặc bị từ chối lưu. Hệ thống hiển thị cảnh báo gian lận hoặc thông báo lỗi tương ứng trên điện thoại sinh viên.

### 5. Luồng sự kiện chính (Normal Flow)
1.  Sinh viên bấm nút **"Quét mã điểm danh"** trên màn hình chính của ứng dụng di động AFAS.
2.  Hệ thống di động gọi API sinh trắc học của điện thoại và yêu cầu Sinh viên xác thực khuôn mặt (Face ID / Touch ID).
3.  Sinh viên đối khớp khuôn mặt thành công trên điện thoại.
4.  Hệ thống kích hoạt camera và hiển thị khung quét mã QR.
5.  Sinh viên hướng camera về phía mã QR đang hiển thị trên bảng máy chiếu.
6.  Ứng dụng quét và giải mã thành công mã QR, lấy ra chuỗi `DynamicToken`.
7.  Ứng dụng di động tự động chạy ngầm thu thập các thông số thiết bị:
    *   Tọa độ GPS hiện tại (Latitude, Longitude).
    *   Địa chỉ IP Gateway của trạm Wi-Fi đang kết nối.
    *   Mã định danh thiết bị `DeviceUUID`.
8.  Ứng dụng đóng gói dữ liệu và gửi yêu cầu điểm danh lên Server qua giao thức HTTPS POST.
9.  Server tiến hành chuỗi xác thực chống gian lận tự động:
    *   *Kiểm tra Lớp 1 (QR Token):* Khớp mã token động hiện hành và thời gian tạo trong vòng 10-15 giây.
    *   *Kiểm tra Lớp 2 (Geofencing):* Tính khoảng cách Haversine từ GPS sinh viên đến phòng học và so sánh với bán kính cho phép của phòng.
    *   *Kiểm tra Lớp 3 (Device Binding):* Đối khớp `DeviceUUID` gửi lên với `DeviceUUID` đã đăng ký của sinh viên.
10. Server xác thực tất cả thông tin hợp lệ, ghi nhận trạng thái `Present` vào bảng `AttendanceRecord` và xóa ảnh selfie Face ID tạm thời.
11. Server đẩy thông báo điểm danh thành công thời gian thực qua WebSocket lên Web Portal của Giảng viên.
12. Ứng dụng di động hiển thị thông báo **"Điểm danh thành công"** kèm thời gian ghi nhận.

### 6. Luồng thay thế (Alternative Flows)
*   **A3.1: Điểm danh bằng mã PIN dự phòng (Fallback khi camera hỏng hoặc QR lỗi hiển thị)**
    1.  Tại bước 1, nếu Sinh viên không thể dùng camera quét QR, Sinh viên chọn phương thức **"Điểm danh bằng mã PIN"**.
    2.  Hệ thống yêu cầu xác thực Face ID thành công trên điện thoại.
    3.  Ứng dụng hiển thị ô nhập mã PIN gồm 6 chữ số.
    4.  Sinh viên nhìn mã PIN đổi sau 30 giây hiển thị trên góc máy chiếu của Giảng viên và nhập vào app.
    5.  Ứng dụng thu thập GPS, Wi-Fi, UUID và gửi lên Server kèm mã PIN.
    6.  Server xác thực mã PIN khớp trong phiên hiện hành và thực hiện các bước kiểm tra GPS, UUID giống luồng chính trước khi ghi nhận điểm danh.

### 7. Luồng ngoại lệ (Exceptions)
*   **E9.1: Phát hiện gian lận vị trí GPS (Geofencing Violation - Ở nhà nhờ điểm danh)**
    1.  Tại bước 9, Server tính toán khoảng cách Haversine và phát hiện khoảng cách vượt quá bán kính động cho phép của phòng học (ví dụ: Khoảng cách tính ra là 5km trong khi phòng học chỉ cho phép sai số tối đa 20 mét).
    2.  Server từ chối ghi nhận điểm danh, tạo bản ghi với trạng thái `Fraud_Declined` và lưu lịch sử gian lận vào bảng Log.
    3.  Server gửi phản hồi lỗi về điện thoại sinh viên: **"Điểm danh thất bại: Thiết bị của bạn nằm ngoài phạm vi cho phép của phòng học."**
*   **E9.2: Sử dụng thiết bị lạ điểm danh hộ (Device UUID Mismatch)**
    1.  Tại bước 9, Server đối khớp `DeviceUUID` gửi lên từ điện thoại di động và phát hiện không khớp với `DeviceUUID` đã đăng ký liên kết của sinh viên này.
    2.  Server từ chối ghi nhận điểm danh và gửi phản hồi lỗi về thiết bị di động: **"Điểm danh thất bại: Thiết bị này không trùng khớp với thiết bị đã đăng ký của bạn. Mỗi tài khoản chỉ được phép điểm danh trên 1 thiết bị cố định."**
*   **E9.3: Quét ảnh chụp QR bị lỗi thời (Dynamic Token Expired - Chia sẻ ảnh QR từ xa)**
    1.  Tại bước 9, Server kiểm tra chuỗi `DynamicToken` gửi lên đã quá hạn 15 giây kể từ lúc tạo trên máy chiếu (mã QR trên bảng đã đổi sang token mới).
    2.  Server từ chối ghi nhận điểm danh và gửi phản hồi lỗi về thiết bị di động: **"Điểm danh thất bại: Mã QR đã hết hạn. Vui lòng quét trực tiếp mã QR mới nhất trên máy chiếu lớp học."**
