let vehicles = [];

async function loadVehicles() {
  const dsID = localStorage.getItem("dsID");

  const response = await fetch(
    `/api/dsportal/vehicles/${dsID}`
  );

  vehicles = await response.json();

  renderVehicles();
}

async function initVehicleForm() {
  const form = document.getElementById("addvehicleForm");

  if (!form) {
    return;
  }

  const submitIcon = document.getElementById("submitIcon");
  const submitText = document.getElementById("submitText");
  const formTitle = document.getElementById("formTitle");
  const formTitleIcon = document.getElementById("formTitleIcon");

  const brand = document.getElementById("brand");
  const model = document.getElementById("model");
  const makeyear = document.getElementById("makeyear");
  const platenum = document.getElementById("platenum");
  const fueltype = document.getElementById("fueltype");
  const mileage = document.getElementById("mileage");
  const transmission = document.getElementById("transmission");
  const status = document.getElementById("status");
  const notes = document.getElementById("notes");

  form.reset();

  const editVehicle = JSON.parse(localStorage.getItem("editVehicle"));

  formTitle.innerText = "Add Vehicle";
  if (formTitleIcon) {
    formTitleIcon.className = "bi bi-car-front text-primary fs-5";
  }

  submitText.innerText = "Add Vehicle";
  submitIcon.className = "bi bi-plus-circle me-2";

  if (editVehicle) {
    brand.value = editVehicle.brand || "";
    model.value = editVehicle.model || "";
    makeyear.value = editVehicle.makeYear || "";
    platenum.value = editVehicle.vehNo || "";
    fueltype.value = editVehicle.fuelType || "";
    mileage.value = editVehicle.mileage || "";
    transmission.value = editVehicle.transmission || "";
    status.value = editVehicle.status || "";
    notes.value = editVehicle.notes || "";

    formTitle.innerText = "Update Vehicle";

    if (formTitleIcon) {
      formTitleIcon.className = "bi bi-pencil-square text-primary fs-5";
    }

    submitText.innerText = "Update Vehicle";

    submitIcon.className = "bi bi-pencil-square me-2";
  }
  form.onsubmit = async function (e) {
    e.preventDefault();

    const dsID = localStorage.getItem("dsID");

    const vehicle = {
      brand: brand.value.trim(),
      model: model.value.trim(),
      makeYear: makeyear.value,
      vehNo: platenum.value.trim(),
      fuelType: fueltype.value,
      mileage: mileage.value,
      transmission: transmission.value,
      status: status.value,
      notes: notes.value,

      drivingSchool: {
        dsID: Number(dsID),
      },
    };

    let url;
    let method;

    if (editVehicle) {
      url = `api/dsportal/updatevehicle/${editVehicle.vehID}`;

      method = "PUT";
    } else {
      url = `/api/dsportal/addvehicle/${dsID}`;

      method = "POST";
    }

    const response = await fetch(url, {
      method: method,

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(vehicle),
    });

    if (!response.ok) {
      const errorText = await response.text();

      alert(`Failed to save vehicle\n${errorText}`);

      return;
    }
    localStorage.removeItem("editVehicle");
    localStorage.setItem(
      "toastMessage",
      editVehicle
        ? "Vehicle updated successfully!"
        : "Vehicle added successfully!"
    );

    loadPage("DisplayVehicles.html", "vehicles");
  };
}

function showVehicleToast() {
  const message = localStorage.getItem("toastMessage");

  if (!message) return;

  const toastEl = document.getElementById("vehicleToast");
  const messageEl = document.getElementById("vehicleToastMessage");

  if (!toastEl || !messageEl) return;

  messageEl.textContent = message;

  const toast = new bootstrap.Toast(toastEl, {
    delay: 3000,
  });

  toast.show();

  localStorage.removeItem("toastMessage");
}

window.viewVehicle = function (id) {
  const v = vehicles.find((vehicle) => vehicle.vehID == id);

  if (!v) {
    alert("Vehicle not found");
    return;
  }
  document.getElementById("m_vehID").value = v.vehID;
  document.getElementById("m_platenum").value = v.vehNo;
  document.getElementById("m_brand").value = v.brand;
  document.getElementById("m_model").value = v.model;
  document.getElementById("m_makeyear").value = v.makeYear;
  document.getElementById("m_fueltype").value = v.fuelType;
  document.getElementById("m_mileage").value = v.mileage;
  document.getElementById("m_status").value = v.status;
  document.getElementById("m_notes").value = v.remarks;

  new bootstrap.Modal(document.getElementById("vehicleModal")).show();
};

let selectedVehicleRow = null;
let selectedVehicleId = null;

window.deleteVehicle = function (button, id) {
  selectedVehicleRow = button.closest("tr");
  selectedVehicleId = id;

  const modalEl = document.getElementById("deleteVehicleModal");

  if (!modalEl) return;

  const modal = new bootstrap.Modal(modalEl);
  modal.show();
};

window.confirmDeleteVehicle = async function () {
  if (!selectedVehicleId) {
    return;
  }

  const response = await fetch(
    `/api/dsportal/deletevehicle/${selectedVehicleId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    alert("Failed to delete vehicle");
    return;
  }

  if (selectedVehicleRow) {
    selectedVehicleRow.remove();
  }
  const modalEl = document.getElementById("deleteVehicleModal");
  const modalInstance = bootstrap.Modal.getInstance(modalEl);

  if (modalInstance) {
    modalInstance.hide();
  }

  const toastEl = document.getElementById("deleteToast");

  if (toastEl) {
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  }
  selectedVehicleRow = null;
  selectedVehicleId = null;
  await loadVehicles();
};

window.editVehicle = function (id) {
  const vehicle = vehicles.find((v) => v.vehID == id);
  if (!vehicle) {
    alert("Vehicle not found");
    return;
  }

  localStorage.setItem("editVehicle", JSON.stringify(vehicle));
  loadPage("AddVehicle.html", "vehicles");
};

function openAddVehicle() {
  localStorage.removeItem("editVehicle");
  loadPage("AddVehicle.html", "vehicles");
}

async function loadVehicles() {
  try {
    const dsID = localStorage.getItem("dsID");

    const response = await fetch(
      `/api/dsportal/getvehicle/${dsID}`
    );

    vehicles = await response.json(); // store data globally

    const tbody = document.getElementById("vehicleTableBody");
    tbody.innerHTML = "";

    vehicles.forEach((vehicle) => {
      tbody.innerHTML += `
        <tr>
          <td>
            <div>${vehicle.vehNo}</div>
            <small class="text-muted">
              ID: VEH-${String(vehicle.vehID).padStart(3, "0")}
            </small>
          </td>
          <td>${vehicle.brand}</td>
          <td>${vehicle.model}</td>
          <td>${vehicle.transmission}</td>
          <td>${vehicle.fuelType}</td>

          <td>
            <span class="status ${vehicle.status.toLowerCase()}">
              ${vehicle.status}
            </span>
          </td>

          <td>
            <button class="btn btn-sm btn-outline-primary"
              onclick="viewVehicle(${vehicle.vehID})">
              <i class="bi bi-eye"></i>
            </button>

            <button class="btn btn-sm btn-outline-warning me-1"
              onclick="editVehicle(${vehicle.vehID})">
              <i class="bi bi-pencil"></i>
            </button>

            <button class="btn btn-sm btn-outline-danger"
              onclick="deleteVehicle(this, ${vehicle.vehID})">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `;
    });
  } catch (err) {
    console.error(err);
  }
}
