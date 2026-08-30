let selectedLessonRow = null;
let selectedLessonId = null;

window.deleteLesson = function (button, id) {
  selectedLessonRow = button.closest("tr");
  selectedLessonId = id;

  const modalEl = document.getElementById("deleteLessonModal");

  if (!modalEl) return;

  const modal = new bootstrap.Modal(modalEl);
  modal.show();
};

window.confirmDeleteLesson = async function () {
  if (!selectedLessonId) return;

  try {
    const response = await fetch(
      `/api/dsportal/deleteLesson/${selectedLessonId}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      if (selectedLessonRow) {
        selectedLessonRow.remove();
      }

      const toastEl = document.getElementById("deleteToast");

      if (toastEl) {
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
      }
    } else {
      console.error("Delete failed");
    }
  } catch (error) {
    console.error("Delete error:", error);
  }

  const modalEl = document.getElementById("deleteLessonModal");

  const modalInstance = bootstrap.Modal.getInstance(modalEl);

  if (modalInstance) {
    modalInstance.hide();
  }

  selectedLessonRow = null;
  selectedLessonId = null;
};

let allSchedules = [];

async function loadCompleteSchedule() {
  const dsID = localStorage.getItem("dsID");

  const response = await fetch(
    `/api/dsportal/scheduletable/${dsID}`
  );

  allSchedules = await response.json();

  const today = new Date().toLocaleDateString("en-CA");

  document.getElementById("scheduleDate").value = today;

  displaySchedule(allSchedules.filter((schedule) => schedule.date === today));
}

function filterScheduleByDate() {
  const selectedDate = document.getElementById("scheduleDate").value;
  const filteredSchedules = allSchedules.filter(
    (schedule) => schedule.date === selectedDate
  );

  displaySchedule(filteredSchedules);
}

function displaySchedule(schedules) {
  const tbody = document.getElementById("scheduleTableBody");
  updateScheduleCounts(schedules);

  tbody.innerHTML = "";

  if (schedules.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center text-muted">
          No schedules available
        </td>
      </tr>
    `;
    return;
  }

  schedules.forEach((schedule) => {
    tbody.innerHTML += `
<tr>
    <td>${formatTime(schedule.time)}</td>

    <td>
        STU-${String(schedule.student.stuID).padStart(3, "0")}
    </td>

    <td>
        ${schedule.student.user.fName} ${schedule.student.user.lName}
    </td>

    <td>
        INS-${String(schedule.instructor.insID).padStart(3, "0")}
    </td>

    <td>
        ${schedule.instructor.fName} ${schedule.instructor.lName}
    </td>

    <td>
        ${schedule.student.courses.name}
    </td>

    <td>
        <span class="badge ${
          schedule.status.toLowerCase() === "completed"
            ? "bg-success"
            : schedule.status.toLowerCase() === "inprogress"
            ? "bg-warning"
            : "bg-primary"
        }">
  ${
    schedule.status.toLowerCase() === "inprogress"
      ? "In Progress"
      : schedule.status
  }
</span>
    </td>

    <td>
        <button class="btn btn-sm btn-outline-danger"
            onclick="deleteLesson(this, ${schedule.lessonID})">
            <i class="bi bi-trash"></i>
        </button>
    </td>
</tr>
`;
  });
}

function resetDate() {
  const today = new Date().toLocaleDateString("en-CA");

  document.getElementById("scheduleDate").value = today;

  displaySchedule(allSchedules.filter((schedule) => schedule.date === today));
}

function formatTime(time) {
  const [hour, minute] = time.split(":");

  const date = new Date();
  date.setHours(hour);
  date.setMinutes(minute);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function updateScheduleCounts(schedules) {
  const total = schedules.length;

  const completed = schedules.filter(
    (schedule) => schedule.status === "Completed"
  ).length;

  const inProgress = schedules.filter(
    (schedule) => schedule.status === "InProgress"
  ).length;

  const pending = schedules.filter(
    (schedule) => schedule.status === "Scheduled"
  ).length;

  document.getElementById("totalCount").innerHTML = total;
  document.getElementById("completedCount").innerHTML = completed;
  document.getElementById("progressCount").innerHTML = inProgress;
  document.getElementById("scheduledCount").innerHTML = pending;
}

function initAddLessonForm() {
  const lessonForm = document.getElementById("addLesson");

  if (!lessonForm) {
    return;
  }

  lessonForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const dsID = localStorage.getItem("dsID");

    const lessonData = {
      drivingSchool: {
        dsID: dsID,
      },

      student: {
        stuID: document.getElementById("stuID").value,
      },

      instructor: {
        insID: document.getElementById("insID").value,
      },

      time: document.getElementById("time").value,

      date: document.getElementById("date").value,
    };

    try {
      const response = await fetch(
        "/api/dsportal/booklesson",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(lessonData),
        }
      );

      if (response.ok) {
        loadPage("DisplaySchedule.html", "schedule");

        setTimeout(() => {
          showLessonToast("Lesson added successfully!", true);
        }, 500);
      } else {
        showLessonToast("Failed to add lesson!", false);
      }
    } catch (error) {
      console.error(error);

      showLessonToast("Server error!", false);
    }
  });
}

function showLessonToast(message, success = true) {
  const toastEl = document.getElementById("lessonToast");
  const toastMsg = document.getElementById("lessonToastMsg");

  if (!toastEl || !toastMsg) {
    console.error("Toast element not found");
    return;
  }

  toastMsg.innerHTML = message;

  if (success) {
    toastEl.classList.remove("text-bg-danger");
    toastEl.classList.add("text-bg-success");
  } else {
    toastEl.classList.remove("text-bg-success");
    toastEl.classList.add("text-bg-danger");
  }

  const toast = new bootstrap.Toast(toastEl, {
    delay: 3000,
  });

  toast.show();
}

async function loadStudentsSchedule() {
  const dsID = localStorage.getItem("dsID");

  if (!dsID) {
    console.error("Driving School ID not found");
    return;
  }

  try {
    const response = await fetch(
      `/api/dsportal/getstudents/${dsID}`
    );

    if (!response.ok) {
      throw new Error("Failed to load students");
    }

    const students = await response.json();

    const studentSelect = document.getElementById("stuID");

    if (!studentSelect) return;

    studentSelect.innerHTML = `
            <option value="">Select Student</option>
        `;

    students.forEach((student) => {
      const option = document.createElement("option");

      option.value = student.stuID;

      option.textContent = `${student.stuID} - ${student.user.fName ?? ""} ${
        student.user.lName ?? ""
      }`;

      studentSelect.appendChild(option);
      loadInstructorsSchedule();
    });
  } catch (error) {
    console.error("Error loading students:", error);
  }
}

async function loadInstructorsSchedule() {
  const dsID = localStorage.getItem("dsID");

  try {
    const response = await fetch(
      `/api/dsportal/getinstructors/${dsID}`
    );

    if (!response.ok) {
      throw new Error("Failed to load instructors");
    }

    const instructors = await response.json();

    const select = document.getElementById("insID");
    if (!select) {
      console.error("Element with ID 'insID' was not found.");
      return;
    }

    select.innerHTML = `
      <option value="">Select Instructor</option>
    `;

    instructors.forEach((instructor) => {
      const option = document.createElement("option");

      option.value = instructor.insID;

      option.textContent = `${instructor.insID} - ${instructor.fName} ${instructor.lName}`;

      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading instructors:", error);
  }
}
