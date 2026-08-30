let allLessons = [];
let currentFilter = "all";

async function loadStudentLessons2() {
  const stuID = localStorage.getItem("stuID");

  try {
    const response = await fetch(
      `/api/stuportal/studentlessons/${stuID}`
    );

    allLessons = await response.json();
    allLessons.sort((a, b) => {
      const dateTimeA = new Date(`${a.date}T${a.time}`);
      const dateTimeB = new Date(`${b.date}T${b.time}`);

      return dateTimeA - dateTimeB;
    });
    filterLessons("all");

    renderLessonSummary();
  } catch (error) {
    console.error("Error loading lessons:", error);

    document.getElementById("lessBody").innerHTML = `
            <div class="text-center text-danger p-4">
                <i class="bi bi-exclamation-circle fs-3"></i>
                <p class="mt-2">Failed to load lessons.</p>
            </div>
        `;
  }
}
function filterLessons(filter) {
  currentFilter = filter;

  // Update buttons
  document.querySelectorAll("#filterTabs button").forEach((btn) => {
    btn.classList.remove("btn-prim");
    btn.classList.add("btn-out");
  });

  const activeButton = document.getElementById("ft-" + filter);

  if (activeButton) {
    activeButton.classList.remove("btn-out");
    activeButton.classList.add("btn-prim");
  }

  let filteredLessons;

  if (filter === "all") {
    filteredLessons = allLessons;

    document.getElementById("lessTitle").innerHTML = `
            <i class="bi bi-list-ul text-primary me-2"></i>
            All Lessons
        `;
  } else if (filter === "upcoming") {
    filteredLessons = allLessons.filter(
      (lesson) => lesson.status === "Scheduled"
    );

    document.getElementById("lessTitle").innerHTML = `
            <i class="bi bi-calendar-event text-primary me-2"></i>
            Upcoming Lessons
        `;
  } else if (filter === "done") {
    filteredLessons = allLessons.filter(
      (lesson) => lesson.status === "Completed"
    );

    document.getElementById("lessTitle").innerHTML = `
            <i class="bi bi-check-circle text-success me-2"></i>
            Completed Lessons
        `;
  }
  renderLessons(filteredLessons);
}

function renderLessons(lessons) {
  const body = document.getElementById("lessBody");

  if (!lessons || lessons.length === 0) {
    body.innerHTML = `
            <div class="text-center p-5 text-muted">
                <i class="bi bi-calendar-x fs-1"></i>
                <p class="mt-2 mb-0">No lessons found</p>
            </div>
        `;

    return;
  }

  body.innerHTML = lessons
    .map((lesson) => {
      const date = formatLessonDate(lesson.date);
      const time = formatLessonTime(lesson.time);
      const instructor =
        `${lesson.instructor?.fName || ""} ${
          lesson.instructor?.lName || ""
        }`.trim() || "Instructor not assigned";

      const lessonNumber = lesson.lessonNumber || "-";
      const status = (lesson.status || "Scheduled").trim();

      let statusClass = "status-upcoming";
      let statusText = "Upcoming";

      if (status.toLowerCase() === "completed") {
        statusClass = "status-completed";
        statusText = "Completed";
      }
      return `
                <div class="lesson-row">
                    <div class="date-box">

                        <div class="db-day">
                            ${date.day}
                        </div>

                        <div class="db-mon">
                            ${date.month}
                        </div>

                    </div>

                    <div class="li-info">

                        <div class="li-title">
                            Lesson #${lessonNumber} — ${
        lesson.student.courses.name
      }
                        </div>

                        <div class="li-meta">

                            <i class="bi bi-clock"></i>
                            ${time}

                            <span>·</span>

                            <i class="bi bi-person"></i>
                            ${instructor}

                        </div>

                    </div>
                    
                    <div class="li-actions">

                        <span class="lesson-status ${statusClass}">
                            ${statusText}
                        </span>

                    ${
          status.toLowerCase() === "scheduled"
              ? `
        <button
            type="button"
            class="cancel-btn"
            onclick="cancelLesson(${lesson.lessonID})"
        >
            <i class="bi bi-x-circle me-1"></i>
            Cancel
        </button>
      `
              : ""
      }

                    </div>

                </div>
            `;
    })
    .join("");
}
function formatLessonDate(dateString) {
  if (!dateString) {
    return {
      day: "-",
      month: "-",
    };
  }

  const date = new Date(dateString + "T00:00:00");

  const day = String(date.getDate()).padStart(2, "0");

  const month = date
    .toLocaleString("en-US", {
      month: "short",
    })
    .toUpperCase();

  return {
    day,
    month,
  };
}
function formatLessonTime(timeString) {
  if (!timeString) {
    return "-";
  }

  const [hours, minutes] = timeString.split(":");

  const date = new Date();

  date.setHours(parseInt(hours), parseInt(minutes), 0);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function renderLessonSummary() {
  const total = allLessons.length;

  const completed = allLessons.filter(
    (lesson) => lesson.status === "Completed"
  ).length;

  const upcoming = allLessons.filter(
    (lesson) => lesson.status === "Scheduled"
  ).length;

  const packageTotal =
    allLessons.length > 0
      ? allLessons[0].student?.courses?.totalSessions || total
      : total;

  const attendance =
    allLessons.length > 0 ? allLessons[0].student?.attendance || 0 : 0;
  const progress =
    packageTotal > 0 ? Math.round((attendance / packageTotal) * 100) : 0;

  let progressClass = "progress-red";

  if (progress >= 66) {
    progressClass = "progress-green";
  } else if (progress >= 33) {
    progressClass = "progress-orange";
  }

  document.getElementById("lessSummary").innerHTML = `

    <div class="summary-progress">

      <div class="summary-progress-top">
        <span>Package Progress</span>

        <strong>
          ${attendance}/${packageTotal}
        </strong>
      </div>

      <div class="progress-track">
  <div
    class="progress-fill ${progressClass}"
    style="width:${progress}%"
  ></div>
</div>

    </div>

    <div class="summary-item">
      <span>
        <i class="bi bi-calendar-check text-primary"></i>
        Total Scheduled Lessons
      </span>

      <strong>${total}</strong>
    </div>

    <div class="summary-item">
      <span>
        <i class="bi bi-clock text-primary"></i>
        Upcoming
      </span>

      <strong class="text-primary">
        ${upcoming}
      </strong>
    </div>

    <div class="summary-item">
      <span>
        <i class="bi bi-check-circle text-success"></i>
        Completed
      </span>

      <strong class="text-success">
        ${completed}
      </strong>
    </div>
  `;
}

async function cancelLesson(lessonID) {
  const lesson = allLessons.find((l) => l.lessonID === lessonID);

  if (!lesson) {
    return;
  }

  const confirmCancel = confirm(
    `Are you sure you want to cancel Lesson #${lesson.lessonNumber}?`
  );

  if (!confirmCancel) {
    return;
  }

  try {
    const response = await fetch(
      `/api/stuportal/deletelesson/${lessonID}`,
      {
        method: "DELETE",
      }
    );


    allLessons = allLessons.filter((l) => l.lessonID !== lessonID);

    filterLessons(currentFilter);
    renderLessonSummary();
    toast("Lesson cancelled successfully.", "success");
  } catch (error) {
    console.error("Error cancelling lesson:", error);

    toast("Failed to cancel lesson.", "warn");
  }
}

function toast(message, type = "info") {
  const wrapper = document.getElementById("toastWrap");

  if (!wrapper) {
    console.error("toastWrap not found");
    return;
  }

  const element = document.createElement("div");

  element.className = `tmsg ${type}`;
  element.textContent = message;

  wrapper.appendChild(element);

  setTimeout(() => {
    element.remove();
  }, 3500);
}
