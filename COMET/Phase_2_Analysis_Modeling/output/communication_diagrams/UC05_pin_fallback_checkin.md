# SƠ ĐỒ TRUYỀN THÔNG CHI TIẾT: UC05 - ĐIỂM DANH BẰNG PIN DỰ PHÒNG

Tài liệu này mô tả sơ đồ truyền thông mức phân tích cho Use Case **UC05: PIN Fallback Check-in**.

---

## 📊 SƠ ĐỒ TRUYỀN THÔNG (MERMAID)

```mermaid
graph TD
    SV((Student))
    SAF[«boundary»<br>StudentAppForm]
    MD[«boundary»<br>MobileDeviceHardware]
    AC[«control»<br>AttendanceController]
    V[(«entity»<br>AttendanceVersion)]
    R[(«entity»<br>Room)]
    AR[(«entity»<br>AttendanceRecord)]

    SV -->|1: Tap PIN Check-in / Enter PINCode| SAF
    SAF -->|1.1: RequestFaceIDVerification| MD
    SAF -->|1.2: GetGPSCoordinates / GetDeviceUUID| MD
    SAF -->|2: SubmitPINAttendance| AC
    AC -->|2.1: GetActivePINForSession| V
    AC -->|2.2: VerifyPINTimeWindow| AC
    AC -->|2.3: GetRoomGeoConfig| R
    AC -->|2.4: CalculateHaversineDistance / VerifyDeviceUUID| AC
    AC -->|2.5: CreateRecord| AR
    AC -->|3: Return Success / Error| SAF
```
