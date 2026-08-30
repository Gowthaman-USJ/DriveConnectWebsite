document
  .getElementById("studentForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    let licenseTypes = [];

    document
      .querySelectorAll('input[name="licenseTypes"]:checked')
      .forEach((checkbox) => {
        licenseTypes.push(checkbox.value);
      });

    let student = {
      fName: document.getElementById("firstName").value,
      lName: document.getElementById("lastName").value,
      nic: document.getElementById("nic").value,
      email: document.getElementById("email").value,
      phoneNo: document.getElementById("phone").value,
      dob: document.getElementById("dob").value,
      gender: document.getElementById("gender").value,
      street: document.getElementById("street").value,
      city: document.getElementById("city").value,
      state: document.getElementById("state").value,
      code: document.getElementById("zip").value,
      licenseTypes: licenseTypes,
      transPrefer: document.getElementById("transmission").value,
      driveExp: document.getElementById("experience").value,
      pref_time: document.getElementById("lessonTime").value,
      notes: document.getElementById("notes").value,
      password: document.getElementById("password").value,
    };

    fetch("/api/userregister", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Registration failed");
            }

            showToast("Registration Successful!", "success");

            setTimeout(() => {
                window.location.href = "../LoginForm/LoginForm.html";
            }, 1500);
        })
        .catch((error) => {
            console.error(error);
            showToast("Registration Failed!", "danger");
        });
  });

function showToast(message, type = "success") {
    const toast = document.createElement("div");

    toast.className = `toast align-items-center text-bg-${type} border-0 position-fixed top-0 end-0 m-3`;
    toast.style.zIndex = "9999";

    toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${message}
      </div>
      <button
        type="button"
        class="btn-close btn-close-white me-2 m-auto"
        data-bs-dismiss="toast">
      </button>
    </div>
  `;

    document.body.appendChild(toast);

    const bsToast = new bootstrap.Toast(toast, {
        delay: 1500
    });

    bsToast.show();

    toast.addEventListener("hidden.bs.toast", () => {
        toast.remove();
    });
}
