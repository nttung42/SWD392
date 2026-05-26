# ÁNH XẠ CẤU TRÚC THƯ MỤC MÃ NGUỒN (PROJECT STRUCTURE MAPPING)

Tài liệu này đặc tả cách thức ánh xạ trực tiếp từ sơ đồ gói thiết kế (Package Diagram ở Phase 3) sang cấu trúc thư mục mã nguồn thực tế của dự án **AFAS Backend (ASP.NET Core .NET 8)** và **Mobile App (React Native)**.

---

## 1. MÃ NGUỒN BACKEND (AFAS.BACKEND - CLEAN ARCHITECTURE)

Solution `.sln` được thiết kế theo đúng phân tầng kiến trúc của Clean Architecture để đảm bảo nguyên lý đảo ngược phụ thuộc (Dependency Inversion):

```text
AFAS.Backend/
├── AFAS.Backend.sln                     # File Solution quản lý dự án .NET
│
├── 1.Domain/                            # TẦNG DOMAIN (LÕI) - Không phụ thuộc bên ngoài
│   └── AFAS.Domain/
│       ├── Common/                      # Các kiểu dữ liệu dùng chung (ValueObjects, BaseEntity)
│       ├── Entities/                    # Các thực thể dữ liệu gốc
│       │   ├── Student.cs
│       │   ├── Room.cs
│       │   └── AttendanceRecord.cs
│       ├── Exceptions/                  # Lỗi nghiệp vụ đặc thù Domain
│       └── Repositories/                # Cổng Interface lưu trữ cơ sở dữ liệu
│           ├── IStudentRepository.cs
│           └── IAttendanceRepository.cs
│
├── 2.Application/                       # TẦNG APPLICATION - Logic các Use Case
│   └── AFAS.Application/
│       ├── Dtos/                        # Đối tượng truyền nhận dữ liệu qua API (Data Transfer Objects)
│       │   ├── AttendanceDto.cs
│       │   └── RoomDto.cs
│       ├── Interfaces/                  # Interface giao tiếp ngoài (Cache, Notifier, LDAP)
│       │   ├── ICacheManager.cs
│       │   └── IRealtimeNotifier.cs
│       └── Services/                    # Các lớp điều khiển Service thực thi logic Use Case
│           ├── AttendanceService.cs     # Xử lý 3 lớp phòng vệ chống gian lận
│           └── SessionService.cs        # Sinh mã QR động & PIN động
│
├── 3.Infrastructure/                    # TẦNG INFRASTRUCTURE - Cài đặt kỹ thuật vật lý
│   └── AFAS.Infrastructure/
│       ├── Persistence/                 # Tương tác PostgreSQL via EF Core
│       │   ├── AFASDbContext.cs
│       │   ├── Migrations/
│       │   └── Repositories/            # Hiện thực hóa các interface Repository Domain
│       │       ├── StudentRepository.cs
│       │       └── AttendanceRepository.cs
│       ├── Caching/                     # Hiện thực hóa Redis Cache lưu trữ Dynamic Token
│       │   └── RedisCacheManager.cs
│       ├── Identity/                    # Xác thực Google OAuth 2.0
│       │   └── GoogleIdentityService.cs
│       └── Realtime/                    # SignalR WebSockets đẩy trạng thái real-time
│           ├── AttendanceHub.cs
│           └── SignalRRealtimeNotifier.cs
│
└── 4.Presentation/                      # TẦNG PRESENTATION - Cổng API WebEndpoint
    └── AFAS.WebAPI/
        ├── Controllers/                 # Cổng nhận Restful API Requests (Boundary)
        │   ├── AttendanceController.cs
        │   └── SessionController.cs
        ├── Middlewares/                 # Xử lý lỗi toàn cục và Logging an ninh
        │   └── ExceptionMiddleware.cs
        └── Program.cs                   # Điểm khởi chạy cấu hình Dependency Injection (DI)
```

---

## 2. MÃ NGUỒN MOBILE APP (AFAS.STUDENT.APP - REACT NATIVE)

Thư mục mã nguồn ứng dụng di động dành cho Sinh viên quét QR được tổ chức theo chuẩn kiến trúc mô-đun hóa hiện đại:

```text
AFAS.Student.App/
├── package.json                         # Quản lý thư viện cài đặt Node.js
├── index.js                             # Điểm khởi chạy App di động
├── App.tsx                              # Cấu hình Routing & Màn hình chính
│
└── src/
    ├── api/                             # Cấu hình gọi Axios kết nối HTTPS API Backend
    │   └── attendanceApi.ts
    ├── components/                      # Các UI Component dùng chung (Buttons, Inputs)
    ├── hooks/                           # Hooks gọi API phần cứng di động
    │   ├── useGPSLocation.ts            # Gọi cảm biến định vị GPS nền tảng
    │   ├── useDeviceBiometrics.ts       # Gọi API vân tay / Face ID gốc di động
    │   └── useDeviceUUID.ts             # Trích xuất mã số phần cứng duy nhất
    ├── navigation/                      # Screens stack nav config
    └── screens/                         # Giao diện màn hình chính (Boundary)
        ├── LoginScreen.tsx
        ├── DashboardScreen.tsx
        ├── QRScannerScreen.tsx
        └── HistoryScreen.tsx
```
