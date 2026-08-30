async function loadPayments() {
  const dsID = localStorage.getItem("dsID");

  const tableBody = document.getElementById("paymentTableBody");
  if (!tableBody) {
    return;
  }

  try {
    const response = await fetch(
      `/api/dsportal/paymenttable/${dsID}`
    );

    if (!response.ok) {
      throw new Error("Failed to load payments");
    }

    const payments = await response.json();

    tableBody.innerHTML = "";

    if (!Array.isArray(payments) || payments.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="8"
              class="text-center">
            No payments found
          </td>
        </tr>
      `;

      return;
    }

    payments
      .filter((payment) => payment.student.feeStatus === "Paid")
      .forEach((payment) => {
        const row = document.createElement("tr");

        const student = payment.student;

        row.innerHTML = `
      <td>
        ${String(payment.payID).padStart(3, "0")}
      </td>

      <td>
        ${String(student?.stuID ?? "-").padStart(3, "0")}
      </td>

      <td>
        ${student?.fName ?? ""}
        ${student?.lName ?? ""}
      </td>

      <td>
        ${formatDate(payment.paymentDate)}
      </td>

      <td>
        LKR ${Number(payment.amount ?? 0).toLocaleString()}
      </td>

      <td>
        ${payment.method ?? "-"}
      </td>
    `;

        tableBody.appendChild(row);
      });
  } catch (error) {
    console.error("Error loading payments:", error);

    tableBody.innerHTML = `
      <tr>
        <td colspan="8"
            class="text-center text-danger">
          Failed to load payments
        </td>
      </tr>
    `;
  }
}

function formatDate(date) {
  if (!date) {
    return "-";
  }

  const d = new Date(date);

  return d.toISOString().split("T")[0];
}

async function loadPaymentSummary() {
  const dsID = localStorage.getItem("dsID");

  if (!dsID) {
    console.error("DS ID not found");

    return;
  }

  const totalRevenue = document.getElementById("totalRevenue");

  const paidRevenue = document.getElementById("paidRevenue");

  const pendingRevenue = document.getElementById("pendingRevenue");

  if (!totalRevenue || !paidRevenue || !pendingRevenue) {
    return;
  }

  try {
    const response = await fetch(
      `/api/dsportal/paymenttable/${dsID}`
    );

    if (!response.ok) {
      throw new Error("Failed to load payments");
    }

    const payments = await response.json();

    let total = 0;
    let paid = 0;
    let pending = 0;

    if (Array.isArray(payments)) {
      payments.forEach((payment) => {
        const amount = Number(payment.amount ?? 0);

        total += amount;

        const feeStatus = payment.student?.feeStatus?.toLowerCase() ?? "";

        if (feeStatus === "paid") {
          paid += amount;
        }

        if (feeStatus === "pending") {
          pending += amount;
        }
      });
    }

    totalRevenue.textContent = `LKR ${total.toLocaleString()}`;

    paidRevenue.textContent = `LKR ${paid.toLocaleString()}`;

    pendingRevenue.textContent = `LKR ${pending.toLocaleString()}`;
  } catch (error) {
    console.error("Error loading payment summary:", error);
  }
}
async function initPaymentForm() {
  const form = document.getElementById("addPaymentForm");

  if (!form) {
    return;
  }

  const studentSelect = document.getElementById("studentId");

  const dsID = localStorage.getItem("dsID");

  if (!dsID) {
    alert("Driving School ID not found");

    return;
  }

  const response = await fetch(
    `/api/dsportal/getstudents/${dsID}`
  );

  if (!response.ok) {
    alert("Failed to load students");

    return;
  }

  const data = await response.json();
  const students = Array.isArray(data) ? data : data.students || [];

  studentSelect.innerHTML = `
    <option value="">
      Select Student
    </option>
  `;

  students.forEach((student) => {
    const option = document.createElement("option");

    option.value = student.stuID;

    option.textContent = `${student.stuID} - ${student.user.fName ?? ""} ${
      student.user.lName ?? ""
    }`;

    studentSelect.appendChild(option);
  });

  form.onsubmit = async function (e) {
    e.preventDefault();
    const studentId = Number(studentSelect.value);
    const amount = Number(document.getElementById("amount").value);

    if (!studentId) {
      alert("Please select a student");
      return;
    }

    if (!amount || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const payment = {
      student: {
        stuID: studentId,
      },
      amount: amount,
    };

    const response = await fetch(
      `/api/dsportal/addpayment/${dsID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payment),
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend Error:", errorText);
      showToast("Failed to add payment", "error");
      return;
    }
    showToast("Payment added successfully!", "success");
    loadPage("DisplayPayments.html", "payments");
  };
}

function showToast(message, type = "success") {
  let container = document.getElementById("toastContainer");

  if (!container) {
    container = document.createElement("div");

    container.id = "toastContainer";

    container.className = "toast-container";

    document.body.appendChild(container);
  }
  const toast = document.createElement("div");

  toast.className = `compact-toast toast-${type}`;

  toast.innerHTML = `
        <div class="toast-body">
            ${message}
        </div>
    `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("hide");

    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}
