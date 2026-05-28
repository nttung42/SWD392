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
    
    Verifying_Device --> Verifying_BiometricSignal : DeviceUUID matches bound device (Layer 3)
    Verifying_Device --> Failed_Device_Mismatch : DeviceUUID belongs to another student
    Failed_Device_Mismatch --> [*] : Rejection logged
    
    Verifying_BiometricSignal --> Checked_In_Present : BiometricVerified = True
    Verifying_BiometricSignal --> Verifying_SelfieFallback : Local biometric unavailable or failed
    Verifying_SelfieFallback --> Checked_In_Present : Temporary selfie proof verified
    Verifying_SelfieFallback --> Failed_Biometric_Proof : Selfie proof invalid
    Failed_Biometric_Proof --> [*] : Rejection logged
    
    Checked_In_Present --> Checked_In_Late : Checked-in time > Class start time + 15 minutes
    
    Checked_In_Present --> [*] : Saved as "Present" / Temporary selfie deleted if any
    Checked_In_Late --> [*] : Saved as "Late" / Temporary selfie deleted if any
```
