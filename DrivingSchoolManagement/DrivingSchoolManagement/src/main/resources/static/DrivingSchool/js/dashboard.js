async function loadDashboardData() {
  const dsID = localStorage.getItem("dsID");
  const drivingschoolResponse = await fetch(
    `/api/dsportal/${dsID}`
  );

  const drivingschool = await drivingschoolResponse.json();

  document.getElementById("topbarAvatar").innerHTML =
    drivingschool.manager.charAt(0);

  document.getElementById("managename").innerHTML = drivingschool.manager;

  const studentResponse = await fetch(
    `/api/dsportal/students/${dsID}`
  );

  const stucount = await studentResponse.json();

  document.getElementById("students").innerHTML = "0" + stucount;

  const instructorResponse = await fetch(
    `/api/dsportal/instructors/${dsID}`
  );

  const inscount = await instructorResponse.json();

  document.getElementById("instructors").innerHTML = "0" + inscount;

  const lessonResponse = await fetch(
    `/api/dsportal/today-lessons/${dsID}`
  );

  const count = await lessonResponse.json();

  document.getElementById("todayLessons").innerHTML = "0" + count;

  const vehicleResponse = await fetch(
    `/api/dsportal/vehicles/${dsID}`
  );

  const vehcount = await vehicleResponse.json();
  document.getElementById("vehicles").innerHTML = "0" + vehcount;
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

async function loadSchedule() {
  const dsID = localStorage.getItem("dsID");

  const response = await fetch(
    `/api/dsportal/scheduletable/${dsID}`
  );

  const schedules = await response.json();

  const today = new Date().toISOString().split("T")[0];

  const todaySchedules = schedules.filter(
    (schedule) => schedule.date === today
  );

  const tbody = document.getElementById("scheduleTableBody");

  tbody.innerHTML = "";

  todaySchedules.forEach((schedule) => {
    tbody.innerHTML += `
            <tr>
                <td><strong>${formatTime(schedule.time)}</strong></td>

                <td>
                        <div>
                            <div class="fw-medium">${
                              schedule.student.user.fName
                            } ${schedule.student.user.lName}</div>
                            <small class="text-muted">${
                              schedule.student.user.transPrefer
                            }</small>
                        </div>
                    </div>
                </td>

                <td>${schedule.instructor.fName} ${
      schedule.instructor.lName
    }</td>

                <td>${schedule.student.courses.name}</td>

                <td>
                    <span class="status-badge ${schedule.status.toLowerCase()}">
                        ${
                          schedule.status.toLowerCase() === "inprogress"
                            ? "In Progress"
                            : schedule.status
                        }
                    </span>
                </td>
            </tr>
        `;
  });
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
