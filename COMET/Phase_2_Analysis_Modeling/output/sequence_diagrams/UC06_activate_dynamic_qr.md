# SƠ ĐỒ TRÌNH TỰ CHI TIẾT: UC06 - KÍCH HOẠT PHIÊN ĐIỂM DANH QR ĐỘNG

Tài liệu này đặc tả sự tương tác động giữa các đối tượng phân tích tham gia Use Case **UC06: Kích hoạt phiên điểm danh QR Động** của Giảng viên.

---

## 📊 SƠ ĐỒ TRÌNH TỰ (MERMAID)

```mermaid
sequenceDiagram
    autonumber
    actor GV as Lecturer
    participant LWP as «boundary»<br>LecturerWebPortal
    participant SC as «control»<br>SessionController
    participant S as «entity»<br>Session
    participant V as «entity»<br>AttendanceVersion
    participant QT as «control»<br>QRRefreshTimer
    participant PT as «control»<br>PINRefreshTimer

    GV->>LWP: Select Class Section & Session
    activate LWP
    LWP->>SC: GetSessionDetails(SessionId)
    activate SC
    SC->>S: ReadSessionInfo()
    activate S
    S-->>SC: SessionInfo (Subject, Room, StartTime)
    deactivate S
    SC-->>LWP: Display Session details
    deactivate SC
    LWP-->>GV: Show session detail screen with "Start Attendance" button
    deactivate LWP

    GV->>LWP: Click "Start Attendance"
    activate LWP
    LWP->>SC: ActivateAttendanceSession(SessionId)
    activate SC
    
    %% Kiểm tra ràng buộc thời gian
    SC->>SC: VerifySessionTimeWindow()
    
    SC->>V: InitializeVersion(SessionId)
    activate V
    V-->>SC: AttendanceVersion Created (IsActive=True)
    deactivate V
    
    %% Bắt đầu kích hoạt 2 bộ đếm ngược chạy ngầm làm mới mã
    SC->>QT: StartTimer(Interval=10s)
    activate QT
    QT-->>SC: Timer started
    deactivate QT
    
    SC->>PT: StartTimer(Interval=30s)
    activate PT
    PT-->>SC: Timer started
    deactivate PT
    
    SC-->>LWP: Session Activated Successfully
    deactivate SC
    
    LWP-->>GV: Open dynamic presentation screen (WebSocket Channel Opened)
    deactivate LWP

    %% Luồng chạy ngầm cập nhật mã QR động mỗi 10 giây
    loop Every 10 Seconds
        QT->>SC: OnTimerTick()
        activate SC
        SC->>SC: GenerateNewDynamicToken()
        SC->>V: UpdateDynamicToken(DynamicToken)
        SC->>LWP: PushNewQRViaWebSocket(DynamicToken)
        LWP-->>GV: Display new QR Code on projector screen
        deactivate SC
    end

    %% Luồng chạy ngầm cập nhật mã PIN động mỗi 30 giây
    loop Every 30 Seconds
        PT->>SC: OnTimerTick()
        activate SC
        SC->>SC: GenerateNewPINCode()
        SC->>V: UpdatePINCode(PINCode)
        SC->>LWP: PushNewPINViaWebSocket(PINCode)
        LWP-->>GV: Display new 6-digit PIN on projector corner
        deactivate SC
    end
```

---

## 🔍 QUY TRÌNH KÍCH HOẠT & CẬP NHẬT MÃ

1.  **Bước 10 (Verify Time Window):** Kiểm tra ràng buộc nghiệp vụ chỉ cho phép kích hoạt phiên điểm danh trong đúng khung giờ học chính khóa được phân lịch để tránh kích hoạt bừa bãi.
2.  **Bước 13-16 (Timer Activation):** Hệ thống khởi chạy 2 thread đếm ngược chạy ngầm (`QRRefreshTimer` chu kỳ 10 giây và `PINRefreshTimer` chu kỳ 30 giây). Các timer này sẽ tự động kích hoạt tiến trình làm mới mã độc lập.
3.  **Vòng lặp WebSocket (Mã QR):** Cứ mỗi 10 giây, bộ đếm ngược QR phát sự kiện, bộ điều khiển sinh một token ngẫu nhiên mới lưu vào bảng thực thể `AttendanceVersion` và đẩy tức thời (Push) chuỗi này qua WebSocket xuống trang Web trình chiếu của Giảng viên mà không cần tải lại toàn bộ trang.
4.  **Vòng lặp WebSocket (Mã PIN):** Tương tự như mã QR, mã PIN 6 số dùng làm phương án dự phòng (Fallback 2) sẽ được làm mới sau mỗi 30 giây để hạn chế tối đa việc sinh viên đọc mã truyền miệng ra ngoài phòng học.
