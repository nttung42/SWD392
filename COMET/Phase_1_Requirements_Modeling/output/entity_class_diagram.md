# SƠ ĐỒ LỚP THỰC THỂ (ENTITY CLASS DIAGRAM)

Sơ đồ lớp thực thể (Entity Class Diagram) biểu diễn cấu trúc dữ liệu tĩnh mức logic của hệ thống **AFAS**, mô tả các khái niệm nghiệp vụ cốt lõi và mối liên kết cấu trúc giữa chúng. Thiết kế này đóng vai trò làm nguồn chân lý duy nhất (Single Source of Truth) cho việc thiết kế CSDL quan hệ ở Phase 3.

---

## 📊 SƠ ĐỒ THỰC THỂ LÕI (MERMAID)

```mermaid
classDiagram
    %% Định nghĩa các lớp thực thể lõi
    class Account {
        +string Id
        +string Email
        +string PasswordHash
        +string FullName
        +string Role
        +DateTime CreatedAt
    }

    class Student {
        +string StudentId
        +string AccountId
        +string DeviceUUID
        +string RegisteredFaceTemplate
    }

    class Lecturer {
        +string LecturerId
        +string AccountId
        +string Department
    }

    class Room {
        +string RoomId
        +string RoomName
        +double Latitude
        +double Longitude
        +double AllowedRadius
    }

    class Subject {
        +string SubjectCode
        +string SubjectName
        +int Credits
    }

    class ClassSection {
        +string ClassSectionId
        +string ClassSectionName
        +string SubjectCode
        +string LecturerId
        +string Semester
    }

    class ClassSectionStudent {
        +string ClassSectionId
        +string StudentId
    }

    class Session {
        +string SessionId
        +string ClassSectionId
        +string RoomId
        +DateTime SessionDate
        +TimeSpan StartTime
        +TimeSpan EndTime
    }

    class AttendanceVersion {
        +string SessionId
        +string DynamicToken
        +DateTime QRRefreshedAt
        +string PINCode
        +bool IsActive
    }

    class AttendanceRecord {
        +string RecordId
        +string StudentId
        +string SessionId
        +DateTime CheckedInAt
        +double CheckedInLat
        +double CheckedInLong
        +double Distance
        +string WifiSSID
        +string PublicIP
        +string DeviceUUID
        +string SelfiePath
        +string Status
        +string VerificationMode
    }

    class SystemLog {
        +string LogId
        +string AccountId
        +DateTime Timestamp
        +string Action
        +string Description
    }

    %% Định nghĩa các quan hệ (Associations)
    Account "1" -- "0..1" Student : Kế thừa mềm/Liên kết 1-1
    Account "1" -- "0..1" Lecturer : Kế thừa mềm/Liên kết 1-1
    Account "1" -- "0..*" SystemLog : Ghi nhận lịch sử
    
    Lecturer "1" -- "0..*" ClassSection : Giảng dạy
    Subject "1" -- "0..*" ClassSection : Có nhiều lớp học phần
    
    ClassSection "1" -- "0..*" ClassSectionStudent : Danh sách lớp
    Student "1" -- "0..*" ClassSectionStudent : Tham gia nhiều lớp
    
    ClassSection "1" -- "0..*" Session : Có nhiều buổi học
    Room "1" -- "0..*" Session : Tổ chức tại phòng
    
    Session "1" -- "0..1" AttendanceVersion : Có phiên QR động hiện hành
    
    Session "1" -- "0..*" AttendanceRecord : Chứa kết quả điểm danh
    Student "1" -- "0..*" AttendanceRecord : Sở hữu bản ghi điểm danh
```

---

## 🔍 Ý NGHĨA CÁC QUAN HỆ TRỌNG TÂM

1.  **Account - Student/Lecturer (Mối quan hệ 1-1):** Một tài khoản trong hệ thống chỉ có thể đóng vai trò là một Sinh viên hoặc một Giảng viên. Admin sẽ quản lý thông tin bảo mật tại bảng `Account`, còn thông tin chuyên môn nghiệp vụ sẽ nằm ở các bảng con tương ứng.
2.  **ClassSection - Session (Mối quan hệ 1-nhiều):** Một Lớp học phần sẽ diễn ra trên nhiều buổi học (`Session`) tại các mốc thời gian khác nhau. Mỗi buổi học sẽ được gán với một phòng học cố định (`Room`) để lấy tọa độ làm chuẩn so khớp GPS.
3.  **Session - AttendanceVersion (Mối quan hệ 1-1):** Mỗi buổi học chỉ có một phiên điểm danh QR động hoạt động tại một thời điểm. Token động và mã PIN của phiên này sẽ được cập nhật liên tục để chặn chia sẻ ảnh từ xa.
4.  **Student - AttendanceRecord (Mối quan hệ 1-nhiều):** Một sinh viên tham gia buổi học sẽ sở hữu một bản ghi điểm danh (`AttendanceRecord`). Bản ghi này chứa toàn bộ minh chứng số như GPS lúc quét, khoảng cách, thông tin Wi-Fi, UUID thiết bị, ảnh selfie Face ID phục vụ việc đối khớp và kiểm tra gian lận trên Server.
