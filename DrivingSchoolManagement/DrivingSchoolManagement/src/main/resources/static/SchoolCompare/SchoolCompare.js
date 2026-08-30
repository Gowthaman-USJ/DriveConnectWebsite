let schools = [];

let compareList = JSON.parse(localStorage.getItem("compareList")) || [];
let savedList = JSON.parse(localStorage.getItem("savedList")) || [];

document.addEventListener("DOMContentLoaded", () => {
  loadUser();
  loadSchools();
});

async function loadUser() {
  const userID = localStorage.getItem("userID");

  try {
    const response = await fetch(
      `/api/compareschool/${userID}`
    );

    if (!response.ok) {
      throw new Error("Failed to load user");
    }
    const user = await response.json();
    document.getElementById(
      "userName"
    ).textContent = `${user.fName} ${user.lName}`;
    document.getElementById("userAvatar").textContent =
      user.fName.charAt(0).toUpperCase() + user.lName.charAt(0).toUpperCase();
    document.getElementById("topuserAvatar").textContent =
      user.fName.charAt(0).toUpperCase() + user.lName.charAt(0).toUpperCase();
  } catch (error) {
    console.error("Error loading user:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadUser);

async function loadSchools() {
  try {
    const response = await fetch(
      "/api/compareschool/schools"
    );

    if (!response.ok) {
      throw new Error("Failed to load schools");
    }

    let data = await response.json();

    schools = data.map((s) => ({
      id: s.dsID,
      name: s.schoolName,
      loc: s.address + ", " + s.city + ",",
      loc2: s.state + " Province " + " " + s.code,
      phone: s.phoneNo,
      image: "drivingschool.png",
      banner: "#0d6efd",
      desc: s.description,
      trans: s.transmission,
      avail: s.time,
      packages: [],
      manager: s.manager,
      managerphone: s.directPhone,
      city: s.city,
    }));

    populateCityFilter();
    renderCards(schools);
  } catch (error) {
    console.error("Error loading schools:", error);

    document.getElementById("schoolGrid").innerHTML = `
            <p class="text-danger">
                Failed to load driving schools.
            </p>
        `;
  }
}

function renderCards(list) {
  const grid = document.getElementById("schoolGrid");

  if (list.length === 0) {
    grid.innerHTML = `
            <p class="text-muted">
                No driving schools found.
            </p>
        `;

    return;
  }

  grid.innerHTML = list.map((s) => cardHTML(s)).join("");
}

function cardHTML(s) {
  const inCmp = compareList.includes(String(s.id));
  const inSaved = savedList.includes(String(s.id));

  return `
    <div class="sc" id="card-${s.id}">

        <div class="sc-banner">
            <img src="${s.image}" class="school-image"alt="${s.name}">
        </div>

        <div class="sc-body">
            <div class="sc-name">
                ${s.name}
            </div>

            <div class="sc-loc">
                <p><i class="bi bi-geo-alt-fill"></i>
                <span>${s.loc}<br>${s.loc2}</span></p>
            </div>

            <div class="sc-foot">
               <button class="btn-view-detail"onclick="openDrawer('${s.id}')">
                        View Details
               </button>
            </div>
        </div>
    </div>
    `;
}

async function openDrawer(id) {
  drawerSchool = schools.find((s) => s.id == id);

  await loadCourses(id);

  if (!drawerSchool) return;

  document.getElementById("dName").textContent = drawerSchool.name;

  drawerTab = "details";

  document.querySelectorAll(".dtab").forEach((btn, index) => {
    btn.classList.toggle("active", index === 0);
  });

  renderDrawerBody("details");

  document.getElementById("dOverlay").classList.add("show");

  document.getElementById("drawer").classList.add("open");
}

function switchDTab(tab) {
  drawerTab = tab;

  document.querySelectorAll(".dtab").forEach((btn) => {
    btn.classList.remove("active");
  });

  event.target.classList.add("active");

  renderDrawerBody(tab);
}

function renderDrawerBody(tab) {
  const s = drawerSchool;

  const body = document.getElementById("dBody");

  if (tab === "details") {
    body.innerHTML = `
    <div class="school-profile">

        <div class="sc-banner">
            <img src="${s.image}" class="school-image" alt="${s.name}">
        </div>

        <div class="school-description">
            ${
              s.desc ||
              "Professional driving school providing quality driving training."
            }
        </div>

        <div class="school-info">

            <div class="info-row">
                <span class="label">
                    <i class="bi bi-telephone"></i> Contact
                </span>
                <span>${s.phone || "Not available"}</span>
            </div>

            <div class="info-row">
                <span class="label">
                    <i class="bi bi-geo-alt"></i> Location
                </span>
                <span>${s.loc}<br>${s.loc2}</span>
            </div>

            <div class="info-row">
                <span class="label">
                    <i class="bi bi-car-front"></i> Vehicle
                </span>
                <span>${formatTransmission(s.trans)}</span>
            </div>

            <div class="info-row">
                <span class="label">
                    <i class="bi bi-clock"></i> Hours
                </span>
                <span>${formatAvailability(s.avail)}</span>
            </div>

            <div class="info-row">
                <span class="label">
                    <i class="bi bi-person"></i> Manager
                </span>
                <span>
                    ${s.manager || "N/A"}
                    <br>
                    ${s.managerphone || ""}
                </span>
            </div>
        </div>
    </div>
  `;
  } else if (tab === "packages") {
    body.innerHTML = `

        <h6>Select a package</h6>
        ${s.packages
          .map(
            (p, index) => `
            <div class="package-card">
                <h6>${p.name}</h6>
                <p>${p.desc}</p>
                <div class="package-info">
                    Total Sessions: ${p.lessons}
                </div>
                <b>${p.price}</b>
                <button class="btn btn-primary w-100 mt-2"onclick="openPayment('${s.id}',${index})">Enrol Now</button>
            </div>
            `
          )
          .join("")}
        `;
  }
}

function closeDrawer() {
  document.getElementById("dOverlay").classList.remove("show");
  document.getElementById("drawer").classList.remove("open");
}

function enrol(id, pkgIndex) {
  const school = schools.find((s) => s.id == id);
  const package = school.packages[pkgIndex];
  alert(
    `Enrolling in ${school.name}
Package: ${package.name}`
  );
}

async function loadCourses(dsID) {
  const response = await fetch(
    `/api/compareschool/courses/${dsID}`
  );

  const courses = await response.json();

  const school = schools.find((s) => s.id == dsID);

  school.packages = courses.map((c) => ({
    id: c.courseID,
    name: c.name,
    desc: c.description,
    price: `LKR ${c.price.toLocaleString()}`,
    lessons: c.totalSessions,
  }));
}

function formatTransmission(t) {
  if (t === "Auto") {
    return "Automatic";
  }
  if (t === "Both") {
    return "Automatic and Manual";
  }

  return t;
}

function formatAvailability(t) {
  if (t === "Weekday") {
    return "Only Weekdays";
  } else if (t === "Weekend") {
    return "Only Weekends";
  } else if (t === "Both") {
    return "Weekdays and Weekends";
  } else if (t === "Flex") {
    return "Flexible";
  }

  return t;
}

let selectedSchool;
let selectedPackage;

function openPayment(id, index) {
  selectedSchool = schools.find((s) => s.id == id);
  selectedPackage = selectedSchool.packages[index];

  document.getElementById(
    "paymentPackage"
  ).innerHTML = `${selectedSchool.name}<br>${selectedPackage.name}`;

  document.getElementById("paymentAmount").innerHTML = selectedPackage.price;

  document.getElementById("paymentModal").classList.add("show");
}

function closePayment() {
  document.getElementById("paymentModal").classList.remove("show");
}

async function makePayment() {
  const method = document.getElementById("paymentMethod").value;
  if (!selectedSchool || !selectedPackage) {
    alert("Please select a package first.");
    return;
  }

  const userID = localStorage.getItem("userID");

  if (!userID) {
    alert("User ID not found. Please login again.");
    return;
  }

  const amount = parseFloat(
    selectedPackage.price.replace("LKR", "").replace(/,/g, "").trim()
  );

  const enrollmentData = {
    userID: parseInt(userID),

    dsID: parseInt(selectedSchool.id),

    packageID: parseInt(selectedPackage.id),

    amount: amount,

    method: method,
  };

  try {
    const response = await fetch(
      "/api/compareschool/enroll",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(enrollmentData),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Enrollment failed");
    }

    if (data.success) {

      localStorage.removeItem("userID");
      localStorage.setItem("stuID", data.stuID);
      closePayment();

      const toast = document.getElementById("paymentToast");

      const title = toast.querySelector("strong");

      const msg = toast.querySelector("p");

      const okBtn = document.getElementById("toastOkBtn");

      if (method.toLowerCase() === "cash") {
        title.innerHTML = "Enrollment Successful";

        msg.innerHTML = "Please pay the amount at the driving school.";

        okBtn.style.display = "inline-block";

        okBtn.onclick = goStudentPortal;
      } else {
        title.innerHTML = "Payment Successful";

        msg.innerHTML = "Your payment has been completed.";

        okBtn.style.display = "none";

        setTimeout(goStudentPortal, 2000);
      }

      toast.classList.add("show");
    } else {
      alert(data.message || "Enrollment failed");
    }
  } catch (error) {
    console.error("Enrollment error:", error);

    alert("Failed to complete enrollment: " + error.message);
  }
}

function goStudentPortal() {
  document.getElementById("paymentToast").classList.remove("show");

  window.location.href = "/StudentPortal/sidebar.html";
}

function populateCityFilter() {
  const citySelect = document.getElementById("filterCity");

  const cities = [
    ...new Set(
      schools.map((s) => s.city).filter((city) => city && city.trim() !== "")
    ),
  ];

  cities.sort((a, b) => a.localeCompare(b));
  citySelect.innerHTML = `
        <option value="">All areas</option>
    `;

  cities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    citySelect.appendChild(option);
  });
}

function filterCards() {
  const searchText = document
    .getElementById("searchQ")
    .value.toLowerCase()
    .trim();

  const selectedCity = document.getElementById("filterCity").value;

  const selectedTransmission = document.getElementById("filterTx").value;

  const filteredSchools = schools.filter((school) => {

    const matchesSearch =
      !searchText ||
      school.name.toLowerCase().includes(searchText) ||
      (school.desc && school.desc.toLowerCase().includes(searchText)) ||
      (school.city && school.city.toLowerCase().includes(searchText));

    const matchesCity = !selectedCity || school.city === selectedCity;

    // Filter by transmission
    const matchesTransmission =
      !selectedTransmission ||
      formatTransmission(school.trans) === selectedTransmission;

    return matchesSearch && matchesCity && matchesTransmission;
  });

  renderCards(filteredSchools);
}

function resetFilters() {
  document.getElementById("searchQ").value = "";
  document.getElementById("filterCity").value = "";
  document.getElementById("filterTx").value = "";
  renderCards(schools);
}

async function enrollStudent(dsID, packageID, amount, paymentMethod) {
  const userID = localStorage.getItem("userID");

  if (!userID) {
    alert("User ID not found. Please login again.");
    return;
  }

  const enrollmentData = {
    userID: parseInt(userID),
    dsID: parseInt(dsID),
    packageID: parseInt(packageID),
    amount: parseFloat(amount),
    paymentMethod: paymentMethod,
  };

  const response = await fetch(
      "/api/compareschool/enroll",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(enrollmentData),
    }
  );

  const data = await response.json();
  if (data.success) {
    localStorage.removeItem("userID");
    localStorage.setItem("stuID", data.stuID);

    alert("Enrollment successful!");

    window.location.href = "../StudentPortal/sidebar.html";
  }
}
