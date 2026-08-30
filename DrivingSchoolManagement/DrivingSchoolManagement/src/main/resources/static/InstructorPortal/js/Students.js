let students = [];

async function loadStudents() {
  const tbody = document.getElementById("studentTableBody");

  const response = await fetch(
    `/api/insportal/studenttable/${insID}`
  );

  students = await response.json();

  let rows = ""; // <-- add this

  students.forEach((student) => {
    const progress = Math.round(
      (student.attendance / student.courses.totalSessions) * 100
    );

    let progressClass = "";

    if (progress <= 24) {
      progressClass = "bg-danger";
    } else if (progress <= 49) {
      progressClass = "bg-warning";
    } else {
      progressClass = "bg-success";
    }

    const phone = student.user.phoneNo.replace(
      /(\d{3})(\d{3})(\d{4})/,
      "$1 $2 $3"
    );

    function getStatusBadge(status) {
      if (status === "Training") {
        return "badge-training";
      } else if (status === "TestReady") {
        return "badge-test";
      } else if (status === "OnHold") {
        return "badge-hold";
      } else if (status === "Completed") {
        return "badge-complete";
      } else {
        return "";
      }
    }

    function formatStatus(status) {
      if (status === "OnHold") {
        return "On Hold";
      }

      if (status === "TestReady") {
        return "Test Ready";
      }

      return status;
    }

    rows += `
        <tr>
            <td>
                <div class="d-flex align-items-center">
                    <div class="student-avatar bg-primary me-2">
                        ${student.user.fName.charAt(
                          0
                        )}${student.user.lName.charAt(0)}
                    </div>

                    <div>
                        <strong>${student.user.fName} ${
      student.user.lName
    }</strong><br>
                        <small class="text-muted">
                            STU-00${student.stuID}
                        </small>
                    </div>
                </div>
            </td>
            <td>${phone}</td>
            <td> ${student.courses.name} (${
      student.courses.totalSessions
    } Lessons)</td>
            <td>
                            <div class="progress" style="height:8px;">
                                <div class="progress-bar ${progressClass}" style="width:${progress}%"></div>
                            </div>
                            <small>${student.attendance} / ${
      student.courses.totalSessions
    } Completed</small>
            </td>
            <td><span class="badge rounded-pill ${getStatusBadge(
              student.status
            )}">${formatStatus(student.status)}</span></td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary me-1" onclick="viewStudent(${
                              student.stuID
                            })">
                              <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-warning me-1" onclick="openStatusModal(${
                              student.stuID
                            })" data-bs-toggle="modal"
                                data-bs-target="#changeStatusModal">
                                <i class="bi bi-pencil"></i> Update Status
                            </button>
            </td>            
        </tr>
    `;
  });
  document.getElementById("studentTableBody").innerHTML = rows;
}

document.addEventListener("click", function (e) {
  // check if Save button was clicked
  if (e.target.closest("#saveStatusBtn")) {
    const modalEl = document.getElementById("changeStatusModal");
    const modal = bootstrap.Modal.getInstance(modalEl);

    if (modal) modal.hide();

    const toastEl = document.getElementById("statusToast");

    if (toastEl) {
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  }
});

window.viewStudent = async function (id) {
  const s = students.find((student) => student.stuID == id);

  if (!s) {
    alert("Student not found");
    return;
  }

  const licenseResponse = await fetch(
    "/api/licenseType/license/" + s.user.login.loginID
  );

  const licenses = await licenseResponse.json();

  document.getElementById("m_licenseType").value = licenses
    .map((l) => l.licenseType)
    .join(", ");

  document.getElementById("m_firstName").value = s.user.fName;
  document.getElementById("m_lastName").value = s.user.lName;
  document.getElementById("m_email").value = s.user.login.email;
  document.getElementById("m_phone").value = s.user.phoneNo;
  document.getElementById("m_dob").value = s.user.dob;
  document.getElementById("m_gender").value = s.user.gender;
  document.getElementById("m_street").value = s.user.street;
  document.getElementById("m_city").value = s.user.city;
  document.getElementById("m_state").value = s.user.state;
  document.getElementById("m_zip").value = s.user.code;
  document.getElementById("m_transmission").value = s.user.transPrefer;
  const experienceMap = {
    C_Beginner: "Beginner",
    S_Experience: "Some Experience",
    Intermediate: "Intermediate",
    Advanced: "Advanced",
  };
  document.getElementById("m_experience").value =
    experienceMap[s.user.driveExp] || "";
  document.getElementById("m_lessonTime").value = s.user.pref_time;
  document.getElementById("m_notes").value = s.user.notes;

  const modalEl = document.getElementById("studentModal");

  const modal = new bootstrap.Modal(modalEl);
  modal.show();
};

let selectedStudentID = null;

window.openStatusModal = function (id) {
  selectedStudentID = id;

};

document.addEventListener("click", async function (e) {
  if (!e.target.closest("#saveStatusBtn")) {
    return;
  }

  const status = document.getElementById("status").value;
  const response = await fetch(
    "http://localhost:8080/api/student/status/" + selectedStudentID,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: status,
      }),
    }
  );

  location.reload();
});

document.addEventListener("input", function (e) {
  if (e.target.id === "studentSearch") {
    const searchValue = e.target.value.toLowerCase().trim();

    const rows = document.querySelectorAll("#studentTableBody tr");

    rows.forEach((row) => {
      const rowText = row.innerText.toLowerCase();

      if (rowText.includes(searchValue)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  }
});
