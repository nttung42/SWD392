# ĐẶC TẢ CHI TIẾT USE CASE: UC09 - XUẤT BÁO CÁO ĐIỂM DANH

---

## 📄 UC09: EXPORT ATTENDANCE REPORT (XUẤT BÁO CÁO ĐIỂM DANH)

### 1. Thông tin chung (Metadata)
*   **Mã số (ID):** UC09
*   **Tên Use Case:** Export Attendance Report
*   **Người tạo:** SWD392 Team
*   **Ngày tạo:** 2026-05-28
*   **Độ ưu tiên (Priority):** Medium
*   **Tác nhân chính (Primary Actor):** Lecturer
*   **Tác nhân phụ (Secondary Actors):** Không có

### 2. Mô tả ngắn (Description)
Use case này cho phép giảng viên xuất bảng điểm danh của lớp học phần hoặc học kỳ sang file Excel để phục vụ lưu trữ và đánh giá học tập.

### 3. Tiền điều kiện (Preconditions)
*   **PRE-1:** Giảng viên đã đăng nhập Web Portal.
*   **PRE-2:** Giảng viên có quyền truy cập lớp học phần cần xuất báo cáo.

### 4. Hậu điều kiện (Postconditions)
*   **POST-1 (Thành công):** File `.xlsx` được tạo và tải về máy giảng viên.
*   **POST-2 (Thất bại):** Hệ thống hiển thị trạng thái không có dữ liệu hoặc lỗi xuất file.

### 5. Luồng sự kiện chính (Normal Flow)
1.  Giảng viên mở màn hình chi tiết lớp học phần.
2.  Giảng viên nhấn **Export Excel**.
3.  Server tổng hợp dữ liệu buổi học, roster và `AttendanceRecord` của lớp.
4.  Server định dạng dữ liệu thành bảng gồm thông tin sinh viên, ngày học, chế độ check-in và phần trăm chuyên cần.
5.  Server tạo file `.xlsx`.
6.  Trình duyệt tải file về máy giảng viên.

### 6. Luồng thay thế (Alternative Flows)
*   Không có.

### 7. Luồng ngoại lệ (Exceptions)
*   **E3.1: Không có dữ liệu điểm danh**
    1.  Nếu lớp chưa có phiên điểm danh hoặc không có bản ghi, hệ thống hiển thị empty state.
    2.  Nút xuất file bị vô hiệu hóa cho đến khi có dữ liệu.

### 8. Quy tắc nghiệp vụ (Business Rules)
*   **BR-01:** Giảng viên chỉ được xuất báo cáo cho lớp học phần mình phụ trách.
