# SƠ ĐỒ TRUYỀN THÔNG CHI TIẾT: UC07 - GIÁM SÁT ĐIỂM DANH THỜI GIAN THỰC

Tài liệu này mô tả sơ đồ truyền thông mức phân tích cho Use Case **UC07: Real-time Attendance Monitor**.

---

## 📊 SƠ ĐỒ TRUYỀN THÔNG (MERMAID)

```mermaid
graph TD
    GV((Lecturer))
    LWP[«boundary»<br>LecturerWebPortal]
    SC[«control»<br>SessionController]
    CS[(«entity»<br>ClassSectionStudent)]
    AR[(«entity»<br>AttendanceRecord)]
    WSH[«control»<br>AttendanceHub]

    GV -->|1: Open Presentation View| LWP
    LWP -->|1.1: GetStudentRosterForSession| SC
    SC -->|1.1.1: ReadEnrolledStudents| CS
    SC -->|1.1.2: GetExistingRecords| AR
    SC -->|1.2: Return student grid data| LWP
    WSH -->|2: BroadcastAttendanceUpdate| LWP
    LWP -->|2.1: UpdateStudentTile / UpdateCounter| LWP
```
