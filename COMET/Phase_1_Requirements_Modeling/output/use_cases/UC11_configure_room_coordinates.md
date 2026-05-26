# ĐẶC TẢ CHI TIẾT USE CASE: UC11 - CẤU HÌNH TỌA ĐỘ VÀ BÁN KÍNH PHÒNG HỌC

---

## 📄 UC11: CONFIGURE ROOM COORDINATES & ALLOWED RADIUS (CẤU HÌNH TỌA ĐỘ VÀ BÁN KÍNH PHÒNG HỌC)

### 1. Thông tin chung (Metadata)
*   **Mã số (ID):** UC11
*   **Tên Use Case:** Configure Room Coordinates & Allowed Radius
*   **Người tạo:** [Tên sinh viên / Agent]
*   **Ngày tạo:** 2026-05-26
*   **Độ ưu tiên (Priority):** Medium
*   **Tác nhân chính (Primary Actor):** Admin (Quản trị viên)
*   **Tác nhân phụ (Secondary Actors):** Không có

### 2. Mô tả ngắn (Description)
Use case này cho phép Quản trị viên (Admin) cấu hình tọa độ GPS gốc (Kinh độ, Vĩ độ) và bán kính sai số cho phép động (tính bằng mét) cho từng phòng học cố định trong khuôn viên trường FPTU để phục vụ thuật toán xác định vị trí chống gian lận (Lớp 2 - Geofencing).

### 3. Tiền điều kiện (Preconditions)
*   **PRE-1:** Admin đã đăng nhập thành công vào trang quản trị hệ thống bằng tài khoản quyền Admin.
*   **PRE-2:** Danh mục phòng học vật lý đã được khởi tạo trong hệ thống.

### 4. Hậu điều kiện (Postconditions)
*   **POST-1 (Thành công):** Thông số địa lý (`Latitude`, `Longitude`, `AllowedRadius`) của phòng học tương ứng được cập nhật chính xác trong cơ sở dữ liệu (PostgreSQL) phục vụ đối khớp tức thời ở Phase 2 & 3. Ghi nhật ký hành động vào bảng Log.
*   **POST-2 (Thất bại):** Hệ thống giữ nguyên thông số cũ, hiển thị cảnh báo lỗi dữ liệu nhập không hợp lệ cho Admin.

### 5. Luồng sự kiện chính (Normal Flow)
1.  Admin chọn mục **"Room Management"** (Quản lý phòng học) trên thanh menu điều hướng của trang Admin Portal.
2.  Hệ thống hiển thị danh sách phòng học hiện có kèm các thông số địa lý hiện tại của từng phòng.
3.  Admin tìm kiếm phòng học cần cấu hình và nhấn nút **"Edit Coordinates"** (Sửa tọa độ).
4.  Hệ thống hiển thị Biểu mẫu cấu hình tọa độ phòng học (`Configure Room Form`) kèm một bản đồ tích hợp vệ tinh (ví dụ: Google Maps hoặc OpenStreetMap) trực quan.
5.  Admin thực hiện cấu hình thông số địa lý bằng một trong hai cách:
    *   **Cách 1:** Nhập trực tiếp các số liệu thập phân vào các ô nhập liệu: `Latitude` (Vĩ độ), `Longitude` (Kinh độ).
    *   **Cách 2:** Bấm chuột trực tiếp vào vị trí phòng học trên bản đồ vệ tinh tích hợp, hệ thống tự động trích xuất tọa độ GPS và điền vào form.
6.  Admin nhập thông số bán kính sai số địa lý cho phép **"Allowed Radius"** (Bán kính động tính bằng mét, ví dụ: 20 mét).
7.  Admin nhấn nút **"Save Config"** (Lưu cấu hình) để gửi yêu cầu lên Server.
8.  Hệ thống kiểm tra tính hợp lệ của dữ liệu đầu vào (Xem kiểm tra nghiệp vụ).
9.  Hệ thống cập nhật các giá trị mới vào bảng dữ liệu `Room` trong CSDL PostgreSQL và ghi log lịch sử cấu hình của Admin.
10. Giao diện trang Admin hiển thị hộp thoại xác nhận **"Room Coordinates Configured Successfully"** và đưa Admin quay lại màn hình danh sách phòng học.

### 6. Luồng thay thế (Alternative Flows)
*   **A5.1: Admin sử dụng thiết bị di động để lấy tọa độ thực tế tại phòng học**
    1.  Tại bước 5, nếu Admin đang cầm máy tính bảng hoặc thiết bị di động đứng trực tiếp tại vị trí tâm của phòng học vật lý thực tế.
    2.  Admin nhấn nút **"Get Current GPS Location"** trên biểu mẫu di động.
    3.  Ứng dụng yêu cầu quyền định vị của trình duyệt/thiết bị, tự động lấy tọa độ GPS hiện hành độ chính xác cao từ phần cứng di động và tự động điền vào biểu mẫu.
    4.  Admin tiếp tục thực hiện từ bước 6 của luồng chính.

### 7. Luồng ngoại lệ (Exceptions)
*   **E8.1: Nhập dữ liệu tọa độ không hợp lệ (Invalid Geo-data Exception)**
    1.  Tại bước 8, nếu các giá trị Vĩ độ (`Latitude`) và Kinh độ (`Longitude`) nhập vào nằm ngoài giới hạn địa lý thông thường (Vĩ độ phải từ -90 đến 90, Kinh độ từ -180 đến 180) hoặc bán kính động nhập số âm.
    2.  Hệ thống hiển thị cảnh báo lỗi màu đỏ cạnh ô nhập liệu: **"Tọa độ hoặc bán kính không hợp lệ. Vui lòng kiểm tra lại số liệu."** và chặn không cho lưu.

### 8. Quy tắc nghiệp vụ (Business Rules)
*   **BR-01:** Mặc định bán kính sai số cho phép (`AllowedRadius`) của phòng học nếu không nhập sẽ lấy giá trị mặc định là **20 mét** để bù trừ sai số phần cứng GPS của điện thoại di động trong nhà.
*   **BR-02:** Tọa độ GPS của phòng học phải thuộc phạm vi ranh giới bản đồ địa lý cố định của khuôn viên trường (ví dụ: Trường ĐH FPT Hà Nội nằm trong khu Công nghệ cao Hòa Lạc). Hệ thống sẽ cảnh báo nếu Admin nhập tọa độ nằm hoàn toàn ngoài phạm vi của trường để tránh nhầm lẫn số liệu lớn.
