## **ĐỀ BÀI THIẾT KẾ PHẦN MỀM** 

## **SWD392 - Summer 2026** 

_HỆ THỐNG ĐIỂM DANH CHỐNG GIAN LẬN_ 

_Quy mô mô phỏng: ~8.000 Sinh viên | Cấp độ: Bachelor (Đồ án / Bài tập lớn)_ 

## **1. Ý tưởng cốt lõi của hệ thống** 

Hệ thống tập trung giải quyết bài toán cốt lõi: Tự động hóa quy trình điểm danh đầu giờ và chống các hình thức gian lận phổ biến (điểm danh hộ khi ở nhà, chụp ảnh mã QR gửi cho bạn bè). 

## **2. Yêu cầu chức năng (Functional Requirements)** 

## **2.1. Phân hệ Sinh viên (Giao diện Mobile App hoặc Web Mobile)** 

- **Đăng nhập bằng tài khoản cá nhân:** Mỗi sinh viên đăng nhập bằng mã số sinh viên (MSSV) và mật khẩu được cấp. 

- **Quét mã QR để điểm danh nhanh:** Mở camera trên ứng dụng để tiến hành quét mã QR đang hiển thị trên bảng/máy chiếu của giảng viên. 

- **Tự động đính kèm dữ liệu xác thực:** Khi nhấn nút điểm danh, hệ thống tự động lấy tọa độ vị trí hiện tại (GPS) và mã định danh thiết bị (Device ID/UUID) để gửi lên Server kèm theo minh chứng học tập. 

- **Xem lịch sử chuyên cần:** Theo dõi trực quan danh sách các buổi học đã tham gia, số buổi vắng và trạng thái đi học (Đúng giờ / Muộn / Vắng). 

## **2.2. Phân hệ Giảng viên (Giao diện Web Portal)** 

- **Quản lý danh sách lớp học học phần:** Xem thông tin các lớp mình được phân công giảng dạy trong học kỳ. 

- **Kích hoạt phiên điểm danh bằng QR Động:** Bấm nút khởi tạo, hệ thống hiển thị màn hình mã QR lớn trên máy chiếu. Mã QR này tự động làm mới (thay đổi chuỗi token bên trong) sau mỗi 10 giây. 

- **Theo dõi tiến độ thời gian thực (Real-time):** Danh sách sinh viên đi học sẽ sáng xanh ngay lập tức khi quét mã thành công thông qua kết nối Socket (hoặc cơ chế Polling đơn giản). 

- **Chốt sổ và xuất báo cáo dữ liệu:** Kết thúc phiên, giảng viên có thể sửa đổi trạng thái thủ công (nếu có lý do chính đáng) và xuất danh sách chuyên cần ra file Excel. 

## **2.3. Phân hệ Quản trị viên (Admin Web Portal)** 

- **Quản lý danh mục hệ thống:** Thêm, sửa, xóa dữ liệu thô bao gồm thông tin Tài khoản (Sinh viên, Giảng viên), Môn học, và danh sách các Lớp học phần. 

- **Quản lý cấu hình Phòng học:** Thiết lập tọa độ gốc GPS (Kinh độ, Vĩ độ) cho từng phòng học cố định trong khuôn viên trường nhằm phục vụ thuật toán xác thực. 

## **3. Cơ chế chống gian lận trọng tâm (Anti-Fraud Logic)** 

Để tạo điểm nhấn học thuật cho đồ án tốt nghiệp, hệ thống tập trung xây dựng vững chắc 2 lớp phòng vệ nghiệp vụ: 

- **Lớp 1 - Chống chia sẻ ảnh QR từ xa (Dynamic QR Code):** Chuỗi dữ liệu mã hóa trong QR chứa một token ngẫu nhiên đi kèm mốc thời gian (Timestamp). Server chỉ chấp nhận các lượt quét có mã trùng khớp với phiên hiện hành trong vòng tối đa 10-15 giây. Sinh viên chụp ảnh gửi qua tin nhắn cho bạn ở nhà sẽ hoàn toàn mất tác dụng do mã đã lỗi thời. 

- **Lớp 2 - Chống điểm danh hộ khi ở nhà (Geofencing - Hàng rào địa lý):** Khi nhận được 

   - tọa độ GPS từ điện thoại sinh viên gửi lên, Server áp dụng công thức toán học (ví dụ công thức Haversine) để tính khoảng cách đường thẳng đến tọa độ phòng học. Nếu khoảng cách vượt ngưỡng thiết lập (ví dụ > 20 mét), hệ thống đánh dấu gian lận và từ chối ghi nhận điểm danh. 

- **Lớp 3 - Chống sử dụng máy điện thoại điểm danh hộ** : Cần có cơ chế xác thực bằng khuôn mặt hoặc dấu hiệu sinh trắc học khác. 

## **4. Đặc điểm phi chức năng thích hợp cho đồ án (Non-Functional Requirements)** 

|**Đặc tính**|**Tiêu chí kỹ thuật**|**Giải pháp triển khai thực tế**|
|---|---|---|
|||**đồ án**|
|**Khả năng chịu tải đầu giờ**|Xử lý đồng thời 500 - 1.000|Thay vì truy vấn trực tiếp DB,|
|**(Concurrency)**|requests trong khoảng 5 phút|sinh viên có thể dùng thư viện|
||đầu giờ.|Redis làm bộ nhớ đệm tạm thời|
|||(Cache) để xác thực token mã|
|||QR cực nhanh.|
|**Độ chính xác vị trí**|Sai số định vị chấp nhận được:|Bù trừ sai số phần cứng GPS|
|**(Accuracy)**|15 - 20 mét.|của điện thoại bằng cách cho|
|||cấu hình bán kính linh hoạt tùy|



thuộc vị trí phòng học. **Tính dễ sử dụng** Thời gian phản hồi quét QR < 2 Giao diện mobile app tinh gọn, **(Usability)** giây. mở app hiển thị ngay nút chức Giao diện di động tối giản. năng 'Quét Mã' giúp tối ưu thời gian thao tác cho sinh viên. 

## **5. Yêu cầu nhiệm vụ của dự án:** 

- Thành lập nhóm, 

- Đăng ký danh sách thành viên và 

- Thực hiện các quá trình gồm : Requirement Modeling, Analysis Modeling, Design Modeling. 

- Tổng hợp tất cả các sản phẩm đã tạo ra trong quá trình thiết kế vào tài liệu mô tả thiết kế phần mềm. 

- Có thể sử dụng AI để sinh ra sản phẩm prototype demo và chứng minh tính khả thi của giải pháp nhóm đã đề ra (bonus). 

## **I. Giai đoạn Requirement Modeling:** 

- A. Viết quy trình nghiệp vụ điểm danh, chống gian lận, quản lý chuyên cần và kiểm soát gian lận. 

- B. Vẽ Use-case diagram cho toàn hệ thống và cho từng role (nếu cần). 

- C. Viêt use-case description cho từng use-case. 

- D. Phân tích kỹ yêu cầu về mặt phi chức năng của hệ thống. 

## **II. Giai đoạn Analysis Modeling:** 

- A. Thực hiện phân tích tĩnh: 

   1. Xây dựng sơ đồ class diagram mức lõi - Entity class diagram 

   2. Xây dựng sơ đồ class diagram về các lớp biên và ngữ cảnh hệ thống. (Contextual Boundary Class Diagram) 

      - a) Xây dựng các mô tả thiết kế giao diện (Mockups hoặc Wireframe) 

   3. Xây dựng sơ đồ phân cấp các lớp đối tượng (cây cấu trúc phân cấp) dựa trên các tiêu chí tổ chức đối tượng. (Object Structuring Criteria) 

- B. Thực hiện phân tích động: 

   1. Xây dựng biểu đồ communication diagrams và/hoặc sequence diagrams cho các use-cases. 

   2. Xây dựng biểu đồ state diagrams cho các đối tượng phụ thuộc vào trạng thái (state-depend control object) và/hoặc activity diagrams mô tả giải thuật (nếu cần thiết). 

III. Giai đoạn Design Modeling: 

- A. Ra quyết định lựa chọn công nghệ để cài đặt hiện thực hóa sản phẩm. 

- B. Chuyển hóa các biểu đồ communication diagram từ mức phân tích sang mức thiết kế (chi tiết các yếu tố kỹ thuật dựa trên đánh giá và xem xét về môi trường triển khai cài đặt của sản phẩm). 

- C. Chuyển hóa từ Entity Class diagram thành các cấu trúc cơ sở dữ liệu dạng bảng hoặc cấu trúc tương đương. 

- D. Xây dựng sơ đồ communication diagram tích hợp để tổng hợp các nội dung đã phân tích chi tiết. 

- E. Thực hiện ra quyết định phân chia về mặt hệ thống và các module, cơ chế giao tiếp giữa các module. (áp dụng các tiêu chí phân chia module, phân chia lớp đối tượng, phân chia thành phần, dịch vụ hoặc phân chia hệ thống con). 

- F. Tiến hành ra quyết định và mô tả thiết kế kiến trúc/thiết kế mức cao/thiết kế cơ bản của hệ thống trên tối thiểu 3 góc nhìn (3 Views): Static View, Dynamic View và Deployment View. 

- G. Tiến hành ra quyết định và đặc tả chi tiết các thành phần: lớp đối tượng, giao diện giữa các lớp đối tượng, giao diện giữa các thành phần, giao diện dịch vụ, các tác vụ đồng thời (nếu có). 

