const dsID = localStorage.getItem("dsID");
window.addEventListener("load", () => {
  localStorage.removeItem("editStudent");

  const savedPage = localStorage.getItem("page");
  const savedMenu = localStorage.getItem("menu");

  if (savedPage && savedMenu) {
    loadPage(savedPage, savedMenu, false);
  } else {
    loadPage("Dashboard.html", "dashboard", false);
  }
});

function loadPage(page, menu, addHistory = true) {
  fetch("pages/" + page + "?v=" + Date.now())
    .then((res) => res.text())
    .then((html) => {
      const container = document.getElementById("contentArea");
      if (!container) return;

      container.innerHTML = html;

      container.scrollTop = 0;
      window.scrollTo(0, 0);

      setActive(menu);

      localStorage.setItem("page", page);
      localStorage.setItem("menu", menu);

      if (page !== "UpdateStudent.html") {
        localStorage.removeItem("editStudent");
      }

      if (addHistory) {
        history.pushState({ page, menu }, "", "#" + page);
      }

      initPage(page);
    });
}

window.addEventListener("popstate", (event) => {
  if (event.state) {
    loadPage(event.state.page, event.state.menu, false);
  }
});
function initPage(page) {
  if (page === "Dashboard.html") {
    loadDashboardData();
    loadSchedule();
    setGreeting();
  }
  if (page == "DisplaySchedule.html") {
    loadCompleteSchedule();
  }
  if (page == "DisplayStudents.html") {
    loadStudents();
    showStudentToast();
    initStudentSearch();
  }
  if (page == "DisplayInstructors.html") {
    loadInstructors();
    showInstructorToast();
  }
  if (page == "DisplayVehicles.html") {
    loadVehicles();
    showVehicleToast();
  }
  if (page == "DisplayPayments.html") {
    loadPayments();
    loadPaymentSummary();
  }
  if (page == "DisplayProfile.html") {
    loadSchoolProfile();
    showSchoolToast();
  }

  if (page == "BookLesson.html") {
    initAddLessonForm();
    loadStudentsSchedule();
  }
  if (page === "UpdateStudent.html") {
    initAddStudentForm();
  }
  if (page === "AddInstructor.html") {
    initAddInstructorForm();
  }
  if (page == "AddVehicle.html") {
    initVehicleForm();
  }
  if (page == "AddPayment.html") {
    initPaymentForm();
  }
  if (page == "Editprofile.html") {
    initEditSchoolProfileForm();
    initPackageButtons();
  }
}

function setActive(menu) {
  document.querySelectorAll(".sidebar-link").forEach((link) => {
    link.classList.remove("active");
  });

  const activeLink = document.querySelector(`[onclick*="${menu}"]`);

  if (activeLink) {
    activeLink.classList.add("active");
  }
}

async function loadDrivingSchool() {
  const response = await fetch(`/api/dsportal/${dsID}`);

  const drivingschool = await response.json();

  document.getElementById("manageName").innerHTML = drivingschool.manager;

  document.getElementById("sidebarAvatar").innerHTML =
    drivingschool.manager.charAt(0);

  document.getElementById("dsName").innerHTML = drivingschool.schoolName;

  document.getElementById("dsID").innerHTML = "ID: DS-000" + drivingschool.dsID;
}

loadDrivingSchool();
