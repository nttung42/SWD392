# ĐẶC TẢ CHI TIẾT USE CASE: UC08 - ĐIỀU CHỈNH ĐIỂM DANH THỦ CÔNG

---

## 📄 UC08: MANUAL ATTENDANCE ADJUSTMENT (ĐIỀU CHỈNH ĐIỂM DANH THỦ CÔNG)

### 1. Thông tin chung (Metadata)
*   **Mã số (ID):** UC08
*   **Tên Use Case:** Manual Attendance Adjustment
*   **Người tạo:** SWD392 Team
*   **Ngày tạo:** 2026-05-28
*   **Độ ưu tiên (Priority):** High
*   **Tác nhân chính (Primary Actor):** Lecturer
*   **Tác nhân phụ (Secondary Actors):** Không có

### 2. Mô tả ngắn (Description)
Use case này cho phép giảng viên điều chỉnh thủ công trạng thái điểm danh của sinh viên khi có lý do hợp lệ, sự cố kỹ thuật hoặc cần xử lý ngoại lệ sau phiên điểm danh.

### 3. Tiền điều kiện (Preconditions)
*   **PRE-1:** Giảng viên đã đăng nhập Web Portal.
*   **PRE-2:** Phiên học và danh sách sinh viên tồn tại.
*   **PRE-3:** Có bản ghi điểm danh hoặc sinh viên thuộc roster của phiên cần điều chỉnh.

### 4. Hậu điều kiện (Postconditions)
*   **POST-1 (Thành công):** Trạng thái điểm danh được cập nhật, `VerificationMode` chuyển thành `Manual` và hành động được ghi log.
*   **POST-2 (Thất bại):** Không có thay đổi dữ liệu nếu thiếu lý do hoặc dữ liệu không hợp lệ.

### 5. Luồng sự kiện chính (Normal Flow)
1.  Giảng viên mở danh sách điểm danh của phiên đang hoạt động hoặc phiên đã kết thúc.
2.  Giảng viên chọn một sinh viên và nhấn **Adjust Status**.
3.  Hệ thống hiển thị modal gồm trạng thái hiện tại, các lựa chọn `Present`, `Late`, `Absent`, `Fraud_Declined` và ô nhập lý do.
4.  Giảng viên chọn trạng thái mới và nhập lý do điều chỉnh.
5.  Giảng viên nhấn **Save**.
6.  Server cập nhật `AttendanceRecord.status` và đặt `VerificationMode = Manual`.
7.  Server ghi nhật ký vào `SystemLog` với người thực hiện và lý do.
8.  Portal cập nhật màu trạng thái của sinh viên.

### 6. Luồng thay thế (Alternative Flows)
*   Không có.

### 7. Luồng ngoại lệ (Exceptions)
*   **E5.1: Thiếu lý do điều chỉnh**
    1.  Nếu giảng viên lưu thay đổi mà không nhập lý do, server từ chối yêu cầu.
    2.  Portal hiển thị lỗi tại ô lý do và yêu cầu nhập giải thích bắt buộc.

### 8. Quy tắc nghiệp vụ (Business Rules)
*   **BR-01:** Mọi điều chỉnh thủ công phải ghi ID người chỉnh sửa và lý do bắt buộc.
*   **BR-02:** Điều chỉnh thủ công phải được lưu trong `SystemLog` để phục vụ kiểm tra sau này.
