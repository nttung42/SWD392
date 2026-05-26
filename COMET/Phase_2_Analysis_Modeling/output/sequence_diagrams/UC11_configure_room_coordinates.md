# SƠ ĐỒ TRÌNH TỰ CHI TIẾT: UC11 - CẤU HÌNH TỌA ĐỘ VÀ BÁN KÍNH PHÒNG HỌC

Tài liệu này đặc tả sự tương tác động giữa các đối tượng phân tích tham gia Use Case **UC11: Cấu hình tọa độ và bán kính phòng học** của Quản trị viên (Admin).

---

## 📊 SƠ ĐỒ TRÌNH TỰ (MERMAID)

```mermaid
sequenceDiagram
    autonumber
    actor AD as Admin
    participant AWP as «boundary»<br>AdminWebPortal
    participant RCC as «control»<br>RoomConfigurationController
    participant R as «entity»<br>Room
    participant SL as «entity»<br>SystemLog

    AD->>AWP: Click "Room Management"
    activate AWP
    AWP->>RCC: GetRoomsList()
    activate RCC
    RCC->>R: ReadAllRooms()
    activate R
    R-->>RCC: List of Rooms
    deactivate R
    RCC-->>AWP: Display room table
    deactivate RCC
    AWP-->>AD: Show room table with config buttons
    deactivate AWP

    AD->>AWP: Click "Edit Coordinates" for specific Room
    activate AWP
    AWP-->>AD: Open RoomConfigForm with integrated satellite map
    deactivate AWP

    %% Lựa chọn nhập tọa độ (Cách 1: Bản đồ, Cách 2: Thủ công)
    alt Option A: Click on satellite map
        AD->>AWP: Click exact classroom location on map
        activate AWP
        AWP->>AWP: ExtractLatLongFromMapClick()
        AWP-->>AD: Automatically populate Lat & Long fields
        deactivate AWP
    else Option B: Get current GPS (Mobile device at site)
        AD->>AWP: Tap "Get Current GPS Location"
        activate AWP
        AWP->>AWP: RequestBrowserGeoLocationAPI()
        AWP-->>AD: Populate Lat & Long fields with hardware coordinates
        deactivate AWP
    end

    AD->>AWP: Enter "Allowed Radius" (e.g. 20m) & click "Save Config"
    activate AWP
    AWP->>RCC: SaveGeoConfiguration(RoomId, Latitude, Longitude, AllowedRadius)
    activate RCC
    
    %% Xác thực nghiệp vụ
    RCC->>RCC: ValidateCoordinates(Latitude, Longitude)
    RCC->>RCC: ValidateRadius(AllowedRadius)
    
    alt If coordinates or radius are invalid (Exception E8.1)
        RCC-->>AWP: Return Error: Invalid Geo-data
        AWP-->>AD: Highlight error fields & request correction
    else If configuration is valid
        RCC->>R: UpdateGeoConfig(Latitude, Longitude, AllowedRadius)
        activate R
        R-->>RCC: Update Success
        deactivate R
        
        %% Ghi nhận nhật ký hệ thống
        RCC->>SL: WriteLog(AdminId, Action="Configure_Room", RoomId)
        
        RCC-->>AWP: Return Success: Configurations Saved
        AWP-->>AD: Show confirmation popup & return to room table
    end
    deactivate RCC
    deactivate AWP
```

---

## 🔍 QUY TRÌNH CẤU HÌNH & XÁC THỰC GPS PHÒNG

1.  **Cách 1 & 2 (Nạp tọa độ tự động):** Để tối ưu hóa trải nghiệm sử dụng (Usability), hệ thống hỗ trợ cả việc tích chọn trực tiếp trên bản đồ vệ tinh (Google Maps API) lẫn việc Admin cầm máy tính bảng đi trực tiếp đến phòng học vật lý và gọi cảm biến GPS phần cứng (`Get Current GPS Location`) để tự động nạp tọa độ chính xác cao mà không cần ghi nhớ số liệu.
2.  **Bước 18 (Validate GPS):** Bộ điều khiển `RoomConfigurationController` kiểm tra tọa độ GPS nhập vào xem có nằm đúng trong phạm vi khuôn viên địa giới của trường FPTU hay không (BR-02) để tránh các sai số nhập liệu quá lớn từ Admin.
3.  **Bước 25 (Write Log):** Mọi thao tác thay đổi cấu hình địa lý phòng học phục vụ chống gian lận bắt buộc phải được ghi nhật ký hệ thống (`SystemLog`) chi tiết để phục vụ việc kiểm toán bảo mật về sau.
