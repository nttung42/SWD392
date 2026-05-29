Dựa trên các tài liệu được cung cấp, phương pháp miêu tả và các quy tắc (rules) để xây dựng một **Activity Diagram** (Biểu đồ hoạt động) được quy định như sau:

**1. Mục đích và Phạm vi áp dụng**
*   **Mô tả kịch bản Use Case:** Activity diagram được sử dụng để biểu diễn các bước thực thi tuần tự của một Use Case, bao gồm toàn bộ luồng chính (normal flow/main sequence) và các luồng thay thế (alternative flows).
*   **Thể hiện luồng điều khiển:** Biểu đồ làm rõ luồng điều khiển (flow of control) và sự tuần tự giữa các hoạt động, bao gồm các điểm rẽ nhánh quyết định (decision nodes), vòng lặp (loops), và các hoạt động diễn ra đồng thời (concurrent activities).
*   **Mô tả luồng giữa các Use Case:** Ngoài việc đi sâu vào một Use Case đơn lẻ, biểu đồ này còn có thể được dùng để thể hiện sự tuần tự (sequencing) giữa nhiều Use Case khác nhau.
*   **Nguyên tắc tinh gọn:** Để miêu tả một Use Case thông thường, bạn không cần dùng toàn bộ các ký pháp phức tạp mà chỉ cần sử dụng một tập hợp con (subset) các chức năng cơ bản của Activity diagram là đủ.

**2. Các quy tắc về ký pháp (Notation Rules)**
Dựa trên các mẫu biểu đồ trong tài liệu, cấu trúc của một Activity Diagram phải tuân thủ các thành phần sau:
*   **Điểm bắt đầu (Initial Node):** Bắt buộc phải có điểm bắt đầu, được thể hiện bằng một **vòng tròn đen đặc**. Nút này thường đi kèm với việc thỏa mãn các tiền điều kiện (preconditions) của Use Case.
*   **Nút hoạt động (Activity Node):** Được vẽ bằng các **hình chữ nhật bo góc**. Một activity node có thể đại diện cho một hoặc nhiều bước thực thi tuần tự của Use Case (ví dụ: "Receive Order Request", "Get Account Information").
*   **Nút quyết định (Decision Node):** Được vẽ bằng **hình thoi**, sử dụng khi luồng sự kiện cần rẽ nhánh (branch) dựa trên một điều kiện logic nào đó.
*   **Điều kiện rẽ nhánh (Guard Conditions):** Luôn được viết bên cạnh các mũi tên đi ra từ nút quyết định và **phải được đặt trong dấu ngoặc vuông `[...]`**. Ví dụ: `[account does not exist]`, `[valid]`, hoặc `[Click add button]`. 
*   **Điểm kết thúc (Final Node):** Kết thúc luồng hoạt động bằng một **vòng tròn đen có viền ngoài**. Nút này tương ứng với việc đạt được các hậu điều kiện (postconditions) của Use Case.

**3. Phân định trách nhiệm qua phân làn (Swimlanes)**
Mặc dù lý thuyết cơ bản không bắt buộc, nhưng trong các tài liệu thiết kế thực tế (Case Study), quy tắc quan trọng khi vẽ Activity diagram cho hệ thống là sử dụng **Swimlanes (phân làn)**:
*   Biểu đồ được chia không gian thành các cột/làn riêng biệt để chỉ rõ chủ thể thực hiện hành động.
*   **Ví dụ:** Một làn dành cho **Tác nhân (Actor)** (như "Warehouse staff" thực hiện việc chọn chức năng, điền thông tin) và một làn dành cho **Hệ thống (System)** (thực hiện việc truy xuất danh sách, kiểm tra lỗi, hiển thị thông báo). Luồng điều khiển (mũi tên) sẽ chạy qua lại giữa các làn này để thể hiện sự tương tác.