# **Requirement Specification**

## **Anti-Fraud Attendance System (AFAS)**

**Subject: SWD392**

**Version: 1.0**

- Hanoi, May 2026 -

---

## **Record of Changes**

| **Version** | **Date** | **A/M/D*** | **In charge** | **Change Description** |
| :--- | :--- | :--- | :--- | :--- |
| V1.0 | 26/05/2026 | A | SWD392 Team | Initial release of Requirement Specification (Section I) for AFAS including Problem Description, Features, Context, NFRs, Use Cases, Activity Diagrams, and Data Dictionary. |
| V1.1 | 27/05/2026 | A | SWD392 Team | Added Analysis Models (Section II): Interaction Diagrams (Sequence & Communication) for UC01, UC03, UC05, UC06, UC07, UC08, UC11; State Diagrams for AttendanceVersion, AttendanceRecord, DeviceBinding; Static Analysis (Contextual Boundary Class Diagram, Object Structuring Criteria, UI Mockups). |
| V1.2 | 27/05/2026 | A | SWD392 Team | Added Design Specification (Section III): Integrated Communication Diagram, 3-View Architecture, Component/Package Diagrams, Detailed Class Design, Database Schema. Added Implementation Mapping (Section IV) and Verification/Testing (Section V). |
| V1.3 | 09/06/2026 | M | SWD392 Team | Added cross-phase traceability framework: source-to-feature matrix, business process model, anti-fraud rule catalog, missing dynamic analysis diagrams for UC02/UC04/UC09/UC10, analysis-to-design transformation matrices, NFR realization matrix, DB rule mappings, implementation traceability, and verification coverage matrix. |
| V1.4 | 13/07/2026 | M | SWD392 Team | Refined Requirement Modeling scope for SWD392: removed production-grade SSO/email/network evidence from MVP, simplified NFRs, renamed UC05 to Manage Attendance Session, added business rule catalog, requirement traceability matrix, and end-to-end activity diagram. |

*\*A - Added, M - Modified, D - Deleted*

---

### **Contents**

*   [I. Requirement Specification](#i-requirement-specification)
    *   [I.1 Problem description](#i1-problem-description)
    *   [I.2 Major Features](#i2-major-features)
    *   [I.3 System context](#i3-system-context)
    *   [I.4 Non-functional Requirements](#i4-non-functional-requirements)
    *   [I.5 Functional requirements](#i5-functional-requirements)
        *   [I.5.1 Use case diagrams](#i51-use-case-diagrams)
        *   [I.5.2 Use case descriptions](#i52-use-case-descriptions)
        *   [I.5.3 Activity diagrams](#i53-activity-diagrams)
    *   [I.6 Business Rules](#i6-business-rules)
    *   [I.7 Requirement Traceability](#i7-requirement-traceability)
    *   [I.8 Data Requirements](#i8-data-requirements)

---

## **I. Requirement Specification**

## **I.1 Problem description**

**Purpose:** Automate the classroom attendance process and implement robust defense layers to prevent common attendance fraud, such as proxy check-ins (friends checking in for absent students) and sharing classroom QR codes with absent students off-campus. The system simulates a university environment of approximately 8,000 students.

The core requirements are described as follows:

1.  **Authentication:** Students, lecturers, and administrators must log into the system using their assigned school account credentials before performing role-specific actions.
2.  **Dynamic QR Code Attendance:** To prevent students from taking photos of the QR code and sharing it with absent peers, the lecturer starts an attendance session which displays a dynamic QR code on the projector screen. The QR attendance code refreshes every 10 seconds, and the system accepts it only within a short validity window.
3.  **Geofencing:** During check-in, the student's submitted location is compared with the classroom's configured location and allowed radius. If the student is outside the allowed classroom range, the attempt is rejected and retained for lecturer review.
4.  **Biometric Verification:** To reduce proxy check-ins, the student must complete biometric verification on the device before submitting attendance. If biometric verification is unavailable, the system allows a face selfie as attendance proof.
5.  **Device Evidence:** The student device identifier is recorded with each attendance attempt as supporting evidence. It is not used as a separate trusted-device or email-alert workflow in the MVP scope.
6.  **Attendance Session Management:** Lecturers can start a session, stop receiving check-ins, review the result, and finalize the attendance result before reporting.
7.  **Real-time Monitoring:** As students successfully check in, the lecturer interface highlights their attendance status for live classroom monitoring.
8.  **Manual Adjustments:** Lecturers can review rejected attempts and manually adjust a student's attendance status when there is a legitimate reason. Every adjustment must record the lecturer, time, previous status, new status, and reason.
9.  **Reporting:** Lecturers can export finalized attendance sheets to spreadsheet formats such as Excel.
10. **System Configurations:** Administrators manage users, subjects, class sections, and classroom location settings, including the allowed attendance radius.

---

## **I.2 Major Features**

The system comprises three main portals: Student Mobile App, Lecturer Web Portal, and Admin Web Portal.

### **Features for Students (Mobile & Web):**
*   **F01: Personal Authentication:** Login using assigned school account credentials.
*   **F02: Identity Verification:** Complete biometric verification, or capture a face selfie when biometric verification is unavailable.
*   **F03: Scan QR Code:** Open camera, verify student identity, scan the dynamic QR code, and submit location and device evidence.
*   **F04: Check In via PIN Fallback:** Enter the 6-digit PIN code displayed on the lecturer screen if the camera is broken. Location and device evidence are still recorded.
*   **F05: View Attendance History:** Track attended, late, and absent sessions with visual statistics.

### **Features for Lecturers (Web Portal):**
*   **F06: Class Section Management:** View assigned classes, schedule, and student rosters.
*   **F07: Manage Attendance Session:** Start the session, display dynamic QR (10s refresh) and PIN (30s refresh), stop receiving check-ins, and finalize the result.
*   **F08: Real-time Attendance Monitor:** Track live check-in progress with color-coded student names.
*   **F09: Manual Adjustments:** Manually change official student attendance status (`Present`, `Late`, or `Absent`) and accept a rejected check-in attempt when there is a legitimate reason.
*   **F10: Export Attendance Report:** Export attendance history sheets to spreadsheet formats such as Excel.

### **Features for Administrators (Web Portal):**
*   **F11: System Catalog Management:** Manage accounts (Students, Lecturers), Subjects, and Class Sections.
*   **F12: Classroom Location Configuration:** Setup room location and custom allowed radius.



## **I.3 System context**

The system context diagram models the boundary between the Anti-Fraud Attendance System (AFAS) and the external actors or devices involved in the attendance process.

```plantuml
@startuml System_Context_Class_Diagram
skinparam ClassBackgroundColor #F9F9F9
skinparam ClassBorderColor #2E86C1
skinparam ArrowColor #2E86C1
skinparam ClassFontSize 12

class "Anti-Fraud Attendance System" as Anti_Fraud_Attendance_System <<software system>>

class Student <<external user>>

class Lecturer <<external user>>

class Admin <<external user>>

class "Mobile Device Hardware" as MobileDeviceHardware <<external I/O device>>

Student "1..*" --> "1" Anti_Fraud_Attendance_System : Interacts with >
Lecturer "1..*" --> "1" Anti_Fraud_Attendance_System : Interacts with >
Admin "1..*" --> "1" Anti_Fraud_Attendance_System : Interacts with >

Anti_Fraud_Attendance_System "1" --> "1..*" MobileDeviceHardware : Communicates with >
@enduml
```

---

## **I.4 Non-functional Requirements**

*   **NF-01 Performance & Concurrency:**
    *   The attendance confirmation result must be shown within **< 2.0 seconds** for 95% of check-in attempts under a peak load of **500 - 1,000 concurrent students** within a 5-minute window.
    *   Live attendance monitor updates must appear on the lecturer's screen within **< 1.0 second** after the check-in is accepted.

*   **NF-02 Location Accuracy:**
    *   The system must support classroom attendance validation with an acceptable location error tolerance of **15 - 20 meters**.

*   **NF-03 Usability:**
    *   System interfaces must be clear, readable, and usable on common mobile and desktop screens.

*   **NF-04 Security & Privacy:**
    *   Student authentication and attendance evidence must be protected from unauthorized access.
    *   Student face evidence captured during fallback checks must be protected and automatically removed after the semester ends.
    *   Audit logs must be generated for all administrative actions and lecturer manual adjustments.

*   **NF-05 Reliability & Availability:**
    *   If the attendance session cannot be continued due to network interruption, lecturers must be able to reopen a short check-in window or perform manual adjustment with reason.

*   **NF-06 Maintainability:**
    *   QR validity duration, Late threshold, and classroom radius must be configurable without changing source code.

*   **NF-07 Scalability:**
    *   The system must support approximately **8,000 students** while satisfying the peak classroom check-in metrics stated in NF-01.





## **I.5 Functional requirements**

### **I.5.1 Use case diagrams**

The functional requirements are summarized in one system-level use case diagram. All use cases are inside the AFAS system boundary.

#### **Overview Use Case Diagram**
```plantuml
@startuml Overview_Use_Case_Diagram
left to right direction
skinparam ActorBackgroundColor #F9F9F9
skinparam ActorBorderColor #2E86C1
skinparam UseCaseBackgroundColor #AED6F1
skinparam UseCaseBorderColor #2E86C1
skinparam ArrowColor #2E86C1

actor Student
actor Lecturer
actor Admin

rectangle "Anti-Fraud Attendance System" as AFAS {
    usecase "UC01: Authenticate User" as UC01
    usecase "UC02: Check In via Dynamic QR Code" as UC02
    usecase "UC03: View Personal Attendance History" as UC03
    usecase "UC04: Check In via PIN Fallback" as UC04
    usecase "UC05: Manage Attendance Session" as UC05
    usecase "UC06: Monitor Attendance in Real Time" as UC06
    usecase "UC07: Adjust Attendance Manually" as UC07
    usecase "UC08: Export Attendance Report" as UC08
    usecase "UC09: Manage System Catalog" as UC09
    usecase "UC10: Configure Classroom Location" as UC10
}

Student --> UC01
Student --> UC02
Student --> UC03
Student --> UC04

Lecturer --> UC01
Lecturer --> UC05
Lecturer --> UC06
Lecturer --> UC07
Lecturer --> UC08

Admin --> UC01
Admin --> UC09
Admin --> UC10

@enduml
```

---

### **I.5.2 Use case descriptions**

Below are the detailed descriptions for all **10 Use Cases** of the AFAS system:

#### **Table I-1: Use case description for UC01 - Authenticate User**
| **Field** | **Description** |
| :--- | :--- |
| **ID and Name:** | **UC01: Authenticate User** |
| **Created By:** | SWD392 Team |
| **Primary Actor:** | Student, Lecturer, Admin |
| **Secondary Actor:** | None |
| **Description:** | Allows any system user to authenticate and access the correct system area according to their role. |
| **Trigger:** | The user opens the mobile application or visits the web portal. |
| **Preconditions:** | The user account must exist in the system. |
| **Postconditions:** | **POST-1 Success:** User is authenticated, access to the correct portal is granted, and the user is redirected to their dashboard. <br>**POST-2 Failure:** Authentication fails and access is denied. |
| **Normal Flow:** | 1. User enters assigned school account credentials.<br>2. User submits the login request.<br>3. System validates the user's identity and role.<br>4. System grants access to the correct system area.<br>5. System shows the user's homepage. |
| **Alternative Flows:** | **A1.1 User forgets password:** User selects "Forgot Password", provides the required account information, and follows the reset instruction. |
| **Exceptions:** | **E3.1 Invalid credentials:** System returns an error message and denies access. |
| **Priority:** | High |
| **Business Rules:** | BR-01 |

---

#### **Table I-2: Use case description for UC02 - Check In via Dynamic QR Code**
| **Field** | **Description** |
| :--- | :--- |
| **ID and Name:** | **UC02: Check In via Dynamic QR Code** |
| **Created By:** | SWD392 Team |
| **Primary Actor:** | Student |
| **Description:** | Student scans the active dynamic QR code on the projector screen and submits required location, device, and identity evidence to record attendance. |
| **Trigger:** | The student selects "Scan QR" from the dashboard. |
| **Preconditions:** | - Student is logged in (UC01).<br>- Dynamic QR session is active (UC05). |
| **Postconditions:** | **POST-1 Success:** The student's official attendance result for the study session is `Present` or `Late`, and the lecturer screen is updated in real time.<br>**POST-2 Failure:** The check-in attempt is rejected and retained for lecturer review, but it is not counted as the official attendance result. |
| **Normal Flow:** | 1. Student taps "Scan QR Check-in" on the mobile app.<br>2. App prompts for student identity verification.<br>3. Student successfully completes identity verification.<br>4. App displays the camera view.<br>5. Student scans the active QR code on the screen.<br>6. App collects the student's current location and device identifier.<br>7. App submits the check-in evidence to the system.<br>8. System verifies that the scanned attendance code is active and matches the current attendance session. (See E8.1)<br>9. System compares the student's submitted location with the classroom's allowed range. (See E9.2)<br>10. System records the check-in attempt for audit purposes.<br>11. System registers the official attendance result as `Present` or `Late` based on the check-in time.<br>12. System updates the Lecturer portal immediately. |
| **Alternative Flows:** | **A3.1 Identity verification unavailable:** If biometric verification is not supported by the device, the student captures a face selfie as fallback proof. |
| **Exceptions:** | **E3.2 Identity verification failed:** If biometric verification fails and no valid fallback proof is provided, the system blocks the check-in submission.<br>**E8.1 Attendance code expired:** If the attendance code has expired, the system rejects the check-in and returns "QR expired". No valid attendance result is created.<br>**E9.1 Location unavailable:** If the app cannot obtain the student's current location, the submission is blocked and the student is prompted to enable location services.<br>**E9.2 Outside allowed classroom range:** If the submitted location is outside the classroom's allowed range, the system records the attempt as `Rejected`, notifies the student that the check-in is not accepted, and keeps the attempt available for lecturer review.<br>**E11.1 Official result already exists:** If the student already has an official attendance result for this study session, the system returns the existing result without creating a duplicate official result. |
| **Priority:** | High |
| **Business Rules:** | BR-02, BR-03, BR-04, BR-05, BR-06, BR-12, BR-13 |

---

#### **Table I-3: Use case description for UC03 - View Personal Attendance History**
| **Field** | **Description** |
| :--- | :--- |
| **ID and Name:** | **UC03: View Personal Attendance History** |
| **Created By:** | SWD392 Team |
| **Primary Actor:** | Student |
| **Description:** | Allows students to view a summary of their attendance record for all enrolled class sections, including total present, late, and absent days. |
| **Trigger:** | The student selects the "History" tab from the navigation bar. |
| **Preconditions:** | Student is authenticated (UC01). |
| **Postconditions:** | Student views their visual attendance stats. |
| **Normal Flow:** | 1. Student taps "History" tab.<br>2. App requests the attendance history from the system.<br>3. System retrieves all records linked to the student.<br>4. App displays a list of enrolled class sections.<br>5. Student selects a class section.<br>6. App renders a detailed calendar view showing days present (Green), late (Orange), and absent (Red). |
| **Alternative Flows:** | None. |
| **Exceptions:** | **E3.1 System unavailable:** App informs the student that attendance history cannot be loaded and asks the student to try again later. |
| **Priority:** | Medium |
| **Business Rules:** | BR-01 |

---

#### **Table I-4: Use case description for UC04 - Check In via PIN Fallback**
| **Field** | **Description** |
| :--- | :--- |
| **ID and Name:** | **UC04: Check In via PIN Fallback** |
| **Created By:** | SWD392 Team |
| **Primary Actor:** | Student |
| **Description:** | Allows students to manually type a 6-digit dynamic PIN code displayed on the screen to check in if their device camera is broken or unable to scan, while still providing location and device evidence. |
| **Trigger:** | The student selects the "PIN Check-in" option on the App. |
| **Preconditions:** | - Student is logged in (UC01).<br>- Dynamic QR/PIN session is active (UC05). |
| **Postconditions:** | **POST-1 Success:** The student's official attendance result is `Present` or `Late`, and the check-in evidence is recorded.<br>**POST-2 Failure:** The PIN check-in attempt is rejected and retained for lecturer review when relevant. |
| **Normal Flow:** | 1. Student selects "PIN Check-in" on the App.<br>2. App prompts for student identity verification.<br>3. Student successfully completes identity verification.<br>4. App displays an input screen with 6 digit slots.<br>5. Student types the active 6-digit PIN displayed on the projector screen.<br>6. App collects the student's current location and device identifier.<br>7. System verifies that the PIN code is active.<br>8. System compares the student's submitted location with the classroom's allowed range. (See E7.4)<br>9. System records the check-in attempt for audit purposes.<br>10. System records the official attendance result as `Present` or `Late` based on the check-in time. |
| **Alternative Flows:** | **A3.1 Identity verification unavailable:** If biometric verification is not supported by the device, the student captures a face selfie as fallback proof. |
| **Exceptions:** | **E3.2 Identity verification failed:** If biometric verification fails and no valid fallback proof is provided, the system blocks the check-in submission.<br>**E7.1 PIN Expired:** If the student enters a PIN that has expired, the system rejects it. No valid attendance result is created.<br>**E7.2 Location unavailable:** If the app cannot obtain the student's current location, the submission is blocked and the student is prompted to enable location services.<br>**E7.3 Official result already exists:** If the student already has an official attendance result for this study session, the system returns the existing result without creating a duplicate official result.<br>**E7.4 Outside allowed classroom range:** If the submitted location is outside the classroom's allowed range, the system records the attempt as `Rejected`, notifies the student that the check-in is not accepted, and keeps the attempt available for lecturer review. |
| **Priority:** | High |
| **Business Rules:** | BR-03, BR-04, BR-05, BR-06, BR-07, BR-12, BR-13 |

---

#### **Table I-5: Use case description for UC05 - Manage Attendance Session**
| **Field** | **Description** |
| :--- | :--- |
| **ID and Name:** | **UC05: Manage Attendance Session** |
| **Created By:** | SWD392 Team |
| **Primary Actor:** | Lecturer |
| **Description:** | Lecturer manages the attendance session lifecycle for a class, including starting the session, stopping new check-ins, reviewing results, and finalizing attendance. |
| **Trigger:** | The lecturer selects a scheduled session and clicks "Start Attendance". |
| **Preconditions:** | Lecturer is logged in (UC01) and currently within the scheduled session time window. |
| **Postconditions:** | **POST-1 Success:** Attendance result is finalized and ready for report export.<br>**POST-2 Failure:** Requested session action is not completed, and an error is displayed. |
| **Normal Flow:** | 1. Lecturer navigates to "My Scheduled Classes" on Web Portal.<br>2. System displays assigned classes and scheduled sessions.<br>3. Lecturer selects the current session and clicks "Start Attendance".<br>4. System validates that the current time is within the session's scheduled window.<br>5. System marks the attendance session as active.<br>6. System begins displaying a QR attendance code refreshed every 10 seconds and a PIN code refreshed every 30 seconds.<br>7. Web Portal displays the projector view with the dynamic QR, PIN, and attendance progress.<br>8. Students submit check-ins through UC02 or UC04 while the session is active.<br>9. Lecturer clicks "Stop Receiving Check-ins".<br>10. System stops accepting new QR/PIN check-ins for the session.<br>11. Lecturer reviews attendance results and rejected attempts.<br>12. Lecturer adjusts a student's status using UC07 if needed.<br>13. System identifies enrolled students without an official `Present` or `Late` result and assigns them `Absent`.<br>14. Lecturer reviews the completed attendance list.<br>15. Lecturer clicks "Finalize Attendance".<br>16. System marks the attendance result as finalized. |
| **Alternative Flows:** | **A11.1 Adjustment before finalization:** Lecturer adjusts a student's status using UC07 before finalizing the result.<br>**A10.1 Short reopen:** If check-in could not continue due to classroom connection interruption, lecturer reopens a short check-in window before finalization. |
| **Exceptions:** | **E4.1 Outside scheduled hours:** If lecturer tries to start session outside the class time slot, system denies activation.<br>**E5.1 Session already active:** If the selected study session already has an active attendance session, system denies creating another active session. |
| **Priority:** | High |
| **Business Rules:** | BR-02, BR-06, BR-08, BR-10, BR-12 |

---

#### **Table I-6: Use case description for UC06 - Monitor Attendance in Real Time**
| **Field** | **Description** |
| :--- | :--- |
| **ID and Name:** | **UC06: Monitor Attendance in Real Time** |
| **Created By:** | SWD392 Team |
| **Primary Actor:** | Lecturer |
| **Description:** | Lecturer monitors the check-in progress on a live grid where student names turn green in real-time as they successfully scan the QR. |
| **Trigger:** | The lecturer opens the live attendance monitor for an active attendance session. |
| **Preconditions:** | Attendance session must be active. |
| **Postconditions:** | Lecturer has real-time visualization of class attendance. |
| **Normal Flow:** | 1. Lecturer opens the attendance monitor for the active session.<br>2. System displays a grid representing all students enrolled in the class section.<br>3. As a student successfully submits a check-in through UC02 or UC04, System processes and validates it.<br>4. System updates the student's displayed attendance status.<br>5. The lecturer's web interface changes the student's tile to green (Present) or orange (Late).<br>6. Attendance count updates dynamically. |
| **Alternative Flows:** | None. |
| **Exceptions:** | **E5.1 Connection Interrupted:** If live updates are interrupted, Web Portal displays a warning and allows the lecturer to refresh the monitor. |
| **Priority:** | High |
| **Business Rules:** | None. See NF-01 for real-time update performance. |

---

#### **Table I-7: Use case description for UC07 - Adjust Attendance Manually**
| **Field** | **Description** |
| :--- | :--- |
| **ID and Name:** | **UC07: Adjust Attendance Manually** |
| **Created By:** | SWD392 Team |
| **Primary Actor:** | Lecturer |
| **Description:** | Allows the lecturer to manually change a student's official attendance status, including accepting a rejected check-in attempt as `Present` or `Late` when there is a legitimate reason. |
| **Trigger:** | Lecturer selects a student name from the list and clicks "Adjust Status". |
| **Preconditions:** | Lecturer is authenticated (UC01) and an attendance record or session roster exists for the target student and session. |
| **Postconditions:** | Student status is updated in the system and logged for audit. |
| **Normal Flow:** | 1. Lecturer views the student roster for the active or past session.<br>2. Lecturer clicks on a specific student tile or rejected attempt and selects "Adjust Status".<br>3. System displays the current status, evidence summary, and status options: `Present`, `Late`, `Absent`.<br>4. Lecturer selects the new status and enters a reason (e.g., "GPS device hardware error").<br>5. Lecturer clicks "Save".<br>6. System records the previous status, new status, reason, lecturer, and adjustment time.<br>7. System updates the student's official attendance result. |
| **Alternative Flows:** | None. |
| **Exceptions:** | **E5.1 Missing reason:** If the lecturer changes status without inputting a mandatory reason, the system prompts them to write a reason before saving. |
| **Priority:** | High |
| **Business Rules:** | BR-09, BR-10 |

---

#### **Table I-8: Use case description for UC08 - Export Attendance Report**
| **Field** | **Description** |
| :--- | :--- |
| **ID and Name:** | **UC08: Export Attendance Report** |
| **Created By:** | SWD392 Team |
| **Primary Actor:** | Lecturer |
| **Description:** | Exports the attendance statistics sheet for a specific class section or semester into spreadsheet formats such as Excel for grading and academic records. |
| **Trigger:** | The lecturer clicks the "Export Report" button on the class details screen. |
| **Preconditions:** | Lecturer is logged in (UC01), and attendance results to be exported are finalized. |
| **Postconditions:** | Attendance report file is downloaded to the lecturer's local computer. |
| **Normal Flow:** | 1. Lecturer navigates to class detail view.<br>2. Lecturer clicks "Export Report".<br>3. System compiles all session records of that class from the class rosters and student history.<br>4. System prepares report content containing student info, date of sessions, check-in mode, warnings, rejected attempts, and aggregate attendance percentage.<br>5. System generates the attendance report file.<br>6. Lecturer saves the report file locally. |
| **Alternative Flows:** | None. |
| **Exceptions:** | **E3.1 No records exist:** If no attendance sessions have been run for the class, system displays an empty-state message and disables the export button. |
| **Priority:** | Medium |
| **Business Rules:** | BR-08 |

---

#### **Table I-9: Use case description for UC09 - Manage System Catalog**
| **Field** | **Description** |
| :--- | :--- |
| **ID and Name:** | **UC09: Manage System Catalog** |
| **Created By:** | SWD392 Team |
| **Primary Actor:** | Admin |
| **Description:** | Allows administrative staff to create, update, or delete system raw catalog records: User accounts (Students/Lecturers), Subjects, and Class Sections. |
| **Trigger:** | Admin clicks on any catalog link in the Admin Portal menu. |
| **Preconditions:** | Admin is logged in (UC01). |
| **Postconditions:** | Catalog information is updated in the system. |
| **Normal Flow:** | 1. Admin logs into the Admin Portal.<br>2. Admin clicks on a catalog menu option (e.g., "Students", "Subjects").<br>3. System displays a grid with search/add/edit/delete actions.<br>4. Admin inputs new student details (Student ID, Full Name, Email) and submits.<br>5. System validates the input and records the new student information and user profile. |
| **Alternative Flows:** | **A4.1 Batch Import:** Admin uploads a structured data file containing student/subject records. System parses the file, validates the data, and imports the new records into the system. |
| **Exceptions:** | **E5.1 Duplicate ID:** If Admin attempts to add a student ID that already exists, system displays a validation error: "ID already exists". |
| **Priority:** | High |
| **Business Rules:** | BR-11 |

---

#### **Table I-10: Use case description for UC10 - Configure Classroom Location**
| **Field** | **Description** |
| :--- | :--- |
| **ID and Name:** | **UC10: Configure Classroom Location** |
| **Created By:** | SWD392 Team |
| **Primary Actor:** | Admin |
| **Description:** | Admin configures the exact classroom location and allowed attendance radius for classrooms on campus, which serves as the source for location-based attendance validation. |
| **Trigger:** | Admin clicks "Room Management" on the dashboard. |
| **Preconditions:** | Admin is logged in (UC01). |
| **Postconditions:** | Room location settings are updated in the room configurations. |
| **Normal Flow:** | 1. Admin navigates to "Room Management".<br>2. System displays all physical classrooms on campus.<br>3. Admin selects a room (e.g., `AL-L402`) and clicks "Configure Location".<br>4. System opens a configuration form for room location and allowed attendance radius.<br>5. Admin sets the exact classroom center point or manually inputs the classroom location values.<br>6. Admin enters the `Allowed Radius` parameter (e.g., 20 meters).<br>7. Admin clicks "Save Configuration".<br>8. System verifies that the location belongs to the university campus, updates the room configurations, and logs the administrative action in the audit log. |
| **Alternative Flows:** | **A5.1 On-site Mobile Calibration:** Admin visits the room physically on-site and selects "Capture Current Location". The current location is automatically populated. |
| **Exceptions:** | **E8.1 Out-of-bounds Location:** If Admin inputs a location that is not within the university's boundary, system prompts a warning to verify the number. |
| **Priority:** | High |
| **Business Rules:** | BR-03 |

---

### **I.5.3 Activity diagrams**

Below are the activity diagrams modeling the end-to-end attendance process and the key event flows of check-in, session management, and manual adjustment.

#### **Figure I-11: Overall activity diagram for attendance process**

```plantuml
@startuml Overall_Attendance_Process_Activity
skinparam ActivityBackgroundColor #AED6F1
skinparam ActivityBorderColor #2E86C1
skinparam ActivityDiamondBackgroundColor #AED6F1
skinparam ActivityDiamondBorderColor #2E86C1
skinparam ArrowColor #2E86C1
skinparam ActivityFontSize 12
skinparam swimlaneBorderColor #2E86C1
skinparam swimlaneHeaderFontStyle bold

|Admin|
start
:1. Configure classroom location\nand allowed radius;
:2. Maintain users, subjects,\nand class sections;

|Lecturer|
:3. Open assigned class session;
:4. Start attendance session;

|System|
:5. Display dynamic QR code\nand backup PIN;

|Student|
:6. Scan QR code\nor enter PIN;
:7. Complete biometric verification\nor provide face selfie proof;

|System|
:8. Check attendance code validity;
:9. Check classroom location range;

if (Check-in accepted?) then ([Yes])
  :10. Record official result\n(Present or Late);
  |Lecturer|
  :11. Monitor live attendance status;
else ([No])
  |System|
  :10a. Record rejected attempt\nwith reason;
  |Lecturer|
  :11a. Review rejected attempt;
endif

|Lecturer|
if (Manual adjustment needed?) then ([Yes])
  :12. Adjust attendance status\nwith reason;
else ([No])
endif
:13. Stop receiving check-ins;
|System|
:14. Assign Absent to enrolled students\nwithout official Present or Late;
|Lecturer|
:15. Review completed attendance list;
:16. Finalize attendance result;
:17. Export attendance report;
stop
@enduml
```

---

#### **Figure I-12: Activity diagram for UC02 - Check In via Dynamic QR Code**

```plantuml
@startuml UC02_Activity_Swimlane
skinparam ActivityBackgroundColor #AED6F1
skinparam ActivityBorderColor #2E86C1
skinparam ActivityDiamondBackgroundColor #AED6F1
skinparam ActivityDiamondBorderColor #2E86C1
skinparam ArrowColor #2E86C1
skinparam ActivityFontSize 12
skinparam swimlaneBorderColor #2E86C1
skinparam swimlaneHeaderFontStyle bold

|Student|
start
:1. Tap "Scan QR Check-in" button;

|System|
:2. Request student identity verification;

|Student|
:3. Perform identity verification;

|System|
if (Identity verified successfully?) then ([No / Fallback])
  :A3.1 Prompt face selfie capture\nas fallback proof;
  |Student|
  :Capture face selfie;
  |System|
  if (Is fallback proof valid?) then ([No])
    :E3.2 Block check-in submission;
    |Student|
    stop
  else ([Yes])
    :4. Open camera for scanning;
  endif
else ([Yes])
  :4. Open camera for scanning;
endif

|Student|
:5. Point camera at projector QR code;

|System|
:6. Read scanned attendance code;
:7. Collect student's location,\ndevice evidence, and current time;
:8. Submit check-in evidence to system;

|System|
if (Is the QR attendance code active and valid?) then ([No])
  :E8.1 Reject - QR code expired;
  |System|
  :Show expired session error alert;
  stop
else ([Yes])
endif

|System|
if (Is student within the allowed classroom range?) then ([No])
  :9. Record attempt as\nRejected;
  |System|
  :Show rejected check-in message;
  |Student|
  stop
else ([Yes])
endif

|System|
:10. Record accepted attempt\nand official status (Present / Late);
:11. Update Lecturer Monitor;

|System|
:12. Display "Check-in Successful" message;

|Student|
stop
@enduml
```

---

#### **Figure I-13: Activity diagram for UC05 - Manage Attendance Session**

```plantuml
@startuml UC05_Activity_Swimlane
skinparam ActivityBackgroundColor #AED6F1
skinparam ActivityBorderColor #2E86C1
skinparam ActivityDiamondBackgroundColor #AED6F1
skinparam ActivityDiamondBorderColor #2E86C1
skinparam ArrowColor #2E86C1
skinparam ActivityFontSize 12
skinparam swimlaneBorderColor #2E86C1
skinparam swimlaneHeaderFontStyle bold

|Lecturer|
start
:1. Navigate to assigned classes list;
:2. Select class section and current scheduled session;
:3. Click "Start Attendance" button;

|System|
if (Is the request within the scheduled class time window?) then ([No])
  :E4.1 Reject - outside scheduled time window;
  |Lecturer|
  stop
else ([Yes])
endif

:5. Activate the attendance session;
:6. Start refreshing dynamic QR code\nand backup PIN;

|System|
:7. Display projector view (QR code + PIN + countdown);

|Lecturer|
:8. Project screen for students to scan;

repeat

  |System|
  :Refresh dynamic QR code (every 10s)\nand backup PIN (every 30s);

  |System|
  :Update displayed QR and PIN on the screen;
  :Refresh live list of checked-in students;

  |Lecturer|
  :Monitor real-time class check-in progress;

repeat while (Receiving check-ins?) is ([Yes])
-> [Lecturer clicks Stop Receiving Check-ins];

|Lecturer|
:9. Click "Stop Receiving Check-ins";

|System|
:10. Stop accepting new QR/PIN check-ins;

|Lecturer|
:11. Review attendance results\nand rejected attempts;

if (Need manual adjustment?) then ([Yes])
  :12. Adjust attendance status\nusing UC07;
else ([No])
endif

|System|
:13. Assign Absent to enrolled students\nwithout official Present or Late;

|Lecturer|
:14. Review completed attendance list;
:15. Click "Finalize Attendance";

|System|
:16. Mark attendance result as finalized;
:17. Close projector view and return to session dashboard;

|Lecturer|
stop
@enduml
```

---

#### **Figure I-14: Activity diagram for UC07 - Adjust Attendance Manually**

```plantuml
@startuml UC07_Activity_Swimlane
skinparam ActivityBackgroundColor #AED6F1
skinparam ActivityBorderColor #2E86C1
skinparam ActivityDiamondBackgroundColor #AED6F1
skinparam ActivityDiamondBorderColor #2E86C1
skinparam ArrowColor #2E86C1
skinparam ActivityFontSize 12
skinparam swimlaneBorderColor #2E86C1
skinparam swimlaneHeaderFontStyle bold

|Lecturer|
start
:1. Open attendance roster\nfor a session;
:2. Select a student record\nor rejected attempt;
:3. Click "Adjust Status";

|System|
:4. Display current attendance status,\nevidence summary, and adjustment form;

|Lecturer|
:5. Select new official status\n(Present / Late / Absent);
:6. Enter adjustment reason;
:7. Click "Save";

|System|
if (Is reason provided?) then ([No])
  :E5.1 Reject save and request reason;
  |Lecturer|
  :Enter required reason;
else ([Yes])
endif

|System|
:8. Update attendance status;
:9. Record previous status,\nnew status, lecturer, reason,\nand adjustment time;
:10. Refresh attendance roster;

|Lecturer|
:11. View updated attendance status;
stop
@enduml
```

---

## **I.6 Business Rules**

The following business rules use stable IDs so that later Analysis, Design, and Test artifacts can reference the same rule without ambiguity.

| **ID** | **Business Rule** |
| :--- | :--- |
| **BR-01** | All users must authenticate before accessing role-specific functions, and users can access only data/actions allowed by their role. |
| **BR-02** | QR attendance code changes every 10 seconds, and the system accepts it for at most 15 seconds from the time it is displayed. The backup PIN changes every 30 seconds. |
| **BR-03** | Each classroom has a configurable allowed attendance radius, defaulting to 20 meters; attempts outside the allowed range are rejected and retained for lecturer review. |
| **BR-04** | A student must complete biometric verification before submitting attendance; if unavailable, a face selfie can be used only as attendance proof, viewed only by authorized users, and removed after the semester ends. |
| **BR-05** | The student device identifier is recorded with each attendance attempt as supporting evidence. |
| **BR-06** | A student can make multiple check-in attempts in one attendance session, but can have at most one official attendance result for each study session. |
| **BR-07** | PIN check-in is only a fallback when QR scanning is unavailable or impractical, and it must still satisfy identity, location, and device evidence rules. |
| **BR-08** | Attendance reports must be exported from finalized attendance results. |
| **BR-09** | Every manual adjustment must record previous status, new status, reason, lecturer, and adjustment time. |
| **BR-10** | Each study session can have at most one active attendance session, and only the assigned lecturer can manage it. |
| **BR-11** | Catalog identifiers, including student identifiers and class section identifiers, must be unique across the system. |
| **BR-12** | Time checks for QR validity, PIN validity, and Late status use the official system time. |
| **BR-13** | A check-in accepted within the first 15 minutes after the scheduled class start time is `Present`; a later accepted check-in is `Late`. |

---

## **I.7 Requirement Traceability**

| **Source Requirement** | **Feature(s)** | **Use Case(s)** | **Business Rule(s)** |
| :--- | :--- | :--- | :--- |
| Dynamic QR attendance | F03, F07 | UC02, UC05 | BR-02, BR-12, BR-13 |
| Late threshold classification | F03, F04 | UC02, UC04 | BR-13 |
| Geofencing | F03, F04, F12 | UC02, UC04, UC10 | BR-03 |
| Biometric or selfie verification | F02, F03, F04 | UC02, UC04 | BR-04 |
| Device ID evidence | F03, F04 | UC02, UC04 | BR-05 |
| Real-time lecturer monitoring | F08 | UC06 | NF-01 |
| Manual adjustment and finalization | F07, F09 | UC05, UC07 | BR-08, BR-09, BR-10 |
| Excel/spreadsheet export | F10 | UC08 | BR-08 |
| System catalog and classroom setup | F11, F12 | UC09, UC10 | BR-03, BR-11 |

---

## **I.8 Data Requirements**

This section keeps only the data dictionary needed for Requirement Modeling. Entity class diagrams and object relationships belong to Analysis Modeling.

### **Table I-11: Data Description (Data dictionary)**

| **Name** | **Data Type** | **Description** |
| :--- | :--- | :--- |
| **UserAccount** | | **User credentials account data** |
| AccountCode | Text | Unique identifier for the account. |
| SchoolEmail | Text | Registered school email address. |
| ProtectedPassword | Text | Protected password information used for account authentication. |
| FullName | Text | Full display name of the user. |
| UserRole | Text | System access role. Must be one of: `Student`, `Lecturer`, `Admin`. |
| RegistrationDate | Date/Time | The date and time when the account was first registered. |
| **StudentProfile** | | **Student profile data** |
| StudentRollNumber | Text | Unique student roll number (e.g. `SE170123`). |
| AccountCode | Text | Links the student profile to their user account. |
| **LecturerProfile** | | **Lecturer profile data** |
| LecturerCode | Text | Assigned school lecturer ID (e.g. `HueCTM`). |
| AccountCode | Text | Links the lecturer profile to their user account. |
| DepartmentName | Text | Faculty department name. |
| **Classroom** | | **Classroom location configurations** |
| ClassroomCode | Text | Physical classroom identifier (e.g., `AL-L402`). |
| ClassroomName | Text | Display name of the room. |
| ClassroomLocation | Text | Standard classroom location used for attendance validation. |
| AllowedAttendanceRadius | Decimal | Maximum allowed attendance radius in meters (defaults to 20m). |
| **CampusBoundary** | | **University campus boundary used to validate classroom configuration** |
| CampusBoundaryCode | Text | Unique identifier for the campus boundary definition. |
| BoundaryDescription | Text | Business description of the accepted campus boundary used for classroom location validation. |
| **Subject** | | **University subject course details** |
| SubjectCode | Text | Subject code identifier (e.g., `SWD392`). |
| SubjectName | Text | Detailed course name. |
| CreditValue | Number | Credit value of the course (must be greater than 0). |
| **ClassSection** | | **Assigned course class section** |
| ClassSectionCode | Text | Class section code (e.g., `SWD392_SU26_SE1701`). |
| ClassSectionName | Text | Friendly segment name of the class. |
| SubjectCode | Text | Reference subject code. |
| LecturerCode | Text | Reference lecturer teaching this class. |
| SemesterName | Text | Academic semester name. |
| **ClassEnrollment** | | **Class enrollment roster** |
| ClassSectionCode | Text | Reference class section code. |
| StudentRollNumber | Text | Enrolled student roll number. |
| **StudySession** | | **Scheduled study session date/time** |
| StudySessionCode | Text | Unique identifier of the class session. |
| ClassSectionCode | Text | Belongs to class section code. |
| ClassroomCode | Text | Physical classroom location of the session. |
| SessionDate | Date | Scheduled calendar date. |
| StartTime | Time | Scheduled class start hour. |
| EndTime | Time | Scheduled class end hour. |
| **AttendanceSession** | | **Dynamic QR/PIN attendance session** |
| StudySessionCode | Text | Ties the attendance session to a specific scheduled study session. |
| CurrentAttendanceCode | Text | Current active attendance code displayed in the QR for verification. |
| QRCodeLastChangedAt | Date/Time | Exact timestamp when the QR attendance code was last refreshed. |
| BackupPINCode | Text | 6-digit backup fallback attendance code. |
| PINLastChangedAt | Date/Time | Exact timestamp when the PIN code was last refreshed (valid for 30s). |
| SessionStatus | Text | Indicates whether the attendance session is active, stopped, or finalized. |
| **AttendanceConfiguration** | | **Configurable attendance parameters** |
| QRRefreshSeconds | Number | Number of seconds between QR code refreshes. |
| QRValiditySeconds | Number | Maximum number of seconds an attendance QR code remains acceptable. |
| PINRefreshSeconds | Number | Number of seconds between backup PIN refreshes. |
| LateThresholdMinutes | Number | Number of minutes after scheduled class start that separates `Present` from `Late`. |
| DefaultClassroomRadiusMeters | Decimal | Default allowed classroom attendance radius in meters. |
| **CheckInAttempt** | | **Each QR/PIN submission attempt made by a student** |
| CheckInAttemptCode | Text | Unique identifier for a submitted check-in attempt. |
| StudentRollNumber | Text | Referencing the student who attempted check-in. |
| StudySessionCode | Text | Referencing the active study session. |
| SubmittedAt | Date/Time | Timestamp when the check-in evidence was submitted. |
| SubmittedLocation | Text | Location evidence submitted by the student's device. |
| DistanceFromClassroom | Decimal | Calculated distance from the configured classroom location. |
| LocationCheckResult | Text | Result of the location check: `Within allowed range` or `Outside allowed range`. |
| DeviceIdentifier | Text | Device identifier captured as attendance evidence. |
| DeviceDisplayName | Text | Device display name used during check-in. |
| FaceEvidenceReference | Text | Reference to face verification proof when fallback identity verification is used. |
| CheckInMethod | Text | Selected student check-in method: `QR` or `PIN`. Manual lecturer changes are represented by the official attendance result source and audit log, not by a student check-in method. |
| AttemptStatus | Text | Result of the check-in attempt: `Accepted` or `Rejected`. |
| RejectionReason | Text | Reason why the attempt is rejected, such as `ExpiredCode`, `OutsideLocation`, or `IdentityVerificationFailed`. |
| **AttendanceRecord** | | **Official attendance result for one student in one study session** |
| AttendanceRecordCode | Text | Unique identifier for the official attendance result. |
| StudentRollNumber | Text | Referencing the student. |
| StudySessionCode | Text | Referencing the study session. |
| AttendanceStatus | Text | Official attendance status: `Present`, `Late`, or `Absent`. |
| ResultSource | Text | Source of the official attendance result, such as accepted QR/PIN attempt, absent assignment, or lecturer manual adjustment. |
| SourceAttemptCode | Text | Reference to the accepted or reviewed check-in attempt, if available. |
| FinalizedAt | Date/Time | Timestamp when the result became part of the finalized attendance sheet. |
| **AuditLog** | | **Administrative audit history log** |
| AuditLogCode | Text | Unique audit log entry identifier. |
| ActorAccountCode | Text | Account code of the user performing the action. |
| ActionTime | Date/Time | Precise timestamp of the action. |
| ActionType | Text | Category of action performed. |
| ActionDescription | Text | Detailed description of the logged action. |

---
