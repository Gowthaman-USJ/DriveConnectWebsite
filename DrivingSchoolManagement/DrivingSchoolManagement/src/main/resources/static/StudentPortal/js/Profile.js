async function loadprofile() {
  const stuID = localStorage.getItem("stuID");
  const response = await fetch(`/api/stuportal/student/${stuID}`);

  const student = await response.json();
  document.getElementById("profileavatar").textContent =
    student.user.fName.charAt(0) + student.user.lName.charAt(0);

  document.getElementById("name").textContent =
    student.user.fName + " " + student.user.lName;

  document.getElementById("email").textContent = student.user.login.email;
  document.getElementById("status").textContent = student.status;
  document.getElementById("stuID2").textContent =
    "STU-" + String(student.stuID).padStart(4, "0");
  document.getElementById("drivingschool").textContent =
    student.drivingSchool.schoolName;
  document.getElementById("coursename").textContent = student.courses.name;
  document.getElementById("email").textContent = student.user.login.email;

  document.getElementById("Fname").value = student.user.fName;
  document.getElementById("Lname").value = student.user.lName;
  document.getElementById("emailinfo").value = student.user.login.email;
  document.getElementById("phone").value = student.user.phoneNo;
  document.getElementById("dob").value = student.user.dob;
  const nic = student.user.nic;

  document.getElementById("nic").value = nic.substring(0, 6) + "XXXXXXX";
  document.getElementById("address").value =
    student.user.street + ", " + student.user.city;
  document.getElementById("province").value = student.user.state;
  document.getElementById("zip").value = student.user.code;

  
}
