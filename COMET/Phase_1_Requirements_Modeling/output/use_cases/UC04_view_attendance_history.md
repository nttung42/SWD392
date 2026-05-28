# ĐẶC TẢ CHI TIẾT USE CASE: UC04 - XEM LỊCH SỬ ĐIỂM DANH

---

## 📄 UC04: VIEW ATTENDANCE HISTORY (XEM LỊCH SỬ ĐIỂM DANH)

### 1. Thông tin chung (Metadata)
*   **Mã số (ID):** UC04
*   **Tên Use Case:** View Attendance History
*   **Người tạo:** SWD392 Team
*   **Ngày tạo:** 2026-05-28
*   **Độ ưu tiên (Priority):** Medium
*   **Tác nhân chính (Primary Actor):** Student
*   **Tác nhân phụ (Secondary Actors):** Không có

### 2. Mô tả ngắn (Description)
Use case này cho phép sinh viên xem thống kê và chi tiết lịch sử điểm danh theo từng lớp học phần, bao gồm trạng thái có mặt, đi trễ và vắng mặt.

### 3. Tiền điều kiện (Preconditions)
*   **PRE-1:** Sinh viên đã đăng nhập thành công vào Mobile App hoặc Mobile Web.
*   **PRE-2:** Sinh viên có dữ liệu lớp học phần hoặc bản ghi điểm danh trong hệ thống.

### 4. Hậu điều kiện (Postconditions)
*   **POST-1 (Thành công):** Sinh viên xem được thống kê và lịch sử điểm danh theo lớp học phần.
*   **POST-2 (Thất bại):** Ứng dụng hiển thị cảnh báo lỗi kết nối hoặc trạng thái chưa có dữ liệu.

### 5. Luồng sự kiện chính (Normal Flow)
1.  Sinh viên chọn tab **History** trên thanh điều hướng.
2.  Ứng dụng gửi yêu cầu lấy lịch sử điểm danh của sinh viên đến `/api/attendance/history`.
3.  Server truy xuất các bản ghi `AttendanceRecord` liên kết với sinh viên.
4.  Ứng dụng hiển thị danh sách các lớp học phần mà sinh viên đã đăng ký.
5.  Sinh viên chọn một lớp học phần.
6.  Ứng dụng hiển thị thống kê tổng số buổi `Present`, `Late`, `Absent` và lịch theo ngày.
7.  Sinh viên xem trạng thái từng buổi học bằng màu sắc trực quan.

### 6. Luồng thay thế (Alternative Flows)
*   Không có.

### 7. Luồng ngoại lệ (Exceptions)
*   **E3.1: Server không phản hồi**
    1.  Nếu ứng dụng không thể kết nối server, ứng dụng hiển thị dữ liệu lịch sử đã cache cục bộ nếu có.
    2.  Ứng dụng hiển thị cảnh báo kết nối để sinh viên biết dữ liệu có thể chưa mới nhất.

### 8. Quy tắc nghiệp vụ (Business Rules)
*   **BR-01:** Sinh viên chỉ được xem lịch sử điểm danh của chính mình.
