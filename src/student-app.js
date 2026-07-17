const state = {
  tab: "home",
  pin: "",
  checkMode: "QR",
  checkedIn: false,
};

const timetable = [
  { time: "08:00", end: "10:15", subject: "SWD392", name: "Software Architecture and Design", room: "AL-L402", status: "Open" },
  { time: "10:30", end: "12:45", subject: "PRN212", name: "Cross-Platform Application Programming", room: "BE-305", status: "Upcoming" },
  { time: "13:00", end: "15:15", subject: "SWT301", name: "Software Testing", room: "DE-101", status: "Upcoming" },
];

const classes = [
  { code: "SWD392", name: "Software Architecture and Design", lecturer: "Hoang Thi Hue", attendance: "11/12" },
  { code: "PRN212", name: "Cross-Platform Application Programming", lecturer: "Pham Thu Linh", attendance: "10/12" },
  { code: "SWT301", name: "Software Testing", lecturer: "Pham Thu Linh", attendance: "12/12" },
];

function $(selector) {
  return document.querySelector(selector);
}

function icon(name, size = 18) {
  return `<i data-lucide="${name}" width="${size}" height="${size}"></i>`;
}

function badge(value) {
  const tone = value === "Open" || value === "Present" ? "green" : value === "Late" ? "amber" : value === "Absent" ? "red" : "blue";
  return `<span class="badge ${tone}">${value}</span>`;
}

function currentAttendanceStatus() {
  return state.checkedIn ? "Present" : "Not Yet";
}

function showScreen(key) {
  document.querySelectorAll(".mobile-screen").forEach((screen) => screen.classList.remove("active"));
  $(`#screen-${key}`).classList.add("active");
  if (["home", "timetable", "classes"].includes(key)) {
    state.tab = key;
    updateBottomNav();
  }
  if (window.lucide) window.lucide.createIcons();
}

function updateBottomNav() {
  document.querySelectorAll("#bottomNav button").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === state.tab);
  });
}

function renderHome() {
  $("#screen-home").innerHTML = `
    <div class="student-header">
      <div class="avatar">AN</div>
      <div>
        <strong>Nguyen Minh An</strong><br />
        <span class="muted">SE170123 · Student</span>
      </div>
    </div>

    <section class="mobile-card" style="margin-bottom:14px;">
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;">
        <div>
          <strong>SWD392</strong>
          <p class="muted" style="margin:4px 0 0;">08:00 - 10:15 · AL-L402</p>
          <p class="muted" style="margin:6px 0 0;">Attendance: ${currentAttendanceStatus()}</p>
        </div>
        ${badge(currentAttendanceStatus())}
      </div>
    </section>

    <div class="quick-actions">
      <button class="btn btn-primary quick-action" type="button" onclick="startQrFlow()">
        ${icon("scan-qr-code")}
        Check in QR
      </button>
      <button class="btn btn-secondary quick-action" type="button" onclick="openPinFlow()">
        ${icon("binary")}
        Check in PIN
      </button>
      <button class="btn btn-secondary quick-action" type="button" onclick="openReport()">
        ${icon("message-square-warning")}
        Report
      </button>
    </div>

    <section style="margin-top:18px;">
      <h3 style="margin:0 0 10px;font-size:15px;">Today</h3>
      <div class="timeline">
        ${timetable.slice(0, 2).map((item) => `
        <article class="timeline-item">
          <div class="timeline-time">${item.time}</div>
          <strong>${item.subject}</strong>
          <p class="muted" style="margin:4px 0 8px;">${item.name}</p>
            ${badge(item.subject === "SWD392" ? currentAttendanceStatus() : item.status)}
        </article>
      `).join("")}
      </div>
    </section>
  `;
}

function renderTimetable() {
  $("#screen-timetable").innerHTML = `
    <h2 style="margin:0 0 14px;">Timetable</h2>
    <div class="timeline">
      ${timetable.map((item) => `
        <article class="timeline-item">
          <div class="timeline-time">${item.time}</div>
          <strong>${item.subject}</strong>
          <p style="margin:5px 0;color:var(--brand-ink);">${item.name}</p>
          <p class="muted" style="margin:0 0 9px;">${item.time} - ${item.end} · ${item.room}</p>
          ${badge(item.subject === "SWD392" ? currentAttendanceStatus() : item.status)}
        </article>
      `).join("")}
    </div>
  `;
}

function renderClasses() {
  $("#screen-classes").innerHTML = `
    <h2 style="margin:0 0 14px;">Classes</h2>
    <div class="grid">
      ${classes.map((item) => `
        <article class="mobile-card">
          <strong>${item.code}</strong>
          <p style="margin:4px 0;color:var(--brand-ink);">${item.name}</p>
          <p class="muted" style="margin:0 0 10px;">${item.lecturer}</p>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span class="muted">Attendance</span>
            <strong>${item.attendance}</strong>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderQrFlow() {
  $("#screen-qr").innerHTML = `
    <button class="btn btn-secondary" type="button" onclick="showScreen('home')" style="margin-bottom:14px;">
      ${icon("chevron-left")}
      Back
    </button>
    <h2 style="margin:0 0 12px;">QR check-in</h2>
    <div class="scanner">
      <div class="scan-frame"></div>
      <div class="scan-line"></div>
      <strong style="position:absolute;bottom:18px;">Scanning QR token</strong>
    </div>
    <div class="check-steps" id="qrSteps">
      <div class="check-step running">${icon("loader-circle")}Opening camera</div>
      <div class="check-step">${icon("circle")}Validating biometric identity</div>
      <div class="check-step">${icon("circle")}Reading QR token</div>
      <div class="check-step">${icon("circle")}Verifying classroom location</div>
      <div class="check-step">${icon("circle")}Recording attendance</div>
    </div>
  `;
}

function startQrFlow() {
  state.checkMode = "QR";
  renderQrFlow();
  showScreen("qr");
  runCheckSteps("#qrSteps");
}

function runCheckSteps(selector) {
  const steps = Array.from(document.querySelectorAll(`${selector} .check-step`));
  steps.forEach((step, index) => {
    setTimeout(() => {
      steps.forEach((item, itemIndex) => {
        item.classList.toggle("done", itemIndex < index);
        item.classList.toggle("running", itemIndex === index);
        item.innerHTML = `${icon(itemIndex < index ? "check-circle-2" : itemIndex === index ? "loader-circle" : "circle")}${item.textContent}`;
      });
      if (index === steps.length - 1) {
        setTimeout(() => finishCheckIn(), 900);
      }
      if (window.lucide) window.lucide.createIcons();
    }, index * 850);
  });
}

function finishCheckIn() {
  state.checkedIn = true;
  $("#screen-result").innerHTML = `
    <div style="display:grid;min-height:600px;place-items:center;text-align:center;">
      <div>
        <div style="display:grid;width:72px;height:72px;place-items:center;border-radius:50%;background:var(--green-soft);color:var(--green);margin:0 auto 18px;">
          ${icon("check", 34)}
        </div>
        <h2 style="margin:0 0 8px;">Checked in</h2>
        <p class="muted" style="margin:0 0 22px;">SWD392 · ${state.checkMode} · ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
        <button class="btn btn-primary btn-full" type="button" onclick="renderHome(); showScreen('home')">Done</button>
      </div>
    </div>
  `;
  showScreen("result");
}

function openPinFlow() {
  state.checkMode = "PIN";
  state.pin = "";
  renderPinFlow();
  showScreen("pin");
}

function renderPinFlow() {
  $("#screen-pin").innerHTML = `
    <button class="btn btn-secondary" type="button" onclick="showScreen('home')" style="margin-bottom:14px;">
      ${icon("chevron-left")}
      Back
    </button>
    <h2 style="margin:0 0 6px;text-align:center;">Enter PIN</h2>
    <p class="muted" style="margin:0;text-align:center;">Use the 6-digit code shown by your lecturer.</p>
    <div class="pin-dots">
      ${Array.from({ length: 6 }).map((_, index) => `<span class="pin-dot ${state.pin.length > index ? "filled" : ""}"></span>`).join("")}
    </div>
    <div class="keypad">
      ${["1","2","3","4","5","6","7","8","9","","0","back"].map((key) => {
        if (!key) return `<span></span>`;
        return `<button type="button" onclick="${key === "back" ? "removePinDigit()" : `addPinDigit('${key}')`}">${key === "back" ? "⌫" : key}</button>`;
      }).join("")}
    </div>
    <button class="btn btn-primary btn-full" type="button" onclick="submitPin()">${icon("check")}Submit PIN</button>
  `;
}

function addPinDigit(digit) {
  if (state.pin.length >= 6) return;
  state.pin += digit;
  renderPinFlow();
  if (window.lucide) window.lucide.createIcons();
}

function removePinDigit() {
  state.pin = state.pin.slice(0, -1);
  renderPinFlow();
  if (window.lucide) window.lucide.createIcons();
}

function submitPin() {
  if (state.pin.length < 6) {
    toast("Enter 6 digits");
    return;
  }
  $("#screen-pin").innerHTML = `
    <h2 style="margin:0 0 16px;">Verifying PIN</h2>
    <div class="mobile-card">
      <div class="check-steps" id="pinSteps">
        <div class="check-step running">${icon("loader-circle")}Sending PIN</div>
        <div class="check-step">${icon("circle")}Matching active session</div>
        <div class="check-step">${icon("circle")}Recording attendance</div>
      </div>
    </div>
  `;
  runCheckSteps("#pinSteps");
}

function openReport() {
  $("#screen-report").innerHTML = `
    <button class="btn btn-secondary" type="button" onclick="showScreen('home')" style="margin-bottom:14px;">
      ${icon("chevron-left")}
      Back
    </button>
    <h2 style="margin:0 0 14px;">Report issue</h2>
    <div class="form-grid">
      <label>
        Issue type
        <select>
          <option>Cannot scan QR</option>
          <option>PIN not accepted</option>
          <option>Wrong attendance status</option>
        </select>
      </label>
      <label>
        Message
        <textarea placeholder="Describe what happened"></textarea>
      </label>
      <button class="btn btn-primary btn-full" type="button" onclick="submitReport()">${icon("send")}Submit report</button>
    </div>
  `;
  showScreen("report");
}

function submitReport() {
  toast("Report sent");
  showScreen("home");
}

function toast(message) {
  const root = $("#toast");
  root.textContent = message;
  root.classList.add("show");
  setTimeout(() => root.classList.remove("show"), 2000);
}

function updateClock() {
  const now = new Date();
  $("#phoneTime").textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

$("#studentLoginBtn").addEventListener("click", () => {
  $("#bottomNav").classList.remove("hidden");
  renderHome();
  renderTimetable();
  renderClasses();
  showScreen("home");
});

document.querySelectorAll("#bottomNav button").forEach((button) => {
  button.addEventListener("click", () => {
    const tab = button.dataset.tab;
    if (tab === "home") renderHome();
    if (tab === "timetable") renderTimetable();
    if (tab === "classes") renderClasses();
    showScreen(tab);
  });
});

setInterval(updateClock, 1000);
updateClock();

Object.assign(window, {
  showScreen,
  startQrFlow,
  openPinFlow,
  addPinDigit,
  removePinDigit,
  submitPin,
  openReport,
  submitReport,
  renderHome,
});

if (window.lucide) window.lucide.createIcons();
