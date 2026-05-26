# QUY TRÌNH NGHIỆP VỤ & PHÒNG THỦ CHỐNG GIAN LẬN (BUSINESS WORKFLOW & ANTI-FRAUD LOGIC)

Tài liệu này đặc tả chi tiết quy trình nghiệp vụ điểm danh và cơ chế phòng thủ 3 lớp tự động của hệ thống **AFAS** nhằm đảm bảo tính trung thực tối đa cho hoạt động điểm danh đầu giờ tại trường FPTU.

---

## 1. MÔ TẢ QUY TRÌNH NGHIỆP VỤ TỔNG THỂ

Quy trình điểm danh gồm 3 giai đoạn chính:

### Giai đoạn 1: Giảng viên khởi tạo phiên
1.  Giảng viên truy cập cổng Web Portal lớp học phần, chọn buổi học (`Session`) hiện hành và nhấn **"Start Attendance"**.
2.  Hệ thống kích hoạt phiên điểm danh (`AttendanceVersion`):
    *   Tự động sinh mã **QR động** chứa token bảo mật được băm kèm mốc thời gian (Timestamp) và đổi mã mới sau mỗi **10 giây**.
    *   Tự động sinh **mã PIN 6 số** ngẫu nhiên làm mới sau mỗi **30 giây** hiển thị góc màn hình.
3.  Màn hình máy chiếu giảng đường hiển thị mã QR lớn và mã PIN động. Hệ thống mở kết nối WebSocket/Polling thời gian thực để sẵn sàng nhận dữ liệu sinh viên.

### Giai đoạn 2: Sinh viên thao tác trên thiết bị di động
1.  Sinh viên mở ứng dụng di động AFAS trên điện thoại (đã kết nối internet và mạng Wi-Fi nội bộ của trường).
2.  Sinh viên bấm nút **"Scan QR Code"**:
    *   App yêu cầu xác thực **Face ID** cục bộ (đối khớp sinh trắc học trên máy để bảo đảm đúng chủ máy cầm điện thoại).
    *   Camera quét mã QR trên màn hình máy chiếu, giải mã lấy chuỗi token động.
3.  Ứng dụng di động tự động thu thập các minh chứng số (Telemetry Data) từ thiết bị phần cứng:
    *   Tọa độ GPS hiện tại (Kinh độ, Vĩ độ).
    *   Địa chỉ IP Gateway mạng Wi-Fi đang kết nối.
    *   Mã định danh thiết bị duy nhất (Device UUID).
4.  App đóng gói toàn bộ gói tin gửi qua giao thức bảo mật HTTPS POST đến Endpoint `/api/attendance/submit` trên Server.

### Giai đoạn 3: Máy chủ kiểm tra và ghi nhận (Mô tả chi tiết tại Mục 2)
1.  Server thực hiện chuỗi xác thực chống gian lận 3 lớp tự động.
2.  Nếu tất cả các điều kiện hợp lệ:
    *   Ghi nhận trạng thái chuyên cần (`Present` hoặc `Late`).
    *   Ảnh selfie tạm thời được xác thực và **xóa ngay lập tức** khỏi bộ nhớ đệm RAM/Server để bảo vệ quyền riêng tư và tối ưu bộ nhớ.
    *   Đẩy thông báo thời gian thực qua WebSocket lên màn hình Giảng viên, tên sinh viên sáng màu xanh trên Web Portal.

---

## 2. CHI TIẾT 3 LỚP PHÒNG THỦ CHỐNG GIAN LẬN TỰ ĐỘNG

Hệ thống AFAS xây dựng hàng rào bảo mật 3 lớp chặt chẽ nhằm chặn đứng toàn bộ các hình thức gian lận:

```text
+-----------------------------------------------------------------------------------+
|                          3 LỚP PHÒNG THỦ CHỐNG GIAN LẬN                           |
+-----------------------------------------------------------------------------------+
| LỚP 1: Chống chia sẻ ảnh QR từ xa (Mã QR động thay đổi 10 giây/lần)               |
+-----------------------------------------------------------------------------------+
| LỚP 2: Chống điểm danh hộ khi ở nhà (GPS Geofencing đo khoảng cách Haversine)     |
+-----------------------------------------------------------------------------------+
| LỚP 3: Chống cầm hộ nhiều máy (Thiết bị UUID duy nhất + Xác thực Face ID)         |
+-----------------------------------------------------------------------------------+
```

### 🛡️ Lớp 1: Chống chia sẻ ảnh chụp QR từ xa (Dynamic QR Code)
*   **Kịch bản gian lận:** Một sinh viên đi học chụp ảnh mã QR trên bảng và gửi qua Messenger/Zalo cho bạn của mình đang ở nhà điểm danh hộ.
*   **Cơ chế phòng thủ:**
    *   Chuỗi ký tự mã hóa trong mã QR được sinh ra từ thuật toán băm (SHA-256) chứa: `SessionId` + `Timestamp` + `Salt`. Mã QR đổi chuỗi token mới sau mỗi **10 giây**.
    *   Khi nhận dữ liệu từ Client gửi lên, Server kiểm tra mốc thời gian tạo mã. Nếu chênh lệch thời gian lúc Server nhận so với mốc thời gian trong token vượt quá **15 giây**, Server lập tức từ chối và báo mã QR hết hạn.
    *   Do đó, việc chụp ảnh gửi đi sẽ hoàn toàn vô tác dụng vì mã QR sẽ bị lỗi thời trước khi người ở nhà nhận và quét được.

### 🛡️ Lớp 2: Chống điểm danh hộ khi ở nhà (GPS Geofencing & Wi-Fi Gateway)
*   **Kịch bản gian lận:** Sinh viên ở nhà nhờ bạn cầm điện thoại đã đăng nhập tài khoản của mình đến lớp điểm danh hộ, hoặc sử dụng phần mềm giả lập định vị GPS (Fake GPS) trên Android/iOS để đánh lừa Server.
*   **Cơ chế phòng thủ:**
    *   **Khoảng cách địa lý:** Server truy xuất tọa độ GPS chuẩn của phòng học (`Room.Latitude`, `Room.Longitude`) và bán kính động cho phép (`Room.AllowedRadius`, ví dụ: 20 mét). Sử dụng công thức toán học **Haversine** để tính khoảng cách đường cong mặt cầu từ vị trí GPS điện thoại sinh viên gửi lên đến tâm phòng học:
        $$d = 2r \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta \text{lat}}{2}\right) + \cos(\text{lat}_1) \cos(\text{lat}_2) \sin^2\left(\frac{\Delta \text{lon}}{2}\right)}\right)$$
        Nếu $d > \text{AllowedRadius}$, bản ghi bị đánh dấu gian lận `Fraud_Declined`.
    *   **Xác thực mạng Wi-Fi trường:** Để chống lại việc sử dụng phần mềm Fake GPS, Server tiến hành kiểm tra địa chỉ IP công cộng (Public Gateway IP) của mạng Wi-Fi thiết bị gửi lên. Thiết bị bắt buộc phải kết nối thông qua trạm Wi-Fi nội bộ của trường có dải IP tĩnh được định sẵn. Nếu sinh viên dùng mạng 4G hoặc Wi-Fi nhà riêng để điểm danh, hệ thống sẽ cảnh báo hoặc từ chối ghi nhận.

### 🛡️ Lớp 3: Chống điểm danh hộ trên nhiều điện thoại (Device UUID & Face ID)
*   **Kịch bản gian lận:** Sinh viên đi học mang theo 3-4 chiếc điện thoại di động của bạn bè để quét mã điểm danh hộ cho cả nhóm.
*   **Cơ chế phòng thủ:**
    *   **Khóa cứng thiết bị (Device UUID Binding):** Mỗi tài khoản Sinh viên khi đăng nhập lần đầu tiên trên thiết bị di động sẽ được liên kết và lưu cứng mã `DeviceUUID` của máy đó. Một điện thoại chỉ được dùng cho duy nhất 1 MSSV điểm danh trong suốt kỳ học. Sinh viên có thể tự đổi thiết bị di động (ví dụ khi mua máy mới) thông qua quy trình bảo mật gửi mã xác thực OTP về Email trường của sinh viên để tự phục hồi tài khoản và đổi UUID mới.
    *   **Xác thực Sinh trắc học (Face ID):** Trước khi nút "Gửi điểm danh" được kích hoạt, App di động bắt buộc sinh viên xác thực Face ID thông qua thư viện API sinh trắc học của hệ điều hành di động (iOS/Android Local Biometrics). Nếu đúng sinh trắc học đã đăng ký khớp trên máy di động, App mới gửi yêu cầu lên Server.

---

## 3. CƠ CHẾ DỰ PHÒNG KHI MẤT INTERNET (FALLBACK STRATEGY)

Trong trường hợp giảng đường bị mất kết nối internet (nghẽn mạng Wi-Fi trường hoặc sập mạng 4G đầu giờ), quy trình dự phòng do **Giảng viên chịu trách nhiệm điều phối** trực tiếp tại lớp:

1.  **Hủy cơ chế quét động tạm thời:** Giảng viên chủ động đóng phiên QR động đang lỗi mạng trên máy chiếu để tránh sinh viên bị báo lỗi kết nối.
2.  **Mở lại phiên điểm danh sau:** Giảng viên có thể mở lại một phiên điểm danh QR động ngắn (5 phút) ở cuối buổi học hoặc trong buổi học tiếp theo khi mạng Internet đã hoạt động ổn định trở lại.
3.  **Tích điểm danh thủ công (Manual Adjustment):** Giảng viên có toàn quyền kiểm soát bằng cách tích chọn trực tiếp trạng thái đi học (`Present`, `Late`, `Absent`) cho các sinh viên gặp sự cố phần cứng hoặc mạng bất khả kháng thông qua giao diện danh sách lớp trên Web Portal của Giảng viên.
