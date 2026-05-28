# SƠ ĐỒ TRUYỀN THÔNG CHI TIẾT: UC08 - ĐIỀU CHỈNH ĐIỂM DANH THỦ CÔNG

Tài liệu này mô tả sơ đồ truyền thông mức phân tích cho Use Case **UC08: Manual Attendance Adjustment**.

---

## 📊 SƠ ĐỒ TRUYỀN THÔNG (MERMAID)

```mermaid
graph TD
    GV((Lecturer))
    LWP[«boundary»<br>LecturerWebPortal]
    AC[«control»<br>AttendanceController]
    AR[(«entity»<br>AttendanceRecord)]
    SL[(«entity»<br>SystemLog)]

    GV -->|1: Click student / Select status / Save| LWP
    LWP -->|1.1: AdjustAttendanceStatus| AC
    AC -->|1.1.1: ValidateReasonNotEmpty| AC
    AC -->|1.1.2: UpdateRecordStatus| AR
    AC -->|1.1.3: WriteAuditLog| SL
    AC -->|2: Return Success / Error| LWP
```
