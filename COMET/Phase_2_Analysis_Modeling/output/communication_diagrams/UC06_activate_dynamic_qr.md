# SƠ ĐỒ TRUYỀN THÔNG CHI TIẾT: UC06 - KÍCH HOẠT PHIÊN ĐIỂM DANH QR ĐỘNG

Tài liệu này mô tả sơ đồ truyền thông (Communication Diagram) mức phân tích cho Use Case **UC06: Kích hoạt phiên điểm danh QR Động** của Giảng viên.

---

## 📊 SƠ ĐỒ TRUYỀN THÔNG (MERMAID)

```mermaid
graph TD
    GV((Lecturer))
    LWP[«boundary»<br>LecturerWebPortal]
    SC[«control»<br>SessionController]
    S[(«entity»<br>Session)]
    V[(«entity»<br>AttendanceVersion)]
    QT[«control»<br>QRRefreshTimer]
    PT[«control»<br>PINRefreshTimer]

    GV -->|1: Click Start Attendance| LWP
    LWP -->|2: GetSessionDetails / 3: ActivateAttendanceSession| SC
    
    SC -->|4: ReadSessionInfo| S
    SC -->|5: InitializeVersion| V
    SC -->|6: StartTimer 10s| QT
    SC -->|7: StartTimer 30s| PT
    
    QT -->|8: OnTimerTick / PushQR| LWP
    PT -->|9: OnTimerTick / PushPIN| LWP
```
