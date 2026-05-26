# ĐẶC TẢ CHI TIẾT USE CASE: UC06 - KÍCH HOẠT PHIÊN ĐIỂM DANH QR ĐỘNG

---

## 📄 UC06: ACTIVATE DYNAMIC QR ATTENDANCE (KÍCH HOẠT PHIÊN ĐIỂM DANH QR ĐỘNG)

### 1. Thông tin chung (Metadata)
*   **Mã số (ID):** UC06
*   **Tên Use Case:** Activate Dynamic QR Attendance
*   **Người tạo:** [Tên sinh viên / Agent]
*   **Ngày tạo:** 2026-05-26
*   **Độ ưu tiên (Priority):** High (Cốt lõi hệ thống)
*   **Tác nhân chính (Primary Actor):** Lecturer (Giảng viên)
*   **Tác nhân phụ (Secondary Actors):** Không có

### 2. Mô tả ngắn (Description)
Use case này cho phép Giảng viên sử dụng giao diện cổng Web Portal lớp học phần kích hoạt phiên điểm danh QR động đầu giờ học. Hệ thống sẽ sinh mã QR động làm mới mỗi 10 giây và mã PIN dự phòng làm mới mỗi 30 giây để trình chiếu lên bảng cho sinh viên quét điểm danh.

### 3. Tiền điều kiện (Preconditions)
*   **PRE-1:** Giảng viên đã đăng nhập thành công vào hệ thống Web Portal bằng tài khoản Google trường FPTU.
*   **PRE-2:** Giảng viên hiện đang ở trong thời gian diễn ra buổi học học phần được phân công giảng dạy (`Session.StartTime` đến `Session.EndTime`).

### 4. Hậu điều kiện (Postconditions)
*   **POST-1 (Thành công):** Bản ghi phiên điểm danh `AttendanceVersion` được thiết lập trạng thái `IsActive = True`. WebSocket channel giữa Server và giao diện trình chiếu được thiết lập thành công. Màn hình bắt đầu hiển thị mã QR động làm mới liên tục.
*   **POST-2 (Thất bại):** Hệ thống không kích hoạt phiên điểm danh và hiển thị thông báo lỗi lỗi kết nối mạng hoặc lỗi nghiệp vụ.

### 5. Luồng sự kiện chính (Normal Flow)
1.  Giảng viên truy cập vào phân hệ **"My Classes"** trên Web Portal của Giảng viên.
2.  Hệ thống hiển thị danh sách các Lớp học phần đang phụ trách giảng dạy.
3.  Giảng viên chọn lớp học phần tương ứng và bấm chọn buổi học hiện hành (`Session`).
4.  Hệ thống hiển thị thông tin chi tiết buổi học và nút **"Start Attendance"** (Bắt đầu điểm danh).
5.  Giảng viên bấm nút **"Start Attendance"**.
6.  Hệ thống tạo bản ghi hoặc cập nhật trạng thái phiên điểm danh `AttendanceVersion`:
    *   Thiết lập thuộc tính `IsActive = True`.
    *   Bắt đầu chạy luồng chạy ngầm (Cron/Interval) sinh `DynamicToken` ngẫu nhiên lưu vào CSDL và tự động cập nhật mã mới sau mỗi **10 giây**.
    *   Sinh mã `PINCode` gồm 6 chữ số ngẫu nhiên cập nhật sau mỗi **30 giây**.
7.  Hệ thống hiển thị giao diện trình chiếu chuyên dụng trên màn hình lớn của máy chiếu, bao gồm:
    *   Mã QR động kích thước lớn ở trung tâm.
    *   Mã PIN động 6 số hiển thị góc phải màn hình.
    *   Thanh đếm ngược thời gian làm mới (10 giây cho QR, 30 giây cho PIN).
    *   Bảng theo dõi số lượng sinh viên đi học theo thời gian thực (Real-time Attendance Dashboard).
8.  Giảng viên để màn hình trình chiếu mở để sinh viên trong phòng học tiến hành quét mã.

### 6. Luồng thay thế (Alternative Flows)
*   **A7.1: Giảng viên tạm dừng/đóng phiên điểm danh sớm**
    1.  Tại bước 8 của luồng chính, khi nhận thấy sĩ số lớp đã quét đủ hoặc đã hết thời gian điểm danh quy định (ví dụ sau 15 phút đầu giờ).
    2.  Giảng viên bấm chọn nút **"Stop Attendance"** (Dừng điểm danh) trên giao diện Web Portal.
    3.  Hệ thống đóng kết nối cập nhật mã QR động, thiết lập thuộc tính `IsActive = False` trong cơ sở dữ liệu để ngăn chặn tất cả các yêu cầu quét điểm danh muộn gửi lên sau đó.
    4.  Hệ thống đưa giảng viên trở lại giao diện quản lý buổi học.

### 7. Luồng ngoại lệ (Exceptions)
*   **E4.1: Kích hoạt điểm danh ngoài giờ học quy định (Time Restriction Exception)**
    1.  Tại bước 4, nếu Giảng viên bấm **"Start Attendance"** cho một buổi học diễn ra vào ngày khác hoặc ngoài khung giờ học được quy định của buổi học phần đó (ví dụ: Buổi học diễn ra lúc 7:30 nhưng giảng viên bấm kích hoạt lúc 13:00 chiều).
    2.  Hệ thống hiển thị cảnh báo lỗi: **"Không thể kích hoạt phiên điểm danh ngoài khung giờ học quy định của buổi học phần."** và khóa nút kích hoạt.
*   **E6.1: Sự cố mất mạng Internet trong lúc đang điểm danh (Internet/Socket Connection Lost)**
    1.  Tại bước 7 của luồng chính, nếu mạng internet của lớp học bị mất kết nối, hệ thống không thể tự động gửi yêu cầu cập nhật Dynamic Token lên Server.
    2.  Hệ thống hiển thị biểu tượng cảnh báo mất mạng màu đỏ trên màn hình trình chiếu kèm thông báo lỗi kết nối.
    3.  Giảng viên chủ động thực hiện theo **Quy trình dự phòng (Fallback Strategy)**: dừng phiên QR động và tích điểm danh thủ công cho sinh viên hoặc mở lại phiên quét QR vào cuối buổi học khi có mạng trở lại.
