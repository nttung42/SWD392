# SƠ ĐỒ TRÌNH TỰ CHI TIẾT: UC07 - GIÁM SÁT ĐIỂM DANH THỜI GIAN THỰC

Tài liệu này đặc tả sự tương tác động giữa các đối tượng phân tích tham gia Use Case **UC07: Real-time Attendance Monitor**.

---

## 📊 SƠ ĐỒ TRÌNH TỰ (MERMAID)

```mermaid
sequenceDiagram
    autonumber
    actor GV as Lecturer
    participant LWP as «boundary»<br>LecturerWebPortal
    participant SC as «control»<br>SessionController
    participant CS as «entity»<br>ClassSectionStudent
    participant AR as «entity»<br>AttendanceRecord
    participant WSH as «control»<br>AttendanceHub

    GV->>LWP: Open Dynamic Presentation View
    activate LWP
    LWP->>SC: GetStudentRosterForSession(SessionId)
    activate SC
    SC->>CS: ReadEnrolledStudents(ClassSectionId)
    activate CS
    CS-->>SC: List of Students
    deactivate CS
    SC->>AR: GetExistingRecords(SessionId)
    activate AR
    AR-->>SC: Current attendance statuses
    deactivate AR
    SC-->>LWP: Student grid data
    deactivate SC
    LWP-->>GV: Render student tiles grid
    deactivate LWP

    loop For each accepted check-in event
        WSH->>WSH: OnStudentCheckedIn(StudentId, Status, CheckedInAt)
        activate WSH
        WSH->>LWP: BroadcastAttendanceUpdate(StudentId, Status, CheckedInAt)
        activate LWP
        LWP->>LWP: UpdateStudentTile(StudentId, Status)
        LWP->>LWP: UpdateAttendanceCounter()
        LWP-->>GV: Tile changes color and count updates
        deactivate LWP
        deactivate WSH
    end

    alt If WebSocket disconnects
        LWP->>LWP: ShowReconnectWarning()
        LWP-->>GV: Display red warning icon
        LWP->>WSH: AttemptReconnection()
    end
```
