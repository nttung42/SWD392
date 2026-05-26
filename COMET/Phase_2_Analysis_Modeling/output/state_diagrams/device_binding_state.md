# SƠ ĐỒ TRẠNG THÁI CHI TIẾT: LIÊN KẾT THIẾT BỊ DI ĐỘNG (DEVICE BINDING STATE DIAGRAM)

Tài liệu này mô tả sơ đồ máy trạng thái (State Diagram) cho thực thể **Student Device Binding** (Khóa cứng thiết bị di động của sinh viên) giúp phòng chống điểm danh hộ trên nhiều điện thoại.

---

## 📊 SƠ ĐỒ TRẠNG THÁI (MERMAID)

```mermaid
stateDiagram-v2
    [*] --> Unbound : Account created by Admin
    Unbound --> Bound : First login on App (UUID registered)
    
    Bound --> Reset_Requested : Student clicks "Reset Device" on new phone
    Reset_Requested --> Bound : OTP validation fails 3 times (Lockout 24h)
    
    Reset_Requested --> Unbound : OTP code verified successfully via school email
    Bound --> Admin_Released : Admin manually releases binding (special request)
    Admin_Released --> Unbound : Device UUID cleared from profile
```
