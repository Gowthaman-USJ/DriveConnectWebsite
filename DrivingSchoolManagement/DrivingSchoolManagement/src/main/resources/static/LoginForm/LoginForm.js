function login() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  fetch("/api/login/login", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
    .then((response) => response.json())

    .then((data) => {
      if (data != null) {
        localStorage.setItem("role", data.userRole);

        if (data.userRole === "DrivingSchool") {
          localStorage.setItem("dsID", data.dsID);
          window.location.href = "../DrivingSchool/sidebar.html";
        } else if (data.userRole === "Instructor") {
          localStorage.setItem("insID", data.insID);
          window.location.href = "../InstructorPortal/sidebar.html";
        }  else if (data.userRole === "Student") {
          if (data.studentRegistered) {
            localStorage.setItem("stuID", data.stuID);
            window.location.href = "../StudentPortal/sidebar.html";
          } else {
            localStorage.setItem("userID", data.userID);
            window.location.href = "../SchoolCompare/SchoolCompare.html";
          }
        }else {
          alert("Invalid User Role");
        }
      } else {
        alert("Invalid Email or Password");
      }
    })

    .catch((error) => {
      alert("Server Error");
    });
}
