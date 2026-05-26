# NHẬT KÝ LẬP TRÌNH TĂNG TRƯỞNG (CONSTRUCTION & CODING DECISION LOG - ADR)

File này ghi lại các quyết định phân chia công việc, thiết lập cấu trúc và quy trình coding thực tế của hệ thống **AFAS** được chốt giữa bạn (Con người) và AI Agent trong giai đoạn **Phase 4: Incremental Construction**.

---

## 📝 DANH SÁCH CÁC QUYẾT ĐỊNH ĐÃ GHI NHẬN (DECISION LIST)

### 📌 [CON-ADR-001]: Kế hoạch Triển khai Lập trình Tăng trưởng (Incremental Development Plan)
*   **Ngày quyết định:** 2026-05-26
*   **Trạng thái:** Đã phê duyệt
*   **Bối cảnh (Context):** Cần phân bổ thứ tự lập trình các cấu phần trong Solution Clean Architecture để giảm thiểu phụ thuộc chéo và đảm bảo hệ thống có thể kiểm thử tích hợp sớm nhất.
*   **Quyết định đề xuất (Decision):** Tiến hành coding theo chiến lược từ dưới lên (Bottom-up strategy):
    1.  **Bước 1 (Domain & DB Core):** Định nghĩa thực thể POCO (`Student`, `Room`, `AttendanceRecord`) ở `AFAS.Domain`. Thực hiện Migration tạo cơ sở dữ liệu PostgreSQL vật lý.
    2.  **Bước 2 (Infrastructure Core):** Hiện thực hóa `RedisCacheManager` để quản lý Token và `SignalRRealtimeNotifier` để đẩy socket.
    3.  **Bước 3 (Application Service):** Viết logic giải thuật Haversine, check IP và UUID ở `AttendanceService.ProcessCheckin`.
    4.  **Bước 4 (Presentation API):** Viết `AttendanceController` phơi bày REST endpoints và kết nối SignalR Hub.
    5.  **Bước 5 (Student App Mobile):** Viết camera scanner và hook định vị GPS trên React Native để kết nối API Backend.
*   **Hệ quả / Rủi ro (Consequences):**
    *   *Tích cực:* Mỗi module hoàn thành đều có thể được unit test độc lập ngay lập tức; giảm rủi ro nghẽn luồng phát triển.
    *   *Tiêu cực:* Sinh viên không thể kiểm thử giao diện tích hợp hoàn chỉnh của App di động cho đến khi hoàn thành bước 4.

---

### 📌 [CON-ADR-002]: Chuẩn hóa Cấu trúc Thư mục Codebase
*   **Quyết định:** Thống nhất 100% việc ánh xạ các gói thiết kế ở Phase 3 thành cấu trúc thư mục mã nguồn vật lý chuẩn C# và React Native như mô tả chi tiết tại [project_structure_mapping.md](file:///d:/FPTU/7/SWD/Project/COMET/Phase_4_Incremental_Construction/output/project_structure_mapping.md).
