# HƯỚNG DẪN CẤU TRÚC THƯ MỤC THIẾT KẾ PHẦN MỀM COMET (SWD392)

Chào mừng bạn và AI Agent đến với không gian thiết kế phần mềm theo phương pháp **COMET** (Concurrent Object Modeling and Architectural Design Method). 

Mục tiêu của thư mục này là tạo ra một kiến trúc thiết kế **xuyên suốt, rõ ràng, dễ bảo trì**, giúp cả **Con người** và **AI Agent** có thể cộng tác mượt mà thông qua các file định dạng Markdown (`.md`) và sơ đồ dạng văn bản Mermaid.

---

## 🗺️ BẢN ĐỒ THƯ MỤC (DIRECTORY MAP)

Dự án được chia thành 5 giai đoạn chính theo đúng vòng đời phát triển phần mềm của COMET:

```text
COMET/
├── README.md                           # File bạn đang đọc - Bản đồ & Quy tắc làm việc
│
├── Phase_1_Requirements_Modeling/      # Giai đoạn 1: Mô hình hóa Yêu cầu
│   ├── decisions.md                    # Nhật ký quyết định yêu cầu (ADR)
│   └── output/
│       ├── system_context.md           # Sơ đồ ngữ cảnh hệ thống (System Context Diagram)
│       ├── entity_class_diagram.md     # Sơ đồ lớp thực thể (Entity Class Diagram)
│       ├── data_dictionary.md          # Từ điển dữ liệu (Data Dictionary)
│       └── use_cases/                  # Thư mục đặc tả từng Use Case
│           └── UC01_example.md         # File đặc tả Use Case mẫu
│
├── Phase_2_Analysis_Modeling/          # Giai đoạn 2: Mô hình hóa Phân tích
│   ├── decisions.md                    # Nhật ký phân tích đối tượng
│   └── output/
│       ├── sequence_diagrams/          # Trình tự tương tác cho từng Use Case (Sequence Diagrams)
│       │   └── UC01_example.md         # Sơ đồ trình tự cho Use Case mẫu
│       ├── communication_diagrams/     # Sơ đồ truyền thông (Communication Diagrams)
│       └── state_diagrams/             # Sơ đồ trạng thái cho thực thể phức tạp (State Diagrams)
│
├── Phase_3_Design_Modeling/            # Giai đoạn 3: Mô hình hóa Thiết kế
│   ├── decisions.md                    # Nhật ký quyết định kiến trúc & công nghệ
│   └── output/
│       ├── high_level_architecture.md  # Thiết kế kiến trúc tổng quan (Clean/Layered Arch)
│       ├── deployment_diagram.md       # Sơ đồ triển khai hệ thống (Deployment Diagram)
│       ├── package_component_diagram.md# Sơ đồ gói & thành phần (Package & Component Diagram)
│       ├── detailed_class_diagram.md   # Thiết kế lớp chi tiết (Detailed Design Classes)
│       └── database_schema.md          # Thiết kế CSDL vật lý và SQL Script
│
├── Phase_4_Incremental_Construction/    # Giai đoạn 4: Xây dựng mã nguồn tăng trưởng
│   ├── decisions.md                    # Nhật ký quyết định phân chia Sprint & Tech Stack
│   └── output/
│       ├── project_structure_mapping.md# Ánh xạ từ gói thiết kế sang thư mục code thực tế
│       └── coding_guidelines.md        # Quy chuẩn viết code & Coding Standards
│
└── Phase_5_Integration_Testing/        # Giai đoạn 5: Tích hợp & Kiểm thử
    ├── decisions.md                    # Nhật ký quyết định phạm vi test & Chiến lược test
    └── output/
        ├── unit_test_specs.md          # Đặc tả các trường hợp Unit Test
        ├── integration_test_plan.md    # Kịch bản kiểm thử tích hợp
        └── system_test_scenarios.md    # Kịch bản test thực tế theo đặc tả Use Case
```

---

## 🤖 NGUYÊN TẮC VÀNG CHO AI AGENT (AI AGENT RULES)

Khi làm việc trong thư mục `COMET` này, AI Agent **bắt buộc** phải tuân thủ nghiêm ngặt các quy tắc sau:

1.  **Traceability (Tính truy vết):** 
    *   Trước khi thực hiện bất kỳ chỉnh sửa nào ở một Phase sau, Agent phải đọc kỹ các thông tin ở Phase trước để bảo đảm sự đồng nhất dữ liệu (ví dụ: Tên hàm trong code ở Phase 4 phải khớp 100% với tên phương thức trong `detailed_class_diagram.md` ở Phase 3).
2.  **Cascading Updates (Cập nhật thác nước):**
    *   Nếu có sự thay đổi yêu cầu ở Phase 1, Agent phải tự động rà soát và đề xuất cập nhật các sơ đồ tương ứng ở Phase 2, Phase 3 và cấu trúc code ở Phase 4.
3.  **Mermaid Diagram Standard (Chuẩn hóa sơ đồ bằng Mermaid):**
    *   Tất cả các sơ đồ (Context, Entity, Sequence, Class, State...) phải được biểu diễn bằng mã **Mermaid** đặt trong khối code Markdown (` ```mermaid `) để dễ dàng đọc, chỉnh sửa và so sánh lịch sử thay đổi qua Git.
4.  **No Placeholders (Không viết tắt/bỏ trống):**
    *   Không viết "TBD", "TODO" hay bỏ lửng. Mọi tài liệu đặc tả phải đầy đủ các trường thông tin quy định.

---

## ✍️ NGUYÊN TẮC CHO NGƯỜI (HUMAN GUIDE)

*   **Review từng Phase:** Hãy phê duyệt các tài liệu trong thư mục `output` của Phase hiện tại trước khi yêu cầu AI Agent chuyển sang thực hiện Phase tiếp theo.
*   **Sử dụng Decisions Log:** Bất kỳ khi nào bạn thảo luận và chốt một giải pháp thiết kế với Agent, hãy nhắc Agent ghi nhận lại lý do vào file `decisions.md` của Phase tương ứng. Điều này giúp dự án lưu lại "lịch sử tư duy" để các Agent khác tham chiếu sau này.
