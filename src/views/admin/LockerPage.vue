<template>
  <div class="container my-5 pb-5">
<div class="d-flex justify-content-end mb-3">
  <button
    class="btn btn-primary fw-semibold shadow-sm"
    data-bs-toggle="modal"
    data-bs-target="#addLockerModal"
  >
    <i class="bi bi-plus-lg me-1"></i> Add Locker
  </button>
</div>

<div
  class="modal fade"
  id="addLockerModal"
  tabindex="-1"
  aria-labelledby="addLockerModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <!-- 🔵 Changed from bg-success to bg-primary -->
      <div class="modal-header bg-primary text-white">
        <h5 class="modal-title fw-bold" id="addLockerModalLabel">Add New Locker</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <div class="modal-body">
        <div class="mb-3">
          <label class="form-label">Locker Number</label>
          <input
            v-model.trim="newLocker.locker_number"
            class="form-control"
            placeholder="e.g. A01"
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Location</label>
          <input
            v-model="newLocker.location"
            class="form-control"
            placeholder="e.g. Ground Floor"
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Remarks</label>
          <input
            v-model="newLocker.remarks"
            class="form-control"
            placeholder="Optional notes"
          />
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <!-- 🔵 Changed from btn-success to btn-primary -->
        <button
          type="button"
          class="btn btn-primary"
          @click="addLocker"
          data-bs-dismiss="modal"
        >
          <i class="bi bi-check-circle me-1"></i> Save Locker
        </button>
      </div>
    </div>
  </div>
</div>

    <div class="stats d-flex justify-content-start gap-4 mb-4">
      <div><span class="dot bg-danger"></span> RENTED</div>
      <div><span class="dot bg-warning"></span> RESERVED</div>
      <div><span class="dot bg-success"></span> AVAILABLE</div>
    </div>

    <div v-if="sortedLockers.length" class="row justify-content-center mb-5 position-relative">
      <div
        v-if="hoveredLocker && ['rented', 'reserved'].includes(hoveredLocker.status)"
        class="custom-hover-box"
        :style="{ left: hoverBoxPosition.left, top: hoverBoxPosition.top }"
      >
        <p class="mb-1 fw-bold text-dark text-truncate" style="font-size: 13px;">
          {{ hoveredLocker.status.toUpperCase() }}
        </p>
        <p class="mb-1 text-dark text-truncate">Name: {{ hoveredLocker.student_name }}</p>
        <p class="mb-1 text-dark text-truncate">Course: {{ hoveredLocker.course_name }}</p>
        <p class="mb-0 text-muted small">ID: {{ hoveredLocker.student_id_number }}</p>
      </div>

      <div class="col-md-6 text-center">
        <h5 class="fw-bold mb-3">{{ currentBatchLetters[0] }}</h5>
        <div class="row g-3 justify-content-center">
          <div
            v-for="locker in leftBatch"
            :key="locker.locker_id"
            class="col-3 d-flex justify-content-center"
            @mouseenter="showHoverBox($event, locker)"
            @mouseleave="hideHoverBox"
          >
            <div
              class="card locker-card shadow-sm"
              :class="{ selected: selectedLocker && selectedLocker.locker_id === locker.locker_id }"
              @click="openLocker(locker)"
            >
              <div class="card-body text-center p-3">
                <div class="locker-icon-wrapper mb-2">
                  <img :src="lockerIcon" alt="Locker" class="locker-icon" />
                </div>
                <div class="locker-number">{{ locker.locker_number }}</div>
                <div class="status-dot mt-1" :class="statusColor(locker.status)"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6 text-center">
        <h5 class="fw-bold mb-3">{{ currentBatchLetters[1] }}</h5>
        <div class="row g-3 justify-content-center">
          <div
            v-for="locker in rightBatch"
            :key="locker.locker_id"
            class="col-3 d-flex justify-content-center"
            @mouseenter="showHoverBox($event, locker)"
            @mouseleave="hideHoverBox"
          >
            <div
              class="card locker-card shadow-sm"
              :class="{ selected: selectedLocker && selectedLocker.locker_id === locker.locker_id }"
              @click="openLocker(locker)"
            >
              <div class="card-body text-center p-3">
                <div class="locker-icon-wrapper mb-2">
                  <img :src="lockerIcon" alt="Locker" class="locker-icon" />
                </div>
                <div class="locker-number">{{ locker.locker_number }}</div>
                <div class="status-dot mt-1" :class="statusColor(locker.status)"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-muted py-5">
      <h5>No lockers found.</h5>
    </div>

    <div
      v-if="selectedLocker"
      class="modal fade show"
      style="display: block; background: rgba(0,0,0,0.5);"
      tabindex="-1"
      @click.self="selectedLocker = null"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              Locker {{ selectedLocker.locker_number }}
            </h5>
            <button type="button" class="btn-close" @click="selectedLocker = null"></button>
          </div>

          <div class="modal-body" v-if="selectedLocker">
            <template v-if="selectedLocker.status === 'available'">
              <form @submit.prevent="submitLockerAction">
                <div class="mb-3">
                  <label class="form-label fw-semibold">Student ID</label>
                  <input
                    v-model.trim="form.student_id"
                    type="text"
                    class="form-control"
                    placeholder="Enter Student ID"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold">Months to Rent</label>
                  <input
                    v-model.number="form.months"
                    type="number"
                    class="form-control"
                    min="1"
                    required
                  />
                </div>

                <div class="d-flex justify-content-end mt-4">
                  <button type="button" class="btn btn-secondary me-2" @click="selectedLocker = null">Cancel</button>
                  <button type="submit" class="btn btn-primary">Confirm Rent</button>
                </div>
              </form>
            </template>

            <template v-else-if="selectedLocker.status === 'rented'">
              <p class="text-center text-danger fw-semibold fs-5">This locker is currently RENTED.</p>
              <div class="mt-3 text-start ms-4">
                <p><strong>Student Name:</strong> {{ selectedLocker.student_name || 'N/A' }}</p>
                <p><strong>Student ID:</strong> {{ selectedLocker.student_id_number || 'N/A' }}</p>
                <p><strong>Course:</strong> {{ selectedLocker.course_name || 'N/A' }}</p>
              </div>
              <div class="text-center mt-3">
                <button class="btn btn-primary" @click="selectedLocker = null">Okay</button>
              </div>
            </template>

            <template v-else-if="selectedLocker.status === 'reserved'">
              <p class="text-center text-warning fw-semibold fs-5">This locker is currently RESERVED.</p>
              <div class="mt-3 text-start ms-4">
                <p><strong>Student Name:</strong> {{ selectedLocker.student_name || 'N/A' }}</p>
                <p><strong>Student ID:</strong> {{ selectedLocker.student_id_number || 'N/A' }}</p>
                <p><strong>Course:</strong> {{ selectedLocker.course_name || 'N/A' }}</p>
              </div>
              <div class="text-center mt-3">
                <button class="btn btn-primary" @click="selectedLocker = null">Okay</button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div v-if="sortedLockers.length" class="pagination-footer">
      <button class="btn btn-outline-primary" @click="prevPage" :disabled="currentPage === 1">‹ Prev</button>

      <div class="d-flex gap-2">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          class="page-circle"
          :class="{ active: currentPage === page }"
        >
          {{ page }}
        </button>
      </div>

      <button class="btn btn-outline-primary" @click="nextPage" :disabled="currentPage === totalPages">
        Next ›
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import lockerIcon from "@/assets/locker-black.png";
import { API_BASE_URL } from '@/config/api'
export default {
  name: "LockersPage",
  data() {
    return {
      lockers: [],
      activeRentals: [],
      newLocker: { locker_number: "", location: "", remarks: "" },
      selectedLocker: null,
      currentPage: 1,
      lockerIcon,
      letters: ["A", "B", "C", "D"],
      form: { student_id: "", months: 1, paid_months: 1 },
      ratePerMonth: 60,
      hoveredLocker: null,
      hoverBoxPosition: { left: '0px', top: '0px' }
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.letters.length / 2);
    },
    currentBatchLetters() {
      const index = (this.currentPage - 1) * 2;
      return [this.letters[index], this.letters[index + 1]];
    },
    sortedLockers() {
      if (!Array.isArray(this.lockers)) return [];

      const lockersWithTenants = [...this.lockers].map(locker => {
        const tenant = this.activeRentals.find(t => t.locker_id === locker.locker_id);

        locker.status = locker.status || 'available';

        if (tenant) {
          locker.status = tenant.status || "rented";
          locker.student_name = `${tenant.f_name} ${tenant.l_name}`;
          locker.student_id_number = tenant.stud_id; 
          locker.course_name = tenant.course_name || "N/A";
        } else {
          delete locker.student_name;
          delete locker.student_id_number;
          delete locker.course_name;
        }

        return locker;
      });

      return lockersWithTenants.sort((a, b) => {
        const letterA = a.locker_number?.charAt(0).toUpperCase() || "";
        const letterB = b.locker_number?.charAt(0).toUpperCase() || "";
        const numA = parseInt(a.locker_number?.slice(1)) || 0;
        const numB = parseInt(b.locker_number?.slice(1)) || 0;
        if (letterA === letterB) return numA - numB;
        return letterA.localeCompare(letterB);
      });
    },
    leftBatch() {
      return this.sortedLockers.filter(l => l.locker_number?.startsWith(this.currentBatchLetters[0]));
    },
    rightBatch() {
      return this.sortedLockers.filter(l => l.locker_number?.startsWith(this.currentBatchLetters[1]));
    },
    computedAmountPaid() {
      return (this.form.paid_months || 0) * this.ratePerMonth;
    },
    computedBalance() {
      return this.form.months * this.ratePerMonth - (this.form.paid_months || 0) * this.ratePerMonth;
    },
    computedDueDate() {
      if ((this.form.paid_months || 0) <= 0) return "N/A";
      const now = new Date();
      now.setMonth(now.getMonth() + (this.form.paid_months || 0));
      return now.toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" });
    },
  },
  methods: {
    showHoverBox(event, locker) {
      if (['rented', 'reserved'].includes(locker.status)) {
        this.hoveredLocker = locker;

        this.$nextTick(() => {
          const targetEl = event.currentTarget.querySelector('.locker-card');
          if (!targetEl) return;

          const targetRect = targetEl.getBoundingClientRect();
          const gridContainer = this.$el.querySelector('.row.justify-content-center');
          const containerRect = gridContainer ? gridContainer.getBoundingClientRect() : { left: 0, top: 0 };

          const hoverBoxWidth = 220; // Updated width
          const hoverBoxHeight = 100; // Approximate new height of the box + padding
          const offsetFromContainerLeft = targetRect.left - containerRect.left;
          const left = offsetFromContainerLeft + (targetRect.width / 2) - (hoverBoxWidth / 2);
          const top = targetRect.top - containerRect.top - hoverBoxHeight - 10; // Adjusted top for new height

          this.hoverBoxPosition = {
            left: `${left}px`,
            top: `${top}px`
          };
        });
      } else {
        this.hoveredLocker = null;
      }
    },
    hideHoverBox() {
      this.hoveredLocker = null;
    },
    async fetchLockers() {
      try {
        const [lockerRes, tenantRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/locker/lockers`),
          axios.get(`${API_BASE_URL}/tenant-info`) 
        ]);

        this.lockers = Array.isArray(lockerRes.data) ? lockerRes.data : lockerRes.data.lockers || [];
        this.activeRentals = Array.isArray(tenantRes.data) ? tenantRes.data : tenantRes.data.tenants || [];

      } catch (error) {
        console.error("Error fetching lockers or tenants:", error);
        this.lockers = [];
        this.activeRentals = [];
      }
    },
    async addLocker() {
      this.newLocker.locker_number = this.newLocker.locker_number.trim();
      if (!this.newLocker.locker_number) return alert("Please enter a locker number.");
      try {
        const res = await axios.post(`${API_BASE_URL}/locker/add`, this.newLocker, { withCredentials: true });
        alert(res.data.message || "Locker added successfully!");
        this.newLocker = { locker_number: "", location: "", remarks: "" };
        this.fetchLockers();
      } catch (error) {
        console.error("Add Locker Error:", error);
        alert(error.response?.data?.error || error.response?.data?.message || "Failed to add locker.");
      }
    },
    statusColor(status) {
      switch (status) {
        case "rented": return "bg-danger";
        case "reserved": return "bg-warning";
        case "available": return "bg-success";
        default: return "bg-secondary";
      }
    },
    openLocker(locker) {
      this.selectedLocker = locker;
      this.form = { student_id: "", months: 1 }; 
    },
    async submitLockerAction() {
      this.form.student_id = this.form.student_id.trim();
      if (!this.form.student_id) return alert("Please enter a Student ID.");
      if (this.form.months < 1) return alert("Please check the months to rent field."); 
      
      const paidMonths = this.form.months; 
      
      try {
        const locker_id = this.selectedLocker.locker_id;
        const url = `${API_BASE_URL}/locker/transaction`;
        const payload = { 
            locker_id, 
            student_id: this.form.student_id, 
            months: this.form.months, 
            paid_months: paidMonths, 
            action_type: "rent", 
            payment_method: "Cash" 
        };
        const response = await axios.post(url, payload, { withCredentials: true });
        alert(response.data.message || "Locker rental successful!");
        this.selectedLocker = null;
        await this.fetchLockers();
      } catch (error) {
        console.error("Locker transaction failed:", error.response?.data || error.message);
        alert(error.response?.data?.error || error.response?.data?.message || "Something went wrong during rental assignment.");
      }
    },
    nextPage() { if (this.currentPage < this.totalPages) this.currentPage++; },
    prevPage() { if (this.currentPage > 1) this.currentPage--; },
    goToPage(page) { this.currentPage = page; },
  },
  mounted() {
    this.fetchLockers();
  },
};
</script>

<style scoped>
/* Custom Hover Box Styling */
.row.justify-content-center {
  position: relative;
}

.custom-hover-box {
  position: absolute;
  width: 220px; /* Increased width */
  background-color: white; /* Changed to white */
  color: black; /* Changed to black */
  border-radius: 8px; /* Slightly larger border-radius */
  padding: 12px; /* Increased padding */
  z-index: 1000;
  box-shadow: 0 6px 12px rgba(0,0,0,0.2); /* Adjusted shadow for lighter background */
  pointer-events: none;
  font-size: 15px; /* Slightly larger default font size */
  line-height: 1.4; /* Adjusted line height for readability */
  transition: opacity 0.2s, transform 0.2s;
  border: 1px solid #dee2e6; /* Added a subtle border */
}

.custom-hover-box p {
  margin-bottom: 4px !important; /* Adjusted margin */
}

/* Specific text color for status and ID to ensure visibility against white background */
.custom-hover-box .text-dark {
  color: #212529 !important; /* Bootstrap's dark color */
}
.custom-hover-box .text-muted {
  color: #6c757d !important; /* Bootstrap's muted color */
}


.custom-hover-box::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 8px 8px 0;
  border-style: solid;
  border-color: white transparent transparent transparent; /* Changed arrow color to white */
}
/* End Custom Hover Box Styling */

/* Existing Styles */
.stats { margin-bottom: 60px; }
.dot { display: inline-block; width: 12px; height: 12px; border-radius: 50%; margin-right: 4px; }
.locker-card { width: 90px; border: none; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.25)!important; transition: transform 0.2s ease; cursor: pointer; background: white; }
.locker-card:hover { transform: translateY(-4px); }
.locker-icon-wrapper { border-bottom: 3px solid #000; padding-bottom: 6px; display: flex; justify-content: center; }
.locker-icon { width: 45px; }
.locker-number { font-weight: bold; font-size: 14px; }
.status-dot { width: 10px; height: 10px; border-radius: 50%; margin: 0 auto; }
.pagination-footer { position: relative; bottom: -150px; background: white; padding: 10px 0; display: flex; justify-content: center; align-items: center; gap: 15px; }
.page-circle { width: 38px; height: 38px; border-radius: 50%; border: 2px solid #007bff; background-color: white; color: #007bff; font-weight: bold; font-size: 15px; text-align: center; line-height: 34px; cursor: pointer; }
.page-circle.active { background-color: #007bff; color: white; box-shadow: 0 0 8px rgba(0,123,255,0.5); }
@media (max-width: 768px) {
.stats { justify-content: flex-start; gap: 1.2rem; }
.locker-card { max-width: 90px; }
.locker-icon { width: 34px; }
.locker-number { font-size: 12px; }
.page-circle { width: 34px; height: 34px; font-size: 13px; line-height: 30px; }
.modal-content { border-radius: 0.5rem; }
}
</style>