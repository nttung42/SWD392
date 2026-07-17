## **Sequence Diagrams (Simplified)**

This file holds simplified sequence diagrams factored out of [2_Analysis.md](2_Analysis.md). They preserve the main and key alternative flows of each use case while reducing entity-by-entity lifelines and deep `alt` nesting. The full detailed interaction diagrams (with every entity lifeline) and the communication diagrams remain in [2_Analysis.md](2_Analysis.md).

Simplification approach:

- Entity reads/writes are collapsed into `note` blocks on the `«business logic»` object instead of separate entity lifelines. Full entity access is still traceable via the communication diagrams in Section II.2 of [2_Analysis.md](2_Analysis.md).
- Business rule checks are evaluated inside the `«business logic»` object, which returns a single business result. The coordinator then selects one flat outcome branch.

Scope of this file: UC02, UC04, UC05 (plus the shared identity-evidence step used by UC02 and UC04).

---

### **Shared step - Verify Student Identity Evidence**

Factored out because UC02 (QR) and UC04 (PIN) verify student identity identically. Both use cases reference it. It proceeds only when identity evidence is accepted; otherwise the calling check-in flow is blocked.

```plantuml
@startuml
skinparam style strictuml
autonumber
actor "Student\n«external user»" as Student
participant "Mobile Device Hardware\n«external device»" as MobileHardware
participant "StudentInteraction\n«user interaction»" as StudentUI
participant "AttendanceCoordinator\n«coordinator»" as CheckInControl
participant "MobileDeviceInterface\n«device I/O»" as MobileSensor
participant "CheckInService\n«business logic»" as AttendanceRules

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
@enduml
```

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
participant "CheckInService\n«business logic»" as AttendanceRules

Student -> StudentUI : tap Scan QR Check-in
StudentUI -> CheckInControl : request identity verification
ref over Student, StudentUI, CheckInControl, MobileSensor, AttendanceRules
  Verify Student Identity Evidence (shared step)
  Continue only when identity evidence is accepted.
end ref

StudentUI --> Student : display camera view
Student -> StudentUI : scan active QR code
StudentUI -> CheckInControl : submit scanned code
CheckInControl -> MobileSensor : read GPS coordinates and device identifier (best effort)
MobileSensor --> CheckInControl : location and device evidence, or location unavailable
CheckInControl -> AttendanceRules : submit QR check-in evidence(scanned code, identity, location or unavailable, device)

note over AttendanceRules
  Evaluate rules in priority order, stop at first failure (reason recorded):
  1) QR code still valid - BR-02
  Reads AttendanceSession, Session, AttendanceConfiguration;
  updates AttendanceRecord (submitted coordinates stored as evidence).
  If all pass: classify Present or Late by Late threshold - BR-13.
end note

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
| 1         | `ExpiredCode`     | Scanned QR is no longer within QR validity seconds.                             | BR-02     |

---

### **UC04 - Check In via PIN**

Symmetric with UC02: identity is verified by the shared step, then `CheckInService` evaluates all PIN rules and returns one business result, and the coordinator selects one flat outcome branch.

```plantuml
@startuml
skinparam style strictuml
autonumber
actor "Student\n«external user»" as Student
participant "StudentInteraction\n«user interaction»" as StudentUI
participant "LecturerInteraction\n«user interaction»" as LecturerUI
participant "AttendanceCoordinator\n«coordinator»" as CheckInControl
participant "MobileDeviceInterface\n«device I/O»" as MobileSensor
participant "CheckInService\n«business logic»" as AttendanceRules

Student -> StudentUI : select PIN Check-in
StudentUI -> CheckInControl : request identity verification
ref over Student, StudentUI, CheckInControl, MobileSensor, AttendanceRules
  Verify Student Identity Evidence (shared step)
  Continue only when identity evidence is accepted.
end ref

StudentUI --> Student : display PIN input screen
Student -> StudentUI : enter active 6-digit PIN
StudentUI -> CheckInControl : submit PIN code
CheckInControl -> MobileSensor : read GPS coordinates and device identifier (best effort)
MobileSensor --> CheckInControl : location and device evidence, or location unavailable
CheckInControl -> AttendanceRules : submit PIN check-in evidence(PIN, identity, location or unavailable, device)

note over AttendanceRules
  Evaluate rules in priority order, stop at first failure (reason recorded):
  1) PIN still valid - BR-02
  Reads AttendanceSession, Session, AttendanceConfiguration;
  updates AttendanceRecord (submitted coordinates stored as evidence).
  If all pass: classify Present or Late by Late threshold - BR-13.
end note

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

The session lifecycle (start, refresh, stop, optional short reopen, review, adjust handoff, Absent assignment, finalize) is coordinated by `AttendanceSessionControl`. Entity reads/writes are collapsed into notes on `AttendanceSessionService`; the repeated QR/PIN refresh and the reopen sub-window are shown compactly.

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
note right of SessionRules : reads Session (sessions assigned to lecturer)
SessionRules --> SessionControl : assigned scheduled sessions
SessionControl --> LecturerUI : show assigned classes and sessions

== Start attendance ==
Lecturer -> LecturerUI : select current session and click Start Attendance
LecturerUI -> SessionControl : request session activation
SessionControl -> SessionRules : validate activation
note right of SessionRules
  reads Session (scheduled time + assigned lecturer),
  AttendanceSession (existing active session) - BR-02
end note
SessionRules --> SessionControl : activation allowed | denied(reason)

alt activation denied
  SessionControl --> LecturerUI : show reason (outside scheduled hours | active session already exists)
else activation allowed
  SessionControl -> SessionRules : activate session and start QR/PIN refresh
  note right of SessionRules
    marks AttendanceSession active,
    reads AttendanceConfiguration (QR/PIN refresh seconds),
    updates AttendanceSession displayed codes
  end note
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

  == Stop and optional reopen ==
  Lecturer -> LecturerUI : click Stop Receiving Check-ins
  LecturerUI -> SessionControl : request stop accepting check-ins
  SessionControl -> SessionRules : stop accepting new check-ins
  note right of SessionRules : marks AttendanceSession stopped
  SessionRules --> SessionControl : session stopped
  SessionControl --> LecturerUI : show review view

  opt short reopen due to classroom interruption (before finalization)
    Lecturer -> LecturerUI : request short reopen, then Stop again when done
    LecturerUI -> SessionControl : request reopen window
    SessionControl -> SessionRules : validate and reopen when allowed
    note right of SessionRules
      reads/updates AttendanceSession lifecycle; reopened window reuses the
      same QR/PIN refresh loop and returns to the review view on second stop - BR-10
    end note
    SessionRules --> SessionControl : reopen allowed | denied
    SessionControl --> LecturerUI : show reopen result
  end

  == Review, adjust, finalize ==
  LecturerUI -> SessionControl : request review data
  SessionControl -> SessionRules : get review data
  note right of SessionRules : reads AttendanceRecord (official results and latest rejection reasons)
  SessionRules --> SessionControl : review data
  SessionControl --> LecturerUI : show review data

  opt adjustment before finalization
    ref over LecturerUI, SessionControl, SessionRules
      UC07: lecturer manually adjusts an attendance result
    end ref
  end

  SessionControl -> SessionRules : assign Absent results for missing official records
  note right of SessionRules : reads ClassSectionStudent, assigns Absent to students without Present/Late
  SessionRules --> SessionControl : completed attendance list
  SessionControl --> LecturerUI : show completed attendance list

  Lecturer -> LecturerUI : click Finalize Attendance
  LecturerUI -> SessionControl : request finalization
  SessionControl -> SessionRules : validate finalization and finalize
  note right of SessionRules : verifies completed results, marks AttendanceRecord and AttendanceSession finalized - BR-08
  SessionRules --> SessionControl : attendance finalized
  SessionControl --> LecturerUI : attendance finalized
end
@enduml
```
