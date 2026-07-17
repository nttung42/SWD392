## **Sequence Diagrams (Simplified)**

This file holds simplified sequence diagrams factored out of [2_Analysis.md](2_Analysis.md). They preserve the main and key alternative flows of each use case while reducing entity-by-entity lifelines and deep `alt` nesting. The full detailed interaction diagrams (with every entity lifeline) and the communication diagrams remain in [2_Analysis.md](2_Analysis.md).

Simplification approach:

- Entity reads/writes are omitted from these diagrams instead of shown as separate entity lifelines. Full entity access is still traceable via the communication diagrams in Section II.2 of [2_Analysis.md](2_Analysis.md).
- Business rule checks are evaluated inside the `«business logic»` object, which returns a single business result. The coordinator then selects one flat outcome branch.

Scope of this file: UC02, UC04, UC05.

---

### **UC02 - Check In via Dynamic QR Code**

The rule checks (code validity and Present/Late classification) are evaluated inside `CheckInService`, which returns a single business result. The coordinator selects one flat outcome branch. Location is captured and stored for information only; it never causes a rejection and is not required. Rejection reasons are listed in the catalog below.

```plantuml
@startuml
skinparam style strictuml
autonumber
actor "Student\n«external user»" as Student
participant "StudentInteraction\n«user interaction»" as StudentUI
participant "LecturerInteraction\n«user interaction»" as LecturerUI
participant "AttendanceCoordinator\n«coordinator»" as CheckInControl
participant "MobileDeviceInterface\n«device I/O»" as MobileSensor
participant "Mobile Device Hardware\n«external device»" as MobileHardware
participant "CheckInService\n«business logic»" as AttendanceRules

Student -> StudentUI : tap Scan QR Check-in
StudentUI -> CheckInControl : request identity verification
CheckInControl -> MobileSensor : perform biometric check
MobileSensor -> MobileHardware : request biometric verification

alt local biometric verification completed
  MobileHardware --> MobileSensor : biometric verification result
  MobileSensor --> CheckInControl : local biometric verification result
  CheckInControl -> AttendanceRules : validate local verification result
  AttendanceRules --> CheckInControl : identity evidence accepted
else biometric unavailable - face selfie fallback
  Student -> StudentUI : capture face selfie as fallback proof
  StudentUI -> CheckInControl : submit fallback proof
  CheckInControl -> MobileSensor : access camera and capture selfie
  MobileSensor -> MobileHardware : request camera evidence
  MobileHardware --> MobileSensor : face proof
  MobileSensor --> CheckInControl : face proof
  CheckInControl -> AttendanceRules : validate fallback proof
  AttendanceRules --> CheckInControl : fallback proof accepted
end
CheckInControl --> StudentUI : identity verification accepted

StudentUI --> Student : display camera view
Student -> StudentUI : scan active QR code
StudentUI -> CheckInControl : submit scanned code
CheckInControl -> MobileSensor : read GPS coordinates and device identifier (best effort)
MobileSensor --> CheckInControl : location and device evidence, or location unavailable
CheckInControl -> AttendanceRules : submit QR check-in evidence(scanned code, identity, location or unavailable, device)
AttendanceRules --> CheckInControl : result(accepted | rejected)

alt check-in accepted
  CheckInControl --> StudentUI : check-in accepted(official status)
  CheckInControl --> LecturerUI : attendance result changed for live monitor
  StudentUI --> Student : show successful check-in time
else check-in rejected
  CheckInControl --> StudentUI : reject check-in(reason)
  StudentUI --> Student : show rejection reason
end
@enduml
```

**Rejection reason catalog (UC02):** rules are checked in this order; the first failure sets `AttendanceRecord.RejectionReason`. Location is never a rejection reason.

| **Order** | **Reason**        | **Rule check**                                                                  | **Trace** |
| :-------- | :---------------- | :------------------------------------------------------------------------------ | :-------- |
| 1         | `ExpiredCode`     | Scanned QR is no longer valid (a newer QR has been generated at the refresh interval). | BR-02     |

---

### **UC04 - Check In via PIN**

Symmetric with UC02: identity is verified inline, then `CheckInService` evaluates all PIN rules and returns one business result, and the coordinator selects one flat outcome branch.

```plantuml
@startuml
skinparam style strictuml
autonumber
actor "Student\n«external user»" as Student
participant "StudentInteraction\n«user interaction»" as StudentUI
participant "LecturerInteraction\n«user interaction»" as LecturerUI
participant "AttendanceCoordinator\n«coordinator»" as CheckInControl
participant "MobileDeviceInterface\n«device I/O»" as MobileSensor
participant "Mobile Device Hardware\n«external device»" as MobileHardware
participant "CheckInService\n«business logic»" as AttendanceRules

Student -> StudentUI : select PIN Check-in
StudentUI -> CheckInControl : request identity verification
CheckInControl -> MobileSensor : perform biometric check
MobileSensor -> MobileHardware : request biometric verification

alt local biometric verification completed
  MobileHardware --> MobileSensor : biometric verification result
  MobileSensor --> CheckInControl : local biometric verification result
  CheckInControl -> AttendanceRules : validate local verification result
  AttendanceRules --> CheckInControl : identity evidence accepted
else biometric unavailable - face selfie fallback
  Student -> StudentUI : capture face selfie as fallback proof
  StudentUI -> CheckInControl : submit fallback proof
  CheckInControl -> MobileSensor : access camera and capture selfie
  MobileSensor -> MobileHardware : request camera evidence
  MobileHardware --> MobileSensor : face proof
  MobileSensor --> CheckInControl : face proof
  CheckInControl -> AttendanceRules : validate fallback proof
  AttendanceRules --> CheckInControl : fallback proof accepted
end
CheckInControl --> StudentUI : identity verification accepted

StudentUI --> Student : display PIN input screen
Student -> StudentUI : enter active 6-digit PIN
StudentUI -> CheckInControl : submit PIN code
CheckInControl -> MobileSensor : read GPS coordinates and device identifier (best effort)
MobileSensor --> CheckInControl : location and device evidence, or location unavailable
CheckInControl -> AttendanceRules : submit PIN check-in evidence(PIN, identity, location or unavailable, device)
AttendanceRules --> CheckInControl : result(accepted | rejected)

alt check-in accepted
  CheckInControl --> StudentUI : check-in accepted(official status)
  CheckInControl --> LecturerUI : attendance result changed for live monitor
  StudentUI --> Student : show successful PIN check-in
else check-in rejected
  CheckInControl --> StudentUI : reject check-in(reason)
  StudentUI --> Student : show rejection reason
end
@enduml
```

**Rejection reason catalog (UC04):** same order and reasons as UC02, with `ExpiredCode` meaning the entered PIN is no longer within PIN refresh seconds. Location is never a rejection reason.

| **Order** | **Reason**        | **Rule check**                                                                  | **Trace** |
| :-------- | :---------------- | :------------------------------------------------------------------------------ | :-------- |
| 1         | `ExpiredCode`     | Entered PIN is no longer within PIN refresh seconds.                            | BR-02     |

---

### **UC05 - Manage Attendance Session**

The session lifecycle (start, refresh, optional adjust handoff, and a single finalize that stops check-ins, assigns Absent, and finalizes) is coordinated by `AttendanceSessionControl`. Entity reads/writes are omitted from `AttendanceSessionService`; the repeated QR/PIN refresh is shown compactly.

```plantuml
@startuml
skinparam style strictuml
autonumber
actor "Lecturer\n«external user»" as Lecturer
participant "LecturerInteraction\n«user interaction»" as LecturerUI
participant "AttendanceSessionControl\n«state dependent control»" as SessionControl
participant "AttendanceSessionService\n«business logic»" as SessionRules

Lecturer -> LecturerUI : open My Scheduled Classes
LecturerUI -> SessionControl : request assigned scheduled sessions
SessionControl -> SessionRules : get assigned scheduled sessions
SessionRules --> SessionControl : assigned scheduled sessions
SessionControl --> LecturerUI : show assigned classes and sessions

== Start attendance ==
Lecturer -> LecturerUI : select current session and click Start Attendance
LecturerUI -> SessionControl : request session activation
SessionControl -> SessionRules : validate activation
SessionRules --> SessionControl : activation allowed | denied(reason)

alt activation denied
  SessionControl --> LecturerUI : show reason (outside scheduled hours | active session already exists)
else activation allowed
  SessionControl -> SessionRules : activate session and start QR/PIN refresh
  SessionRules --> SessionControl : current QR and PIN codes
  SessionControl --> LecturerUI : show projector view (QR, PIN, progress)

  loop while session is active - QR/PIN auto-refresh at configured intervals
    SessionControl -> SessionRules : refresh codes
    SessionRules --> SessionControl : refreshed codes
    SessionControl --> LecturerUI : update displayed QR and PIN
  end

  ref over SessionControl, SessionRules
    UC02 / UC04: students submit check-ins while the session is active
  end ref

  == Optional adjust while active ==
  opt adjustment while the session is active
    ref over LecturerUI, SessionControl, SessionRules
      UC07: lecturer manually adjusts an attendance result
    end ref
  end

  == Finalize ==
  Lecturer -> LecturerUI : click Finalize Attendance
  LecturerUI -> SessionControl : request finalization
  SessionControl -> SessionRules : stop accepting check-ins, assign Absent for missing official records, and finalize
  SessionRules --> SessionControl : attendance finalized
  SessionControl --> LecturerUI : attendance finalized
end
@enduml
```
