# Kết luận tổng thể

Phần **II. Analysis Models** hiện tại đã đi đúng hướng COMET: có static model, phân loại object theo stereotype, interaction diagram cho từng use case, state diagram và traceability. Theo COMET, Analysis Model cần gồm: mô hình tĩnh của problem domain, structuring hệ thống thành các object, statechart cho object thực sự phụ thuộc trạng thái và interaction diagram cho các use case. Tài liệu của nhóm đã bao phủ đủ các nhóm sản phẩm này. ([Mason][1])

Tuy nhiên, tài liệu **chưa nên chốt nguyên trạng**. Một số sơ đồ nhìn đầy đủ nhưng còn sai về semantics, đặc biệt là hai state diagram của `CheckInAttempt`, `AttendanceRecord`; mô hình dữ liệu chưa đủ để thực hiện geofencing và audit; một số interaction chưa thật sự thực hiện được nghiệp vụ đã mô tả trong Requirement.  

### Đánh giá sơ bộ

| Tiêu chí                         |            Điểm |
| -------------------------------- | --------------: |
| Bám khung COMET                  |            8/10 |
| Đúng nghiệp vụ AFAS              |          6.5/10 |
| Nhất quán Requirement → Analysis |          6.5/10 |
| Hình thức và khả năng đọc        |          7.5/10 |
| Mức độ vừa đủ cho sinh viên      |            6/10 |
| **Tổng thể**                     | **Khoảng 7/10** |

---

# 1. Những phần đang làm tốt

## 1.1. Cấu trúc Analysis khá đúng COMET

Nhóm đã phân biệt được:

* `«user interaction»`
* `«device I/O»`
* `«coordinator»`
* `«state dependent control»`
* `«business logic»`
* `«algorithm»`
* `«entity»`

Cách phân loại `Session Control` là state-dependent control, `Location Distance Calculation` là algorithm, các Rule object là business logic nhìn chung hợp lý. Theo Gomaa, coordinator chịu trách nhiệm điều phối use case; state-dependent control được định nghĩa bởi finite-state machine; business logic đóng gói rule nghiệp vụ; algorithm object đóng gói thuật toán miền bài toán. 

## 1.2. Tách `CheckInAttempt` và `AttendanceRecord` là quyết định đúng

Đây là điểm tốt nhất về nghiệp vụ:

* `CheckInAttempt`: lưu mọi lần gửi QR/PIN, kể cả bị từ chối.
* `AttendanceRecord`: chỉ lưu kết quả chính thức `Present`, `Late`, `Absent`.
* Một sinh viên có thể thử nhiều lần nhưng chỉ có một kết quả chính thức.

Cách tách này phù hợp BR-06 và tránh sai lầm phổ biến là đưa `Rejected` vào cùng tập trạng thái điểm danh chính thức.

## 1.3. Có interaction cho toàn bộ UC01–UC10

Không còn tình trạng một số use case chỉ có description mà không được Analysis hiện thực hóa. Các use case quan trọng như QR, PIN, session lifecycle, manual adjustment và export đều có luồng chính và một phần exception flow.

## 1.4. `AttendanceConfiguration` là bổ sung hợp lý

Việc đưa các thuộc tính:

* `QRRefreshSeconds`
* `QRValiditySeconds`
* `PINRefreshSeconds`
* `LateThresholdMinutes`
* `DefaultClassroomRadiusMeters`

vào Analysis giúp NF-06 không chỉ tồn tại ở Requirement mà có object cụ thể để đi tiếp sang Design.

## 1.5. Traceability matrix nên được giữ lại

Phần II.4 giúp kiểm tra UC nào được thực hiện bởi object và diagram nào. Đây không phải phần bắt buộc cứng của COMET, nhưng có giá trị lớn cho đồ án và cho phase Design sau này.

---

# 2. Các vấn đề nghiêm trọng cần sửa trước khi chốt

## 2.1. Thiếu kiểm tra sinh viên có thuộc lớp hay không

Trong UC02 và UC04, hệ thống kiểm tra:

* biometric/selfie;
* QR/PIN;
* vị trí;
* duplicate attendance result.

Nhưng không kiểm tra sinh viên có thuộc `ClassEnrollment` của lớp đang điểm danh hay không.

Điều này dẫn đến một lỗ hổng nghiệp vụ: một sinh viên đăng nhập hợp lệ, đang ở đúng phòng và có mã QR vẫn có thể điểm danh cho một lớp mà mình không đăng ký.

### Cần sửa

Bổ sung business rule:

> A student may check in only when the student is enrolled in the class section associated with the target study session.

Trong sequence UC02 và UC04 thêm:

```text
CheckInControl -> StudySession: read target class section
CheckInControl -> ClassEnrollment: verify student enrollment
```

Nếu không thuộc lớp:

```text
record rejected attempt(reason = NotEnrolled)
return check-in not allowed
```

Đây vừa là thiếu ở Requirement, vừa là thiếu ở Analysis. `ClassEnrollment` đã tồn tại nhưng hiện không tham gia hai use case quan trọng nhất. 

---

## 2.2. `Attendance Status Calculation` không có đủ dữ liệu để tính Present/Late

Sequence đang gọi:

```text
determine Present or Late using configured threshold
```

nhưng không cung cấp:

* thời gian check-in;
* thời gian bắt đầu của `StudySession`;
* official system time;
* late threshold.

`StatusRules` chỉ đọc `LateThresholdMinutes`. Như vậy về mặt interaction, object không đủ input để thực hiện BR-13.

### Cần sửa

UC02 và UC04 phải có thêm `StudySession`:

```text
CheckInControl -> StudySession: read scheduled start time
StudySession --> CheckInControl: session start time
CheckInControl -> StatusRules:
    determineStatus(submittedAt, sessionStartTime, lateThreshold)
```

Đồng thời nêu rõ `SubmittedAt` lấy từ official system time, không tin hoàn toàn timestamp do điện thoại gửi lên.

---

## 2.3. Mô hình geolocation chưa đủ để thực hiện thuật toán

Hiện tại:

```text
ClassroomLocation: Text
SubmittedLocation: Text
CampusZone :
    BoundaryDescription
```

nhưng lại có:

```text
Location Distance Calculation
```

và kiểm tra điểm có nằm trong campus hay không.

Với các thuộc tính trên, không đủ dữ liệu để:

* tính khoảng cách;
* dùng Haversine;
* kiểm tra một điểm thuộc campus boundary;
* xử lý NF-02 về sai số định vị 15–20 mét.

### Cần sửa

Có thể chọn một trong hai cách.

**Cách đơn giản, phù hợp sinh viên:**

```text
Classroom
- Latitude
- Longitude
- AllowedAttendanceRadius

CheckInAttempt
- SubmittedLatitude
- SubmittedLongitude
- LocationAccuracyMeters
```

Nếu vẫn giữ `CampusZone `, cần có tối thiểu:

```text
CampusZone 
- BoundaryCoordinates
```

hoặc ghi rõ campus boundary là dữ liệu bản đồ được cấu hình sẵn.

`BoundaryDescription` đơn thuần không thể dùng để kiểm tra tọa độ.

Ngoài ra `LocationAccuracyMeters` nên được lưu vì NF-02 yêu cầu xử lý sai số GPS, nhưng Analysis hiện chưa thể hiện NFR này.

---

## 2.4. `AuditLog` không đủ dữ liệu để đáp ứng BR-09

BR-09 yêu cầu mỗi adjustment phải lưu:

* previous status;
* new status;
* reason;
* lecturer;
* adjustment time.

Nhưng `AuditLog` chỉ có:

```text
ActorAccountCode
ActionTime
ActionType
ActionDescription
```

Sequence nói rằng AuditLog ghi previous status, new status và reason, nhưng static model không có các thuộc tính tương ứng. Đây là mâu thuẫn giữa static và dynamic model.

### Phương án tốt nhất

Tạo entity riêng:

```text
AttendanceAdjustment
- AdjustmentCode
- AttendanceRecordCode
- SourceAttemptCode
- LecturerCode
- PreviousStatus
- NewStatus
- Reason
- AdjustedAt
```

`AuditLog` vẫn giữ để lưu log tổng quát của Admin.

### Phương án tối giản

Giữ `AuditLog`, nhưng thêm:

```text
TargetEntityCode
PreviousValue
NewValue
Reason
```

Phương án entity riêng rõ nghiệp vụ hơn và dễ truy vấn hơn.

---

## 2.5. UC07 chưa xử lý được việc chấp nhận một rejected attempt

Requirement nói lecturer có thể chọn rejected attempt và chấp nhận nó thành `Present` hoặc `Late`.

Nhưng UC07 hiện làm:

```text
read current official status
update official result
```

Nếu sinh viên chỉ có rejected attempt và chưa có `AttendanceRecord`, sẽ không có official status để đọc và không có record để update.

### Cần thêm hai nhánh

```text
alt official AttendanceRecord exists
    update existing AttendanceRecord
else selected rejected attempt and no record exists
    create AttendanceRecord
    ResultSource = ManualAdjustment
    SourceAttemptCode = selected attempt
end
```

Đây là lỗi nghiệp vụ trực tiếp, không chỉ là vấn đề trình bày.

---

## 2.6. Chưa thống nhất có được sửa sau khi finalized hay không

Requirement UC07 ghi lecturer có thể điều chỉnh ở “active or past session”, trong khi UC05 đặt manual adjustment trước finalization. State diagram `AttendanceRecord` lại không cho phép điều chỉnh sau `Finalized`.

Hiện có ba cách hiểu khác nhau:

1. Chỉ sửa trước finalization.
2. Có thể sửa bất kỳ past session nào.
3. Có thể sửa sau finalization nhưng phải finalize lại.

### Khuyến nghị cho MVP sinh viên

Chọn quy tắc đơn giản:

> Manual adjustment is allowed only before the attendance result is finalized.

Sửa precondition UC07:

```text
The target attendance session exists and is not finalized.
```

Thêm exception:

```text
Finalized attendance cannot be modified.
```

Nếu muốn cho sửa sau finalized thì phải có versioning/re-finalization, sẽ làm hệ thống phức tạp hơn nhiều và không cần thiết cho đồ án này.

---

## 2.7. State diagram của `CheckInAttempt` đang sai bản chất

Hiện state diagram có các trạng thái:

* `Blocked`
* `Submitted`
* `IdentityAccepted`
* `CodeValid`
* `LocationAvailable`
* `Accepted`
* `Rejected`
* `DuplicateIgnored`
* `LinkedToOfficialResult`

Vấn đề là phần lớn đây không phải trạng thái lâu dài của `CheckInAttempt`, mà là các bước validation trong một transaction.

Đặc biệt:

* Identity được kiểm tra trước khi submission.
* Location unavailable làm submission bị block.
* Khi đó có thể chưa tồn tại một `CheckInAttempt`.
* Static model chỉ định `AttemptStatus = Accepted | Rejected`, không có các trạng thái còn lại.

COMET yêu cầu statechart cho object thực sự state-dependent, tức hành vi tương lai của object phụ thuộc trạng thái hiện tại; không nên biến từng bước xử lý tuần tự thành state. 

### Khuyến nghị

**Xóa Figure II-24.**

Chỉ giữ validation flow trong sequence UC02 và UC04.

Nếu muốn giữ state đơn giản:

```text
[*] --> Submitted
Submitted --> Accepted
Submitted --> Rejected
Accepted --> LinkedToOfficialRecord
Rejected --> Reviewed
```

Nhưng ngay cả statechart này cũng không thật sự cần thiết cho đồ án.

---

## 2.8. State diagram của `AttendanceRecord` cũng đang trộn nhiều khái niệm

Hiện có:

```text
OfficialPresent
OfficialLate
OfficialAbsent
Adjusted
Finalized
Exportable
```

Có ba vấn đề.

### `Adjusted` không phải attendance status

Sau adjustment, record vẫn phải là `Present`, `Late` hoặc `Absent`. “Adjusted” là `ResultSource`, không phải state thay thế attendance status.

### `Exportable` không phải lifecycle state

Việc người dùng yêu cầu report không làm `AttendanceRecord` chuyển sang trạng thái mới. Một record đã finalized vốn đã đủ điều kiện export.

### `NotRecorded` không phải trạng thái của object tồn tại

Khi chưa ghi nhận, `AttendanceRecord` chưa tồn tại. Không nên biến “object chưa tồn tại” thành state của chính object, trừ khi có lý do mô hình đặc biệt.

### Nên sửa thành

```text
[*] --> Draft
Draft --> Draft : statusChanged [reason recorded when manual]
Draft --> Finalized : finalizeAttendance
Finalized --> [*]
```

Các thuộc tính độc lập:

```text
AttendanceStatus = Present | Late | Absent
ResultSource = QR | PIN | AbsentAssignment | ManualAdjustment
```

Hoặc xóa hoàn toàn statechart `AttendanceRecord`, vì state machine quan trọng nhất của hệ thống là `Session Control`.

---

## 2.9. UC06 có nhánh `alt` sai logic

Sequence UC06 đang có dạng:

```text
alt session is active
   ...
else live updates interrupted
   ...
end
```

`Session is not active` và `live updates interrupted` không phải hai trường hợp đối lập.

Một session có thể:

* không active;
* active và connection bình thường;
* active nhưng live connection bị gián đoạn.

### Cần sửa

```text
alt session is not active
    show monitor unavailable
else session is active
    load roster and statuses

    alt live connection works
        receive attendance updates
    else connection interrupted
        show warning and allow refresh
    end
end
```

---

## 2.10. UC06 đang có hai cơ chế update không thống nhất

Trong UC02 và UC04:

```text
CheckInControl -> MonitorControl:
    publish attendance status update
```

Nhưng trong UC06:

```text
MonitorControl -> AttendanceRecord:
    obtain latest official result change
```

Một bên là push event, một bên là polling/read latest changes.

Analysis chưa cần quyết định WebSocket hay polling, nhưng phải thống nhất business interaction.

### Khuyến nghị

Ở Analysis dùng business event:

```text
CheckInControl -> MonitorControl:
    attendanceResultChanged
```

Trong UC06, MonitorControl nhận event rồi cập nhật UI.

Cơ chế WebSocket, SSE, polling hay message broker để sang Design.

Manual adjustment UC07 cũng cần gửi `attendanceResultChanged` nếu session đang được monitor.

---

## 2.11. Mô hình biometric đang dùng từ ngữ dễ dẫn tới sai privacy

Hiện sequence ghi:

```text
MobileSensor --> CheckInControl : biometric evidence
IdentityRules : validate biometric evidence
```

Trong mô hình hợp lý, hệ thống không nên nhận fingerprint/face biometric thô từ thiết bị. Mobile OS chỉ trả kết quả xác thực thành công hay thất bại.

### Nên đổi thành

```text
MobileSensor --> CheckInControl:
    local biometric verification result
```

Không lưu biometric evidence.

Đối với selfie:

```text
capture fallback attendance proof
```

Không nên gọi là “identity verified” hoặc “validate face proof” nếu nhóm không thực hiện face matching. Requirement chỉ nói selfie là proof để authorized user xem lại, không khẳng định có AI nhận diện khuôn mặt.

---

## 2.12. Admin Web Interface gọi Mobile Sensor chưa rõ

UC10 sử dụng:

```text
Admin Web Interface
    -> Room Configuration Control
    -> Mobile Device Sensor Interface
```

Nhưng hệ thống được mô tả là Admin Web Portal. Chưa rõ admin đang:

* dùng laptop;
* dùng mobile browser;
* hay có một admin mobile app riêng.

### Hai cách xử lý

**Đơn giản nhất:** bỏ alternative “Capture Current Location”, chỉ cho nhập tọa độ thủ công.

**Hoặc:** thêm:

```text
Admin Mobile Calibration Interface «user interaction»
```

và actor Admin có thể truy cập interface này khi đứng tại phòng học.

Hiện tại hình thức chưa sai hoàn toàn, nhưng interface chain không rõ ràng.

---

# 3. Những khoảng trống nghiệp vụ bắt nguồn từ Requirement

Các vấn đề dưới đây không nên chỉ vá trong Analysis; nên bổ sung hoặc làm rõ ở Requirement trước.

## 3.1. Ai tạo roster, lịch học và phòng học?

Hệ thống đã có:

* `ClassEnrollment`
* `StudySession`
* `Classroom`

nhưng UC09 chỉ quản lý:

* account;
* subject;
* class section.

Không có flow rõ ràng để:

* gán sinh viên vào class section;
* tạo các study session trong lịch;
* tạo classroom trước khi cấu hình location;
* gán class section cho lecturer;
* gán study session vào classroom.

Nếu không có dữ liệu này, UC05 không thể hiển thị “My Scheduled Classes” và UC06 không thể có roster.

### Khuyến nghị không thêm quá nhiều UC

Mở rộng UC09 thành:

> Manage Academic Catalog and Schedule

Bao gồm:

* accounts;
* subjects;
* class sections;
* class enrollment;
* classrooms;
* study sessions.

Hoặc ghi rõ tất cả dữ liệu roster/schedule được import sẵn từ university data source. Với đồ án sinh viên, cách import sẵn đơn giản hơn.

---

## 3.2. Failed identity và location unavailable có tạo attempt hay không?

Requirement có hai cách diễn đạt:

* failed postcondition: attempt rejected and retained;
* identity failure/location unavailable: submission is blocked.

Data dictionary còn đưa `IdentityVerificationFailed` làm ví dụ `RejectionReason`.

Phải chọn một quy tắc:

### Phương án A — không tạo attempt

Nếu chưa thu thập đủ evidence thì không tạo `CheckInAttempt`.

Khi đó xóa `IdentityVerificationFailed` khỏi `RejectionReason`.

### Phương án B — vẫn tạo rejected attempt

Tạo attempt tối thiểu để audit, nhưng các trường location/device có thể thiếu.

Với MVP, phương án A đơn giản và nhất quán hơn.

---

## 3.3. “Short reopen” chưa có thời lượng và lý do rõ ràng

State diagram có guard:

```text
shortReopen [interruption reason and before finalization]
```

nhưng sequence không yêu cầu lecturer nhập interruption reason.

Ngoài ra short window kết thúc bằng việc lecturer nhấn Stop lần nữa, nên không bảo đảm nó thực sự “short”.

### Khuyến nghị

Hoặc đổi Requirement thành:

> Lecturer may manually reopen the session and stop it again before finalization.

Hoặc thêm:

```text
ReopenDurationMinutes
ReopenReason
```

Đối với MVP, manual stop lần hai là đủ; không cần timer riêng cho reopen.

---

## 3.4. Chưa mô hình hóa việc xóa selfie sau học kỳ

NF-04 và BR-04 yêu cầu face evidence tự động bị xóa sau khi semester kết thúc. Analysis hiện chỉ mô hình việc tạo và đọc proof, chưa có object hoặc interaction nào thực hiện retention.

Có thể ghi rõ trong Analysis:

```text
Evidence Retention Rules «business logic»
- determines evidence expiry from semester end date
```

Và thêm note:

```text
FaceEvidenceReference becomes invalid after scheduled retention cleanup.
```

Không nhất thiết phải thêm một use case cho sinh viên, nhưng traceability không nên đánh dấu BR-04 là “covered hoàn toàn” khi mới chỉ xử lý phần capture.

---

# 4. Các vấn đề trong Entity Class Diagram

## 4.1. Thiếu constraint một record cho một student–session

Multiplicity hiện tại cho phép:

```text
StudentProfile 1 -- 0..* AttendanceRecord
StudySession 1 -- 0..* AttendanceRecord
```

Nhưng không biểu diễn được quy tắc:

> Mỗi cặp Student + StudySession chỉ có tối đa một AttendanceRecord.

Cần thêm UML constraint:

```text
{unique StudentRollNumber, StudySessionCode}
```

hoặc note cạnh `AttendanceRecord`.

Đây là constraint quan trọng nhất của static model.

## 4.2. Quan hệ profile cần XOR constraint

Hiện một `UserAccount` có thể đồng thời có:

* một `StudentProfile`;
* một `LecturerProfile`.

Trong khi `UserRole` chỉ có một giá trị.

Thêm:

```text
{xor}
```

giữa hai association, hoặc dùng generalization phù hợp.

## 4.3. Composition `CampusZone  *-- Classroom` chưa hợp lý

Classroom không bị hủy chỉ vì campus boundary bị thay đổi hoặc xóa. Đây nên là association thông thường:

```text
CampusZone  "1" -- "0..*" Classroom
```

Composition hợp lý hơn ở:

* `ClassSection *-- StudySession`;
* `StudySession *-- CheckInAttempt`;
* `StudySession *-- AttendanceRecord`;

dù vẫn cần hiểu rằng đây là lifecycle ownership chứ không chỉ quan hệ foreign key.

## 4.4. Cách giữ foreign-key attribute chưa nhất quán

Ví dụ:

* `StudentProfile` giữ `AccountCode`;
* `ClassEnrollment` giữ hai mã;
* `AttendanceSession` giữ `StudySessionCode`;

nhưng `ClassSection` lại bỏ `SubjectCode`, `LecturerCode`, và `StudySession` bỏ `ClassSectionCode`, `ClassroomCode`.

Trong conceptual UML, bỏ FK và dùng association là hợp lệ. Vấn đề là tài liệu đang áp dụng cả hai cách lẫn nhau.

Nên chọn một quy ước:

* Static analysis diagram chỉ thể hiện association, bỏ các FK lặp lại.
* Data dictionary giữ đầy đủ reference field.

Đây là cách sạch nhất.

---

# 5. Đánh giá hình thức

## 5.1. Contextual interface-control diagram cần system boundary

Theo COMET, external class nằm ngoài software boundary, còn interface class nằm bên trong. Tài liệu đang đặt actor, interface và control cùng một mặt phẳng nên chưa thể hiện rõ ranh giới AFAS. ([WVU Community][2])

Nên sửa Figure II-2:

```plantuml
actor Student
actor Lecturer
actor Admin
actor "Mobile Device Hardware"

rectangle "AFAS" {
    StudentUI
    LecturerUI
    AdminUI
    MobileSensor

    AuthControl
    CheckInControl
    ...
}
```

## 5.2. Tên “wireframe” chưa chính xác

Ba sơ đồ Salt hiện tại thực chất là:

* danh sách tab;
* dữ liệu hiển thị;
* các action chính.

Chúng giống **interface sketches** hoặc **screen-content model** hơn là wireframe hoàn chỉnh.

Có thể đổi tiêu đề thành:

> Analysis-level Interface Sketches

Hoặc chuyển toàn bộ sang appendix.

## 5.3. Verification checklist toàn “Pass” không đáng tin

Phần II.5 đang tự kết luận tất cả đều Pass, nhưng thực tế:

* BR-04 chưa bao phủ cleanup;
* UC07 chưa tạo record từ rejected attempt;
* NF-02 chưa được thể hiện;
* UC04 thiếu BR-02 trong traceability;
* CheckInAttempt state không khớp static model.

Nên:

* bỏ checklist này;
* hoặc đổi thành `Pass / Partial / Issue`;
* thêm cột `Required correction`.

Một bảng toàn Pass tạo cảm giác tài liệu đang tự xác nhận thay vì thực sự verification.

---

# 6. Phần nào đang overengineering?

## 6.1. 10 sequence + 10 communication diagram là dư thừa

COMET mô tả interaction bằng **communication diagram hoặc sequence diagram**, không bắt buộc cả hai cho cùng một use case. 

Hiện communication diagram của nhóm chủ yếu rút gọn sequence diagram, không thể hiện đầy đủ alternative/error branches. Vì vậy chúng không tạo thêm nhiều thông tin.

### Khuyến nghị

* Giữ **10 sequence diagram**, mỗi UC một diagram.
* Bỏ 10 communication diagram.
* Chỉ giữ communication diagram nếu rubric hoặc giảng viên yêu cầu đúng theo sample.

Việc này giảm gần một nửa độ dài phần Dynamic Analysis mà không làm mất nghiệp vụ.

## 6.2. WBS object hierarchy và responsibility table đang trùng nhau

Hai phần đều phân loại cùng một tập object.

Nên giữ:

* responsibility table;
* Figure II-2 interface/control diagram;
* entity diagram.

Có thể bỏ WBS.

## 6.3. Ba state diagram là quá nhiều so với số object thực sự state-dependent

Nên giữ chắc chắn:

* `Session Control statechart`.

Có thể giữ bản đơn giản:

* `AttendanceRecord: Draft → Finalized`.

Nên bỏ:

* `CheckInAttempt statechart`.

## 6.4. Wireframe không phải phần trọng tâm của COMET Analysis

Nếu đề bài không yêu cầu UI mockup, chuyển wireframe sang appendix. COMET Analysis cốt lõi vẫn đầy đủ với static model, object structuring, statechart và interaction diagrams.

---

# 7. Traceability có một lỗi cụ thể

UC04 – PIN đang không liệt kê BR-02, trong khi BR-02 quy định:

* QR thay đổi mỗi 10 giây;
* backup PIN thay đổi mỗi 30 giây.

UC04 sử dụng active PIN và `PINRefreshSeconds`, nên phải trace tới BR-02.

Sửa:

```text
UC04 Business rules:
BR-02, BR-03, BR-04, BR-05, BR-06, BR-07, BR-12, BR-13
```

Ngoài ra các mục BR-05 và BR-12 hiện mới chỉ được “nhắc tới”, chưa thực sự được mô hình đủ:

* BR-05: chưa có branch khi device identifier không lấy được.
* BR-12: chưa thể hiện nguồn official system time.

---

# 8. Cấu trúc Part II nên chốt lại

Tôi đề xuất phiên bản vừa đúng COMET vừa không quá nặng cho sinh viên:

## II.1 Static Analysis Model

* Entity class diagram.
* Các constraint quan trọng:

  * unique attendance record per student/session;
  * role/profile XOR;
  * location data structure;
  * audit/adjustment structure.

## II.2 Object and Class Structuring

* Một contextual boundary–control diagram có system boundary.
* Object responsibility table.
* Bỏ WBS nếu cần giảm tài liệu.

## II.3 Dynamic Interaction Modeling

* 10 sequence diagrams, một diagram cho mỗi UC.
* Không cần communication diagram trùng lặp.
* Giữ alternative branch quan trọng.

## II.4 State-Dependent Modeling

* Session Control statechart.
* AttendanceRecord Draft/Finalized statechart nếu thật sự cần.
* Bỏ CheckInAttempt statechart.

## II.5 Analysis Traceability

* UC → object → diagram → BR/NFR.
* Thêm trạng thái `Covered / Partial / Deferred to Design`.

## Appendix

* Interface sketches.
* Communication diagrams, chỉ khi giảng viên yêu cầu.

---

# 9. Danh sách sửa theo độ ưu tiên

## Bắt buộc sửa trước khi chốt

1. Bổ sung enrollment validation cho UC02/UC04.
2. Bổ sung StudySession time và official time cho Present/Late calculation.
3. Sửa location từ `Text` thành tọa độ có thể tính toán.
4. Sửa AuditLog hoặc tạo `AttendanceAdjustment`.
5. Sửa UC07 để có thể tạo record từ rejected attempt.
6. Chốt quy tắc điều chỉnh trước hay sau finalization.
7. Xóa hoặc viết lại CheckInAttempt state diagram.
8. Viết lại AttendanceRecord state diagram.
9. Sửa logic `alt` của UC06.
10. Bổ sung unique constraint cho Student–StudySession attendance result.

## Nên sửa

11. Thống nhất push/pull trong real-time monitoring.
12. Không gọi dữ liệu biometric thô là “biometric evidence”.
13. Làm rõ Admin Web và mobile calibration.
14. Làm rõ nguồn roster, schedule và classroom.
15. Bổ sung trace của NF-02 và face-evidence retention.
16. Thêm BR-02 vào UC04 traceability.

## Có thể lược bỏ

17. Mười communication diagram trùng sequence diagram.
18. WBS object hierarchy.
19. Verification checklist toàn Pass.
20. Chuyển interface sketches sang appendix.

**Phán quyết:** Phần Analysis hiện tại có khung tốt và đủ nền để tiếp tục, nhưng cần một vòng chỉnh sửa về semantics hơn là bổ sung thêm diagram. Không nên thêm nhiều object hoặc sơ đồ mới; nên **sửa cho đúng các object đang có và loại bỏ các mô hình trùng lặp hoặc không thực sự state-dependent**.

[1]: https://mason.gmu.edu/~hgomaa/assets/lecturenotes621/SWE621-6-DynamicModeling.pdf "Microsoft PowerPoint - SWE621-6-DynamicModeling"
[2]: https://community.wvu.edu/~hhammar/rts/Hassan%20Gomaa%20LectureNotes%201.pdf "No Slide Title"
