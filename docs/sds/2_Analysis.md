## **II. Analysis models**

This section realizes the AFAS requirements from Section I through COMET analysis objects. The source requirements are the 10 use cases UC01-UC10 and business rules BR-01-BR-14 in [1_Requirement.md](1_Requirement.md). No solution-domain technical decisions are introduced in this phase.

---

## **II.1 Static analysis models**

### **II.1.1 Entity class diagram**

The following entity classes are derived from the Data Requirements in Section I.8 and the configurability requirement in NF-06, and are used by the interaction diagrams in Section II.2.

#### **Figure II-1 Entity class diagram for AFAS**

```plantuml
@startuml
skinparam style strictuml
hide circle

class "Account" as Account <<entity>> {
  Id
  UniversityIdentityCode
  Email
  FullName
  Role
  RegistrationDate
}

class "Student" as Student <<entity>> {
  StudentId
  AccountId
}

class "Lecturer" as Lecturer <<entity>> {
  LecturerId
  AccountId
  DepartmentName
}

class "Room" as Room <<entity>> {
  RoomId
  RoomName
  Latitude
  Longitude
  AllowedRadius
}

class "CampusBoundary" as CampusBoundary <<entity>> {
  CampusBoundaryCode
  BoundaryCoordinates
}

class "Subject" as Subject <<entity>> {
  SubjectCode
  SubjectName
  Credits
}

class "ClassSection" as ClassSection <<entity>> {
  ClassSectionId
  ClassSectionName
  SubjectCode
  LecturerId
  Semester
}

class "ClassSectionStudent" as ClassSectionStudent <<entity>> {
  ClassSectionId
  StudentId
}

class "Session" as Session <<entity>> {
  SessionId
  ClassSectionId
  RoomId
  SessionDate
  StartTime
  EndTime
}

class "AttendanceSession" as AttendanceSession <<entity>> {
  SessionId
  DynamicToken
  QRRefreshedAt
  PINCode
  PINRefreshedAt
  SessionStatus
}

class "AttendanceConfiguration" as AttendanceConfig <<entity>> {
  QRRefreshSeconds
  QRValiditySeconds
  PINRefreshSeconds
  LateThresholdMinutes
  DefaultAllowedRadius
}

class "CheckInAttempt" as CheckInAttempt <<entity>> {
  CheckInAttemptId
  StudentId
  SessionId
  SubmittedAt
  SubmittedLatitude
  SubmittedLongitude
  LocationAccuracyMeters
  DistanceFromRoom
  LocationCheckResult
  DeviceIdentifier
  DeviceDisplayName
  FaceEvidenceReference
  CheckInMethod
  AttemptStatus
  RejectionReason
}

class "AttendanceRecord" as AttendanceRecord <<entity>> {
  AttendanceRecordId
  StudentId
  SessionId
  AttendanceStatus
  ResultSource
  SourceCheckInAttemptId
  FinalizedAt
}

Account "1" -- "0..1" Student
Account "1" -- "0..1" Lecturer
CampusBoundary "1" -- "0..*" Room : contains valid room locations
Lecturer "1" -- "0..*" ClassSection
Subject "1" -- "0..*" ClassSection
ClassSection "1" -- "0..*" ClassSectionStudent
Student "1" -- "0..*" ClassSectionStudent
ClassSection "1" *-- "0..*" Session
Room "1" -- "0..*" Session
Session "1" *-- "0..1" AttendanceSession
Session "1" *-- "0..*" CheckInAttempt
Student "1" -- "0..*" CheckInAttempt
Session "1" *-- "0..*" AttendanceRecord
Student "1" -- "0..*" AttendanceRecord
CheckInAttempt "0..1" -- "0..1" AttendanceRecord : source attempt
AttendanceConfiguration "1" -- "0..*" AttendanceSession : configures timing
AttendanceConfiguration "1" -- "0..*" Room : default radius source
@enduml
```

`AttendanceRecord.AttendanceStatus` represents only official attendance outcomes: `Present`, `Late`, or `Absent`. Rejected submissions remain in `CheckInAttempt.AttemptStatus`. `CheckInAttempt.CheckInMethod` represents only student check-in methods: `QR` or `PIN`; manual changes are represented by `AttendanceRecord.ResultSource`.

Additional static constraints:

- `AttendanceRecord` has at most one official result for each `{StudentId, SessionId}` pair, supporting BR-06.
- A check-in attempt is valid for official attendance only when the student belongs to `ClassSectionStudent` for the target `Session` class section, supporting BR-14.
- `Account` is associated with either `Student` or `Lecturer` according to `Role`; administrative accounts have no student or lecturer mapping.

### **II.1.2 Contextual interface-control class diagram**

This view is intentionally limited to system entry points and the control objects that coordinate actor requests. It does not expand business logic, algorithm, or entity objects; entity structure is shown in Figure II-1, and use-case behavior is shown in the separate interaction diagrams in Section II.2. Interface objects do not directly manipulate entity objects.

#### **Figure II-2 Contextual interface-control class diagram for AFAS**

```plantuml
@startuml
skinparam style strictuml
hide circle

class "Student" as Student <<actor>>
class "Lecturer" as Lecturer <<actor>>
class "Admin" as Admin <<actor>>
class "Mobile Device Hardware" as MobileHardware <<actor>>
class "University Identity System" as UIS <<external system>>

class "Student Mobile Interface" as StudentUI <<user interaction>>
class "Lecturer Web Interface" as LecturerUI <<user interaction>>
class "Admin Web Interface" as AdminUI <<user interaction>>
class "Mobile Device Sensor Interface" as MobileSensor <<device I/O>>
class "University Identity System Interface" as UISInterface <<external system interface>>

class "Authentication Control" as AuthControl <<coordinator>>
class "Check-in Control" as CheckInControl <<coordinator>>
class "Session Control" as SessionControl <<state dependent control>>
class "Attendance History Control" as HistoryControl <<coordinator>>
class "Monitor Control" as MonitorControl <<coordinator>>
class "Adjustment Control" as AdjustmentControl <<coordinator>>
class "Report Control" as ReportControl <<coordinator>>
class "Catalog Control" as CatalogControl <<coordinator>>
class "Room Configuration Control" as RoomControl <<coordinator>>

Student --> StudentUI
Lecturer --> LecturerUI
Admin --> AdminUI
MobileHardware --> MobileSensor
UIS --> UISInterface

StudentUI --> AuthControl
StudentUI --> CheckInControl
StudentUI --> HistoryControl
LecturerUI --> AuthControl
LecturerUI --> SessionControl
LecturerUI --> MonitorControl
LecturerUI --> AdjustmentControl
LecturerUI --> ReportControl
AdminUI --> AuthControl
AdminUI --> CatalogControl
AdminUI --> RoomControl

AuthControl --> UISInterface
CheckInControl --> MobileSensor
RoomControl --> MobileSensor
@enduml
```

### **II.1.3 Object structuring criteria**

The object structuring hierarchy below groups analysis objects by COMET responsibilities and supports traceability from the interaction diagrams.

```plantuml
@startwbs
* AFAS Analysis Objects
** Interface Objects
*** User Interaction
**** Role-specific Access Interface
**** Student Mobile Interface
**** Lecturer Web Interface
**** Admin Web Interface
*** External System Interface
**** University Identity System Interface
*** External I/O Interface
**** Mobile Device Sensor Interface
** Control Objects
*** Coordinator Objects
**** Authentication Control
**** Check-in Control
**** Attendance History Control
**** Monitor Control
**** Adjustment Control
**** Report Control
**** Catalog Control
**** Room Configuration Control
*** State-dependent Control Objects
**** Session Control
** Application Logic Objects
*** Business Logic
**** Authentication Rules
**** Attendance Code Rules
**** Identity Evidence Rules
**** Session Rules
**** Report Eligibility Rules
**** Catalog Uniqueness Rules
**** Room Location Setting Rules
**** Attendance Status Calculation
*** Algorithm
**** Location Distance Calculation
** Entity Objects
*** User and Academic Entities
**** Account
**** Student
**** Lecturer
**** CampusBoundary
**** Room
**** Subject
**** ClassSection
**** ClassSectionStudent
**** Session
*** Attendance Entities
**** AttendanceConfiguration
**** AttendanceSession
**** CheckInAttempt
**** AttendanceRecord
@endwbs
```

| **Object** | **Stereotype** | **Responsibility** | **Trace source** |
| :--- | :--- | :--- | :--- |
| Role-specific Access Interface | `«user interaction»` | Represents the active login interface for the user role that initiates authentication. It denotes one of Student Mobile Interface, Lecturer Web Interface, or Admin Web Interface in UC01. | Student, Lecturer, Admin; UC01 |
| Student Mobile Interface | `«user interaction»` | Receives student authentication, QR, PIN, and history actions. | Student; UC01-UC04 |
| Lecturer Web Interface | `«user interaction»` | Receives lecturer session, monitor, adjustment, and export actions. | Lecturer; UC01, UC05-UC08 |
| Admin Web Interface | `«user interaction»` | Receives administrator catalog and classroom configuration actions. | Admin; UC01, UC09-UC10 |
| Mobile Device Sensor Interface | `«device I/O»` | Interfaces with mobile device hardware to request biometric verification, read GPS coordinates, read device identifier, access camera/selfie evidence, and capture calibration location when an administrator performs on-site classroom setup. | Mobile Device Hardware; UC02, UC04, UC10 |
| University Identity System Interface | `«external system interface»` | Represents the AFAS boundary used to ask the existing University Identity System to confirm user identity. | University Identity System; UC01, BR-01 |
| Authentication Control | `«coordinator»` | Coordinates external identity confirmation and AFAS role access. | UC01, BR-01 |
| Check-in Control | `«coordinator»` | Coordinates QR/PIN evidence validation and attendance attempt handling. | UC02, UC04 |
| Session Control | `«state dependent control»` | Coordinates attendance session lifecycle: active, stopped, reopened, finalized. | UC05, BR-02, BR-08, BR-10, BR-12 |
| Attendance History Control | `«coordinator»` | Coordinates student attendance history retrieval and access checking. | UC03, BR-01 |
| Monitor Control | `«coordinator»` | Coordinates live attendance status visualization after accepted QR or PIN check-ins. | UC02, UC04, UC06 |
| Adjustment Control | `«coordinator»` | Coordinates manual attendance status adjustment and creation of an official result from a reviewed rejected attempt. | UC07, BR-10 |
| Report Control | `«coordinator»` | Coordinates finalized attendance report preparation. | UC08, BR-08 |
| Catalog Control | `«coordinator»` | Coordinates catalog creation, update, deletion, and import validation. | UC09, BR-11 |
| Room Configuration Control | `«coordinator»` | Coordinates classroom location, allowed radius configuration, and default radius usage. | UC10, BR-03, NF-06 |
| Attendance Code Rules | `«business logic»` | Checks QR/PIN activity, configured validity window, configured refresh interval, and session match using official system time. | UC02, UC04, UC05, BR-02, BR-12, NF-06 |
| Identity Evidence Rules | `«business logic»` | Checks local biometric verification result or selfie fallback proof. | UC02, UC04, BR-04 |
| Location Distance Calculation | `«algorithm»` | Calculates distance from submitted coordinates to classroom coordinates and evaluates the configured radius with location accuracy tolerance. | UC02, UC04, BR-03, NF-02 |
| Attendance Status Calculation | `«business logic»` | Determines `Present` or `Late` from official check-in time, scheduled start time, and the configured Late threshold. | UC02, UC04, BR-12, BR-13, NF-06 |
| Session Rules | `«business logic»` | Checks scheduled time window, assigned lecturer, active session uniqueness, absent assignment, finalization, and whether manual adjustment is still allowed. | UC05, UC07, BR-08, BR-10 |
| Report Eligibility Rules | `«business logic»` | Ensures export uses finalized attendance results. | UC08, BR-08 |
| Catalog Uniqueness Rules | `«business logic»` | Ensures catalog identifiers are unique. | UC09, BR-11 |
| Room Location Setting Rules | `«business logic»` | Ensures the classroom location coordinate value is valid, belongs to the university campus boundary, and has an allowed radius greater than zero. | UC10, BR-03 |
| Account, Student, Lecturer | `«entity»` | Store AFAS role profile information linked to university identity. | UC01, UC09 |
| CampusBoundary, Room, Subject, ClassSection, ClassSectionStudent, Session | `«entity»` | Store academic catalog, roster, campus boundary, classroom coordinates, and scheduled session information. | UC02-UC06, UC08-UC10 |
| AttendanceConfiguration | `«entity»` | Stores configurable attendance timing and default allowed radius values required by maintainability requirements. | UC02, UC04, UC05, UC10, NF-06 |
| AttendanceSession, CheckInAttempt, AttendanceRecord | `«entity»` | Store attendance lifecycle, evidence, and official result information. | UC02, UC04-UC08 |

### **II.1.4 Interface wireframes**

The following analysis-level wireframes identify the user interaction surfaces required by the use cases. They do not introduce implementation technology; they only show the business information and actions visible at the system boundary.

#### **Student Mobile Interface wireframes**

```plantuml
@startsalt
{
  {^"QR Check-in" | "PIN Check-in" | "History"}
  {
    "Identity status" | "Not verified / Verified"
    "Attendance input" | "Scan active QR or enter active PIN"
    "Evidence" | "Location, device, biometric or selfie proof"
    [Submit check-in]
    "Result" | "Accepted as Present/Late or rejected reason"
  }
}
@endsalt
```

Trace: Student; UC02, UC03, UC04.

#### **Lecturer Web Interface wireframes**

```plantuml
@startsalt
{
  {^"Session" | "Monitor" | "Adjust" | "Report"}
  {
    "Selected class session" | "Scheduled class and room"
    [Start Attendance] | [Stop Receiving Check-ins] | [Finalize Attendance]
    "Projector view" | "Dynamic QR, backup PIN, countdown"
    "Live roster" | "Present / Late / Absent counts"
    "Rejected attempts" | "Evidence summary and adjustment reason"
    [Export finalized report]
  }
}
@endsalt
```

Trace: Lecturer; UC05, UC06, UC07, UC08.

#### **Admin Web Interface wireframes**

```plantuml
@startsalt
{
  {^"Catalog" | "Room Configuration"}
  {
    "Catalog grid" | "Accounts, subjects, class sections"
    [Add] | [Edit] | [Delete] | [Import]
    "Room" | "Room code and configured location"
    "Allowed radius" | "Default or custom radius"
    [Capture Current Location] | [Save Configuration]
    "Validation" | "Duplicate ID, invalid coordinate, or out-of-bounds warning"
  }
}
@endsalt
```

Trace: Admin; UC09, UC10.

---

## **II.2 Interaction diagrams**

The following sequence and communication diagrams realize each use case from Section I.5.2. Message wording follows the use case steps and business rules from Section I.6.

Sequence diagrams are kept to validate detailed main and alternative flows. Communication diagrams are also kept to match the SWD392 sample document style and to provide collaboration views that can be integrated in Design Modeling.

### **II.2.1 UC01 - Authenticate User**

#### **Figure II-3 Sequence diagram for UC01 - Authenticate User**

```plantuml
@startuml
skinparam style strictuml
autonumber
actor "Student / Lecturer / Admin" as User
participant "Role-specific Access Interface\n«user interaction»" as AccessUI
participant "Authentication Control\n«coordinator»" as AuthControl
participant "Authentication Rules\n«business logic»" as AuthRules
participant "University Identity System Interface\n«external system interface»" as UISInterface
participant "University Identity System\n«external system»" as UIS
participant "Account\n«entity»" as Account

User -> AccessUI : select login
AccessUI -> AuthControl : request authentication(requested role)

AuthControl -> UISInterface : request university identity confirmation
UISInterface -> UIS : ask for identity confirmation
UIS --> UISInterface : identity confirmed or not confirmed
UISInterface --> AuthControl : identity confirmation result

alt identity confirmed and AFAS role profile exists
  AuthControl -> Account : find role profile by university identity
  Account --> AuthControl : role profile
  AuthControl -> AuthRules : validate role access(role profile, requested role)
  AuthRules --> AuthControl : role access result
  AuthControl --> AccessUI : grant access when role matches
  AccessUI --> User : show role-specific homepage
else identity not confirmed
  AuthControl --> AccessUI : deny access with error
  AccessUI --> User : show identity not confirmed
else no AFAS role profile
  AuthControl --> AccessUI : deny access because role profile is not registered
  AccessUI --> User : show role not registered
end
@enduml
```

`Role-specific Access Interface` represents the active user-facing interface for the actor who initiated UC01: Student Mobile Interface, Lecturer Web Interface, or Admin Web Interface.

#### **Figure II-4 Communication diagram for UC01 - Authenticate User**

```plantuml
@startuml
class "Student / Lecturer / Admin" as User <<actor>>
class "Role-specific Access Interface" as AccessUI <<user interaction>>
class "Authentication Control" as AuthControl <<coordinator>>
class "Authentication Rules" as AuthRules <<business logic>>
class "University Identity System Interface" as UISInterface <<external system interface>>
class "University Identity System" as UIS <<external system>>
class "Account" as Account <<entity>>

User --> AccessUI : 1 select login
AccessUI --> AuthControl : 1.1 request authentication
AuthControl --> UISInterface : 1.1.1 request identity confirmation
UISInterface --> UIS : 1.1.1.1 confirm identity
AuthControl --> Account : 1.1.2 find role profile
AuthControl --> AuthRules : 1.1.3 validate role access
AuthControl --> AccessUI : 2 return access result
AccessUI --> User : 3 show homepage or access denial
@enduml
```

### **II.2.2 UC02 - Check In via Dynamic QR Code**

#### **Figure II-5 Sequence diagram for UC02 - Check In via Dynamic QR Code**

```plantuml
@startuml
skinparam style strictuml
autonumber
actor "Student" as Student
participant "Student Mobile Interface\n«user interaction»" as StudentUI
participant "Check-in Control\n«coordinator»" as CheckInControl
participant "Mobile Device Sensor Interface\n«device I/O»" as MobileSensor
participant "Identity Evidence Rules\n«business logic»" as IdentityRules
participant "Attendance Code Rules\n«business logic»" as CodeRules
participant "Location Distance Calculation\n«algorithm»" as DistanceCalc
participant "Attendance Status Calculation\n«business logic»" as StatusRules
participant "AttendanceSession\n«entity»" as AttendanceSession
participant "AttendanceConfiguration\n«entity»" as AttendanceConfig
participant "Session\n«entity»" as Session
participant "ClassSectionStudent\n«entity»" as ClassSectionStudent
participant "Room\n«entity»" as Room
participant "CheckInAttempt\n«entity»" as CheckInAttempt
participant "AttendanceRecord\n«entity»" as AttendanceRecord
participant "Monitor Control\n«coordinator»" as MonitorControl

Student -> StudentUI : tap Scan QR Check-in
StudentUI -> CheckInControl : request identity verification
CheckInControl -> MobileSensor : perform biometric check

alt local biometric verification completed
  MobileSensor --> CheckInControl : local biometric verification result
  CheckInControl -> IdentityRules : validate local verification result
  IdentityRules --> CheckInControl : identity evidence accepted
  CheckInControl --> StudentUI : identity verification accepted
else biometric unavailable
  Student -> StudentUI : capture face selfie as fallback proof
  StudentUI -> CheckInControl : submit fallback proof request
  CheckInControl -> MobileSensor : access camera and capture selfie
  MobileSensor --> CheckInControl : face proof
  CheckInControl -> IdentityRules : validate fallback proof
  IdentityRules --> CheckInControl : fallback proof accepted
  CheckInControl --> StudentUI : identity verification accepted
else identity verification failed and no valid fallback proof
  MobileSensor --> CheckInControl : identity evidence failed
  CheckInControl --> StudentUI : identity evidence rejected
  break check-in submission blocked
    StudentUI --> Student : block check-in submission
  end
end

StudentUI --> Student : display camera view
Student -> StudentUI : scan active QR code
StudentUI -> CheckInControl : submit scanned code
CheckInControl -> MobileSensor : read GPS coordinates and device identifier
alt location unavailable
  MobileSensor --> CheckInControl : location unavailable
  CheckInControl --> StudentUI : request location services
  StudentUI --> Student : prompt to enable location services
else location and device evidence available
  MobileSensor --> CheckInControl : submitted location and device evidence
  CheckInControl -> AttendanceSession : read active session code and target study session
  AttendanceSession --> CheckInControl : active session information
  CheckInControl -> CodeRules : verify code active and session match using official system time
  CodeRules -> AttendanceConfig : read QR validity seconds

  alt attendance code expired
    CodeRules --> CheckInControl : invalid code
    CheckInControl -> CheckInAttempt : record rejected attempt(status = Rejected, reason = ExpiredCode)
    CheckInControl --> StudentUI : reject QR expired
    StudentUI --> Student : show QR expired message
  else code valid
    CodeRules --> CheckInControl : code valid
    CheckInControl -> Session : read class section and scheduled start time
    Session --> CheckInControl : class section and session start time
    CheckInControl -> ClassSectionStudent : verify student enrollment in class section
    ClassSectionStudent --> CheckInControl : enrollment result

    alt student not enrolled
      CheckInControl -> CheckInAttempt : record rejected attempt(status = Rejected, reason = NotEnrolled)
      CheckInControl --> StudentUI : reject not enrolled
      StudentUI --> Student : show check-in not allowed
    else student enrolled
      CheckInControl -> Room : read classroom coordinates and allowed range
      Room --> CheckInControl : classroom coordinates and range
      CheckInControl -> DistanceCalc : compare submitted coordinates, accuracy, and classroom range
      DistanceCalc --> CheckInControl : location check result

      alt outside allowed range
        CheckInControl -> CheckInAttempt : record rejected attempt(status = Rejected, reason = OutsideLocation)
        CheckInControl --> StudentUI : reject outside classroom range
        StudentUI --> Student : show check-in not accepted
      else within allowed range
        CheckInControl -> CheckInAttempt : record accepted attempt(status = Accepted, method = QR, submittedAt = official system time)
        CheckInControl -> AttendanceRecord : check existing official result
        AttendanceRecord --> CheckInControl : existing result or none
        alt official result already exists
          CheckInControl --> StudentUI : return existing official result
          StudentUI --> Student : show existing result
        else no official result exists
          CheckInControl -> StatusRules : determineStatus(submittedAt, sessionStartTime)
          StatusRules -> AttendanceConfig : read Late threshold minutes
          StatusRules --> CheckInControl : official status
          CheckInControl -> AttendanceRecord : register official result
          CheckInControl -> MonitorControl : attendanceResultChanged
          CheckInControl --> StudentUI : check-in accepted
          StudentUI --> Student : show successful check-in time
        end
      end
    end
  end
end
@enduml
```

#### **Figure II-6 Communication diagram for UC02 - Check In via Dynamic QR Code**

```plantuml
@startuml
class "Student" as Student <<actor>>
class "Student Mobile Interface" as StudentUI <<user interaction>>
class "Check-in Control" as CheckInControl <<coordinator>>
class "Mobile Device Sensor Interface" as MobileSensor <<device I/O>>
class "Identity Evidence Rules" as IdentityRules <<business logic>>
class "Attendance Code Rules" as CodeRules <<business logic>>
class "Location Distance Calculation" as DistanceCalc <<algorithm>>
class "Attendance Status Calculation" as StatusRules <<business logic>>
class "AttendanceSession" as AttendanceSession <<entity>>
class "AttendanceConfiguration" as AttendanceConfig <<entity>>
class "Session" as Session <<entity>>
class "ClassSectionStudent" as ClassSectionStudent <<entity>>
class "Room" as Room <<entity>>
class "CheckInAttempt" as CheckInAttempt <<entity>>
class "AttendanceRecord" as AttendanceRecord <<entity>>
class "Monitor Control" as MonitorControl <<coordinator>>

Student --> StudentUI : 1 tap Scan QR
StudentUI --> CheckInControl : 1.1 request identity verification
CheckInControl --> MobileSensor : 1.1.1 request local biometric result or camera proof
CheckInControl --> IdentityRules : 1.1.2 validate identity evidence
Student --> StudentUI : 2 scan QR code
StudentUI --> CheckInControl : 2.1 submit scanned code
CheckInControl --> MobileSensor : 2.1.1 read GPS coordinates and device identifier
CheckInControl --> AttendanceSession : 2.1.2 read active session
CheckInControl --> CodeRules : 2.1.3 verify active code using official system time
CodeRules --> AttendanceConfig : 2.1.3.1 read QR validity
CheckInControl --> Session : 2.1.4 read class section and scheduled start time
CheckInControl --> ClassSectionStudent : 2.1.5 verify enrollment
CheckInControl --> Room : 2.1.6 read classroom coordinates and range
CheckInControl --> DistanceCalc : 2.1.7 compare submitted coordinates
CheckInControl --> CheckInAttempt : 2.1.8 record attempt
CheckInControl --> AttendanceRecord : 2.1.9 check/register official result
CheckInControl --> StatusRules : 2.1.10 determine Present/Late from official time and start time
StatusRules --> AttendanceConfig : 2.1.10.1 read Late threshold
CheckInControl --> MonitorControl : 2.1.11 attendanceResultChanged
CheckInControl --> StudentUI : 3 return accepted/rejected result
@enduml
```

### **II.2.3 UC03 - View Personal Attendance History**

#### **Figure II-7 Sequence diagram for UC03 - View Personal Attendance History**

```plantuml
@startuml
skinparam style strictuml
autonumber
actor "Student" as Student
participant "Student Mobile Interface\n«user interaction»" as StudentUI
participant "Attendance History Control\n«coordinator»" as HistoryControl
participant "Authentication Rules\n«business logic»" as AuthRules
participant "ClassSectionStudent\n«entity»" as ClassSectionStudent
participant "ClassSection\n«entity»" as ClassSection
participant "AttendanceRecord\n«entity»" as AttendanceRecord

Student -> StudentUI : select History tab
StudentUI -> HistoryControl : request personal attendance history(student)
HistoryControl -> AuthRules : check student access

alt access allowed
  AuthRules --> HistoryControl : allowed
  HistoryControl -> ClassSectionStudent : read enrolled class sections
  ClassSectionStudent --> HistoryControl : class section references
  HistoryControl -> ClassSection : read class section information
  ClassSection --> HistoryControl : class section list
  HistoryControl -> AttendanceRecord : read attendance records for student
  AttendanceRecord --> HistoryControl : attendance statuses
  HistoryControl --> StudentUI : history summary and detail
  StudentUI --> Student : show class list, stats, and calendar view
else history cannot be loaded
  HistoryControl --> StudentUI : loading failure
  StudentUI --> Student : ask student to try again later
end
@enduml
```

#### **Figure II-8 Communication diagram for UC03 - View Personal Attendance History**

```plantuml
@startuml
class "Student" as Student <<actor>>
class "Student Mobile Interface" as StudentUI <<user interaction>>
class "Attendance History Control" as HistoryControl <<coordinator>>
class "Authentication Rules" as AuthRules <<business logic>>
class "ClassSectionStudent" as ClassSectionStudent <<entity>>
class "ClassSection" as ClassSection <<entity>>
class "AttendanceRecord" as AttendanceRecord <<entity>>

Student --> StudentUI : 1 select History tab
StudentUI --> HistoryControl : 1.1 request history
HistoryControl --> AuthRules : 1.1.1 check access
HistoryControl --> ClassSectionStudent : 1.1.2 read enrolled sections
HistoryControl --> ClassSection : 1.1.3 read class section details
HistoryControl --> AttendanceRecord : 1.1.4 read statuses
HistoryControl --> StudentUI : 2 return history or failure
@enduml
```

### **II.2.4 UC04 - Check In via PIN Fallback**

#### **Figure II-9 Sequence diagram for UC04 - Check In via PIN Fallback**

```plantuml
@startuml
skinparam style strictuml
autonumber
actor "Student" as Student
participant "Student Mobile Interface\n«user interaction»" as StudentUI
participant "Check-in Control\n«coordinator»" as CheckInControl
participant "Mobile Device Sensor Interface\n«device I/O»" as MobileSensor
participant "Identity Evidence Rules\n«business logic»" as IdentityRules
participant "Attendance Code Rules\n«business logic»" as CodeRules
participant "Location Distance Calculation\n«algorithm»" as DistanceCalc
participant "Attendance Status Calculation\n«business logic»" as StatusRules
participant "AttendanceSession\n«entity»" as AttendanceSession
participant "AttendanceConfiguration\n«entity»" as AttendanceConfig
participant "Session\n«entity»" as Session
participant "ClassSectionStudent\n«entity»" as ClassSectionStudent
participant "Room\n«entity»" as Room
participant "CheckInAttempt\n«entity»" as CheckInAttempt
participant "AttendanceRecord\n«entity»" as AttendanceRecord
participant "Monitor Control\n«coordinator»" as MonitorControl

Student -> StudentUI : select PIN Check-in
StudentUI -> CheckInControl : request identity verification
CheckInControl -> MobileSensor : perform biometric check

alt local biometric verification completed
  MobileSensor --> CheckInControl : local biometric verification result
  CheckInControl -> IdentityRules : validate local verification result
  IdentityRules --> CheckInControl : identity evidence accepted
  CheckInControl --> StudentUI : identity verification accepted
else biometric unavailable
  Student -> StudentUI : capture face selfie as fallback proof
  StudentUI -> CheckInControl : submit fallback proof request
  CheckInControl -> MobileSensor : access camera and capture selfie
  MobileSensor --> CheckInControl : face proof
  CheckInControl -> IdentityRules : validate fallback proof
  IdentityRules --> CheckInControl : fallback proof accepted
  CheckInControl --> StudentUI : identity verification accepted
else identity verification failed and no valid fallback proof
  MobileSensor --> CheckInControl : identity evidence failed
  CheckInControl --> StudentUI : identity evidence rejected
  break check-in submission blocked
    StudentUI --> Student : block check-in submission
  end
end

StudentUI --> Student : display PIN input screen
Student -> StudentUI : enter active 6-digit PIN
StudentUI -> CheckInControl : submit PIN code
CheckInControl -> MobileSensor : read GPS coordinates and device identifier
alt location unavailable
  MobileSensor --> CheckInControl : location unavailable
  CheckInControl --> StudentUI : request location services
  StudentUI --> Student : prompt to enable location services
else location and device evidence available
  MobileSensor --> CheckInControl : submitted location and device evidence
  CheckInControl -> AttendanceSession : read active PIN session and target study session
  AttendanceSession --> CheckInControl : active session information
  CheckInControl -> CodeRules : verify PIN is active using official system time
  CodeRules -> AttendanceConfig : read PIN refresh seconds

  alt PIN expired
    CodeRules --> CheckInControl : invalid PIN
    CheckInControl -> CheckInAttempt : record rejected attempt(status = Rejected, reason = ExpiredCode)
    CheckInControl --> StudentUI : reject PIN expired
    StudentUI --> Student : show PIN expired message
  else PIN valid
    CodeRules --> CheckInControl : PIN valid
    CheckInControl -> Session : read class section and scheduled start time
    Session --> CheckInControl : class section and session start time
    CheckInControl -> ClassSectionStudent : verify student enrollment in class section
    ClassSectionStudent --> CheckInControl : enrollment result

    alt student not enrolled
      CheckInControl -> CheckInAttempt : record rejected attempt(status = Rejected, reason = NotEnrolled)
      CheckInControl --> StudentUI : reject not enrolled
      StudentUI --> Student : show check-in not allowed
    else student enrolled
      CheckInControl -> Room : read classroom coordinates and allowed range
      Room --> CheckInControl : classroom coordinates and range
      CheckInControl -> DistanceCalc : compare submitted coordinates, accuracy, and classroom range
      DistanceCalc --> CheckInControl : location check result

      alt outside allowed range
        CheckInControl -> CheckInAttempt : record rejected attempt(status = Rejected, reason = OutsideLocation)
        CheckInControl --> StudentUI : reject outside classroom range
        StudentUI --> Student : show check-in not accepted
      else within allowed range
        CheckInControl -> CheckInAttempt : record accepted attempt(status = Accepted, method = PIN, submittedAt = official system time)
        CheckInControl -> AttendanceRecord : check existing official result
        AttendanceRecord --> CheckInControl : existing result or none
        alt official result already exists
          CheckInControl --> StudentUI : return existing official result
          StudentUI --> Student : show existing result
        else no official result exists
          CheckInControl -> StatusRules : determineStatus(submittedAt, sessionStartTime)
          StatusRules -> AttendanceConfig : read Late threshold minutes
          StatusRules --> CheckInControl : official status
          CheckInControl -> AttendanceRecord : register official result
          CheckInControl -> MonitorControl : attendanceResultChanged
          CheckInControl --> StudentUI : check-in accepted
          StudentUI --> Student : show successful PIN check-in
        end
      end
    end
  end
end
@enduml
```

#### **Figure II-10 Communication diagram for UC04 - Check In via PIN Fallback**

```plantuml
@startuml
class "Student" as Student <<actor>>
class "Student Mobile Interface" as StudentUI <<user interaction>>
class "Check-in Control" as CheckInControl <<coordinator>>
class "Mobile Device Sensor Interface" as MobileSensor <<device I/O>>
class "Identity Evidence Rules" as IdentityRules <<business logic>>
class "Attendance Code Rules" as CodeRules <<business logic>>
class "Location Distance Calculation" as DistanceCalc <<algorithm>>
class "Attendance Status Calculation" as StatusRules <<business logic>>
class "AttendanceSession" as AttendanceSession <<entity>>
class "AttendanceConfiguration" as AttendanceConfig <<entity>>
class "Session" as Session <<entity>>
class "ClassSectionStudent" as ClassSectionStudent <<entity>>
class "Room" as Room <<entity>>
class "CheckInAttempt" as CheckInAttempt <<entity>>
class "AttendanceRecord" as AttendanceRecord <<entity>>
class "Monitor Control" as MonitorControl <<coordinator>>

Student --> StudentUI : 1 select PIN Check-in
StudentUI --> CheckInControl : 1.1 request identity verification
CheckInControl --> MobileSensor : 1.1.1 request local biometric result or camera proof
CheckInControl --> IdentityRules : 1.1.2 validate identity evidence
Student --> StudentUI : 2 enter PIN
StudentUI --> CheckInControl : 2.1 submit PIN code
CheckInControl --> MobileSensor : 2.1.1 read GPS coordinates and device identifier
CheckInControl --> AttendanceSession : 2.1.2 read active PIN
CheckInControl --> CodeRules : 2.1.3 verify PIN using official system time
CodeRules --> AttendanceConfig : 2.1.3.1 read PIN refresh setting
CheckInControl --> Session : 2.1.4 read class section and scheduled start time
CheckInControl --> ClassSectionStudent : 2.1.5 verify enrollment
CheckInControl --> Room : 2.1.6 read classroom coordinates and range
CheckInControl --> DistanceCalc : 2.1.7 compare submitted coordinates
CheckInControl --> CheckInAttempt : 2.1.8 record attempt
CheckInControl --> AttendanceRecord : 2.1.9 check/register official result
CheckInControl --> StatusRules : 2.1.10 determine Present/Late from official time and start time
StatusRules --> AttendanceConfig : 2.1.10.1 read Late threshold
CheckInControl --> MonitorControl : 2.1.11 attendanceResultChanged
CheckInControl --> StudentUI : 3 return accepted/rejected result
@enduml
```

### **II.2.5 UC05 - Manage Attendance Session**

#### **Figure II-11 Sequence diagram for UC05 - Manage Attendance Session**

```plantuml
@startuml
skinparam style strictuml
autonumber
actor "Lecturer" as Lecturer
participant "Lecturer Web Interface\n«user interaction»" as LecturerUI
participant "Session Control\n«state dependent control»" as SessionControl
participant "Session Rules\n«business logic»" as SessionRules
participant "Attendance Code Rules\n«business logic»" as CodeRules
participant "AttendanceConfiguration\n«entity»" as AttendanceConfig
participant "Session\n«entity»" as Session
participant "ClassSectionStudent\n«entity»" as ClassSectionStudent
participant "AttendanceSession\n«entity»" as AttendanceSession
participant "CheckInAttempt\n«entity»" as CheckInAttempt
participant "AttendanceRecord\n«entity»" as AttendanceRecord

Lecturer -> LecturerUI : navigate to My Scheduled Classes
LecturerUI -> SessionControl : request assigned scheduled sessions
SessionControl -> Session : read sessions assigned to lecturer
Session --> SessionControl : scheduled sessions
SessionControl --> LecturerUI : assigned classes and sessions
Lecturer -> LecturerUI : select current session and click Start Attendance
LecturerUI -> SessionControl : request session activation
SessionControl -> SessionRules : validate schedule window, assigned lecturer, and active-session uniqueness

alt outside scheduled hours
  SessionRules --> SessionControl : activation denied
  SessionControl --> LecturerUI : show outside scheduled hours error
else session already active
  SessionRules --> SessionControl : activation denied
  SessionControl --> LecturerUI : show active session already exists error
else activation allowed
  SessionRules --> SessionControl : activation allowed
  SessionControl -> AttendanceSession : mark session active
  SessionControl -> CodeRules : prepare QR and PIN refresh rules
  CodeRules -> AttendanceConfig : read QR and PIN refresh seconds
  CodeRules --> SessionControl : current QR and PIN codes
  SessionControl -> AttendanceSession : update current QR and PIN codes
  SessionControl --> LecturerUI : show projector view with QR, PIN, and progress

  loop while session is active
    SessionControl -> CodeRules : refresh QR and PIN using configured intervals
    CodeRules -> AttendanceConfig : read QR and PIN refresh seconds
    CodeRules --> SessionControl : refreshed codes
    SessionControl -> AttendanceSession : update displayed codes
    SessionControl --> LecturerUI : update displayed QR and PIN
  end

  Lecturer -> LecturerUI : click Stop Receiving Check-ins
  LecturerUI -> SessionControl : request stop accepting check-ins
  SessionControl -> AttendanceSession : mark session stopped for new check-ins
  SessionControl --> LecturerUI : show review view

  alt short reopen requested due to classroom interruption
    Lecturer -> LecturerUI : request short reopen
    LecturerUI -> SessionControl : request reopen window
    SessionControl -> SessionRules : validate reopen before finalization
    SessionRules --> SessionControl : reopen allowed or denied
    SessionControl -> AttendanceSession : reopen or keep stopped
    SessionControl --> LecturerUI : show reopen result

    alt reopen allowed
      loop while reopened window is active
        SessionControl -> CodeRules : refresh QR and PIN using configured intervals
        CodeRules -> AttendanceConfig : read QR and PIN refresh seconds
        CodeRules --> SessionControl : refreshed codes
        SessionControl -> AttendanceSession : update displayed codes
        SessionControl --> LecturerUI : update reopened QR and PIN
      end

      Lecturer -> LecturerUI : click Stop Receiving Check-ins again
      LecturerUI -> SessionControl : request stop accepting reopened check-ins
      SessionControl -> AttendanceSession : mark reopened session stopped
      SessionControl --> LecturerUI : show review view
    end
  end

  LecturerUI -> SessionControl : request results and rejected attempts
  SessionControl -> AttendanceRecord : read attendance results
  AttendanceRecord --> SessionControl : official results
  SessionControl -> CheckInAttempt : read rejected attempts
  CheckInAttempt --> SessionControl : rejected attempts
  SessionControl --> LecturerUI : show review data

  opt adjustment before finalization
    LecturerUI -> SessionControl : continue after UC07 adjustment
  end

  SessionControl -> ClassSectionStudent : read enrolled students
  ClassSectionStudent --> SessionControl : enrolled students
  SessionControl -> AttendanceRecord : assign Absent to students without Present or Late
  AttendanceRecord --> SessionControl : completed attendance list
  SessionControl --> LecturerUI : show completed attendance list

  Lecturer -> LecturerUI : click Finalize Attendance
  LecturerUI -> SessionControl : request finalization
  SessionControl -> SessionRules : validate finalization rules
  SessionRules --> SessionControl : finalization allowed
  SessionControl -> AttendanceRecord : mark results finalized
  SessionControl -> AttendanceSession : mark session finalized
  SessionControl --> LecturerUI : attendance finalized
end
@enduml
```

#### **Figure II-12 Communication diagram for UC05 - Manage Attendance Session**

```plantuml
@startuml
class "Lecturer" as Lecturer <<actor>>
class "Lecturer Web Interface" as LecturerUI <<user interaction>>
class "Session Control" as SessionControl <<state dependent control>>
class "Session Rules" as SessionRules <<business logic>>
class "Attendance Code Rules" as CodeRules <<business logic>>
class "AttendanceConfiguration" as AttendanceConfig <<entity>>
class "Session" as Session <<entity>>
class "ClassSectionStudent" as ClassSectionStudent <<entity>>
class "AttendanceSession" as AttendanceSession <<entity>>
class "CheckInAttempt" as CheckInAttempt <<entity>>
class "AttendanceRecord" as AttendanceRecord <<entity>>

Lecturer --> LecturerUI : 1 manage scheduled session
LecturerUI --> SessionControl : 1.1 request sessions/start/stop/reopen/finalize
SessionControl --> Session : 1.1.1 read assigned sessions
SessionControl --> SessionRules : 1.1.2 validate lifecycle action
SessionControl --> AttendanceSession : 1.1.3 activate, stop, reopen, stop reopened window, or finalize
SessionControl --> CodeRules : 1.1.4 prepare and refresh QR/PIN codes
CodeRules --> AttendanceConfig : 1.1.4.1 read QR/PIN refresh settings
SessionControl --> AttendanceRecord : 1.1.5 read results, assign Absent, finalize
SessionControl --> CheckInAttempt : 1.1.6 read rejected attempts
SessionControl --> ClassSectionStudent : 1.1.7 read enrolled students
SessionControl --> LecturerUI : 2 show lifecycle result
@enduml
```

### **II.2.6 UC06 - Monitor Attendance in Real Time**

#### **Figure II-13 Sequence diagram for UC06 - Monitor Attendance in Real Time**

```plantuml
@startuml
skinparam style strictuml
autonumber
actor "Lecturer" as Lecturer
participant "Lecturer Web Interface\n«user interaction»" as LecturerUI
participant "Monitor Control\n«coordinator»" as MonitorControl
participant "Session Rules\n«business logic»" as SessionRules
participant "AttendanceSession\n«entity»" as AttendanceSession
participant "ClassSectionStudent\n«entity»" as ClassSectionStudent
participant "AttendanceRecord\n«entity»" as AttendanceRecord

Lecturer -> LecturerUI : open live attendance monitor
LecturerUI -> MonitorControl : request active session monitor
MonitorControl -> AttendanceSession : read attendance session status
AttendanceSession --> MonitorControl : session status
MonitorControl -> SessionRules : verify session is active

alt session is not active
  SessionRules --> MonitorControl : monitor not allowed
  MonitorControl --> LecturerUI : monitor unavailable
  LecturerUI --> Lecturer : show monitor unavailable
else session is active
  SessionRules --> MonitorControl : monitor allowed
  MonitorControl -> ClassSectionStudent : read class roster
  ClassSectionStudent --> MonitorControl : enrolled students
  MonitorControl -> AttendanceRecord : read current attendance statuses
  AttendanceRecord --> MonitorControl : current statuses
  MonitorControl --> LecturerUI : student grid and attendance count
  LecturerUI --> Lecturer : show live grid

  alt live updates available
    loop attendanceResultChanged events from UC02 or UC04
      MonitorControl -> AttendanceRecord : read changed official result
      AttendanceRecord --> MonitorControl : latest Present or Late status
      MonitorControl --> LecturerUI : update student tile and count
      LecturerUI --> Lecturer : show Present or Late status update
    end
  else live updates interrupted
    MonitorControl --> LecturerUI : monitoring interruption
    LecturerUI --> Lecturer : show warning and allow refresh
  end
end
@enduml
```

The monitor interaction is modeled at the business-event level only: accepted QR and PIN check-ins change the official attendance result, and Monitor Control updates the lecturer view from that change. The concrete delivery mechanism is deferred to Design Modeling.

#### **Figure II-14 Communication diagram for UC06 - Monitor Attendance in Real Time**

```plantuml
@startuml
class "Lecturer" as Lecturer <<actor>>
class "Lecturer Web Interface" as LecturerUI <<user interaction>>
class "Monitor Control" as MonitorControl <<coordinator>>
class "Session Rules" as SessionRules <<business logic>>
class "AttendanceSession" as AttendanceSession <<entity>>
class "ClassSectionStudent" as ClassSectionStudent <<entity>>
class "AttendanceRecord" as AttendanceRecord <<entity>>

Lecturer --> LecturerUI : 1 open monitor
LecturerUI --> MonitorControl : 1.1 request active session monitor
MonitorControl --> AttendanceSession : 1.1.1 read session status
MonitorControl --> SessionRules : 1.1.2 verify active session
MonitorControl --> ClassSectionStudent : 1.1.3 read roster
MonitorControl --> AttendanceRecord : 1.1.4 read current statuses and changed official results
MonitorControl --> LecturerUI : 2 show unavailable, update grid, or show interruption warning
@enduml
```

### **II.2.7 UC07 - Adjust Attendance Manually**

#### **Figure II-15 Sequence diagram for UC07 - Adjust Attendance Manually**

```plantuml
@startuml
skinparam style strictuml
autonumber
actor "Lecturer" as Lecturer
participant "Lecturer Web Interface\n«user interaction»" as LecturerUI
participant "Adjustment Control\n«coordinator»" as AdjustmentControl
participant "Session Rules\n«business logic»" as SessionRules
participant "AttendanceRecord\n«entity»" as AttendanceRecord
participant "CheckInAttempt\n«entity»" as CheckInAttempt

Lecturer -> LecturerUI : select student or rejected attempt and click Adjust Status
LecturerUI -> AdjustmentControl : request adjustment context
AdjustmentControl -> SessionRules : verify assigned lecturer and session not finalized

alt session finalized or lecturer not assigned
  SessionRules --> AdjustmentControl : adjustment not allowed
  AdjustmentControl --> LecturerUI : adjustment rejected
  LecturerUI --> Lecturer : show finalized or unauthorized adjustment message
else adjustment context allowed
  SessionRules --> AdjustmentControl : adjustment context allowed
  AdjustmentControl -> AttendanceRecord : read current official status
  AttendanceRecord --> AdjustmentControl : current status or none
  AdjustmentControl -> CheckInAttempt : read evidence summary if available
  CheckInAttempt --> AdjustmentControl : evidence summary
  AdjustmentControl --> LecturerUI : show Present, Late, Absent options and evidence summary
  Lecturer -> LecturerUI : select official status, enter reason, and save
  LecturerUI -> AdjustmentControl : submit adjustment(new status, reason)

  alt reason is missing
    AdjustmentControl --> LecturerUI : reason required
    LecturerUI --> Lecturer : prompt to write reason
  else official AttendanceRecord exists
    AdjustmentControl -> AttendanceRecord : update official result to Present, Late, or Absent
    AdjustmentControl --> LecturerUI : adjustment saved
    LecturerUI --> Lecturer : show updated student status
  else selected rejected attempt and no official record exists
    AdjustmentControl -> AttendanceRecord : create official result(ResultSource = ManualAdjustment, SourceCheckInAttemptId = selected attempt)
    AdjustmentControl --> LecturerUI : adjustment saved
    LecturerUI --> Lecturer : show created official status
  end
end
@enduml
```

#### **Figure II-16 Communication diagram for UC07 - Adjust Attendance Manually**

```plantuml
@startuml
class "Lecturer" as Lecturer <<actor>>
class "Lecturer Web Interface" as LecturerUI <<user interaction>>
class "Adjustment Control" as AdjustmentControl <<coordinator>>
class "Session Rules" as SessionRules <<business logic>>
class "AttendanceRecord" as AttendanceRecord <<entity>>
class "CheckInAttempt" as CheckInAttempt <<entity>>

Lecturer --> LecturerUI : 1 select student/attempt and save adjustment
LecturerUI --> AdjustmentControl : 1.1 request context / submit adjustment
AdjustmentControl --> SessionRules : 1.1.1 verify lecturer permission and non-finalized session
AdjustmentControl --> AttendanceRecord : 1.1.2 read, update, or create official status
AdjustmentControl --> CheckInAttempt : 1.1.3 read evidence summary
AdjustmentControl --> LecturerUI : 2 show success, missing reason, or rejected adjustment
@enduml
```

### **II.2.8 UC08 - Export Attendance Report**

#### **Figure II-17 Sequence diagram for UC08 - Export Attendance Report**

```plantuml
@startuml
skinparam style strictuml
autonumber
actor "Lecturer" as Lecturer
participant "Lecturer Web Interface\n«user interaction»" as LecturerUI
participant "Report Control\n«coordinator»" as ReportControl
participant "Report Eligibility Rules\n«business logic»" as ReportRules
participant "ClassSectionStudent\n«entity»" as ClassSectionStudent
participant "Session\n«entity»" as Session
participant "AttendanceRecord\n«entity»" as AttendanceRecord
participant "CheckInAttempt\n«entity»" as CheckInAttempt

Lecturer -> LecturerUI : click Export Report
LecturerUI -> ReportControl : request attendance report(class section, semester)
ReportControl -> ReportRules : verify export uses finalized attendance results

alt no finalized records or no sessions exist
  ReportRules --> ReportControl : export not available
  ReportControl --> LecturerUI : show empty-state message and disable export
  LecturerUI --> Lecturer : show no records available
else finalized records exist
  ReportRules --> ReportControl : export allowed
  ReportControl -> ClassSectionStudent : read roster
  ClassSectionStudent --> ReportControl : student roster
  ReportControl -> Session : read class sessions
  Session --> ReportControl : session dates
  ReportControl -> AttendanceRecord : read finalized Present, Late, Absent statuses
  AttendanceRecord --> ReportControl : official attendance matrix
  ReportControl -> CheckInAttempt : read check-in modes, warnings, and rejected attempts
  CheckInAttempt --> ReportControl : attempt evidence summary for report
  ReportControl --> LecturerUI : prepared report content
  LecturerUI --> Lecturer : save attendance report file locally
end
@enduml
```

#### **Figure II-18 Communication diagram for UC08 - Export Attendance Report**

```plantuml
@startuml
class "Lecturer" as Lecturer <<actor>>
class "Lecturer Web Interface" as LecturerUI <<user interaction>>
class "Report Control" as ReportControl <<coordinator>>
class "Report Eligibility Rules" as ReportRules <<business logic>>
class "ClassSectionStudent" as ClassSectionStudent <<entity>>
class "Session" as Session <<entity>>
class "AttendanceRecord" as AttendanceRecord <<entity>>
class "CheckInAttempt" as CheckInAttempt <<entity>>

Lecturer --> LecturerUI : 1 click Export Report
LecturerUI --> ReportControl : 1.1 request report
ReportControl --> ReportRules : 1.1.1 verify finalized results
ReportControl --> ClassSectionStudent : 1.1.2 read roster
ReportControl --> Session : 1.1.3 read sessions
ReportControl --> AttendanceRecord : 1.1.4 read finalized Present/Late/Absent statuses
ReportControl --> CheckInAttempt : 1.1.5 read modes, warnings, rejected attempts
ReportControl --> LecturerUI : 2 return report content or empty state
@enduml
```

### **II.2.9 UC09 - Manage System Catalog**

#### **Figure II-19 Sequence diagram for UC09 - Manage System Catalog**

```plantuml
@startuml
skinparam style strictuml
autonumber
actor "Admin" as Admin
participant "Admin Web Interface\n«user interaction»" as AdminUI
participant "Catalog Control\n«coordinator»" as CatalogControl
participant "Catalog Uniqueness Rules\n«business logic»" as CatalogRules
participant "Account\n«entity»" as Account
participant "Student\n«entity»" as Student
participant "Lecturer\n«entity»" as Lecturer
participant "Subject\n«entity»" as Subject
participant "ClassSection\n«entity»" as ClassSection

Admin -> AdminUI : click catalog menu option
AdminUI -> CatalogControl : request catalog view(catalog type)
CatalogControl --> AdminUI : searchable catalog grid
AdminUI --> Admin : show add, edit, and delete actions
Admin -> AdminUI : input catalog details and submit
AdminUI -> CatalogControl : submit catalog change
CatalogControl -> CatalogRules : validate fields and unique identifiers

alt duplicate identifier
  CatalogRules --> CatalogControl : duplicate detected
  CatalogControl --> AdminUI : validation error
  AdminUI --> Admin : show ID already exists
else batch import selected
  Admin -> AdminUI : upload structured catalog data
  AdminUI -> CatalogControl : submit batch catalog data
  CatalogControl -> CatalogRules : validate imported records
  CatalogRules --> CatalogControl : import validation result
  CatalogControl -> Account : record valid imported accounts
  CatalogControl -> Student : record valid imported students
  CatalogControl -> Subject : record valid imported subjects
  CatalogControl --> AdminUI : import result
  AdminUI --> Admin : show imported records and validation feedback
else valid single change
  CatalogRules --> CatalogControl : valid change
  CatalogControl -> Account : record user account change when applicable
  CatalogControl -> Student : record student change when applicable
  CatalogControl -> Lecturer : record lecturer change when applicable
  CatalogControl -> Subject : record subject change when applicable
  CatalogControl -> ClassSection : record class section change when applicable
  CatalogControl --> AdminUI : catalog updated
  AdminUI --> Admin : refresh catalog grid
end
@enduml
```

#### **Figure II-20 Communication diagram for UC09 - Manage System Catalog**

```plantuml
@startuml
class "Admin" as Admin <<actor>>
class "Admin Web Interface" as AdminUI <<user interaction>>
class "Catalog Control" as CatalogControl <<coordinator>>
class "Catalog Uniqueness Rules" as CatalogRules <<business logic>>
class "Account" as Account <<entity>>
class "Student" as Student <<entity>>
class "Lecturer" as Lecturer <<entity>>
class "Subject" as Subject <<entity>>
class "ClassSection" as ClassSection <<entity>>

Admin --> AdminUI : 1 manage catalog
AdminUI --> CatalogControl : 1.1 view/add/edit/delete/import records
CatalogControl --> CatalogRules : 1.1.1 validate fields and uniqueness
CatalogControl --> Account : 1.1.2 record account change
CatalogControl --> Student : 1.1.3 record student change
CatalogControl --> Lecturer : 1.1.4 record lecturer change
CatalogControl --> Subject : 1.1.5 record subject change
CatalogControl --> ClassSection : 1.1.6 record class section change
CatalogControl --> AdminUI : 2 return updated grid or validation error
@enduml
```

### **II.2.10 UC10 - Configure Classroom Location**

#### **Figure II-21 Sequence diagram for UC10 - Configure Classroom Location**

```plantuml
@startuml
skinparam style strictuml
autonumber
actor "Admin" as Admin
participant "Admin Web Interface\n«user interaction»" as AdminUI
participant "Room Configuration Control\n«coordinator»" as RoomControl
participant "Mobile Device Sensor Interface\n«device I/O»" as MobileSensor
participant "Room Location Setting Rules\n«business logic»" as LocationSettingRules
participant "Room\n«entity»" as Room
participant "CampusBoundary\n«entity»" as CampusBoundary
participant "AttendanceConfiguration\n«entity»" as AttendanceConfig

Admin -> AdminUI : click Room Management
AdminUI -> RoomControl : request classroom list
RoomControl -> Room : read physical classrooms
Room --> RoomControl : classroom list
RoomControl -> AttendanceConfig : read default allowed radius
AttendanceConfig --> RoomControl : default radius value
RoomControl --> AdminUI : classroom list with configuration action
Admin -> AdminUI : select classroom and configure location
AdminUI --> Admin : show location and allowed radius form

alt on-site calibration
  Admin -> AdminUI : capture current location
  AdminUI -> RoomControl : request current calibration location
  RoomControl -> MobileSensor : read current GPS coordinates
  MobileSensor --> RoomControl : captured classroom location
  RoomControl --> AdminUI : captured location values
  AdminUI --> Admin : populate captured location values
else manual entry
  Admin -> AdminUI : enter classroom center point
end

Admin -> AdminUI : enter allowed radius and save configuration
AdminUI -> RoomControl : submit location settings
RoomControl -> LocationSettingRules : validate classroom location and allowed radius
LocationSettingRules -> CampusBoundary : check location inside university boundary
CampusBoundary --> LocationSettingRules : boundary check result

alt invalid coordinate or radius
  LocationSettingRules --> RoomControl : setting value invalid
  RoomControl --> AdminUI : warning to verify location values
  AdminUI --> Admin : show coordinate or radius validation warning
else location outside university boundary
  LocationSettingRules --> RoomControl : location outside campus boundary
  RoomControl --> AdminUI : out-of-bounds location warning
  AdminUI --> Admin : show campus boundary warning
else location accepted
  LocationSettingRules --> RoomControl : location settings accepted
  RoomControl -> Room : update room location settings
  RoomControl --> AdminUI : configuration saved
  AdminUI --> Admin : show saved configuration
end
@enduml
```

#### **Figure II-22 Communication diagram for UC10 - Configure Classroom Location**

```plantuml
@startuml
class "Admin" as Admin <<actor>>
class "Admin Web Interface" as AdminUI <<user interaction>>
class "Room Configuration Control" as RoomControl <<coordinator>>
class "Mobile Device Sensor Interface" as MobileSensor <<device I/O>>
class "Room Location Setting Rules" as LocationSettingRules <<business logic>>
class "Room" as Room <<entity>>
class "CampusBoundary" as CampusBoundary <<entity>>
class "AttendanceConfiguration" as AttendanceConfig <<entity>>

Admin --> AdminUI : 1 configure classroom location
AdminUI --> RoomControl : 1.1 request rooms / submit settings
RoomControl --> Room : 1.1.1 read or update room location settings
RoomControl --> AttendanceConfig : 1.1.2 read default allowed radius
RoomControl --> MobileSensor : 1.1.3 read current location for calibration
RoomControl --> LocationSettingRules : 1.1.4 validate coordinate, campus boundary, and radius values
LocationSettingRules --> CampusBoundary : 1.1.4.1 check university boundary
RoomControl --> AdminUI : 2 return saved result or warning
@enduml
```

---

## **II.3 State diagrams**

### **II.3.1 Session Control state**

`Session Control` is the `«state dependent control»` object for UC05 because it coordinates the lifecycle from scheduled session selection to active check-in, stopped review, optional short reopen, and finalization. The `AttendanceSession` entity records the lifecycle state, but the state machine below belongs to the control object that governs the lifecycle.

#### **Figure II-23 State diagram for Session Control**

```plantuml
@startuml
[*] --> NotStarted
NotStarted --> Active : startAttendance [within scheduled window and no active session]
NotStarted --> NotStarted : startAttendance [outside scheduled window or already active]

Active --> Active : refreshQRCode [configured QR refresh interval]
Active --> Active : refreshPIN [configured PIN refresh interval]
Active --> Stopped : stopReceivingCheckIns

Stopped --> Active : shortReopen [interruption reason and before finalization]
Stopped --> UnderReview : reviewResultsAndRejectedAttempts
UnderReview --> UnderReview : adjustAttendance [UC07]
UnderReview --> Finalized : finalizeAttendance
Finalized --> [*]
@enduml
```

### **II.3.2 CheckInAttempt state**

`CheckInAttempt` has a simple retained-result lifecycle. The detailed identity, code, enrollment, and location validations are modeled in the UC02 and UC04 interaction diagrams rather than as long-lived attempt states.

#### **Figure II-24 State diagram for CheckInAttempt**

```plantuml
@startuml
[*] --> Submitted : checkInEvidenceSubmitted
Submitted --> Accepted : validationAccepted
Submitted --> Rejected : validationRejected
Accepted --> LinkedToOfficialResult : officialResultCreated
Accepted --> DuplicateIgnored : officialResultAlreadyExists
Rejected --> RetainedForReview : retainedForLecturerReview
LinkedToOfficialResult --> [*]
DuplicateIgnored --> [*]
RetainedForReview --> [*]
@enduml
```

### **II.3.3 AttendanceRecord state**

`AttendanceRecord` is state-dependent only for its lifecycle before and after finalization. `AttendanceStatus` remains an attribute with values `Present`, `Late`, or `Absent`; `ResultSource` records whether the value came from QR, PIN, absent assignment, or manual adjustment.

#### **Figure II-25 State diagram for AttendanceRecord**

```plantuml
@startuml
[*] --> Draft : officialResultCreated
Draft --> Draft : statusChanged [reason recorded when manual]
Draft --> Finalized : finalizeAttendance
Finalized --> [*]
@enduml
```

---

## **II.4 Analysis traceability matrix**

| **Requirement / UC** | **Actor** | **Analysis objects** | **Dynamic diagrams** | **Business rules covered** |
| :--- | :--- | :--- | :--- | :--- |
| UC01 Authenticate User | Student, Lecturer, Admin, University Identity System | Role-specific Access Interface, Student Mobile Interface, Lecturer Web Interface, Admin Web Interface, University Identity System Interface, Authentication Control, Authentication Rules, Account | Figure II-3, Figure II-4 | BR-01 |
| UC02 Check In via Dynamic QR Code | Student | Student Mobile Interface, Mobile Device Sensor Interface, Check-in Control, Identity Evidence Rules, Attendance Code Rules, AttendanceConfiguration, Location Distance Calculation, Attendance Status Calculation, AttendanceSession, Session, ClassSectionStudent, Room, CheckInAttempt, AttendanceRecord, Monitor Control | Figure II-5, Figure II-6, Figure II-24, Figure II-25 | BR-02, BR-03, BR-04, BR-05, BR-06, BR-12, BR-13, BR-14, NF-02, NF-06 |
| UC03 View Personal Attendance History | Student | Student Mobile Interface, Attendance History Control, Authentication Rules, ClassSectionStudent, ClassSection, AttendanceRecord | Figure II-7, Figure II-8 | BR-01 |
| UC04 Check In via PIN Fallback | Student | Student Mobile Interface, Mobile Device Sensor Interface, Check-in Control, Identity Evidence Rules, Attendance Code Rules, AttendanceConfiguration, Location Distance Calculation, Attendance Status Calculation, AttendanceSession, Session, ClassSectionStudent, Room, CheckInAttempt, AttendanceRecord, Monitor Control | Figure II-9, Figure II-10, Figure II-24, Figure II-25 | BR-02, BR-03, BR-04, BR-05, BR-06, BR-07, BR-12, BR-13, BR-14, NF-02, NF-06 |
| UC05 Manage Attendance Session | Lecturer | Lecturer Web Interface, Session Control, Session Rules, Attendance Code Rules, AttendanceConfiguration, Session, ClassSectionStudent, AttendanceSession, CheckInAttempt, AttendanceRecord | Figure II-11, Figure II-12, Figure II-23 | BR-02, BR-06, BR-08, BR-10, BR-12, NF-06 |
| UC06 Monitor Attendance in Real Time | Lecturer | Lecturer Web Interface, Monitor Control, Session Rules, AttendanceSession, ClassSectionStudent, AttendanceRecord | Figure II-13, Figure II-14 | NF-01 |
| UC07 Adjust Attendance Manually | Lecturer | Lecturer Web Interface, Adjustment Control, Session Rules, AttendanceRecord, CheckInAttempt | Figure II-15, Figure II-16, Figure II-25 | BR-10 |
| UC08 Export Attendance Report | Lecturer | Lecturer Web Interface, Report Control, Report Eligibility Rules, ClassSectionStudent, Session, AttendanceRecord, CheckInAttempt | Figure II-17, Figure II-18, Figure II-25 | BR-08 |
| UC09 Manage System Catalog | Admin | Admin Web Interface, Catalog Control, Catalog Uniqueness Rules, Account, Student, Lecturer, Subject, ClassSection | Figure II-19, Figure II-20 | BR-11 |
| UC10 Configure Classroom Location | Admin | Admin Web Interface, Mobile Device Sensor Interface, Room Configuration Control, Room Location Setting Rules, CampusBoundary, AttendanceConfiguration, Room | Figure II-21, Figure II-22 | BR-03, NF-06 |
| NF-06 Configurable attendance parameters | Student, Lecturer, Admin | AttendanceConfiguration, Attendance Code Rules, Attendance Status Calculation, Room Configuration Control | Figure II-1, Figure II-5, Figure II-9, Figure II-11, Figure II-21 | NF-06 |
| BR-14 Enrollment authorization | Student, Lecturer | ClassSectionStudent, Session, Check-in Control | Figure II-5, Figure II-9, Figure II-11 | BR-14 |

---

## **II.5 Verification checklist against Section I**

| **Check item** | **Status** | **Evidence in this section** |
| :--- | :--- | :--- |
| UC list matches Requirement Section I.5.2 | Pass | UC01-UC10 only; Figures II-3 through II-22 |
| UC names match Requirement Section I.5.2 | Pass | Headings II.2.1-II.2.10 |
| Analysis uses detailed COMET stereotypes | Pass | Figures II-1 through II-22 use `«user interaction»`, `«device I/O»`, `«coordinator»`, `«state dependent control»`, `«entity»`, `«business logic»`, and `«algorithm»` |
| Interface objects delegate through coordinator/control objects | Pass | Figure II-2 and all interaction diagrams |
| Static data structure is isolated from behavior views | Pass | Figure II-1 contains only entity classes and relationships; Figure II-2 contains only actors, interface objects, and control objects; Section II.2 provides use-case-specific behavior diagrams |
| Mobile device hardware is represented through a device I/O object | Pass | Figure II-2, Figure II-5, Figure II-6, Figure II-9, Figure II-10, Figure II-21, and Figure II-22 use Mobile Device Sensor Interface |
| Entity relationships distinguish lifecycle ownership where appropriate | Pass | Figure II-1 uses composition for study-session-owned attendance lifecycle data and association for campus-room location membership |
| Interface wireframes are included for key actor workflows | Pass | Section II.1.4 covers Student, Lecturer, and Admin wireframes with UC trace notes |
| NF-06 configurable attendance parameters are represented in Analysis | Pass | AttendanceConfiguration appears in Figure II-1 and is used by Attendance Code Rules, Attendance Status Calculation, and Room Configuration Control |
| QR/PIN check-in blocks invalid identity, missing location, and non-enrollment before official results | Pass | Figures II-5 and II-9 |
| BR-13 Late threshold is mapped to status calculation | Pass | Figures II-5 and II-9 use official submitted time, scheduled start time, and configured Late threshold |
| Rejected attempts are retained for lecturer review | Pass | Figures II-5, II-9, II-11, II-24 |
| UC05 includes start, stop, review, short reopen, second stop after reopen, adjustment handoff, Absent assignment, completed-list review, and finalization | Pass | Figure II-11 and Figure II-23 |
| UC07 can create an official result from a reviewed rejected attempt | Pass | Figure II-15 |
| UC06 separates inactive sessions from interrupted live updates | Pass | Figure II-13 |
| UC08 exports only finalized attendance results | Pass | Figure II-17 and Figure II-25 |
| Official attendance results exclude Rejected status | Pass | Figure II-1, Figure II-24, Figure II-25 |
| UC10 validates coordinate, university campus boundary, and radius values | Pass | Figure II-21 |
| Location model supports distance and accuracy checks | Pass | Figure II-1, Figure II-5, Figure II-9, Figure II-21 |
| Removed untraced analysis objects and flows | Pass | Old external-login flow, lecturer location storage, untraced device lifecycle, network evidence details, and unsupported face-matching threshold are not modeled |
