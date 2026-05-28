# SƠ ĐỒ TRÌNH TỰ CHI TIẾT: UC08 - ĐIỀU CHỈNH ĐIỂM DANH THỦ CÔNG

Tài liệu này đặc tả sự tương tác động giữa các đối tượng phân tích tham gia Use Case **UC08: Manual Attendance Adjustment**.

---

## 📊 SƠ ĐỒ TRÌNH TỰ (MERMAID)

```mermaid
sequenceDiagram
    autonumber
    actor GV as Lecturer
    participant LWP as «boundary»<br>LecturerWebPortal
    participant AC as «control»<br>AttendanceController
    participant AR as «entity»<br>AttendanceRecord
    participant SL as «entity»<br>SystemLog

    GV->>LWP: Click on student tile
    activate LWP
    LWP-->>GV: Show adjustment modal
    deactivate LWP

    GV->>LWP: Select new status, enter reason, click Save
    activate LWP
    LWP->>AC: AdjustAttendanceStatus(RecordId, NewStatus, Reason, LecturerId)
    activate AC
    AC->>AC: ValidateReasonNotEmpty(Reason)

    alt If reason is empty
        AC-->>LWP: Return Error: Reason is mandatory
        LWP-->>GV: Highlight reason field with error
    else If reason is provided
        AC->>AR: UpdateRecordStatus(RecordId, Status=NewStatus, VerificationMode="Manual")
        activate AR
        AR-->>AC: Record Updated
        deactivate AR

        AC->>SL: WriteAuditLog(LecturerId, Action="Manual_Adjustment", RecordId, Reason)
        activate SL
        SL-->>AC: Log Written
        deactivate SL

        AC-->>LWP: Return Success: Status Updated
        LWP-->>GV: Close modal and update student tile
    end
    deactivate AC
    deactivate LWP
```
