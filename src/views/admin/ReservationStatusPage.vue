<template>
  <div class="container py-4">
    <h2 class="text-center fw-bold mb-4 text-primary">RESERVATION DETAILS</h2>

    <div class="d-flex justify-content-center mb-4">
      <div class="input-group shadow-sm rounded" style="width: 380px">
        <input
          v-model="searchQuery"
          type="text"
          class="form-control border-0"
          placeholder="Search by Locker No., Course, or Status..."
          @keyup.enter="fetchPendingRentals"
        />
        <button class="btn btn-primary shadow-sm" @click="fetchPendingRentals">
          <i class="bi bi-search"></i>
        </button>
      </div>
    </div>

    <!-- 📋 Table View (Desktop) -->
    <div class="table-container shadow-lg bg-white rounded-4 p-3 d-none d-xl-block">
      <table class="table table-hover align-middle text-center mb-0">
        <thead class="table-header">
          <tr>
            <th>Student ID</th>
            <th>Student Name</th>
            <th>Locker No.</th>
            <th>Location (Course)</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rental in filteredRentals" :key="rental.rental_id">
            <td>{{ rental.stud_id }}</td>
            <td>{{ rental.f_name }} {{ rental.l_name }}</td>
            <td>{{ rental.locker_number }}</td>
            <td>{{ rental.course_name }}</td>
            <td>
              <span
                :class="[
                  'badge status-badge',
                  rental.status?.toLowerCase() === 'pending'
                    ? 'bg-warning text-dark'
                    : rental.status?.toLowerCase() === 'reserved'
                    ? 'bg-info text-dark'
                    : rental.status?.toLowerCase() === 'active'
                    ? 'bg-success'
                    : 'bg-danger',
                ]"
              >
                {{ rental.status }}
              </span>
            </td>
            <td>
              <div class="d-flex justify-content-center gap-2">
                <button
                  class="btn btn-approve shadow-sm"
                  @click="showConfirmModal('approve', rental)"
                  :disabled="rental.status?.toLowerCase() === 'active'"
                >
                  <i class="bi bi-check-circle me-1"></i> Approve
                </button>
                <button
                  class="btn btn-cancel shadow-sm"
                  @click="showConfirmModal('cancel', rental)"
                  :disabled="rental.status?.toLowerCase() === 'active'"
                >
                  <i class="bi bi-x-circle me-1"></i> Cancel
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredRentals.length === 0">
            <td colspan="7" class="text-muted fst-italic py-4">No rentals found</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 📱 Card View (Mobile) -->
    <div class="card-container d-xl-none">
      <div class="scrollable-cards">
        <div
          v-for="rental in filteredRentals"
          :key="rental.rental_id"
          class="rental-card shadow-sm"
          @click="openDetailsModal(rental)"
        >
          <div class="card-row">
            <div><strong>ID:</strong> {{ rental.stud_id }}</div>
            <div><strong>Name:</strong> {{ rental.f_name }} {{ rental.l_name }}</div>
            <div><strong>Locker:</strong> {{ rental.locker_number }}</div>
          </div>
          <div class="card-row mt-2">
            <div>
              <strong>Status:</strong>
              <span
                :class="[
                  'badge status-badge-sm',
                  rental.status?.toLowerCase() === 'pending'
                    ? 'bg-warning text-dark'
                    : rental.status?.toLowerCase() === 'reserved'
                    ? 'bg-info text-dark'
                    : rental.status?.toLowerCase() === 'active'
                    ? 'bg-success'
                    : 'bg-danger',
                ]"
              >
                {{ rental.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <p v-if="filteredRentals.length === 0" class="text-center text-muted fst-italic py-4">
        No rentals found
      </p>
    </div>

    <!-- 🧾 Details Modal -->
    <div class="modal fade" id="detailsModal" tabindex="-1" aria-hidden="true" ref="detailsModalRef">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">
              Reservation for {{ selectedRental?.f_name }} {{ selectedRental?.l_name }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p><strong>Rental ID:</strong> {{ selectedRental?.rental_id }}</p>
            <p><strong>Student ID:</strong> {{ selectedRental?.stud_id }}</p>
            <p><strong>Email:</strong> {{ selectedRental?.email }}</p>
            <hr />
            <p><strong>Locker Number:</strong> {{ selectedRental?.locker_number }}</p>
            <p><strong>Location (Course):</strong> {{ selectedRental?.course_name }}</p>
            <p>
              <strong>Status:</strong>
              <span
                :class="[
                  'badge status-badge',
                  selectedRental?.status?.toLowerCase() === 'pending'
                    ? 'bg-warning text-dark'
                    : selectedRental?.status?.toLowerCase() === 'reserved'
                    ? 'bg-info text-dark'
                    : selectedRental?.status?.toLowerCase() === 'active'
                    ? 'bg-success'
                    : 'bg-danger',
                ]"
              >
                {{ selectedRental?.status }}
              </span>
            </p>
            <hr />
            <div class="d-flex justify-content-center gap-2">
              <button
                class="btn btn-approve w-50"
                @click="showConfirmModal('approve', selectedRental)"
                :disabled="selectedRental?.status?.toLowerCase() === 'active'"
              >
                <i class="bi bi-check-circle me-1"></i> Approve
              </button>
              <button
                class="btn btn-cancel w-50"
                @click="showConfirmModal('cancel', selectedRental)"
                :disabled="selectedRental?.status?.toLowerCase() === 'active'"
              >
                <i class="bi bi-x-circle me-1"></i> Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ Confirmation Modal -->
    <div class="modal fade" id="confirmModal" tabindex="-1" aria-hidden="true" ref="confirmModalRef">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-warning">
            <h5 class="modal-title text-dark">Confirm Action</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body text-center">
            <p class="mb-0">{{ confirmMessage }}</p>
          </div>
          <div class="modal-footer justify-content-center">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="confirmAction">Confirm</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ Success/Error Modal -->
    <div class="modal fade" id="resultModal" tabindex="-1" aria-hidden="true" ref="resultModalRef">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div :class="['modal-header', resultSuccess ? 'bg-success' : 'bg-danger', 'text-white']">
            <h5 class="modal-title">{{ resultSuccess ? 'Success' : 'Error' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body text-center">
            <p>{{ resultMessage }}</p>
          </div>
          <div class="modal-footer justify-content-center">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>
          </div>
        </div>
      </div>
    </div>
    <!-- ✅ Approve Reservation Modal -->
<div class="modal fade" id="approveModal" tabindex="-1" aria-hidden="true" ref="approveModalRef">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-primary text-white">
        <h5 class="modal-title">Approve Reservation</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <p class="text-muted mb-3">
          Approving Reservation of <strong>{{ approveRental?.f_name }} {{ approveRental?.l_name }}</strong> for Locker Number <strong>{{ approveRental?.locker_number }}</strong>
        </p>
        <div class="mb-3">
          <label class="form-label fw-semibold">Student ID</label>
          <input
            v-model="approveStudentId"
            type="text"
            class="form-control"
            placeholder="Enter Student ID"
            disabled
          />
        </div>
        <div class="mb-3">
          <label class="form-label fw-semibold">Number of Months</label>
          <input
            v-model.number="approveMonths"
            type="number"
            class="form-control"
            min="1"
            placeholder="Enter rental months"
          />
        </div>
      </div>
      <div class="modal-footer justify-content-center">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-success" @click="submitApproval">Approve</button>
      </div>
    </div>
  </div>
</div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import * as bootstrap from "bootstrap";
import { API_BASE_URL } from '@/config/api'
const rentals = ref([]);
const searchQuery = ref("");
const selectedRental = ref(null);
const detailsModalRef = ref(null);
const confirmModalRef = ref(null);
const resultModalRef = ref(null);

let detailsModalInstance = null;
let confirmModalInstance = null;
let resultModalInstance = null;

const confirmMessage = ref("");
const resultMessage = ref("");
const resultSuccess = ref(false);
let confirmActionType = null;
let confirmTargetRental = null;

const approveModalRef = ref(null);
let approveModalInstance = null;

const approveRental = ref(null);
const approveStudentId = ref("");
const approveMonths = ref(1);


const fetchPendingRentals = async () => {
  try {
    const token = localStorage.getItem("token");
    let url = `${API_BASE_URL}/pending-rentals`;
    if (searchQuery.value.trim()) url += `?search=${searchQuery.value.trim()}`;
    const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
    rentals.value = Array.isArray(res.data.records) ? res.data.records : [];
  } catch {
    rentals.value = [];
  }
};

const filteredRentals = computed(() => rentals.value);

const showConfirmModal = (type, rental) => {
  confirmActionType = type;
  confirmTargetRental = rental;

  if (type === "approve") {
    approveRental.value = rental;
    approveStudentId.value = rental.stud_id || "";
    approveMonths.value = 1;
    approveModalInstance.show();
  } else {
    confirmMessage.value = `Are you sure you want to cancel reservation #${rental.rental_id}?`;
    confirmModalInstance.show();
  }
};


const confirmAction = async () => {
  confirmModalInstance.hide();
  if (!confirmTargetRental) return;

  try {
    const token = localStorage.getItem("token");
    let url =
      confirmActionType === "approve"
        ? `${API_BASE_URL}/approve-rental`
        : `${API_BASE_URL}/cancel-rental`;
    const body =
      confirmActionType === "approve"
        ? {
            rental_id: confirmTargetRental.rental_id,
            months: 1,
            paid_months: 1,
            payment_method: "cash",
            remarks: "Approved by admin",
          }
        : { rental_id: confirmTargetRental.rental_id };

    const res = await axios.post(url, body, { headers: { Authorization: `Bearer ${token}` } });
    resultSuccess.value = true;
    resultMessage.value = res.data.message || "Action completed successfully.";
  } catch (err) {
    resultSuccess.value = false;
    resultMessage.value = err.response?.data?.error || "An error occurred.";
  } finally {
    detailsModalInstance?.hide();
    fetchPendingRentals();
    resultModalInstance.show();
  }
};
const submitApproval = async () => {
  const studentId = String(approveStudentId.value || "").trim();

  if (!studentId) {
    alert("Student ID is required.");
    return;
  }
  if (!approveMonths.value || approveMonths.value < 1) {
    alert("Please enter a valid number of months.");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const body = {
      rental_id: approveRental.value.rental_id,
      student_id: studentId,
      months: approveMonths.value,
      paid_months: approveMonths.value,
      payment_method: "cash",
      remarks: `Approved manually by admin for ${approveMonths.value} month(s)`,
    };

    const res = await axios.post(`${API_BASE_URL}/approve-rental`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });

    resultSuccess.value = true;
    resultMessage.value = res.data.message || "Reservation approved successfully!";
  } catch (err) {
    resultSuccess.value = false;
    resultMessage.value = err.response?.data?.error || "An error occurred while approving.";
  } finally {
    approveModalInstance.hide();
    detailsModalInstance?.hide();
    fetchPendingRentals();
    resultModalInstance.show();
  }
};
const openDetailsModal = (rental) => {
  selectedRental.value = rental;
  detailsModalInstance.show();
};

onMounted(() => {
  fetchPendingRentals();
  detailsModalInstance = new bootstrap.Modal(detailsModalRef.value);
  confirmModalInstance = new bootstrap.Modal(confirmModalRef.value);
  resultModalInstance = new bootstrap.Modal(resultModalRef.value);
  approveModalInstance = new bootstrap.Modal(approveModalRef.value);
});

</script>

<style scoped>
/* --- BASE TABLE STYLES (Desktop) --- */
.table-container {
  max-height: 600px;
  overflow-y: auto;
  border-radius: 15px;
  transition: all 0.3s ease-in-out;
}

.table-header {
  background: linear-gradient(135deg, #0d6efd, #007bff);
  color: white;
  font-weight: 600;
  position: sticky; /* Sticky header for scrolling table */
  top: 0;
  z-index: 10;
}

table {
  border-radius: 15px;
  overflow: hidden;
}

table th,
table td {
  padding: 14px 12px;
  vertical-align: middle;
}

tbody tr:hover {
  background-color: #f0f8ff;
  transition: 0.2s ease-in-out;
  box-shadow: inset 0 0 6px rgba(0, 123, 255, 0.15);
}

/* --- BUTTON & BADGE STYLES --- */
.status-badge {
  padding: 8px 14px;
  font-size: 14px;
  border-radius: 50px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.status-badge-sm { /* For card view */
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 50px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.btn-approve,
.btn-cancel {
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  transition: 0.3s ease;
  color: white;
}

.btn-approve {
  background-color: #198754;
}
.btn-approve:hover:not(:disabled) {
  background-color: #157347;
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(25, 135, 84, 0.4);
}

.btn-cancel {
  background-color: #dc3545;
}
.btn-cancel:hover:not(:disabled) {
  background-color: #bb2d3b;
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(220, 53, 69, 0.4);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* --- MOBILE CARD STYLES (Screen < 1200px) --- */
.card-container {
  display: flex;
  flex-direction: column;
}

.scrollable-cards {
  max-height: calc(100vh - 200px); /* Adjust height for scrolling */
  overflow-y: auto;
  padding-right: 5px;
}

.rental-card {
  border: 1px solid #dee2e6;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 8px;
  background-color: white;
  transition: all 0.2s ease;
  cursor: pointer;
}
.rental-card:hover {
  transform: scale(1.01);
  background-color: #f0f8ff;
  border-color: #0d6efd;
}

.card-row {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  font-size: 14px;
}
.card-row > div {
  flex: 1 1 30%;
  min-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 576px) {
  .card-row {
    flex-direction: column;
    gap: 4px;
  }
  .card-row > div {
    flex: 1 1 100%;
    font-size: 13px;
    white-space: normal;
  }
}
</style>
