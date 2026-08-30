async function loadDashboardData() {
  const insID = localStorage.getItem("insID");

  const instructorResponse = await fetch(
    `/api/insportal/${insID}`
  );

  const instructor = await instructorResponse.json();

  document.getElementById("topbarAvatar").innerHTML =
    instructor.fName.charAt(0) + instructor.lName.charAt(0);
  document.getElementById("insname").innerHTML = instructor.fName;

  const lessonResponse = await fetch(
    `/api/insportal/today-lessons/${insID}`
  );

  const count = await lessonResponse.json();

  document.getElementById("todayLessons").innerHTML = "0" + count;

  const studentResponse = await fetch(
    `/api/insportal/students/${insID}`
  );

  const stucount = await studentResponse.json();

  document.getElementById("students").innerHTML = "0" + stucount;
}

function setGreeting() {
  const greetingElement = document.getElementById("greeting");

  if (!greetingElement) return;

  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    greetingElement.textContent = "Good morning";
  } else if (hour >= 12 && hour < 17) {
    greetingElement.textContent = "Good afternoon";
  } else if (hour >= 17 && hour < 21) {
    greetingElement.textContent = "Good evening";
  } else {
    greetingElement.textContent = "Good night";
  }
}

async function loadScheduledashboard() {
  const insID = localStorage.getItem("insID");

  const response = await fetch(
    `/api/insportal/scheduletable/${insID}`
  );

  schedule = await response.json();

  const today = new Date().toISOString().split("T")[0];

  const todaySchedule = schedule.filter((lesson) => lesson.date === today);

  loadDashboardLessons(todaySchedule);
}

function loadDashboardLessons(scheduleList) {
  // Sort lessons by time: earliest → latest
  scheduleList.sort((a, b) => {
    return convertTimeToMinutes(a.time) - convertTimeToMinutes(b.time);
  });

  let timeline = "";

  if (!scheduleList || scheduleList.length === 0) {
    document.getElementById("dashLessons").innerHTML = `
      <div class="empty-schedule">
        <i class="bi bi-calendar-x"></i>
        <h6>No lessons scheduled</h6>
        <p>There are no lessons available for today.</p>
      </div>
    `;
    return;
  }

  scheduleList.forEach((lesson, index) => {
    let dotClass = "upcoming";
    let cardClass = "";

    if (lesson.status === "Completed") {
      dotClass = "done";
      cardClass = "completed";
    } else if (lesson.status === "InProgress") {
      dotClass = "now";
      cardClass = "active-now";
    }

    const firstName = lesson.student?.user?.fName || "";
    const lastName = lesson.student?.user?.lName || "";

    const studentName = `${firstName} ${lastName}`.trim();

    const initial = firstName ? firstName.charAt(0).toUpperCase() : "?";

    const courseName = lesson.student?.courses?.name || "Driving Lesson";

    const studentId = lesson.student?.stuID
      ? `STU-${String(lesson.student.stuID).padStart(3, "0")}`
      : "N/A";

    timeline += `
      <div class="lesson-block">

        <!-- TIME -->
        <div class="timeline-time">
          <div class="t-hour">
            ${formatTime(lesson.time)}
          </div>
        </div>


        <!-- TIMELINE RAIL -->
        <div class="timeline-rail">

          <div class="rail-dot ${dotClass}"></div>

          ${
            index !== scheduleList.length - 1
              ? `<div class="rail-line ${dotClass}"></div>`
              : ""
          }

        </div>


        <!-- LESSON CARD -->
        <div class="lesson-card ${cardClass}">

          <div class="lc-top">

            <!-- AVATAR -->
            <div class="lc-avatar">
              ${initial}
            </div>


            <!-- STUDENT INFO -->
            <div class="lc-student-info">

              <div class="lc-name">
                ${studentName}
              </div>

              <div class="lc-lesson">
                ${courseName}
              </div>

            </div>


            <!-- STATUS -->
            <span class="lc-status ${dotClass}">
              ${formatStatus(lesson.status)}
            </span>

          </div>


          <!-- META -->
          <div class="lc-meta">

            <div class="lc-meta-item">
              <i class="bi bi-person"></i>
              ${studentId}
            </div>


            <div class="lc-meta-item">
              <i class="bi bi-clock"></i>
              ${formatTime(lesson.time)}
              -
              ${formatTime(addOneHour(lesson.time))}
            </div>

          </div>

        </div>

      </div>
    `;
  });

  document.getElementById("dashLessons").innerHTML = `
    <div class="lesson-timeline">
      ${timeline}
    </div>
  `;
}

function convertTimeToMinutes(time) {
  if (!time) return 0;

  // If backend returns "09:30"
  if (time.includes(":")) {
    const parts = time.split(":");

    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);

    return hours * 60 + minutes;
  }

  return 0;
}

function formatTime(time) {
  let [hour, minute] = time.split(":");

  hour = parseInt(hour);

  let ampm = hour >= 12 ? "PM" : "AM";

  hour = hour % 12 || 12;

  return `${hour}:${minute} ${ampm}`;
}

function formatStatus(status) {
  if (status === "InProgress") {
    return "In Progress";
  }

  return status;
}

function addOneHour(time) {
  let [hour, minute] = time.split(":");

  let date = new Date();
  date.setHours(parseInt(hour));
  date.setMinutes(parseInt(minute));

  date.setHours(date.getHours() + 1);

  let newHour = date.getHours();
  let newMinute = String(date.getMinutes()).padStart(2, "0");

  return `${String(newHour).padStart(2, "0")}:${newMinute}`;
}

async function loadVehicle() {
  const insID = localStorage.getItem("insID");

  if (!insID) {
    console.error("Instructor ID not found");
    return;
  }

  try {
    const response = await fetch(
      `/api/insportal/getVehicle/${insID}`
    );

    const vehicle = await response.json();
    document.getElementById("vehicleName").innerHTML = `${
      vehicle.brand || "-"
    } ${vehicle.model || "-"}`;

    document.getElementById("vehicleDetails").innerHTML = `${
      vehicle.vehNo || "-"
    } · ${vehicle.transmission || "-5"}`;

    const statusColor =
      vehicle.status === "Maintenance" ? "red" : "var(--success)";

    document.getElementById("vehicleStatus").innerHTML = `
      <span style="color:${statusColor};">
        <i class="bi bi-circle-fill" style="font-size:0.5rem;"></i>
        ${vehicle.status || "Unknown"}
      </span>
    `;
  } catch (error) {
    document.getElementById("vehicleName").textContent = "No vehicle assigned";
    document.getElementById("vehicleDetails").textContent = "-";
    document.getElementById("vehicleStatus").textContent = "Unavailable";
  }
}
