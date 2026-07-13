## **III. Design specification**

## **III.1 Integrated Communication Diagrams**

To transition from analysis to design, we integrate the separate communication diagrams developed during the analysis phase into a single, unified view. This synthesis helps identify the complete set of dependencies and methods required on each class to implement the system.

#### **Figure III-1: Integrated Communication Diagram**
```plantuml
@startuml
skinparam style strictuml
object Admin as "Admin\n«actor»"
object Lecturer as "Lecturer\n«actor»"
object Student as "Student\n«actor»"

object AWP as "AdminWebPortal\n«boundary»"
object LWP as "LecturerWebPortal\n«boundary»"
object SAF as "StudentAppForm\n«boundary»"

object RCC as "RoomConfigurationController\n«control»"
object SC as "SessionController\n«control»"
object AC as "AttendanceController\n«control»"

object R as "Room\n«entity»"
object S as "Session\n«entity»"
object V as "AttendanceVersion\n«entity»"
object AR as "AttendanceRecord\n«entity»"

Admin --> AWP : 1: Edit Room / 2: Save Geo Config
Lecturer --> LWP : 1: Get Session / 2: Start Attendance
Student --> SAF : 1: Trigger Face ID / 2: Scan QR / 3: Check-in

AWP --> RCC : 1.1: GetRoomsList() / 2.1: SaveGeoConfiguration()
LWP --> SC : 1.1: GetSessionDetails() / 2.1: ActivateAttendanceSession(SessionId, Lat, Lon)
SAF --> AC : 3.1: SubmitAttendance()

RCC --> R : 2.2: UpdateGeoConfig()
SC --> S : 1.2: ReadSessionInfo()
SC --> V : 2.2: InitializeVersion(SessionId, Lat, Lon) / 2.3: UpdateDynamicToken()

AC --> V : 3.2: GetActiveTokenAndGPS()
AC --> R : 3.3: GetRoomGeoConfig() (if fallback)
AC --> AR : 3.4: CreateRecord()
@enduml
```

### **Transition from Analysis-level to Design-level Specification**
Analysis-level models decompose the problem domain using generic abstractions (`«boundary»`, `«control»`, `«entity»`) without considering technology stacks. During the analysis phase (Phase 2), core data entities (`Student`, `Lecturer`, `Room`, `Subject`, `ClassSection`, `Session`, `AttendanceVersion`, `AttendanceRecord`, `SystemLog`) are kept as pure logical domain entities. 

In the design phase (Phase 3), the Platform-Independent Model (PIM) is mapped into the Platform-Specific Model (PSM) and technical architecture:

1.  **Gomaa's Split Entity Rule:** Every conceptual `«entity»` class from the analysis model is split into two distinct classes during design:
    *   **Data Abstraction Class:** Encapsulates the core business fields and domain rules in the Domain layer (e.g., `Student`, `AttendanceRecord` C# objects).
    *   **Database Wrapper Class (Repository Pattern):** Handles physical persistence logic (CRUD operations) using the ORM (Entity Framework Core) connected to PostgreSQL in the Infrastructure layer. This shields the Domain layer from database implementation details.
    *   **Cache Infrastructure Wrapper:** High-speed cache managers (e.g., `RedisCacheManager` implementing `ICacheManager`) are introduced in the Infrastructure layer to handle dynamic QR/PIN validation without hitting the primary database.
2.  **Introduction of Interfaces & Dependency Injection:** To adhere to the Dependency Inversion Principle (DIP), services communicate via abstract interfaces (e.g. `IRoomRepository`, `IAttendanceService`) rather than concrete classes. These dependencies are resolved dynamically via the built-in Dependency Injection container.
3.  **Boundary to Controllers Mapping:** Boundary objects from analysis (e.g., forms, portals, gateways) map to concrete WebAPI REST controllers (Presentation layer) or WebSockets SignalR Hubs, managing JSON serialization, request validation, and HTTP response codes.

---

## **III.2 System High-Level Design**

The AFAS system is designed using a **Clean Architecture** (4-layer concentric system), ensuring ease of maintenance (**NF-04**) and loose coupling.

### **2.1 Static View (Kiến Trúc Phân Tầng)**
```plantuml
@startuml
skinparam style strictuml
package "Presentation Layer (WebAPI)" as Pres {
    [API Controllers]
    [SignalR WebSockets Hubs]
}
package "Application Layer" as App {
    [AttendanceService]
    [SessionService]
    [AuthService]
    interface IUseCaseInterfaces
}
package "Domain Layer (Core)" as Domain {
    [Student]
    [Session]
    [Room]
    [AttendanceRecord]
    interface IStudentRepository
    interface IAttendanceRecordRepository
}
package "Infrastructure Layer" as Infra {
    [PostgreSQL EF Core Context]
    [Redis Cache Manager]
    [Google OAuth Provider]
}

Pres ..> App : "depends on"
Infra ..> Domain : "implements interfaces"
Infra ..> App : "provides services"
App ..> Domain : "orchestrates"
@enduml
```

### **2.2 Dynamic View (Luồng Gọi Xuyên Tầng)**
```plantuml
@startuml
autonumber
actor SV as "Student App"

box "Presentation Layer" #LightBlue
participant C as "AttendanceController\n«boundary»"
end box

box "Application Layer" #LightGreen
participant S as "AttendanceService\n«control»"
end box

box "Domain Layer" #LightYellow
participant R as "Room\n«entity»"
participant AR as "AttendanceRecord\n«entity»"
participant Repo as "IAttendanceRecordRepository\n«interface»"
end box

box "Infrastructure Layer" #LightPink
participant DB as "EFCorePostgreSQL\n«database»"
end box

SV -> C: POST /api/attendance/submit (Payload)
activate C
C -> S: SubmitAttendance(StudentId, DynamicToken, GPS, DeviceUUID, DeviceName, PublicIP)
activate S
S -> R: GetRoomGeoConfig()
activate R
R --> S: Room Configuration
deactivate R
note over S, AR : Calls AttendanceRecord.Create() to run geofencing and anti-fraud checks
S -> AR: Create(StudentId, SessionId, Lat, Long, ...)
activate AR
AR --> S: AttendanceRecord instance
deactivate AR
S -> Repo: AddAsync(AttendanceRecord)
activate Repo
Repo -> DB: SaveChangesAsync()
activate DB
DB --> Repo: Transaction committed
deactivate DB
Repo --> S: Record Saved Successfully
deactivate Repo
S --> C: Return ProcessResult (Success)
deactivate S
C --> SV: HTTP 200 OK (Checked-in successfully)
deactivate C
@enduml
```

### **2.3 Deployment View (Figure III-2: Sơ đồ Triển khai)**
```plantuml
@startuml
skinparam style strictuml

node "User Devices" {
    node "Mobile Phone" as Mobile {
        artifact "React Native App" as App
    }
    node "Lecturer & Admin PC" as PC {
        artifact "Next.js Web Portal" as Web
    }
}

node "Cloud Hosting (Docker Cluster)" as Cloud {
    node "Nginx Container" as Nginx <<load balancer>>
    
    node "API Server Node 1" as Node1 {
        artifact ".NET 8 API Cont. 1" as API1
    }
    node "API Server Node 2" as Node2 {
        artifact ".NET 8 API Cont. 2" as API2
    }
    
    node "Caching Node" as Cache {
        database "Redis Cluster" as Redis
    }
    
    node "Database Node" as DBNode {
        database "PostgreSQL DB" as PG
    }
}

App --> Nginx : "HTTPS / Port 443"
Web --> Nginx : "WSS / Port 443"

Nginx --> API1 : "HTTP / Round Robin"
Nginx --> API2 : "HTTP / Round Robin"

API1 --> Redis : "TCP / Port 6379"
API2 --> Redis : "TCP / Port 6379"

API1 --> PG : "TCP / Port 5432"
API2 --> PG : "TCP / Port 5432"
@enduml
```

---

## **III.3 Component and Package Diagram**

The static structural organization of source code packages and structural interaction interfaces.

### **3.1 Package Diagram (Figure III-3)**
```plantuml
@startuml
skinparam style strictuml

package "Solution: AFAS" {
    package "AFAS.Domain" as Domain {
        [Entities]
        [Domain Exceptions]
        [IRepositories]
        [IDomainServices]
    }
    package "AFAS.Application" as App {
        [Application Services]
        [Data Transfer Objects (DTOs)]
        [ISessionNotifier]
        [IIdentityService]
    }
    package "AFAS.Infrastructure" as Infra {
        [Persistence / EF Core]
        [Caching / Redis]
        [Identity Providers]
    }
    package "AFAS.Presentation" as Pres {
        [API Controllers]
        [SignalR Realtime Hubs]
        [Custom Middleware]
    }
}

Pres ..> App
Pres ..> Domain
App ..> Domain
Infra ..> App
Infra ..> Domain
@enduml
```

### **3.2 Component Diagram (Figure III-4)**
```plantuml
@startuml
skinparam style strictuml

[Mobile Application] as Mobile <<Component>>
[Web Portal Application] as Web <<Component>>
[Attendance API Gateway] as Gateway <<Component>>
[AntiFraud Validator Engine] as Engine <<Component>>
[Cache Manager] as Cache <<Component>>
[Database Persistence] as DB <<Component>>

interface "HTTP API" as API
interface "WebSocket (SignalR)" as WebSock
interface "ICacheManager" as ICache
interface "IRepository" as IRepo

Gateway - API
Gateway - WebSock

Mobile ..> API : "Gửi yêu cầu"
Web ..> WebSock : "Kết nối đẩy QR"

Gateway --> Engine : "Gọi xác thực"
Engine ..( ICache : "Đọc/ghi token"
Cache - ICache

Engine ..( IRepo : "Đọc cấu hình / Lưu record"
DB - IRepo
@enduml
```

### **Decomposition Criteria and Justification**
We decompose the AFAS architecture into packages and components based on three core software design criteria:
1.  **Single Responsibility Principle (SRP):** Each package has a distinct reason to change. `AFAS.Domain` changes only when core business rules change. `AFAS.Infrastructure` changes only when third-party libraries or DB drivers change.
2.  **High Cohesion (Communicational & Functional Cohesion):** Classes that work together to fulfill a single cohesive purpose are grouped together (e.g., all geofencing and dynamic token validations are encapsulated within `AntiFraud_Validator_Engine`).
3.  **Low Coupling via Dependency Inversion:** Components depend only on abstract interfaces rather than concrete subclasses. For instance, the validator engine calls `ICacheManager` to fetch tokens, meaning we can swap out the Redis cache component for an in-memory cache without changing the validation logic.

---

## **III.4 Detail Design**

The detailed design classes are decomposed into four independent, modular subsystems based on their functional boundaries. Each subsystem operates under a **Clean / Ports & Adapters** architecture, where boundaries communicate through application controls, and infrastructure adapters implement interfaces defined by the core Domain entities.

### **III.4.1 Attendance Subsystem**

This subsystem manages student check-in transactions, active dynamically refreshed validation keys (QR and PIN tokens), caching, and real-time WebSocket notifications.

#### **Figure III-5A: Attendance Subsystem Detailed Design Class Diagram**
```plantuml
@startuml
skinparam style strictuml

package "Presentation Layer (Boundary)" {
    class AttendanceController <<Boundary / WebAPI>> {
        -IAttendanceService _attendanceService
        +SubmitAttendance(AttendanceDto dto) : Task<IActionResult>
        +GetStudentHistory(string studentId) : Task<IActionResult>
    }
    class AttendanceHub <<Boundary / SignalR>> {
        +OnConnectedAsync() : Task
        +OnDisconnectedAsync(Exception ex) : Task
    }
}

package "Application Layer (Control / Ports)" {
    interface IAttendanceService <<Interface / Application>> {
        +ProcessCheckin(AttendanceDto dto) : Task<Result<CheckinResultDto>>
        +GetHistory(string studentId) : Task<List<AttendanceRecordDto>>
    }
    class AttendanceService <<Control / Application>> {
        -IAttendanceRecordRepository _attendanceRepo
        -IRoomRepository _roomRepo
        -IStudentRepository _studentRepo
        -ICacheManager _cacheManager
        -IRealtimeNotifier _notifier
        +ProcessCheckin(AttendanceDto dto) : Task<Result<CheckinResultDto>>
        +GetHistory(string studentId) : Task<List<AttendanceRecordDto>>
    }
    interface ISessionService <<Interface / Application>> {
        +ActivateSession(string sessionId, double? lat, double? lon) : Task<Result<bool>>
        +DeactivateSession(string sessionId) : Task<Result<bool>>
    }
    class SessionService <<Control / Application>> {
        -ISessionRepository _sessionRepo
        -IAttendanceVersionRepository _versionRepo
        -ICacheManager _cacheManager
        -IRealtimeNotifier _notifier
        +ActivateSession(string sessionId, double? lat, double? lon) : Task<Result<bool>>
        +DeactivateSession(string sessionId) : Task<Result<bool>>
    }
    interface ICacheManager <<Interface / Application>> {
        +GetTokenAsync(string key) : Task<string>
        +SetTokenAsync(string key, string value, TimeSpan expiry) : Task
    }
    interface IRealtimeNotifier <<Interface / Application>> {
        +PushAttendanceSuccess(string lecturerId, AttendanceRecord record) : Task
        +BroadcastNewQR(string sessionId, string token) : Task
    }
}

package "Domain Layer (Core Entities)" {
    class AttendanceRecord <<Domain Entity>> {
        +RecordId : string
        +StudentId : string
        +SessionId : string
        +CheckedInAt : DateTime
        +CheckedInLat : double
        +CheckedInLong : double
        +Distance : double
        +WifiSSID : string
        +PublicIP : string
        +DeviceUUID : string
        +DeviceName : string
        +SelfiePath : string
        +Status : string
        +VerificationMode : string
        {static} +Create(studentId, sessionId, lat, lon, wifi, ip, uuid, deviceName, selfie, mode, room, lecturerLat, lecturerLon, activeToken, submittedToken) : AttendanceRecord
    }
    class Session <<Domain Entity>> {
        +SessionId : string
        +ClassSectionId : string
        +RoomId : string
        +SessionDate : DateOnly
        +StartTime : TimeOnly
        +EndTime : TimeOnly
    }
    class AttendanceVersion <<Domain Entity>> {
        +VersionId : string
        +SessionId : string
        +IsActive : bool
        +ActiveToken : string
        +ActivePin : string
        +LecturerLatitude : double?
        +LecturerLongitude : double?
        +RefreshedAt : DateTime
        +ValidateToken(string scannedToken) : bool
        +ValidatePIN(string scannedPIN) : bool
    }
    interface IAttendanceRecordRepository <<Interface / Domain>> {
        +GetByIdAsync(string id) : Task<AttendanceRecord>
        +AddAsync(AttendanceRecord entity) : Task
        +GetBySessionIdAsync(string sessionId) : Task<List<AttendanceRecord>>
    }
    interface ISessionRepository <<Interface / Domain>> {
        +GetSessionByIdAsync(string sessionId) : Task<Session>
    }
    interface IAttendanceVersionRepository <<Interface / Domain>> {
        +GetBySessionIdAsync(string sessionId) : Task<AttendanceVersion>
        +SaveAsync(AttendanceVersion version) : Task
    }
}

package "Infrastructure Layer (Adapters)" {
    class AttendanceRecordRepository <<Database Wrapper / Infrastructure>> {
        -DbContext _dbContext
        +GetByIdAsync(string id) : Task<AttendanceRecord>
        +AddAsync(AttendanceRecord entity) : Task
    }
    class SessionRepository <<Database Wrapper / Infrastructure>> {
        -DbContext _dbContext
        +GetSessionByIdAsync(string sessionId) : Task<Session>
    }
    class RedisCacheManager <<Infrastructure Cache / Adapter>> {
        -IConnectionMultiplexer _redis
        +GetTokenAsync(string key) : Task<string>
        +SetTokenAsync(string key, string value, TimeSpan expiry) : Task
    }
    class SignalRRealtimeNotifier <<Infrastructure Realtime / Adapter>> {
        -IHubContext<AttendanceHub> _hubContext
        +PushAttendanceSuccess(string lecturerId, AttendanceRecord record) : Task
    }
}

AttendanceController --> IAttendanceService
AttendanceService ..|> IAttendanceService
AttendanceService --> IAttendanceRecordRepository
AttendanceService --> ICacheManager
AttendanceService --> IRealtimeNotifier
AttendanceService --> AttendanceRecord

SessionService ..|> ISessionService
SessionService --> ISessionRepository
SessionService --> IAttendanceVersionRepository
SessionService --> ICacheManager

AttendanceRecordRepository ..|> IAttendanceRecordRepository
SessionRepository ..|> ISessionRepository
RedisCacheManager ..|> ICacheManager
SignalRRealtimeNotifier ..|> IRealtimeNotifier
@enduml
```

#### **Attendance Subsystem Rich Entity Contracts:**
*   **Method:** `AttendanceRecord.Create(...)`
    *   **Preconditions:**
        *   `studentId` must not be null or empty.
        *   `sessionId` must not be null or empty.
        *   `room` must not be null.
        *   `lat` must be between `-90.0` and `90.0`.
        *   `lon` must be between `-180.0` and `180.0`.
    *   **Postconditions:**
        *   Returns a fully instantiated `AttendanceRecord` C# object.
        *   Sets `Status` to `"Present"` if the distance check is within classroom bounds, otherwise `"Fraud_Declined"`.
        *   Throws `DomainException` if the active token validation fails.
        *   Throws `DeviceMismatchException` if `deviceUUID` does not match student's `boundUuid`.
*   **Method:** `AttendanceVersion.ValidateToken(string scannedToken)`
    *   **Preconditions:** `scannedToken` must not be null or empty.
    *   **Postconditions:** Returns `true` if `scannedToken == ActiveToken` and `DateTime.UtcNow - RefreshedAt <= 15s`.

---

### **III.4.2 Identity & Access Subsystem**

This subsystem is responsible for authenticating users, managing profiles (Students & Lecturers), and compiling administrative audit logs.

#### **Figure III-5B: Identity & Access Subsystem Detailed Class Diagram**
```plantuml
@startuml
skinparam style strictuml

package "Presentation Layer (Boundary)" {
    class AccountController <<Boundary / WebAPI>> {
        -IAuthenticationService _authService
        +LoginCredentials(LoginDto dto) : Task<IActionResult>
        +LoginGoogle(GoogleLoginDto dto) : Task<IActionResult>
    }
}

package "Application Layer (Control / Ports)" {
    interface IAuthenticationService <<Interface / Application>> {
        +AuthenticateCredentials(string username, string password) : Task<Result<string>>
        +AuthenticateGoogle(string idToken) : Task<Result<string>>
    }
    class AuthenticationService <<Control / Application>> {
        -IAccountRepository _accountRepo
        -IStudentRepository _studentRepo
        +AuthenticateCredentials(string username, string password) : Task<Result<string>>
        +AuthenticateGoogle(string idToken) : Task<Result<string>>
    }
}

package "Domain Layer (Core Entities)" {
    class Account <<Domain Entity>> {
        +Id : string
        +Email : string
        +PasswordHash : string
        +FullName : string
        +Role : string
    }
    class Student <<Domain Entity>> {
        +StudentId : string
        +AccountId : string
    }
    class Lecturer <<Domain Entity>> {
        +LecturerId : string
        +AccountId : string
        +Department : string
    }
    class SystemLog <<Domain Entity>> {
        +LogId : string
        +AccountId : string
        +Timestamp : DateTime
        +Action : string
        +Description : string
    }
    interface IAccountRepository <<Interface / Domain>> {
        +GetByEmailAsync(string email) : Task<Account>
        +GetByUsernameAsync(string username) : Task<Account>
        +CreateAccountAsync(Account account) : Task
    }
    interface IStudentRepository <<Interface / Domain>> {
        +GetByStudentIdAsync(string studentId) : Task<Student>
        +UpdateAsync(Student student) : Task
    }
    interface ILecturerRepository <<Interface / Domain>> {
        +GetByLecturerIdAsync(string lecturerId) : Task<Lecturer>
    }
    interface ISystemLogRepository <<Interface / Domain>> {
        +AddLogAsync(SystemLog log) : Task
    }
}

package "Infrastructure Layer (Adapters)" {
    class AccountRepository <<Database Wrapper / Infrastructure>> {
        -DbContext _dbContext
        +GetByEmailAsync(string email) : Task<Account>
    }
    class StudentRepository <<Database Wrapper / Infrastructure>> {
        -DbContext _dbContext
        +GetByStudentIdAsync(string studentId) : Task<Student>
    }
    class SystemLogRepository <<Database Wrapper / Infrastructure>> {
        -DbContext _dbContext
        +AddLogAsync(SystemLog log) : Task
    }
}

AccountController --> IAuthenticationService
AuthenticationService ..|> IAuthenticationService
AuthenticationService --> IAccountRepository
AuthenticationService --> IStudentRepository

AccountRepository ..|> IAccountRepository
StudentRepository ..|> IStudentRepository
SystemLogRepository ..|> ISystemLogRepository
@enduml
```

#### **Identity Subsystem Rich Entity Contracts:**
*   **Authentication Flow:** Standard credentials matching and Google OAuth validation endpoints. No device UUID binds are required.

---

### **III.4.3 Room/Facility Subsystem**

This subsystem manages structural classroom profiles, target coordinate geofences, and calculates coordinate deviations.

#### **Figure III-5C: Room/Facility Subsystem Detailed Class Diagram**
```plantuml
@startuml
skinparam style strictuml

package "Presentation Layer (Boundary)" {
    class RoomController <<Boundary / WebAPI>> {
        -IRoomService _roomService
        +SaveRoomConfiguration(RoomDto dto) : Task<IActionResult>
        +GetRooms() : Task<IActionResult>
    }
}

package "Application Layer (Control / Ports)" {
    interface IRoomService <<Interface / Application>> {
        +UpdateRoomGeo(RoomDto dto) : Task<Result<bool>>
        +GetAllRooms() : Task<List<RoomDto>>
    }
    class RoomService <<Control / Application>> {
        -IRoomRepository _roomRepo
        +UpdateRoomGeo(RoomDto dto) : Task<Result<bool>>
        +GetAllRooms() : Task<List<RoomDto>>
    }
}

package "Domain Layer (Core Entities)" {
    class Room <<Domain Entity>> {
        +RoomId : string
        +RoomName : string
        +Latitude : double
        +Longitude : double
        +AllowedRadius : double
        +CalculateDistance(double targetLat, double targetLong) : double
        +IsWithinAllowedRadius(double targetLat, double targetLong, out double calculatedDistance) : bool
    }
    interface IRoomRepository <<Interface / Domain>> {
        +GetRoomGeoConfigAsync(string sessionId) : Task<Room>
        +GetAllRoomsAsync() : Task<List<Room>>
        +UpdateGeoConfigAsync(Room room) : Task
    }
}

package "Infrastructure Layer (Adapters)" {
    class RoomRepository <<Database Wrapper / Infrastructure>> {
        -DbContext _dbContext
        +GetRoomGeoConfigAsync(string sessionId) : Task<Room>
        +GetAllRoomsAsync() : Task<List<Room>>
        +UpdateGeoConfigAsync(Room room) : Task
    }
}

RoomController --> IRoomService
RoomService ..|> IRoomService
RoomService --> IRoomRepository
RoomRepository ..|> IRoomRepository
@enduml
```

#### **Room Subsystem Rich Entity Contracts:**
*   **Method:** `Room.CalculateDistance(double targetLat, double targetLong)`
    *   **Preconditions:** `targetLat` must be between `-90.0` and `90.0`; `targetLong` must be between `-180.0` and `180.0`.
    *   **Postconditions:** Returns the exact distance in meters calculated using the double-precision Haversine formula.
*   **Method:** `Room.IsWithinAllowedRadius(double targetLat, double targetLong, out double calculatedDistance)`
    *   **Preconditions:** `targetLat` between `-90.0` and `90.0`, `targetLong` between `-180.0` and `180.0`.
    *   **Postconditions:** Returns `true` if `calculatedDistance <= AllowedRadius`, otherwise `false`.

---

### **III.4.4 Reporting Subsystem**

An auxiliary subsystem that aggregates student check-in records for a class section and generates Excel spreadsheets.

#### **Figure III-5D: Reporting Subsystem Detailed Class Diagram**
```plantuml
@startuml
skinparam style strictuml

package "Presentation Layer (Boundary)" {
    class ReportController <<Boundary / WebAPI>> {
        -IReportService _reportService
        +ExportClassReport(string classId) : Task<IActionResult>
    }
}

package "Application Layer (Control / Ports)" {
    interface IReportService <<Interface / Application>> {
        +GenerateExcelReport(string classId) : Task<byte[]>
    }
    class ReportService <<Control / Application>> {
        -IAttendanceRecordRepository _attendanceRepo
        -IExcelGenerator _excelGenerator
        +GenerateExcelReport(string classId) : Task<byte[]>
    }
    interface IExcelGenerator <<Interface / Infrastructure Port>> {
        +CreateWorkbook(List<AttendanceRecord> records) : byte[]
    }
}

package "Domain Layer (External Domain Interfaces)" {
    class AttendanceRecord <<Domain Entity>> {
        +RecordId : string
        +StudentId : string
        +SessionId : string
        +CheckedInAt : DateTime
        +Status : string
    }
    interface IAttendanceRecordRepository <<Interface / Domain>> {
        +GetByClassSectionIdAsync(string classId) : Task<List<AttendanceRecord>>
    }
}

package "Infrastructure Layer (Adapters)" {
    class ExcelReportGenerator <<Infrastructure Generator / Adapter>> {
        +CreateWorkbook(List<AttendanceRecord> records) : byte[]
    }
}

ReportController --> IReportService
ReportService ..|> IReportService
ReportService --> IExcelGenerator
ReportService --> IAttendanceRecordRepository
ExcelReportGenerator ..|> IExcelGenerator
@enduml
```

---

## **III.5 Database Design**

The data contained in the entity classes of the static model are mapped to a database (in this system, we will design a relational database). The entity class diagram of the AFAS system, which models the data requirements, will be mapped to a relational database design for the system.

**Account** (Id: varchar(36) [PK], Email: varchar(100) [UNIQUE], PasswordHash: varchar(255), FullName: varchar(100), Role: varchar(20), CreatedAt: timestamp)

**Student** (StudentId: varchar(20) [PK], AccountId: varchar(36) [FK -> accounts.id])

**Lecturer** (LecturerId: varchar(20) [PK], AccountId: varchar(36) [FK -> accounts.id], Department: varchar(100))

**Subject** (SubjectCode: varchar(20) [PK], SubjectName: varchar(150), Credits: int)

**Room** (RoomId: varchar(20) [PK], RoomName: varchar(50), Latitude: double precision, Longitude: double precision, AllowedRadius: double precision)

**ClassSection** (ClassSectionId: varchar(30) [PK], ClassSectionName: varchar(100), SubjectCode: varchar(20) [FK -> subjects.subject_code], LecturerId: varchar(20) [FK -> lecturers.lecturer_id], Semester: varchar(20))

**ClassSectionStudent** (ClassSectionId: varchar(30) [FK -> class_sections.class_section_id], StudentId: varchar(20) [FK -> students.student_id]) [Composite PK: (ClassSectionId, StudentId)]

**Session** (SessionId: varchar(36) [PK], ClassSectionId: varchar(30) [FK -> class_sections.class_section_id], RoomId: varchar(20) [FK -> rooms.room_id], SessionDate: date, StartTime: time, EndTime: time)

**AttendanceVersion** (SessionId: varchar(36) [PK, FK -> sessions.session_id], DynamicToken: varchar(255), QRRefreshedAt: timestamp, PINCode: varchar(6), LecturerLatitude: double precision, LecturerLongitude: double precision, IsActive: boolean)

**AttendanceRecord** (RecordId: varchar(36) [PK], StudentId: varchar(20) [FK -> students.student_id], SessionId: varchar(36) [FK -> sessions.session_id], CheckedInAt: timestamp, CheckedInLat: double precision, CheckedInLong: double precision, Distance: double precision, WifiSSID: varchar(100), PublicIP: varchar(45), DeviceUUID: varchar(100), DeviceName: varchar(100), SelfiePath: varchar(255), Status: varchar(20), VerificationMode: varchar(20))

**SystemLog** (LogId: serial [PK], AccountId: varchar(36) [FK -> accounts.id], Timestamp: timestamp, Action: varchar(50), Description: varchar(255))

---

## **IV. Implementation**

## **IV.1 Map architecture to the structure of the project**

The software design architecture is mapped directly to the actual source code directory folders. The solution is split into two primary codebases: `AFAS.Backend` (Clean Architecture C# WebAPI) and `AFAS.Student.App` (React Native Mobile Client).

### **1. Backend Solution Folder Layout (.NET 8 Clean Architecture)**
```text
AFAS.Backend/
├── AFAS.Backend.sln                     # Visual Studio Solution File
│
├── 1.Domain/                            # DOMAIN LAYER (Business Core)
│   └── AFAS.Domain/
│       ├── Common/                      # Value Objects & Common Enums
│       ├── Entities/                    # Domain Entities POCO
│       │   ├── Student.cs
│       │   ├── Room.cs
│       │   └── AttendanceRecord.cs
│       ├── Exceptions/                  # Domain-specific Business Exceptions
│       └── Repositories/                # Database Abstraction Interfaces
│           ├── IStudentRepository.cs
│           └── IAttendanceRecordRepository.cs
│
├── 2.Application/                       # APPLICATION LAYER (Use Cases & Handlers)
│   └── AFAS.Application/
│       ├── Dtos/                        # Data Transfer Objects (Request/Response)
│       │   ├── AttendanceDto.cs
│       │   └── RoomDto.cs
│       ├── Interfaces/                  # Technical Core Abstractions
│       │   ├── ICacheManager.cs
│       │   └── IRealtimeNotifier.cs
│       └── Services/                    # Core Business Application Services
│           ├── AttendanceService.cs     # Executes 3-layer anti-fraud algorithms
│           └── SessionService.cs        # Controls dynamic QR/PIN generation
│
├── 3.Infrastructure/                    # INFRASTRUCTURE LAYER (Technical Implementation)
│   └── AFAS.Infrastructure/
│       ├── Persistence/                 # PostgreSQL access via EF Core
│       │   ├── AFASDbContext.cs
│       │   └── Repositories/            # Repository Interface Implementations
│       │       ├── StudentRepository.cs
│       │       └── AttendanceRecordRepository.cs
│       ├── Caching/                     # In-Memory Cache via Redis client
│       │   └── RedisCacheManager.cs
│       ├── Identity/                    # Third-party Identity provider integration
│       │   └── GoogleIdentityService.cs
│       └── Realtime/                    # SignalR WebSockets broadcasting
│           ├── AttendanceHub.cs
│           └── SignalRRealtimeNotifier.cs
│
└── 4.Presentation/                      # PRESENTATION LAYER (REST Endpoints)
    └── AFAS.WebAPI/
        ├── Controllers/                 # API Controllers (Boundary)
        │   ├── AttendanceController.cs
        │   └── SessionController.cs
        ├── Middlewares/                 # Global Error Exception Handler
        │   └── ExceptionMiddleware.cs
        └── Program.cs                   # App Boostrap & Dependency Injection
```

### **2. Mobile Client Folder Layout (React Native Client)**
```text
AFAS.Student.App/
├── package.json                         # Node dependencies registry
├── index.js                             # Entry bootloader
├── App.tsx                              # App router and stack navigator
│
└── src/
    ├── api/                             # Axios client configuration
    │   └── attendanceApi.ts
    ├── components/                      # Common UI widgets (Buttons, camera view wrapper)
    ├── hooks/                           # Hooks calling hardware device sensors
    │   ├── useGPSLocation.ts            # High-precision hardware GPS coordinates fetcher
    │   ├── useDeviceBiometrics.ts       # Platform-native Biometric (FaceID/TouchID) API call
    │   └── useDeviceUUID.ts             # Device UUID extraction hook
    ├── navigation/                      # Screens stack nav config
    └── screens/                         # Display screens (LoginForm, Scanner, History)
        ├── LoginScreen.tsx
        ├── DashboardScreen.tsx
        ├── QRScannerScreen.tsx
        └── HistoryScreen.tsx
```

---

## **IV.2 Map Class Diagram and Interaction Diagram to Code**

To demonstrate the structural mapping, this section provides the concrete C# (.NET 8) code implementations for the core classes specified in the detailed class diagrams. It demonstrates the transition from an anemic domain to a **Rich Domain Model** by encapsulating distance calculations within `Room` and anti-fraud validations within `AttendanceRecord`.

### **1. Domain Entity Class Mapping — Room (`AFAS.Domain.Entities.Room`)**
```csharp
using System;

namespace AFAS.Domain.Entities
{
    public class Room
    {
        public string RoomId { get; private set; }
        public string RoomName { get; private set; }
        public double Latitude { get; private set; }
        public double Longitude { get; private set; }
        public double AllowedRadius { get; private set; }

        public Room(string roomId, string roomName, double latitude, double longitude, double allowedRadius)
        {
            RoomId = roomId ?? throw new ArgumentNullException(nameof(roomId));
            RoomName = roomName ?? throw new ArgumentNullException(nameof(roomName));
            Latitude = latitude;
            Longitude = longitude;
            AllowedRadius = allowedRadius > 0 ? allowedRadius : throw new ArgumentException("Radius must be positive.");
        }

        /// <summary>
        /// Calculates the distance in meters between the classroom and a target coordinate using the Haversine formula.
        /// </summary>
        public double CalculateDistance(double targetLat, double targetLong)
        {
            double R = 6371e3; // Earth radius in meters
            double phi1 = Latitude * Math.PI / 180;
            double phi2 = targetLat * Math.PI / 180;
            double deltaPhi = (targetLat - Latitude) * Math.PI / 180;
            double deltaLambda = (targetLong - Longitude) * Math.PI / 180;

            double a = Math.Sin(deltaPhi / 2) * Math.Sin(deltaPhi / 2) +
                       Math.Cos(phi1) * Math.Cos(phi2) *
                       Math.Sin(deltaLambda / 2) * Math.Sin(deltaLambda / 2);
            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

            return R * c; // in meters
        }

        /// <summary>
        /// Verifies whether the submitted student coordinates lie within the classroom geofence.
        /// </summary>
        public bool IsWithinAllowedRadius(double targetLat, double targetLong, out double calculatedDistance)
        {
            calculatedDistance = CalculateDistance(targetLat, targetLong);
            return calculatedDistance <= AllowedRadius;
        }
    }
}
```

### **2. Domain Entity Class Mapping — AttendanceRecord (`AFAS.Domain.Entities.AttendanceRecord`)**
```csharp
using System;

namespace AFAS.Domain.Entities
{
    public class AttendanceRecord
    {
        public string RecordId { get; private set; }
        public string StudentId { get; private set; }
        public string SessionId { get; private set; }
        public DateTime CheckedInAt { get; private set; }
        public double CheckedInLat { get; private set; }
        public double CheckedInLong { get; private set; }
        public double Distance { get; private set; }
        public string WifiSSID { get; private set; }
        public string PublicIP { get; private set; }
        public string DeviceUUID { get; private set; }
        public string DeviceName { get; private set; }
        public string SelfiePath { get; private set; }
        public string Status { get; private set; }
        public string VerificationMode { get; private set; }

        private AttendanceRecord(string studentId, string sessionId, double lat, double lon, 
            double distance, string wifi, string ip, string uuid, string deviceName, string selfie, string status, string mode)
        {
            RecordId = Guid.NewGuid().ToString();
            StudentId = studentId;
            SessionId = sessionId;
            CheckedInAt = DateTime.UtcNow;
            CheckedInLat = lat;
            CheckedInLong = lon;
            Distance = distance;
            WifiSSID = wifi;
            PublicIP = ip;
            DeviceUUID = uuid;
            DeviceName = deviceName;
            SelfiePath = selfie;
            Status = status;
            VerificationMode = mode;
        }

        private static double CalculateHaversineDistance(double lat1, double lon1, double lat2, double lon2)
        {
            double R = 6371e3; // Earth radius in meters
            double phi1 = lat1 * Math.PI / 180;
            double phi2 = lat2 * Math.PI / 180;
            double deltaPhi = (lat2 - lat1) * Math.PI / 180;
            double deltaLambda = (lon2 - lon1) * Math.PI / 180;

            double a = Math.Sin(deltaPhi / 2) * Math.Sin(deltaPhi / 2) +
                       Math.Cos(phi1) * Math.Cos(phi2) *
                       Math.Sin(deltaLambda / 2) * Math.Sin(deltaLambda / 2);
            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

            return R * c; // in meters
        }

        /// <summary>
        /// Rich domain factory that enforces the three layers of anti-fraud validation rules.
        /// </summary>
        public static AttendanceRecord Create(
            string studentId, 
            string sessionId, 
            double lat, 
            double lon, 
            string wifi, 
            string ip, 
            string uuid, 
            string deviceName, 
            string selfie, 
            string mode, 
            Room room, 
            double? lecturerLat,
            double? lecturerLon,
            string activeToken, 
            string submittedToken)
        {
            if (string.IsNullOrWhiteSpace(studentId))
                throw new ArgumentException("Student ID is required.");
            if (string.IsNullOrWhiteSpace(sessionId))
                throw new ArgumentException("Session ID is required.");
            if (room == null)
                throw new ArgumentNullException(nameof(room));

            // Layer 1: Verify dynamic QR/PIN token validity
            if (activeToken == null || activeToken != submittedToken)
            {
                throw new DomainException("QR/PIN code has expired or is invalid.");
            }

            // Layer 2: GPS Location Check (Dual-GPS verification with Room Fallback)
            double calculatedDistance;
            bool isWithinRange;
            if (lecturerLat.HasValue && lecturerLon.HasValue)
            {
                calculatedDistance = CalculateHaversineDistance(lat, lon, lecturerLat.Value, lecturerLon.Value);
                isWithinRange = calculatedDistance <= 15.0; // Allowed 15m radius from lecturer device
            }
            else
            {
                isWithinRange = room.IsWithinAllowedRadius(lat, lon, out calculatedDistance);
            }

            // Determine check-in status: out-of-range yields Fraud_Declined record
            string status = isWithinRange ? "Present" : "Fraud_Declined";

            return new AttendanceRecord(studentId, sessionId, lat, lon, calculatedDistance, wifi, ip, uuid, deviceName, selfie, status, mode);
        }
    }
}
```

### **3. Application Service Class Mapping (`AFAS.Application.Services.AttendanceService`)**
```csharp
using System;
using System.IO;
using System.Threading.Tasks;
using AFAS.Domain.Entities;
using AFAS.Domain.Repositories;
using AFAS.Application.Interfaces;
using AFAS.Application.Dtos;

namespace AFAS.Application.Services
{
    public class AttendanceService : IAttendanceService
    {
        private readonly IAttendanceRecordRepository _attendanceRepo;
        private readonly IRoomRepository _roomRepo;
        private readonly IStudentRepository _studentRepo;
        private readonly ICacheManager _cacheManager;
        private readonly IRealtimeNotifier _notifier;

        public AttendanceService(
            IAttendanceRecordRepository attendanceRepo, 
            IRoomRepository roomRepo, 
            IStudentRepository studentRepo, 
            ICacheManager cacheManager, 
            IRealtimeNotifier notifier)
        {
            _attendanceRepo = attendanceRepo;
            _roomRepo = roomRepo;
            _studentRepo = studentRepo;
            _cacheManager = cacheManager;
            _notifier = notifier;
        }

        public async Task<Result<CheckinResultDto>> ProcessCheckin(AttendanceDto dto)
        {
            try
            {
                // Retrieve room geofence configuration
                var room = await _roomRepo.GetRoomGeoConfigAsync(dto.SessionId);
                if (room == null)
                {
                    return Result<CheckinResultDto>.Failure("Room configuration not found for this session.");
                }

                // Retrieve active token from Redis cache
                string cacheKey = $"session:{dto.SessionId}:token";
                string activeToken = await _cacheManager.GetTokenAsync(cacheKey);

                // Retrieve lecturer coords from Redis cache (or db session state)
                double? lecturerLat = await _cacheManager.GetDoubleAsync($"session:{dto.SessionId}:lat");
                double? lecturerLon = await _cacheManager.GetDoubleAsync($"session:{dto.SessionId}:lon");

                // Instantiate record (triggers domain checks and calculations internally)
                var record = AttendanceRecord.Create(
                    dto.StudentId, 
                    dto.SessionId, 
                    dto.Lat, 
                    dto.Long, 
                    dto.WifiSSID, 
                    dto.PublicIP, 
                    dto.DeviceUUID, 
                    dto.DeviceName, 
                    dto.SelfiePath, 
                    "QR", 
                    room, 
                    lecturerLat,
                    lecturerLon,
                    activeToken, 
                    dto.DynamicToken
                );

                // Save result to primary database
                await _attendanceRepo.AddAsync(record);

                // Note: Selfie is RETAINED for lecturer manual verification, deleted at end of course/semester.

                if (record.Status == "Fraud_Declined")
                {
                    return Result<CheckinResultDto>.Failure("Location verification failed. You are outside the classroom.");
                }

                // Broadcast live real-time checked-in state to Lecturer Grid
                await _notifier.PushAttendanceSuccess(room.LecturerId, record);

                return Result<CheckinResultDto>.Success(new CheckinResultDto 
                { 
                    Status = "Present", 
                    CheckedInAt = record.CheckedInAt 
                });
            }
            catch (DomainException ex)
            {
                return Result<CheckinResultDto>.Failure(ex.Message);
            }
            catch (Exception ex)
            {
                return Result<CheckinResultDto>.Failure($"An unexpected error occurred: {ex.Message}");
            }
        }

        private void DeleteTempSelfie(string path)
        {
            if (!string.IsNullOrEmpty(path) && File.Exists(path))
            {
                File.Delete(path);
            }
        }
    }
}
```

### **3. Coding Guidelines & Naming Conventions**
*   **NF-07 (Maintainability) Coding Rules:**
    *   **PascalCase** for Class names, Interface names, Properties, and Public Methods (e.g., `AttendanceRecord`, `ProcessCheckin`).
    *   **camelCase** starting with an underscore (`_`) for private read-only dependency injected variables (e.g., `_attendanceRepo`).
    *   **Interface Prefix:** Every abstract interface must be prefixed with an uppercase `I` (e.g., `IAttendanceService`, `IRoomRepository`).
    *   **Asynchronous Programming:** Every database connection, network interface, or caching access must be asynchronous, utilizing `async` and `await` keywords to ensure high responsiveness.
