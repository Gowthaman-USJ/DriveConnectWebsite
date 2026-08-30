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

async function loadDashboardData() {
  const stuID = localStorage.getItem("stuID");
  const response = await fetch(`/api/stuportal/student/${stuID}`);

  const student = await response.json();

  document.getElementById("topbarAvatar").textContent =
    student.user.fName.charAt(0) + student.user.lName.charAt(0);

  document.getElementById("studenname").textContent = student.user.fName;
}

async function loadUpcomingLessons() {
    const stuID = localStorage.getItem("stuID");

  const container = document.getElementById("dashUpcoming");

  if (!container) {
    console.error("dashUpcoming not found");
    return;
  }

  try {
    const response = await fetch(
      `/api/stuportal/upcoming-lessons/${stuID}`
    );

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const lessons = await response.json();
    if (!lessons || lessons.length === 0) {
      container.innerHTML = `
        <div class="text-center text-muted p-4">
          <i class="bi bi-calendar-x fs-3"></i>
          <p class="mt-2 mb-0">
            No upcoming lessons this week.
          </p>
        </div>
      `;

      return;
    }

    container.innerHTML = lessons
      .map((lesson) => {
        const date = new Date(lesson.date + "T00:00:00");

        const day = date.toLocaleDateString("en-US", {
          weekday: "short",
        });

        const formattedDate = date.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        });

        const time = new Date(`1970-01-01T${lesson.time}`).toLocaleTimeString(
          "en-US",
          {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }
        );

        const instructorName =
          `${lesson.instructor?.fName || ""} ${
            lesson.instructor?.lName || ""
          }`.trim() || "Instructor not assigned";

        return `
          <div class="lesson-row">

            <div class="date-box">
              <div class="db-day">${day}</div>
              <div class="db-mon">${formattedDate}</div>
            </div>

            <div class="li-info">
              <div class="li-title">
                Lesson #${lesson.lessonNumber || "-"}
              </div>

              <div class="li-meta">
                <i class="bi bi-clock"></i>
                ${time}

                <span>·</span>

                <i class="bi bi-person"></i>
                ${instructorName}
              </div>
            </div>

            <div class="li-actions">
              <span class="lesson-status status-upcoming">
                Upcoming
              </span>
            </div>

          </div>
        `;
      })
      .join("");
  } catch (error) {
    console.error("Error loading upcoming lessons:", error);

    container.innerHTML = `
      <div class="text-center text-danger p-4">
        <i class="bi bi-exclamation-circle fs-3"></i>
        <p class="mt-2 mb-0">
          Failed to load upcoming lessons.
        </p>
      </div>
    `;
  }
}
