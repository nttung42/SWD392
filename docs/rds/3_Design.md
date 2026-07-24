## **III. Design Specification**

This section transforms the COMET analysis model in [2_Analysis.md](2_Analysis.md) into a solution-domain software design for AFAS. The design remains traceable to the 13 use cases UC01-UC04, UC05a-UC05b, UC06-UC08, and UC09a-UC09d, business rules in Section I.6, and non-functional requirements NF-01-NF-07 in [1_Requirement.md](1_Requirement.md).

Design decisions are intentionally limited to what is required by the project statement: dynamic QR/PIN attendance, location capture for reference, identity evidence, real-time lecturer monitoring, manual adjustment, reporting, and catalog management.

---

## **III.1 Design Goals and Technology Decisions**

### **III.1.1 Quality Attribute Priorities**

| **Priority** | **Quality Attribute**       | **Requirement Source** | **Design Consequence**                                                                                                       |
| :----------- | :-------------------------- | :--------------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| 1            | Performance and concurrency | NF-01, NF-07           | Keep attendance-code validation fast by caching active QR/PIN values; keep check-in path stateless at the application layer. |
| 2            | Accuracy                    | NF-02, BR-03           | Store captured location coordinates behind an explicit service; location is informational only and does not gate check-in (no distance is computed). |
| 3            | Security and privacy        | NF-04, BR-01, BR-04    | Enforce role-based access and protected attendance evidence storage.                                                         |
| 4            | Modifiability               | NF-06                  | Store QR refresh, PIN refresh, and Late threshold as configurable values.                                   |
| 5            | Usability                   | NF-03                  | Keep student check-in and lecturer session-monitoring flows short and event-driven.                                          |

### **III.1.2 Architecture Decision**

### **Decision: Modular Monolith with Client Applications, Cache, Polling Monitor, and Database Wrappers**

**Quality Attribute Priority:** Performance, modifiability, testability, and traceability.

**Chosen Option:** A modular monolith backend with separate client applications for students and staff, one owned relational persistence boundary, a cache wrapper for short-lived QR/PIN values, and a near-real-time polling endpoint for lecturer monitoring.

**Reason:** AFAS has clear internal modules but does not require independently deployable services. The peak classroom load in NF-01 justifies a cache wrapper for active attendance codes, and UC06 can be satisfied by a lightweight staff polling endpoint with a maximum 5-second refresh delay. Splitting the backend into separately deployed services or maintaining a persistent realtime channel would add deployment complexity beyond MVP needs.

**Trade-off:** The backend modules deploy together, so independent scaling by business module is limited. This is accepted because the project scope values maintainability and traceability over independent service operations.

**Traceability:** UC01-UC04, UC05a-UC05b, UC06-UC08, UC09a-UC09d; NF-01, NF-04, NF-06, NF-07; analysis controls from Section II.1.4.

### **III.1.3 Technology Mapping**

The AFAS design uses React Native for the student mobile app, React for the staff web app, and a .NET-based stack for the backend and supporting services.

| **Component**                   | **Specific Stack**                                   | **Reason**                                                                 |
| :------------------------------ | :--------------------------------------------------- | :------------------------------------------------------------------------- |
| Student mobile app              | React Native                                         | Supports cross-platform mobile UI with camera, biometric, GPS, and device evidence access. |
| Lecturer/Admin web portal       | React 18 + TypeScript                                | Supports reusable staff UI components and integrates cleanly with REST polling. |
| Backend API                     | ASP.NET Core 8 Web API                               | Provides HTTPS REST endpoints for mobile and web clients.                  |
| Application and domain services | .NET 8 modular monolith with dependency injection    | Keeps use case services and business rules separated without microservice complexity. |
| Identity integration            | ASP.NET Core OpenID Connect/JWT Bearer               | Uses a standard secure boundary for university identity confirmation.       |
| Database access                 | Entity Framework Core 8 + Npgsql                     | Maps domain entities to PostgreSQL with transactions and constraints.       |
| Relational database             | PostgreSQL 16                                        | Fits attendance, catalog, class, and enrollment relationships.              |
| Attendance code cache           | Redis 7 + StackExchange.Redis                        | Validates short-lived QR/PIN values quickly during check-in bursts.         |
| Near-real-time monitor          | ASP.NET Core REST short polling every 5 seconds      | Keeps lecturer screens current with bounded delay and simpler deployment than a persistent realtime channel. |
| Report export                   | ClosedXML                                            | Generates `.xlsx` attendance reports on the backend.                       |
| Deployment runtime              | Docker containers, Kestrel, Nginx reverse proxy      | Gives reproducible deployment and routes HTTPS REST traffic cleanly.        |

---

## **III.2 Integrated Communication Diagram**

The integrated communication diagram merges the communication diagrams from Phase 2 before subsystem partitioning. It keeps the analysis object names and stereotypes from Section II so that each design dependency can be traced back to a use case.

#### **Figure III-1 Integrated Communication Diagram for AFAS**

```plantuml
@startuml
skinparam style strictuml
skinparam linetype ortho
skinparam nodesep 90
skinparam ranksep 95
skinparam ArrowFontSize 10
skinparam object {
  BackgroundColor White
  BorderColor Black
  FontColor Black
}

top to bottom direction

object "Student\n«external user»" as Student
object "Lecturer\n«external user»" as Lecturer
object "Admin\n«external user»" as Admin
object "Mobile Device Hardware\n«external input device»" as MobileHardware
object "University Identity System\n«external system»" as UIS

frame "AFAS System" as AFAS {
  object "UniversityIdentityAdapter\n«external system wrapper»" as UniversityIdentityAdapter
  object "StudentInterface\n«user interface»" as StudentInterface
  object "LecturerInterface\n«user interface»" as LecturerInterface
  object "AdminInterface\n«user interface»" as AdminInterface
  object "MobileDeviceInterface\n«device I/O»" as MobileDeviceInterface

  object "AuthenticationCoordinator\n«coordinator»" as AuthenticationCoordinator
  object "AttendanceCoordinator\n«coordinator»" as AttendanceCoordinator
  object "AttendanceSessionControl\n«state dependent control»" as AttendanceSessionControl
  object "AccountManagementCoordinator\n«coordinator»" as AccountManagementCoordinator
  object "AcademicCatalogCoordinator\n«coordinator»" as AcademicCatalogCoordinator
  object "ClassRosterCoordinator\n«coordinator»" as ClassRosterCoordinator
  object "SessionSchedulingCoordinator\n«coordinator»" as SessionSchedulingCoordinator

  object "AuthenticationRules\n«business logic»" as AuthenticationRules
  object "CheckInRules\n«business logic»" as CheckInRules
  object "AttendanceSessionRules\n«business logic»" as AttendanceSessionRules
  object "AccountManagementRules\n«business logic»" as AccountManagementRules
  object "AcademicCatalogRules\n«business logic»" as AcademicCatalogRules
  object "ClassRosterRules\n«business logic»" as ClassRosterRules
  object "SessionSchedulingRules\n«business logic»" as SessionSchedulingRules

  object "Role Profile Records\n«entity»\nAccount\nStudent\nLecturer" as RoleRecords
  object "Academic Catalog Records\n«entity»\nSubject\nClassSection" as CatalogRecords
  object "Roster Records\n«entity»\nClassSectionStudent" as RosterRecords
  object "Schedule Records\n«entity»\nSession\nRoom" as ScheduleRecords
  object "Attendance Records\n«entity»\nConfiguration\nAttendanceSession\nAttendanceRecord" as AttendanceRecords

  UniversityIdentityAdapter -[hidden]right- LecturerInterface
  LecturerInterface -[hidden]right- AdminInterface
  StudentInterface -[hidden]down- MobileDeviceInterface
  StudentInterface -[hidden]right- AuthenticationCoordinator
  AuthenticationCoordinator -[hidden]right- AttendanceCoordinator
  AttendanceCoordinator -[hidden]right- AttendanceSessionControl
  AttendanceSessionControl -[hidden]right- AccountManagementCoordinator
  AccountManagementCoordinator -[hidden]right- AcademicCatalogCoordinator
  AcademicCatalogCoordinator -[hidden]right- ClassRosterCoordinator
  ClassRosterCoordinator -[hidden]right- SessionSchedulingCoordinator
  AuthenticationRules -[hidden]right- CheckInRules
  CheckInRules -[hidden]right- AttendanceSessionRules
  AttendanceSessionRules -[hidden]right- AccountManagementRules
  AccountManagementRules -[hidden]right- AcademicCatalogRules
  AcademicCatalogRules -[hidden]right- ClassRosterRules
  ClassRosterRules -[hidden]right- SessionSchedulingRules
  RoleRecords -[hidden]right- CatalogRecords
  CatalogRecords -[hidden]right- RosterRecords
  RosterRecords -[hidden]right- ScheduleRecords
  ScheduleRecords -[hidden]right- AttendanceRecords
}

Student --> StudentInterface : student action
Lecturer --> LecturerInterface : lecturer action
Admin --> AdminInterface : admin action
MobileHardware --> MobileDeviceInterface : device evidence
UIS <-- UniversityIdentityAdapter : identity result

StudentInterface --> AuthenticationCoordinator : login
LecturerInterface --> AuthenticationCoordinator : login
AdminInterface --> AuthenticationCoordinator : login
AuthenticationCoordinator --> UniversityIdentityAdapter : verify identity
AuthenticationCoordinator --> AuthenticationRules : authorize
AuthenticationRules --> RoleRecords : profile

StudentInterface --> AttendanceCoordinator : attendance request
AttendanceCoordinator --> MobileDeviceInterface : collect evidence
AttendanceCoordinator --> CheckInRules : apply check-in rules
CheckInRules --> AttendanceRecords : attendance data
CheckInRules --> CatalogRecords : schedule data
AttendanceCoordinator --> AuthenticationRules : access check
AttendanceCoordinator --> CatalogRecords : roster data
AttendanceCoordinator --> AttendanceRecords : result data

LecturerInterface --> AttendanceSessionControl : session command
AttendanceSessionControl --> AttendanceSessionRules : apply session rules
AttendanceSessionRules --> CatalogRecords : session roster
AttendanceSessionRules --> AttendanceRecords : session data
AttendanceSessionControl --> AttendanceRecords : state update

LecturerInterface --> AttendanceCoordinator : lecturer request
AttendanceCoordinator --> AttendanceSessionRules : apply lecturer rules

AdminInterface --> AccountManagementCoordinator : account data
AccountManagementCoordinator --> AccountManagementRules : apply account rules
AccountManagementRules --> RoleRecords : account and role IDs
AccountManagementCoordinator --> RoleRecords : role profile data

AdminInterface --> AcademicCatalogCoordinator : catalog data
AcademicCatalogCoordinator --> AcademicCatalogRules : apply catalog rules
AcademicCatalogRules --> CatalogRecords : subject and class-section IDs
AcademicCatalogCoordinator --> CatalogRecords : catalog data

AdminInterface --> ClassRosterCoordinator : roster data
ClassRosterCoordinator --> ClassRosterRules : apply roster rules
ClassRosterRules --> RosterRecords : roster IDs
ClassRosterRules --> RoleRecords : student IDs
ClassRosterCoordinator --> RosterRecords : roster data

AdminInterface --> SessionSchedulingCoordinator : schedule data
SessionSchedulingCoordinator --> SessionSchedulingRules : apply scheduling rules
SessionSchedulingRules --> ScheduleRecords : session and room IDs
SessionSchedulingRules --> CatalogRecords : class-section IDs
SessionSchedulingCoordinator --> ScheduleRecords : schedule data

@enduml
```

### **III.2.1 Analysis-to-Design Transformation**

| **Analysis Element**                                                        | **Design Element**                                                    | **Transformation Rule**                                                                                       | **Traceability** |
| :-------------------------------------------------------------------------- | :-------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------ | :--------------- |
| `StudentInterface`, `LecturerInterface`, `AdminInterface`                   | Client UI components and Presentation endpoints                       | Analysis interface objects become client screens and server-side boundary endpoints.                          | UC01-UC04, UC05a-UC05b, UC06-UC08, UC09a-UC09d |
| `IdentitySystemProxy`                                                       | `UniversityIdentityAdapter` `«external system wrapper»`               | External identity confirmation is isolated from AFAS application and domain rules.                            | UC01, BR-01      |
| `MobileDeviceInterface`                                                     | `MobileDeviceEvidenceAdapter` `«hardware wrapper»` on the client side | Hardware access is isolated behind a wrapper for biometric, camera, location, and device evidence collection. | UC02, UC04       |
| `AuthenticationCoordinator`, `AttendanceCoordinator`, `AttendanceSessionControl`, `AccountManagementCoordinator`, `AcademicCatalogCoordinator`, `ClassRosterCoordinator`, `SessionSchedulingCoordinator` | Application use case services | Coordinators and state-dependent controls become application services that orchestrate rules, entities, and wrappers. | UC01-UC04, UC05a-UC05b, UC06-UC08, UC09a-UC09d |
| Business logic and algorithm objects                                        | Domain services and policy classes                                    | Rules become replaceable policy classes; captured location remains informational evidence and location comparison never gates attendance. | Section I.6      |
| `«entity»` classes                                                          | Domain data abstraction classes plus database wrapper repositories    | Each persistent analysis entity maps to a domain class and repository interface/implementation.               | Section II.1.1   |
| `AttendanceCoordinator`                                                     | Lecturer monitor polling endpoint and roster snapshot reader          | Lecturer screens poll the latest attendance snapshot every 5 seconds.                                      | UC06, NF-01      |

---

## **III.3 Static View**

The static view is derived from the integrated communication diagram in Figure III-1. Analysis objects are grouped into aggregate subsystem classes by COMET subsystem structuring criteria: external boundary ownership, cohesive control responsibility, cohesive business-rule responsibility, shared persistent data ownership, interaction density, and isolation of technical adapters. This view hides internal classes and shows only subsystem-level structural associations, interface names, and multiplicities.

### **III.3.1 Subsystem Structuring Criteria**

| **Criterion** | **How it is applied to Figure III-1** | **Resulting Subsystems** |
| :------------ | :------------------------------------ | :----------------------- |
| External boundary ownership | Actor-facing objects are separated from internal coordination objects. | Student Client, Staff Web Client, Presentation Boundary, Device Evidence Access |
| Control cohesion | Coordinators that own related attendance flows are grouped with their lifecycle and monitor responsibilities. | Attendance Management, Administrative Management |
| Business-rule cohesion | Rule objects that make the same kind of domain decision are grouped with the subsystem that owns the related use cases. | Access and Profile Management, Attendance Management |
| Data ownership and adapter isolation | Entity access and technical wrappers are isolated from user-facing and rule subsystems. | Persistence and Technical Adapters |
| Interaction density | Objects that exchange frequent attendance request/reply messages are kept inside one aggregate subsystem; low-frequency report generation is separated. | Attendance Management, Reporting |
| Traceability | Each subsystem retains the UC labels from the source communication diagrams. | UC01-UC04, UC05a-UC05b, UC06-UC08, UC09a-UC09d coverage in Section III.3.2 |

#### **Figure III-2 Static View - Subsystem Class Diagram**

```plantuml
@startuml
skinparam style strictuml
hide empty members
skinparam classAttributeIconSize 0
skinparam linetype ortho
skinparam packageStyle rectangle
skinparam shadowing false
skinparam nodesep 80
skinparam ranksep 90
skinparam ArrowFontSize 10
skinparam class {
  BackgroundColor White
  BorderColor Black
  FontColor Black
}

left to right direction

class "Student Client\n«client» «subsystem»" as StudentClient
class "Staff Web Client\n«client» «subsystem»" as StaffClient
class "Device Evidence Access\n«input/output» «subsystem»" as DeviceIO

class "Presentation Boundary\n«user interaction» «subsystem»" as Presentation

class "Access and Profile Management\n«service» «subsystem»" as Access
class "Attendance Management\n«service» «subsystem»" as AttendanceMgmt
class "Administrative Management\n«service» «subsystem»" as Administration
class "Reporting\n«service» «subsystem»" as Reporting
class "Persistence and Technical Adapters\n«service» «subsystem»" as Adapters

StudentClient -[hidden]right- StaffClient
StaffClient -[hidden]right- DeviceIO

StaffClient -[hidden]down- Presentation

Access -[hidden]right- AttendanceMgmt
AttendanceMgmt -[hidden]right- Administration
Administration -[hidden]right- Reporting

Presentation -[hidden]down- AttendanceMgmt
AttendanceMgmt -[hidden]down- Adapters

StudentClient "0..*" -right- "1" DeviceIO
StudentClient "0..*" -down- "1" Presentation
StaffClient "0..*" -down- "1" Presentation

Presentation "1" -down- "1" Access
Presentation "1" -down- "1" AttendanceMgmt
Presentation "1" -down- "1" Administration
Presentation "1" -down- "1" Reporting

AttendanceMgmt "1" -right- "1" Access

Access "1" -down- "1" Adapters
AttendanceMgmt "1" -down- "1" Adapters
Administration "1" -down- "1" Adapters
Reporting "1" -down- "1" Adapters
@enduml
```

Static HLD view: solid associations show structural subsystem dependencies. Multiplicities show how many subsystem instances participate in each association. Internal classes and message-level details are hidden here.

### **III.3.2 Subsystem Responsibilities**

| **Subsystem**                      | **Primary Stereotype**         | **Responsibility**                                                                                                        | **Traceability**                         |
| :--------------------------------- | :----------------------------- | :------------------------------------------------------------------------------------------------------------------------ | :--------------------------------------- |
| Student Client                     | `«client» «subsystem»`           | Student login, QR scan, PIN, history view, and evidence submission.                                                       | Student; UC01-UC04                       |
| Staff Web Client                   | `«client» «subsystem»`           | Lecturer and admin screens for session, monitor, adjustment, reports, and catalog.                                        | Lecturer, Admin; UC01, UC05a-UC05b, UC06-UC08, UC09a-UC09d |
| Device Evidence Access             | `«input/output» «subsystem»`     | Access device biometric, camera/selfie, GPS, and device identifier.                                                       | Mobile Device Hardware; UC02, UC04       |
| Presentation Boundary              | `«user interaction» «subsystem»` | Receives client requests, validates request shape, maps to application services, returns results.                         | UC01-UC04, UC05a-UC05b, UC06-UC08, UC09a-UC09d |
| Access and Profile Management      | `«service» «subsystem»`          | University identity confirmation, role checks, and AFAS profile lookup.                                                   | UC01, BR-01                              |
| Attendance Management              | `«service» «subsystem»`          | Orchestrates QR/PIN check-in, attendance validation, session lifecycle, same-day manual adjustment, personal history, and live monitor snapshots. Captured location is stored as evidence only and never gates the result. | UC02-UC04, UC05a-UC05b, UC06-UC07, BR-02, BR-04, BR-05, BR-07, BR-08, BR-10, BR-12, BR-13, NF-01 |
| Administrative Management          | `«service» «subsystem»`          | Maintains user accounts, academic catalog, rosters, scheduled sessions, and rooms.                                        | UC09a, UC09b, UC09c, UC09d               |
| Reporting                          | `«service» «subsystem»`          | Generates finalized attendance reports.                                                                                   | UC08, BR-08                              |
| Persistence and Technical Adapters | `«service» «subsystem»`          | Implements database, cache, report file, and hardware wrappers.                                                          | All UC; NF-01, NF-04, NF-06              |

---

## **III.4 Dynamic View**

The dynamic view is produced after the static subsystem class diagram. It converts the subsystem boundaries from Figure III-2 into subsystem-level communication paths, while preserving the UC flow coverage from the Phase 2 communication diagrams.

#### **Figure III-3 Dynamic View - Subsystem Communication Diagram**

```plantuml
@startuml
skinparam style strictuml
skinparam linetype ortho
left to right direction

object "Student Client\n«client» «subsystem»" as StudentClient
object "Staff Web Client\n«client» «subsystem»" as StaffClient
object "Device Evidence Access\n«input/output» «subsystem»" as DeviceIO
object "Presentation Boundary\n«user interaction» «subsystem»" as Presentation
object "Access and Profile Management\n«service» «subsystem»" as Access
object "Attendance Management\n«service» «subsystem»" as AttendanceMgmt
object "Administrative Management\n«service» «subsystem»" as Administration
object "Reporting\n«service» «subsystem»" as Reporting
object "Persistence and Technical Adapters\n«service» «subsystem»" as Adapters

StudentClient --> DeviceIO : 1.1 identity, location, and device evidence
DeviceIO --> StudentClient : 1.2 evidence result
StudentClient --> Presentation : 1.3 student request data
StaffClient --> Presentation : 2.1 staff request data

Presentation --> Access : 3.1 identity and authorization data
Access --> Adapters : 3.2 confirm university identity and role profile
Adapters --> Access : 3.3 access result
Access --> Presentation : 3.4 authenticated profile or rejection

Presentation --> AttendanceMgmt : 4.1 attendance request data
AttendanceMgmt --> Access : 4.2 verify actor permission when required
AttendanceMgmt --> Adapters : 4.3 read session, code, configuration, roster, and record facts
Adapters --> AttendanceMgmt : 4.4 attendance facts
AttendanceMgmt --> Adapters : 4.5 save official result, evidence, or adjustment reason
AttendanceMgmt --> Presentation : 4.6 attendance response

Presentation --> AttendanceMgmt : 5.1 session command data
AttendanceMgmt --> Adapters : 5.2 read schedule, roster, configuration, active code, and session state
Adapters --> AttendanceMgmt : 5.3 lifecycle facts
AttendanceMgmt --> Adapters : 5.4 update state, initialize records, refresh code, or finalize absences
AttendanceMgmt --> Presentation : 5.5 lifecycle result

StaffClient --> Presentation : 6.1 monitor refresh request
Presentation --> AttendanceMgmt : 6.2 request current snapshot
AttendanceMgmt --> Adapters : 6.3 read latest roster and attendance results
Adapters --> AttendanceMgmt : 6.4 snapshot facts
AttendanceMgmt --> Presentation : 6.5 attendance monitor snapshot
Presentation --> StaffClient : 6.6 refreshed monitor view

Presentation --> Reporting : 7.1 report request data
Reporting --> Adapters : 7.2 read finalized matrix and write report file
Adapters --> Reporting : 7.3 report file reference or failure
Reporting --> Presentation : 7.4 export result

Presentation --> Administration : 8.1 admin change data
Administration --> Adapters : 8.2 validate and persist account, catalog, roster, or schedule records
Adapters --> Administration : 8.3 admin change result
Administration --> Presentation : 8.4 admin response
@enduml
```

---

## **III.5 Deployment View**

The deployment view keeps AFAS as one ASP.NET Core backend application runtime with separate React Native and React clients, a PostgreSQL database node, and a Redis cache node. Nginx terminates HTTPS/TLS and forwards REST traffic to the backend runtime.

#### **Figure III-4 Deployment View**

```plantuml
@startuml
skinparam style strictuml

node "Student Mobile Device" as StudentDevice {
  artifact "React Native Student Client App"
  artifact "MobileDeviceEvidenceAdapter"
}

node "Lecturer/Admin Workstation" as StaffDevice {
  artifact "React Staff Web Portal"
}

node "Reverse Proxy" as ReverseProxy {
  artifact "Nginx HTTPS/TLS Gateway"
}

node "Application Server" as AppServer {
  artifact "ASP.NET Core AFAS Backend Runtime" {
    artifact "REST Presentation Controllers"
    artifact "Application Services"
    artifact "Domain Rules and Entities"
    artifact "EF Core Repository Adapters"
    artifact "Redis Cache Adapter"
    artifact "Polling Monitor Endpoint"
    artifact "ClosedXML Report File Adapter"
  }
}

node "Data Server" as DataServer {
  database "PostgreSQL AFAS Database"
}

node "Cache Server" as CacheServer {
  collections "Redis Short-lived Attendance Code Cache"
}

StudentDevice --> ReverseProxy : synchronous with reply; HTTPS REST
StaffDevice --> ReverseProxy : synchronous with reply; HTTPS REST
StaffDevice --> ReverseProxy : periodic polling; HTTPS REST every 5 seconds
ReverseProxy --> AppServer : routes REST
AppServer --> DataServer : synchronous with reply; Npgsql/EF Core connection
AppServer --> CacheServer : synchronous with reply; Redis client connection
@enduml
```

---

## **III.6 Component and Interface Design**

### **III.6.1 Component Diagram**

#### **Figure III-5 Component Diagram with Provided and Required Interfaces**

```plantuml
@startuml
skinparam style strictuml
skinparam componentStyle uml2

component "Student Client App" as StudentApp
component "Staff Web Portal" as StaffPortal
component "Device Evidence Adapter\n«hardware wrapper»" as DeviceAdapter
component "Presentation Boundary" as Presentation
component "Authentication Component" as AuthComponent
component "Attendance Component" as AttendanceComponent
component "Session Component" as SessionComponent
component "Monitoring Component" as MonitoringComponent
component "Administration Component" as AdminComponent
component "Reporting Component" as ReportingComponent
component "Persistence Component\n«database wrapper»" as Persistence
component "Attendance Code Cache\n«data abstraction»" as Cache
component "Report File Adapter\n«external system wrapper»" as ReportFile

interface "IDeviceEvidence" as IDeviceEvidence
interface "IAuthUseCases" as IAuthUseCases
interface "ICheckInUseCases" as ICheckInUseCases
interface "ISessionUseCases" as ISessionUseCases
interface "IMonitorUseCases" as IMonitorUseCases
interface "IAdminUseCases" as IAdminUseCases
interface "IReportUseCases" as IReportUseCases
interface "IRepositoryOperations" as IRepositoryOperations
interface "IAttendanceCodeStore" as IAttendanceCodeStore
interface "IReportFileWriter" as IReportFileWriter

StudentApp ..> IDeviceEvidence : requires; synchronous with reply
DeviceAdapter - IDeviceEvidence
StudentApp ..> IAuthUseCases : requires; synchronous with reply
StudentApp ..> ICheckInUseCases : requires; synchronous with reply
StudentApp ..> IMonitorUseCases : requires; synchronous with reply
StaffPortal ..> IAuthUseCases : requires; synchronous with reply
StaffPortal ..> ISessionUseCases : requires; synchronous with reply
StaffPortal ..> IMonitorUseCases : requires; periodic synchronous with reply
StaffPortal ..> IAdminUseCases : requires; synchronous with reply
StaffPortal ..> IReportUseCases : requires; synchronous with reply

Presentation - IAuthUseCases
Presentation - ICheckInUseCases
Presentation - ISessionUseCases
Presentation - IMonitorUseCases
Presentation - IAdminUseCases
Presentation - IReportUseCases

Presentation --> AuthComponent
Presentation --> AttendanceComponent
Presentation --> SessionComponent
Presentation --> MonitoringComponent
Presentation --> AdminComponent
Presentation --> ReportingComponent

AuthComponent ..> IRepositoryOperations : requires
AttendanceComponent ..> IRepositoryOperations : requires
AttendanceComponent ..> IAttendanceCodeStore : requires
SessionComponent ..> IRepositoryOperations : requires
SessionComponent ..> IAttendanceCodeStore : requires
MonitoringComponent ..> IRepositoryOperations : requires
AdminComponent ..> IRepositoryOperations : requires
ReportingComponent ..> IRepositoryOperations : requires
ReportingComponent ..> IReportFileWriter : requires

Persistence - IRepositoryOperations
Cache - IAttendanceCodeStore
ReportFile - IReportFileWriter
@enduml
```

### **III.6.2 Communication Pattern Specification**

| **Connector**                                       | **COMET Communication Pattern**              | **Technology Mapping**                    | **Buffering**                                                                                                                                  | **Traceability**  |
| :-------------------------------------------------- | :------------------------------------------- | :---------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- | :---------------- |
| Student Client -> Check-in use case                 | Synchronous message communication with reply | React Native client sends HTTPS REST request | No queue; client retries only after receiving an error.                                                                                        | UC02, UC04        |
| Staff Web Portal -> Session use case                | Synchronous message communication with reply | React client sends HTTPS REST request     | No queue; command is idempotent by session state check.                                                                                        | UC05a, UC05b      |
| Check-in Component -> Code Cache                    | Synchronous message communication with reply | StackExchange.Redis client call           | No durable buffer; cache miss falls back to stored attendance-session state.                                                                   | UC02, UC04, NF-01 |
| Staff Web Portal -> Monitor use case                | Periodic synchronous message with reply      | HTTPS REST short polling every 5 seconds  | No event buffer; each response returns the latest roster snapshot or changes since the last poll.                                             | UC06, NF-01       |
| Reporting Component -> Report File Adapter          | Synchronous message communication with reply | ClosedXML server-side `.xlsx` generation  | No queue in MVP; report generation returns success or failure to lecturer.                                                                     | UC08              |

### **III.6.3 Polling Specification for Near-Real-Time Attendance Monitor**

### **Polling Endpoint: AttendanceMonitorSnapshot**

**Producer:** Monitoring Component.

**Consumer:** Staff Web Portal.

**COMET Communication Pattern:** Periodic synchronous message with reply.

**Technology Mapping:** ASP.NET Core REST endpoint polled by the React staff web portal every 5 seconds.

**Delivery:** Staff Web Portal sends `GET /api/sessions/{sessionId}/attendance-monitor?since={lastSeenAt}` while the monitor screen is open.

**Buffering:** No server-side event buffer. The backend reads the latest persisted attendance records; if `since` is absent or stale, it returns the full current roster snapshot.

**Payload:**

- `sessionId: Text` - scheduled session receiving the update.
- `serverTime: DateTime` - backend timestamp used as the next `since` value.
- `refreshAfterSeconds: Number` - expected polling interval, default 5 seconds.
- `rosterItems: List<AttendanceMonitorItem>` - current or changed student attendance rows.
- `AttendanceMonitorItem.studentId: Text` - roster student.
- `AttendanceMonitorItem.attendanceStatus: Text` - `Present`, `Late`, `Absent`, or not yet set.
- `AttendanceMonitorItem.checkedInAt: DateTime` - official check-in timestamp when available.
- `AttendanceMonitorItem.checkInMethod: Text` - `QR`, `PIN`, `Manual`, or empty when not yet checked in.

**Freshness:** Lecturer monitor may be delayed by up to 5 seconds.

**Failure Handling:** If a poll fails, the lecturer UI keeps the last successful snapshot and retries on the next 5-second interval. Official attendance results remain saved independently of monitor refresh.

**Traceability:** UC02, UC04, UC06; AttendanceCoordinator; NF-01.

---

## **III.7 Concurrent Task Architecture**

### **III.7.1 Active and Passive Classification**

| **Task/Object**               | **Active or Passive** | **Activation**                              | **Communication Pattern**                            | **Traceability** |
| :---------------------------- | :-------------------- | :------------------------------------------ | :--------------------------------------------------- | :--------------- |
| Student Interaction Task      | Active                | Event-driven by student actions             | Synchronous with reply                               | UC01-UC04        |
| Staff Interaction Task        | Active                | Event-driven by lecturer/admin actions      | Synchronous with reply and periodic polling          | UC05a-UC05b, UC06-UC08, UC09a-UC09d |
| Attendance Check-in Task      | Active                | Demand-driven by submitted check-in command | Synchronous with reply                               | UC02, UC04       |
| QR/PIN Refresh Task           | Active                | Periodic while attendance session is active | Writes active code to cache and session state        | UC05a, UC05b, BR-02 |
| Monitor Polling Task          | Active                | Periodic every 5 seconds while monitor is open | Synchronous request/reply                         | UC06, NF-01      |
| Report Generation Task        | Active                | Demand-driven by lecturer export request    | Synchronous with reply                               | UC08             |
| Domain entities and rules     | Passive               | Run on caller task                          | In-process calls                                     | All UC           |
| Repository and cache wrappers | Passive               | Run on caller task                          | Synchronous with reply                               | All UC           |

### **Task Interface Specification: Attendance Check-in Task**

**Task Type:** Active

**Activation:** Demand-driven

**Trigger:** Internal request from `CheckInEndpoint` after a student submits QR or PIN evidence.

**Provided Interface:** `processCheckIn(command: CheckInCommand): CheckInResult`

**Required Interface:** `IAttendanceCodeStore`, `IRepositoryOperations`

**Input Messages/Data:** `CheckInCommand` with student ID, session ID, submitted code or PIN, check-in method, identity evidence result, optional submitted location (informational; may be absent when GPS is unavailable), device identifier, device display name, and submission time.

**Output Messages/Data:** `CheckInResult` with accepted/rejected/blocked status, official attendance status when accepted, and user-visible reason when rejected.

**Communication Pattern:** Synchronous with reply to the student client. Lecturer monitor observes the saved result on the next polling interval.

**Technology Mapping:** HTTPS REST request/response.

**Buffering:** No command queue in MVP; monitor refresh uses persisted attendance state.

**Traceability:** UC02, UC04; AttendanceCoordinator; CheckInRules.

### **Task Behavior Specification: Attendance Check-in Task**

**Initial State:** Waiting for a check-in command.

**Behavior:**

1. Validate command ownership and required evidence.
2. Validate biometric or selfie proof through `IdentityEvidencePolicy`.
3. Read active QR/PIN code from `IAttendanceCodeStore`.
4. Validate code and session match through `AttendanceCodePolicy`.
5. Read configuration through repositories.
6. Classify Present/Late when accepted; store submitted location coordinates as evidence only.
7. Upsert the `AttendanceRecord` for `(StudentId, SessionId)`: save check-in evidence and official status when accepted, or record the latest rejection reason when rejected.
8. Return check-in result to the student client.

**Exception Behavior:** Expired code records the latest rejection reason. Missing or out-of-range location never blocks or rejects the check-in; it is recorded as informational evidence.

**Termination:** Ends after result is returned.

### **Task Interface Specification: QR/PIN Refresh Task**

**Task Type:** Active

**Activation:** Periodic

**Trigger:** Active attendance session started by lecturer.

**Provided Interface:** `startRefresh(sessionId)`, `stopRefresh(sessionId)`

**Required Interface:** `IAttendanceCodeStore`, `IRepositoryOperations`

**Input Messages/Data:** Session ID, QR refresh seconds, PIN refresh seconds.

**Output Messages/Data:** Active QR token, backup PIN, refreshed timestamps, countdown update.

**Communication Pattern:** Periodic internal update; staff portal reads the latest QR/PIN display state through polling.

**Technology Mapping:** ASP.NET Core hosted background service plus Redis cache write and HTTPS REST polling.

**Buffering:** Keep only latest QR/PIN value per active attendance session; older values expire based on configuration.

**Traceability:** UC05a, UC05b, BR-02, BR-12, NF-06.

### **Task Behavior Specification: QR/PIN Refresh Task**

**Initial State:** Idle for the selected study session.

**Behavior:**

1. Start when `SessionService.startAttendance` marks an attendance session active.
2. Read timing values from `Configuration`.
3. Generate a new QR token every configured QR refresh interval.
4. Generate a new backup PIN every configured PIN refresh interval.
5. Save latest values to cache and attendance-session state.
6. Store latest display value and countdown state for the staff portal polling endpoint.
7. Stop when lecturer finalizes the session.

**Exception Behavior:** If cache write fails, persist latest active value in attendance-session state and allow check-in validation to read from persistent state until cache recovers.

**Termination:** Stops when the attendance session is finalized.

**Concurrency Notes:** At most one refresh task is active per study session, enforced by AttendanceSessionRules and attendance-session state.

---

## **III.8 Detailed Class and Interface Specifications**

### **III.8.1 Core Interface Contracts**

### **AuthenticationService**

**Responsibility:** Confirm university identity and enforce role-specific access.

**Traceability:** UC01; AuthenticationCoordinator; BR-01.

| Operation         | Parameters                                                                        | Return                 | Precondition                                     | Postcondition                                                                                        | Invariant                                                  |
| :---------------- | :-------------------------------------------------------------------------------- | :--------------------- | :----------------------------------------------- | :--------------------------------------------------------------------------------------------------- | :--------------------------------------------------------- |
| `authenticate`    | `identityConfirmationRequest: IdentityConfirmationRequest`, `requestedRole: Role` | `AuthenticationResult` | User starts login and requested role is present. | University identity is confirmed, AFAS role profile is loaded, and role access is granted or denied. | A user can access only actions allowed by their AFAS role. |
| `authorizeAction` | `accountId: Text`, `action: Text`, `targetResource: Text`                         | `AuthorizationResult`  | Account is authenticated.                        | Access is granted only if role and ownership rules permit it.                                        | Authorization checks do not modify domain data.            |

### **CheckInService**

**Responsibility:** Coordinate QR/PIN check-in from evidence submission to attendance record upsert and official result creation.

**Traceability:** UC02, UC04, UC06; AttendanceCoordinator; CheckInRules; BR-02, BR-04, BR-05, BR-07, BR-12.

| Operation                   | Parameters                           | Return              | Precondition                                                                                                                          | Postcondition                                                                                                       | Invariant                                                                                                  |
| :-------------------------- | :----------------------------------- | :------------------ | :------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------ | :--------------------------------------------------------------------------------------------------------- |
| `processCheckIn`            | `command: CheckInCommand`            | `CheckInResult`     | Student is authenticated; active attendance session is expected; identity, device, and submitted code evidence are present. Location is optional (informational) and may be absent. | Saves the attendance record for the student and study session: saves evidence and official status when accepted, or records the latest rejection reason when rejected. | Official result status is only `Present`, `Late`, or `Absent`; a rejection is kept as `AttendanceRecord.RejectionReason`. |

### **SessionService**

**Responsibility:** Control attendance-session lifecycle and QR/PIN refresh task.

**Traceability:** UC05a, UC05b; AttendanceSessionControl; AttendanceSessionRules; BR-02, BR-08, BR-10, BR-12.

| Operation               | Parameters                            | Return                 | Precondition                                                                                                                                 | Postcondition                                                                                 | Invariant                                                    |
| :---------------------- | :------------------------------------ | :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------- | :----------------------------------------------------------- |
| `startAttendance`       | `lecturerId: Text`, `sessionId: Text` | `SessionCommandResult` | Lecturer is assigned to the class section; session is within allowed time window; no active attendance session exists for the study session. | Attendance session is active and QR/PIN refresh task starts.                                  | One study session has at most one active attendance session. |
| `finalizeAttendance`    | `lecturerId: Text`, `sessionId: Text` | `SessionCommandResult` | Attendance session is active; lecturer is assigned.                                                                                    | New QR/PIN check-ins are no longer accepted; students without Present/Late official result are assigned Absent; session becomes finalized. | Finalized results are the source for reports.                |

### **AdjustmentService**

**Responsibility:** Apply manual lecturer adjustments to official attendance results.

**Traceability:** UC07; AttendanceCoordinator; AttendanceSessionRules; BR-10, BR-13.

| Operation               | Parameters                                                                                    | Return             | Precondition                                                                                     | Postcondition                                                    | Invariant                                                                     |
| :---------------------- | :-------------------------------------------------------------------------------------------- | :----------------- | :----------------------------------------------------------------------------------------------- | :--------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| `adjustAttendance`      | `lecturerId: Text`, `sessionId: Text`, `studentId: Text`, `newStatus: AttendanceStatus`, `reason: Text` | `AdjustmentResult` | Lecturer is assigned; current date is the scheduled session date; reason is not empty; student is on the session roster. | Creates or updates the student's attendance record to the selected official status with `ResultSource = ManualAdjustment`. | Manual adjustment changes only the single attendance record for `(StudentId, SessionId)`. |

### **ReportService**

**Responsibility:** Prepare finalized attendance report content and delegate file generation.

**Traceability:** UC08; AttendanceCoordinator; AttendanceSessionRules; BR-08.

| Operation                | Parameters                                                   | Return             | Precondition                                              | Postcondition                                         | Invariant                                    |
| :----------------------- | :----------------------------------------------------------- | :----------------- | :-------------------------------------------------------- | :---------------------------------------------------- | :------------------------------------------- |
| `exportAttendanceReport` | `lecturerId: Text`, `classSectionId: Text`, `semester: Text` | `ReportFileResult` | Lecturer is assigned; finalized attendance results exist. | Returns generated report file or empty-state failure. | Reports use finalized official results only. |

### **III.8.2 Repository and Wrapper Contracts**

### **IAttendanceCodeStore**

**Responsibility:** Store and retrieve short-lived active QR/PIN values.

**Traceability:** UC02, UC04, UC05a; BR-02, BR-12; NF-01.

| Operation        | Parameters                                                                                                   | Return        | Precondition                                        | Postcondition                                                    | Invariant                                                                           |
| :--------------- | :----------------------------------------------------------------------------------------------------------- | :------------ | :-------------------------------------------------- | :--------------------------------------------------------------- | :---------------------------------------------------------------------------------- |
| `getActiveCode`  | `sessionId: Text`, `method: CheckInMethod`                                                                   | `ActiveCode?` | Session ID and method are present.                  | Returns current active code with refresh timestamp, or no value. | Store keeps only short-lived active values.                                         |
| `saveActiveCode` | `sessionId: Text`, `method: CheckInMethod`, `code: Text`, `refreshedAt: DateTime`, `validitySeconds: Number` | `SaveResult`  | Attendance session is active; validity is positive. | Latest active code is available until expiry.                    | Older active values must expire and must not be accepted after the validity window. |

### **IRepositoryOperations**

**Responsibility:** Provide database wrapper operations for domain entities.

**Traceability:** Section II.1.1; UC01-UC04, UC05a-UC05b, UC06-UC08, UC09a-UC09d.

| Operation                        | Parameters                 | Return       | Precondition                                                            | Postcondition                                                       | Invariant                                                                      |
| :------------------------------- | :------------------------- | :----------- | :---------------------------------------------------------------------- | :------------------------------------------------------------------ | :----------------------------------------------------------------------------- |
| `findAccount`                    | `identity: Text`           | `Account?`   | Identity is present.                                                    | Returns account or not found.                                       | Repository hides physical database details from domain and application layers. |
| `saveAttendanceRecord`           | `record: AttendanceRecord` | `SaveResult` | Record has student and study session; official status, evidence, or rejection reason are set as applicable. | The attendance record for the student and study session is inserted or updated. | Repository hides physical database details from domain and application layers. |

### **III.8.3 Detailed Class Diagram**

The detailed class diagram refines the service contracts above into classes with private attributes and public operations. Attributes show the main collaborators each class owns; operation signatures match the interface contracts and use camelCase design messages.

#### **Figure III-6 Detailed Class Diagram for Core Design Classes**

```plantuml
@startuml
skinparam style strictuml
hide circle
skinparam classAttributeIconSize 0
skinparam linetype ortho

class "AuthenticationService\n«service»" as AuthenticationService {
  -repository: IRepositoryOperations
  -identityAdapter: UniversityIdentityAdapter
  +authenticate(identityConfirmationRequest: IdentityConfirmationRequest, requestedRole: Role): AuthenticationResult
  +authorizeAction(accountId: Text, action: Text, targetResource: Text): AuthorizationResult
}

class "CheckInService\n«service»" as CheckInService {
  -repository: IRepositoryOperations
  -codeStore: IAttendanceCodeStore
  -identityEvidencePolicy: IdentityEvidencePolicy
  -attendanceStatusPolicy: AttendanceStatusPolicy
  +processCheckIn(command: CheckInCommand): CheckInResult
}

class "SessionService\n«state dependent control»" as SessionService {
  -repository: IRepositoryOperations
  -codeStore: IAttendanceCodeStore
  -refreshTask: QrPinRefreshTask
  +startAttendance(lecturerId: Text, sessionId: Text): SessionCommandResult
  +finalizeAttendance(lecturerId: Text, sessionId: Text): SessionCommandResult
}

class "MonitorService\n«service»" as MonitorService {
  -repository: IRepositoryOperations
  +getAttendanceMonitorSnapshot(sessionId: Text, since: DateTime): AttendanceMonitorSnapshot
}

class "AdjustmentService\n«service»" as AdjustmentService {
  -repository: IRepositoryOperations
  +adjustAttendance(lecturerId: Text, sessionId: Text, studentId: Text, newStatus: AttendanceStatus, reason: Text): AdjustmentResult
}

class "ReportService\n«service»" as ReportService {
  -repository: IRepositoryOperations
  -fileWriter: IReportFileWriter
  +exportAttendanceReport(lecturerId: Text, classSectionId: Text, semester: Text): ReportFileResult
}

class "AdminService\n«service»" as AdminService {
  -repository: IRepositoryOperations
  +manageUserAccount(command: AccountCommand): AdminCommandResult
  +manageAcademicCatalog(command: CatalogCommand): AdminCommandResult
  +manageClassRoster(command: RosterCommand): AdminCommandResult
  +scheduleClassSession(command: ScheduleCommand): AdminCommandResult
}

class "AttendanceRecord\n«data abstraction»" as AttendanceRecord {
  -attendanceRecordId: Text
  -studentId: Text
  -sessionId: Text
  -attendanceStatus: AttendanceStatus
  -resultSource: ResultSource
  -rejectionReason: Text
  +markAccepted(method: CheckInMethod, submittedAt: DateTime): void
  +recordRejection(reason: Text): void
  +applyManualAdjustment(newStatus: AttendanceStatus, reason: Text): void
}

class "AttendanceSession\n«data abstraction»" as AttendanceSession {
  -sessionId: Text
  -dynamicToken: Text
  -pinCode: Text
  -sessionStatus: SessionStatus
  +start(): void
  +refreshCode(method: CheckInMethod, code: Text, refreshedAt: DateTime): void
  +finalize(): void
}

class "Configuration\n«data abstraction»" as Configuration {
  -configurationCode: Text
  -qrRefreshSeconds: Number
  -pinRefreshSeconds: Number
  -lateThresholdMinutes: Number
  -campusBoundary: Text
  +getCodeValidity(method: CheckInMethod): Number
}

class "IRepositoryOperations\n«interface»" as IRepositoryOperations
class "IAttendanceCodeStore\n«interface»" as IAttendanceCodeStore
class "IReportFileWriter\n«interface»" as IReportFileWriter
class "UniversityIdentityAdapter\n«external system wrapper»" as UniversityIdentityAdapter
class "QrPinRefreshTask\n«active task»" as QrPinRefreshTask
class "AttendanceStatusPolicy\n«policy»" as AttendanceStatusPolicy
class "IdentityEvidencePolicy\n«policy»" as IdentityEvidencePolicy

AuthenticationService --> IRepositoryOperations
AuthenticationService --> UniversityIdentityAdapter
CheckInService --> IRepositoryOperations
CheckInService --> IAttendanceCodeStore
CheckInService --> IdentityEvidencePolicy
CheckInService --> AttendanceStatusPolicy
SessionService --> IRepositoryOperations
SessionService --> IAttendanceCodeStore
SessionService --> QrPinRefreshTask
MonitorService --> IRepositoryOperations
AdjustmentService --> IRepositoryOperations
ReportService --> IRepositoryOperations
ReportService --> IReportFileWriter
AdminService --> IRepositoryOperations
IRepositoryOperations --> AttendanceRecord
IRepositoryOperations --> AttendanceSession
IRepositoryOperations --> Configuration
AttendanceStatusPolicy --> Configuration
@enduml
```

Detailed class invariants:

- `AttendanceRecord` keeps one official row per `(StudentId, SessionId)` and never uses `Rejected` as an official attendance status.
- `AttendanceSession` allows only `NotStarted -> Active -> Finalized`; QR/PIN refresh stops after finalization.
- `Configuration` owns refresh and Late threshold values so attendance timing changes do not require code changes.

---

## **III.9 Design Patterns**

### **Pattern: Strategy**

**Context:** Attendance status (Present/Late) classification.

**Problem Solved:** Status threshold rules may change when Late threshold policies change.

**Design Elements:** `AttendanceStatusPolicy`, `Configuration`.

**Quality Attribute Impact:** Improves modifiability and testability for NF-06.

**Trade-off:** Adds small indirection around simple calculations.

**Traceability:** UC02, UC04; BR-12; NF-06.

### **Pattern: Adapter**

**Context:** Database, cache, monitor polling, report file generation, and mobile device evidence access.

**Problem Solved:** Technical dependencies should not leak into domain rules or application services.

**Design Elements:** Repository Adapters `«database wrapper»`, `AttendanceCodeCacheAdapter`, `MonitorEndpoint`, `ReportFileAdapter`, `MobileDeviceEvidenceAdapter`.

**Quality Attribute Impact:** Improves modifiability, testability, and replaceability of infrastructure.

**Trade-off:** Requires interface definitions and adapter implementations.

**Traceability:** UC02, UC04-UC08; NF-01, NF-04, NF-06.

### **Pattern: Polling**

**Context:** Lecturer near-real-time monitor after accepted check-ins.

**Problem Solved:** Attendance processing should not maintain a persistent connection to each open lecturer UI instance.

**Design Elements:** `AttendanceMonitorSnapshot`, `MonitorEndpoint`, `MonitorService`, Staff Web Portal polling client.

**Quality Attribute Impact:** Supports near-real-time visibility under NF-01 with simpler deployment.

**Trade-off:** Lecturer view may be delayed by up to 5 seconds and repeated polling adds predictable read traffic.

**Traceability:** UC06, NF-01.

### **Pattern: Facade**

**Context:** Presentation Boundary endpoints exposed to client applications.

**Problem Solved:** Clients need stable use-case entry points without knowing internal modules and wrappers.

**Design Elements:** `AuthEndpoint`, `CheckInEndpoint`, `SessionEndpoint`, `MonitorEndpoint`, `AdminEndpoint`, `ReportEndpoint`.

**Quality Attribute Impact:** Improves usability, maintainability, and client decoupling.

**Trade-off:** Adds a mapping layer between transport requests and application commands.

**Traceability:** UC01-UC04, UC05a-UC05b, UC06-UC08, UC09a-UC09d.

---

## **III.10 Persistence Design**

The persistence model maps the analysis entity class diagram in Figure II-1 to a relational schema. Design names preserve Phase 2 entity meaning while converting attributes to table columns and constraints.

### **III.10.1 Relational Database Schema**

#### **Figure III-7 Relational Database Schema / Physical Data Model**

```plantuml
@startuml
skinparam style strictuml
hide circle
skinparam classAttributeIconSize 0
skinparam linetype ortho

class "accounts" as accounts <<table>> {
  +id: text <<PK>>
  university_identity_code: text <<unique>>
  email: text
  full_name: text
  role: text
  registration_date: timestamp
}

class "students" as students <<table>> {
  +student_id: text <<PK>>
  account_id: text <<FK>>
}

class "lecturers" as lecturers <<table>> {
  +lecturer_id: text <<PK>>
  account_id: text <<FK>>
  department_name: text
}

class "rooms" as rooms <<table>> {
  +room_id: text <<PK>>
  room_name: text
  latitude: decimal
  longitude: decimal
}

class "subjects" as subjects <<table>> {
  +subject_code: text <<PK>>
  subject_name: text
  credits: integer
}

class "class_sections" as class_sections <<table>> {
  +class_section_id: text <<PK>>
  subject_code: text <<FK>>
  lecturer_id: text <<FK>>
  class_section_name: text
  semester: text
}

class "class_section_students" as class_section_students <<table>> {
  +class_section_id: text <<PK, FK>>
  +student_id: text <<PK, FK>>
}

class "sessions" as sessions <<table>> {
  +session_id: text <<PK>>
  class_section_id: text <<FK>>
  room_id: text <<FK>>
  session_date: date
  start_time: time
  end_time: time
}

class "configurations" as configurations <<table>> {
  +configuration_code: text <<PK>>
  qr_refresh_seconds: integer
  pin_refresh_seconds: integer
  late_threshold_minutes: integer
  campus_boundary: text
}

class "attendance_sessions" as attendance_sessions <<table>> {
  +session_id: text <<PK, FK>>
  dynamic_token: text
  qr_refreshed_at: timestamp
  pin_code: text
  pin_refreshed_at: timestamp
  session_status: text
}

class "attendance_records" as attendance_records <<table>> {
  +attendance_record_id: text <<PK>>
  student_id: text <<FK>>
  session_id: text <<FK>>
  check_in_method: text
  submitted_at: timestamp
  submitted_latitude: decimal
  submitted_longitude: decimal
  location_accuracy_meters: decimal
  device_identifier: text
  device_display_name: text
  face_evidence_reference: text
  attendance_status: text
  result_source: text
  rejection_reason: text
  finalized_at: timestamp
}

accounts "1" -- "0..1" students : account_id
accounts "1" -- "0..1" lecturers : account_id
subjects "1" -- "0..*" class_sections : subject_code
lecturers "1" -- "0..*" class_sections : lecturer_id
class_sections "1" -- "0..*" class_section_students : class_section_id
students "1" -- "0..*" class_section_students : student_id
class_sections "1" -- "0..*" sessions : class_section_id
rooms "1" -- "0..*" sessions : room_id
sessions "1" -- "0..1" attendance_sessions : session_id
sessions "1" -- "0..*" attendance_records : session_id
students "1" -- "0..*" attendance_records : student_id
configurations "1" -- "0..*" attendance_sessions : timing configuration
@enduml
```

Physical schema constraints:

- `attendance_records` has a unique constraint on `(student_id, session_id)` to preserve one attendance result per roster student per scheduled session.
- `attendance_status` is limited to `Present`, `Late`, and `Absent` for official outcomes; rejected submissions update `rejection_reason`.
- Location columns are nullable and informational only; no relational constraint uses location to accept or reject check-in.

### **III.10.2 Table Mapping**

| **Table**                   | **Primary Key**                  | **Important Columns**                                                                                                                                                                                                                                                                              | **Key Constraints / Traceability**                                                                                    |
| :-------------------------- | :------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| `accounts`                  | `id`                             | `university_identity_code`, `email`, `full_name`, `role`, `registration_date`                                                                                                                                                                                                                      | Unique `university_identity_code`; UC01, UC09a, BR-01, BR-11                                                          |
| `students`                  | `student_id`                     | `account_id`                                                                                                                                                                                                                                                                                       | FK to `accounts`; UC01, UC03, UC09a                                                                                   |
| `lecturers`                 | `lecturer_id`                    | `account_id`, `department_name`                                                                                                                                                                                                                                                                    | FK to `accounts`; UC01, UC05a-UC05b, UC06-UC09d                                                                       |
| `rooms`                     | `room_id`                        | `room_name`, `latitude`, `longitude`                                                                                                                                                                                                                                                               | UC02, UC04, BR-03                                                                                                    |
| `subjects`                  | `subject_code`                   | `subject_name`, `credits`                                                                                                                                                                                                                                                                          | `credits > 0`; UC09b, BR-11                                                                                           |
| `class_sections`            | `class_section_id`               | `class_section_name`, `subject_code`, `lecturer_id`, `semester`                                                                                                                                                                                                                                    | FK to subject and lecturer; UC05a-UC05b, UC06-UC09d                                                                   |
| `class_section_students`    | `(class_section_id, student_id)` | none beyond keys                                                                                                                                                                                                                                                                                   | Composite PK prevents duplicate enrollment; UC03, UC05a, UC06, UC08, UC09c                                            |
| `sessions`                  | `session_id`                     | `class_section_id`, `room_id`, `session_date`, `start_time`, `end_time`                                                                                                                                                                                                                            | FK to class section and room; UC05a, UC09d                                                                            |
| `configurations` | `configuration_code`             | `qr_refresh_seconds`, `pin_refresh_seconds`, `late_threshold_minutes`, `campus_boundary`                                                                                                                                                                                                           | Attendance parameters are configurable; campus boundary is reference information for location evidence; NF-06          |
| `attendance_sessions`       | `session_id`                     | `dynamic_token`, `qr_refreshed_at`, `pin_code`, `pin_refreshed_at`, `session_status`                                                                                                                                                                                                               | One attendance session per scheduled session; UC05a, UC05b, BR-02, BR-10                                              |
| `attendance_records`        | `attendance_record_id`           | `student_id`, `session_id`, `check_in_method` (nullable), `submitted_at` (nullable), `submitted_latitude` (nullable), `submitted_longitude` (nullable), `location_accuracy_meters` (nullable), `device_identifier` (nullable), `device_display_name` (nullable), `face_evidence_reference` (nullable), `attendance_status` (nullable until set), `result_source`, `rejection_reason` (nullable), `finalized_at` (nullable) | Unique `(student_id, session_id)`; location columns are nullable and informational only (no distance computed) and never drive the result; `attendance_status` limited to `Present`, `Late`, `Absent`; UC02, UC04, UC05a, UC05b, UC07, UC08 |

### **III.10.3 Database Wrapper Classes**

#### **Figure III-8 Database Wrapper Classes**

```plantuml
@startuml
skinparam style strictuml

class "CheckInService\n«coordinator»" as CheckInService
class "SessionService\n«state dependent control»" as SessionService
class "ReportService\n«coordinator»" as ReportService
class "AdjustmentService\n«coordinator»" as AdjustmentService

class "AttendanceRecord\n«data abstraction»" as AttendanceRecord
class "AttendanceSession\n«data abstraction»" as AttendanceSession
class "Room\n«data abstraction»" as Room
class "AttendanceRecordRepository\n«database wrapper»" as AttendanceRecordRepo {
  +findByStudentAndSession(studentId: Text, sessionId: Text): AttendanceRecord
  +findBySession(sessionId: Text): List<AttendanceRecord>
  +save(record: AttendanceRecord): SaveResult
}

class "AttendanceSessionRepository\n«database wrapper»" as SessionRepo {
  +findBySession(sessionId: Text): AttendanceSession
  +save(session: AttendanceSession): SaveResult
}

class "RoomRepository\n«database wrapper»" as RoomRepo {
  +findBySession(sessionId: Text): Room
  +updateLocation(room: Room): SaveResult
}

CheckInService --> AttendanceRecordRepo
CheckInService --> RoomRepo
SessionService --> SessionRepo
ReportService --> AttendanceRecordRepo
AdjustmentService --> AttendanceRecordRepo
AttendanceRecordRepo --> AttendanceRecord
SessionRepo --> AttendanceSession
RoomRepo --> Room
@enduml
```

---

## **III.11 Quality Attribute Trade-offs**

| **Quality Attribute** | **Architectural Mechanism**                                                                               | **Design Evidence**                                                             | **Trade-off**                                              | **Traceability**               |
| :-------------------- | :-------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------ | :--------------------------------------------------------- | :----------------------------- |
| Performance           | Cache active QR/PIN values and keep backend application services stateless.                               | `AttendanceCodeCacheAdapter`, `IAttendanceCodeStore`, QR/PIN Refresh Task.      | Cache consistency and fallback handling must be designed.  | UC02, UC04, UC05a, UC05b; NF-01 |
| Scalability           | Modular monolith can scale by adding application server instances while keeping one persistence boundary. | Deployment view and stateless check-in service.                                 | Does not provide independent module deployment.            | NF-07                          |
| Accuracy              | Captured location coordinates are stored as reference only.             | `attendance_records.submitted_latitude/longitude`.                            | Location is informational only, so GPS error never affects the check-in result. | UC02, UC04; NF-02, BR-03       |
| Security and privacy  | Role authorization and protected evidence reference.                                                      | `AuthenticationService`, `AdjustmentService`, face evidence reference.          | More validation and storage policy rules are required.     | UC01, UC02, UC04, UC07; NF-04  |
| Modifiability         | Layered modules, adapter pattern, strategy pattern, configurable parameters.                              | Component diagram, interface contracts, `configurations`.            | More interfaces than a direct CRUD design.                 | NF-06                          |
| Testability           | Domain rules and wrappers are behind interfaces.                                                          | `IRepositoryOperations`, `IAttendanceCodeStore`, policies and strategies.       | Requires mocks or fakes in tests.                          | UC02-UC04, UC05a-UC05b, UC06-UC08, UC09a-UC09d |
| Traceability          | UC labels in integrated communication and tables.                                                         | Figure III-1 and traceability matrix.                                           | Documentation must be maintained when requirements change. | UC01-UC04, UC05a-UC05b, UC06-UC08, UC09a-UC09d |

---

## **III.12 Design Traceability Matrix**

| **Requirement / UC**                  | **Actor**                                            | **Analysis Objects**                                                                                                                                                  | **Design Elements**                                                                                                                                | **Design Diagrams / Contracts**                                   |
| :------------------------------------ | :--------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------- |
| UC01 Authenticate User                | Student, Lecturer, Admin, University Identity System | StudentInterface, LecturerInterface, AdminInterface, IdentitySystemProxy, AuthenticationCoordinator, AuthenticationRules, Account                                      | Access and Profile Management, AuthenticationService, UniversityIdentityAdapter, AuthEndpoint, Account repository                                  | Figures III-1, III-2, III-3, III-5, III-6; AuthenticationService contract |
| UC02 Check In via Dynamic QR Code     | Student, Mobile Device Hardware                      | StudentInterface, LecturerInterface, MobileDeviceInterface, AttendanceCoordinator, CheckInRules, Configuration, AttendanceSession, Session, AttendanceRecord           | Student Client, Device Evidence Access, Attendance Management, Code Cache, Repository Adapters, monitor polling read model                         | Figures III-1, III-2, III-3, III-5, III-6, III-7, III-8; CheckInService, IAttendanceCodeStore |
| UC03 View Personal Attendance History | Student                                              | StudentInterface, AttendanceCoordinator, AuthenticationRules, AttendanceSessionRules, ClassSectionStudent, ClassSection, AttendanceRecord                              | Student Client, Presentation Boundary, repository read operations                                                                                  | Figures III-1, III-2, III-3, III-5, III-7 |
| UC04 Check In via PIN                 | Student, Mobile Device Hardware                      | StudentInterface, LecturerInterface, MobileDeviceInterface, AttendanceCoordinator, CheckInRules, Configuration, AttendanceSession, Session, AttendanceRecord           | Attendance Management with `checkInMethod = PIN` and PIN refresh values                                                                            | Figures III-1, III-2, III-3, III-5, III-6, III-7, III-8; CheckInService, QR/PIN Refresh Task |
| UC05a Start Attendance Session        | Lecturer                                             | LecturerInterface, AttendanceSessionControl, AttendanceSessionRules, Configuration, Session, ClassSectionStudent, AttendanceSession, AttendanceRecord                  | Staff Web Client, Attendance Management, SessionService, QR/PIN Refresh Task, Code Cache                                                           | Figures III-1, III-2, III-3, III-5, III-6, III-7, III-8; SessionService contract |
| UC05b Finalize Attendance Session     | Lecturer                                             | LecturerInterface, AttendanceSessionControl, AttendanceSessionRules, ClassSectionStudent, AttendanceSession, AttendanceRecord                                          | Staff Web Client, Attendance Management, SessionService, Repository Adapters                                                                        | Figures III-1, III-2, III-3, III-5, III-6, III-7, III-8; SessionService contract |
| UC06 Monitor Attendance in Real Time  | Lecturer                                             | LecturerInterface, AttendanceCoordinator, AttendanceSessionRules, AttendanceSession, ClassSectionStudent, AttendanceRecord                                             | Attendance Management, MonitorEndpoint, AttendanceMonitorSnapshot                                                                                   | Figures III-1, III-2, III-3, III-5, III-6; polling specification |
| UC07 Adjust Attendance Manually       | Lecturer                                             | LecturerInterface, AttendanceCoordinator, AttendanceSessionRules, Session, ClassSectionStudent, AttendanceRecord                                                       | Attendance Management, AdjustmentService, Repository Adapters                                                                                       | Figures III-1, III-2, III-3, III-5, III-6, III-7, III-8; AdjustmentService contract |
| UC08 Export Attendance Report         | Lecturer                                             | LecturerInterface, AttendanceCoordinator, AttendanceSessionRules, ClassSectionStudent, Session, AttendanceRecord                                                       | Reporting subsystem, ReportService, ReportFileAdapter                                                                                              | Figures III-1, III-2, III-3, III-5, III-6; ReportService contract |
| UC09a Manage User Accounts            | Admin                                                | AdminInterface, AccountManagementCoordinator, AccountManagementRules, Account, Student, Lecturer                                                                      | Administrative Management, AdminService, Account repository                                                                                         | Figures III-1, III-2, III-3, III-5, III-6, III-7; AdminService contract |
| UC09b Manage Academic Catalog         | Admin                                                | AdminInterface, AcademicCatalogCoordinator, AcademicCatalogRules, Subject, ClassSection, Lecturer                                                                     | Administrative Management, AdminService, Subject and ClassSection repositories                                                                      | Figures III-1, III-2, III-3, III-5, III-6, III-7; AdminService contract |
| UC09c Manage Class Roster             | Admin                                                | AdminInterface, ClassRosterCoordinator, ClassRosterRules, ClassSectionStudent, Student                                                                                | Administrative Management, AdminService, ClassSectionStudent repository                                                                             | Figures III-1, III-2, III-3, III-5, III-6, III-7; AdminService contract |
| UC09d Schedule Class Sessions         | Admin                                                | AdminInterface, SessionSchedulingCoordinator, SessionSchedulingRules, Session, Room, ClassSection                                                                     | Administrative Management, AdminService, Session and Room repositories                                                                              | Figures III-1, III-2, III-3, III-5, III-6, III-7; AdminService contract |
| NF-01 Performance and concurrency     | Student, Lecturer                                    | CheckInRules, AttendanceCoordinator, AttendanceSession                                                                                                                | Attendance Management, Attendance Code Cache, QR/PIN Refresh Task, Monitor polling endpoint                                                        | Figures III-3, III-4, III-5; TIS/TBS |
| NF-06 Configurability                 | Student, Lecturer                                    | Configuration, CheckInRules, AttendanceSessionRules                                                                                                                  | `configurations`, SessionService, policy classes                                                                                                   | Figures III-1, III-2, III-6, III-7; persistence mapping |

---

## **III.13 Design Validation Checklist**

| **Check item**                                                                                | **Status** | **Evidence**                                                                                                                                                                                                            |
| :-------------------------------------------------------------------------------------------- | :--------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Integrated communication diagram is produced before subsystem partitioning.                   | Pass       | Section III.2 precedes Section III.3.                                                                                                                                                                                   |
| Design elements trace backward to analysis objects and use cases.                             | Pass       | Figure III-1, Section III.2.1, Section III.12.                                                                                                                                                                          |
| Subsystems use COMET subsystem stereotypes.                                                   | Pass       | Figure III-2.                                                                                                                                                                                                           |
| Architecture complexity is justified by NFRs.                                                 | Pass       | Section III.1 and Section III.11 justify cache and 5-second monitor polling using NF-01/NF-07.                                                                                                             |
| COMET communication patterns are selected before or with technology mapping.                  | Pass       | Section III.6.2 and deployment connectors.                                                                                                                                                                              |
| Active/passive tasks are explicit and active tasks include TIS/TBS.                           | Pass       | Section III.7.                                                                                                                                                                                                          |
| Near-real-time monitor polling defines refresh interval, payload, and failure handling.       | Pass       | Section III.6.3.                                                                                                                                                                                                        |
| Interfaces include operation, parameters, return, precondition, postcondition, and invariant. | Pass       | Section III.8.                                                                                                                                                                                                          |
| Detailed class diagram includes attributes, operations, and design-level collaborators.       | Pass       | Figure III-6.                                                                                                                                                                                                           |
| Database and technical dependencies are isolated through wrappers.                            | Pass       | Figures III-2, III-5, and Section III.10.3.                                                                                                                                                                             |
| Relational schema defines primary keys, foreign keys, and physical constraints.               | Pass       | Figure III-7 and Section III.10.2.                                                                                                                                                                                      |
| Persistence mapping preserves Phase 2 entity names and business meanings.                     | Pass       | Section III.10 maps all entity classes from Figure II-1.                                                                                                                                                                |
| Official attendance result does not use rejected status.                                      | Pass       | CheckInService invariant and `attendance_records` constraints.                                                                                                                                                          |
| Unsupported older design items are removed.                                                   | Pass       | Authentication uses the existing University Identity System, attendance lifecycle uses Phase 2 `AttendanceSession`, device identifier is evidence only, and location coordinates are captured as evidence only with no distance computed (informational; it does not gate check-in). |
