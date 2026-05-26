# ĐẶC TẢ CHI TIẾT USE CASE (USE CASE SPECIFICATION)

---

## 📄 [UC-XX]: [Tên Use Case - Ví dụ: UC-02 Add Product]

### 1. Thông tin chung (Metadata)
*   **Mã số (ID):** UC-02
*   **Tên Use Case:** Add Product (Thêm sản phẩm mới)
*   **Người tạo:** [Tên sinh viên / Agent]
*   **Ngày tạo:** YYYY-MM-DD
*   **Độ ưu tiên (Priority):** [High / Medium / Low]
*   **Tác nhân chính (Primary Actor):** Warehouse Staff (Nhân viên kho)
*   **Tác nhân phụ (Secondary Actors):** Không có

### 2. Mô tả ngắn (Description)
Use case này cho phép nhân viên kho thêm thông tin sản phẩm sạch mới vào cơ sở dữ liệu hệ thống FOS để sản phẩm có thể hiển thị trên cửa hàng trực tuyến cho khách hàng đặt mua.

### 3. Tiền điều kiện (Preconditions)
*   **PRE-1:** Nhân viên kho đã đăng nhập thành công vào hệ thống Quản trị.
*   **PRE-2:** Tài khoản nhân viên kho đã được phân quyền quản trị danh mục sản phẩm.

### 4. Hậu điều kiện (Postconditions)
*   **POST-1 (Thành công):** Thông tin sản phẩm mới được lưu trữ chính xác vào CSDL, danh sách sản phẩm được cập nhật hiển thị tại màn hình quản lý, hệ thống ghi nhận lịch sử vào bảng Log.
*   **POST-2 (Thất bại):** Hệ thống không thực hiện bất kỳ thay đổi nào trong cơ sở dữ liệu và hiển thị thông báo lỗi tương ứng cho người dùng.

### 5. Luồng sự kiện chính (Normal Flow)
1.  Nhân viên kho bấm chọn mục **"Manage Products"** từ menu hệ thống.
2.  Hệ thống truy xuất và hiển thị danh sách sản phẩm hiện có cùng nút hành động **"Add Product"**.
3.  Nhân viên kho bấm chọn nút **"Add Product"**.
4.  Hệ thống hiển thị Biểu mẫu thêm sản phẩm mới (`Add Product Form`).
5.  Hệ thống tự động truy xuất danh mục loại sản phẩm (`Product Categories`) hoạt động và nạp vào thanh lựa chọn thả xuống (Dropdown List).
6.  Nhân viên kho điền các thông tin chi tiết của sản phẩm bao gồm: Tên sản phẩm, đơn vị tính, mô tả, tải ảnh sản phẩm lên và chọn danh mục tương ứng.
7.  Nhân viên kho bấm nút **"Submit"** để gửi biểu mẫu.
8.  Hệ thống tiến hành xác thực dữ liệu đầu vào (Xem kiểm tra nghiệp vụ bổ sung).
9.  Hệ thống tạo mã sản phẩm duy nhất, lưu thông tin sản phẩm vào CSDL và ghi nhận hành động vào hệ thống log.
10. Hệ thống hiển thị hộp thoại xác nhận **"Product Added Successfully"** và tự động đóng form quay về màn hình danh sách sản phẩm.

### 6. Luồng thay thế (Alternative Flows)
*   **A4.1: Người dùng hủy bỏ thao tác (Cancel)**
    1.  Tại bước 4 hoặc 6 của luồng chính, Nhân viên kho bấm chọn nút **"Cancel"** hoặc nút **"Close"** trên form.
    2.  Hệ thống đóng biểu mẫu mà không lưu bất kỳ thay đổi nào và đưa nhân viên kho trở lại màn hình danh sách quản lý sản phẩm.

### 7. Luồng ngoại lệ (Exceptions)
*   **E8.1: Dữ liệu nhập không hợp lệ (Invalid Input Data)**
    1.  Tại bước 8 của luồng chính, nếu dữ liệu nhập thiếu các trường bắt buộc hoặc sai định dạng (ví dụ: tên sản phẩm bị trùng lặp, ảnh quá kích thước cho phép).
    2.  Hệ thống hiển thị thông báo lỗi màu đỏ tại chân từng ô nhập liệu tương ứng và yêu cầu người dùng sửa lại thông tin trước khi submit lại.
*   **E9.1: Lỗi kết nối Cơ sở dữ liệu (Database Connection Error)**
    1.  Tại bước 9 của luồng chính, nếu hệ thống không thể lưu trữ bản ghi do mất kết nối mạng hoặc lỗi server DB.
    2.  Hệ thống ghi nhận lỗi nghiệp vụ hệ thống (log error), hiển thị thông báo lỗi **"System Error: Can not save product. Please try again later."** và giữ nguyên dữ liệu đã điền trên form để người dùng không phải nhập lại từ đầu.

### 8. Quy tắc nghiệp vụ (Business Rules)
*   **BR-01:** Tên sản phẩm sạch không được chứa ký tự đặc biệt nguy hiểm (để phòng chống SQL Injection, XSS) và không được vượt quá 100 ký tự.
*   **BR-02:** Hình ảnh sản phẩm tải lên bắt buộc phải ở định dạng `.jpg`, `.jpeg` hoặc `.png` và kích thước file tối đa là 2MB.
*   **BR-03:** Mỗi sản phẩm phải thuộc ít nhất một danh mục hợp lệ đang hoạt động trong hệ thống.
