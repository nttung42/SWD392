# NHẬT KÝ KIẾN TRÚC & CÔNG NGHỆ (DESIGN ARCHITECTURE DECISION LOG - ADR)

Tài liệu này ghi lại các quyết định lựa chọn công nghệ, phân rã kiến trúc hệ thống và thiết kế các tầng kiến trúc vật lý cho hệ thống **AFAS**.

---

## 📝 DANH SÁCH CÁC QUYẾT ĐỊNH ĐÃ GHI NHẬN (DECISION LIST)

### 📌 [DES-ADR-001]: Lựa chọn Kiến trúc Phần mềm (Clean Architecture)
*   **Ngày quyết định:** 2026-05-26
*   **Trạng thái:** Đã phê duyệt
*   **Bối cảnh (Context):** Đáp ứng yêu cầu phi chức năng **NF-01 (Maintainability)**. Codebase cần phải được phân tầng rạch ròi, độc lập với các thư viện ngoài, độc lập với cơ sở dữ liệu và dễ viết unit test.
*   **Quyết định đề xuất (Decision):** Áp dụng kiến trúc Clean Architecture (4 layers):
    1.  **Domain Layer (Lõi):** Chứa các thực thể nghiệp vụ (`Student`, `Room`, `AttendanceRecord`), các interface Repository gốc và logic nghiệp vụ thuần túy (Domain Entities, Value Objects).
    2.  **Application Layer:** Chứa logic của từng Use Case nghiệp vụ cụ thể, điều phối luồng dữ liệu (Services, DTOs, Mappers).
    3.  **Infrastructure Layer:** Chứa các cài đặt kỹ thuật vật lý bên ngoài: ORM (EF Core kết nối PostgreSQL), Redis Cache Manager, dịch vụ gửi thư, hoặc API so khớp thiết bị.
    4.  **Presentation / WebAPI Layer:** Điểm đầu nhận request từ Client (Controllers, SignalR Hubs cho kết nối thời gian thực).

### 📌 [DES-ADR-002]: Lựa chọn Hệ sinh thái Công nghệ (Technology Stack)
*   **Ngày quyết định:** 2026-05-26
*   **Trạng thái:** Đã phê duyệt
*   **Bối cảnh (Context):** Đòi hỏi khả năng xử lý lượng lớn dữ liệu đồng thời đầu giờ học (**500-1000 requests/5 phút**), độ trễ phản hồi quét QR cực thấp (<2s), và hỗ trợ đa nền tảng (Mobile App + Web).
*   **Quyết định đề xuất (Decision):**
    *   **Backend API Server:** Sử dụng **ASP.NET Core (.NET 8)** chạy trên máy chủ Docker Container. Lựa chọn .NET Core vì tính năng biên dịch cực nhanh, đa luồng hiệu năng cao và quản lý bộ nhớ vượt trội.
    *   **Mobile App (Sinh viên):** Sử dụng **React Native (TypeScript)** nhằm biên dịch mã máy native cho cả iOS và Android, cho phép gọi trực tiếp các API phần cứng chính xác cao (GPS, Face ID, Device UUID).
    *   **Web Portal (Giảng viên, Admin):** Sử dụng **React.js (Next.js)** kết hợp **Tailwind CSS** để thiết kế giao diện Responsive cao cấp, tải trang nhanh và hỗ trợ SEO tốt.
    *   **Cơ sở dữ liệu chính:** **PostgreSQL** quan hệ, đảm bảo an toàn dữ liệu tuyệt đối cho hồ sơ chuyên cần.
    *   **Môi trường Cache tốc độ cao:** **Redis Cache** dùng để lưu trữ tạm thời các mã QR động (`DynamicToken`) và mã PIN đang hoạt động. Khi sinh viên điểm danh, Server sẽ kiểm tra chéo Token trên Redis trước (tốc độ đọc RAM microsecond) thay vì truy vấn trực tiếp xuống PostgreSQL, bảo vệ DB khỏi nghẽn tải đầu giờ.
    *   **Kết nối thời gian thực (Real-time):** Sử dụng **SignalR** (của ASP.NET Core) duy trì kết nối song công (Duplex) qua WebSockets giữa Server và Web Portal Giảng viên để đẩy trạng thái điểm danh tức thời.
