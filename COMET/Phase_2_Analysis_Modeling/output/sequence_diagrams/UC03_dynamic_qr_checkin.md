# SƠ ĐỒ TRÌNH TỰ CHI TIẾT: UC03 - ĐIỂM DANH BẰNG QUÉT QR ĐỘNG

Tài liệu này đặc tả sự tương tác động giữa các đối tượng phân tích tham gia Use Case **UC03: Điểm danh bằng quét QR Động** có tích hợp 3 lớp phòng vệ chống gian lận.

---

## 📊 SƠ ĐỒ TRÌNH TỰ (MERMAID)

```mermaid
sequenceDiagram
    autonumber
    actor SV as Student
    participant SAF as «boundary»<br>StudentAppForm
    participant MD as «boundary»<br>MobileDeviceHardware
    participant WG as «boundary»<br>SchoolWifiGateway
    participant AC as «control»<br>AttendanceController
    participant R as «entity»<br>Room
    participant V as «entity»<br>AttendanceVersion
    participant AR as «entity»<br>AttendanceRecord

    SV->>SAF: Tap "Scan QR Check-in"
    activate SAF
    
    %% Lớp 3 - Xác thực Face ID trên máy
    SAF->>MD: RequestFaceIDVerification()
    activate MD
    MD-->>SAF: Face matched successfully (Local Biometrics OK)
    deactivate MD
    
    SAF->>MD: ActivateCamera()
    activate MD
    MD-->>SAF: Camera view displayed
    deactivate MD
    
    SV->>SAF: Scan QR on screen
    activate MD
    MD->>SAF: DynamicToken extracted from QR
    deactivate MD
    
    %% Thu thập minh chứng số (Telemetry)
    SAF->>MD: GetGPSCoordinates()
    activate MD
    MD-->>SAF: GPS: CheckedInLat, CheckedInLong
    deactivate MD
    
    SAF->>MD: GetDeviceUUID()
    activate MD
    MD-->>SAF: DeviceUUID
    deactivate MD
    
    SAF->>WG: GetNetworkTelemetry()
    activate WG
    WG-->>SAF: WifiSSID, PublicIP Gateway
    deactivate WG
    
    SAF->>AC: SubmitAttendance(StudentId, DynamicToken, Lat, Long, UUID, WifiSSID, PublicIP)
    activate AC
    
    %% Lớp 1 - Kiểm tra mã QR động
    AC->>V: GetActiveTokenForSession()
    activate V
    V-->>AC: ActiveToken, RefreshedAt
    deactivate V
    AC->>AC: VerifyQRTimeWindow(DynamicToken, RefreshedAt)
    
    alt If QR Token is Expired (> 15 seconds)
        AC-->>SAF: Return Error: QR Expired
        SAF-->>SV: Show error "QR code expired. Please scan newest QR."
    else If QR Token is Valid
        %% Lớp 2 - Kiểm tra khoảng cách Geofencing
        AC->>R: GetRoomGeoConfig()
        activate R
        R-->>AC: RoomLat, RoomLong, AllowedRadius
        deactivate R
        AC->>AC: CalculateHaversineDistance(Lat, Long, RoomLat, RoomLong)
        
        alt If Distance > AllowedRadius
            AC->>AR: CreateRecord(StudentId, Status="Fraud_Declined", VerificationMode="QR")
            AC-->>SAF: Return Error: Out of Allowed Radius
            SAF-->>SV: Show error "Fail: You are outside the classroom."
        else If Distance <= AllowedRadius
            %% Kiểm tra chéo Wi-Fi Gateway trường
            AC->>AC: CheckWifiGateway(PublicIP)
            
            %% Ghi nhận điểm danh thành công
            AC->>AR: CreateRecord(StudentId, Status="Present", Distance, UUID, WifiSSID, VerificationMode="QR")
            activate AR
            AR-->>AC: Success Record
            deactivate AR
            
            %% Xóa ngay lập tức ảnh selfie tạm thời khỏi RAM/Server
            AC->>AC: DeleteTempSelfieImage()
            
            AC-->>SAF: Return Success: Checked In
            SAF-->>SV: Display "Checked-in successfully at HH:mm"
        end
    end
    
    deactivate AC
    deactivate SAF
```

---

## 🔍 QUY TRÌNH XÁC THỰC CỐT LÕI (STEPS)

1.  **Bước 2-3 (Face ID):** Bảo vệ lớp 3. Thiết bị di động xác thực khuôn mặt sinh viên tại chỗ bằng cảm biến phần cứng nhằm khóa cứng điện thoại đúng chủ sở hữu.
2.  **Bước 9-11 (Thu thập telemetry):** App tự động lấy định vị GPS, địa chỉ IP mạng Wi-Fi và mã số phần cứng di động để gửi lên Server làm bằng chứng số.
3.  **Bước 15-16 (Xác thực Lớp 1):** Server đối khớp token QR động. Nếu token quá hạn 15 giây (do chụp ảnh gửi cho bạn ở nhà quét), hệ thống từ chối lập tức.
4.  **Bước 19-21 (Xác thực Lớp 2):** Server lấy tọa độ gốc của phòng học, dùng **Công thức Haversine** đo khoảng cách. Vượt quá bán kính động cho phép sẽ bị ghi nhận trạng thái gian lận `Fraud_Declined`.
5.  **Bước 27 (Tối ưu hóa dữ liệu Face ID):** Sau khi xác thực hợp lệ, ảnh selfie tạm thời gửi kèm sẽ bị **xóa sạch ngay lập tức** ra khỏi máy chủ để tuân thủ quyết định thiết kế của người dùng, bảo vệ quyền riêng tư và tối ưu bộ nhớ.
