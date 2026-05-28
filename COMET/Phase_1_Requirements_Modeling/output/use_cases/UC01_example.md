# ĐẶC TẢ CHI TIẾT USE CASE: UC01 - ĐĂNG NHẬP

---

## 📄 UC01: LOGIN VIA CREDENTIALS OR GOOGLE OAUTH (ĐĂNG NHẬP BẰNG TÀI KHOẢN HOẶC GOOGLE OAUTH)

### 1. Thông tin chung (Metadata)
*   **Mã số (ID):** UC01
*   **Tên Use Case:** Login via Credentials or Google OAuth
*   **Người tạo:** SWD392 Team
*   **Ngày tạo:** 2026-05-26
*   **Độ ưu tiên (Priority):** High
*   **Tác nhân chính (Primary Actor):** Student, Lecturer, Admin
*   **Tác nhân phụ (Secondary Actors):** Google OAuth Service

### 2. Mô tả ngắn (Description)
Use case này cho phép toàn bộ người dùng hệ thống AFAS đăng nhập an toàn vào đúng cổng chức năng của mình bằng tài khoản cá nhân hoặc Google OAuth với email trường FPT.

### 3. Tiền điều kiện (Preconditions)
*   **PRE-1:** Tài khoản người dùng đã tồn tại trong cơ sở dữ liệu `Accounts`.
*   **PRE-2:** Nếu dùng Google OAuth, người dùng sở hữu email hợp lệ thuộc miền `@fpt.edu.vn` hoặc `@fe.edu.vn`.

### 4. Hậu điều kiện (Postconditions)
*   **POST-1 (Thành công):** Người dùng được xác thực, hệ thống phát hành JWT chứa vai trò người dùng và chuyển hướng đến dashboard tương ứng.
*   **POST-2 (Thất bại):** Hệ thống từ chối đăng nhập, không tạo phiên làm việc và hiển thị thông báo lỗi.

### 5. Luồng sự kiện chính (Normal Flow)
1.  Người dùng mở Mobile App hoặc Web Portal của AFAS.
2.  Hệ thống hiển thị màn hình đăng nhập với hai lựa chọn: **Credentials** hoặc **Google OAuth**.
3.  Nếu chọn **Credentials**, người dùng nhập MSSV/Username và Password rồi nhấn **Login**.
4.  Nếu chọn **Google OAuth**, người dùng nhấn **Login with Google**, xác thực qua Google Gateway và hệ thống nhận lại email FPT.
5.  Server kiểm tra thông tin đăng nhập trong bảng `Accounts` hoặc xác minh OAuth token từ Google.
6.  Server xác định vai trò người dùng (`Student`, `Lecturer`, `Admin`).
7.  Server tạo JWT bảo mật chứa `AccountId`, `Role` và thời hạn phiên.
8.  Hệ thống chuyển hướng người dùng đến dashboard đúng vai trò.

### 6. Luồng thay thế (Alternative Flows)
*   **A2.1: Người dùng quên mật khẩu**
    1.  Tại màn hình đăng nhập, người dùng chọn **Forgot Password**.
    2.  Người dùng nhập email đã đăng ký.
    3.  Hệ thống gửi liên kết đặt lại mật khẩu đến email trường.
    4.  Người dùng mở liên kết và cập nhật mật khẩu mới.

### 7. Luồng ngoại lệ (Exceptions)
*   **E5.1: Sai thông tin đăng nhập**
    1.  Tại bước 5, nếu MSSV/Username hoặc Password không hợp lệ, server từ chối xác thực.
    2.  Hệ thống hiển thị thông báo **"Invalid username or password"**.
*   **E5.2: Email không thuộc miền trường**
    1.  Tại bước 5, nếu Google OAuth trả về email không kết thúc bằng `@fpt.edu.vn` hoặc `@fe.edu.vn`, server từ chối đăng nhập.
    2.  Hệ thống hiển thị thông báo tài khoản không thuộc miền trường được phép.

### 8. Quy tắc nghiệp vụ (Business Rules)
*   **BR-01:** Mật khẩu phải được băm bằng `bcrypt` trên server.
*   **BR-02:** Google OAuth chỉ chấp nhận email thuộc miền `@fpt.edu.vn` hoặc `@fe.edu.vn`.
*   **BR-03:** JWT phải chứa vai trò người dùng để phân quyền truy cập đúng portal.
