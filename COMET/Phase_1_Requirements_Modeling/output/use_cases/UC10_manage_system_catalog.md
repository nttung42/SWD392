# ĐẶC TẢ CHI TIẾT USE CASE: UC10 - QUẢN LÝ DANH MỤC HỆ THỐNG

---

## 📄 UC10: MANAGE SYSTEM CATALOG (QUẢN LÝ DANH MỤC HỆ THỐNG)

### 1. Thông tin chung (Metadata)
*   **Mã số (ID):** UC10
*   **Tên Use Case:** Manage System Catalog
*   **Người tạo:** SWD392 Team
*   **Ngày tạo:** 2026-05-28
*   **Độ ưu tiên (Priority):** High
*   **Tác nhân chính (Primary Actor):** Admin
*   **Tác nhân phụ (Secondary Actors):** Không có

### 2. Mô tả ngắn (Description)
Use case này cho phép quản trị viên tạo, cập nhật, xóa hoặc nhập hàng loạt các danh mục nền tảng của hệ thống gồm tài khoản, sinh viên, giảng viên, môn học và lớp học phần.

### 3. Tiền điều kiện (Preconditions)
*   **PRE-1:** Admin đã đăng nhập Admin Web Portal.
*   **PRE-2:** Admin có quyền quản trị danh mục hệ thống.

### 4. Hậu điều kiện (Postconditions)
*   **POST-1 (Thành công):** Dữ liệu danh mục được cập nhật trong PostgreSQL.
*   **POST-2 (Thất bại):** Không có dữ liệu sai được lưu nếu validation thất bại.

### 5. Luồng sự kiện chính (Normal Flow)
1.  Admin mở Admin Portal.
2.  Admin chọn một danh mục như **Students**, **Lecturers**, **Subjects** hoặc **Class Sections**.
3.  Hệ thống hiển thị bảng dữ liệu cùng chức năng tìm kiếm, thêm, sửa và xóa.
4.  Admin chọn **Add** hoặc **Edit** và nhập thông tin cần lưu.
5.  Server kiểm tra dữ liệu bắt buộc, định dạng và tính duy nhất của mã định danh.
6.  Server ghi dữ liệu vào bảng tương ứng.
7.  Hệ thống hiển thị thông báo lưu thành công và cập nhật bảng danh sách.

### 6. Luồng thay thế (Alternative Flows)
*   **A4.1: Nhập hàng loạt bằng file**
    1.  Admin chọn **Batch Import**.
    2.  Admin tải lên file `.csv` hoặc `.xlsx` chứa dữ liệu danh mục.
    3.  Hệ thống đọc file, validate từng dòng và hiển thị kết quả kiểm tra.
    4.  Admin xác nhận import.
    5.  Server ghi dữ liệu hợp lệ theo batch vào cơ sở dữ liệu.

### 7. Luồng ngoại lệ (Exceptions)
*   **E5.1: Trùng mã định danh**
    1.  Nếu Admin nhập StudentId, LecturerId, SubjectCode hoặc ClassSectionId đã tồn tại, server từ chối lưu.
    2.  Portal hiển thị thông báo **"ID already exists"**.

### 8. Quy tắc nghiệp vụ (Business Rules)
*   **BR-01:** Các mã định danh danh mục phải duy nhất trong phạm vi bảng tương ứng.
*   **BR-02:** Import hàng loạt chỉ lưu các dòng vượt qua kiểm tra dữ liệu.
