# NHẬT KÝ KIỂM THỬ VÀ TÍCH HỢP (TESTING & INTEGRATION DECISION LOG - ADR)

File này ghi lại các quyết định lựa chọn chiến lược kiểm thử, định nghĩa môi trường chạy thử và các chuẩn hóa kịch bản bảo mật cho hệ thống **AFAS** được chốt giữa bạn (Con người) và AI Agent trong giai đoạn **Phase 5: Integration & Testing**.

---

## 📝 DANH SÁCH CÁC QUYẾT ĐỊNH ĐÃ GHI NHẬN (DECISION LIST)

### 📌 [TST-ADR-001]: Chiến lược Kiểm thử 3 lớp phòng vệ chống gian lận
*   **Ngày quyết định:** 2026-05-26
*   **Trạng thái:** Đã phê duyệt
*   **Bối cảnh (Context):** 3 lớp phòng vệ chống gian lận (QR token 10s, GPS Geofencing Haversine, và Device UUID Binding) hoạt động tích hợp chặt chẽ. Cần một chiến lược kiểm thử tích hợp (Integration Testing) tự động để xác minh độ nhạy và tính chính xác của các thuật toán xác thực này.
*   **Quyết định đề xuất (Decision):**
    1.  Sử dụng thư viện **xUnit** kết hợp **FluentAssertions** và `WebApplicationFactory` để giả lập tích hợp WebAPI đầy đủ trên môi trường Staging.
    2.  Thiết lập cơ sở dữ liệu PostgreSQL ảo (InMemory Database hoặc Postgres Test Container) để lưu và truy xuất dữ liệu kiểm thử độc lập mà không làm bẩn dữ liệu thực.
    3.  Thiết lập Mock Redis Cache để lưu các Dynamic Token ảo phục vụ kiểm thử Lớp 1 (QR Token).
    4.  Xây dựng 6 kịch bản kiểm thử tích hợp chính xác dạng bảng như đặc tả tại [integration_test_plan.md](file:///d:/FPTU/7/SWD/Project/COMET/Phase_5_Integration_Testing/output/integration_test_plan.md).
*   **Hệ quả / Rủi ro (Consequences):**
    *   *Tích cực:* Đảm bảo phát hiện ngay các lỗi logic tính toán khoảng cách hoặc hết hạn token khi cập nhật code; đảm bảo độ tin cậy tuyệt đối trước khi deploy lên môi trường Production.
    *   *Tiêu cực:* Tốn thêm tài nguyên và thời gian viết mã test tích hợp ban đầu.

---

### 📌 [TST-ADR-002]: Unit Testing cô lập logic xác thực nghiệp vụ
*   **Quyết định:** Sử dụng thư viện **Moq** để giả lập các phụ thuộc hạ tầng ngoài (`IAttendanceRepository`, `IRoomRepository`, `ICacheManager`). Viết các ca kiểm thử Unit Test cô lập hoàn toàn cho phương thức xử lý nghiệp vụ cốt lõi `AttendanceService.ProcessCheckin` như đặc tả tại [unit_test_specs.md](file:///d:/FPTU/7/SWD/Project/COMET/Phase_5_Integration_Testing/output/unit_test_specs.md).
