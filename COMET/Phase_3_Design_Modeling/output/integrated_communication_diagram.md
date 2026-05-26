# SƠ ĐỒ TRUYỀN THÔNG TÍCH HỢP MỨC THIẾT KẾ (INTEGRATED COMMUNICATION DIAGRAM)

Tài liệu này đặc tả sơ đồ truyền thông tích hợp (Integrated Communication Diagram) tổng hợp tất cả các thông điệp mức thiết kế của hệ thống **AFAS**, giải thích rõ sự chuyển hóa lớp đối tượng từ phân tích (Analysis-level) sang thiết kế (Design-level).

---

## 1. SƠ ĐỒ TRUYỀN THÔNG TÍCH HỢP MỨC THIẾT KẾ (MERMAID)

```mermaid
graph TD
    %% Actors
    AD((Admin))
    GV((Lecturer))
    SV((Student))

    %% Boundary Classes (Web & Mobile Ports)
    AWP[«boundary» AdminWebPortal]
    LWP[«boundary» LecturerWebPortal]
    SAF[«boundary» StudentAppForm]

    %% Control Classes (Application Services)
    RCC[«control» RoomConfigurationController]
    SC[«control» SessionController]
    AC[«control» AttendanceController]

    %% Entity Classes (Domain Core)
    R[(«entity» Room)]
    S[(«entity» Session)]
    V[(«entity» AttendanceVersion)]
    AR[(«entity» AttendanceRecord)]

    %% Actor to Boundary Interactions
    AD -->|1: Edit Room / 2: Save Geo Config| AWP
    GV -->|1: Get Session Details / 2: Click Start Attendance| LWP
    SV -->|1: Trigger Face ID / 2: Scan QR / 3: Check-in| SAF

    %% Boundary to Control API Calls
    AWP -->|1.1 GetRoomsList() / 2.1 SaveGeoConfiguration()| RCC
    LWP -->|1.1 GetSessionDetails() / 2.1 ActivateAttendanceSession()| SC
    SAF -->|3.1 SubmitAttendance()| AC

    %% Control to Entity operations
    RCC -->|2.2 UpdateGeoConfig()| R
    
    SC -->|1.2 ReadSessionInfo()| S
    SC -->|2.2 InitializeVersion() / 2.3 UpdateDynamicToken()| V
    
    AC -->|3.2 GetActiveTokenForSession()| V
    AC -->|3.3 GetRoomGeoConfig()| R
    AC -->|3.4 CreateRecord()| AR
```

---

## 2. CHUYỂN HÓA TỪ PHÂN TÍCH SANG THIẾT KẾ (TRANSITION TO DESIGN)

Quá trình chuyển hóa từ mô hình phân tích trừu tượng (Analysis Model) sang đặc tả thiết kế kỹ thuật (Design Specification) trong dự án AFAS được thực hiện theo 3 nguyên tắc chuyển hóa cốt lõi của COMET:

1.  **Phân tách Lớp Thực thể (Splitting Entities):** 
    *   Các lớp `«entity»` trong phân tích (như `Room`, `Student`, `AttendanceRecord`) được chuyển đổi thành các **Cấu trúc Dữ liệu thuần túy (Domain Entities / Data Abstraction Classes)** nằm tại gói `AFAS.Domain`.
    *   Bao bọc các thực thể này là các **Giao diện Lưu trữ (Repository Interfaces)** ở Domain layer, và được hiện thực hóa vật lý bởi các **Lớp bao bọc truy cập CSDL (Database Wrapper Classes / Repositories)** tại gói `AFAS.Infrastructure` (sử dụng Entity Framework Core). Điều này cô lập hoàn toàn business logic của hệ thống khỏi cấu trúc bảng cơ sở dữ liệu quan hệ PostgreSQL bên dưới.
2.  **Thiết lập Giao tiếp lỏng qua Interface (Provided/Required Interfaces):**
    *   Các bộ điều khiển `«control»` (như `AttendanceController`) không phụ thuộc trực tiếp vào các class hạ tầng vật lý. 
    *   Chúng gọi các dịch vụ thông qua **Interface** (`IAttendanceService`, `ICacheManager`, `IRealtimeNotifier`). Việc này giúp dễ dàng thay đổi công nghệ cơ sở (ví dụ: Thay thế máy chủ gửi thư SMTP bằng SendGrid, hoặc thay thế bộ nhớ đệm Redis Cache bằng In-Memory Cache) mà không cần viết lại bất kỳ dòng code logic xác thực chống gian lận nào.
3.  **Ánh xạ Lớp Biên (Boundary Mapping):**
    *   Các đối tượng biên giao diện (`«boundary»` như `LoginForm`, `StudentAppForm`) được ánh xạ thành các **WebAPI Controllers** chịu trách nhiệm đón nhận REST requests, phân tích gói tin JSON đầu vào thành các DTOs (Data Transfer Objects) và xử lý phân quyền thông qua JSON Web Tokens (JWT).
    *   Các đối tượng biên thời gian thực được ánh xạ thành các **SignalR Hubs** để duy trì đường truyền WebSockets luôn mở nhằm đẩy trạng thái điểm danh tức thời lên máy chiếu.
