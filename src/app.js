const state = {
  role: "student",
  view: "student-app",
  studentTab: "login",
  selectedClassId: "SWD392_SU26_SE1701",
  selectedSessionId: "SS-20260716-01",
  checkInActive: false,
  search: {},
  accountFilters: {
    role: "All",
    status: "All",
    keyword: "",
  },
};

const data = {
  accounts: [
    { accountId: "ACC-001", identityCode: "SE170123", fullName: "Nguyen Minh An", email: "an.se170123@fpt.edu.vn", role: "Student", status: "Active", linkedProfile: "SE170123", classSection: "SWD392_SU26_SE1701", department: "", permissionLevel: "", registrationDate: "2026-05-26" },
    { accountId: "ACC-002", identityCode: "SE170145", fullName: "Tran Bao Chau", email: "chau.se170145@fpt.edu.vn", role: "Student", status: "Active", linkedProfile: "SE170145", classSection: "SWD392_SU26_SE1701", department: "", permissionLevel: "", registrationDate: "2026-05-26" },
    { accountId: "ACC-003", identityCode: "SE170188", fullName: "Le Quang Huy", email: "huy.se170188@fpt.edu.vn", role: "Student", status: "Active", linkedProfile: "SE170188", classSection: "SWD392_SU26_SE1701", department: "", permissionLevel: "", registrationDate: "2026-05-26" },
    { accountId: "ACC-004", identityCode: "SE170219", fullName: "Pham Hoai Linh", email: "linh.se170219@fpt.edu.vn", role: "Student", status: "Inactive", linkedProfile: "SE170219", classSection: "SWD392_SU26_SE1701", department: "", permissionLevel: "", registrationDate: "2026-05-27" },
    { accountId: "ACC-005", identityCode: "HueCTM", fullName: "Hoang Thi Hue", email: "huectm@fpt.edu.vn", role: "Lecturer", status: "Active", linkedProfile: "HueCTM", classSection: "SWD392_SU26_SE1701", department: "Software Engineering", permissionLevel: "", registrationDate: "2026-05-26" },
    { accountId: "ACC-006", identityCode: "LinhPT", fullName: "Pham Thu Linh", email: "linhpt@fpt.edu.vn", role: "Lecturer", status: "Active", linkedProfile: "LinhPT", classSection: "SWT301_SU26_SE1701", department: "Computer Science", permissionLevel: "", registrationDate: "2026-05-26" },
    { accountId: "ACC-007", identityCode: "Admin01", fullName: "AFAS Administrator", email: "admin01@fpt.edu.vn", role: "Admin", status: "Active", linkedProfile: "ADM-001", classSection: "", department: "Academic Office", permissionLevel: "Full Access", registrationDate: "2026-05-26" },
  ],
  subjects: [
    { subjectCode: "SWD392", subjectName: "Software Architecture and Design", credits: "3", status: "Open" },
    { subjectCode: "PRN212", subjectName: "Basic Cross-Platform Application Programming", credits: "3", status: "Open" },
    { subjectCode: "SWT301", subjectName: "Software Testing", credits: "3", status: "Open" },
  ],
  classSections: [
    { classSectionId: "SWD392_SU26_SE1701", classSectionName: "SWD392 - SE1701", subjectCode: "SWD392", lecturerId: "HueCTM", semester: "SU26", roster: "42" },
    { classSectionId: "SWD392_SU26_SE1702", classSectionName: "SWD392 - SE1702", subjectCode: "SWD392", lecturerId: "HueCTM", semester: "SU26", roster: "39" },
    { classSectionId: "SWT301_SU26_SE1701", classSectionName: "SWT301 - SE1701", subjectCode: "SWT301", lecturerId: "LinhPT", semester: "SU26", roster: "45" },
  ],
  rooms: [
    { roomId: "AL-L402", roomName: "Alpha L402", latitude: "21.013821", longitude: "105.525132", allowedRadius: "20", status: "Configured" },
    { roomId: "BE-305", roomName: "Beta 305", latitude: "21.014040", longitude: "105.525601", allowedRadius: "18", status: "Configured" },
    { roomId: "DE-101", roomName: "Delta 101", latitude: "21.013532", longitude: "105.524944", allowedRadius: "20", status: "Needs Review" },
  ],
  sessions: [
    { sessionId: "SS-20260716-01", classSectionId: "SWD392_SU26_SE1701", roomId: "AL-L402", sessionDate: "2026-07-16", startTime: "08:00", endTime: "10:15", status: "Active", finalized: false },
    { sessionId: "SS-20260718-01", classSectionId: "SWD392_SU26_SE1701", roomId: "AL-L402", sessionDate: "2026-07-18", startTime: "08:00", endTime: "10:15", status: "Scheduled", finalized: false },
    { sessionId: "SS-20260715-01", classSectionId: "SWD392_SU26_SE1701", roomId: "AL-L402", sessionDate: "2026-07-15", startTime: "08:00", endTime: "10:15", status: "Finalized", finalized: true },
    { sessionId: "SS-20260716-02", classSectionId: "SWD392_SU26_SE1702", roomId: "BE-305", sessionDate: "2026-07-16", startTime: "10:30", endTime: "12:45", status: "Closed", finalized: false },
    { sessionId: "SS-20260717-01", classSectionId: "SWT301_SU26_SE1701", roomId: "DE-101", sessionDate: "2026-07-17", startTime: "13:00", endTime: "15:15", status: "Scheduled", finalized: false },
  ],
  attendanceRecords: [
    { attendanceRecordId: "AR-001", studentId: "SE170123", sessionId: "SS-20260716-01", attendanceStatus: "Present", method: "QR", submittedAt: "08:04", distance: "9m", resultSource: "QR check-in" },
    { attendanceRecordId: "AR-002", studentId: "SE170145", sessionId: "SS-20260716-01", attendanceStatus: "Late", method: "PIN", submittedAt: "08:19", distance: "13m", resultSource: "PIN fallback" },
    { attendanceRecordId: "AR-003", studentId: "SE170188", sessionId: "SS-20260716-01", attendanceStatus: "Absent", method: "-", submittedAt: "-", distance: "-", resultSource: "Pending absent assignment" },
    { attendanceRecordId: "AR-004", studentId: "SE170219", sessionId: "SS-20260716-01", attendanceStatus: "Rejected", method: "QR", submittedAt: "08:07", distance: "63m", resultSource: "Outside allowed range" },
  ],
  config: {
    qrRefresh: "10",
    qrValidity: "15",
    pinRefresh: "30",
    lateThreshold: "15",
    defaultRadius: "20",
  },
};

const nav = {
  student: [
    { title: "Student", items: [
      { id: "student-app", label: "Mobile App", icon: "smartphone" },
    ] },
  ],
  lecturer: [
    { title: "Lecturer Web", items: [
      { id: "web-login", label: "Login", icon: "log-in" },
      { id: "lecturer-classes", label: "My Classes", icon: "book-open-check" },
      { id: "lecturer-sessions", label: "Session List + Report", icon: "calendar-range" },
      { id: "lecturer-session-detail", label: "Session Detail", icon: "clipboard-list" },
    ] },
  ],
  admin: [
    { title: "Admin Web", items: [
      { id: "web-login", label: "Login", icon: "log-in" },
      { id: "admin-accounts", label: "Account Management", icon: "users" },
      { id: "admin-subjects", label: "Subject Management", icon: "library" },
      { id: "admin-classes", label: "Class Section Management", icon: "panel-top" },
      { id: "admin-rooms", label: "Room Management", icon: "map-pin" },
      { id: "admin-config", label: "Attendance Configuration Management", icon: "sliders-horizontal" },
    ] },
  ],
};

const viewMeta = {
  "student-app": ["Student", "Mobile App"],
  "web-login": ["Shared", "Web Login"],
  "lecturer-classes": ["Lecturer", "My Classes"],
  "lecturer-sessions": ["Lecturer", "Session List + Report"],
  "lecturer-session-detail": ["Lecturer", "Session Detail"],
  "admin-accounts": ["Admin", "Account Management"],
  "admin-subjects": ["Admin", "Subject Management"],
  "admin-classes": ["Admin", "Class Section Management"],
  "admin-rooms": ["Admin", "Room Management"],
  "admin-config": ["Admin", "Attendance Configuration Management"],
};

const crudConfigs = {
  subjects: {
    title: "Subject Management",
    dataKey: "subjects",
    idField: "subjectCode",
    columns: [["subjectCode", "Subject Code"], ["subjectName", "Subject Name"], ["credits", "Credits"], ["status", "Status"]],
    fields: [
      { name: "subjectCode", label: "Subject Code", type: "text" },
      { name: "subjectName", label: "Subject Name", type: "text" },
      { name: "credits", label: "Credits", type: "number" },
      { name: "status", label: "Status", type: "select", options: ["Open", "Closed"] },
    ],
  },
  classes: {
    title: "Class Section Management",
    dataKey: "classSections",
    idField: "classSectionId",
    columns: [["classSectionId", "Class Section ID"], ["classSectionName", "Name"], ["subjectCode", "Subject"], ["lecturerId", "Lecturer"], ["semester", "Semester"], ["roster", "Roster"]],
    fields: [
      { name: "classSectionId", label: "Class Section ID", type: "text" },
      { name: "classSectionName", label: "Name", type: "text" },
      { name: "subjectCode", label: "Subject", type: "select", options: () => data.subjects.map((item) => item.subjectCode) },
      { name: "lecturerId", label: "Lecturer", type: "select", options: () => data.accounts.filter((item) => item.role === "Lecturer").map((item) => item.linkedProfile) },
      { name: "semester", label: "Semester", type: "text" },
      { name: "roster", label: "Roster Size", type: "number" },
    ],
  },
  rooms: {
    title: "Room Management",
    dataKey: "rooms",
    idField: "roomId",
    columns: [["roomId", "Room ID"], ["roomName", "Room Name"], ["latitude", "Latitude"], ["longitude", "Longitude"], ["allowedRadius", "Radius"], ["status", "Status"]],
    fields: [
      { name: "roomId", label: "Room ID", type: "text" },
      { name: "roomName", label: "Room Name", type: "text" },
      { name: "latitude", label: "Latitude", type: "number", step: "0.000001" },
      { name: "longitude", label: "Longitude", type: "number", step: "0.000001" },
      { name: "allowedRadius", label: "Allowed Radius (m)", type: "number" },
      { name: "status", label: "Status", type: "select", options: ["Configured", "Needs Review"] },
    ],
  },
};

function $(selector) {
  return document.querySelector(selector);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function icon(name, className = "h-4 w-4") {
  return `<i data-lucide="${name}" class="${className}"></i>`;
}

function button(label, action, iconName = "arrow-right", variant = "primary") {
  const classes = variant === "primary"
    ? "bg-brand-600 text-white hover:bg-brand-700"
    : "border border-orange-200 bg-white text-slate-800 hover:border-brand-500 hover:text-brand-700";
  return `<button type="button" onclick="${action}" class="inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition ${classes}">${icon(iconName)}${label}</button>`;
}

function card(content, className = "") {
  return `<section class="rounded-xl border border-orange-100 bg-white p-4 shadow-sm ${className}">${content}</section>`;
}

function pageHeader(eyebrow, title, description, actions = "") {
  return `
    <div class="mb-5 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-brand-600">${eyebrow}</p>
        <h2 class="mt-1 text-2xl font-semibold tracking-tight text-slate-950">${title}</h2>
        <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-600">${description}</p>
      </div>
      ${actions ? `<div class="flex flex-wrap gap-2">${actions}</div>` : ""}
    </div>
  `;
}

function badge(value) {
  const map = {
    Active: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    Inactive: "bg-slate-100 text-slate-600 ring-slate-200",
    Open: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    Closed: "bg-slate-100 text-slate-700 ring-slate-200",
    Configured: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    "Needs Review": "bg-amber-50 text-amber-700 ring-amber-100",
    Present: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    Late: "bg-brand-50 text-brand-700 ring-orange-100",
    Absent: "bg-red-50 text-red-700 ring-red-100",
    Rejected: "bg-red-50 text-red-700 ring-red-100",
    Student: "bg-sky-50 text-sky-700 ring-sky-100",
    Lecturer: "bg-brand-50 text-brand-700 ring-orange-100",
    Admin: "bg-purple-50 text-purple-700 ring-purple-100",
    Scheduled: "bg-sky-50 text-sky-700 ring-sky-100",
    Finalized: "bg-slate-100 text-slate-700 ring-slate-200",
  };
  return `<span class="inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${map[value] || "bg-slate-100 text-slate-700 ring-slate-200"}">${escapeHtml(value)}</span>`;
}

function stat(label, value, iconName, tone = "brand") {
  const tones = {
    brand: "bg-brand-50 text-brand-700 border-orange-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    red: "bg-red-50 text-red-700 border-red-100",
    slate: "bg-slate-50 text-slate-700 border-slate-100",
  };
  return `
    <div class="rounded-xl border ${tones[tone]} p-4">
      <div class="flex items-center justify-between gap-3">
        <span class="text-sm font-medium">${label}</span>
        ${icon(iconName, "h-5 w-5")}
      </div>
      <strong class="mt-3 block text-2xl font-semibold">${value}</strong>
    </div>
  `;
}

function renderTable(headers, rows) {
  return `
    <div class="overflow-hidden rounded-xl border border-orange-100">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-orange-100 text-sm">
          <thead class="bg-brand-50/80">
            <tr>${headers.map((header) => `<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">${header}</th>`).join("")}</tr>
          </thead>
          <tbody class="divide-y divide-orange-100 bg-white">${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2200);
}

function closeModal() {
  $("#modalRoot").innerHTML = "";
}

function openMobileMenu() {
  $("#mobileBackdrop").classList.remove("hidden");
  $("#mobileSidebar").classList.remove("hidden");
  if (window.lucide) window.lucide.createIcons();
}

function closeMobileMenu() {
  $("#mobileBackdrop").classList.add("hidden");
  $("#mobileSidebar").classList.add("hidden");
}

function renderSidebar(targetId) {
  const roleLabel = state.role.charAt(0).toUpperCase() + state.role.slice(1);
  const html = `
    <div class="mb-6 flex items-center gap-3">
      <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">${icon("shield-check", "h-6 w-6")}</div>
      <div>
        <p class="text-base font-bold text-slate-950">AFAS</p>
        <p class="text-xs font-medium text-slate-500">Anti-Fraud Attendance</p>
      </div>
    </div>
    <div class="mb-4 rounded-xl border border-orange-100 bg-brand-50 p-3">
      <p class="text-xs font-semibold uppercase tracking-wide text-brand-700">Prototype Role</p>
      <p class="mt-1 text-sm font-semibold text-slate-950">${roleLabel}</p>
    </div>
    <nav class="space-y-5">
      ${nav[state.role].map((group) => `
        <div>
          <p class="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">${group.title}</p>
          <div class="space-y-1">
            ${group.items.map((item) => `
              <button type="button" onclick="navigate('${item.id}')" class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition ${state.view === item.id ? "bg-brand-600 text-white shadow-sm" : "text-slate-700 hover:bg-brand-50 hover:text-brand-700"}">
                ${icon(item.icon)}
                <span>${item.label}</span>
              </button>
            `).join("")}
          </div>
        </div>
      `).join("")}
    </nav>
  `;
  $(targetId).innerHTML = html;
}

function render() {
  const [crumb, title] = viewMeta[state.view] || ["AFAS", "Prototype"];
  $("#breadcrumb").textContent = crumb;
  $("#pageTitle").textContent = title;
  $("#roleSelect").value = state.role;
  renderSidebar("#sidebar");
  renderSidebar("#mobileSidebar");
  $("#app").innerHTML = (views[state.view] || renderStudentApp)();
  if (window.lucide) window.lucide.createIcons();
}

function navigate(view) {
  state.view = view;
  closeMobileMenu();
  render();
}

function setRole(role) {
  state.role = role;
  state.view = role === "student" ? "student-app" : "web-login";
  closeModal();
  render();
}

function enterWebPortal(role) {
  state.role = role;
  state.view = role === "admin" ? "admin-accounts" : "lecturer-classes";
  render();
}

function setStudentTab(tab) {
  state.studentTab = tab;
  render();
}

function selectedClass() {
  return data.classSections.find((item) => item.classSectionId === state.selectedClassId) || data.classSections[0];
}

function selectedSession() {
  return data.sessions.find((item) => item.sessionId === state.selectedSessionId) || data.sessions[0];
}

function sessionRecords(sessionId = state.selectedSessionId) {
  return data.attendanceRecords.filter((item) => item.sessionId === sessionId);
}

function studentAccounts() {
  return data.accounts.filter((item) => item.role === "Student");
}

function phoneTabButton(tab, label, iconName) {
  return `
    <button type="button" onclick="setStudentTab('${tab}')" class="flex flex-col items-center gap-1 rounded-lg py-2 text-[11px] font-semibold ${state.studentTab === tab ? "bg-brand-50 text-brand-700" : "text-slate-400"}">
      ${icon(iconName, "h-4 w-4")}
      <span>${label}</span>
    </button>
  `;
}

function phoneShell(content) {
  return `
    <div class="mx-auto w-full max-w-[390px] rounded-[2.25rem] border-[10px] border-slate-950 bg-slate-950 shadow-soft">
      <div class="overflow-hidden rounded-[1.55rem] bg-white">
        <div class="flex items-center justify-between bg-white px-5 pb-3 pt-4">
          <span class="text-xs font-bold text-slate-950">9:41</span>
          <div class="flex items-center gap-1 text-slate-950">
            ${icon("signal", "h-3.5 w-3.5")}
            ${icon("wifi", "h-3.5 w-3.5")}
            ${icon("battery-full", "h-4 w-4")}
          </div>
        </div>
        <div class="min-h-[650px] bg-gradient-to-b from-brand-50 to-white px-4 pb-4">${content}</div>
        <div class="grid grid-cols-5 border-t border-orange-100 bg-white px-2 py-2">
          ${phoneTabButton("login", "Login", "log-in")}
          ${phoneTabButton("classes", "Classes", "book-open")}
          ${phoneTabButton("checkin", "Check-in", "qr-code")}
          ${phoneTabButton("sessions", "Sessions", "calendar-days")}
          ${phoneTabButton("timetable", "Timetable", "clock")}
        </div>
      </div>
    </div>
  `;
}

function renderStudentPhoneContent() {
  const classItem = selectedClass();
  if (state.studentTab === "login") {
    return `
      <div class="pt-3">
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white">${icon("shield-check", "h-7 w-7")}</div>
        <h3 class="mt-5 text-2xl font-bold text-slate-950">Student Login</h3>
        <p class="mt-2 text-sm leading-6 text-slate-600">Confirm your university identity before accessing attendance actions.</p>
        <div class="mt-5 space-y-3">
          <label class="block text-sm font-medium text-slate-700">Identity Code
            <input value="SE170123" class="mt-1 h-11 w-full rounded-xl border border-orange-100 px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-orange-100" />
          </label>
          <label class="block text-sm font-medium text-slate-700">Role
            <div class="mt-1 flex h-11 items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-3 text-sm font-semibold text-emerald-700">
              <span>Student profile found</span>
              ${icon("check-circle-2")}
            </div>
          </label>
        </div>
        <button type="button" onclick="setStudentTab('classes')" class="mt-5 h-12 w-full rounded-2xl bg-brand-600 text-sm font-bold text-white">Enter Student App</button>
      </div>
    `;
  }
  if (state.studentTab === "classes") {
    return `
      <div class="pt-2">
        <p class="text-xs font-semibold uppercase tracking-wide text-brand-700">My Classes</p>
        <h3 class="text-xl font-bold text-slate-950">Today</h3>
        <div class="mt-4 space-y-3">
          ${data.classSections.slice(0, 2).map((item, index) => `
            <button type="button" onclick="state.selectedClassId='${item.classSectionId}'; setStudentTab('sessions')" class="w-full rounded-2xl border ${index === 0 ? "border-brand-500 bg-brand-50" : "border-orange-100 bg-white"} p-4 text-left">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="font-bold text-slate-950">${item.classSectionName}</p>
                  <p class="mt-1 text-xs text-slate-500">${item.subjectCode} · ${item.semester}</p>
                </div>
                ${badge(index === 0 ? "Active" : "Scheduled")}
              </div>
              <div class="mt-3 grid grid-cols-2 gap-2 text-xs">
                <span class="rounded-lg bg-white px-2 py-2 text-slate-600">Room ${index === 0 ? "AL-L402" : "BE-305"}</span>
                <span class="rounded-lg bg-white px-2 py-2 text-slate-600">${index === 0 ? "08:00 - 10:15" : "10:30 - 12:45"}</span>
              </div>
            </button>
          `).join("")}
        </div>
      </div>
    `;
  }
  if (state.studentTab === "checkin") {
    return `
      <div class="pt-2">
        <p class="text-xs font-semibold uppercase tracking-wide text-brand-700">Check-in</p>
        <h3 class="text-xl font-bold text-slate-950">${classItem.subjectCode}</h3>
        <div class="mt-4 rounded-2xl border border-orange-100 bg-white p-3">
          <div class="aspect-square rounded-2xl border-2 border-dashed border-brand-500 bg-brand-50 p-4">
            <div class="qr-grid flex h-full items-center justify-center rounded-xl bg-white">
              <div class="text-center">
                ${icon("scan-line", "mx-auto h-10 w-10 text-brand-600")}
                <p class="mt-2 text-sm font-bold text-slate-950">Scan QR Code</p>
                <p class="text-xs text-slate-500">Camera check-in path</p>
              </div>
            </div>
          </div>
          <div class="mt-3 rounded-xl bg-brand-600 p-3 text-white">
            <p class="text-xs font-semibold text-orange-100">PIN fallback</p>
            <p class="mt-1 text-3xl font-black tracking-[0.18em]">418027</p>
          </div>
        </div>
        <div class="mt-4 space-y-2">
          ${["Biometric verified", "Location within 20m", "Device evidence recorded"].map((text) => `
            <div class="flex items-center gap-2 rounded-xl border border-orange-100 bg-white px-3 py-2 text-sm font-semibold text-slate-700">${icon("check-circle-2", "h-4 w-4 text-emerald-600")}${text}</div>
          `).join("")}
        </div>
        <button type="button" onclick="showToast('Check-in submitted')" class="mt-4 h-12 w-full rounded-2xl bg-brand-600 text-sm font-bold text-white">Submit Check-in</button>
      </div>
    `;
  }
  if (state.studentTab === "sessions") {
    return `
      <div class="pt-2">
        <p class="text-xs font-semibold uppercase tracking-wide text-brand-700">Session List</p>
        <h3 class="text-xl font-bold text-slate-950">${classItem.classSectionName}</h3>
        <div class="mt-4 space-y-3">
          ${data.sessions.filter((item) => item.classSectionId === classItem.classSectionId).map((item) => `
            <div class="rounded-2xl border border-orange-100 bg-white p-4">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="font-bold text-slate-950">${item.sessionDate}</p>
                  <p class="mt-1 text-xs text-slate-500">${item.startTime} - ${item.endTime} · ${item.roomId}</p>
                </div>
                ${badge(item.status)}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }
  return `
    <div class="pt-2">
      <p class="text-xs font-semibold uppercase tracking-wide text-brand-700">Timetable</p>
      <h3 class="text-xl font-bold text-slate-950">This Week</h3>
      <div class="mt-4 space-y-3">
        ${[
          ["Mon", "SWD392", "08:00 - 10:15", "AL-L402"],
          ["Wed", "SWD392", "08:00 - 10:15", "AL-L402"],
          ["Fri", "SWT301", "13:00 - 15:15", "DE-101"],
        ].map(([day, subject, time, room]) => `
          <div class="flex gap-3 rounded-2xl border border-orange-100 bg-white p-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-sm font-black text-brand-700">${day}</div>
            <div>
              <p class="font-bold text-slate-950">${subject}</p>
              <p class="mt-1 text-xs text-slate-500">${time} · ${room}</p>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderStudentApp() {
  return `
    ${pageHeader("Student Mobile", "Single-screen student app", "All student flows stay inside one phone frame: login, my classes, check-in, session list, and timetable.")}
    ${phoneShell(renderStudentPhoneContent())}
  `;
}

function renderWebLogin() {
  const isAdmin = state.role === "admin";
  return `
    ${pageHeader("Shared Web Login", "Lecturer and Admin access", "The same web login layout is used for both lecturer and administrator portals.")}
    <div class="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      ${card(`
        <div class="mx-auto max-w-md">
          <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white">${icon("shield-check", "h-7 w-7")}</div>
          <h3 class="mt-4 text-xl font-semibold text-slate-950">University Identity Sign-in</h3>
          <p class="mt-2 text-sm leading-6 text-slate-600">Confirm identity, resolve AFAS role profile, then route to the selected web portal.</p>
          <div class="mt-5 space-y-3">
            <label class="block text-sm font-medium text-slate-700">Identity Code
              <input value="${isAdmin ? "Admin01" : "HueCTM"}" class="mt-1 h-11 w-full rounded-lg border border-orange-100 px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-orange-100" />
            </label>
            <div class="flex h-11 items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50 px-3 text-sm font-semibold text-emerald-700">
              <span>${isAdmin ? "Admin" : "Lecturer"} profile found</span>
              ${icon("check-circle-2")}
            </div>
          </div>
          <div class="mt-5 flex gap-2">
            ${button("Enter Lecturer Portal", "enterWebPortal('lecturer')", "presentation", state.role === "lecturer" ? "primary" : "secondary")}
            ${button("Enter Admin Portal", "enterWebPortal('admin')", "settings", state.role === "admin" ? "primary" : "secondary")}
          </div>
        </div>
      `)}
      ${card(`
        <h3 class="text-base font-semibold text-slate-950">Access outcomes</h3>
        <div class="mt-4 grid gap-3">
          ${[
            ["Identity confirmed", "The University Identity System confirms the user.", "check-circle-2"],
            ["Role profile matched", "AFAS routes the user to Lecturer or Admin pages.", "user-check"],
            ["Access denied states", "Unconfirmed identity or missing AFAS role blocks portal access.", "shield-alert"],
          ].map(([title, desc, iconName]) => `
            <div class="flex gap-3 rounded-xl border border-orange-100 p-3">
              <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">${icon(iconName)}</span>
              <div>
                <p class="font-semibold text-slate-950">${title}</p>
                <p class="mt-1 text-sm text-slate-500">${desc}</p>
              </div>
            </div>
          `).join("")}
        </div>
      `)}
    </div>
  `;
}

function openClassSessions(classId) {
  state.selectedClassId = classId;
  const firstSession = data.sessions.find((item) => item.classSectionId === classId);
  if (firstSession) state.selectedSessionId = firstSession.sessionId;
  navigate("lecturer-sessions");
}

function openSessionDetail(sessionId) {
  state.selectedSessionId = sessionId;
  const session = selectedSession();
  state.selectedClassId = session.classSectionId;
  navigate("lecturer-session-detail");
}

function renderLecturerClasses() {
  return `
    ${pageHeader("Lecturer", "My Classes", "Select an assigned class section, then move into its session list and report view.")}
    <div class="grid gap-4 xl:grid-cols-3">
      ${data.classSections.map((item) => card(`
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="text-base font-semibold text-slate-950">${item.classSectionName}</h3>
            <p class="mt-1 text-sm text-slate-500">${item.classSectionId}</p>
          </div>
          ${badge(item.semester)}
        </div>
        <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div class="rounded-lg bg-brand-50 p-3"><span class="text-slate-500">Subject</span><strong class="block">${item.subjectCode}</strong></div>
          <div class="rounded-lg bg-brand-50 p-3"><span class="text-slate-500">Roster</span><strong class="block">${item.roster}</strong></div>
        </div>
        <div class="mt-4">${button("View Sessions", `openClassSessions('${item.classSectionId}')`, "calendar-range")}</div>
      `)).join("")}
    </div>
  `;
}

function renderLecturerSessions() {
  const classItem = selectedClass();
  const sessions = data.sessions.filter((item) => item.classSectionId === classItem.classSectionId);
  const rows = sessions.map((item) => `
    <tr class="hover:bg-orange-50/50">
      <td class="px-4 py-3 font-medium text-slate-900">${item.sessionId}</td>
      <td class="px-4 py-3 text-slate-700">${item.sessionDate}</td>
      <td class="px-4 py-3 text-slate-700">${item.startTime} - ${item.endTime}</td>
      <td class="px-4 py-3 text-slate-700">${item.roomId}</td>
      <td class="px-4 py-3">${badge(item.status)}</td>
      <td class="px-4 py-3">${button("View Detail", `openSessionDetail('${item.sessionId}')`, "eye", "secondary")}</td>
    </tr>
  `).join("");
  return `
    ${pageHeader("Lecturer", "Session List + Report", `${classItem.classSectionName} session timeline, timetable summary, and report readiness.`, button("Back to My Classes", "navigate('lecturer-classes')", "arrow-left", "secondary"))}
    <div class="mb-5 grid gap-4 lg:grid-cols-4">
      ${stat("Total Sessions", sessions.length, "calendar-range", "slate")}
      ${stat("Active", sessions.filter((item) => item.status === "Active").length, "radio-tower", "brand")}
      ${stat("Finalized", sessions.filter((item) => item.status === "Finalized").length, "lock-keyhole", "green")}
      ${stat("Report Ready", sessions.filter((item) => item.finalized).length, "file-spreadsheet", "green")}
    </div>
    <div class="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
      ${card(renderTable(["Session", "Date", "Time", "Room", "Status", "Action"], rows))}
      ${card(`
        <h3 class="text-base font-semibold text-slate-950">Timetable</h3>
        <div class="mt-4 space-y-3">
          ${sessions.map((item) => `
            <div class="rounded-xl border border-orange-100 p-3">
              <p class="font-semibold text-slate-950">${item.sessionDate}</p>
              <p class="mt-1 text-sm text-slate-500">${item.startTime} - ${item.endTime} · ${item.roomId}</p>
            </div>
          `).join("")}
        </div>
        <button type="button" onclick="showToast('Report export prepared for finalized sessions')" class="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white">${icon("download")}Export Report</button>
      `)}
    </div>
  `;
}

function setRecordStatus(index, status) {
  data.attendanceRecords[index].attendanceStatus = status;
  data.attendanceRecords[index].resultSource = "Manual adjustment";
  showToast("Student status updated");
  render();
}

function renderLecturerSessionDetail() {
  const session = selectedSession();
  const classItem = data.classSections.find((item) => item.classSectionId === session.classSectionId);
  const records = sessionRecords(session.sessionId);
  const rows = records.map((record) => {
    const account = data.accounts.find((item) => item.linkedProfile === record.studentId);
    const index = data.attendanceRecords.indexOf(record);
    return `
      <tr class="hover:bg-orange-50/50">
        <td class="px-4 py-3 font-medium text-slate-900">${record.studentId}</td>
        <td class="px-4 py-3 text-slate-700">${account?.fullName || record.studentId}</td>
        <td class="px-4 py-3">${badge(record.attendanceStatus)}</td>
        <td class="px-4 py-3 text-slate-700">${record.method}</td>
        <td class="px-4 py-3 text-slate-700">${record.submittedAt}</td>
        <td class="px-4 py-3 text-slate-700">${record.distance}</td>
        <td class="px-4 py-3">
          <div class="flex flex-wrap gap-2">
            <button type="button" onclick="setRecordStatus(${index}, 'Present')" class="rounded-lg border border-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">Present</button>
            <button type="button" onclick="setRecordStatus(${index}, 'Late')" class="rounded-lg border border-orange-100 px-2 py-1 text-xs font-semibold text-brand-700">Late</button>
            <button type="button" onclick="setRecordStatus(${index}, 'Absent')" class="rounded-lg border border-red-100 px-2 py-1 text-xs font-semibold text-red-700">Absent</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
  return `
    ${pageHeader("Lecturer", "Session Detail", `${classItem.classSectionName} · ${session.sessionDate} · ${session.startTime} - ${session.endTime}`, `${button("Back to Sessions", "navigate('lecturer-sessions')", "arrow-left", "secondary")}${button("Create Check-in", "createCheckIn()", "qr-code")}${button("Close Check-in", "closeCheckIn()", "pause-circle", "secondary")}`)}
    <div class="mb-5 grid gap-4 lg:grid-cols-4">
      ${stat("Room", session.roomId, "map-pin", "slate")}
      ${stat("Present", records.filter((item) => item.attendanceStatus === "Present").length, "check-circle-2", "green")}
      ${stat("Late", records.filter((item) => item.attendanceStatus === "Late").length, "clock", "brand")}
      ${stat("Issues", records.filter((item) => item.attendanceStatus === "Rejected" || item.attendanceStatus === "Absent").length, "alert-triangle", "red")}
    </div>
    <div class="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      ${card(`
        <div class="flex items-start justify-between gap-3">
          <div>
            <h3 class="text-base font-semibold text-slate-950">Check-in Panel</h3>
            <p class="mt-1 text-sm text-slate-500">${state.checkInActive || session.status === "Active" ? "Receiving check-ins" : "Check-in is closed"}</p>
          </div>
          ${badge(state.checkInActive || session.status === "Active" ? "Active" : "Closed")}
        </div>
        <div class="mt-4 rounded-2xl border border-orange-100 bg-brand-50 p-5 text-center">
          <div class="mx-auto flex h-44 w-44 items-center justify-center rounded-2xl bg-white p-4 shadow-sm">
            <div class="qr-grid h-full w-full rounded-xl"></div>
          </div>
          <p class="mt-4 text-sm font-semibold text-slate-500">QR refreshes every ${data.config.qrRefresh} seconds</p>
          <p class="mt-2 text-4xl font-black tracking-[0.22em] text-brand-700">418027</p>
          <p class="mt-1 text-sm text-slate-500">PIN refreshes every ${data.config.pinRefresh} seconds</p>
        </div>
        <div class="mt-4 rounded-xl border border-orange-100 bg-white p-3">
          <p class="text-sm font-semibold text-slate-950">Timetable</p>
          <p class="mt-1 text-sm text-slate-500">${session.sessionDate} · ${session.startTime} - ${session.endTime} · ${session.roomId}</p>
        </div>
      `)}
      ${card(`
        <div class="mb-4 flex items-center justify-between gap-3">
          <h3 class="text-base font-semibold text-slate-950">Student Status List</h3>
          <button type="button" onclick="showToast('Session report exported')" class="inline-flex h-9 items-center gap-2 rounded-lg border border-orange-100 px-3 text-sm font-semibold text-brand-700">${icon("download")}Export</button>
        </div>
        ${renderTable(["Student ID", "Name", "Status", "Method", "Submitted", "Distance", "Actions"], rows)}
      `)}
    </div>
  `;
}

function createCheckIn() {
  state.checkInActive = true;
  const session = selectedSession();
  session.status = "Active";
  showToast("Check-in created");
  render();
}

function closeCheckIn() {
  state.checkInActive = false;
  const session = selectedSession();
  session.status = "Closed";
  showToast("Check-in closed");
  render();
}

function renderAccountActions(account) {
  const base = [
    `<button type="button" onclick="openAccountModal('edit','${account.accountId}')" class="rounded-lg border border-orange-100 px-2 py-1 text-xs font-semibold text-brand-700">Edit</button>`,
    `<button type="button" onclick="toggleAccountStatus('${account.accountId}')" class="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700">${account.status === "Active" ? "Deactivate" : "Activate"}</button>`,
    `<button type="button" onclick="openAccountModal('delete','${account.accountId}')" class="rounded-lg border border-red-100 px-2 py-1 text-xs font-semibold text-red-700">Delete</button>`,
  ];
  if (account.role === "Student") {
    base.unshift(`<button type="button" onclick="showToast('Student attendance history opened')" class="rounded-lg border border-sky-100 px-2 py-1 text-xs font-semibold text-sky-700">History</button>`);
    base.unshift(`<button type="button" onclick="showToast('Class assignment opened')" class="rounded-lg border border-sky-100 px-2 py-1 text-xs font-semibold text-sky-700">Classes</button>`);
  }
  if (account.role === "Lecturer") {
    base.unshift(`<button type="button" onclick="showToast('Assigned classes opened')" class="rounded-lg border border-orange-100 px-2 py-1 text-xs font-semibold text-brand-700">Assigned Classes</button>`);
  }
  if (account.role === "Admin") {
    base.unshift(`<button type="button" onclick="showToast('Permission editor opened')" class="rounded-lg border border-purple-100 px-2 py-1 text-xs font-semibold text-purple-700">Permissions</button>`);
  }
  return `<div class="flex flex-wrap gap-2">${base.join("")}</div>`;
}

function filteredAccounts() {
  const filters = state.accountFilters;
  const keyword = filters.keyword.toLowerCase();
  return data.accounts.filter((account) => {
    const matchesRole = filters.role === "All" || account.role === filters.role;
    const matchesStatus = filters.status === "All" || account.status === filters.status;
    const matchesKeyword = !keyword || Object.values(account).join(" ").toLowerCase().includes(keyword);
    return matchesRole && matchesStatus && matchesKeyword;
  });
}

function setAccountFilter(key, value) {
  state.accountFilters[key] = value;
  render();
}

function renderAdminAccounts() {
  const accounts = filteredAccounts();
  const rows = accounts.map((account) => `
    <tr class="hover:bg-orange-50/50">
      <td class="px-4 py-3 font-medium text-slate-900">${account.accountId}</td>
      <td class="px-4 py-3 text-slate-700">${account.identityCode}</td>
      <td class="px-4 py-3 text-slate-700">${account.fullName}</td>
      <td class="px-4 py-3 text-slate-700">${account.email}</td>
      <td class="px-4 py-3">${badge(account.role)}</td>
      <td class="px-4 py-3">${badge(account.status)}</td>
      <td class="px-4 py-3 text-slate-700">${account.linkedProfile}</td>
      <td class="px-4 py-3">${renderAccountActions(account)}</td>
    </tr>
  `).join("");
  return `
    ${pageHeader("Admin", "Account Management", "Manage Student, Lecturer, and Admin accounts in one role-aware table.", button("Create Account", "openAccountModal('create')", "plus"))}
    ${card(`
      <div class="mb-4 grid gap-3 lg:grid-cols-[1fr_180px_180px_auto]">
        <label class="relative block">
          <span class="pointer-events-none absolute left-3 top-2.5 text-slate-400">${icon("search", "h-4 w-4")}</span>
          <input value="${escapeHtml(state.accountFilters.keyword)}" oninput="setAccountFilter('keyword', this.value)" class="h-10 w-full rounded-lg border border-orange-100 bg-white pl-9 pr-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-orange-100" placeholder="Search ID, name, email, profile..." />
        </label>
        <select onchange="setAccountFilter('role', this.value)" class="h-10 rounded-lg border border-orange-100 px-3 text-sm outline-none focus:border-brand-500">
          ${["All", "Student", "Lecturer", "Admin"].map((role) => `<option ${state.accountFilters.role === role ? "selected" : ""}>${role}</option>`).join("")}
        </select>
        <select onchange="setAccountFilter('status', this.value)" class="h-10 rounded-lg border border-orange-100 px-3 text-sm outline-none focus:border-brand-500">
          ${["All", "Active", "Inactive"].map((status) => `<option ${state.accountFilters.status === status ? "selected" : ""}>${status}</option>`).join("")}
        </select>
        <div class="flex items-center text-sm font-medium text-slate-500">${accounts.length} accounts</div>
      </div>
      ${renderTable(["Account ID", "Identity Code", "Full Name", "Email", "Role", "Status", "Linked Profile", "Actions"], rows || `<tr><td colspan="8" class="px-4 py-6 text-center text-slate-500">No matching accounts</td></tr>`)}
    `)}
  `;
}

function accountRoleFields(role, account = {}) {
  if (role === "Lecturer") {
    return `
      <label class="block text-sm font-medium text-slate-700">Lecturer ID
        <input name="linkedProfile" value="${escapeHtml(account.linkedProfile || "HueCTM")}" class="mt-1 h-10 w-full rounded-lg border border-orange-100 px-3 text-sm outline-none focus:border-brand-500" />
      </label>
      <label class="block text-sm font-medium text-slate-700">Department
        <input name="department" value="${escapeHtml(account.department || "Software Engineering")}" class="mt-1 h-10 w-full rounded-lg border border-orange-100 px-3 text-sm outline-none focus:border-brand-500" />
      </label>
      <label class="block text-sm font-medium text-slate-700 md:col-span-2">Assigned Class
        <select name="classSection" class="mt-1 h-10 w-full rounded-lg border border-orange-100 px-3 text-sm outline-none focus:border-brand-500">
          ${data.classSections.map((item) => `<option ${account.classSection === item.classSectionId ? "selected" : ""}>${item.classSectionId}</option>`).join("")}
        </select>
      </label>
      <input type="hidden" name="permissionLevel" value="${escapeHtml(account.permissionLevel || "")}" />
    `;
  }
  if (role === "Admin") {
    return `
      <label class="block text-sm font-medium text-slate-700">Admin Code
        <input name="linkedProfile" value="${escapeHtml(account.linkedProfile || "ADM-001")}" class="mt-1 h-10 w-full rounded-lg border border-orange-100 px-3 text-sm outline-none focus:border-brand-500" />
      </label>
      <label class="block text-sm font-medium text-slate-700">Permission Level
        <select name="permissionLevel" class="mt-1 h-10 w-full rounded-lg border border-orange-100 px-3 text-sm outline-none focus:border-brand-500">
          ${["Full Access", "Catalog Manager", "Read Only"].map((item) => `<option ${account.permissionLevel === item ? "selected" : ""}>${item}</option>`).join("")}
        </select>
      </label>
      <input type="hidden" name="classSection" value="${escapeHtml(account.classSection || "")}" />
      <input type="hidden" name="department" value="${escapeHtml(account.department || "Academic Office")}" />
    `;
  }
  return `
    <label class="block text-sm font-medium text-slate-700">Student ID
      <input name="linkedProfile" value="${escapeHtml(account.linkedProfile || "SE170999")}" class="mt-1 h-10 w-full rounded-lg border border-orange-100 px-3 text-sm outline-none focus:border-brand-500" />
    </label>
    <label class="block text-sm font-medium text-slate-700">Class Section
      <select name="classSection" class="mt-1 h-10 w-full rounded-lg border border-orange-100 px-3 text-sm outline-none focus:border-brand-500">
        ${data.classSections.map((item) => `<option ${account.classSection === item.classSectionId ? "selected" : ""}>${item.classSectionId}</option>`).join("")}
      </select>
    </label>
    <input type="hidden" name="department" value="${escapeHtml(account.department || "")}" />
    <input type="hidden" name="permissionLevel" value="${escapeHtml(account.permissionLevel || "")}" />
  `;
}

function renderAccountRoleFields(role) {
  const root = $("#roleFields");
  if (root) {
    root.innerHTML = accountRoleFields(role, {});
    if (window.lucide) window.lucide.createIcons();
  }
}

function openAccountModal(mode, accountId = "") {
  const account = data.accounts.find((item) => item.accountId === accountId) || {};
  if (mode === "delete") {
    $("#modalRoot").innerHTML = modalShell("Delete Account", `
      <p class="text-sm leading-6 text-slate-600">Delete <strong>${escapeHtml(account.fullName)}</strong> from the in-memory prototype data?</p>
      <div class="mt-5 flex justify-end gap-2">
        ${button("Cancel", "closeModal()", "x", "secondary")}
        <button type="button" onclick="deleteAccount('${accountId}')" class="inline-flex h-10 items-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white">${icon("trash-2")}Delete</button>
      </div>
    `);
    if (window.lucide) window.lucide.createIcons();
    return;
  }
  const role = account.role || "Student";
  $("#modalRoot").innerHTML = modalShell(mode === "create" ? "Create Account" : "Update Account", `
    <form onsubmit="saveAccount(event, '${mode}', '${accountId}')" class="space-y-4">
      <div class="grid gap-4 md:grid-cols-2">
        ${inputField("accountId", "Account ID", account.accountId || `ACC-${String(data.accounts.length + 1).padStart(3, "0")}`)}
        ${inputField("identityCode", "University Identity Code", account.identityCode || "SE170999")}
        ${inputField("fullName", "Full Name", account.fullName || "")}
        ${inputField("email", "Email", account.email || "")}
        <label class="block text-sm font-medium text-slate-700">Role
          <select name="role" onchange="renderAccountRoleFields(this.value)" class="mt-1 h-10 w-full rounded-lg border border-orange-100 px-3 text-sm outline-none focus:border-brand-500">
            ${["Student", "Lecturer", "Admin"].map((item) => `<option ${role === item ? "selected" : ""}>${item}</option>`).join("")}
          </select>
        </label>
        <label class="block text-sm font-medium text-slate-700">Status
          <select name="status" class="mt-1 h-10 w-full rounded-lg border border-orange-100 px-3 text-sm outline-none focus:border-brand-500">
            ${["Active", "Inactive"].map((item) => `<option ${account.status === item ? "selected" : ""}>${item}</option>`).join("")}
          </select>
        </label>
      </div>
      <div id="roleFields" class="grid gap-4 md:grid-cols-2">${accountRoleFields(role, account)}</div>
      <input type="hidden" name="registrationDate" value="${escapeHtml(account.registrationDate || "2026-07-16")}" />
      <div class="flex justify-end gap-2">
        ${button("Cancel", "closeModal()", "x", "secondary")}
        <button class="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white">${icon("save")}Save</button>
      </div>
    </form>
  `);
  if (window.lucide) window.lucide.createIcons();
}

function inputField(name, label, value = "", type = "text") {
  return `
    <label class="block text-sm font-medium text-slate-700">${label}
      <input name="${name}" type="${type}" value="${escapeHtml(value)}" required class="mt-1 h-10 w-full rounded-lg border border-orange-100 px-3 text-sm outline-none focus:border-brand-500" />
    </label>
  `;
}

function modalShell(title, content) {
  return `
    <div class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 p-4">
      <div class="w-full max-w-2xl rounded-2xl border border-orange-100 bg-white p-5 shadow-soft">
        <div class="mb-4 flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-brand-600">Modal</p>
            <h3 class="text-lg font-semibold text-slate-950">${title}</h3>
          </div>
          <button type="button" onclick="closeModal()" class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-orange-100 text-slate-600">${icon("x")}</button>
        </div>
        ${content}
      </div>
    </div>
  `;
}

function saveAccount(event, mode, accountId) {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(event.target).entries());
  const duplicate = data.accounts.some((item) => item.accountId === values.accountId && item.accountId !== accountId);
  if (duplicate) {
    showToast("Account ID already exists");
    return;
  }
  if (mode === "create") {
    data.accounts.unshift(values);
  } else {
    const index = data.accounts.findIndex((item) => item.accountId === accountId);
    data.accounts[index] = values;
  }
  closeModal();
  showToast("Account saved");
  render();
}

function deleteAccount(accountId) {
  data.accounts = data.accounts.filter((item) => item.accountId !== accountId);
  closeModal();
  showToast("Account deleted");
  render();
}

function toggleAccountStatus(accountId) {
  const account = data.accounts.find((item) => item.accountId === accountId);
  account.status = account.status === "Active" ? "Inactive" : "Active";
  showToast("Account status updated");
  render();
}

function fieldInput(field, value = "") {
  const common = `name="${field.name}" required class="mt-1 h-10 w-full rounded-lg border border-orange-100 bg-white px-3 text-sm outline-none focus:border-brand-500"`;
  if (field.type === "select") {
    const options = typeof field.options === "function" ? field.options() : field.options;
    return `
      <label class="block text-sm font-medium text-slate-700">${field.label}
        <select ${common}>${options.map((option) => `<option value="${escapeHtml(option)}" ${String(value) === String(option) ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}</select>
      </label>
    `;
  }
  return `
    <label class="block text-sm font-medium text-slate-700">${field.label}
      <input ${common} type="${field.type}" step="${field.step || ""}" value="${escapeHtml(value)}" />
    </label>
  `;
}

function crudPage(configKey) {
  const config = crudConfigs[configKey];
  const rows = data[config.dataKey];
  const search = (state.search[configKey] || "").toLowerCase();
  const filtered = rows.filter((row) => Object.values(row).join(" ").toLowerCase().includes(search));
  const body = filtered.map((row) => {
    const index = rows.indexOf(row);
    return `
      <tr class="hover:bg-orange-50/50">
        ${config.columns.map(([key]) => `<td class="px-4 py-3 text-slate-700">${key === "status" ? badge(row[key]) : escapeHtml(row[key])}</td>`).join("")}
        <td class="px-4 py-3">
          <div class="flex gap-2">
            <button type="button" onclick="openCrudModal('${configKey}', 'edit', ${index})" class="rounded-lg border border-orange-100 px-2 py-1 text-xs font-semibold text-brand-700">Edit</button>
            <button type="button" onclick="openCrudModal('${configKey}', 'delete', ${index})" class="rounded-lg border border-red-100 px-2 py-1 text-xs font-semibold text-red-700">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
  return `
    ${pageHeader("Admin", config.title, "Create, update, delete, filter, and review catalog records.", button("Add New", `openCrudModal('${configKey}', 'create')`, "plus"))}
    ${card(`
      <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <label class="relative block md:w-80">
          <span class="pointer-events-none absolute left-3 top-2.5 text-slate-400">${icon("search", "h-4 w-4")}</span>
          <input value="${escapeHtml(state.search[configKey] || "")}" oninput="setSearch('${configKey}', this.value)" class="h-10 w-full rounded-lg border border-orange-100 bg-white pl-9 pr-3 text-sm outline-none focus:border-brand-500" placeholder="Search records..." />
        </label>
        <p class="text-sm text-slate-500">${filtered.length} records</p>
      </div>
      ${renderTable([...config.columns.map(([, label]) => label), "Actions"], body || `<tr><td colspan="${config.columns.length + 1}" class="px-4 py-6 text-center text-slate-500">No matching records</td></tr>`)}
    `)}
  `;
}

function openCrudModal(configKey, mode, index = -1) {
  const config = crudConfigs[configKey];
  const row = index >= 0 ? data[config.dataKey][index] : {};
  if (mode === "delete") {
    $("#modalRoot").innerHTML = modalShell(`Delete ${config.title}`, `
      <p class="text-sm leading-6 text-slate-600">Delete <strong>${escapeHtml(row[config.idField])}</strong> from the prototype data?</p>
      <div class="mt-5 flex justify-end gap-2">
        ${button("Cancel", "closeModal()", "x", "secondary")}
        <button type="button" onclick="confirmCrudDelete('${configKey}', ${index})" class="inline-flex h-10 items-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white">${icon("trash-2")}Delete</button>
      </div>
    `);
  } else {
    $("#modalRoot").innerHTML = modalShell(`${mode === "create" ? "Create" : "Update"} ${config.title}`, `
      <form onsubmit="saveCrud(event, '${configKey}', '${mode}', ${index})" class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2">${config.fields.map((field) => fieldInput(field, row[field.name])).join("")}</div>
        <div class="flex justify-end gap-2">
          ${button("Cancel", "closeModal()", "x", "secondary")}
          <button class="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white">${icon("save")}Save</button>
        </div>
      </form>
    `);
  }
  if (window.lucide) window.lucide.createIcons();
}

function saveCrud(event, configKey, mode, index) {
  event.preventDefault();
  const config = crudConfigs[configKey];
  const values = Object.fromEntries(new FormData(event.target).entries());
  const duplicate = data[config.dataKey].some((item, itemIndex) => item[config.idField] === values[config.idField] && itemIndex !== index);
  if (duplicate) {
    showToast("Identifier already exists");
    return;
  }
  if (mode === "create") data[config.dataKey].unshift(values);
  else data[config.dataKey][index] = values;
  closeModal();
  showToast("Record saved");
  render();
}

function confirmCrudDelete(configKey, index) {
  const config = crudConfigs[configKey];
  data[config.dataKey].splice(index, 1);
  closeModal();
  showToast("Record deleted");
  render();
}

function setSearch(key, value) {
  state.search[key] = value;
  render();
}

function renderAdminConfig() {
  return `
    ${pageHeader("Admin", "Attendance Configuration Management", "Configure attendance timing, late threshold, and default classroom radius.", button("Save Configuration", "showToast('Configuration saved')", "save", "secondary"))}
    ${card(`
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        ${[
          ["QR Refresh Seconds", "qrRefresh", "timer-reset", "BR-02"],
          ["QR Validity Seconds", "qrValidity", "shield-check", "BR-02"],
          ["PIN Refresh Seconds", "pinRefresh", "binary", "BR-02"],
          ["Late Threshold Minutes", "lateThreshold", "clock", "BR-13"],
          ["Default Allowed Radius", "defaultRadius", "map-pin", "BR-03"],
        ].map(([label, key, iconName, rule]) => `
          <label class="rounded-xl border border-orange-100 bg-white p-4">
            <span class="flex items-center gap-2 text-sm font-semibold text-slate-900">${icon(iconName)}${label}</span>
            <input value="${data.config[key]}" oninput="updateConfig('${key}', this.value)" type="number" class="mt-3 h-11 w-full rounded-lg border border-orange-100 px-3 text-sm outline-none focus:border-brand-500" />
            <span class="mt-2 block text-xs font-semibold text-brand-700">${rule}</span>
          </label>
        `).join("")}
      </div>
    `)}
  `;
}

function updateConfig(key, value) {
  data.config[key] = value;
}

const views = {
  "student-app": renderStudentApp,
  "web-login": renderWebLogin,
  "lecturer-classes": renderLecturerClasses,
  "lecturer-sessions": renderLecturerSessions,
  "lecturer-session-detail": renderLecturerSessionDetail,
  "admin-accounts": renderAdminAccounts,
  "admin-subjects": () => crudPage("subjects"),
  "admin-classes": () => crudPage("classes"),
  "admin-rooms": () => crudPage("rooms"),
  "admin-config": renderAdminConfig,
};

document.addEventListener("DOMContentLoaded", () => {
  $("#roleSelect").addEventListener("change", (event) => setRole(event.target.value));
  $("#mobileMenuButton").addEventListener("click", openMobileMenu);
  $("#mobileBackdrop").addEventListener("click", closeMobileMenu);
  render();
});

Object.assign(window, {
  data,
  state,
  navigate,
  setRole,
  enterWebPortal,
  setStudentTab,
  openClassSessions,
  openSessionDetail,
  createCheckIn,
  closeCheckIn,
  setRecordStatus,
  setAccountFilter,
  openAccountModal,
  renderAccountRoleFields,
  saveAccount,
  deleteAccount,
  toggleAccountStatus,
  openCrudModal,
  saveCrud,
  confirmCrudDelete,
  setSearch,
  updateConfig,
  closeModal,
  showToast,
});
