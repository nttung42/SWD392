# ĐẶC TẢ CHI TIẾT USE CASE: UC07 - GIÁM SÁT ĐIỂM DANH THỜI GIAN THỰC

---

## 📄 UC07: REAL-TIME ATTENDANCE MONITOR (GIÁM SÁT ĐIỂM DANH THỜI GIAN THỰC)

### 1. Thông tin chung (Metadata)
*   **Mã số (ID):** UC07
*   **Tên Use Case:** Real-time Attendance Monitor
*   **Người tạo:** SWD392 Team
*   **Ngày tạo:** 2026-05-28
*   **Độ ưu tiên (Priority):** High
*   **Tác nhân chính (Primary Actor):** Lecturer
*   **Tác nhân phụ (Secondary Actors):** SignalR/WebSocket Channel

### 2. Mô tả ngắn (Description)
Use case này cho phép giảng viên theo dõi trực tiếp trạng thái điểm danh của sinh viên trong phiên QR/PIN đang hoạt động, với tên sinh viên đổi màu theo kết quả check-in.

### 3. Tiền điều kiện (Preconditions)
*   **PRE-1:** Giảng viên đã đăng nhập Web Portal.
*   **PRE-2:** Phiên điểm danh đã được kích hoạt thành công (`IsActive = True`).
*   **PRE-3:** Danh sách sinh viên của lớp học phần đã tồn tại.

### 4. Hậu điều kiện (Postconditions)
*   **POST-1 (Thành công):** Giảng viên nhìn thấy trạng thái điểm danh cập nhật trực tiếp theo từng sinh viên.
*   **POST-2 (Thất bại):** Portal hiển thị cảnh báo mất kết nối và thử kết nối lại.

### 5. Luồng sự kiện chính (Normal Flow)
1.  Giảng viên mở giao diện trình chiếu của phiên điểm danh.
2.  Hệ thống tải danh sách sinh viên trong lớp học phần.
3.  Portal hiển thị lưới sinh viên với trạng thái ban đầu là chưa điểm danh.
4.  Khi một sinh viên check-in thành công, server xử lý bản ghi `AttendanceRecord`.
5.  Server phát sự kiện WebSocket chứa `StudentId`, trạng thái và thời điểm check-in.
6.  Portal nhận sự kiện và đổi màu ô sinh viên: xanh cho `Present`, cam cho `Late`.
7.  Bộ đếm số lượng sinh viên đã điểm danh được cập nhật.

### 6. Luồng thay thế (Alternative Flows)
*   Không có.

### 7. Luồng ngoại lệ (Exceptions)
*   **E5.1: WebSocket bị ngắt kết nối**
    1.  Nếu kết nối WebSocket bị mất, portal hiển thị cảnh báo màu đỏ.
    2.  Portal tự động thử kết nối lại.
    3.  Khi kết nối khôi phục, portal đồng bộ lại trạng thái mới nhất từ server.

### 8. Quy tắc nghiệp vụ (Business Rules)
*   **BR-01:** Màn hình giảng viên phải cập nhật trạng thái sau khi server chấp nhận check-in thành công.
