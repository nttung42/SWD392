# THIẾT KẾ CƠ SỞ DỮ LIỆU VẬT LÝ (PHYSICAL DATABASE SCHEMA - POSTGRESQL)

Tài liệu này đặc tả thiết kế cơ sở dữ liệu vật lý quan hệ **PostgreSQL** cho hệ thống **AFAS**, bao gồm đặc tả lược đồ bảng, kiểu dữ liệu, các ràng buộc toàn vẹn (khóa chính, khóa ngoại) và kịch bản khởi tạo SQL DDL Scripts hoàn chỉnh.

---

## 1. CẤU TRÚC BẢNG VÀ KIỂU DỮ LIỆU CHI TIẾT

### Bảng accounts (Tài khoản người dùng)
*   `id` VARCHAR(36) [PK]: Mã tài khoản duy nhất (UUID v4).
*   `email` VARCHAR(100) [UNIQUE, NOT NULL]: Địa chỉ email trường cấp.
*   `password_hash` VARCHAR(255) [NOT NULL]: Mật khẩu đã băm bcrypt.
*   `full_name` VARCHAR(100) [NOT NULL]: Họ và tên.
*   `role` VARCHAR(20) [NOT NULL]: Vai trò (`Student`, `Lecturer`, `Admin`).
*   `created_at` TIMESTAMP: Thời điểm tạo tài khoản.

### Bảng students (Hồ sơ Sinh viên)
*   `student_id` VARCHAR(20) [PK]: Mã số sinh viên (ví dụ: `SE170123`).
*   `account_id` VARCHAR(36) [FK -> accounts.id, UNIQUE, NOT NULL]: Liên kết 1-1.
*   `device_uuid` VARCHAR(100) [NULLABLE]: UUID của thiết bị di động đã khóa cứng.
*   `registered_face_template` TEXT [NULLABLE]: Dữ liệu sinh trắc học khuôn mặt mã hóa.

### Bảng rooms (Danh mục Phòng học)
*   `room_id` VARCHAR(20) [PK]: Mã số phòng học.
*   `room_name` VARCHAR(50) [NOT NULL]: Tên hiển thị phòng.
*   `latitude` DOUBLE PRECISION [NOT NULL]: Vĩ độ GPS tâm phòng học.
*   `longitude` DOUBLE PRECISION [NOT NULL]: Kinh độ GPS tâm phòng học.
*   `allowed_radius` DOUBLE PRECISION [NOT NULL, DEFAULT 20.0]: Bán kính cho phép động.

### Bảng attendance_records (Bản ghi điểm danh)
*   `record_id` VARCHAR(36) [PK]: Mã bản ghi (UUID v4).
*   `student_id` VARCHAR(20) [FK -> students.student_id, NOT NULL]
*   `session_id` VARCHAR(36) [FK -> sessions.session_id, NOT NULL]
*   `checked_in_at` TIMESTAMP [NOT NULL, DEFAULT CURRENT_TIMESTAMP]
*   `checked_in_lat` DOUBLE PRECISION [NOT NULL]: Vĩ độ sinh viên quét.
*   `checked_in_long` DOUBLE PRECISION [NOT NULL]: Kinh độ sinh viên quét.
*   `distance` DOUBLE PRECISION [NOT NULL]: Khoảng cách Haversine tính được.
*   `wifi_ssid` VARCHAR(100): Tên Wi-Fi lớp học.
*   `public_ip` VARCHAR(45): IP gateway mạng kết nối.
*   `device_uuid` VARCHAR(100) [NOT NULL]: UUID phần cứng lúc quét.
*   `selfie_path` VARCHAR(255): Đường dẫn lưu tạm ảnh selfie.
*   `status` VARCHAR(20) [NOT NULL CHECK status IN (`Present`, `Late`, `Absent`, `Fraud_Declined`)]
*   `verification_mode` VARCHAR(20) [NOT NULL CHECK mode IN (`QR`, `PIN`, `Offline_Cached`, `Manual`)]

---

## 2. KỊCH BẢN KHỞI TẠO CƠ SỞ DỮ LIỆU (SQL DDL SCRIPT)

```sql
-- Create physical database schema
CREATE TABLE accounts (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('Student', 'Lecturer', 'Admin')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE students (
    student_id VARCHAR(20) PRIMARY KEY,
    account_id VARCHAR(36) UNIQUE NOT NULL,
    device_uuid VARCHAR(100),
    registered_face_template TEXT,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

CREATE TABLE rooms (
    room_id VARCHAR(20) PRIMARY KEY,
    room_name VARCHAR(50) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    allowed_radius DOUBLE PRECISION NOT NULL DEFAULT 20.0
);

CREATE TABLE attendance_records (
    record_id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL,
    session_id VARCHAR(36) NOT NULL,
    checked_in_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    checked_in_lat DOUBLE PRECISION NOT NULL,
    checked_in_long DOUBLE PRECISION NOT NULL,
    distance DOUBLE PRECISION NOT NULL,
    wifi_ssid VARCHAR(100),
    public_ip VARCHAR(45),
    device_uuid VARCHAR(100) NOT NULL,
    selfie_path VARCHAR(255),
    status VARCHAR(20) NOT NULL CHECK (status IN ('Present', 'Late', 'Absent', 'Fraud_Declined')),
    verification_mode VARCHAR(20) NOT NULL CHECK (verification_mode IN ('QR', 'PIN', 'Offline_Cached', 'Manual')),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE RESTRICT
);

-- Optimize database query performance
CREATE INDEX idx_records_student ON attendance_records(student_id);
CREATE INDEX idx_records_session ON attendance_records(session_id);
CREATE INDEX idx_students_device ON students(device_uuid);
```
