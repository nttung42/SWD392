const state = {
  role: "lecturer",
  view: "lecturer-timetable",
  selectedClassId: "SWD392_SU26_SE1701",
  selectedSessionId: "SS-20260716-01",
  pinVisible: false,
  pin: "482915",
  qrSeed: 1,
  attendanceProgressIndex: 0,
  modalRecordId: null,
  adminTab: "accounts",
};

const REOPEN_WINDOW_MS = 10 * 60 * 1000;

const data = {
  accounts: [
    { id: "ACC-001", code: "SE170123", name: "Nguyen Minh An", email: "an.se170123@fpt.edu.vn", role: "Student", status: "Active", profile: "SE170123" },
    { id: "ACC-002", code: "SE170145", name: "Tran Bao Chau", email: "chau.se170145@fpt.edu.vn", role: "Student", status: "Active", profile: "SE170145" },
    { id: "ACC-003", code: "SE170188", name: "Le Quang Huy", email: "huy.se170188@fpt.edu.vn", role: "Student", status: "Active", profile: "SE170188" },
    { id: "ACC-004", code: "HueCTM", name: "Hoang Thi Hue", email: "huectm@fpt.edu.vn", role: "Lecturer", status: "Active", profile: "HueCTM" },
    { id: "ACC-005", code: "Admin01", name: "Academic Admin", email: "admin01@fpt.edu.vn", role: "Admin", status: "Active", profile: "ADM-001" },
  ],
  subjects: [
    { code: "SWD392", name: "Software Architecture and Design", credits: 3, status: "Open" },
    { code: "SWT301", name: "Software Testing", credits: 3, status: "Open" },
    { code: "PRN212", name: "Cross-Platform Application Programming", credits: 3, status: "Open" },
  ],
  classes: [
    { id: "SWD392_SU26_SE1701", name: "SWD392 - SE1701", subject: "SWD392", lecturer: "HueCTM", semester: "SU26", roster: 30 },
    { id: "SWD392_SU26_SE1702", name: "SWD392 - SE1702", subject: "SWD392", lecturer: "HueCTM", semester: "SU26", roster: 39 },
    { id: "SWT301_SU26_SE1701", name: "SWT301 - SE1701", subject: "SWT301", lecturer: "HueCTM", semester: "SU26", roster: 45 },
  ],
  rooms: [
    { id: "AL-L402", name: "Alpha L402", building: "Alpha", radius: "20m", status: "Configured" },
    { id: "BE-305", name: "Beta 305", building: "Beta", radius: "18m", status: "Configured" },
    { id: "DE-101", name: "Delta 101", building: "Delta", radius: "20m", status: "Review" },
  ],
  sessions: [
    { id: "SS-20260716-01", classId: "SWD392_SU26_SE1701", day: "Monday", date: "2026-07-16", slot: "Slot 1", start: "08:00", end: "10:15", room: "AL-L402", status: "Active", checkInState: "idle" },
    { id: "SS-20260716-02", classId: "SWD392_SU26_SE1702", day: "Tuesday", date: "2026-07-17", slot: "Slot 2", start: "10:30", end: "12:45", room: "BE-305", status: "Scheduled", checkInState: "idle" },
    { id: "SS-20260718-01", classId: "SWD392_SU26_SE1701", day: "Thursday", date: "2026-07-18", slot: "Slot 1", start: "08:00", end: "10:15", room: "AL-L402", status: "Closed", checkInState: "closed", closedAt: Date.now() - 6 * 60 * 1000, canReopen: true },
    { id: "SS-20260719-01", classId: "SWT301_SU26_SE1701", day: "Friday", date: "2026-07-19", slot: "Slot 4", start: "13:00", end: "15:15", room: "DE-101", status: "Closed", checkInState: "closed", closedAt: Date.now() - 16 * 60 * 1000, canReopen: true },
  ],
  attendance: [
    { id: "AR-001", studentId: "SE170123", name: "Nguyen Minh An", time: "-", method: "-", status: "Not Yet", reason: "" },
    { id: "AR-002", studentId: "SE170145", name: "Tran Bao Chau", time: "-", method: "-", status: "Not Yet", reason: "" },
    { id: "AR-003", studentId: "SE170188", name: "Le Quang Huy", time: "-", method: "-", status: "Not Yet", reason: "" },
    { id: "AR-004", studentId: "SE170219", name: "Pham Hoai Linh", time: "-", method: "-", status: "Not Yet", reason: "" },
    { id: "AR-005", studentId: "SE170224", name: "Do Gia Bao", time: "-", method: "-", status: "Not Yet", reason: "" },
    { id: "AR-006", studentId: "SE170231", name: "Mai Quoc Dat", time: "-", method: "-", status: "Not Yet", reason: "" },
    { id: "AR-007", studentId: "SE170246", name: "Hoang Nhat Duong", time: "-", method: "-", status: "Not Yet", reason: "" },
    { id: "AR-008", studentId: "SE170258", name: "Dang Bao Han", time: "-", method: "-", status: "Not Yet", reason: "" },
    { id: "AR-009", studentId: "SE170267", name: "Bui Minh Khang", time: "-", method: "-", status: "Not Yet", reason: "" },
    { id: "AR-010", studentId: "SE170274", name: "Vu Gia Khanh", time: "-", method: "-", status: "Not Yet", reason: "" },
    { id: "AR-011", studentId: "SE170281", name: "Pham Minh Khoi", time: "-", method: "-", status: "Not Yet", reason: "" },
    { id: "AR-012", studentId: "SE170296", name: "Le Hoang Lam", time: "-", method: "-", status: "Not Yet", reason: "" },
    { id: "AR-013", studentId: "SE170307", name: "Truong Bao Long", time: "-", method: "-", status: "Not Yet", reason: "" },
    { id: "AR-014", studentId: "SE170318", name: "Nguyen Hai Minh", time: "-", method: "-", status: "Not Yet", reason: "" },
    { id: "AR-015", studentId: "SE170329", name: "Tran Hoang Nam", time: "-", method: "-", status: "Not Yet", reason: "" },
    { id: "AR-016", studentId: "SE170334", name: "Vo Thanh Nhan", time: "-", method: "-", status: "Not Yet", reason: "" },
    { id: "AR-017", studentId: "SE170349", name: "Phan Minh Phuc", time: "-", method: "-", status: "Not Yet", reason: "" },
    { id: "AR-018", studentId: "SE170356", name: "Nguyen Anh Quan", time: "-", method: "-", status: "Not Yet", reason: "" },
    { id: "AR-019", studentId: "SE170361", name: "Dang Minh Quang", time: "-", method: "-", status: "Not Yet", reason: "" },
    { id: "AR-020", studentId: "SE170372", name: "Le Duc Tai", time: "-", method: "-", status: "Not Yet", reason: "" },
    { id: "AR-021", studentId: "SE170389", name: "Bui Anh Thu", time: "-", method: "-", status: "Not Yet", reason: "" },
    { id: "AR-022", studentId: "SE170394", name: "Do Minh Thu", time: "-", method: "-", status: "Not Yet", reason: "" },
    { id: "AR-023", studentId: "SE170405", name: "Vu Bao Tran", time: "-", method: "-", status: "Not Yet", reason: "" },
    { id: "AR-024", studentId: "SE170416", name: "Hoang Anh Tuan", time: "-", method: "-", status: "Not Yet", reason: "" },
    { id: "AR-025", studentId: "SE170427", name: "Pham Quoc Viet", time: "-", method: "-", status: "Not Yet", reason: "" },
    { id: "AR-026", studentId: "SE170438", name: "Nguyen Thanh Vy", time: "-", method: "-", status: "Not Yet", reason: "" },
    { id: "AR-027", studentId: "SE170449", name: "Tran Gia Huy", time: "-", method: "-", status: "Not Yet", reason: "" },
    { id: "AR-028", studentId: "SE170452", name: "Le Tuan Kiet", time: "-", method: "-", status: "Not Yet", reason: "" },
    { id: "AR-029", studentId: "SE170463", name: "Do Kim Ngan", time: "-", method: "-", status: "Not Yet", reason: "" },
    { id: "AR-030", studentId: "SE170474", name: "Nguyen Thai Son", time: "-", method: "-", status: "Not Yet", reason: "" },
  ],
  config: [
    ["QR refresh interval", "10 seconds"],
    ["PIN refresh interval", "30 seconds"],
    ["Late threshold", "15 minutes"],
    ["Default room radius", "20 meters"],
  ],
};

initializeAttendanceRecords();

const nav = {
  lecturer: [
    { id: "lecturer-timetable", label: "Timetable", icon: "calendar-days" },
    { id: "lecturer-classes", label: "My Classes", icon: "book-open-check" },
  ],
  admin: [
    { id: "admin-accounts", label: "Accounts", icon: "users" },
    { id: "admin-subjects", label: "Subjects", icon: "library" },
    { id: "admin-classes", label: "Class Sections", icon: "panel-top" },
    { id: "admin-rooms", label: "Rooms", icon: "map-pin" },
    { id: "admin-config", label: "Attendance Config", icon: "sliders-horizontal" },
  ],
};

const viewTitle = {
  "lecturer-timetable": ["Timetable", "Timetable"],
  "lecturer-classes": ["My Classes", "My Classes"],
  "lecturer-session-detail": ["My Classes > SWD392 - SE1701 > Section 2026-07-16 Slot 1", "Session Detail"],
  "admin-accounts": ["Admin", "Account Management"],
  "admin-subjects": ["Admin", "Subject Management"],
  "admin-classes": ["Admin", "Class Section Management"],
  "admin-rooms": ["Admin", "Room Management"],
  "admin-config": ["Admin", "Attendance Configuration"],
};

function $(selector) {
  return document.querySelector(selector);
}

function icon(name, size = 18) {
  return `<i data-lucide="${name}" width="${size}" height="${size}"></i>`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function badge(value) {
  const tone = {
    Present: "green",
    Active: "green",
    Open: "green",
    Configured: "green",
    Late: "amber",
    "Not Yet": "blue",
    Review: "amber",
    Reopened: "amber",
    Scheduled: "blue",
    Absent: "red",
    Closed: "slate",
    Passed: "green",
    "At risk": "amber",
  }[value] || "slate";
  return `<span class="badge ${tone}">${escapeHtml(value)}</span>`;
}

function toast(message) {
  const root = $("#toast");
  root.textContent = message;
  root.classList.add("show");
  setTimeout(() => root.classList.remove("show"), 2200);
}

function selectedClass() {
  return data.classes.find((item) => item.id === state.selectedClassId) || data.classes[0];
}

function selectedSession() {
  return data.sessions.find((item) => item.id === state.selectedSessionId) || data.sessions[0];
}

function isCheckInOpen(session = selectedSession()) {
  return session.checkInState === "open";
}

function isReopenable(session = selectedSession()) {
  if (session.checkInState !== "closed" || !session.canReopen || !session.closedAt) return false;
  return Date.now() - session.closedAt <= REOPEN_WINDOW_MS;
}

function isReopenedForManual(session = selectedSession()) {
  return session.checkInState === "reopened";
}

function canEditAttendance(session = selectedSession()) {
  return isReopenedForManual(session);
}

function metricClass(label) {
  return label.toLowerCase().replaceAll(" ", "-");
}

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function studentGrades(record) {
  const seed = Number(record.studentId.replace(/\D/g, "").slice(-2)) || 50;
  const progress = 6 + (seed % 4);
  const assignment = 5 + (seed % 5);
  const practical = 6 + ((seed + 2) % 4);
  const final = 5 + ((seed + 3) % 5);
  return [
    { item: "Progress test", weight: "10%", score: progress.toFixed(1), status: progress >= 5 ? "Passed" : "At risk" },
    { item: "Assignment", weight: "30%", score: assignment.toFixed(1), status: assignment >= 5 ? "Passed" : "At risk" },
    { item: "Practical exam", weight: "20%", score: practical.toFixed(1), status: practical >= 5 ? "Passed" : "At risk" },
    { item: "Final exam", weight: "40%", score: final.toFixed(1), status: final >= 5 ? "Passed" : "At risk" },
  ];
}

function plannedAttendance(index) {
  const notCheckedIn = [2, 9, 14, 18, 22, 26, 28];
  if (notCheckedIn.includes(index)) return { time: "-", method: "-", status: "Not Yet", reason: "" };
  return { time: `08:${String((index % 12) + 1).padStart(2, "0")}`, method: "QR", status: "Present", reason: "" };
}

function initializeAttendanceRecords() {
  data.attendance.forEach((record) => {
    record.time = "-";
    record.method = "-";
    record.status = "Not Yet";
    record.reason = "";
  });
  state.attendanceProgressIndex = 0;
}

function finalizeUncheckedAttendance() {
  data.attendance.forEach((record) => {
    if (record.status !== "Not Yet") return;
    record.status = "Absent";
  });
}

function advanceAttendanceProgress() {
  if (state.attendanceProgressIndex >= data.attendance.length) return false;
  let changed = false;
  while (state.attendanceProgressIndex < data.attendance.length && !changed) {
    const index = state.attendanceProgressIndex;
    const record = data.attendance[index];
    const next = plannedAttendance(index);
    state.attendanceProgressIndex += 1;
    changed = record.time !== next.time || record.method !== next.method || record.status !== next.status || record.reason !== next.reason;
    Object.assign(record, next);
  }
  return changed;
}

function render() {
  const [crumb, title] = viewTitle[state.view] || ["AFAS", "Portal"];
  $("#breadcrumb").textContent = crumb;
  $("#pageTitle").textContent = title;
  $("#workspaceSelect").value = state.role;
  renderSidebar();
  $("#app").innerHTML = (views[state.view] || renderLecturerTimetable)();
  if (window.lucide) window.lucide.createIcons();
}

function renderSidebar() {
  $("#sidebarNav").innerHTML = nav[state.role]
    .map((item) => `
      <button class="nav-btn ${state.view === item.id ? "active" : ""}" type="button" onclick="navigate('${item.id}')">
        ${icon(item.icon)}
        <span>${item.label}</span>
      </button>
    `)
    .join("");
}

function navigate(view) {
  state.view = view;
  render();
}

function setWorkspace(role) {
  state.role = role;
  state.view = role === "admin" ? "admin-accounts" : "lecturer-timetable";
  render();
}

function openSessionDetail(classId, sessionId) {
  state.selectedClassId = classId;
  state.selectedSessionId = sessionId;
  state.view = "lecturer-session-detail";
  render();
}

function renderLecturerTimetable() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const slots = [
    { name: "Slot 1", time: "08:00 - 10:15" },
    { name: "Slot 2", time: "10:30 - 12:45" },
    { name: "Slot 3", time: "12:50 - 14:20" },
    { name: "Slot 4", time: "14:30 - 16:45" },
    { name: "Slot 5", time: "17:00 - 19:15" },
    { name: "Slot 6", time: "19:30 - 21:45" },
  ];
  return `
    <section class="panel panel-pad">
      <div class="section-head">
        <div>
          <h2>Weekly timetable</h2>
          <p>Teaching schedule by weekday and slot.</p>
        </div>
      </div>
      <div class="timetable-matrix-wrap">
        <div class="timetable-matrix">
          <div class="matrix-corner">Slot</div>
          ${days.map((day) => `
            <div class="matrix-slot-head">
              <strong>${day}</strong>
            </div>
          `).join("")}

          ${slots.map((slot) => `
            <div class="matrix-day-head">
              <strong>${slot.name}</strong>
              <span>${slot.time}</span>
            </div>
            ${days.map((day) => {
              const session = data.sessions.find((item) => item.day === day && item.slot === slot.name);
              if (!session) return `<div class="matrix-cell empty"></div>`;
              const klass = data.classes.find((item) => item.id === session.classId);
              return `
                <button class="matrix-cell has-session" type="button" onclick="openSessionDetail('${session.classId}', '${session.id}')">
                  <strong>${klass.name}</strong>
                  <span>${session.room}</span>
                  ${badge(session.status)}
                </button>
              `;
            }).join("")}
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderLecturerClasses() {
  return `
    <section class="grid grid-3">
      ${data.classes.map((klass) => {
        const subject = data.subjects.find((item) => item.code === klass.subject);
        const nextSession = data.sessions.find((item) => item.classId === klass.id);
        return `
          <article class="class-card">
            <div>
              <h3>${klass.name}</h3>
              <p>${subject.name}</p>
            </div>
            <div class="grid grid-2">
              <div><span class="muted">Roster</span><br /><strong>${klass.roster}</strong></div>
              <div><span class="muted">Semester</span><br /><strong>${klass.semester}</strong></div>
            </div>
            <button class="btn btn-secondary" type="button" onclick="openSessionDetail('${klass.id}', '${nextSession.id}')">
              ${icon("arrow-right")}
              Open class
            </button>
          </article>
        `;
      }).join("")}
    </section>
  `;
}

function qrSvg(seed) {
  const cells = [];
  for (let y = 0; y < 9; y += 1) {
    for (let x = 0; x < 9; x += 1) {
      const finder =
        (x < 3 && y < 3) ||
        (x > 5 && y < 3) ||
        (x < 3 && y > 5);
      const filled = finder || ((x * 7 + y * 11 + seed * 5) % 4 === 0);
      if (filled) cells.push(`<rect x="${x * 10}" y="${y * 10}" width="8" height="8" rx="1" />`);
    }
  }
  return `<svg width="184" height="184" viewBox="0 0 90 90" aria-label="Dynamic QR code"><rect width="90" height="90" fill="white" /><g fill="#6f2d00">${cells.join("")}</g></svg>`;
}

function renderSessionActions(session) {
  if (isCheckInOpen(session)) {
    return `
      <button class="btn btn-secondary" type="button" onclick="closeCheckIn()">
        ${icon("stop-circle")}
        Close check-in
      </button>
    `;
  }
  if (isReopenable(session)) {
    return `
      <button class="btn btn-primary" type="button" onclick="reopenCheckIn()">
        ${icon("rotate-ccw")}
        Reopen
      </button>
    `;
  }
  if (isReopenedForManual(session)) {
    return `
      <button class="btn btn-secondary" type="button" onclick="lockReopenedAttendance()">
        ${icon("lock")}
        Lock attendance
      </button>
    `;
  }
  if (session.checkInState !== "closed") {
    return `
      <button class="btn btn-primary" type="button" onclick="createCheckIn()">
        ${icon("play-circle")}
        Start checkin
      </button>
    `;
  }
  return "";
}

function renderSessionDetail() {
  const klass = selectedClass();
  const session = selectedSession();
  const checkInOpen = isCheckInOpen(session);
  const manualEditEnabled = canEditAttendance(session);
  const counts = {
    "Not Yet": data.attendance.filter((item) => item.status === "Not Yet").length,
    Present: data.attendance.filter((item) => item.status === "Present").length,
    Late: data.attendance.filter((item) => item.status === "Late").length,
    Absent: data.attendance.filter((item) => item.status === "Absent").length,
  };
  return `
    <div class="grid split">
      <section class="panel panel-pad">
        <div class="section-head">
          <div>
            <h2>${klass.name}</h2>
            <p>${session.date} · ${session.start} - ${session.end} · ${session.room}</p>
          </div>
        </div>

        <div class="session-metrics">
          ${Object.entries(counts).map(([label, value]) => `
            <div class="metric ${metricClass(label)}"><span>${label}</span><strong>${value}</strong></div>
          `).join("")}
        </div>

        ${checkInOpen ? `
          <div id="qrBox" class="qr-box">${qrSvg(state.qrSeed)}</div>

          <div class="pin-card">
            <div>
              <span class="muted">Session PIN</span>
              <div class="pin-value">${state.pinVisible ? state.pin : "••••••"}</div>
            </div>
            <button class="btn btn-icon btn-secondary" type="button" onclick="togglePin()" aria-label="Show or hide PIN">
              ${icon(state.pinVisible ? "eye-off" : "eye")}
            </button>
          </div>
        ` : ""}

        <div class="session-actions">
          ${renderSessionActions(session)}
        </div>
      </section>

      <section class="panel panel-pad attendance-panel">
        <div class="section-head">
          <div>
            <h3>Attendance list</h3>
            <p>${manualEditEnabled ? "Reopened attendance only allows Absent records to be marked Late with a reason." : "Manual editing is locked until the lecturer reopens a closed session."}</p>
          </div>
        </div>
        ${renderAttendanceTable(manualEditEnabled)}
      </section>
    </div>
  `;
}

function renderAttendanceTable(manualEditEnabled) {
  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Student</th>
            <th>Check-in</th>
            <th>Method</th>
            <th>Status</th>
            <th>Reason</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${data.attendance.map((record) => `
            <tr>
              <td><strong>${record.studentId}</strong></td>
              <td>${record.name}</td>
              <td>${record.time}</td>
              <td>${record.method}</td>
              <td>${badge(record.status)}</td>
              <td class="muted">${escapeHtml(record.reason || "-")}</td>
              <td>
                <div class="row-actions">
                  <button class="btn btn-icon btn-secondary" type="button" onclick="openStudentDetail('${record.id}')" aria-label="View student detail">
                    ${icon("eye")}
                  </button>
                  ${manualEditEnabled && record.status === "Absent" ? `
                  <button class="btn btn-icon btn-secondary" type="button" onclick="openStatusModal('${record.id}')" aria-label="Mark absent student as late">
                    ${icon("pencil")}
                  </button>
                  ` : ""}
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function createCheckIn() {
  const session = selectedSession();
  session.checkInState = "open";
  session.status = "Open";
  session.closedAt = null;
  session.canReopen = false;
  state.pinVisible = false;
  initializeAttendanceRecords();
  refreshToken();
  toast("Attendance records created as Not Yet");
  render();
}

function closeCheckIn() {
  const session = selectedSession();
  finalizeUncheckedAttendance();
  session.checkInState = "closed";
  session.status = "Closed";
  session.closedAt = Date.now();
  session.canReopen = true;
  state.pinVisible = false;
  toast("Not Yet records marked Absent");
  render();
}

function reopenCheckIn() {
  const session = selectedSession();
  if (!isReopenable(session)) return;
  session.checkInState = "reopened";
  session.status = "Reopened";
  session.canReopen = false;
  state.pinVisible = false;
  toast("Manual editing reopened");
  render();
}

function lockReopenedAttendance() {
  const session = selectedSession();
  if (!isReopenedForManual(session)) return;
  session.checkInState = "closed";
  session.status = "Closed";
  session.closedAt = Date.now();
  session.canReopen = false;
  toast("Attendance locked");
  render();
}

function refreshToken() {
  state.pin = String(Math.floor(100000 + Math.random() * 900000));
  state.qrSeed += 1;
}

function togglePin() {
  state.pinVisible = !state.pinVisible;
  render();
}

setInterval(() => {
  if (!isCheckInOpen() || state.view !== "lecturer-session-detail") return;
  refreshToken();
  const box = $("#qrBox");
  if (box) {
    box.innerHTML = qrSvg(state.qrSeed);
    box.classList.remove("refreshing");
    void box.offsetWidth;
    box.classList.add("refreshing");
    const pinValue = document.querySelector(".pin-value");
    if (pinValue) pinValue.textContent = state.pinVisible ? state.pin : "••••••";
    if (window.lucide) window.lucide.createIcons();
  }
}, 5000);

setInterval(() => {
  if (!isCheckInOpen() || state.view !== "lecturer-session-detail") return;
  if (advanceAttendanceProgress()) render();
}, 1400);

function openStudentDetail(recordId) {
  const record = data.attendance.find((item) => item.id === recordId);
  const klass = selectedClass();
  const session = selectedSession();
  const subject = data.subjects.find((item) => item.code === klass.subject);
  const grades = studentGrades(record);
  const average = grades.reduce((total, item) => total + Number(item.score) * Number(item.weight.replace("%", "")) / 100, 0);
  $("#modalRoot").innerHTML = `
    <div class="modal modal-wide">
      <div class="section-head">
        <div>
          <h3>Student detail</h3>
          <p>${record.name} · ${record.studentId}</p>
        </div>
        <button class="btn btn-icon btn-secondary" type="button" onclick="closeModal()">${icon("x")}</button>
      </div>
      <div class="student-detail-grid">
        <section class="student-profile">
          <div class="student-photo">${initials(record.name)}</div>
          <div>
            <h4>${record.name}</h4>
            <p>${record.studentId}</p>
          </div>
          <dl class="detail-list">
            <div><dt>Class</dt><dd>${klass.name}</dd></div>
            <div><dt>Subject</dt><dd>${subject.name}</dd></div>
            <div><dt>Session</dt><dd>${session.date} · ${session.slot}</dd></div>
            <div><dt>Room</dt><dd>${session.room}</dd></div>
            <div><dt>Attendance</dt><dd>${badge(record.status)}</dd></div>
            <div><dt>Check-in</dt><dd>${record.time} · ${record.method}</dd></div>
          </dl>
        </section>
        <section class="grade-panel">
          <div class="grade-summary">
            <span>Course average</span>
            <strong>${average.toFixed(1)}</strong>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Grade item</th>
                  <th>Weight</th>
                  <th>Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${grades.map((grade) => `
                  <tr>
                    <td><strong>${grade.item}</strong></td>
                    <td>${grade.weight}</td>
                    <td>${grade.score}</td>
                    <td>${badge(grade.status)}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  `;
  $("#modalRoot").classList.add("open");
  if (window.lucide) window.lucide.createIcons();
}

function openStatusModal(recordId) {
  if (!canEditAttendance()) {
    toast("Reopen the closed session before marking late");
    return;
  }
  const record = data.attendance.find((item) => item.id === recordId);
  if (!record || record.status !== "Absent") {
    toast("Only Absent records can be marked Late after reopen");
    return;
  }
  state.modalRecordId = recordId;
  $("#modalRoot").innerHTML = `
    <div class="modal">
      <div class="section-head">
        <div>
          <h3>Change attendance status</h3>
          <p>${record.name} · ${record.studentId}</p>
        </div>
        <button class="btn btn-icon btn-secondary" type="button" onclick="closeModal()">${icon("x")}</button>
      </div>
      <form class="form-grid" onsubmit="saveStatus(event)">
        <label>
          New status
          <select name="status" disabled>
            <option selected>Late</option>
          </select>
          <input type="hidden" name="status" value="Late" />
        </label>
        <label>
          Reason
          <textarea name="reason" required placeholder="Enter reason for this change">${escapeHtml(record.reason)}</textarea>
        </label>
        <div style="display:flex; justify-content:flex-end; gap:10px;">
          <button class="btn btn-secondary" type="button" onclick="closeModal()">Cancel</button>
          <button class="btn btn-primary" type="submit">${icon("save")}Save</button>
        </div>
      </form>
    </div>
  `;
  $("#modalRoot").classList.add("open");
  if (window.lucide) window.lucide.createIcons();
}

function saveStatus(event) {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(event.target).entries());
  const record = data.attendance.find((item) => item.id === state.modalRecordId);
  if (!isReopenedForManual() || !record || record.status !== "Absent") {
    closeModal();
    toast("Late marking is no longer available");
    render();
    return;
  }
  if (!values.reason.trim()) {
    toast("Reason is required");
    return;
  }
  record.status = values.status;
  record.reason = values.reason.trim();
  record.method = "Manual";
  record.time = record.time === "-" ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : record.time;
  closeModal();
  toast("Attendance status updated");
  render();
}

function closeModal() {
  $("#modalRoot").classList.remove("open");
  $("#modalRoot").innerHTML = "";
}

const adminSchemas = {
  accounts: {
    title: "Account Management",
    rows: () => data.accounts,
    columns: ["ID", "Code", "Name", "Email", "Role", "Status"],
    fields: ["id", "code", "name", "email", "role", "status"],
    defaults: { id: "ACC-006", code: "", name: "", email: "", role: "Student", status: "Active", profile: "" },
    values: (item) => [item.id, item.code, item.name, item.email, item.role, badge(item.status)],
  },
  subjects: {
    title: "Subject Management",
    rows: () => data.subjects,
    columns: ["Code", "Subject", "Credits", "Status"],
    fields: ["code", "name", "credits", "status"],
    defaults: { code: "", name: "", credits: 3, status: "Open" },
    values: (item) => [item.code, item.name, item.credits, badge(item.status)],
  },
  classes: {
    title: "Class Section Management",
    rows: () => data.classes,
    columns: ["Class section", "Subject", "Lecturer", "Semester", "Roster"],
    fields: ["id", "name", "subject", "lecturer", "semester", "roster"],
    defaults: { id: "", name: "", subject: "SWD392", lecturer: "HueCTM", semester: "SU26", roster: 40 },
    values: (item) => [item.name, item.subject, item.lecturer, item.semester, item.roster],
  },
  rooms: {
    title: "Room Management",
    rows: () => data.rooms,
    columns: ["Room", "Name", "Building", "Radius", "Status"],
    fields: ["id", "name", "building", "radius", "status"],
    defaults: { id: "", name: "", building: "", radius: "20m", status: "Configured" },
    values: (item) => [item.id, item.name, item.building, item.radius, badge(item.status)],
  },
  config: {
    title: "Attendance Configuration",
    rows: () => data.config,
    columns: ["Setting", "Value"],
    fields: ["setting", "value"],
    defaults: { setting: "", value: "" },
    values: (item) => item,
  },
};

function renderAdminTable(kind) {
  const config = adminSchemas[kind];
  const rows = config.rows();
  return `
    <section class="panel panel-pad">
      <div class="section-head">
        <div>
          <h2>${config.title}</h2>
          <p>Operational records used by the attendance workflow.</p>
        </div>
        <button class="btn btn-primary" type="button" onclick="openAdminModal('${kind}', -1)">${icon("plus")}Add new</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr>${config.columns.map((item) => `<th>${item}</th>`).join("")}<th></th></tr></thead>
          <tbody>
            ${rows.map((row, index) => `
              <tr>
                ${config.values(row).map((value) => `<td>${value}</td>`).join("")}
                <td><button class="btn btn-icon btn-secondary" type="button" onclick="openAdminModal('${kind}', ${index})">${icon("pencil")}</button></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function adminRecordAsObject(kind, index) {
  const config = adminSchemas[kind];
  const row = config.rows()[index];
  if (!row) return { ...config.defaults };
  if (Array.isArray(row)) {
    return { setting: row[0], value: row[1] };
  }
  return { ...row };
}

function openAdminModal(kind, index) {
  const config = adminSchemas[kind];
  const record = adminRecordAsObject(kind, index);
  $("#modalRoot").innerHTML = `
    <div class="modal">
      <div class="section-head">
        <div>
          <h3>${index < 0 ? "Add" : "Edit"} ${config.title}</h3>
          <p>${index < 0 ? "Create a new record." : "Update selected record."}</p>
        </div>
        <button class="btn btn-icon btn-secondary" type="button" onclick="closeModal()">${icon("x")}</button>
      </div>
      <form class="form-grid" onsubmit="saveAdminRecord(event, '${kind}', ${index})">
        ${config.fields.map((field) => adminField(field, record[field])).join("")}
        <div style="display:flex; justify-content:flex-end; gap:10px;">
          <button class="btn btn-secondary" type="button" onclick="closeModal()">Cancel</button>
          <button class="btn btn-primary" type="submit">${icon("save")}Save</button>
        </div>
      </form>
    </div>
  `;
  $("#modalRoot").classList.add("open");
  if (window.lucide) window.lucide.createIcons();
}

function adminField(name, value) {
  const label = name.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
  if (name === "role") {
    return `<label>${label}<select name="${name}">${["Student", "Lecturer", "Admin"].map((item) => `<option ${item === value ? "selected" : ""}>${item}</option>`).join("")}</select></label>`;
  }
  if (name === "status") {
    return `<label>${label}<select name="${name}">${["Active", "Open", "Configured", "Review"].map((item) => `<option ${item === value ? "selected" : ""}>${item}</option>`).join("")}</select></label>`;
  }
  return `<label>${label}<input name="${name}" value="${escapeHtml(value)}" required /></label>`;
}

function saveAdminRecord(event, kind, index) {
  event.preventDefault();
  const config = adminSchemas[kind];
  const rows = config.rows();
  const values = Object.fromEntries(new FormData(event.target).entries());
  const record = kind === "config" ? [values.setting, values.value] : values;
  if (index < 0) rows.unshift(record);
  else rows[index] = record;
  closeModal();
  toast("Record saved");
  render();
}

const views = {
  "lecturer-timetable": renderLecturerTimetable,
  "lecturer-classes": renderLecturerClasses,
  "lecturer-session-detail": renderSessionDetail,
  "admin-accounts": () => renderAdminTable("accounts"),
  "admin-subjects": () => renderAdminTable("subjects"),
  "admin-classes": () => renderAdminTable("classes"),
  "admin-rooms": () => renderAdminTable("rooms"),
  "admin-config": () => renderAdminTable("config"),
};

$("#feidLoginBtn").addEventListener("click", () => {
  $("#loginPage").classList.add("hidden");
  $("#portalPage").classList.remove("hidden");
  render();
});

$("#workspaceSelect").addEventListener("change", (event) => setWorkspace(event.target.value));

Object.assign(window, {
  navigate,
  openSessionDetail,
  createCheckIn,
  closeCheckIn,
  reopenCheckIn,
  lockReopenedAttendance,
  togglePin,
  openStudentDetail,
  openStatusModal,
  saveStatus,
  openAdminModal,
  saveAdminRecord,
  closeModal,
});

if (window.lucide) window.lucide.createIcons();
