# COMET Method Integration Rules for AI Agents

Bộ tài liệu này định nghĩa các quy tắc cốt lõi (Core Rules) và ràng buộc kỹ thuật đối với AI Agents khi tham gia vào chu trình phân tích, thiết kế hệ thống theo phương pháp COMET. Các Agent bắt buộc phải tuân thủ nghiêm ngặt ranh giới giữa 3 Phase cốt lõi để đảm bảo tính tường minh và khả năng truy vết (Traceability).

---

## 📌 PHẦN 1: QUY TẮC CHUNG CHO AGENT (GLOBAL AGENT RULES)

1. **Ranh giới Phân tích và Thiết kế (Analysis vs. Design):** - *Analysis* là phân rã, làm mịn để thấu hiểu bài toán thuộc miền vấn đề (Problem Domain). KHÔNG đưa các quyết định về công nghệ, database cụ thể hoặc hạ tầng vào Phase này.
   - *Design* là tổng hợp, cấu thành giải pháp thuộc miền giải pháp (Solution Domain). Đây là lúc ánh xạ các mô hình phân tích thành kiến trúc phần mềm thực tế.
2. **Quy tắc Truy vết (Traceability Rule):** Bất kỳ thực thể nào được sinh ra ở Phase sau (Analysis, Design) đều phải chứng minh được nguồn gốc từ một Use Case hoặc Actor cụ thể ở Phase trước (Requirements).
3. **Sử dụng Ngôn ngữ Đặc tả (Notation Rule):** Tất cả các biểu đồ hoặc cấu trúc logic xuất ra phải tuân thủ nghiêm ngặt chuẩn UML 2.x (Sử dụng cú pháp PlantUML để biểu diễn).

---

## 🌀 PHẦN 2: BỘ QUY TẮC CHI TIẾT THEO TỪNG PHASE CỦA COMET

### 🚀 Phase 1: Requirements Modeling (Mô hình hóa Yêu cầu)
* **Bản chất:** Định nghĩa ranh giới hệ thống từ góc nhìn bên ngoài qua Functional Requirements.
* **Mục tiêu:** Xác định hệ thống làm *cái gì* (What), không quan tâm hệ thống làm *như thế nào* (How).

#### 🛠️ Nhiệm vụ & Hành động của Agent:
- Xác định toàn bộ **Actors** (Chủ thể kích hoạt hoặc nhận giá trị: Con người, Hệ thống bên ngoài, Thiết bị I/O vật lý, Timers).
- Định nghĩa các **Use Cases (UC)**. Đảm bảo mỗi UC đại diện cho một chuỗi tương tác mang lại giá trị thực tế cho Actor, tránh việc phân rã UC thành các hàm chức năng nhỏ (Functional Decomposition).
- Đặc tả chi tiết từng Use Case theo template chuẩn: *Summary, Preconditions, Main Sequence (Dòng sự kiện chính), Alternative Sequences (Dòng sự kiện thay thế/Ngoại lệ), Postconditions*.

#### ⚠️ Ràng buộc nghiêm ngặt (Constraints):
- **Rule 1.1:** Mọi Use Case bắt buộc phải được khởi đầu (initiate) bằng một input event từ một Actor cụ thể.
- **Rule 1.2:** Nghiêm cấm sử dụng các thuật ngữ kỹ thuật tầng sâu (như: "gọi API", "insert vào bảng SQL", "Kafka queue") trong tài liệu mô tả Use Case. Thay vào đó hãy dùng ngôn ngữ nghiệp vụ ("Hệ thống ghi nhận thông tin", "Hệ thống gửi yêu cầu").

---

### 🔍 Phase 2: Analysis Modeling (Mô hình hóa Phân tích)
* **Bản chất:** Phân rã thế giới bên trong hệ thống để hiện thực hóa (realize) các Use Case.
* **Mục tiêu:** Xác định các Software Objects tham gia vào Use Case và cách chúng tương tác cục bộ.

#### 🛠️ Nhiệm vụ & Hành động của Agent:
- **Static Modeling (Mô hình hóa Tĩnh):** Xác định các lớp thực thể (**Entity Classes**) lưu trữ dữ liệu lâu dài và mối quan hệ giữa chúng (Association, Composition, Aggregation).
- **Object Structuring (Định hình Đối tượng):** Phân loại đối tượng theo đúng các chuẩn **UML Stereotypes** của COMET:
  - `«boundary»`: Giao tiếp môi trường ngoài (User Interface, Device I/O, Proxy hệ thống khác).
  - `«entity»`: Quản lý, lưu trữ dữ liệu lâu dài.
  - `«control»`: Điều phối chuỗi hành động, thường quản lý máy trạng thái (`«state-machine»`).
  - `«application logic»`: Xử lý business rules (`«business logic»`) hoặc thuật toán phức tạp (`«algorithm»`).
- **Dynamic Modeling (Mô hình hóa Động):** - Thiết kế **Interaction Diagrams** (Sequence hoặc Communication Diagram) cho từng Use Case (Bao gồm cả Main & Alternative flow).
  - Thiết kế **State Machine Diagrams** (`«state-dependent control»`) đối với các đối tượng có hành vi thay đổi nghiêm ngặt dựa trên trạng thái hiện tại (ví dụ: ATM Control, Cruise Control).

#### ⚠️ Ràng buộc nghiêm ngặt (Constraints):
- **Rule 2.1:** Mọi Object xuất hiện trong Sequence Diagram bắt buộc phải được định rõ Stereotype bằng ký hiệu guillemets (`«stereotype»`).
- **Rule 2.2:** Một đối tượng `«boundary»` nhận input từ bên ngoài không được phép thao tác trực tiếp với dữ liệu bên trong `«entity»` mà bắt buộc phải đi qua một đối tượng điều phối hoặc xử lý logic (`«control»` hoặc `«application logic»`).
- **Rule 2.3:** Dynamic Analysis phải phản ánh chính xác các bước trong Use Case Description của Phase 1.

---

### 📐 Phase 3: Design Modeling (Mô hình hóa Thiết kế)
* **Bản chất:** Tổng hợp kết quả phân tích để kiến trúc nên giải pháp kỹ thuật, ánh xạ vào môi trường triển khai thực tế.
* **Mục tiêu:** Đưa ra quyết định về cấu trúc phân rã hệ thống, tính đồng thời (concurrency), các mẫu thiết kế (Design Patterns) và phân phối vật lý.

#### 🛠️ Nhiệm vụ & Hành động của Agent:
- **Subsystem Structuring:** Hợp nhất các sơ đồ tương tác riêng lẻ của từng Use Case thành một **Integrated Communication Diagram** tổng thể để xác định ranh giới các **Subsystems** (Phân rã theo Separation of Concerns).
- **Concurrency & Task Architecture:** Phân loại các đối tượng thành Active (Chủ động - chạy luồng riêng `Active Task`) hoặc Passive (Bị động - chạy trên luồng của đối tượng gọi nó). Xác định cơ chế giao tiếp giữa các Task (Đồng bộ `Synchronous` hay Bất đồng bộ `Asynchronous`).
- **Software Architecture Selection:** Ánh xạ cấu trúc sang một mô hình kiến trúc phù hợp: *Client/Server Architecture, Service-Oriented Architecture (SOA), Component-Based Architecture, hay Real-Time Centralized/Distributed Control*.
- **Detailed Design & Patterns:** Thiết kế chi tiết interface cho từng Class/Component, lựa chọn và áp dụng các Design Patterns (như *Strategy, Factory, Singleton, Command, Observer*...) dựa trên các thuộc tính chất lượng (Quality Attributes) như hiệu năng, bảo mật, hay khả năng bảo trì. Ánh xạ sơ đồ lớp sang thiết kế cơ sở dữ liệu (Relational/NoSQL Database Design).

#### ⚠️ Ràng buộc nghiêm ngặt (Constraints):
- **Rule 3.1:** Khi cấu trúc hệ thống phân tán (Distributed Subsystems), Agent phải định nghĩa rõ ràng cấu trúc thông điệp (Message Interfaces) và cơ chế buffering dữ liệu khi giao tiếp qua kênh bất đồng bộ (`Asynchronous Message Communication`).
- **Rule 3.2:** Interface của Class thiết kế phải định nghĩa tường minh: Tên hàm, tham số đầu vào (input parameters), giá trị trả về (return value), đi kèm các ràng buộc `Precondition`, `Postcondition` và `Invariant` (nếu có).
- **Rule 3.3:** Mọi quyết định đánh đổi kiến trúc (Architectural Trade-offs) phải được giải trình rõ ràng dựa trên mức độ ưu tiên của các Quality Attributes (ví dụ: Tăng hiệu năng `Performance` bằng cách chấp nhận giảm tính dễ sửa đổi `Modifiability`).

---

## 📊 PHẦN 3: MA TRẬN PHÂN VAI AGENTS (AGENT ROLE MAPPING)

Để hệ thống đa Agent hoạt động nhịp nhàng, các Agent được gán vai trò tương ứng với thế mạnh của mình:

| Tên Agent | Phase Đảm nhiệm chính | Đầu vào (Input) | Đầu ra mong đợi (Output) |
| :--- | :--- | :--- | :--- |
| **Business Analyst Agent** | Phase 1: Requirements | Bản mô tả bài toán thô | Actor List, Use Case Diagrams & Detailed UC Specifications |
| **System Analyst Agent** | Phase 2: Analysis | Output của Phase 1 | Stereotyped Class Diagrams, Sequence/Communication Diagrams, Statecharts |
| **Software Architect Agent** | Phase 3: Design (High-level) | Output của Phase 2 | Subsystem Diagram, Concurrent Task Architecture, SOA/Component Interfaces |
| **Detailed Design Agent** | Phase 3: Design (Low-level) | Output của Architect Agent | Detailed Class Specifications (Methods, DB Schema, Design Patterns applied) |
| **Quality & Traceability Agent**| Toàn bộ chu trình | Sản phẩm của tất cả các Agent | Báo cáo kiểm định tính đúng đắn, Ma trận truy vết yêu cầu (Traceability Matrix) |

---

## 🚨 QUY TRÌNH XỬ LÝ LỖI (EXCEPTION HANDLING RULES)

1. **Lỗi Mơ hồ Yêu cầu (Ambiguity):** Nếu ở Phase 2, `System Analyst Agent` phát hiện dòng sự kiện trong Use Case của Phase 1 bị thiếu logic hoặc không rõ ràng $\rightarrow$ Bắt buộc dừng tiến trình, gửi tín hiệu *Reject/Feedback* quay lại Phase 1 để yêu cầu làm rõ, không tự ý giả định (infer) nghiệp vụ.
2. **Lỗi Rò rỉ Công nghệ (Technology Leak):** Nếu `Quality Agent` quét thấy các từ khóa công nghệ nằm trong tài liệu của Phase 1 hoặc Phase 2 $\rightarrow$ Từ chối phê duyệt (Fail Check) và yêu cầu Agent thế chỗ bằng các khái niệm mang tính trừu tượng/ng nghiệp vụ.