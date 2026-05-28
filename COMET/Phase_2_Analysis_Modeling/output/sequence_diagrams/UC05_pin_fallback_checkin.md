# SƠ ĐỒ TRÌNH TỰ CHI TIẾT: UC05 - ĐIỂM DANH BẰNG PIN DỰ PHÒNG

Tài liệu này đặc tả sự tương tác động giữa các đối tượng phân tích tham gia Use Case **UC05: PIN Fallback Check-in** khi sinh viên nhập mã PIN thay cho quét QR.

---

## 📊 SƠ ĐỒ TRÌNH TỰ (MERMAID)

```mermaid
sequenceDiagram
    autonumber
    actor SV as Student
    participant SAF as «boundary»<br>StudentAppForm
    participant MD as «boundary»<br>MobileDeviceHardware
    participant AC as «control»<br>AttendanceController
    participant V as «entity»<br>AttendanceVersion
    participant R as «entity»<br>Room
    participant AR as «entity»<br>AttendanceRecord

    SV->>SAF: Tap "PIN Check-in"
    activate SAF

    SAF->>MD: RequestFaceIDVerification()
    activate MD
    MD-->>SAF: BiometricVerified = True
    deactivate MD

    SAF-->>SV: Display 6-digit PIN input screen
    SV->>SAF: Enter PINCode

    SAF->>MD: GetGPSCoordinates()
    activate MD
    MD-->>SAF: CheckedInLat, CheckedInLong
    deactivate MD

    SAF->>MD: GetDeviceUUID()
    activate MD
    MD-->>SAF: DeviceUUID
    deactivate MD

    SAF->>AC: SubmitPINAttendance(StudentId, PINCode, Lat, Long, UUID)
    activate AC

    AC->>V: GetActivePINForSession()
    activate V
    V-->>AC: ActivePIN, PINRefreshedAt
    deactivate V
    AC->>AC: VerifyPINTimeWindow(PINCode, PINRefreshedAt)

    alt If PIN is expired (> 30 seconds)
        AC-->>SAF: Return Error: PIN Expired
        SAF-->>SV: Show error "PIN has expired. Please enter the new PIN."
    else If PIN is valid
        AC->>R: GetRoomGeoConfig()
        activate R
        R-->>AC: RoomLat, RoomLong, AllowedRadius
        deactivate R
        AC->>AC: CalculateHaversineDistance(Lat, Long, RoomLat, RoomLong)

        alt If Distance > AllowedRadius
            AC->>AR: CreateRecord(StudentId, Status="Fraud_Declined", VerificationMode="PIN")
            AC-->>SAF: Return Error: Out of Allowed Radius
            SAF-->>SV: Show error "Location verification failed."
        else If Distance <= AllowedRadius
            AC->>AC: VerifyDeviceUUID(StudentId, UUID)
            AC->>AR: CreateRecord(StudentId, Status="Present/Late", VerificationMode="PIN")
            activate AR
            AR-->>AC: Success Record
            deactivate AR
            AC-->>SAF: Return Success: Checked In via PIN
            SAF-->>SV: Display "Checked-in successfully via PIN at HH:mm"
        end
    end
    deactivate AC
    deactivate SAF
```
