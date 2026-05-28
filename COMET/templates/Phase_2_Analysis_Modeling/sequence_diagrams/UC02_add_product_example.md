# SƠ ĐỒ TRÌNH TỰ (SEQUENCE DIAGRAM SPECIFICATION)

---

## 📄 [UC-02]: ADD PRODUCT (THÊM SẢN PHẨM MỚI)

Sơ đồ trình tự mô tả cách thức các đối tượng phân tích tham gia tương tác với nhau theo trình tự thời gian để hoàn thành luồng sự kiện chính của Use Case **Add Product**.

Theo mô hình phân tích đối tượng của COMET, các lớp tham gia được gán nhãn Stereotype như sau:
*   `Actor: WarehouseStaff` (Tác nhân ngoài)
*   `«boundary» ProductForm` (Giao diện thêm sản phẩm)
*   `«control» ProductController` (Bộ điều khiển nghiệp vụ)
*   `«entity» Product` (Lớp thực thể sản phẩm)
*   `«entity» Category` (Lớp thực thể danh mục loại)

---

## 📊 SƠ ĐỒ TRÌNH TỰ (MERMAID)

```mermaid
sequenceDiagram
    autonumber
    actor WS as WarehouseStaff
    participant PF as «boundary»<br>ProductForm
    participant PC as «control»<br>ProductController
    participant C as «entity»<br>Category
    participant P as «entity»<br>Product

    WS->>PF: Select "Add Product" action
    activate PF
    PF->>PC: RequestFormInit()
    activate PC
    PC->>C: GetActiveCategories()
    activate C
    C-->>PC: List of active Categories
    deactivate C
    PC-->>PF: Populate form dropdown with categories
    deactivate PC
    PF-->>WS: Display form with category list
    deactivate PF

    WS->>PF: Fill in details (Name, Measure, Image) & submit
    activate PF
    PF->>PC: SubmitProductDetails(Name, Measure, Image, CatId)
    activate PC
    PC->>PC: ValidateInputData(Name, Measure, Image)
    
    alt If input data is valid (Normal Flow)
        PC->>P: CreateNewProduct(Name, Measure, Image, CatId)
        activate P
        P->>P: GenerateProId()
        P-->>PC: New Product Instance
        deactivate P
        PC->>PC: SaveToDatabase(Product)
        PC-->>PF: ProductSavedConfirmation()
        PF-->>WS: Show success notification "Product Added Successfully"
    else If input data is invalid (Exception Flow E8.1)
        PC-->>PF: InvalidInputError(Message)
        PF-->>WS: Highlight error fields & request correction
    end
    deactivate PC
    deactivate PF
```

---

## 📝 MÔ TẢ CHI TIẾT CÁC THÔNG ĐIỆP (MESSAGES EXPLANATION)

| STT | Tên Thông điệp | Đối tượng Gửi | Đối tượng Nhận | Mô tả chức năng & Nghiệp vụ đi kèm |
| :--- | :--- | :--- | :--- | :--- |
| **1** | `Select "Add Product"` | WarehouseStaff | `«boundary» ProductForm` | Tác nhân kho bắt đầu kích hoạt hành động bằng cách chọn chức năng thêm sản phẩm. |
| **2** | `RequestFormInit()` | `«boundary» ProductForm` | `«control» ProductController` | Giao diện gửi yêu cầu khởi tạo dữ liệu cho Form, cần lấy danh mục để hiển thị. |
| **3** | `GetActiveCategories()` | `«control» ProductController` | `«entity» Category` | Lớp điều khiển gọi lớp thực thể danh mục để lấy danh sách các danh mục đang mở bán. |
| **8** | `SubmitProductDetails(...)`| `«boundary» ProductForm` | `«control» ProductController` | Biểu mẫu gửi toàn bộ thông tin người dùng đã nhập xuống tầng xử lý logic nghiệp vụ. |
| **9** | `ValidateInputData(...)` | `«control» ProductController` | *Self-Call (Chính nó)* | Controller tự gọi hàm xác thực định dạng dữ liệu, ảnh, tính hợp lệ của danh mục (BR-01, BR-02). |
| **10**| `CreateNewProduct(...)` | `«control» ProductController` | `«entity» Product` | Khởi tạo một đối tượng thực thể Product mới trong RAM nếu dữ liệu kiểm tra hợp lệ. |
| **12**| `SaveToDatabase(Product)` | `«control» ProductController` | *Self-Call (Chính nó)* | Bộ điều khiển thực hiện lưu trữ vĩnh viễn thực thể vào CSDL quan hệ. |
