window.addEventListener("load", () => {
  loadPage("Dashboard.html", "dashboard", false);
});

function loadPage(page, menu, addHistory = true) {
  fetch("pages/" + page + "?v=" + Date.now())
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to load " + page);
      }

      return res.text();
    })
    .then((html) => {
      const container = document.getElementById("contentArea");

      if (!container) {
        console.error("contentArea not found");
        return;
      }

      container.innerHTML = html;
      container.scrollTop = 0;
      window.scrollTo(0, 0);

      setActive(menu);
      if (addHistory) {
        history.pushState(
          {
            page: page,
            menu: menu,
          },
          "",
          "#" + page
        );
      }

      initPage(page);
    })
    .catch((error) => {
      console.error("Error loading page:", error);

      const contentArea = document.getElementById("contentArea");

      if (contentArea) {
        contentArea.innerHTML = `
          <div class="alert alert-danger m-3">
            Failed to load page.
          </div>
        `;
      }
    });
}

window.addEventListener("popstate", (event) => {
  if (event.state) {
    loadPage(event.state.page, event.state.menu, false);
  }
});

async function initPage(page) {
  if (page === "Dashboard.html") {
    setGreeting();
    loadDashboardData();
    loadUpcomingLessons();
  }

  if (page === "BookLesson.html") {
    await initBooking();
  }

  if (page === "MyLessons.html") {
    loadStudentLessons2();
  }

  if (page === "Profile.html") {
    loadprofile();
  }
}

function setActive(menu) {
  document.querySelectorAll(".nl").forEach((link) => {
    link.classList.remove("active");
  });

  const activeLink = document.querySelector(`[onclick*="'${menu}'"]`);
  if (activeLink) {
    activeLink.classList.add("active");
  }
}

async function loadDrivingSchool() {
  const stuID = localStorage.getItem("stuID");
  const response = await fetch(`/api/stuportal/student/${stuID}`);

  const student = await response.json();

  document.getElementById("stuName").innerHTML =
    student.user.fName + " " + student.user.lName;

  document.getElementById("sidebarAvatar").innerHTML =
    student.user.fName.charAt(0) + student.user.lName.charAt(0);

  document.getElementById("dsName").innerHTML =
    student.drivingSchool.schoolName;

  document.getElementById("stuID").textContent =
    "ID: STU-" + String(student.stuID).padStart(4, "0");
}
loadDrivingSchool();
