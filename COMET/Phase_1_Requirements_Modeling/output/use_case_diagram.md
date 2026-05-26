# SƠ ĐỒ USE CASE HỆ THỐNG (USE CASE DIAGRAM)

Sơ đồ Use Case mô tả trực quan các chức năng cốt lõi của hệ thống **AFAS** từ góc nhìn của các tác nhân người dùng (Student, Lecturer, Admin). Sơ đồ được chia làm 3 phân hệ giao diện tương ứng với phạm vi quyền truy cập.

---

## 📊 SƠ ĐỒ USE CASE TỔNG QUAN (MERMAID)

```mermaid
leftToRightDirection
graph TD
    %% Định nghĩa các Tác nhân (Actors)
    subgraph Actors [Tác nhân người dùng]
        Student((Student))
        Lecturer((Lecturer))
        Admin((Admin))
    end

    %% Định nghĩa phân hệ Student
    subgraph Student_Subsystem [Student Mobile & Web Portal]
        UC01[UC01: Login via Google OAuth]
        UC02[UC02: Register Device UUID]
        UC03[UC03: Scan Dynamic QR Check-in]
        UC04[UC04: Enter PIN Fallback Check-in]
        UC05[UC05: View Attendance History]
        
        Student --> UC01
        Student --> UC02
        Student --> UC03
        Student --> UC04
        Student --> UC05
        
        UC03 -.-> |include| UC02
    end

    %% Định nghĩa phân hệ Lecturer
    subgraph Lecturer_Subsystem [Lecturer Web Portal]
        UC06[UC06: Activate Dynamic QR Session]
        UC07[UC07: Real-time Attendance Monitor]
        UC08[UC08: Manual Attendance Adjustment]
        UC09[UC09: Export Attendance Report]
        
        Lecturer --> UC01
        Lecturer --> UC06
        Lecturer --> UC07
        Lecturer --> UC08
        Lecturer --> UC09
        
        UC07 -.-> |include| UC06
    end

    %% Định nghĩa phân hệ Admin
    subgraph Admin_Subsystem [Admin Web Portal]
        UC10[UC10: Manage System Catalog]
        UC11[UC11: Configure Room Coordinates]
        
        Admin --> UC01
        Admin --> UC10
        Admin --> UC11
    end
```

---

## 🔍 CHI TIẾT CÁC MỐI QUAN HỆ ĐẶC BIỆT (RELATIONSHIPS)

1.  **Student --> UC03 include UC02:** Khi sinh viên kích hoạt chức năng điểm danh bằng QR Động (`UC03`), hệ thống di động bắt buộc phải thực hiện kèm theo quy trình kiểm tra và đăng ký mã định danh thiết bị (`UC02`) ở luồng xác thực trên Server nhằm khóa chặt tài khoản sinh viên với duy nhất 1 chiếc điện thoại di động chính chủ.
2.  **Lecturer --> UC07 include UC06:** Chức năng giám sát chuyên cần thời gian thực (`UC07`) hoạt động dựa trên tiền điều kiện của việc Giảng viên đã khởi chạy thành công phiên điểm danh QR động (`UC06`) trên lớp học.
3.  **Google OAuth (UC01):** Sử dụng chung cho cả 3 vai trò để đăng nhập an toàn bằng tài khoản tổ chức cấp của trường.
