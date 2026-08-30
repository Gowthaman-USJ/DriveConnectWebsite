const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const now = new Date();
const TODAY = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(now.getDate()).padStart(2, "0")}`;
let calMonth = now.getMonth();
let calYear = now.getFullYear();
let bookDate = null;
let bookSlot = null;
let bookStep = 1;

const ALL_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];
const LESSON_DATES = new Set();

let LESSONS = [];
let bookedSlots = [];

let bookingData = null;

async function loadBookingData() {
  const stuID = localStorage.getItem("stuID");
  const response = await fetch(
    `/api/stuportal/booking-info/${stuID}`
  );
  bookingData = await response.json();
  updateBookingUI();
}

async function initBooking() {
  bookStep = 1;
  bookDate = null;
  bookSlot = null;
  bookedSlots = [];
  await loadBookingData();

  if (!bookingData) {
    console.error("Booking data not loaded");
    return;
  }

  await loadStudentLessons1();
  renderCal();
  renderBook();
}

async function loadStudentLessons1() {
  const stuID = localStorage.getItem("stuID");
  const response = await fetch(
    `/api/stuportal/studentlessons/${stuID}`
  );
  const lessons = await response.json();
  LESSON_DATES.clear();

  lessons.forEach((lesson) => {
    if (lesson.date) {
      LESSON_DATES.add(lesson.date);
    }
  });

  renderCal();
}

function renderCal() {
  const calLbl = document.getElementById("calLbl");
  const calGrid = document.getElementById("calGrid");

  if (!calLbl || !calGrid) {
    console.error("Calendar elements not found");
    return;
  }

  calLbl.textContent = `${MONTHS[calMonth]} ${calYear}`;

  const first = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  let html = DAYS.map((day) => `<div class="cdn">${day}</div>`).join("");

  html += Array(first).fill(`<div class="cc co"></div>`).join("");

  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = `${calYear}-${String(calMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;

    const past = dateString < TODAY;
    const today = dateString === TODAY;

    const hasLesson = LESSON_DATES.has(dateString);
    const selected = dateString === bookDate;
    const available = !past && !hasLesson;

    const classes = [
      past ? "co" : "",
      today ? "ct" : "",
      selected ? "csel" : "",
      hasLesson ? "hasl" : "",
      available && !today ? "avail" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const clickAction = available
      ? `onclick="selectDate('${dateString}')"`
      : "";

    html += `
      <div
        class="cc ${classes}"
        ${clickAction}
      >
        ${day}
      </div>
    `;
  }

  calGrid.innerHTML = html;
}

function calShift(direction) {
  calMonth += direction;

  if (calMonth > 11) {
    calMonth = 0;
    calYear++;
  }

  if (calMonth < 0) {
    calMonth = 11;
    calYear--;
  }

  renderCal();
}
async function selectDate(dateString) {
  bookDate = dateString;
  bookSlot = null;
  bookedSlots = [];

  renderCal();
  await loadBookedSlots();
  toast(`Date selected: ${formatDate(dateString)}`, "info");
}

function renderBook() {
  const steps = ["Choose date", "Pick time", "Confirm"];
  const stepper = document.getElementById("bookStepper");
  if (!stepper) {
    return;
  }

  stepper.innerHTML = steps
    .map((label, index) => {
      const number = index + 1;
      let className = "";
      if (number < bookStep) {
        className = "done";
      }
      if (number === bookStep) {
        className = "active";
      }
      return `

                    <div class="step-item">

                        <div
                            class="sdot ${className}"
                        >
                            ${number < bookStep ? "✓" : number}
                        </div>

                        <span
                            class="slbl ${className}"
                        >
                            ${label}
                        </span>

                    </div>

                    ${
                      index < steps.length - 1
                        ? `
                            <div
                                class="sline ${number < bookStep ? "done" : ""}"
                            ></div>
                        `
                        : ""
                    }

                `;
    })
    .join("");

  for (let i = 1; i <= 4; i++) {
    const element = document.getElementById("bStep" + i);

    if (element) {
      element.style.display = i === bookStep ? "block" : "none";
    }
  }

  const back = document.getElementById("bBack");
  const next = document.getElementById("bNext");
  const cancel = document.getElementById("bCancel");
  const footer = document.getElementById("bookFooter");

  if (back) {
    back.style.display = bookStep > 1 && bookStep < 4 ? "block" : "none";
  }
  if (cancel) {
    cancel.style.display = bookStep < 4 ? "block" : "none";
  }
  if (footer) {
    footer.style.display = bookStep === 4 ? "none" : "flex";
  }
  if (next) {
    if (bookStep === 1) {
      next.textContent = "Choose Time →";
    } else if (bookStep === 2) {
      next.textContent = "Review →";
      buildSlots();
    } else if (bookStep === 3) {
      next.textContent = "Book Lesson";
      buildSummary();
    }
  }
}

function convertTo24Hour(time12h) {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");

  if (hours === "12") {
    hours = "00";
  }

  if (modifier === "PM") {
    hours = String(parseInt(hours, 10) + 12);
  }

  return `${hours.padStart(2, "0")}:${minutes}:00`;
}

function convertTo24HourShort(time12h) {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");

  hours = parseInt(hours, 10);

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  }

  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  return `${String(hours).padStart(2, "0")}:${minutes}`;
}

function buildSlots() {
  const grid = document.getElementById("slotsGrid");

  if (!grid) {
    console.error("slotsGrid not found");
    return;
  }

  grid.innerHTML = ALL_SLOTS.map((slot) => {
    const slot24 = convertTo24HourShort(slot);
    const isBooked = bookedSlots.includes(slot24);
    const isSelected = bookSlot === slot;

    return `
      <button
        type="button"
        class="tslot ${isBooked ? "full" : ""} ${isSelected ? "selected" : ""}"
        ${isBooked ? "disabled" : ""}
        onclick="${isBooked ? "" : `pickSlot('${slot}')`}"
      >

        ${slot}

        ${
          isBooked
            ? `
              <br>
              <span class="booked-text">
                Booked
              </span>
            `
            : ""
        }

      </button>
    `;
  }).join("");
}

function pickSlot(slot) {
  if (bookedSlots.includes(slot)) {
    return;
  }

  bookSlot = slot;
  buildSlots();
}

function buildSummary() {
  const summary = document.getElementById("bSummary");

  if (!summary) {
    return;
  }

  if (!bookingData) {
    summary.innerHTML = `
      <div class="sum-row">
        <span class="sl">
          Status
        </span>

        <span class="sv">
          Booking data not available
        </span>
      </div>
    `;

    return;
  }

  const instructorName = `${bookingData.fName || ""} ${
    bookingData.lName || ""
  }`.trim();

  const data = [
    ["Date", bookDate ? formatDate(bookDate) : "—"],
    ["Time", bookSlot || "—"],
    ["Instructor", instructorName || "Not assigned"],
    ["Phone", bookingData.phoneNo || "—"],
  ];

  summary.innerHTML = data
    .map(
      ([label, value]) => `
        <div class="sum-row">

          <span class="sl">
            ${label}
          </span>

          <span class="sv">
            ${value}
          </span>

        </div>
      `
    )
    .join("");
}

async function confirmBooking() {
  if (!bookingData) {
    toast("Booking information is not available", "warn");
    return;
  }

  if (!bookDate) {
    toast("Please select a date", "warn");
    return;
  }

  if (!bookSlot) {
    toast("Please select a time", "warn");
    return;
  }

  const studentID = bookingData.stuID;
  const time24 = convertTo24Hour(bookSlot);

  const requestData = {
    date: bookDate,
    time: time24,
  };
  const stuID = localStorage.getItem("stuID");
  try {
    const response = await fetch(
      `/api/stuportal/newlesson/${stuID}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Backend error:", response.status, errorText);

      throw new Error(`Booking failed: ${response.status}`);
    }
    const instructorName = `${bookingData.fName || ""} ${
      bookingData.lName || ""
    }`.trim();

    const lesson = {
      date: bookDate,

      time: bookSlot,

      instructor: instructorName || "Not assigned",

      status: "Scheduled",
    };
    LESSONS.unshift(lesson);
    LESSON_DATES.add(bookDate);
    const successBox = document.getElementById("bSuccessBox");

    if (successBox) {
      successBox.innerHTML = `

        <div class="sum-row">

          <span class="sl">
            Date
          </span>

          <span class="sv">
            ${formatDate(bookDate)}
          </span>

        </div>

        <div class="sum-row">

          <span class="sl">
            Time
          </span>

          <span class="sv">
            ${bookSlot}
          </span>

        </div>

        <div class="sum-row">

          <span class="sl">
            Instructor
          </span>

          <span class="sv">
            ${instructorName || "Not assigned"}
          </span>

        </div>

        <div class="sum-row">

          <span class="sl">
            Course
          </span>

          <span class="sv">
            ${bookingData.name || "—"}
          </span>

        </div>

      `;
    }
    bookStep = 4;
    renderBook();
    renderCal();
    toast("🎉 Lesson booked successfully!", "success");
  } catch (error) {
    toast("Failed to book lesson", "warn");
  }
}

function bookNext() {
  if (bookStep === 1) {
    if (!bookDate) {
      toast("Please select a date first", "warn");
      return;
    }

    bookStep = 2;
    renderBook();
    return;
  }
  if (bookStep === 2) {
    if (!bookSlot) {
      toast("Please select a time slot first", "warn");
      return;
    }
    bookStep = 3;
    renderBook();
    return;
  }
  if (bookStep === 3) {
    confirmBooking();
    return;
  }
}

function bookBack() {
  if (bookStep <= 1) {
    return;
  }
  bookStep--;

  if (bookStep === 1) {
    bookSlot = null;
  }
  renderBook();
}

function formatDate(dateString) {
  return new Date(dateString + "T12:00:00").toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function toast(message, type = "info") {
  const wrapper = document.getElementById("toastWrap");
  if (!wrapper) {
    alert(message);

    return;
  }
  const element = document.createElement("div");
  element.className = "tmsg";
  element.textContent = message;
  wrapper.appendChild(element);
  setTimeout(() => {
    element.remove();
  }, 3500);
}
function updateBookingUI() {
  if (!bookingData) {
    return;
  }

  const instructorName = `${bookingData.fName || ""} ${
    bookingData.lName || ""
  }`.trim();

  const instructorNameElement = document.getElementById("instructorName");

  const instructorPhoneElement = document.getElementById("instructorPhone");

  const instructorAvailabilityElement = document.getElementById(
    "instructorAvailability"
  );

  const instructorInitialsElement =
    document.getElementById("instructorInitials");

  if (instructorNameElement) {
    instructorNameElement.textContent = instructorName || "Not assigned";
  }

  if (instructorPhoneElement) {
    instructorPhoneElement.textContent =
      bookingData.phoneNo || "No phone number";
  }

  if (instructorAvailabilityElement) {
    instructorAvailabilityElement.textContent =
      bookingData.availability || "Not available";
  }

  if (instructorInitialsElement) {
    const firstInitial = bookingData.fName
      ? bookingData.fName.charAt(0).toUpperCase()
      : "";

    const lastInitial = bookingData.lName
      ? bookingData.lName.charAt(0).toUpperCase()
      : "";

    instructorInitialsElement.textContent = firstInitial + lastInitial;
  }

  const courseNameElement = document.getElementById("courseName");
  const drivingSchoolNameElement = document.getElementById("schoolName");
  const courseSessionsElement = document.getElementById("courseSessions");
  const courseProgressElement = document.getElementById("courseProgress");
  const remainingSessionsElement = document.getElementById("remainingSessions");

  const attendance = Number(bookingData.attendance) || 0;
  const totalSessions = Number(bookingData.totalSessions) || 0;
  const remainingSessions = Math.max(totalSessions - attendance, 0);
  const progress = totalSessions > 0 ? (attendance / totalSessions) * 100 : 0;

  if (courseNameElement) {
    courseNameElement.textContent = bookingData.name || "Course not assigned";
  }
  if (drivingSchoolNameElement) {
    drivingSchoolNameElement.textContent =
      bookingData.schoolName || "Driving school not assigned";
  }
  if (courseSessionsElement) {
    courseSessionsElement.textContent = `${bookingData.attendance}/${bookingData.totalSessions}`;
  }
  if (courseProgressElement) {
    courseProgressElement.style.width = `${progress}%`;

    if (progress <= 33) {
      courseProgressElement.style.backgroundColor = "red";
    } else if (progress <= 66) {
      courseProgressElement.style.backgroundColor = "orange";
    } else {
      courseProgressElement.style.backgroundColor = "green";
    }
  }

  if (remainingSessionsElement) {
    remainingSessionsElement.textContent = `${remainingSessions} lessons available`;
  }
}

async function loadBookedSlots() {
  try {
    const url =
        `/api/stuportal/instructorschedule/` +
        `${bookingData.insID}/${bookDate}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const schedules = await response.json();

    bookedSlots = schedules
      .filter((schedule) => schedule.time)
      .map((schedule) => {
        const [hours, minutes] = schedule.time.split(":");

        return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
      });
    buildSlots();
  } catch (error) {
    console.error("Error loading instructor schedule:", error);

    bookedSlots = [];

    buildSlots();
  }
}

