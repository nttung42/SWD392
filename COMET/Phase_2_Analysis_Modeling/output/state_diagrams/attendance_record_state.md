# SƠ ĐỒ TRẠNG THÁI CHI TIẾT: BẢN GHI ĐIỂM DANH (ATTENDANCE RECORD STATE DIAGRAM)

Tài liệu này mô tả sơ đồ máy trạng thái (State Diagram) cho thực thể **AttendanceRecord** (Bản ghi kết quả điểm danh) từ lúc sinh viên gửi dữ liệu cho đến khi được lưu trữ chính thức hoặc từ chối do phát hiện gian lận.

---

## 📊 SƠ ĐỒ TRẠNG THÁI (MERMAID)

```mermaid
stateDiagram-v2
    [*] --> Submitted : Student sends check-in telemetry
    
    Submitted --> Verifying_Token : Server matches Dynamic QR Token (Layer 1)
    
    Verifying_Token --> Failed_Expired : Token older than 15s
    Failed_Expired --> [*] : Rejection logged
    
    Verifying_Token --> Verifying_Location : Token is valid
    
    Verifying_Location --> Verifying_Device : GPS Distance < AllowedRadius (Layer 2)
    Verifying_Location --> Failed_Location_Fraud : GPS Distance > AllowedRadius
    Failed_Location_Fraud --> [*] : Saved as "Fraud_Declined" in DB
    
    Verifying_Device --> Verifying_Biometrics : DeviceUUID matches bound device (Layer 3)
    Verifying_Device --> Failed_Device_Mismatch : DeviceUUID belongs to another student
    Failed_Device_Mismatch --> [*] : Rejection logged
    
    Verifying_Biometrics --> Checked_In_Present : Face ID match score > 85%
    Verifying_Biometrics --> Failed_Face_Mismatch : Face ID matching fails
    Failed_Face_Mismatch --> [*] : Rejection logged
    
    Checked_In_Present --> Checked_In_Late : Checked-in time > Class start time
    
    Checked_In_Present --> [*] : Saved as "Present" / Selfie image deleted
    Checked_In_Late --> [*] : Saved as "Late" / Selfie image deleted
```
