const insID = localStorage.getItem("insID");

function loadPage(page, menu) {
  sessionStorage.setItem("page", page);
  sessionStorage.setItem("menu", menu);

  fetch("pages/" + page)
    .then((res) => res.text())
    .then((html) => {
      console.log(page);
      document.getElementById("contentArea").innerHTML = html;

      document
        .querySelectorAll(".sidebar-link")
        .forEach((link) => link.classList.remove("active"));

      const activeLink = document.querySelector(`[data-menu="${menu}"]`);
      if (activeLink) activeLink.classList.add("active");

      if (page === "InstructorDashboard.html") {
        loadDashboardData();
        loadScheduledashboard();
        loadVehicle();
        setGreeting();
      }

      if (page === "Students.html") {
        loadStudents();
      }

      if (page === "ViewAttendance.html") {
        setAttendanceDate();
        loadAttendance();
      }

      if (page === "DisplaySchedule.html") {
        loadScheduleDate();
        loadSchedule();
      }
    });
}
window.addEventListener("load", () => {
  const savedMenu = sessionStorage.getItem("menu");
  const savedPage = sessionStorage.getItem("page");

  if (savedPage && savedMenu) {
    loadPage(savedPage, savedMenu);
  } else {
    loadPage("InstructorDashboard.html", "dashboard");
  }
});

async function loadInstructor() {
  const response = await fetch(`http://localhost:8080/api/insportal/${insID}`);

  const instructor = await response.json();

  document.getElementById("instrName").innerHTML =
    instructor.fName + " " + instructor.lName;

  document.getElementById("sidebarAvatar").innerHTML =
    instructor.fName.charAt(0) + instructor.lName.charAt(0);

  document.getElementById("instrid").innerHTML =
    "ID: INS-00" + instructor.insID;

  document.getElementById("instrSchool").innerHTML =
    instructor.drivingSchool.schoolName;
}

loadInstructor();
