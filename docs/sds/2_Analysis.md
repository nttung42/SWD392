## **II. Analysis models**

This section realizes the AFAS requirements from Section I through COMET analysis objects. The source requirements are the 10 use cases UC01-UC10 and business rules BR-01-BR-13 in [1_Requirement.md](1_Requirement.md). No solution-domain technical decisions are introduced in this phase.

---

## **II.1 Static analysis models**

### **II.1.1 Entity class diagram**

The following entity classes are derived from the Data Requirements in Section I.8 and are used by the interaction diagrams in Section II.2.

#### **Figure II-1 Entity class diagram for AFAS**

```plantuml
@startuml
skinparam style strictuml
hide circle

class "UserAccount" as UserAccount <<entity>> {
  AccountCode
  SchoolEmail
  ProtectedPassword
  FullName
  UserRole
  RegistrationDate
}

class "StudentProfile" as StudentProfile <<entity>> {
  StudentRollNumber
  AccountCode
}

class "LecturerProfile" as LecturerProfile <<entity>> {
  LecturerCode
  AccountCode
  DepartmentName
}

class "Classroom" as Classroom <<entity>> {
  ClassroomCode
  ClassroomName
  ClassroomLocation
  AllowedAttendanceRadius
}

class "Subject" as Subject <<entity>> {
  SubjectCode
  SubjectName
  CreditValue
}

class "ClassSection" as ClassSection <<entity>> {
  ClassSectionCode
  ClassSectionName
  SemesterName
}

class "ClassEnrollment" as ClassEnrollment <<entity>> {
  ClassSectionCode
  StudentRollNumber
}

class "StudySession" as StudySession <<entity>> {
  StudySessionCode
  SessionDate
  StartTime
  EndTime
}

class "AttendanceSession" as AttendanceSession <<entity>> {
  StudySessionCode
  CurrentAttendanceCode
  QRCodeLastChangedAt
  BackupPINCode
  PINLastChangedAt
  LecturerLocation
  SessionStatus
}

class "CheckInAttempt" as CheckInAttempt <<entity>> {
  CheckInAttemptCode
  SubmittedAt
  SubmittedLocation
  DistanceFromClassroom
  LocationCheckResult
  DeviceIdentifier
  DeviceDisplayName
  FaceEvidenceReference
  CheckInMethod
  AttemptStatus
  RejectionReason
}

class "AttendanceRecord" as AttendanceRecord <<entity>> {
  AttendanceRecordCode
  AttendanceStatus
  SourceAttemptCode
  FinalizedAt
}

class "AuditLog" as AuditLog <<entity>> {
  AuditLogCode
  ActorAccountCode
  ActionTime
  ActionType
  ActionDescription
}

UserAccount "1" -- "0..1" StudentProfile
UserAccount "1" -- "0..1" LecturerProfile
LecturerProfile "1" -- "0..*" ClassSection
Subject "1" -- "0..*" ClassSection
ClassSection "1" -- "0..*" ClassEnrollment
StudentProfile "1" -- "0..*" ClassEnrollment
ClassSection "1" -- "0..*" StudySession
Classroom "1" -- "0..*" StudySession
StudySession "1" -- "0..1" AttendanceSession
StudySession "1" -- "0..*" CheckInAttempt
StudentProfile "1" -- "0..*" CheckInAttempt
StudySession "1" -- "0..*" AttendanceRecord
StudentProfile "1" -- "0..*" AttendanceRecord
CheckInAttempt "0..1" -- "0..1" AttendanceRecord : source attempt
UserAccount "1" -- "0..*" AuditLog : actor
@enduml
```

### **II.1.2 Contextual boundary and control class diagram**

This diagram shows how actors enter the system through boundary objects and how boundary objects delegate to control, business logic, algorithm, and entity objects. Boundary objects do not directly manipulate entity objects.

#### **Figure II-2 Contextual boundary class diagram for AFAS**

```plantuml
@startuml
skinparam style strictuml
hide circle

class "Student" as Student <<actor>>
class "Lecturer" as Lecturer <<actor>>
class "Admin" as Admin <<actor>>

class "Student Mobile Interface" as StudentUI <<boundary>>
class "Lecturer Web Interface" as LecturerUI <<boundary>>
class "Admin Web Interface" as AdminUI <<boundary>>
class "User Access Interface" as UserAccessUI <<boundary>>

class "Authentication Control" as AuthControl <<control>>
class "Check-in Control" as CheckInControl <<control>>
class "Session Control" as SessionControl <<state-machine>>
class "Attendance History Control" as HistoryControl <<control>>
class "Monitor Control" as MonitorControl <<control>>
class "Adjustment Control" as AdjustmentControl <<control>>
class "Report Control" as ReportControl <<control>>
class "Catalog Control" as CatalogControl <<control>>
class "Room Configuration Control" as RoomControl <<control>>

class "Authentication Rules" as AuthRules <<business logic>>
class "Attendance Code Rules" as CodeRules <<business logic>>
class "Identity Evidence Rules" as IdentityRules <<business logic>>
class "Session Rules" as SessionRules <<business logic>>
class "Report Eligibility Rules" as ReportRules <<business logic>>
class "Catalog Uniqueness Rules" as CatalogRules <<business logic>>
class "Campus Location Rules" as CampusRules <<business logic>>
class "Location Distance Calculation" as DistanceCalc <<algorithm>>
class "Attendance Status Calculation" as StatusRules <<business logic>>

class "Core Attendance Entities" as Entities <<entity>>

Student --> StudentUI
Lecturer --> LecturerUI
Admin --> AdminUI
Student --> UserAccessUI
Lecturer --> UserAccessUI
Admin --> UserAccessUI

UserAccessUI --> AuthControl
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

AuthControl --> AuthRules
CheckInControl --> CodeRules
CheckInControl --> IdentityRules
CheckInControl --> DistanceCalc
CheckInControl --> StatusRules
SessionControl --> SessionRules
SessionControl --> CodeRules
HistoryControl --> AuthRules
AdjustmentControl --> SessionRules
ReportControl --> ReportRules
CatalogControl --> CatalogRules
RoomControl --> CampusRules
RoomControl --> DistanceCalc

AuthControl --> Entities
CheckInControl --> Entities
SessionControl --> Entities
HistoryControl --> Entities
MonitorControl --> Entities
AdjustmentControl --> Entities
ReportControl --> Entities
CatalogControl --> Entities
RoomControl --> Entities
@enduml
```

### **II.1.3 Object structuring criteria**

| **Object** | **Stereotype** | **Responsibility** | **Trace source** |
| :--- | :--- | :--- | :--- |
| Student Mobile Interface | `«boundary»` | Receives student authentication, QR, PIN, and history actions. | Student; UC01-UC04 |
| Lecturer Web Interface | `«boundary»` | Receives lecturer session, monitor, adjustment, and export actions. | Lecturer; UC01, UC05-UC08 |
| Admin Web Interface | `«boundary»` | Receives administrator catalog and classroom configuration actions. | Admin; UC01, UC09-UC10 |
| User Access Interface | `«boundary»` | Receives common authentication and reset-instruction actions from all user roles. | Student, Lecturer, Admin; UC01 |
| Authentication Control | `«control»` | Coordinates user authentication and role access. | UC01, BR-01 |
| Check-in Control | `«control»` | Coordinates QR/PIN evidence validation and attendance attempt handling. | UC02, UC04 |
| Session Control | `«state-machine»` | Coordinates attendance session lifecycle: active, stopped, reopened, finalized. | UC05, BR-02, BR-08, BR-10, BR-12 |
| Attendance History Control | `«control»` | Coordinates student attendance history retrieval and access checking. | UC03, BR-01 |
| Monitor Control | `«control»` | Coordinates live attendance status visualization. | UC06 |
| Adjustment Control | `«control»` | Coordinates manual attendance status adjustment and audit capture. | UC07, BR-09, BR-10 |
| Report Control | `«control»` | Coordinates finalized attendance report preparation. | UC08, BR-08 |
| Catalog Control | `«control»` | Coordinates catalog creation, update, deletion, and import validation. | UC09, BR-11 |
| Room Configuration Control | `«control»` | Coordinates classroom location and allowed radius configuration. | UC10, BR-03 |
| Attendance Code Rules | `«business logic»` | Checks QR/PIN activity, validity window, and session match. | UC02, UC04, UC05, BR-02, BR-12 |
| Identity Evidence Rules | `«business logic»` | Checks biometric completion or selfie fallback evidence. | UC02, UC04, BR-04 |
| Location Distance Calculation | `«algorithm»` | Calculates distance from submitted location to classroom range. | UC02, UC04, UC10, BR-03 |
| Attendance Status Calculation | `«business logic»` | Determines `Present` or `Late` from accepted check-in time using the 15-minute Late threshold. | UC02, UC04, BR-12, BR-13 |
| Session Rules | `«business logic»` | Checks scheduled time window, assigned lecturer, active session uniqueness, absent assignment, and finalization. | UC05, UC07, BR-08, BR-10 |
| Report Eligibility Rules | `«business logic»` | Ensures export uses finalized attendance results. | UC08, BR-08 |
| Catalog Uniqueness Rules | `«business logic»` | Ensures catalog identifiers are unique. | UC09, BR-11 |
| Campus Location Rules | `«business logic»` | Ensures classroom location settings belong to the university campus. | UC10, BR-03 |
| UserAccount, StudentProfile, LecturerProfile | `«entity»` | Store user and role profile information. | UC01, UC09 |
| Classroom, Subject, ClassSection, ClassEnrollment, StudySession | `«entity»` | Store academic catalog, roster, classroom, and scheduled session information. | UC03, UC05, UC06, UC08-UC10 |
| AttendanceSession, CheckInAttempt, AttendanceRecord, AuditLog | `«entity»` | Store attendance lifecycle, evidence, official result, and audit information. | UC02, UC04-UC08, UC10 |

---

## **II.2 Interaction diagrams**

The following sequence and communication diagrams realize each use case from Section I.5.2. Message wording follows the use case steps and business rules from Section I.6.

### **II.2.1 UC01 - Authenticate User**

#### **Figure II-3 Sequence diagram for UC01 - Authenticate User**

```plantuml
@startuml
skinparam style strictuml
autonumber
actor "Student/Lecturer/Admin" as User
participant "User Access Interface\n«boundary»" as UI
participant "Authentication Control\n«control»" as AuthControl
participant "Authentication Rules\n«business logic»" as AuthRules
participant "UserAccount\n«entity»" as UserAccount

User -> UI : enter assigned school account credentials
UI -> AuthControl : request authentication(credentials)
AuthControl -> UserAccount : find account by submitted identity
UserAccount --> AuthControl : account information or not found
AuthControl -> AuthRules : validate identity and role(account, credentials)
AuthRules --> AuthControl : authentication result

alt authentication succeeds
  AuthControl --> UI : grant role-specific access
  UI --> User : show role homepage
else invalid credentials
  AuthControl --> UI : deny access with error
  UI --> User : show authentication failure
else forgot password selected
  UI -> AuthControl : request reset instruction(account information)
  AuthControl --> UI : reset instruction result
  UI --> User : show reset instruction result
end
@enduml
```

#### **Figure II-4 Communication diagram for UC01 - Authenticate User**

```plantuml
@startuml
class "Student/Lecturer/Admin" as User <<actor>>
class "User Access Interface" as UI <<boundary>>
class "Authentication Control" as AuthControl <<control>>
class "Authentication Rules" as AuthRules <<business logic>>
class "UserAccount" as UserAccount <<entity>>

User --> UI : 1 enter credentials
UI --> AuthControl : 1.1 request authentication
AuthControl --> UserAccount : 1.1.1 find account
AuthControl --> AuthRules : 1.1.2 validate identity and role
AuthControl --> UI : 2 return access result
UI --> User : 3 show homepage or error
@enduml
```

### **II.2.2 UC02 - Check In via Dynamic QR Code**

#### **Figure II-5 Sequence diagram for UC02 - Check In via Dynamic QR Code**

```plantuml
@startuml
skinparam style strictuml
autonumber
actor "Student" as Student
participant "Student Mobile Interface\n«boundary»" as StudentUI
participant "Check-in Control\n«control»" as CheckInControl
participant "Identity Evidence Rules\n«business logic»" as IdentityRules
participant "Attendance Code Rules\n«business logic»" as CodeRules
participant "Location Distance Calculation\n«algorithm»" as DistanceCalc
participant "Attendance Status Calculation\n«business logic»" as StatusRules
participant "AttendanceSession\n«entity»" as AttendanceSession
participant "Classroom\n«entity»" as Classroom
participant "CheckInAttempt\n«entity»" as CheckInAttempt
participant "AttendanceRecord\n«entity»" as AttendanceRecord
participant "Monitor Control\n«control»" as MonitorControl

Student -> StudentUI : tap Scan QR Check-in
StudentUI -> IdentityRules : request identity verification

alt biometric evidence completed
  IdentityRules --> StudentUI : identity evidence accepted
else biometric unavailable
  Student -> StudentUI : capture face selfie as fallback proof
  StudentUI -> IdentityRules : submit fallback proof
  IdentityRules --> StudentUI : fallback proof accepted
else identity verification failed and no valid fallback proof
  IdentityRules --> StudentUI : identity evidence rejected
  StudentUI --> Student : block check-in submission
end

StudentUI --> Student : display camera view
Student -> StudentUI : scan active QR code
StudentUI -> CheckInControl : submit check-in evidence(code, location, device, identity proof)
CheckInControl -> AttendanceSession : read active session code
AttendanceSession --> CheckInControl : active session information
CheckInControl -> CodeRules : verify code active and session match

alt attendance code expired
  CodeRules --> CheckInControl : invalid code
  CheckInControl -> CheckInAttempt : record rejected attempt(status = Rejected, reason = ExpiredCode)
  CheckInControl --> StudentUI : reject QR expired
  StudentUI --> Student : show QR expired message
else location unavailable
  CodeRules --> CheckInControl : code valid
  CheckInControl --> StudentUI : request location services
  StudentUI --> Student : prompt to enable location services
else code valid and location available
  CodeRules --> CheckInControl : code valid
  CheckInControl -> Classroom : read allowed attendance range
  Classroom --> CheckInControl : classroom range
  CheckInControl -> DistanceCalc : compare submitted location with classroom range
  DistanceCalc --> CheckInControl : location check result

  alt outside allowed range
    CheckInControl -> CheckInAttempt : record rejected attempt(status = Rejected, reason = OutsideLocation)
    CheckInControl --> StudentUI : reject outside classroom range
    StudentUI --> Student : show check-in not accepted
  else within allowed range
    CheckInControl -> CheckInAttempt : record accepted attempt(status = Accepted, method = QR)
    CheckInControl -> AttendanceRecord : check existing official result
    AttendanceRecord --> CheckInControl : existing result or none
    alt official result already exists
      CheckInControl --> StudentUI : return existing official result
      StudentUI --> Student : show existing result
    else no official result exists
      CheckInControl -> StatusRules : determine Present or Late using 15-minute threshold
      StatusRules --> CheckInControl : official status
      CheckInControl -> AttendanceRecord : register official result
      CheckInControl -> MonitorControl : publish attendance status update
      CheckInControl --> StudentUI : check-in accepted
      StudentUI --> Student : show successful check-in time
    end
  end
end
@enduml
```

#### **Figure II-6 Communication diagram for UC02 - Check In via Dynamic QR Code**

```plantuml
@startuml
class "Student" as Student <<actor>>
class "Student Mobile Interface" as StudentUI <<boundary>>
class "Check-in Control" as CheckInControl <<control>>
class "Identity Evidence Rules" as IdentityRules <<business logic>>
class "Attendance Code Rules" as CodeRules <<business logic>>
class "Location Distance Calculation" as DistanceCalc <<algorithm>>
class "Attendance Status Calculation" as StatusRules <<business logic>>
class "AttendanceSession" as AttendanceSession <<entity>>
class "Classroom" as Classroom <<entity>>
class "CheckInAttempt" as CheckInAttempt <<entity>>
class "AttendanceRecord" as AttendanceRecord <<entity>>
class "Monitor Control" as MonitorControl <<control>>

Student --> StudentUI : 1 tap Scan QR
StudentUI --> IdentityRules : 1.1 verify identity or fallback proof
StudentUI --> CheckInControl : 2 submit QR evidence
CheckInControl --> AttendanceSession : 2.1 read active session
CheckInControl --> CodeRules : 2.2 verify active code
CheckInControl --> Classroom : 2.3 read classroom range
CheckInControl --> DistanceCalc : 2.4 compare location
CheckInControl --> CheckInAttempt : 2.5 record attempt
CheckInControl --> AttendanceRecord : 2.6 check/register official result
CheckInControl --> StatusRules : 2.7 determine Present/Late by threshold
CheckInControl --> MonitorControl : 2.8 update lecturer monitor
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
participant "Student Mobile Interface\n«boundary»" as StudentUI
participant "Attendance History Control\n«control»" as HistoryControl
participant "Authentication Rules\n«business logic»" as AuthRules
participant "ClassEnrollment\n«entity»" as ClassEnrollment
participant "ClassSection\n«entity»" as ClassSection
participant "AttendanceRecord\n«entity»" as AttendanceRecord

Student -> StudentUI : select History tab
StudentUI -> HistoryControl : request personal attendance history(student)
HistoryControl -> AuthRules : check student access

alt access allowed
  AuthRules --> HistoryControl : allowed
  HistoryControl -> ClassEnrollment : read enrolled class sections
  ClassEnrollment --> HistoryControl : class section references
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
class "Student Mobile Interface" as StudentUI <<boundary>>
class "Attendance History Control" as HistoryControl <<control>>
class "Authentication Rules" as AuthRules <<business logic>>
class "ClassEnrollment" as ClassEnrollment <<entity>>
class "ClassSection" as ClassSection <<entity>>
class "AttendanceRecord" as AttendanceRecord <<entity>>

Student --> StudentUI : 1 select History tab
StudentUI --> HistoryControl : 1.1 request history
HistoryControl --> AuthRules : 1.1.1 check access
HistoryControl --> ClassEnrollment : 1.1.2 read enrolled sections
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
participant "Student Mobile Interface\n«boundary»" as StudentUI
participant "Check-in Control\n«control»" as CheckInControl
participant "Identity Evidence Rules\n«business logic»" as IdentityRules
participant "Attendance Code Rules\n«business logic»" as CodeRules
participant "Location Distance Calculation\n«algorithm»" as DistanceCalc
participant "Attendance Status Calculation\n«business logic»" as StatusRules
participant "AttendanceSession\n«entity»" as AttendanceSession
participant "Classroom\n«entity»" as Classroom
participant "CheckInAttempt\n«entity»" as CheckInAttempt
participant "AttendanceRecord\n«entity»" as AttendanceRecord

Student -> StudentUI : select PIN Check-in
StudentUI -> IdentityRules : request identity verification

alt biometric evidence completed
  IdentityRules --> StudentUI : identity evidence accepted
else biometric unavailable
  Student -> StudentUI : capture face selfie as fallback proof
  StudentUI -> IdentityRules : submit fallback proof
  IdentityRules --> StudentUI : fallback proof accepted
else identity verification failed and no valid fallback proof
  IdentityRules --> StudentUI : identity evidence rejected
  StudentUI --> Student : block check-in submission
end

StudentUI --> Student : display PIN input screen
Student -> StudentUI : enter active 6-digit PIN
StudentUI -> CheckInControl : submit PIN evidence(pin, location, device, identity proof)
CheckInControl -> AttendanceSession : read active PIN session
AttendanceSession --> CheckInControl : active session information
CheckInControl -> CodeRules : verify PIN is active

alt PIN expired
  CodeRules --> CheckInControl : invalid PIN
  CheckInControl -> CheckInAttempt : record rejected attempt(status = Rejected, reason = ExpiredCode)
  CheckInControl --> StudentUI : reject PIN expired
  StudentUI --> Student : show PIN expired message
else location unavailable
  CodeRules --> CheckInControl : PIN valid
  CheckInControl --> StudentUI : request location services
  StudentUI --> Student : prompt to enable location services
else PIN valid and location available
  CodeRules --> CheckInControl : PIN valid
  CheckInControl -> Classroom : read allowed attendance range
  Classroom --> CheckInControl : classroom range
  CheckInControl -> DistanceCalc : compare submitted location with classroom range
  DistanceCalc --> CheckInControl : location check result

  alt outside allowed range
    CheckInControl -> CheckInAttempt : record rejected attempt(status = Rejected, reason = OutsideLocation)
    CheckInControl --> StudentUI : reject outside classroom range
    StudentUI --> Student : show check-in not accepted
  else within allowed range
    CheckInControl -> CheckInAttempt : record accepted attempt(status = Accepted, method = PIN)
    CheckInControl -> AttendanceRecord : check existing official result
    AttendanceRecord --> CheckInControl : existing result or none
    alt official result already exists
      CheckInControl --> StudentUI : return existing official result
      StudentUI --> Student : show existing result
    else no official result exists
      CheckInControl -> StatusRules : determine Present or Late using 15-minute threshold
      StatusRules --> CheckInControl : official status
      CheckInControl -> AttendanceRecord : register official result
      CheckInControl --> StudentUI : check-in accepted
      StudentUI --> Student : show successful PIN check-in
    end
  end
end
@enduml
```

#### **Figure II-10 Communication diagram for UC04 - Check In via PIN Fallback**

```plantuml
@startuml
class "Student" as Student <<actor>>
class "Student Mobile Interface" as StudentUI <<boundary>>
class "Check-in Control" as CheckInControl <<control>>
class "Identity Evidence Rules" as IdentityRules <<business logic>>
class "Attendance Code Rules" as CodeRules <<business logic>>
class "Location Distance Calculation" as DistanceCalc <<algorithm>>
class "Attendance Status Calculation" as StatusRules <<business logic>>
class "AttendanceSession" as AttendanceSession <<entity>>
class "Classroom" as Classroom <<entity>>
class "CheckInAttempt" as CheckInAttempt <<entity>>
class "AttendanceRecord" as AttendanceRecord <<entity>>

Student --> StudentUI : 1 select PIN Check-in
StudentUI --> IdentityRules : 1.1 verify identity or fallback proof
Student --> StudentUI : 2 enter PIN
StudentUI --> CheckInControl : 2.1 submit PIN evidence
CheckInControl --> AttendanceSession : 2.1.1 read active PIN
CheckInControl --> CodeRules : 2.1.2 verify PIN
CheckInControl --> Classroom : 2.1.3 read classroom range
CheckInControl --> DistanceCalc : 2.1.4 compare location
CheckInControl --> CheckInAttempt : 2.1.5 record attempt
CheckInControl --> AttendanceRecord : 2.1.6 check/register official result
CheckInControl --> StatusRules : 2.1.7 determine Present/Late by threshold
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
participant "Lecturer Web Interface\n«boundary»" as LecturerUI
participant "Session Control\n«state-machine»" as SessionControl
participant "Session Rules\n«business logic»" as SessionRules
participant "Attendance Code Rules\n«business logic»" as CodeRules
participant "StudySession\n«entity»" as StudySession
participant "ClassEnrollment\n«entity»" as ClassEnrollment
participant "AttendanceSession\n«entity»" as AttendanceSession
participant "CheckInAttempt\n«entity»" as CheckInAttempt
participant "AttendanceRecord\n«entity»" as AttendanceRecord

Lecturer -> LecturerUI : navigate to My Scheduled Classes
LecturerUI -> SessionControl : request assigned scheduled sessions
SessionControl -> StudySession : read sessions assigned to lecturer
StudySession --> SessionControl : scheduled sessions
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
  CodeRules --> SessionControl : current QR and PIN codes
  SessionControl -> AttendanceSession : update current QR and PIN codes
  SessionControl --> LecturerUI : show projector view with QR, PIN, and progress

  loop while session is active
    SessionControl -> CodeRules : refresh QR every 10 seconds and PIN every 30 seconds
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

  SessionControl -> ClassEnrollment : read enrolled students
  ClassEnrollment --> SessionControl : enrolled students
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
class "Lecturer Web Interface" as LecturerUI <<boundary>>
class "Session Control" as SessionControl <<state-machine>>
class "Session Rules" as SessionRules <<business logic>>
class "Attendance Code Rules" as CodeRules <<business logic>>
class "StudySession" as StudySession <<entity>>
class "ClassEnrollment" as ClassEnrollment <<entity>>
class "AttendanceSession" as AttendanceSession <<entity>>
class "CheckInAttempt" as CheckInAttempt <<entity>>
class "AttendanceRecord" as AttendanceRecord <<entity>>

Lecturer --> LecturerUI : 1 manage scheduled session
LecturerUI --> SessionControl : 1.1 request sessions/start/stop/reopen/finalize
SessionControl --> StudySession : 1.1.1 read assigned sessions
SessionControl --> SessionRules : 1.1.2 validate lifecycle action
SessionControl --> AttendanceSession : 1.1.3 activate, stop, reopen, or finalize
SessionControl --> CodeRules : 1.1.4 prepare and refresh QR/PIN codes
SessionControl --> AttendanceRecord : 1.1.5 read results, assign Absent, finalize
SessionControl --> CheckInAttempt : 1.1.6 read rejected attempts
SessionControl --> ClassEnrollment : 1.1.7 read enrolled students
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
participant "Lecturer Web Interface\n«boundary»" as LecturerUI
participant "Monitor Control\n«control»" as MonitorControl
participant "Session Rules\n«business logic»" as SessionRules
participant "AttendanceSession\n«entity»" as AttendanceSession
participant "ClassEnrollment\n«entity»" as ClassEnrollment
participant "AttendanceRecord\n«entity»" as AttendanceRecord

Lecturer -> LecturerUI : open live attendance monitor
LecturerUI -> MonitorControl : request active session monitor
MonitorControl -> AttendanceSession : read attendance session status
AttendanceSession --> MonitorControl : session status
MonitorControl -> SessionRules : verify session is active

alt session is active
  SessionRules --> MonitorControl : monitor allowed
  MonitorControl -> ClassEnrollment : read class roster
  ClassEnrollment --> MonitorControl : enrolled students
  MonitorControl -> AttendanceRecord : read current attendance statuses
  AttendanceRecord --> MonitorControl : current statuses
  MonitorControl --> LecturerUI : student grid and attendance count
  LecturerUI --> Lecturer : show live grid

  loop as accepted check-ins occur through UC02 or UC04
    MonitorControl -> AttendanceRecord : read changed official result
    AttendanceRecord --> MonitorControl : changed status
    MonitorControl --> LecturerUI : update student tile and count
    LecturerUI --> Lecturer : show Present or Late status update
  end
else live updates interrupted
  MonitorControl --> LecturerUI : monitoring interruption
  LecturerUI --> Lecturer : show warning and allow refresh
end
@enduml
```

#### **Figure II-14 Communication diagram for UC06 - Monitor Attendance in Real Time**

```plantuml
@startuml
class "Lecturer" as Lecturer <<actor>>
class "Lecturer Web Interface" as LecturerUI <<boundary>>
class "Monitor Control" as MonitorControl <<control>>
class "Session Rules" as SessionRules <<business logic>>
class "AttendanceSession" as AttendanceSession <<entity>>
class "ClassEnrollment" as ClassEnrollment <<entity>>
class "AttendanceRecord" as AttendanceRecord <<entity>>

Lecturer --> LecturerUI : 1 open monitor
LecturerUI --> MonitorControl : 1.1 request active session monitor
MonitorControl --> AttendanceSession : 1.1.1 read session status
MonitorControl --> SessionRules : 1.1.2 verify active session
MonitorControl --> ClassEnrollment : 1.1.3 read roster
MonitorControl --> AttendanceRecord : 1.1.4 read current and changed statuses
MonitorControl --> LecturerUI : 2 update grid and count
@enduml
```

### **II.2.7 UC07 - Adjust Attendance Manually**

#### **Figure II-15 Sequence diagram for UC07 - Adjust Attendance Manually**

```plantuml
@startuml
skinparam style strictuml
autonumber
actor "Lecturer" as Lecturer
participant "Lecturer Web Interface\n«boundary»" as LecturerUI
participant "Adjustment Control\n«control»" as AdjustmentControl
participant "Session Rules\n«business logic»" as SessionRules
participant "AttendanceRecord\n«entity»" as AttendanceRecord
participant "CheckInAttempt\n«entity»" as CheckInAttempt
participant "AuditLog\n«entity»" as AuditLog

Lecturer -> LecturerUI : select student or rejected attempt and click Adjust Status
LecturerUI -> AdjustmentControl : request adjustment context
AdjustmentControl -> AttendanceRecord : read current official status
AttendanceRecord --> AdjustmentControl : current status
AdjustmentControl -> CheckInAttempt : read evidence summary if available
CheckInAttempt --> AdjustmentControl : evidence summary
AdjustmentControl --> LecturerUI : show Present, Late, Absent options and evidence summary
Lecturer -> LecturerUI : select official status, enter reason, and save
LecturerUI -> AdjustmentControl : submit adjustment(new status, reason)
AdjustmentControl -> SessionRules : verify assigned lecturer can manage session

alt reason is missing
  AdjustmentControl --> LecturerUI : reason required
  LecturerUI --> Lecturer : prompt to write reason
else adjustment allowed
  SessionRules --> AdjustmentControl : allowed
  AdjustmentControl -> AuditLog : record previous status, new status, reason, lecturer, adjustment time
  AdjustmentControl -> AttendanceRecord : update official result to Present, Late, or Absent
  AdjustmentControl --> LecturerUI : adjustment saved
  LecturerUI --> Lecturer : show updated student status
end
@enduml
```

#### **Figure II-16 Communication diagram for UC07 - Adjust Attendance Manually**

```plantuml
@startuml
class "Lecturer" as Lecturer <<actor>>
class "Lecturer Web Interface" as LecturerUI <<boundary>>
class "Adjustment Control" as AdjustmentControl <<control>>
class "Session Rules" as SessionRules <<business logic>>
class "AttendanceRecord" as AttendanceRecord <<entity>>
class "CheckInAttempt" as CheckInAttempt <<entity>>
class "AuditLog" as AuditLog <<entity>>

Lecturer --> LecturerUI : 1 select student/attempt and save adjustment
LecturerUI --> AdjustmentControl : 1.1 request context / submit adjustment
AdjustmentControl --> AttendanceRecord : 1.1.1 read/update official status
AdjustmentControl --> CheckInAttempt : 1.1.2 read evidence summary
AdjustmentControl --> SessionRules : 1.1.3 verify lecturer permission
AdjustmentControl --> AuditLog : 1.1.4 record adjustment details
AdjustmentControl --> LecturerUI : 2 show success or missing reason
@enduml
```

### **II.2.8 UC08 - Export Attendance Report**

#### **Figure II-17 Sequence diagram for UC08 - Export Attendance Report**

```plantuml
@startuml
skinparam style strictuml
autonumber
actor "Lecturer" as Lecturer
participant "Lecturer Web Interface\n«boundary»" as LecturerUI
participant "Report Control\n«control»" as ReportControl
participant "Report Eligibility Rules\n«business logic»" as ReportRules
participant "ClassEnrollment\n«entity»" as ClassEnrollment
participant "StudySession\n«entity»" as StudySession
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
  ReportControl -> ClassEnrollment : read roster
  ClassEnrollment --> ReportControl : student roster
  ReportControl -> StudySession : read class sessions
  StudySession --> ReportControl : session dates
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
class "Lecturer Web Interface" as LecturerUI <<boundary>>
class "Report Control" as ReportControl <<control>>
class "Report Eligibility Rules" as ReportRules <<business logic>>
class "ClassEnrollment" as ClassEnrollment <<entity>>
class "StudySession" as StudySession <<entity>>
class "AttendanceRecord" as AttendanceRecord <<entity>>
class "CheckInAttempt" as CheckInAttempt <<entity>>

Lecturer --> LecturerUI : 1 click Export Report
LecturerUI --> ReportControl : 1.1 request report
ReportControl --> ReportRules : 1.1.1 verify finalized results
ReportControl --> ClassEnrollment : 1.1.2 read roster
ReportControl --> StudySession : 1.1.3 read sessions
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
participant "Admin Web Interface\n«boundary»" as AdminUI
participant "Catalog Control\n«control»" as CatalogControl
participant "Catalog Uniqueness Rules\n«business logic»" as CatalogRules
participant "UserAccount\n«entity»" as UserAccount
participant "StudentProfile\n«entity»" as StudentProfile
participant "LecturerProfile\n«entity»" as LecturerProfile
participant "Subject\n«entity»" as Subject
participant "ClassSection\n«entity»" as ClassSection
participant "AuditLog\n«entity»" as AuditLog

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
  CatalogControl -> UserAccount : record valid imported accounts
  CatalogControl -> StudentProfile : record valid imported students
  CatalogControl -> Subject : record valid imported subjects
  CatalogControl -> AuditLog : record administrative action
  CatalogControl --> AdminUI : import result
  AdminUI --> Admin : show imported records and validation feedback
else valid single change
  CatalogRules --> CatalogControl : valid change
  CatalogControl -> UserAccount : record user account change when applicable
  CatalogControl -> StudentProfile : record student profile change when applicable
  CatalogControl -> LecturerProfile : record lecturer profile change when applicable
  CatalogControl -> Subject : record subject change when applicable
  CatalogControl -> ClassSection : record class section change when applicable
  CatalogControl -> AuditLog : record administrative action
  CatalogControl --> AdminUI : catalog updated
  AdminUI --> Admin : refresh catalog grid
end
@enduml
```

#### **Figure II-20 Communication diagram for UC09 - Manage System Catalog**

```plantuml
@startuml
class "Admin" as Admin <<actor>>
class "Admin Web Interface" as AdminUI <<boundary>>
class "Catalog Control" as CatalogControl <<control>>
class "Catalog Uniqueness Rules" as CatalogRules <<business logic>>
class "UserAccount" as UserAccount <<entity>>
class "StudentProfile" as StudentProfile <<entity>>
class "LecturerProfile" as LecturerProfile <<entity>>
class "Subject" as Subject <<entity>>
class "ClassSection" as ClassSection <<entity>>
class "AuditLog" as AuditLog <<entity>>

Admin --> AdminUI : 1 manage catalog
AdminUI --> CatalogControl : 1.1 view/add/edit/delete/import records
CatalogControl --> CatalogRules : 1.1.1 validate fields and uniqueness
CatalogControl --> UserAccount : 1.1.2 record account change
CatalogControl --> StudentProfile : 1.1.3 record student change
CatalogControl --> LecturerProfile : 1.1.4 record lecturer change
CatalogControl --> Subject : 1.1.5 record subject change
CatalogControl --> ClassSection : 1.1.6 record class section change
CatalogControl --> AuditLog : 1.1.7 record admin action
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
participant "Admin Web Interface\n«boundary»" as AdminUI
participant "Room Configuration Control\n«control»" as RoomControl
participant "Campus Location Rules\n«business logic»" as CampusRules
participant "Location Distance Calculation\n«algorithm»" as DistanceCalc
participant "Classroom\n«entity»" as Classroom
participant "AuditLog\n«entity»" as AuditLog

Admin -> AdminUI : click Room Management
AdminUI -> RoomControl : request classroom list
RoomControl -> Classroom : read physical classrooms
Classroom --> RoomControl : classroom list
RoomControl --> AdminUI : classroom list with configuration action
Admin -> AdminUI : select classroom and configure location
AdminUI --> Admin : show location and allowed radius form

alt on-site calibration
  Admin -> AdminUI : capture current location
  AdminUI --> Admin : populate captured location values
else manual entry
  Admin -> AdminUI : enter classroom center point
end

Admin -> AdminUI : enter allowed radius and save configuration
AdminUI -> RoomControl : submit location settings
RoomControl -> CampusRules : verify location belongs to university campus
RoomControl -> DistanceCalc : validate allowed radius consistency

alt out-of-bounds location
  CampusRules --> RoomControl : location outside campus boundary
  RoomControl --> AdminUI : warning to verify location values
  AdminUI --> Admin : show out-of-bounds warning
else location accepted
  CampusRules --> RoomControl : campus location accepted
  DistanceCalc --> RoomControl : radius accepted
  RoomControl -> Classroom : update room location settings
  RoomControl -> AuditLog : record administrative action
  RoomControl --> AdminUI : configuration saved
  AdminUI --> Admin : show saved configuration
end
@enduml
```

#### **Figure II-22 Communication diagram for UC10 - Configure Classroom Location**

```plantuml
@startuml
class "Admin" as Admin <<actor>>
class "Admin Web Interface" as AdminUI <<boundary>>
class "Room Configuration Control" as RoomControl <<control>>
class "Campus Location Rules" as CampusRules <<business logic>>
class "Location Distance Calculation" as DistanceCalc <<algorithm>>
class "Classroom" as Classroom <<entity>>
class "AuditLog" as AuditLog <<entity>>

Admin --> AdminUI : 1 configure classroom location
AdminUI --> RoomControl : 1.1 request rooms / submit settings
RoomControl --> Classroom : 1.1.1 read or update classroom settings
RoomControl --> CampusRules : 1.1.2 verify campus boundary
RoomControl --> DistanceCalc : 1.1.3 validate allowed radius
RoomControl --> AuditLog : 1.1.4 record admin action
RoomControl --> AdminUI : 2 return saved result or warning
@enduml
```

---

## **II.3 State diagrams**

### **II.3.1 AttendanceSession state**

`AttendanceSession` is state-dependent because UC05 requires a lifecycle from scheduled session selection to active check-in, stopped review, optional short reopen, and finalization.

#### **Figure II-23 State diagram for AttendanceSession**

```plantuml
@startuml
[*] --> NotStarted
NotStarted --> Active : startAttendance [within scheduled window and no active session]
NotStarted --> NotStarted : startAttendance [outside scheduled window or already active]

Active --> Active : refreshQRCode [every 10 seconds]
Active --> Active : refreshPIN [every 30 seconds]
Active --> Stopped : stopReceivingCheckIns

Stopped --> Active : shortReopen [interruption reason and before finalization]
Stopped --> UnderReview : reviewResultsAndRejectedAttempts
UnderReview --> UnderReview : adjustAttendance [UC07]
UnderReview --> Finalized : finalizeAttendance
Finalized --> [*]
@enduml
```

### **II.3.2 CheckInAttempt state**

`CheckInAttempt` is state-dependent because UC02 and UC04 require rejected attempts to be retained for lecturer review while accepted attempts may become the source for one official attendance result.

#### **Figure II-24 State diagram for CheckInAttempt**

```plantuml
@startuml
[*] --> Blocked : identityEvidenceFailedAndNoFallback
[*] --> Submitted : checkInEvidenceSubmitted
Submitted --> IdentityAccepted : identityEvidenceAccepted
IdentityAccepted --> CodeValid : QRorPINActive
IdentityAccepted --> Rejected : QRorPINExpired
CodeValid --> LocationAvailable : locationProvided
CodeValid --> Blocked : locationUnavailable
LocationAvailable --> Rejected : outsideAllowedRange
LocationAvailable --> Accepted : withinAllowedRange
Accepted --> LinkedToOfficialResult : officialResultCreated
Accepted --> DuplicateIgnored : officialResultAlreadyExists
Rejected --> RetainedForReview
Blocked --> [*]
LinkedToOfficialResult --> [*]
DuplicateIgnored --> [*]
RetainedForReview --> [*]
@enduml
```

### **II.3.3 AttendanceRecord state**

`AttendanceRecord` is state-dependent because UC02, UC04, UC05, UC07, and UC08 distinguish pending, official Present/Late/Absent, adjusted, finalized, and exportable attendance results. Rejected check-ins remain in `CheckInAttempt` and are not official attendance results.

#### **Figure II-25 State diagram for AttendanceRecord**

```plantuml
@startuml
[*] --> NotRecorded
NotRecorded --> OfficialPresent : acceptedCheckIn [within first 15 minutes]
NotRecorded --> OfficialLate : acceptedCheckIn [later than first 15 minutes]
NotRecorded --> OfficialAbsent : finalizePreparation [no official Present or Late]

OfficialPresent --> Adjusted : adjustStatus [reason provided]
OfficialLate --> Adjusted : adjustStatus [reason provided]
OfficialAbsent --> Adjusted : adjustStatus [reason provided]

Adjusted --> Finalized : finalizeAttendance
OfficialPresent --> Finalized : finalizeAttendance
OfficialLate --> Finalized : finalizeAttendance
OfficialAbsent --> Finalized : finalizeAttendance

Finalized --> Exportable : reportRequested
Exportable --> [*]
@enduml
```

---

## **II.4 Analysis traceability matrix**

| **Requirement / UC** | **Actor** | **Analysis objects** | **Dynamic diagrams** | **Business rules covered** |
| :--- | :--- | :--- | :--- | :--- |
| UC01 Authenticate User | Student, Lecturer, Admin | User Access Interface, Authentication Control, Authentication Rules, UserAccount | Figure II-3, Figure II-4 | BR-01 |
| UC02 Check In via Dynamic QR Code | Student | Student Mobile Interface, Check-in Control, Identity Evidence Rules, Attendance Code Rules, Location Distance Calculation, Attendance Status Calculation, AttendanceSession, Classroom, CheckInAttempt, AttendanceRecord, Monitor Control | Figure II-5, Figure II-6, Figure II-24, Figure II-25 | BR-02, BR-03, BR-04, BR-05, BR-06, BR-12, BR-13 |
| UC03 View Personal Attendance History | Student | Student Mobile Interface, Attendance History Control, Authentication Rules, ClassEnrollment, ClassSection, AttendanceRecord | Figure II-7, Figure II-8 | BR-01 |
| UC04 Check In via PIN Fallback | Student | Student Mobile Interface, Check-in Control, Identity Evidence Rules, Attendance Code Rules, Location Distance Calculation, Attendance Status Calculation, AttendanceSession, Classroom, CheckInAttempt, AttendanceRecord | Figure II-9, Figure II-10, Figure II-24, Figure II-25 | BR-03, BR-04, BR-05, BR-06, BR-07, BR-12, BR-13 |
| UC05 Manage Attendance Session | Lecturer | Lecturer Web Interface, Session Control, Session Rules, Attendance Code Rules, StudySession, ClassEnrollment, AttendanceSession, CheckInAttempt, AttendanceRecord | Figure II-11, Figure II-12, Figure II-23 | BR-02, BR-06, BR-08, BR-10, BR-12 |
| UC06 Monitor Attendance in Real Time | Lecturer | Lecturer Web Interface, Monitor Control, Session Rules, AttendanceSession, ClassEnrollment, AttendanceRecord | Figure II-13, Figure II-14 | NF-01 |
| UC07 Adjust Attendance Manually | Lecturer | Lecturer Web Interface, Adjustment Control, Session Rules, AttendanceRecord, CheckInAttempt, AuditLog | Figure II-15, Figure II-16, Figure II-25 | BR-09, BR-10 |
| UC08 Export Attendance Report | Lecturer | Lecturer Web Interface, Report Control, Report Eligibility Rules, ClassEnrollment, StudySession, AttendanceRecord, CheckInAttempt | Figure II-17, Figure II-18, Figure II-25 | BR-08 |
| UC09 Manage System Catalog | Admin | Admin Web Interface, Catalog Control, Catalog Uniqueness Rules, UserAccount, StudentProfile, LecturerProfile, Subject, ClassSection, AuditLog | Figure II-19, Figure II-20 | BR-11 |
| UC10 Configure Classroom Location | Admin | Admin Web Interface, Room Configuration Control, Campus Location Rules, Location Distance Calculation, Classroom, AuditLog | Figure II-21, Figure II-22 | BR-03 |

---

## **II.5 Verification checklist against Section I**

| **Check item** | **Result** | **Evidence in this section** |
| :--- | :--- | :--- |
| UC list matches Requirement Section I.5.2 | Pass | UC01-UC10 only; Figures II-3 through II-22 |
| UC names match Requirement Section I.5.2 | Pass | Headings II.2.1-II.2.10 |
| Analysis uses COMET stereotypes | Pass | Figures II-1 through II-22 use `«boundary»`, `«control»`, `«state-machine»`, `«entity»`, `«business logic»`, and `«algorithm»` |
| Boundary objects delegate through control or logic objects | Pass | Figure II-2 and all interaction diagrams |
| QR/PIN check-in records attempts before official results | Pass | Figures II-5, II-9, II-24 |
| BR-13 Late threshold is mapped to status calculation | Pass | Figures II-5, II-9, Figure II-25 |
| Rejected attempts are retained for lecturer review | Pass | Figures II-5, II-9, II-11, II-24 |
| UC05 includes start, stop, review, short reopen, adjustment handoff, Absent assignment, completed-list review, and finalization | Pass | Figure II-11 and Figure II-23 |
| UC07 records previous status, new status, reason, lecturer, and adjustment time | Pass | Figure II-15 |
| UC08 exports only finalized attendance results | Pass | Figure II-17 and Figure II-25 |
| Official attendance results exclude Rejected status | Pass | Figure II-1, Figure II-24, Figure II-25 |
| UC10 validates campus boundary and records audit action | Pass | Figure II-21 |
| Removed untraced analysis objects and flows | Pass | Old external-login flow, untraced device lifecycle, network evidence details, and unsupported face-matching threshold are not modeled |
