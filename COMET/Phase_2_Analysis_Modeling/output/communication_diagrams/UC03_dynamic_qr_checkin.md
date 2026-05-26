# SƠ ĐỒ TRUYỀN THÔNG CHI TIẾT: UC03 - ĐIỂM DANH BẰNG QUÉT QR ĐỘNG

Tài liệu này mô tả sơ đồ truyền thông (Communication Diagram) mức phân tích cho Use Case **UC03: Điểm danh bằng quét QR Động** có tích hợp 3 lớp phòng vệ chống gian lận.

---

## 📊 SƠ ĐỒ TRUYỀN THÔNG (MERMAID)

```mermaid
graph TD
    SV((Student))
    SAF[«boundary»<br>StudentAppForm]
    MD[«boundary»<br>MobileDeviceHardware]
    WG[«boundary»<br>SchoolWifiGateway]
    AC[«control»<br>AttendanceController]
    R[(«entity»<br>Room)]
    V[(«entity»<br>AttendanceVersion)]
    AR[(«entity»<br>AttendanceRecord)]

    SV -->|1: Scan QR Check-in| SAF
    SAF -->|2: Verify Face ID / 3: GPS & UUID Telemetry| MD
    SAF -->|4: Get network gateway IP| WG
    
    SAF -->|5: SubmitAttendance| AC
    AC -->|6: GetActiveTokenForSession| V
    AC -->|7: GetRoomGeoConfig| R
    AC -->|8: CreateRecord| AR
    AC -->|9: Return Success / Display| SAF
```
