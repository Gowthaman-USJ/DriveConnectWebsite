let students = [];

window.initAddStudentForm = async function () {
  const form = document.getElementById("editStudentForm");
  if (!form) {
    return;
  }
  const editData = JSON.parse(localStorage.getItem("editStudent"));
  const s = editData.student;
  const user = s.user;

  const formTitle = document.getElementById("formTitle");
  const formTitleIcon = document.getElementById("formTitleIcon");
  const submitIcon = document.getElementById("submitIcon");
  const submitText = document.getElementById("submitText");
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const nic = document.getElementById("nic");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const dob = document.getElementById("dob");
  const gender = document.getElementById("gender");
  const street = document.getElementById("street");
  const city = document.getElementById("city");
  const state = document.getElementById("state");
  const zip = document.getElementById("zip");
  const transmission = document.getElementById("transmission");
  const experience = document.getElementById("experience");
  const lessonTime = document.getElementById("lessonTime");
  const notes = document.getElementById("notes");
  const password = document.getElementById("password");
  const motorcycle = document.getElementById("motorcycle");
  const lightVehicle = document.getElementById("lightVehicle");
  const heavyVehicle = document.getElementById("heavyVehicle");

  formTitle.innerText = "Update Student";
  formTitleIcon.className = "bi bi-pencil-square text-primary fs-5";
  submitText.innerText = "Update Student";
  submitIcon.className = "bi bi-pencil-square me-2";

  firstName.value = user.fName || "";
  lastName.value = user.lName || "";
  nic.value = user.nic || "";
  email.value = user.login.email || "";
  phone.value = user.phoneNo || "";
  dob.value = user.dob || "";
  gender.value = user.gender || "";
  street.value = user.street || "";
  city.value = user.city || "";
  state.value = user.state || "";
  zip.value = user.code || "";
  transmission.value = user.transPrefer || "";
  experience.value = user.driveExp || "";
  lessonTime.value = user.pref_time || "";
  notes.value = user.notes || "";
  password.value = "";
  password.placeholder = "Leave blank to keep current password";

  motorcycle.checked = false;
  lightVehicle.checked = false;
  heavyVehicle.checked = false;

  if (user.login?.loginID) {
    const response = await fetch(
      `/api/licenseType/license/${user.login.loginID}`
    );

    if (!response.ok) {
      throw new Error("Failed to load licenses");
    }

    const licenses = await response.json();
    licenses.forEach((license) => {
      if (license.licenseType === "Motorcycle") {
        motorcycle.checked = true;
      }

      if (license.licenseType === "Light Vehicle") {
        lightVehicle.checked = true;
      }

      if (license.licenseType === "Heavy Vehicle") {
        heavyVehicle.checked = true;
      }
    });
  }

  form.onsubmit = async function (e) {
    e.preventDefault();
    const licenseTypes = [];
    if (motorcycle.checked) {
      licenseTypes.push("Motorcycle");
    }
    if (lightVehicle.checked) {
      licenseTypes.push("Light Vehicle");
    }
    if (heavyVehicle.checked) {
      licenseTypes.push("Heavy Vehicle");
    }
    const student = {
      fName: firstName.value.trim(),
      lName: lastName.value.trim(),
      nic: nic.value.trim(),
      email: email.value.trim(),
      phoneNo: phone.value.trim(),
      dob: dob.value,
      gender: gender.value,
      street: street.value.trim(),
      city: city.value.trim(),
      state: state.value.trim(),
      code: zip.value.trim(),
      driveExp: experience.value,
      transPrefer: transmission.value,
      pref_time: lessonTime.value,
      notes: notes.value,
      licenseTypes: licenseTypes,
      password: password.value,
    };

    const url = `/api/dsportal/updatestudent/${s.stuID}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Update failed:", errorText);
      alert(`Update failed: ${response.status}\n${errorText}`);
      return;
    }

    localStorage.removeItem("editStudent");
    localStorage.setItem("toastMessage", "Student updated successfully!");
    loadPage("DisplayStudents.html", "students");
  };
};
window.editStudent = function (id) {
  const student = students.find((s) => Number(s.stuID) === Number(id));

  if (!student) {
    console.error("Student not found:", id);
    return;
  }

  localStorage.setItem(
    "editStudent",
    JSON.stringify({
      student: student,
    })
  );

  loadPage("UpdateStudent.html", "students");
};
function showStudentToast() {
  const message = localStorage.getItem("toastMessage");

  if (!message) return;

  const toastEl = document.getElementById("studentToast");
  const messageEl = document.getElementById("studentToastMessage");

  if (!toastEl || !messageEl) return;

  messageEl.textContent = message;

  const toast = new bootstrap.Toast(toastEl, {
    delay: 3000,
  });

  toast.show();

  localStorage.removeItem("toastMessage");
}
function formatExperience(exp) {
  switch (exp) {
    case "C_Beginner":
      return "Beginner";

    case "S_Experience":
      return "Experienced";

    case "Intermediate":
      return "Intermediate";

    case "Advanced":
      return "Advanced";

    default:
      return exp || "";
  }
}

function formatLessonTime(time) {
  switch (time) {
    case "AnyTime":
      return "Any Time";

    case "Mrng":
      return "Morning";

    case "Afternoon":
      return "Afternoon";

    case "Evening":
      return "Evening";

    case "Weekends":
      return "Weekends";

    default:
      return time || "";
  }
}
window.viewStudent = async function (id) {
  const s = students.find((student) => Number(student.stuID) === Number(id));

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

  document.getElementById("m_stuID").value = s.stuID;
  document.getElementById("m_firstName").value = s.user.fName;
  document.getElementById("m_lastName").value = s.user.lName;
  document.getElementById("m_email").value = s.user.login.email;
  document.getElementById("m_phone").value = s.user.phoneNo.replace(
    /(\d{3})(\d{3})(\d{4})/,
    "$1 $2 $3"
  );
  document.getElementById("m_dob").value = s.user.dob;
  document.getElementById("m_gender").value = s.user.gender;
  document.getElementById("m_street").value = s.user.street;
  document.getElementById("m_city").value = s.user.city;
  document.getElementById("m_state").value = s.user.state;
  document.getElementById("m_zip").value = s.user.code;
  document.getElementById("m_transmission").value = s.user.transPrefer;
  document.getElementById("m_experience").value = formatExperience(
    s.user.driveExp
  );
  document.getElementById("m_lessonTime").value = formatLessonTime(
    s.user.pref_time
  );
  document.getElementById("m_notes").value = s.user.notes;

  const modalEl = document.getElementById("studentModal");

  const modal = new bootstrap.Modal(modalEl);
  modal.show();
};

let selectedStudentRow = null;
let selectedStudentId = null;

window.deleteStudent = function (button, id) {
  selectedStudentRow = button.closest("tr");
  selectedStudentId = id;

  const modal = new bootstrap.Modal(
    document.getElementById("deleteStudentModal")
  );

  modal.show();
};

window.confirmDeleteStudent = async function () {
  if (!selectedStudentId) {
    return;
  }

  try {
    const response = await fetch(
      `/api/dsportal/deletestudent/${selectedStudentId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      alert("Failed to delete student");
      return;
    }

    if (selectedStudentRow) {
      selectedStudentRow.remove();
    }

    const modalEl = document.getElementById("deleteStudentModal");
    const modalInstance = bootstrap.Modal.getInstance(modalEl);

    if (modalInstance) {
      modalInstance.hide();
    }

    const toastEl = document.getElementById("deleteToast");

    if (toastEl) {
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }

    selectedStudentRow = null;
    selectedStudentId = null;
  } catch (error) {
    console.error("Delete error:", error);
    alert("Server error");
  }
};

async function loadInstructorDropdown() {
  const dsID = localStorage.getItem("dsID");

  const response = await fetch(
    `/api/dsportal/getinstructors/${dsID}`
  );

  const instructors = await response.json();

  const select = document.getElementById("instructorSelect");

  select.innerHTML = `
        <option value="0">
            No Instructor
        </option>
    `;

  instructors.forEach((instructor) => {
    select.innerHTML += `
            <option value="${instructor.insID}">
                ${instructor.fName} ${instructor.lName}
            </option>
        `;
  });
}

window.assignInstructor = async function (button, id) {
  selectedStudentId = id;

  await loadInstructorDropdown();

  const modalEl = document.getElementById("assignInstructorModal");

  if (!modalEl) return;

  const modal = new bootstrap.Modal(modalEl);

  modal.show();
};

window.confirmAssignInstructor = async function () {
  const instructorID = document.getElementById("instructorSelect").value;

  const data = {
    insID: instructorID === "0" ? null : Number(instructorID),
  };
  const response = await fetch(
    `/api/dsportal/assignInstructor/${selectedStudentId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    alert("Failed to assign instructor");
    return;
  }
  const modalEl = document.getElementById("assignInstructorModal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) {
    modal.hide();
  }

  const toastEl = document.getElementById("assignToast");
  if (toastEl) {
    const toast = new bootstrap.Toast(toastEl);

    toast.show();
  }
  students = [];

  await loadStudents();
};
window.initStudentSearch = function () {
  const studentSearch = document.getElementById("studentSearch");

  if (!studentSearch) {
    return;
  }

  studentSearch.addEventListener("input", function () {
    const searchText = this.value.toLowerCase().trim();

    const rows = document.querySelectorAll("#studentTableBody tr");

    rows.forEach((row) => {
      const studentName = row.cells[0]?.innerText.toLowerCase() || "";

      const instructorName = row.cells[1]?.innerText.toLowerCase() || "";

      const phone = row.cells[2]?.innerText.toLowerCase() || "";

      if (
        studentName.includes(searchText) ||
        instructorName.includes(searchText) ||
        phone.includes(searchText)
      ) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  });
};
async function loadStudents() {
  const dsID = localStorage.getItem("dsID");

  const response = await fetch(
    `/api/dsportal/studenttable/${dsID}`
  );

  students = await response.json();

  const tbody = document.getElementById("studentTableBody");

  tbody.innerHTML = "";

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

    function formatStatus(status) {
      if (status === "OnHold") {
        return "On Hold";
      }

      if (status === "TestReady") {
        return "Test Ready";
      }

      return status;
    }

    tbody.innerHTML += `
        <tr>
            <td>
                <div class="d-flex align-items-center gap-2">
                    <div class="student-avatar bg-primary">
                        ${student.user.fName.charAt(
                          0
                        )}${student.user.lName.charAt(0)}
                    </div>

                    <div>
                        <div class="fw-semibold">
                            ${student.user.fName} ${student.user.lName}
                        </div>

                        <small class="text-muted">
                            ID: STU-${String(student.stuID).padStart(3, "0")}
                        </small>
                    </div>
                </div>
            </td>

            <td>
    <div>
        <div class="fw-semibold">
            ${student.instructor ? (student.instructor.fName+ " " +student.instructor.lName) : "No Instructor"}
        </div>

        <small class="text-muted">
            ${
              student.instructor
                ? "ID: INS-" + String(student.instructor.insID).padStart(3, "0")
                : "Not Assigned"
            }
        </small>
    </div>
</td>

            <td>
                ${phone}
            </td>

            <td style="width:180px;">
                <div class="progress" style="height:6px;">
                    <div class="progress-bar ${progressClass}" style="width:${progress}%"></div>
                            </div>
                            <small>${student.attendance} / ${
      student.courses.totalSessions
    } Completed</small>
            </td>
                </div>
            </td>

            <td>
                <span class="status ${student.status.toLowerCase()}">
        ${formatStatus(student.status)}
    </span>
            </td>

            <td>

                <button class="btn btn-sm btn-outline-primary me-1"
                    onclick="viewStudent(${student.stuID})">
                    <i class="bi bi-eye"></i>
                </button>


                <button class="btn btn-sm btn-outline-warning me-1"
                    onclick="editStudent(${student.stuID})">
                    <i class="bi bi-pencil"></i>
                </button>


                <button class="btn btn-sm btn-outline-danger me-1"
                    onclick="deleteStudent(this,${student.stuID})">
                    <i class="bi bi-trash"></i>
                </button>


               <button type="button" class="btn btn-sm btn-outline-secondary"
                       onclick="assignInstructor(this, ${
                         student.stuID
                       })"><i class="bi bi-person-fill"></i>
               </button>
               
            </td>
        </tr>
        `;
  });
}
