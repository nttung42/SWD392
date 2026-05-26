# QUY CHUẨN VIẾT CODE HỆ THỐNG (CODING GUIDELINES & STANDARDS)

Tài liệu này quy định các quy chuẩn lập trình bắt buộc đối với tất cả thành viên phát triển hệ thống **AFAS** trên cả hai nền tảng Backend (.NET 8 C#) và Mobile Client (React Native / TypeScript) nhằm đảm bảo tiêu chí phi chức năng **NF-04 (Maintainability)**.

---

## 1. QUY CHUẨN BACKEND (.NET 8 C#)

### 1.1 Quy tắc đặt tên (Naming Conventions)
*   **PascalCase:** Áp dụng cho Tên lớp (Classes), Giao diện (Interfaces), Thuộc tính (Properties), Phương thức công khai (Public Methods), và Tên thư mục.
    *   *Ví dụ:* `AttendanceRecord`, `IAttendanceService`, `ProcessCheckin`.
*   **camelCase:** Áp dụng cho các biến cục bộ trong hàm và các đối số truyền vào phương thức.
    *   *Ví dụ:* `studentId`, `lat`, `lon`.
*   ** camelCase bắt đầu bằng dấu gạch dưới (`_`):** Áp dụng cho các trường dữ liệu private và chỉ đọc của lớp được Dependency Injection nạp vào.
    *   *Ví dụ:* `_attendanceRepo`, `_cacheManager`.
*   **Tiền tố Interface:** Tất cả các đặc tả Interface bắt buộc phải bắt đầu bằng ký tự `I` viết hoa.
    *   *Ví dụ:* `IRoomRepository`, `IRealtimeNotifier`.

### 1.2 Nguyên tắc lập trình Clean Code
1.  **Lập trình bất đồng bộ (Asynchronous Programming):** Toàn bộ các tương tác mạng, đọc ghi CSDL PostgreSQL, hay truy xuất Redis Cache bắt buộc phải sử dụng từ khóa `async` và `await` cùng kiểu trả về `Task` để tránh gây nghẽn luồng của hệ thống đầu giờ.
2.  **DTO (Data Transfer Object):** Tầng Presentation (API Controllers) chỉ được nhận dữ liệu đầu vào và trả dữ liệu đầu ra qua các lớp DTO để bảo mật cấu trúc thực thể. Tuyệt đối không để lộ trực tiếp thực thể Domain (`Room`, `Student`) ra môi trường ngoài.
3.  **Dependency Inversion (DIP):** Mọi phụ thuộc giữa các tầng bắt buộc phải thông qua Interface và được cấu hình nạp tự động qua bộ DI container của .NET 8 tại `Program.cs`.

---

## 2. QUY CHUẨN MOBILE CLIENT (REACT NATIVE / TYPESCRIPT)

### 2.1 Quy tắc đặt tên (Naming Conventions)
*   **PascalCase:** Áp dụng cho tên các UI Component, tên các Màn hình (Screens).
    *   *Ví dụ:* `QRScannerScreen.tsx`, `DashboardScreen.tsx`.
*   **camelCase:** Áp dụng cho tên biến, tên hàm, tên Custom Hooks.
    *   *Ví dụ:* `useGPSLocation.ts`, `useDeviceBiometrics.ts`.
*   **Tên thư mục:** Viết thường toàn bộ để tránh xung đột hệ điều hành (case-sensitive) giữa Windows và Linux/macOS khi deploy.

### 2.2 Quy tắc lập trình an toàn di động
1.  **Strict Type Checking:** Sử dụng 100% TypeScript. Tuyệt đối không sử dụng kiểu dữ liệu `any` để tránh lọt các lỗi ép kiểu lúc chạy runtime.
2.  **Secure Storage:** Mã số sinh viên, mã thông báo JWT và UUID thiết bị phải được lưu trữ trong bộ nhớ đệm mã hóa an toàn của điện thoại (`expo-secure-store` hoặc `react-native-encrypted-storage`). Tuyệt đối không lưu các thông tin nhạy cảm vào `AsyncStorage` thô.
3.  **Local Biometrics Fallback:** Khi gọi API vân tay/Face ID, bắt buộc phải viết hàm kiểm tra sự hỗ trợ của phần cứng (`LocalAuthentication.hasHardwareAsync()`) trước khi kích hoạt camera hoặc biometric reader.
