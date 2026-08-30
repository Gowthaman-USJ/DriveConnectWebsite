let stuAttendance = [];

async function loadAttendance() {
  const tbody = document.getElementById("AttendanceTableBody");

  const response = await fetch(
    `/api/insportal/scheduletable/${insID}`
  );

  stuAttendance = await response.json();
  const today = new Date().toISOString().split("T")[0];

  stuAttendance = stuAttendance.filter((schedule) => schedule.date === today);
  let rows = "";

  stuAttendance.forEach((schedule) => {
    const phone = schedule.student.user.phoneNo.replace(
      /(\d{3})(\d{3})(\d{4})/,
      "$1 $2 $3"
    );

    function formatTime(time) {
      let [hour, minute] = time.split(":");

      hour = parseInt(hour);

      let ampm = hour >= 12 ? "PM" : "AM";

      hour = hour % 12 || 12;

      return `${hour}:${minute} ${ampm}`;
    }

    function addOneHour(time) {
      let date = new Date(`2000-01-01T${time}`);

      date.setHours(date.getHours() + 1);

      let hour = String(date.getHours()).padStart(2, "0");
      let minute = String(date.getMinutes()).padStart(2, "0");

      return `${hour}:${minute}:00`;
    }
    const lesson = schedule.student.attendance;

    function getAttendanceBadge(attendance) {
      if (attendance === "Present") {
        return "badge-present";
      } else if (attendance === "Absent") {
        return "badge-absent";
      } else if (attendance === "Pending") {
        return "badge-pending";
      } else {
        return "";
      }
    }

    rows += `
            <tr>
                <td>
                     <div class="student-cell">
                        <div class="s-avatar" style="background:#0d6efd;">${schedule.student.user.fName.charAt(
                          0
                        )}${schedule.student.user.lName.charAt(0)}</div>
                             <div>
                                 <div class="s-name">${
                                   schedule.student.user.fName
                                 } ${schedule.student.user.lName}</div>
                                 <div class="s-phone">${phone}</div>
                             </div>
                        </div>
                </td>
                <td><b> ${formatTime(schedule.time)} - ${formatTime(
      addOneHour(schedule.time)
    )}</b></td>
                
                <td>Lesson #${schedule.lessonNumber}</td>
                <td>${schedule.student.courses.name} (${
      schedule.student.courses.totalSessions
    })</td>
                <td>
                    <span class="badge badge ${getAttendanceBadge(
                      schedule.attendance
                    )}"> ${schedule.attendance}</span>
                </td>
                <td>
                    <div class="d-flex gap-1">
                        <button class="att-btn" onclick="markAtt(${
                          schedule.lessonID
                        }, 'Present')">
                            <i class="bi bi-check-lg"></i> Present </button>

                        <button class="att-btn" onclick="markAtt(${
                          schedule.lessonID
                        }, 'Absent')">
                            <i class="bi bi-x-lg"></i> Absent </button>
                    </div>
                </td>
            </tr>
     `;
  });
  document.getElementById("AttendanceTableBody").innerHTML = rows;
}

function setAttendanceDate() {
  const today = new Date();

  const options = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };

  document.getElementById("attendanceDate").innerHTML =
    today.toLocaleDateString("en-GB", options);
}

async function markAtt(lessonID, attendance) {
  const response = await fetch(
    `/api/insportal/attendance/${lessonID}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        attendance: attendance,
      }),
    }
  );

  if (response.ok) {
    showToast(`Attendance marked as ${attendance}`, "success");

    loadAttendance();
  } else {
    showToast("Failed to update attendance", "danger");
  }
}

function showToast(message, type = "success") {
  const toast = document.getElementById("statusToast");
  const toastBody = document.getElementById("toastBody");

  if (type === "success") {
    toast.className = "toast text-bg-success border-0 compact-toast";
    toastBody.innerHTML = `
            <i class="bi bi-check-circle-fill me-1"></i>
            ${message}
        `;
  } else {
    toast.className = "toast text-bg-danger border-0 compact-toast";
    toastBody.innerHTML = `
            <i class="bi bi-x-circle-fill me-1"></i>
            ${message}
        `;
  }

  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();
}
