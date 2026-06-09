# AFAS Phase II Analysis Models — Visual Paradigm Drawing Guide

Guide này dùng để vẽ lại toàn bộ diagram hiện có trong **Phase II — Analysis Models** của `AFAS_RDS_Document.md` bằng **UML chuẩn trên Visual Paradigm**.

Nguồn tham chiếu: `AFAS_RDS_Document.md`, mục **II. Analysis Models**.

---

## 0. Quy ước chung khi vẽ trong Visual Paradigm

### 0.1. Stereotype dùng trong Phase II

Tạo hoặc gắn stereotype cho các element như sau:

| Stereotype | Dùng cho | Ý nghĩa |
|---|---|---|
| `«boundary»` | UI, gateway, hardware interface | Lớp biên giao tiếp actor/external system |
| `«control»` | controller/use-case coordinator | Lớp điều phối nghiệp vụ |
| `«entity»` | domain data object | Lớp thực thể nghiệp vụ |
| `«user interaction»` | form/web/mobile screen | Boundary giao diện người dùng |
| `«device I/O»` | GPS/camera/biometric hardware | Boundary thiết bị vật lý |
| `«proxy»` | Google OAuth, Wi-Fi gateway | Boundary đại diện hệ ngoài |
| `«coordinator»` | use-case controller | Control điều phối flow chính |
| `«state dependent control»` | session/room state controller | Control phụ thuộc trạng thái |
| `«timer»` | QR/PIN timer | Control theo thời gian |
| `«data abstraction»` | pure domain object | Entity domain thuần |
| `«database wrapper»` | repository/cache manager | Entity wrapper truy cập DB/cache |

### 0.2. Cách đặt tên object trong Interaction Diagram

Trong Visual Paradigm:

- Actor: `Student`, `Lecturer`, `Admin`, hoặc `User`.
- Lifeline/Object nên đặt dạng UML object:

```text
:StudentAppForm
:AttendanceController
:AttendanceRecord
```

- Nếu cần stereotype:

```text
«boundary» :StudentAppForm
«control» :AttendanceController
«entity» :AttendanceRecord
```

### 0.3. Export ảnh

Sau khi vẽ xong mỗi diagram:

1. Right click nền diagram.
2. Chọn `Export > Active Diagram as Image`.
3. Format: `PNG` hoặc `SVG`.
4. Đặt tên file theo mẫu:

```text
figure-II-01-uc01-sequence.png
figure-II-02-uc01-communication.png
```

---

# II.0 Static Analysis

---

## Figure II-0A — Contextual Boundary Class Diagram

### Diagram type trong Visual Paradigm

```text
UML > Class Diagram
```

### Mục tiêu

Mô tả actor ngoài hệ thống và boundary class mà actor/hệ ngoài tương tác.

### Class / Actor cần tạo

| Element | Type | Stereotype | Operations |
|---|---|---|---|
| Student | Actor hoặc Class | `external user` | none |
| Lecturer | Actor hoặc Class | `external user` | none |
| Admin | Actor hoặc Class | `external user` | none |
| StudentAppForm | Class | `user interaction` | `DisplayDashboard()`, `OpenQRScanner()`, `DisplayAttendanceResult()`, `ViewHistory()`, `DisplayPINInput()` |
| LecturerWebPortal | Class | `user interaction` | `DisplayClassList()`, `DisplayAttendanceQR()`, `ShowRealtimeDashboard()`, `ModifyRecordStatus()`, `ExportExcelReport()` |
| AdminWebPortal | Class | `user interaction` | `DisplayAdminDashboard()`, `ShowRoomConfigForm()`, `DisplayUserManagementTable()` |
| GoogleAuthGateway | Class | `proxy` | `RedirectToGoogle()`, `ReceiveOAuthToken()` |
| SchoolWifiGateway | Class | `proxy` | `GetPublicIP()`, `CheckBSSID()` |
| MobileDeviceHardware | Class | `device I/O` | `GetGPSCoordinates()`, `GetDeviceUUID()`, `TriggerNativeFaceID()`, `ActivateCamera()` |

### Associations / dependencies

| From | To | Relationship | Label |
|---|---|---|---|
| Student | StudentAppForm | Association | `Interact via mobile app` |
| Lecturer | LecturerWebPortal | Association | `Interact via web portal` |
| Admin | AdminWebPortal | Association | `Interact via admin panel` |
| StudentAppForm | GoogleAuthGateway | Dependency | `OAuth authentication API` |
| LecturerWebPortal | GoogleAuthGateway | Dependency | `OAuth authentication API` |
| AdminWebPortal | GoogleAuthGateway | Dependency | `OAuth authentication API` |
| StudentAppForm | MobileDeviceHardware | Dependency | `GPS, Camera, Face ID sensors` |
| StudentAppForm | SchoolWifiGateway | Dependency | `Extract campus IP gateway` |

### Layout gợi ý

- Bên trái: `Student`, `Lecturer`, `Admin`.
- Giữa: `StudentAppForm`, `LecturerWebPortal`, `AdminWebPortal`.
- Bên phải: `GoogleAuthGateway`, `SchoolWifiGateway`, `MobileDeviceHardware`.
- Dùng solid line cho actor → UI boundary.
- Dùng dashed dependency cho UI boundary → external proxy/device.

---

## Figure II-0B — Object Structuring Criteria Tree

### Diagram type trong Visual Paradigm

Khuyến nghị:

```text
UML > Package Diagram
```

Hoặc nếu muốn giống cây phân cấp:

```text
UML > Class Diagram
```

### Mục tiêu

Phân loại object theo COMET BCE: Boundary, Control, Entity.

### Package / node cần tạo

#### Root

```text
AFAS System Objects
```

#### Level 1

| Parent | Child | Stereotype |
|---|---|---|
| AFAS System Objects | Boundary Objects | `boundary` |
| AFAS System Objects | Control Objects | `control` |
| AFAS System Objects | Entity Objects | `entity` |

#### Boundary hierarchy

| Parent | Child | Stereotype |
|---|---|---|
| Boundary Objects | User Interface | `user interaction` |
| Boundary Objects | Device Interface | `device I/O` |
| Boundary Objects | System Interface | `proxy` |
| User Interface | StudentAppForm | none |
| User Interface | LecturerWebPortal | none |
| User Interface | AdminWebPortal | none |
| Device Interface | GPSReceiver | none |
| Device Interface | CameraScanner | none |
| Device Interface | NativeBiometricReader | none |
| System Interface | GoogleOAuthGateway | none |
| System Interface | SchoolWifiGateway | none |

#### Control hierarchy

| Parent | Child | Stereotype |
|---|---|---|
| Control Objects | Coordinator | `coordinator` |
| Control Objects | State-Dependent | `state dependent control` |
| Control Objects | Timer | `timer` |
| Coordinator | AttendanceController | none |
| Coordinator | DeviceBindingController | none |
| Coordinator | AuthenticationController | none |
| State-Dependent | SessionController | none |
| State-Dependent | RoomConfigController | none |
| Timer | QRRefreshTimer | none |
| Timer | PINRefreshTimer | none |

#### Entity hierarchy

| Parent | Child | Stereotype |
|---|---|---|
| Entity Objects | Data Abstraction | `data abstraction` |
| Entity Objects | Database Wrapper | `database wrapper` |
| Data Abstraction | Student | none |
| Data Abstraction | Lecturer | none |
| Data Abstraction | Room | none |
| Data Abstraction | Session | none |
| Data Abstraction | AttendanceRecord | none |
| Database Wrapper | StudentRepository | none |
| Database Wrapper | AttendanceRepository | none |
| Database Wrapper | RedisCacheManager | none |

### Relationship

Dùng dependency hoặc package containment.

Nếu dùng Class Diagram dạng cây:

- Dùng association từ parent đến child.
- Label không cần, vì quan hệ là phân loại.

### Layout gợi ý

- Root trên cùng.
- 3 cột lớn: Boundary / Control / Entity.
- Mỗi cột chia tiếp 2–3 nhóm con.

---

# II.1 Interaction Diagrams

---

## Figure II-1 — Sequence Diagram for UC01: Login

### Diagram type

```text
UML > Sequence Diagram
```

### Lifelines

| Order | Element | Type | Stereotype |
|---|---|---|---|
| 1 | User | Actor | none |
| 2 | GoogleAuthGateway | Lifeline | `boundary` |
| 3 | LoginForm | Lifeline | `boundary` |
| 4 | AuthenticationController | Lifeline | `control` |
| 5 | Account | Lifeline | `entity` |

### Messages

#### Combined Fragment 1: `alt`

Operand 1 guard:

```text
[Option A: Login via Google OAuth]
```

Messages:

| No. | From | To | Message |
|---|---|---|---|
| 1 | User | GoogleAuthGateway | `Select "Login via Google OAuth"` |
| 2 | GoogleAuthGateway | GoogleAuthGateway | `RedirectToGoogle()` |
| 3 | GoogleAuthGateway | User | `Google Auth Form displayed` |
| 4 | User | GoogleAuthGateway | `Authenticate with FPT Email` |
| 5 | GoogleAuthGateway | AuthenticationController | `AuthenticateFPTUser(Email, OAuthToken)` |

Operand 2 guard:

```text
[Option B: Login via Credentials]
```

Messages:

| No. | From | To | Message |
|---|---|---|---|
| 6 | User | LoginForm | `Enter Credentials (MSSV/Pass) & click Submit` |
| 7 | LoginForm | AuthenticationController | `AuthenticateCredentials(Username, Password)` |

#### Common flow after first `alt`

| No. | From | To | Message |
|---|---|---|---|
| 8 | AuthenticationController | Account | `VerifyAccount(Email/Username)` |
| 9 | Account | AuthenticationController | `AccountExists(PasswordHash, Role)` |

#### Combined Fragment 2: `alt`

Operand 1 guard:

```text
[Authentication is Successful]
```

| From | To | Message |
|---|---|---|
| AuthenticationController | AuthenticationController | `GenerateSecureJWTToken()` |
| AuthenticationController | User | `Return JWT Token & redirect to Role Dashboard` |

Operand 2 guard:

```text
[Authentication Fails]
```

| From | To | Message |
|---|---|---|
| AuthenticationController | User | `Display Error "Authentication failed"` |

### Visual Paradigm notes

- Dùng activation bar cho `GoogleAuthGateway`, `LoginForm`, `AuthenticationController`, `Account`.
- Return messages dùng dashed arrow.
- Không dùng flowchart shape.

---

## Figure II-2 — Communication Diagram for UC01: Login

### Diagram type

```text
UML > Communication Diagram
```

### Objects

| Object | Type | Stereotype |
|---|---|---|
| User | Actor | none |
| `:GoogleAuthGateway` | Object | `boundary` |
| `:LoginForm` | Object | `boundary` |
| `:AuthenticationController` | Object | `control` |
| `:Account` | Object | `entity` |

### Links and numbered messages

| No. | From | To | Message |
|---|---|---|---|
| `1a` | User | GoogleAuthGateway | `Login via Google` |
| `1b` | User | LoginForm | `Enter Credentials` |
| `1a.1` | GoogleAuthGateway | AuthenticationController | `AuthenticateFPTUser()` |
| `1b.1` | LoginForm | AuthenticationController | `AuthenticateCredentials()` |
| `2` | AuthenticationController | Account | `VerifyAccount()` |
| `2.1` | Account | AuthenticationController | `AccountExists()` |
| `3` | AuthenticationController | User | `Return JWT / Redirect` |

### Layout gợi ý

- `User` bên trái.
- `GoogleAuthGateway`, `LoginForm` ở giữa trên/dưới.
- `AuthenticationController` bên phải giữa.
- `Account` xa phải.

---

## Figure II-3 — Sequence Diagram for UC03: Scan Dynamic QR Check-in

### Diagram type

```text
UML > Sequence Diagram
```

### Lifelines

| Order | Element | Stereotype |
|---|---|---|
| 1 | Student | actor |
| 2 | StudentAppForm | `boundary` |
| 3 | MobileDeviceHardware | `boundary` / `device I/O` |
| 4 | SchoolWifiGateway | `boundary` / `proxy` |
| 5 | AttendanceController | `control` |
| 6 | Room | `entity` |
| 7 | AttendanceVersion | `entity` |
| 8 | AttendanceRecord | `entity` |

### Messages

| No. | From | To | Message |
|---|---|---|---|
| 1 | Student | StudentAppForm | `Tap "Scan QR Check-in"` |
| 2 | StudentAppForm | MobileDeviceHardware | `RequestFaceIDVerification()` |
| 3 | MobileDeviceHardware | StudentAppForm | `Face matched successfully` |
| 4 | StudentAppForm | MobileDeviceHardware | `ActivateCamera()` |
| 5 | MobileDeviceHardware | StudentAppForm | `Camera view displayed` |
| 6 | Student | StudentAppForm | `Scan QR on screen` |
| 7 | MobileDeviceHardware | StudentAppForm | `DynamicToken extracted from QR` |
| 8 | StudentAppForm | MobileDeviceHardware | `GetGPSCoordinates()` |
| 9 | MobileDeviceHardware | StudentAppForm | `GPS: CheckedInLat, CheckedInLong` |
| 10 | StudentAppForm | MobileDeviceHardware | `GetDeviceUUID()` |
| 11 | MobileDeviceHardware | StudentAppForm | `DeviceUUID` |
| 12 | StudentAppForm | SchoolWifiGateway | `GetNetworkTelemetry()` |
| 13 | SchoolWifiGateway | StudentAppForm | `WifiSSID, PublicIP Gateway` |
| 14 | StudentAppForm | AttendanceController | `SubmitAttendance(StudentId, DynamicToken, Lat, Long, UUID, WifiSSID, PublicIP)` |
| 15 | AttendanceController | AttendanceVersion | `GetActiveTokenForSession()` |
| 16 | AttendanceVersion | AttendanceController | `ActiveToken, RefreshedAt` |
| 17 | AttendanceController | AttendanceController | `VerifyQRTimeWindow(DynamicToken, RefreshedAt)` |

### Combined Fragment: `alt` — QR Token

Operand 1:

```text
[QR Token Expired > 15 seconds]
```

| From | To | Message |
|---|---|---|
| AttendanceController | StudentAppForm | `Return Error: QR Expired` |
| StudentAppForm | Student | `Show error "QR code expired. Please scan newest QR."` |

Operand 2:

```text
[QR Token Valid]
```

Messages inside valid branch:

| From | To | Message |
|---|---|---|
| AttendanceController | Room | `GetRoomGeoConfig()` |
| Room | AttendanceController | `RoomLat, RoomLong, AllowedRadius` |
| AttendanceController | AttendanceController | `CalculateHaversineDistance(Lat, Long, RoomLat, RoomLong)` |

Nested Combined Fragment: `alt` — Geofence

Operand 1:

```text
[Distance > AllowedRadius]
```

| From | To | Message |
|---|---|---|
| AttendanceController | AttendanceRecord | `CreateRecord(StudentId, Status="Fraud_Declined", VerificationMode="QR")` |
| AttendanceController | StudentAppForm | `Return Error: Out of Allowed Radius` |
| StudentAppForm | Student | `Show error "Fail: You are outside the classroom."` |

Operand 2:

```text
[Distance <= AllowedRadius]
```

| From | To | Message |
|---|---|---|
| AttendanceController | AttendanceController | `CheckWifiGateway(PublicIP)` |
| AttendanceController | AttendanceRecord | `CreateRecord(StudentId, Status="Present", Distance, UUID, WifiSSID, VerificationMode="QR")` |
| AttendanceRecord | AttendanceController | `Success Record` |
| AttendanceController | AttendanceController | `DeleteTempSelfieImage()` |
| AttendanceController | StudentAppForm | `Return Success: Checked In` |
| StudentAppForm | Student | `Display "Checked-in successfully at HH:mm"` |

### Visual Paradigm notes

- QR Token branch và Geofence branch phải là Combined Fragment `alt`, không vẽ diamond.
- Self-call dùng message quay lại chính lifeline.
- Return dùng dashed arrow.

---

## Figure II-4 — Communication Diagram for UC03: Scan Dynamic QR Check-in

### Diagram type

```text
UML > Communication Diagram
```

### Objects

| Object | Stereotype |
|---|---|
| Student | actor |
| `:StudentAppForm` | `boundary` |
| `:MobileDeviceHardware` | `boundary` / `device I/O` |
| `:SchoolWifiGateway` | `boundary` / `proxy` |
| `:AttendanceController` | `control` |
| `:Room` | `entity` |
| `:AttendanceVersion` | `entity` |
| `:AttendanceRecord` | `entity` |

### Links and messages

| No. | From | To | Message |
|---|---|---|---|
| `1` | Student | StudentAppForm | `Scan QR Check-in` |
| `1.1` | StudentAppForm | MobileDeviceHardware | `Verify Face ID` |
| `1.2` | StudentAppForm | MobileDeviceHardware | `GPS & UUID Telemetry` |
| `1.3` | StudentAppForm | SchoolWifiGateway | `Get network gateway IP` |
| `2` | StudentAppForm | AttendanceController | `SubmitAttendance()` |
| `2.1` | AttendanceController | AttendanceVersion | `GetActiveTokenForSession()` |
| `2.2` | AttendanceController | Room | `GetRoomGeoConfig()` |
| `2.3` | AttendanceController | AttendanceRecord | `CreateRecord()` |
| `3` | AttendanceController | StudentAppForm | `Return Success / Display` |

### Layout gợi ý

- Student bên trái.
- Boundary objects ở giữa.
- Controller ở giữa phải.
- Entities bên phải.

---

## Figure II-5 — Sequence Diagram for UC06: Activate Dynamic QR Session

### Diagram type

```text
UML > Sequence Diagram
```

### Lifelines

| Order | Element | Stereotype |
|---|---|---|
| 1 | Lecturer | actor |
| 2 | LecturerWebPortal | `boundary` |
| 3 | SessionController | `control` |
| 4 | Session | `entity` |
| 5 | AttendanceVersion | `entity` |
| 6 | QRRefreshTimer | `control` / `timer` |
| 7 | PINRefreshTimer | `control` / `timer` |

### Main messages

| No. | From | To | Message |
|---|---|---|---|
| 1 | Lecturer | LecturerWebPortal | `Select Class Section & Session` |
| 2 | LecturerWebPortal | SessionController | `GetSessionDetails(SessionId)` |
| 3 | SessionController | Session | `ReadSessionInfo()` |
| 4 | Session | SessionController | `SessionInfo (Subject, Room, StartTime)` |
| 5 | SessionController | LecturerWebPortal | `Display Session details` |
| 6 | LecturerWebPortal | Lecturer | `Show session detail screen with "Start Attendance" button` |
| 7 | Lecturer | LecturerWebPortal | `Click "Start Attendance"` |
| 8 | LecturerWebPortal | SessionController | `ActivateAttendanceSession(SessionId)` |
| 9 | SessionController | SessionController | `VerifySessionTimeWindow()` |
| 10 | SessionController | AttendanceVersion | `InitializeVersion(SessionId)` |
| 11 | AttendanceVersion | SessionController | `AttendanceVersion Created (IsActive=True)` |
| 12 | SessionController | QRRefreshTimer | `StartTimer(Interval=10s)` |
| 13 | QRRefreshTimer | SessionController | `Timer started` |
| 14 | SessionController | PINRefreshTimer | `StartTimer(Interval=30s)` |
| 15 | PINRefreshTimer | SessionController | `Timer started` |
| 16 | SessionController | LecturerWebPortal | `Session Activated Successfully` |
| 17 | LecturerWebPortal | Lecturer | `Open dynamic presentation screen (WebSocket Channel Opened)` |

### Loop Fragment 1

Type: `loop`

Guard:

```text
[Every 10 Seconds]
```

Messages:

| From | To | Message |
|---|---|---|
| QRRefreshTimer | SessionController | `OnTimerTick()` |
| SessionController | SessionController | `GenerateNewDynamicToken()` |
| SessionController | AttendanceVersion | `UpdateDynamicToken(DynamicToken)` |
| SessionController | LecturerWebPortal | `PushNewQRViaWebSocket(DynamicToken)` |
| LecturerWebPortal | Lecturer | `Display new QR Code on projector screen` |

### Loop Fragment 2

Type: `loop`

Guard:

```text
[Every 30 Seconds]
```

Messages:

| From | To | Message |
|---|---|---|
| PINRefreshTimer | SessionController | `OnTimerTick()` |
| SessionController | SessionController | `GenerateNewPINCode()` |
| SessionController | AttendanceVersion | `UpdatePINCode(PINCode)` |
| SessionController | LecturerWebPortal | `PushNewPINViaWebSocket(PINCode)` |
| LecturerWebPortal | Lecturer | `Display new 6-digit PIN on projector corner` |

---

## Figure II-6 — Communication Diagram for UC06: Activate Dynamic QR Session

### Diagram type

```text
UML > Communication Diagram
```

### Objects

| Object | Stereotype |
|---|---|
| Lecturer | actor |
| `:LecturerWebPortal` | `boundary` |
| `:SessionController` | `control` |
| `:Session` | `entity` |
| `:AttendanceVersion` | `entity` |
| `:QRRefreshTimer` | `control` / `timer` |
| `:PINRefreshTimer` | `control` / `timer` |

### Messages

| No. | From | To | Message |
|---|---|---|---|
| `1` | Lecturer | LecturerWebPortal | `Click Start Attendance` |
| `1.1` | LecturerWebPortal | SessionController | `GetSessionDetails()` |
| `1.2` | LecturerWebPortal | SessionController | `ActivateAttendanceSession()` |
| `1.1.1` | SessionController | Session | `ReadSessionInfo()` |
| `1.2.1` | SessionController | AttendanceVersion | `InitializeVersion()` |
| `1.2.2` | SessionController | QRRefreshTimer | `StartTimer(10s)` |
| `1.2.3` | SessionController | PINRefreshTimer | `StartTimer(30s)` |
| `2` | QRRefreshTimer | LecturerWebPortal | `OnTimerTick() / PushQR()` |
| `3` | PINRefreshTimer | LecturerWebPortal | `OnTimerTick() / PushPIN()` |

---

## Figure II-7 — Sequence Diagram for UC11: Configure Room Coordinates

### Diagram type

```text
UML > Sequence Diagram
```

### Lifelines

| Order | Element | Stereotype |
|---|---|---|
| 1 | Admin | actor |
| 2 | AdminWebPortal | `boundary` |
| 3 | RoomConfigurationController | `control` |
| 4 | Room | `entity` |
| 5 | SystemLog | `entity` |

### Messages before config edit

| No. | From | To | Message |
|---|---|---|---|
| 1 | Admin | AdminWebPortal | `Click "Room Management"` |
| 2 | AdminWebPortal | RoomConfigurationController | `GetRoomsList()` |
| 3 | RoomConfigurationController | Room | `ReadAllRooms()` |
| 4 | Room | RoomConfigurationController | `List of Rooms` |
| 5 | RoomConfigurationController | AdminWebPortal | `Display room table` |
| 6 | AdminWebPortal | Admin | `Show room table with config buttons` |
| 7 | Admin | AdminWebPortal | `Click "Edit Coordinates" for specific Room` |
| 8 | AdminWebPortal | Admin | `Open RoomConfigForm with integrated satellite map` |

### Combined Fragment: `alt` — Input method

Operand 1:

```text
[Option A: Click on satellite map]
```

| From | To | Message |
|---|---|---|
| Admin | AdminWebPortal | `Click exact classroom location on map` |
| AdminWebPortal | AdminWebPortal | `ExtractLatLongFromMapClick()` |
| AdminWebPortal | Admin | `Automatically populate Lat & Long fields` |

Operand 2:

```text
[Option B: Get current GPS]
```

| From | To | Message |
|---|---|---|
| Admin | AdminWebPortal | `Tap "Get Current GPS Location"` |
| AdminWebPortal | AdminWebPortal | `RequestBrowserGeoLocationAPI()` |
| AdminWebPortal | Admin | `Populate Lat & Long fields with hardware coordinates` |

### Save configuration messages

| No. | From | To | Message |
|---|---|---|---|
| 9 | Admin | AdminWebPortal | `Enter "Allowed Radius" and click "Save Config"` |
| 10 | AdminWebPortal | RoomConfigurationController | `SaveGeoConfiguration(RoomId, Latitude, Longitude, AllowedRadius)` |
| 11 | RoomConfigurationController | RoomConfigurationController | `ValidateCoordinates(Latitude, Longitude)` |
| 12 | RoomConfigurationController | RoomConfigurationController | `ValidateRadius(AllowedRadius)` |

### Combined Fragment: `alt` — Validation result

Operand 1:

```text
[coordinates or radius invalid]
```

| From | To | Message |
|---|---|---|
| RoomConfigurationController | AdminWebPortal | `Return Error: Invalid Geo-data` |
| AdminWebPortal | Admin | `Highlight error fields & request correction` |

Operand 2:

```text
[configuration valid]
```

| From | To | Message |
|---|---|---|
| RoomConfigurationController | Room | `UpdateGeoConfig(Latitude, Longitude, AllowedRadius)` |
| Room | RoomConfigurationController | `Update Success` |
| RoomConfigurationController | SystemLog | `WriteLog(AdminId, Action="Configure_Room", RoomId)` |
| RoomConfigurationController | AdminWebPortal | `Return Success: Configurations Saved` |
| AdminWebPortal | Admin | `Show confirmation popup & return to room table` |

---

## Figure II-8 — Communication Diagram for UC11: Configure Room Coordinates

### Diagram type

```text
UML > Communication Diagram
```

### Objects

| Object | Stereotype |
|---|---|
| Admin | actor |
| `:AdminWebPortal` | `boundary` |
| `:RoomConfigurationController` | `control` |
| `:Room` | `entity` |
| `:SystemLog` | `entity` |

### Messages

| No. | From | To | Message |
|---|---|---|---|
| `1` | Admin | AdminWebPortal | `Edit Coordinates` |
| `2` | Admin | AdminWebPortal | `Click Save Config` |
| `1.1` | AdminWebPortal | RoomConfigurationController | `GetRoomsList()` |
| `2.1` | AdminWebPortal | RoomConfigurationController | `SaveGeoConfiguration()` |
| `2.1.1` | RoomConfigurationController | Room | `UpdateGeoConfig()` |
| `2.1.2` | RoomConfigurationController | SystemLog | `WriteLog()` |
| `3` | RoomConfigurationController | AdminWebPortal | `Return Success popup` |

---

## Figure II-9 — Sequence Diagram for UC05: PIN Fallback Check-in

### Diagram type

```text
UML > Sequence Diagram
```

### Lifelines

| Order | Element | Stereotype |
|---|---|---|
| 1 | Student | actor |
| 2 | StudentAppForm | `user interaction` |
| 3 | MobileDeviceHardware | `device I/O` |
| 4 | AttendanceController | `coordinator` |
| 5 | AttendanceVersion | `entity` |
| 6 | Room | `entity` |
| 7 | AttendanceRecord | `entity` |

### Main messages

| No. | From | To | Message |
|---|---|---|---|
| 1 | Student | StudentAppForm | `Tap "PIN Check-in"` |
| 2 | StudentAppForm | MobileDeviceHardware | `RequestFaceIDVerification()` |
| 3 | MobileDeviceHardware | StudentAppForm | `Face matched successfully` |
| 4 | StudentAppForm | Student | `Display 6-digit PIN input screen` |
| 5 | Student | StudentAppForm | `Enter PIN code "847291"` |
| 6 | StudentAppForm | MobileDeviceHardware | `GetGPSCoordinates()` |
| 7 | MobileDeviceHardware | StudentAppForm | `GPS: CheckedInLat, CheckedInLong` |
| 8 | StudentAppForm | MobileDeviceHardware | `GetDeviceUUID()` |
| 9 | MobileDeviceHardware | StudentAppForm | `DeviceUUID` |
| 10 | StudentAppForm | AttendanceController | `SubmitPINAttendance(StudentId, PINCode, Lat, Long, UUID)` |
| 11 | AttendanceController | AttendanceVersion | `GetActivePINForSession()` |
| 12 | AttendanceVersion | AttendanceController | `ActivePIN, PINRefreshedAt` |
| 13 | AttendanceController | AttendanceController | `VerifyPINTimeWindow(PINCode, PINRefreshedAt)` |

### Combined Fragment: `alt` — PIN validation

Operand 1:

```text
[PIN Expired > 30 seconds]
```

| From | To | Message |
|---|---|---|
| AttendanceController | StudentAppForm | `Return Error: PIN Expired` |
| StudentAppForm | Student | `Show error "PIN has expired. Please enter the new PIN."` |

Operand 2:

```text
[PIN Valid]
```

| From | To | Message |
|---|---|---|
| AttendanceController | Room | `GetRoomGeoConfig()` |
| Room | AttendanceController | `RoomLat, RoomLong, AllowedRadius` |
| AttendanceController | AttendanceController | `CalculateHaversineDistance(Lat, Long, RoomLat, RoomLong)` |

Nested `alt` — Location result:

Operand 1:

```text
[Distance > AllowedRadius]
```

| From | To | Message |
|---|---|---|
| AttendanceController | AttendanceRecord | `CreateRecord(StudentId, Status="Fraud_Declined", VerificationMode="PIN")` |
| AttendanceController | StudentAppForm | `Return Error: Out of Allowed Radius` |
| StudentAppForm | Student | `Show error "Location verification failed."` |

Operand 2:

```text
[Distance <= AllowedRadius]
```

| From | To | Message |
|---|---|---|
| AttendanceController | AttendanceController | `VerifyDeviceUUID(StudentId, UUID)` |
| AttendanceController | AttendanceRecord | `CreateRecord(StudentId, Status="Present", VerificationMode="PIN")` |
| AttendanceRecord | AttendanceController | `Success Record` |
| AttendanceController | StudentAppForm | `Return Success: Checked In via PIN` |
| StudentAppForm | Student | `Display "Checked-in successfully via PIN at HH:mm"` |

---

## Figure II-10 — Communication Diagram for UC05: PIN Fallback Check-in

### Diagram type

```text
UML > Communication Diagram
```

### Objects

| Object | Stereotype |
|---|---|
| Student | actor |
| `:StudentAppForm` | `user interaction` |
| `:MobileDeviceHardware` | `device I/O` |
| `:AttendanceController` | `coordinator` |
| `:AttendanceVersion` | `entity` |
| `:Room` | `entity` |
| `:AttendanceRecord` | `entity` |

### Messages

| No. | From | To | Message |
|---|---|---|---|
| `1` | Student | StudentAppForm | `Tap PIN Check-in` |
| `1.1` | StudentAppForm | MobileDeviceHardware | `RequestFaceIDVerification()` |
| `1.2` | StudentAppForm | MobileDeviceHardware | `GetGPSCoordinates() / GetDeviceUUID()` |
| `2` | StudentAppForm | AttendanceController | `SubmitPINAttendance()` |
| `2.1` | AttendanceController | AttendanceVersion | `GetActivePINForSession()` |
| `2.2` | AttendanceController | Room | `GetRoomGeoConfig()` |
| `2.3` | AttendanceController | AttendanceRecord | `CreateRecord()` |
| `3` | AttendanceController | StudentAppForm | `Return Success / Error` |

---

## Figure II-11 — Sequence Diagram for UC07: Real-time Attendance Monitor

### Diagram type

```text
UML > Sequence Diagram
```

### Lifelines

| Order | Element | Stereotype |
|---|---|---|
| 1 | Lecturer | actor |
| 2 | LecturerWebPortal | `user interaction` |
| 3 | SessionController | `state dependent control` |
| 4 | ClassSectionStudent | `entity` |
| 5 | AttendanceRecord | `entity` |
| 6 | AttendanceHub (SignalR) | `coordinator` |

### Initial render messages

| No. | From | To | Message |
|---|---|---|---|
| 1 | Lecturer | LecturerWebPortal | `Open Dynamic Presentation View` |
| 2 | LecturerWebPortal | SessionController | `GetStudentRosterForSession(SessionId)` |
| 3 | SessionController | ClassSectionStudent | `ReadEnrolledStudents(ClassSectionId)` |
| 4 | ClassSectionStudent | SessionController | `List of Students (35 records)` |
| 5 | SessionController | LecturerWebPortal | `Student Grid Data (Name, MSSV, Status=Pending)` |
| 6 | LecturerWebPortal | Lecturer | `Render student tiles grid (all gray/pending)` |

### Note

Add UML Note over LecturerWebPortal and AttendanceHub:

```text
WebSocket channel is now open (from UC06)
```

### Loop Fragment

Type: `loop`

Guard:

```text
[For each student check-in event]
```

Messages:

| From | To | Message |
|---|---|---|
| AttendanceHub | AttendanceHub | `OnStudentCheckedIn(StudentId, Status)` |
| AttendanceHub | LecturerWebPortal | `BroadcastAttendanceUpdate(StudentId, Status, CheckedInAt)` |
| LecturerWebPortal | LecturerWebPortal | `UpdateStudentTile(StudentId, Color=Green/Orange)` |
| LecturerWebPortal | LecturerWebPortal | `UpdateAttendanceCounter(++checkedIn)` |
| LecturerWebPortal | Lecturer | `Student tile turns Green/Orange with chime` |

### Combined Fragment: `alt`

Guard:

```text
[WebSocket disconnects]
```

Messages:

| From | To | Message |
|---|---|---|
| LecturerWebPortal | LecturerWebPortal | `ShowReconnectWarning()` |
| LecturerWebPortal | Lecturer | `Display red warning icon` |
| LecturerWebPortal | AttendanceHub | `AttemptReconnection()` |

---

## Figure II-12 — Communication Diagram for UC07: Real-time Attendance Monitor

### Diagram type

```text
UML > Communication Diagram
```

### Objects

| Object | Stereotype |
|---|---|
| Lecturer | actor |
| `:LecturerWebPortal` | `user interaction` |
| `:SessionController` | `state dependent control` |
| `:ClassSectionStudent` | `entity` |
| `:AttendanceRecord` | `entity` |
| `:AttendanceHub` | `coordinator` |

### Messages

| No. | From | To | Message |
|---|---|---|---|
| `1` | Lecturer | LecturerWebPortal | `Open Presentation View` |
| `1.1` | LecturerWebPortal | SessionController | `GetStudentRosterForSession()` |
| `1.1.1` | SessionController | ClassSectionStudent | `ReadEnrolledStudents()` |
| `2` | AttendanceHub | LecturerWebPortal | `BroadcastAttendanceUpdate()` |
| `2.1` | LecturerWebPortal | LecturerWebPortal | `UpdateStudentTile() / UpdateCounter()` |

### Note

`AttendanceRecord` xuất hiện trong source Mermaid nhưng chưa có message trực tiếp. Có 2 cách xử lý:

1. Giữ object `:AttendanceRecord` để thể hiện nguồn dữ liệu trạng thái attendance.
2. Hoặc thêm message từ `SessionController` sang `AttendanceRecord`:

```text
1.1.2: ReadCurrentAttendanceStatuses()
```

Cách 2 rõ nghĩa hơn khi nộp UML.

---

## Figure II-13 — Sequence Diagram for UC08: Manual Attendance Adjustment

### Diagram type

```text
UML > Sequence Diagram
```

### Lifelines

| Order | Element | Stereotype |
|---|---|---|
| 1 | Lecturer | actor |
| 2 | LecturerWebPortal | `user interaction` |
| 3 | AttendanceController | `coordinator` |
| 4 | AttendanceRecord | `entity` |
| 5 | SystemLog | `entity` |

### Messages before save

| No. | From | To | Message |
|---|---|---|---|
| 1 | Lecturer | LecturerWebPortal | `Click on student tile "SE170789"` |
| 2 | LecturerWebPortal | Lecturer | `Show Adjustment Modal (current status, options)` |
| 3 | Lecturer | LecturerWebPortal | `Select "Present", enter reason, click "Save"` |
| 4 | LecturerWebPortal | AttendanceController | `AdjustAttendanceStatus(RecordId, NewStatus="Present", Reason, LecturerId)` |
| 5 | AttendanceController | AttendanceController | `ValidateReasonNotEmpty(Reason)` |

### Combined Fragment: `alt`

Operand 1:

```text
[Reason is empty]
```

| From | To | Message |
|---|---|---|
| AttendanceController | LecturerWebPortal | `Return Error: Reason is mandatory` |
| LecturerWebPortal | Lecturer | `Highlight reason field with error` |

Operand 2:

```text
[Reason is provided]
```

| From | To | Message |
|---|---|---|
| AttendanceController | AttendanceRecord | `UpdateRecordStatus(RecordId, Status="Present", VerificationMode="Manual")` |
| AttendanceRecord | AttendanceController | `Record Updated` |
| AttendanceController | SystemLog | `WriteAuditLog(LecturerId, Action="Manual_Adjustment", RecordId, Reason)` |
| SystemLog | AttendanceController | `Log Written` |
| AttendanceController | LecturerWebPortal | `Return Success: Status Updated` |
| LecturerWebPortal | Lecturer | `Close modal, update student tile to Green, show confirmation` |

---

## Figure II-14 — Communication Diagram for UC08: Manual Attendance Adjustment

### Diagram type

```text
UML > Communication Diagram
```

### Objects

| Object | Stereotype |
|---|---|
| Lecturer | actor |
| `:LecturerWebPortal` | `user interaction` |
| `:AttendanceController` | `coordinator` |
| `:AttendanceRecord` | `entity` |
| `:SystemLog` | `entity` |

### Messages

| No. | From | To | Message |
|---|---|---|---|
| `1` | Lecturer | LecturerWebPortal | `Click student / Select status / Save` |
| `1.1` | LecturerWebPortal | AttendanceController | `AdjustAttendanceStatus()` |
| `1.1.1` | AttendanceController | AttendanceRecord | `UpdateRecordStatus()` |
| `1.1.2` | AttendanceController | SystemLog | `WriteAuditLog()` |
| `2` | AttendanceController | LecturerWebPortal | `Return Success` |

---

# II.2 State Diagrams

> Lưu ý: trong tài liệu hiện tại, số figure state diagram bị trùng với interaction diagram (`II-9`, `II-10`, `II-11`). Khi export bằng Visual Paradigm, nên đặt tên file rõ: `state-attendance-session`, `state-attendance-record`, `state-device-binding` để tránh nhầm.

---

## State Diagram A — Attendance Session State (AttendanceVersion)

### Diagram type

```text
UML > State Machine Diagram
```

### States

| State | Type |
|---|---|
| Initial | Initial pseudostate |
| Inactive | Simple state |
| Active_QR | Composite state |
| QR_Active | Substate inside Active_QR |
| QR_Refreshed | Substate inside Active_QR |
| PIN_Refreshed | Substate inside Active_QR |
| Suspended | Simple state |
| Active_PIN_Only | Simple state |
| Closed | Final simple state before UML final |
| Final | Final pseudostate |

### Transitions

| From | To | Trigger / Label |
|---|---|---|
| Initial | Inactive | `Session created in schedule` |
| Inactive | Active_QR | `Lecturer clicks "Start Attendance"` |
| Active_QR | Suspended | `Network outage detected / Timer Paused` |
| Suspended | Active_QR | `Network restored / Lecturer clicks "Resume"` |
| Active_QR | Active_PIN_Only | `Lecturer closes QR scanner / opens PIN manually` |
| Active_PIN_Only | Closed | `Dynamic timer expires / Session close clicked` |
| Active_QR | Closed | `Lecturer clicks "Stop Attendance"` |
| Suspended | Closed | `Class scheduled time ends` |
| Closed | Final | `Attendance finalized & Report exported` |

### Composite state `Active_QR`

Inside `Active_QR`:

| From | To | Trigger / Label |
|---|---|---|
| Initial substate | QR_Active | `QR & PIN displayed` |
| QR_Active | QR_Refreshed | `Timer ticks (10s)` |
| QR_Refreshed | QR_Active | `Generate new dynamic token` |
| QR_Active | PIN_Refreshed | `Timer ticks (30s)` |
| PIN_Refreshed | QR_Active | `Generate new PIN code` |

### Layout gợi ý

- `Inactive` trái.
- `Active_QR` lớn ở giữa, chứa 3 substate.
- `Suspended` dưới `Active_QR`.
- `Active_PIN_Only` phải giữa.
- `Closed` phải, final cuối cùng.

---

## State Diagram B — Attendance Record State (AttendanceRecord)

### Diagram type

```text
UML > State Machine Diagram
```

### States

| State | Type |
|---|---|
| Initial | Initial pseudostate |
| Submitted | Simple state |
| Verifying_Token | Simple state |
| Failed_Expired | Terminal failure state |
| Verifying_Location | Simple state |
| Failed_Location_Fraud | Terminal failure state |
| Verifying_Device | Simple state |
| Failed_Device_Mismatch | Terminal failure state |
| Verifying_Biometrics | Simple state |
| Failed_Face_Mismatch | Terminal failure state |
| Checked_In_Present | Success state |
| Checked_In_Late | Success state |
| Final | Final pseudostate |

### Transitions

| From | To | Trigger / Guard / Action |
|---|---|---|
| Initial | Submitted | `Student sends check-in telemetry` |
| Submitted | Verifying_Token | `Server matches Dynamic QR Token (Layer 1)` |
| Verifying_Token | Failed_Expired | `[Token older than 15s]` |
| Failed_Expired | Final | `Rejection logged` |
| Verifying_Token | Verifying_Location | `[Token is valid]` |
| Verifying_Location | Verifying_Device | `[GPS Distance < AllowedRadius]` |
| Verifying_Location | Failed_Location_Fraud | `[GPS Distance > AllowedRadius]` |
| Failed_Location_Fraud | Final | `Saved as "Fraud_Declined" in DB` |
| Verifying_Device | Verifying_Biometrics | `[DeviceUUID matches bound device]` |
| Verifying_Device | Failed_Device_Mismatch | `[DeviceUUID belongs to another student]` |
| Failed_Device_Mismatch | Final | `Rejection logged` |
| Verifying_Biometrics | Checked_In_Present | `[Face ID match score > 85%]` |
| Verifying_Biometrics | Failed_Face_Mismatch | `[Face ID matching fails]` |
| Failed_Face_Mismatch | Final | `Rejection logged` |
| Checked_In_Present | Checked_In_Late | `[Checked-in time > Class start time]` |
| Checked_In_Present | Final | `Saved as "Present" / Selfie image deleted` |
| Checked_In_Late | Final | `Saved as "Late" / Selfie image deleted` |

### Visual Paradigm notes

- Guard condition đặt trong `[]`.
- Action đặt sau `/` nếu muốn chuẩn UML hơn. Ví dụ:

```text
[Token older than 15s] / Log rejection
```

---

## State Diagram C — Student Device Binding State

### Diagram type

```text
UML > State Machine Diagram
```

### States

| State | Type |
|---|---|
| Initial | Initial pseudostate |
| Unbound | Simple state |
| Bound | Simple state |
| Reset_Requested | Simple state |
| Admin_Released | Simple state |
| Final | Optional final pseudostate |

### Transitions

| From | To | Trigger / Label |
|---|---|---|
| Initial | Unbound | `Account created by Admin` |
| Unbound | Bound | `First login on App / UUID registered` |
| Bound | Reset_Requested | `Student clicks "Reset Device" on new phone` |
| Reset_Requested | Bound | `OTP validation fails 3 times / Lockout 24h` |
| Reset_Requested | Unbound | `OTP code verified successfully via school email` |
| Bound | Admin_Released | `Admin manually releases binding (special request)` |
| Admin_Released | Unbound | `Device UUID cleared from profile` |

### Layout gợi ý

- `Unbound` trái.
- `Bound` giữa.
- `Reset_Requested` dưới.
- `Admin_Released` phải.
- Loop về `Unbound` rõ ràng.

---

# II.0.3 UI Wireframes — Optional Visual Paradigm Mockup

Mục `II.0.3 UI Wireframes` hiện là ASCII wireframe, không phải UML. Nếu cần chuyển sang Visual Paradigm, dùng:

```text
Diagram > New > UX / Wireframe / Mockup Diagram
```

Tạo các mockup sau:

| Wireframe | Visual Paradigm diagram type | Main components |
|---|---|---|
| WF-01 Login Screen | Mobile Wireframe | Text fields, login button, Google login button |
| WF-02 Dashboard & QR Scanner | Mobile Wireframe | Header, scan QR button, PIN check-in button, bottom nav |
| WF-03 QR Camera View | Mobile Wireframe | Camera frame, Face ID status, GPS/Wi-Fi/UUID text |
| WF-04 Attendance History | Mobile Wireframe | Attendance stats, calendar/list |
| WF-05 Lecturer Projector View | Web Wireframe | QR panel, attendance grid, PIN, counters, stop/export buttons |
| WF-06 Manual Adjustment Modal | Web Wireframe | Modal, radio buttons, reason textbox, save/cancel |
| WF-07 Admin Room GPS Config | Web Wireframe | Room table, map placeholder, coordinate fields, save button |
| WF-08 PIN Fallback Input | Mobile Wireframe | PIN six slots, GPS/UUID info, submit button |

Nếu thầy chỉ yêu cầu UML, giữ phần wireframe ASCII cũng được. Không bắt buộc vẽ bằng UML.

---

# Checklist nộp bài

## Diagram phải có

- [ ] Figure II-0A Contextual Boundary Class Diagram
- [ ] Figure II-0B Object Structuring Criteria Tree
- [ ] Figure II-1 UC01 Sequence Diagram
- [ ] Figure II-2 UC01 Communication Diagram
- [ ] Figure II-3 UC03 Sequence Diagram
- [ ] Figure II-4 UC03 Communication Diagram
- [ ] Figure II-5 UC06 Sequence Diagram
- [ ] Figure II-6 UC06 Communication Diagram
- [ ] Figure II-7 UC11 Sequence Diagram
- [ ] Figure II-8 UC11 Communication Diagram
- [ ] Figure II-9 UC05 Sequence Diagram
- [ ] Figure II-10 UC05 Communication Diagram
- [ ] Figure II-11 UC07 Sequence Diagram
- [ ] Figure II-12 UC07 Communication Diagram
- [ ] Figure II-13 UC08 Sequence Diagram
- [ ] Figure II-14 UC08 Communication Diagram
- [ ] State Diagram A Attendance Session State
- [ ] State Diagram B Attendance Record State
- [ ] State Diagram C Student Device Binding State

## Kiểm tra chuẩn UML

- [ ] Sequence Diagram dùng lifeline, message, activation, combined fragment `alt`/`loop`.
- [ ] Communication Diagram dùng object link và message number.
- [ ] State Diagram dùng initial, state, transition, guard, final.
- [ ] Class Diagram dùng class, operation, stereotype, association/dependency.
- [ ] Không dùng Mermaid shape khi vẽ trong Visual Paradigm.
- [ ] Export PNG/SVG rõ chữ, không bị cắt mép.

---

# Gợi ý tên file export

```text
figure-II-0A-contextual-boundary-class-diagram.png
figure-II-0B-object-structuring-criteria-tree.png
figure-II-01-uc01-sequence.png
figure-II-02-uc01-communication.png
figure-II-03-uc03-sequence.png
figure-II-04-uc03-communication.png
figure-II-05-uc06-sequence.png
figure-II-06-uc06-communication.png
figure-II-07-uc11-sequence.png
figure-II-08-uc11-communication.png
figure-II-09-uc05-sequence.png
figure-II-10-uc05-communication.png
figure-II-11-uc07-sequence.png
figure-II-12-uc07-communication.png
figure-II-13-uc08-sequence.png
figure-II-14-uc08-communication.png
state-attendance-session.png
state-attendance-record.png
state-device-binding.png
```
