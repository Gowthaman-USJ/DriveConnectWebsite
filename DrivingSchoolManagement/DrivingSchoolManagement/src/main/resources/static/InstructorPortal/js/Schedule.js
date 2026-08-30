let schedule = [];

function loadScheduleDate() {
  const dateElement = document.getElementById("todayDate");

  if (dateElement) {
    const today = new Date();

    dateElement.innerHTML = today.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }
}

async function loadSchedule() {
  const response = await fetch(
    `/api/insportal/scheduletable/${insID}`
  );

  schedule = await response.json();

  const today = new Date().toISOString().split("T")[0];
  document.getElementById("dateFilter").value = today;

  filterScheduleByDate();
}

function displaySchedule(scheduleList) {
  let rows = "";

  let totalLessons = scheduleList.length;
  let completed = 0;
  let inProgress = 0;
  let upcoming = 0;

  scheduleList.forEach((displayschedule) => {
    if (displayschedule.status === "Completed") {
      completed++;
    } else if (displayschedule.status === "InProgress") {
      inProgress++;
    } else if (displayschedule.status === "Scheduled") {
      upcoming++;
    }

    rows += `
  <tr>
      <td> ${formatTime(displayschedule.time)}</td>
      <td>STU-00${displayschedule.student.stuID}</td>
      <td>${displayschedule.student.user.fName} ${
      displayschedule.student.user.lName
    }</td>
      <td>${displayschedule.student.courses.name}</td>
      <td>
        <span class="badge ${getStatusBadge(
          displayschedule.status
        )}"> ${formatStatus(displayschedule.status)}</span>
      </td>
      
  </tr>

  `;
  });

  document.getElementById("totalLessons").textContent = totalLessons;
  document.getElementById("completedLessons").textContent = completed;
  document.getElementById("inProgressLessons").textContent = inProgress;
  document.getElementById("upcomingLessons").textContent = upcoming;

  document.getElementById("ScheduleTableBody").innerHTML = rows;

  function formatTime(time) {
    let [hour, minute] = time.split(":");
    hour = parseInt(hour);
    let ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  }

  function getStatusBadge(status) {
    if (status === "Completed") {
      return "badge-completed";
    } else if (status === "InProgress") {
      return "badge-inProgress";
    } else if (status === "Scheduled") {
      return "badge-scheduled";
    } else {
      return "";
    }
  }
  function formatStatus(status) {
    if (status === "InProgress") {
      return "In Progress";
    }

    return status;
  }
  document.getElementById("ScheduleTableBody").innerHTML = rows;
}

function resetDate() {
  const today = new Date().toISOString().split("T")[0];

  document.getElementById("dateFilter").value = today;

  filterScheduleByDate();
}

function filterScheduleByDate() {
  const selectedDate = document.getElementById("dateFilter").value;

  const filteredSchedule = schedule.filter(
    (displayschedule) => displayschedule.date === selectedDate
  );

  displaySchedule(filteredSchedule);
}
