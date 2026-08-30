async function loadSchoolProfile() {
  const dsID = localStorage.getItem("dsID");

  if (!dsID) {
    throw new Error("Driving School ID not found");
  }
  const response = await fetch(
    `/api/dsportal/profile/${dsID}`
  );

  if (!response.ok) {
    throw new Error("Failed to load school profile");
  }

  const school = await response.json();
  document.getElementById("profileSchoolName").textContent =
    school.schoolName || "-";
  document.getElementById("schoolNameDisplay").textContent =
    school.schoolName || "-";
  document.getElementById("drivingLicenseDisplay").textContent =
    school.dsLicenseNo || "-";
  document.getElementById("establishedYearDisplay").textContent =
    school.estYear || "-";
  document.getElementById("emailDisplay").textContent =
    school.login.email || "-";
  document.getElementById("phoneDisplay").textContent = school.phoneNo || "-";
  document.getElementById("descriptionDisplay").textContent =
    school.description || "-";
  document.getElementById("contactNameDisplay").textContent =
    school.manager || "-";
  document.getElementById("contactPhoneDisplay").textContent =
    school.directPhone || "-";
  document.getElementById("addressDisplay").textContent = school.address || "-";
  document.getElementById("cityDisplay").textContent = school.city || "-";
  document.getElementById("stateDisplay").textContent = school.state || "-";
  document.getElementById("zipDisplay").textContent = school.code || "-";
  document.getElementById("transmissionDisplay").textContent =
    school.transmission === "Both"
      ? "Automatic & Manual"
      : school.transmission || "-";
  const operatingTime = school.time?.toLowerCase();

  let displayTime = "-";

  if (operatingTime === "flex") {
    displayTime = "Flexible";
  } else if (operatingTime === "both") {
    displayTime = "Weekdays & Weekends";
  } else if (school.time) {
    displayTime = school.time;
  }

  document.getElementById("operatingHoursDisplay").textContent = displayTime;
  document.getElementById("insuranceProviderDisplay").textContent =
    school.insName || "-";
  document.getElementById("insurancePolicyDisplay").textContent =
    school.insNo || "-";

  await displayCourses();

  return school;
}

async function initEditSchoolProfileForm() {
  const form = document.getElementById("editSchoolProfileForm");

  if (!form) return;

  const schoolName = document.getElementById("schoolName");
  const businessReg = document.getElementById("businessReg");
  const drivingLicenseNo = document.getElementById("drivingLicenseNo");
  const yearEstablished = document.getElementById("yearEstablished");
  const schoolEmail = document.getElementById("schoolEmail");
  const schoolPhone = document.getElementById("schoolPhone");

  const description = document.getElementById("description");

  const contactFullName = document.getElementById("contactFullName");
  const contactPhone = document.getElementById("contactPhone");
  const contactEmail = document.getElementById("contactEmail");

  const address = document.getElementById("street");
  const city = document.getElementById("city");
  const state = document.getElementById("state");
  const zip = document.getElementById("zip");

  const transmission = document.getElementById("transmission");
  const operatingHours = document.getElementById("operatingHours");

  const insuranceProvider = document.getElementById("insuranceProvider");

  const insurancePolicy = document.getElementById("insurancePolicy");

  const password = document.getElementById("password");

  const editData = JSON.parse(localStorage.getItem("editSchool"));

  form.reset();

  if (editData && editData.school) {
    const s = editData.school;

    schoolName.value = s.schoolName || "";
    drivingLicenseNo.value = s.dsLicenseNo || "";
    yearEstablished.value = s.estYear || "";
    schoolEmail.value = s.login.email || "";
    schoolPhone.value = s.phoneNo || "";
    description.value = s.description || "";
    contactFullName.value = s.manager || "";
    contactPhone.value = s.directPhone || "";
    address.value = s.address || "";
    city.value = s.city || "";
    state.value = s.state || "";
    zip.value = s.code || "";
    transmission.value = s.transmission || "";
    operatingHours.value = s.time || "";
    insuranceProvider.value = s.insName || "";
    insurancePolicy.value = s.insNo || "";
    password.value = s.login.password || "";
    password.readOnly = false;

    const packageContainer = document.getElementById("packageContainer");

    if (packageContainer) {
      packageContainer.innerHTML = "";

      const courses = await loadCourses();

      courses.forEach((course) => {
        const div = document.createElement("div");

        div.className = "package-item border rounded p-3 mb-3";

        div.dataset.courseId = course.courseID || 0;

        div.innerHTML = `
        <div class="row g-3">
            <div class="col-md-4">
                <label class="form-label">Type</label>
                <select class="form-select packageType">
                    <option value="Course">Course</option>
                    <option value="Package">Package</option>
                </select>
            </div>


            <div class="col-md-8">
                <label class="form-label">Name</label>
                <input type="text" 
                class="form-control packageName">
            </div>


            <div class="col-md-6">
                <label class="form-label">Total Sessions</label>
                <input type="number" 
                class="form-control packageDuration">
            </div>


            <div class="col-md-6">
                <label class="form-label">Price</label>
                <input type="number" 
                class="form-control packagePrice">
            </div>


            <div class="col-12">
                <label class="form-label">Description</label>
                <textarea class="form-control packageDescription"></textarea>
            </div>


            <div class="col-12 text-end">
                <button type="button" 
                class="btn btn-outline-danger removePackage">
                <i class="bi bi-trash"></i>
                Remove
                </button>

            </div>
        </div>

        `;

        packageContainer.appendChild(div);

        div.querySelector(".packageType").value = course.type || "";
        div.querySelector(".packageName").value = course.name || "";
        div.querySelector(".packageDescription").value =
          course.description || "";
        div.querySelector(".packageDuration").value =
          course.totalSessions || "";
        div.querySelector(".packagePrice").value = course.price || "";
      });
    }
  }

  form.onsubmit = async function (e) {
    e.preventDefault();

    const dsID = localStorage.getItem("dsID");

    if (!dsID) {
      alert("Driving School ID not found");
      return;
    }

    const courses = [];

    document.querySelectorAll(".package-item").forEach((item) => {
      const courseID = Number(item.dataset.courseId || 0);

      courses.push({
        courseID: Number(item.dataset.courseId || 0),
        type: item.querySelector(".packageType").value,

        name: item.querySelector(".packageName").value,

        description: item.querySelector(".packageDescription").value,

        totalSessions: Number(item.querySelector(".packageDuration").value),

        price: Number(item.querySelector(".packagePrice").value),
      });
    });

    const school = {
      schoolName: schoolName.value,
      dsLicenseNo: drivingLicenseNo.value,
      estYear: Number(yearEstablished.value),
      email: schoolEmail.value,
      phoneNo: schoolPhone.value,
      description: description.value,
      manager: contactFullName.value,
      directPhone: contactPhone.value,
      address: address.value,
      city: city.value,
      state: state.value,
      code: Number(zip.value),
      transmission: transmission.value,
      time: operatingHours.value,
      insName: insuranceProvider.value,
      insNo: insurancePolicy.value,
      password: password.value,
      courses: courses,
    };

    try {
      const response = await fetch(
        `/api/dsportal/updateprofile/${dsID}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(school),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(errorText);
      }

      localStorage.setItem("toastMessage", "Profile updated successfully !");

      loadPage("DisplayProfile.html", "profile");
    } catch (error) {
      console.error("Update error:", error);

      alert("Failed to update school profile: " + error.message);
    }
  };
}

async function editSchoolProfile() {
  const school = await loadSchoolProfile();
  localStorage.setItem(
    "editSchool",
    JSON.stringify({
      school: school,
    })
  );

  // Open edit page
  loadPage("Editprofile.html", "profile");
}

async function loadCourses() {
  const dsID = localStorage.getItem("dsID");

  if (!dsID) {
    throw new Error("Driving School ID not found");
  }

  const response = await fetch(
    `/api/dsportal/courses/${dsID}`
  );

  if (!response.ok) {
    throw new Error("Failed to load courses");
  }

  const courses = await response.json();
  return Array.isArray(courses) ? courses : [];
}

async function displayCourses() {
  try {
    const courses = await loadCourses();

    const container = document.getElementById("coursesDisplay");

    if (!container) {
      console.warn("coursesDisplay element not found");
      return;
    }

    container.innerHTML = "";

    if (courses.length === 0) {
      container.innerHTML = `
        <span class="text-muted">
          No courses or packages available
        </span>
      `;
      return;
    }

    courses.forEach((course) => {
      const div = document.createElement("div");

      div.className = "mb-3";

      div.innerHTML = `
        <strong>
          ${course.courseName || course.name || "-"}
        </strong>

        <br>

        <small class="text-muted">
          ${course.description || ""}
        </small>

        <br>

        Total Sessions:
        ${course.totalSessions || 0}

        |

        Price:
        Rs. ${Number(course.price || 0).toLocaleString()}
      `;

      container.appendChild(div);
    });
  } catch (error) {
    console.error("Error displaying courses:", error);

    const container = document.getElementById("coursesDisplay");

    if (container) {
      container.innerHTML = `
        <span class="text-danger">
          Failed to load courses
        </span>
      `;
    }
  }
}

function initPackageButtons() {
  const addButton = document.getElementById("addPackage");
  const container = document.getElementById("packageContainer");

  if (!addButton || !container) {
    return;
  }

  addButton.onclick = function () {
    const newPackage = document.createElement("div");

    newPackage.className = "package-item border rounded p-3 mb-3";

    newPackage.dataset.courseId = "0";

    newPackage.innerHTML = `

        <div class="row g-3">
            <div class="col-md-4">
                <label class="form-label">
                    Type
                </label>

                <select class="form-select packageType">
                    <option value="Course">Course</option>
                    <option value="Package">Package</option>
                </select>

            </div>

            <div class="col-md-8">
                <label class="form-label">
                    Name
                </label>
                <input type="text" 
                class="form-control packageName">
            </div>

            <div class="col-md-6">
                <label class="form-label">
                    Total Sessions 
                </label>
                <input type="number"
                class="form-control packageDuration">
            </div>

            <div class="col-md-6">
                <label class="form-label">
                    Price
                </label>
                <div class="input-group">
                    <span class="input-group-text">
                        Rs.
                    </span>
                    <input type="number"
                    class="form-control packagePrice">
                </div>
            </div>

            <div class="col-12">
                <label class="form-label">
                    Description
                </label>

                <textarea class="form-control packageDescription"></textarea>
            </div>

            <div class="col-12 text-end">
                <button type="button" 
                class="btn btn-outline-danger removePackage">
                    <i class="bi bi-trash"></i>
                    Remove
                </button>
            </div>
        </div>
        `;

    container.appendChild(newPackage);
  };

  container.onclick = async function (e) {
    const removeButton = e.target.closest(".removePackage");

    if (!removeButton) {
      return;
    }

    const packageItem = removeButton.closest(".package-item");

    if (!packageItem) {
      return;
    }
    const courseID = Number(packageItem.dataset.courseId || 0);
    if (courseID === 0) {
      packageItem.remove();
      return;
    }
    showDeleteConfirmToast(
      "Are you sure you want to delete this course/package?",
      async function () {
        try {
          const response = await fetch(
            `/api/dsportal/deleteCourse/${courseID}`,
            {
              method: "DELETE",
            }
          );

          const responseText = await response.text();

          if (!response.ok) {
            throw new Error(responseText || "Failed to delete course");
          }
          packageItem.remove();
          showSchoolToast("Course/package deleted successfully!");
        } catch (error) {
          console.error("Delete course error:", error);

          showSchoolToast("Failed to delete course: " + error.message);
        }
      }
    );
    const response = await fetch(
      `/api/dsportal/deleteCourse/${courseID}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(errorText);
    }
    packageItem.remove();
    packageItem.remove();
    localStorage.setItem("toastMessage", "Course deleted successfully!");
  };
}

function showSchoolToast() {
  const message = localStorage.getItem("toastMessage");

  if (!message) return;

  const toastEl = document.getElementById("successToast");
  const messageEl = document.getElementById("successToastMessage");

  if (!toastEl || !messageEl) return;

  messageEl.textContent = message;

  const toast = new bootstrap.Toast(toastEl, {
    delay: 3000,
  });

  toast.show();

  localStorage.removeItem("toastMessage");
}

function showDeleteConfirmToast(message, onConfirm) {
  const toastEl = document.getElementById("deleteConfirmToast");
  const messageEl = document.getElementById("deleteConfirmMessage");
  const confirmBtn = document.getElementById("confirmDeleteBtn");
  const cancelBtn = document.getElementById("cancelDeleteBtn");
  if (!toastEl || !messageEl || !confirmBtn || !cancelBtn) {
    console.error("Delete confirmation toast elements not found");

    return;
  }

  messageEl.textContent = message;
  const toast = bootstrap.Toast.getOrCreateInstance(toastEl, {
    autohide: false,
  });

  confirmBtn.onclick = null;
  confirmBtn.onclick = async function () {
    toast.hide();

    await onConfirm();
  };
  cancelBtn.onclick = function () {
    toast.hide();
  };

  toast.show();
}
