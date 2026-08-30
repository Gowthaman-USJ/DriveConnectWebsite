let instructors = [];

async function initAddInstructorForm() {
  const form = document.getElementById("addInstructorForm");
  if (!form) return;

  const formTitle = document.getElementById("formTitle");
  const formTitleIcon = document.getElementById("formTitleIcon");

  const submitIcon = document.getElementById("submitIcon");
  const submitText = document.getElementById("submitText");

  const fname = document.getElementById("fname");
  const lname = document.getElementById("lname");
  const phone = document.getElementById("phone");
  const nic = document.getElementById("nic");
  const dob = document.getElementById("dob");
  const gender = document.getElementById("gender");
  const address = document.getElementById("address");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const experience = document.getElementById("experience");
  const availability = document.getElementById("availability");

  const motorcycle = document.getElementById("motorcycle");
  const lightVehicle = document.getElementById("lightVehicle");
  const heavyVehicle = document.getElementById("heavyVehicle");

  const editData = JSON.parse(localStorage.getItem("editInstructor"));

  form.reset();
  formTitle.innerText = "Add Instructor";
  formTitleIcon.className = "bi bi-person-badge text-primary fs-5";
  submitText.innerText = "Add Instructor";
  submitIcon.className = "bi bi-person-plus me-2";

  motorcycle.checked = false;
  lightVehicle.checked = false;
  heavyVehicle.checked = false;

  if (editData && editData.instructor) {
    const i = editData.instructor;

    fname.value = i.fName || "";
    lname.value = i.lName || "";
    phone.value = i.phoneNo || "";
    nic.value = i.nic || "";
    dob.value = i.dob || "";
    gender.value = i.gender || "";
    address.value = i.address || "";
    email.value = i.login.email || "";
    experience.value = i.drive_Exp || "";
    availability.value = i.availability || "";
    password.value = i.login.password || "";

    const licenseResponse = await fetch(
      `/api/licenseType/license/${i.login.loginID}`
    );

    const licenses = await licenseResponse.json();
    const licenseTypes = licenses.map((license) => license.licenseType);

    motorcycle.checked = licenseTypes.includes("Motorcycle");
    lightVehicle.checked = licenseTypes.includes("Light Vehicle");
    heavyVehicle.checked = licenseTypes.includes("Heavy Vehicle");

    formTitle.innerText = "Update Instructor";
    formTitleIcon.className = "bi bi-pencil-square text-primary fs-5";
    submitText.innerText = "Update Instructor";
    submitIcon.className = "bi bi-pencil-square me-2";
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
    const instructor = {
      fName: fname.value.trim(),
      lName: lname.value.trim(),
      nic: nic.value.trim(),
      email: email.value.trim(),
      password: password.value,
      phoneNo: phone.value.trim(),
      dob: dob.value,
      gender: gender.value,
      address: address.value.trim(),
      licenseTypes: licenseTypes,
      drive_Exp: Number(experience.value),
      availability: availability.value,
      status: "Available",
    };
    let response;

    if (editData && editData.instructor) {
      const insID = editData.instructor.insID;
      if (!insID) {
        alert("Instructor ID is missing!");
        return;
      }

      response = await fetch(
        `/api/dsportal/updateinstructor/${insID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(instructor),
        }
      );
    } else {
      const dsID = localStorage.getItem("dsID");

      response = await fetch(
        `/api/dsportal/addinstructor/${dsID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(instructor),
        }
      );
    }
    if (!response.ok) {
      const errorText = await response.text();

      console.error("Backend Error:", response.status, errorText);

      alert(
        "Failed to save instructor.\n" +
          "Status: " +
          response.status +
          "\n" +
          errorText
      );

      return;
    }
    const result = await response.text();
    localStorage.removeItem("editInstructor");

    localStorage.setItem(
      "toastMessage",

      editData && editData.instructor
        ? "Instructor updated successfully!"
        : "Instructor added successfully!"
    );

    loadPage("DisplayInstructors.html", "instructors");
  };
}
function showInstructorToast() {
  const message = localStorage.getItem("toastMessage");

  if (!message) return;

  const toastEl = document.getElementById("instructorToast");
  const messageEl = document.getElementById("instructorToastMessage");

  if (!toastEl || !messageEl) return;

  messageEl.textContent = message;

  const toast = new bootstrap.Toast(toastEl, {
    delay: 3000,
  });

  toast.show();

  localStorage.removeItem("toastMessage");
  localStorage.removeItem("toastType");
}

function formatAvailability(availability) {
  if (availability === "FullTime") {
    return "Full Time";
  }

  if (availability === "Part Time") {
    return "Part Time";
  }

  return availability;
}

window.viewInstructor = async function (id) {
  const i = instructors.find(
    (instructor) => Number(instructor.insID) === Number(id)
  );

  if (!i) {
    alert("Instructor not found");
    return;
  }
  const loginID = i.login?.loginID;

  const licenseResponse = await fetch(
    `/api/licenseType/license/${loginID}`
  );

  const licenses = await licenseResponse.json();

  document.getElementById("m_licenseType").value = licenses
    .map((l) => l.licenseType)
    .join(", ");

  document.getElementById("m_Fname").value = i.fName || "";
  document.getElementById("m_Lname").value = i.lName || "";
  document.getElementById("m_insID").value = i.insID || "";
  document.getElementById("m_nic").value = i.nic || "";
  document.getElementById("m_email").value = i.login.email || "";
  document.getElementById("m_password").value = "*************";
  document.getElementById("m_phone").value = i.phoneNo.replace(
    /(\d{3})(\d{3})(\d{4})/,
    "$1 $2 $3"
  );
  document.getElementById("m_dob").value = i.dob || "";
  document.getElementById("m_gender").value = i.gender || "";
  document.getElementById("m_address").value = i.address || "";
  document.getElementById("m_experience").value = i.drive_Exp || "";
  document.getElementById("m_availability").value = formatAvailability(
    i.availability
  );

  new bootstrap.Modal(document.getElementById("instructorModal")).show();
};

function openAddInstructor() {
  localStorage.removeItem("editInstructor");
  loadPage("AddInstructor.html", "instructors");
}

window.editInstructor = function (insID) {
  const instructor = instructors.find((i) => Number(i.insID) === Number(insID));

  if (!instructor) {
    alert("Instructor not found. ID: " + insID);
    return;
  }

  localStorage.setItem(
    "editInstructor",
    JSON.stringify({
      instructor: instructor,
    })
  );

  loadPage("AddInstructor.html", "instructors");
};

let selectedInstructorRow = null;
let selectedInstructorId = null;

window.deleteInstructor = function (button, id) {
  selectedInstructorRow = button.closest("tr");
  selectedInstructorId = id;

  const modalEl = document.getElementById("deleteInstructorModal");

  if (!modalEl) return;

  const modal = new bootstrap.Modal(modalEl);
  modal.show();
};

window.confirmDeleteInstructor = async function () {
  if (!selectedInstructorId) return;

  try {
    const response = await fetch(
      `/api/dsportal/deleteInstructor/${selectedInstructorId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete instructor");
    }
    if (selectedInstructorRow) {
      selectedInstructorRow.remove();
    }

    const modalEl = document.getElementById("deleteInstructorModal");

    const modalInstance = bootstrap.Modal.getInstance(modalEl);

    if (modalInstance) {
      modalInstance.hide();
    }

    const toastEl = document.getElementById("deleteToast");

    if (toastEl) {
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }

    selectedInstructorRow = null;
    selectedInstructorId = null;
  } catch (error) {
    console.error("Delete error:", error);

    alert("Unable to delete instructor");
  }
};

window.assignVehicle = function (button, insID) {
  const modalEl = document.getElementById("assignVehicleModal");

  if (!modalEl) return;
  modalEl.dataset.insId = insID;
  window.loadVehiclesDropdown();

  const modal = new bootstrap.Modal(modalEl);

  modal.show();
};
window.loadVehiclesDropdown = async function () {
  const dsID = localStorage.getItem("dsID");

  const select = document.getElementById("vehicleSelect");

  if (!select) return;

  const response = await fetch(
    `/api/dsportal/getvehicle/${dsID}`
  );

  if (!response.ok) {
    console.error("Failed to load vehicles");
    return;
  }

  const vehicles = await response.json();

  select.innerHTML = `
        <option value="" disabled selected>
            Choose vehicle
        </option>
    `;

  vehicles.forEach((vehicle) => {
    const option = document.createElement("option");

    option.value = vehicle.vehID;

    option.textContent = `${vehicle.brand} ${vehicle.model} - ${vehicle.vehNo}`;

    select.appendChild(option);
  });
};

window.confirmAssignVehicle = async function () {
  const vehicleID = document.getElementById("vehicleSelect").value;
  const modalEl = document.getElementById("assignVehicleModal");

  const insID = modalEl.dataset.insId;
  if (!vehicleID) {
    alert("Please select a vehicle!");
    return;
  }

  if (!insID) {
    alert("No instructor selected!");
    return;
  }

  const response = await fetch(
    `/api/dsportal/assignVehicle/${insID}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vehicleID: Number(vehicleID),
      }),
    }
  );

  if (!response.ok) {
    alert("Failed to assign vehicle!");
    return;
  }
  const modal = bootstrap.Modal.getInstance(modalEl);

  if (modal) {
    modal.hide();
  }
  const toastEl = document.getElementById("assignToast");

  if (toastEl) {
    new bootstrap.Toast(toastEl).show();
  }
};

async function loadInstructors() {
  const dsID = localStorage.getItem("dsID");

  const response = await fetch(
    `/api/dsportal/getinstructors/${dsID}`
  );

  instructors = await response.json();
  const tbody = document.getElementById("instructorTableBody");
  tbody.innerHTML = "";

  if (instructors.length === 0) {
    tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">
                        No instructors found
                    </td>
                </tr>
            `;
    return;
  }

  instructors.forEach((instructor) => {
    const phone = instructor.phoneNo.replace(
      /(\d{3})(\d{3})(\d{4})/,
      "$1 $2 $3"
    );

    function formatAvailability(availability) {
      if (availability === "FullTime") {
        return "Full Time";
      }

      if (availability === "Part Time") {
        return "Part Time";
      }

      return availability;
    }

    const row = `
                <tr>
                    <td>
                    <div class="d-flex align-items-center gap-2">
                            <div class="student-avatar bg-primary">
                                ${instructor.fName.charAt(
                                  0
                                )}${instructor.lName.charAt(0)}
                            </div>
                            <div>
                              <div class="fw-semibold">${instructor.fName} ${
      instructor.lName
    }</div>
                              <small class="text-muted">
                               ID: INS-${String(instructor.insID).padStart(
                                 3,
                                 "0"
                               )}
                              </small>
                            </div>
                    </div>
                    </td>

                    <td>
                  <div>
                <div class="fw-semibold">
            ${instructor.vehicle ? instructor.vehicle.vehNo : "Not Assigned"}
        </div>

        <small class="text-muted">
            ${
              instructor.vehicle
                ? "ID: Veh-" + String(instructor.vehicle.vehID).padStart(3, "0")
                : "Not Assigned"
            }
        </small>
    </div>
                    </td>

                    <td>
                        ${phone}
                    </td>

                    <td>
                        ${instructor.drive_Exp + " years" ?? "N/A"}
                    </td>
 
                    <td>
                         ${formatAvailability(instructor.availability)}
                    </td>
                    <td>
                         <button class="btn btn-sm btn-outline-primary me-1"
                            onclick="viewInstructor(${instructor.insID})">
                            <i class="bi bi-eye"></i>
                        </button>

                        <button class="btn btn-sm btn-outline-warning me-1"
                            onclick="editInstructor(${instructor.insID})">
                            <i class="bi bi-pencil"></i>
                        </button>

                       <button class="btn btn-sm btn-outline-danger me-1"
                            onclick="deleteInstructor(this, ${
                              instructor.insID
                            })">
                            <i class="bi bi-trash"></i>
                        </button>
                        <button class="btn btn-sm btn btn-outline-secondary" onclick="assignVehicle(this, ${
                          instructor.insID
                        })">
                                    <i class="bi bi-car-front"></i>
                                </button>
                    </td>
                </tr>
            `;

    tbody.innerHTML += row;
  });
}
