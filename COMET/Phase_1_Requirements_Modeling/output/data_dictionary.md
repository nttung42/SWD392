# TỪ ĐIỂN DỮ LIỆU (DATA DICTIONARY)

Từ điển dữ liệu mô tả chi tiết tất cả các thuộc tính của các lớp thực thể trong hệ thống **AFAS**, làm cơ sở cho lập trình viên ánh xạ chính xác sang cơ sở dữ liệu vật lý (PostgreSQL) ở các giai đoạn sau.

---

## 1. Bảng Account (Tài khoản người dùng)
| Tên Thuộc tính | Kiểu Dữ liệu | Độ dài / Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| **Id** | String | 36, PK | Mã tài khoản duy nhất (UUID v4). |
| **Email** | String | 100, Unique, Not Null | Địa chỉ thư điện tử chính quy (ví dụ: `@fpt.edu.vn`). |
| **PasswordHash** | String | 255, Not Null | Mật khẩu đã được băm an toàn bằng thuật toán bcrypt. |
| **FullName** | String | 100, Not Null | Họ và tên đầy đủ của người dùng. |
| **Role** | String | 20, Not Null | Vai trò trong hệ thống (`Student`, `Lecturer`, `Admin`). |
| **CreatedAt** | DateTime | Not Null | Thời điểm tài khoản được khởi tạo trong hệ thống. |

---

## 2. Bảng Student (Hồ sơ Sinh viên)
| Tên Thuộc tính | Kiểu Dữ liệu | Độ dài / Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| **StudentId** | String | 20, PK | Mã số sinh viên (ví dụ: `SE170123`). |
| **AccountId** | String | 36, FK (Account.Id), Unique | Liên kết 1-1 với tài khoản bảo mật. |
| **DeviceUUID** | String | 100, Nullable | Mã UUID định danh phần cứng điện thoại di động đăng ký điểm danh. |
| **RegisteredFaceTemplate**| Text | Nullable | Chuỗi vector mã hóa khuôn mặt (Face Vector 128 chiều) đã đăng ký làm chuẩn. |

---

## 3. Bảng Lecturer (Hồ sơ Giảng viên)
| Tên Thuộc tính | Kiểu Dữ liệu | Độ dài / Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| **LecturerId** | String | 20, PK | Mã định danh giảng viên của trường (ví dụ: `HueCTM`). |
| **AccountId** | String | 36, FK (Account.Id), Unique | Liên kết 1-1 với tài khoản bảo mật. |
| **Department** | String | 100 | Bộ môn công tác (ví dụ: `Software Engineering`). |

---

## 4. Bảng Room (Danh mục Phòng học)
| Tên Thuộc tính | Kiểu Dữ liệu | Độ dài / Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| **RoomId** | String | 20, PK | Mã định danh phòng học vật lý (ví dụ: `AL-L402`). |
| **RoomName** | String | 50, Not Null | Tên phòng học hiển thị thân thiện. |
| **Latitude** | Double | Not Null | Vĩ độ GPS chuẩn của tâm phòng học (ví dụ: `21.012345`). |
| **Longitude** | Double | Not Null | Kinh độ GPS chuẩn của tâm phòng học (ví dụ: `105.534567`). |
| **AllowedRadius** | Double | Not Null, Default 20 | Bán kính sai số địa lý cho phép (tính bằng mét) để chặn điểm danh từ xa. |

---

## 5. Bảng Subject (Danh mục Môn học)
| Tên Thuộc tính | Kiểu Dữ liệu | Độ dài / Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| **SubjectCode** | String | 20, PK | Mã môn học viết tắt (ví dụ: `SWD392`). |
| **SubjectName** | String | 150, Not Null | Tên đầy đủ môn học. |
| **Credits** | Int | Not Null | Số lượng tín chỉ của môn học. |

---

## 6. Bảng ClassSection (Lớp học phần)
| Tên Thuộc tính | Kiểu Dữ liệu | Độ dài / Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| **ClassSectionId**| String | 30, PK | Mã lớp học phần (ví dụ: `SWD392_SU26_SE1701`). |
| **ClassSectionName**| String| 100, Not Null | Tên thân thiện hiển thị cho lớp. |
| **SubjectCode** | String | 20, FK (Subject.SubjectCode) | Liên kết môn học. |
| **LecturerId** | String | 20, FK (Lecturer.LecturerId) | Giảng viên phụ trách lớp học phần. |
| **Semester** | String | 20, Not Null | Học kỳ học phần diễn ra (ví dụ: `Summer 2026`). |

---

## 7. Bảng Session (Buổi học thực tế)
| Tên Thuộc tính     | Kiểu Dữ liệu | Độ dài / Ràng buộc                   | Mô tả                                               |
| :-------------------| :-------------| :-------------------------------------| :----------------------------------------------------|
| **SessionId**      | String       | 36, PK                               | Mã buổi học ngẫu nhiên duy nhất (UUID v4).          |
| **ClassSectionId** | String       | 30, FK (ClassSection.ClassSectionId) | Thuộc về lớp học phần nào.                          |
| **RoomId**         | String       | 20, FK (Room.RoomId)                 | Địa điểm diễn ra buổi học.                          |
| **SessionDate**    | Date         | Not Null                             | Ngày diễn ra buổi học (YYYY-MM-DD).                 |
| **StartTime**      | Time         | Not Null                             | Giờ bắt đầu buổi học học phần (ví dụ: `07:30:00`).  |
| **EndTime**        | Time         | Not Null                             | Giờ kết thúc buổi học học phần (ví dụ: `09:15:00`). |

---

## 8. Bảng AttendanceVersion (Phiên cập nhật QR & PIN bảo mật)
| Tên Thuộc tính | Kiểu Dữ liệu | Độ dài / Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| **SessionId** | String | 36, PK, FK (Session.SessionId)| Liên kết 1-1 với buổi học hiện hành. |
| **DynamicToken** | String | 255, Nullable | Chuỗi token ngẫu nhiên thay đổi mỗi 10 giây được mã hóa trong QR. |
| **QRRefreshedAt** | DateTime | Nullable | Thời điểm máy chủ cập nhật token động gần nhất; QR làm mới mỗi 10 giây và Server chấp nhận trong cửa sổ 15 giây. |
| **PINCode** | String | 6, Nullable | Mã pin dự phòng 6 chữ số đổi sau mỗi 30 giây phục vụ Fallback 2. |
| **PINRefreshedAt** | DateTime | Nullable | Thời điểm máy chủ cập nhật mã PIN gần nhất để kiểm tra hạn 30 giây. |
| **IsActive** | Boolean | Not Null, Default False | Trạng thái phiên điểm danh QR động đang mở hay đóng. |

---

## 9. Bảng AttendanceRecord (Bản ghi kết quả Điểm danh)
| Tên Thuộc tính | Kiểu Dữ liệu | Độ dài / Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| **RecordId** | String | 36, PK | Mã bản ghi điểm danh (UUID v4). |
| **StudentId** | String | 20, FK (Student.StudentId) | Sinh viên thực hiện điểm danh. |
| **SessionId** | String | 36, FK (Session.SessionId) | Bản ghi thuộc về buổi học nào. |
| **CheckedInAt** | DateTime | Not Null | Thời điểm nhấn nút gửi điểm danh trên máy. |
| **CheckedInLat** | Double | Not Null | Vĩ độ GPS thực tế gửi từ máy sinh viên. |
| **CheckedInLong** | Double | Not Null | Kinh độ GPS thực tế gửi từ máy sinh viên. |
| **Distance** | Double | Not Null | Khoảng cách tính toán (mét) từ máy SV đến tâm phòng. |
| **WifiSSID** | String | 100, Nullable | Tên mạng Wi-Fi sinh viên đang kết nối lúc quét. |
| **PublicIP** | String | 45, Nullable | Địa chỉ IP Gateway mạng sinh viên kết nối. |
| **DeviceUUID** | String | 100, Not Null | Device UUID của thiết bị di động lúc điểm danh. |
| **SelfiePath** | String | 255, Nullable | Đường dẫn lưu trữ ảnh selfie xác thực Face ID trên máy chủ. |
| **Status** | String | 20, Not Null | Trạng thái buổi học (`Present`, `Late`, `Absent`, `Fraud_Declined`). |
| **VerificationMode**| String| 20, Not Null | Cách thức xác thực (`QR`, `PIN`, `Offline_Cached`, `Manual`). |
