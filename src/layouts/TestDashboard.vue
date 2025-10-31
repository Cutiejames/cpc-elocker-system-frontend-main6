<template>
  <div>
    <aside
      class="bg-dark text-white p-3 position-fixed top-0 start-0 h-100 d-none d-lg-flex flex-column"
      :style="{
        width: isCollapsed ? '90px' : '250px',
        transition: 'width 0.3s ease',
        zIndex: 1050,
        boxShadow: '0 0 15px rgba(0,0,0,0.3)',
      }"
    >
      <div
        class="d-flex align-items-center justify-content-between mb-4"
        :class="{ 'flex-column': isCollapsed }"
      >
        <div
          class="d-flex align-items-center justify-content-center w-100"
          style="gap: 8px"
        >
          <img
            :src="logo"
            alt="CPC Logo"
            class="rounded-circle"
            width="50"
            height="50"
            role="button"
            @click="openSidebar"
            title="Open Sidebar"
          />
          <span
            v-if="!isCollapsed"
            class="fw-bold"
            style="font-size: 18px"
          >
            CPC E-Locker
          </span>
        </div>

        <img
          v-if="!isCollapsed"
          :src="brandIcon"
          alt="Collapse"
          class="ms-auto mt-2 collapse-btn"
          width="25"
          height="18"
          role="button"
          @click="closeSidebar"
          title="Collapse Sidebar"
        />
      </div>

      <div class="flex-grow-1 mt-3">
        <div
          v-for="item in navLinks"
          :key="item.label"
          class="nav-item text-white d-flex align-items-center mb-3"
          :class="{ 'justify-content-center': isCollapsed }"
        >
          <RouterLink
            :to="item.path"
            class="d-flex align-items-center text-white text-decoration-none w-100 nav-link-custom"
            :class="{ 'justify-content-center': isCollapsed }"
            :title="isCollapsed ? item.label : ''"
          >
            <img
              :src="item.img"
              alt="icon"
              width="40"
              height="40"
              :class="[isCollapsed ? '' : 'me-2']"
            />
            <span v-if="!isCollapsed">{{ item.label }}</span>
          </RouterLink>
        </div>

        <hr class="border-secondary my-2" />
      </div>

      <div
        class="nav-item text-white d-flex align-items-center mb-2"
        :class="{ 'justify-content-center': isCollapsed }"
      >
        <RouterLink
          to="/TestDashboard/settings"
          class="d-flex align-items-center text-white text-decoration-none w-100 nav-link-custom"
          :class="{ 'justify-content-center': isCollapsed }"
          :title="isCollapsed ? 'Settings' : ''"
        >
          <img
            :src="settingsIcon"
            alt="settings"
            width="40"
            height="40"
            :class="[isCollapsed ? '' : 'me-2']"
          />
          <span v-if="!isCollapsed">Settings</span>
        </RouterLink>
      </div>

      <hr class="border-secondary my-2" />

      <div
        class="nav-item text-white d-flex align-items-center"
        :class="{ 'justify-content-center': isCollapsed }"
      >
        <div
          role="button"
          class="d-flex align-items-center text-white text-decoration-none w-100 nav-link-custom logout-link"
          :class="{ 'justify-content-center': isCollapsed }"
          :title="isCollapsed ? 'Logout' : ''"
          @click="showLogoutModal"
        >
          <img
            :src="logoutIcon"
            alt="logout"
            width="40"
            height="40"
            :class="[isCollapsed ? '' : 'me-2']"
          />
          <span v-if="!isCollapsed">Logout</span>
        </div>
      </div>
    </aside>

    <button
      class="btn text-white position-fixed d-lg-none"
      style="
        background-color: #212529;
        top: 15px;
        left: 15px;
        z-index: 2000;
        border-radius: 10px;
        padding: 8px 10px;
      "
      @click="toggleMobileMenu"
    >
      <img :src="brandIcon" alt="menu" width="28" height="18" />
    </button>

    <transition name="fade-slide">
      <div
        v-if="mobileMenuOpen"
        class="position-fixed bg-dark border rounded shadow-lg p-2 d-lg-none"
        style="top: 60px; left: 10px; z-index: 1999; width: 200px"
      >
        <RouterLink
          v-for="item in navLinks"
          :key="item.label"
          :to="item.path"
          class="dropdown-item text-white py-2 mobile-dropdown-item"
          @click="mobileMenuOpen = false"
        >
          <img
            :src="item.img"
            alt="icon"
            width="25"
            height="25"
            class="me-2"
          />
          {{ item.label }}
        </RouterLink>

        <hr class="my-2 text-secondary" />

        <RouterLink
          to="/TestDashboard/settings"
          class="dropdown-item text-white py-2 mobile-dropdown-item"
          @click="mobileMenuOpen = false"
        >
          <img :src="settingsIcon" alt="settings" width="25" height="25" class="me-2" />
          Settings
        </RouterLink>

        <div
          class="dropdown-item py-2 text-danger mobile-dropdown-item logout-link"
          role="button"
          @click="showLogoutModal"
        >
          <img :src="logoutIcon" alt="logout" width="25" height="25" class="me-2" />
          Logout
        </div>
      </div>
    </transition>

<main
  class="p-4 bg-light"
  style="min-height: 100vh; transition: margin-left 0.3s ease"
  :style="{ marginLeft: isCollapsed ? '90px' : '250px' }"
>
  <transition name="fade-page" mode="out-in">
    <RouterView />
  </transition>
</main>


    <div
      class="modal fade"
      id="logoutConfirmModal"
      tabindex="-1"
      aria-labelledby="logoutConfirmModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-warning text-dark">
            <h5 class="modal-title" id="logoutConfirmModalLabel">Confirm Logout</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>
              <i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>
              Are you sure you want to log out of your account?
            </p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="confirmLogout"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useLogout } from "@/composables/useLogout";
// Import Bootstrap's JavaScript bundle for modal functionality
import bootstrap from "bootstrap/dist/js/bootstrap.bundle";

// Assets
import logo from "@/assets/cpc-logo.jpg";
import brandIcon from "@/assets/hamburger.png";
import dashboardIcon from "@/assets/dashboard@2x.png";
import lockerIcon from "@/assets/locker.png";
import assetsIcon from "@/assets/groups.png";
import reservationIcon from "@/assets/reservation.png";
import userIcon from "@/assets/user.png";
import auditlogIcon from "@/assets/auditlog.png";
import supportIcon from "@/assets/contactus.png";
import settingsIcon from "@/assets/settings.png";
import logoutIcon from "@/assets/logout.png";

const API_BASE_URL = process.env.VUE_APP_API_URL;
export default {
  setup() {
    const isCollapsed = ref(true); // Start collapsed by default
    const mobileMenuOpen = ref(false);
    const { logout } = useLogout();
    
    // State for the Bootstrap Modal instance
    let logoutModalInstance = null;

    onMounted(() => {
        // Initialize the Bootstrap modal once the component is mounted
        const modalElement = document.getElementById('logoutConfirmModal');
        logoutModalInstance = new bootstrap.Modal(modalElement);
    });

    // Method to show the modal
    const showLogoutModal = () => {
        // Close mobile menu if open
        mobileMenuOpen.value = false;
        // Show the Bootstrap modal
        if (logoutModalInstance) {
            logoutModalInstance.show();
        }
    };

const confirmLogout = async () => {
    if (logoutModalInstance) {
        logoutModalInstance.hide();
    }

    // Immediately log out and redirect
    await logout({ showAlert: false });
};



    const openSidebar = () => {
      if (isCollapsed.value) isCollapsed.value = false;
    };

    const closeSidebar = () => {
      if (!isCollapsed.value) isCollapsed.value = true;
    };

    const toggleMobileMenu = () => (mobileMenuOpen.value = !mobileMenuOpen.value);

    const navLinks = [
      { label: "Dashboard", path: `${API_BASE_URL}/TestDashboard/admin-dashboard`, img: dashboardIcon },
      { label: "LockerPage", path: `/TestDashboard/lockerpage`, img: lockerIcon },
      { label: "Rental Status", path: `/TestDashboard/rentalstatus`, img: assetsIcon },
      { label: "Reservation", path: `/TestDashboard/reservationstatus`, img: reservationIcon },
      { label: "User", path: `/TestDashboard/user`, img: userIcon },
      { label: "Audit Logs", path: `/TestDashboard/audit`, img: auditlogIcon },
      { label: "Support", path: `/TestDashboard/support`, img: supportIcon },
    ];

    return {
      logo,
      brandIcon,
      isCollapsed,
      mobileMenuOpen,
      navLinks,
      settingsIcon,
      logoutIcon,
      openSidebar,
      closeSidebar,
      toggleMobileMenu,
      // Updated logout methods
      showLogoutModal,
      confirmLogout,
    };
  },
};
</script>

<style scoped>
/* Ensure Bootstrap Icons (bi) are available for the modal icon */
@import 'bootstrap-icons/font/bootstrap-icons.css';

main {
  transition: margin-left 0.3s ease;
}

/* Sidebar floats on desktop */
@media (min-width: 1100px) {
  main {
    margin-left: 0 !important;
  }
}

/* Mobile layout adjustments */
@media (max-width: 1099px) {
  main {
    margin-left: 0 !important;
    padding-top: 70px;
  }
}

/* Transition effect */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Collapse button animation */
.collapse-btn {
  transition: opacity 0.3s;
  cursor: pointer;
}

/* ---------------------------------------------------- */
/* HOVER AND ACTIVE STYLES (Kept from original)         */
/* ---------------------------------------------------- */

/* Base style for desktop sidebar links (RouterLinks and Logout div) */
.nav-link-custom {
  /* Set base padding/radius for a clean block background */
  padding: 8px 10px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

/* HOVER STATE: Dark blue background on hover for all desktop links */
.nav-link-custom:hover {
  background-color: #004a94 !important; /* A professional dark blue */
}

/* ACTIVE STATE: Background stays dark blue when the link is active */
/* Vue Router adds the 'router-link-exact-active' class */
.nav-link-custom.router-link-exact-active,
.nav-link-custom.router-link-active {
  background-color: #004a94 !important;
}

/* Mobile Dropdown Menu Items */

.mobile-dropdown-item {
  /* Override default Bootstrap dropdown-item styles for a better look */
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.mobile-dropdown-item:hover {
  /* Apply dark blue hover for mobile items */
  background-color: rgba(0, 77, 153, 0.7) !important;
  color: #fff !important; /* Ensure text stays white */
}

/* Active State for Mobile Links */
.mobile-dropdown-item.router-link-exact-active,
.mobile-dropdown-item.router-link-active {
  background-color: #004a94 !important;
  color: #fff !important;
}

/* Logout link specific styling (optional but good practice) */
.logout-link:hover {
  /* Keep the same dark blue hover but you could also use a subtle red hover if preferred */
  background-color: #004a94 !important;
  color: #fff !important;
}
.fade-page-enter-active,
.fade-page-leave-active {
  transition: all 0.8s ease;
}

.fade-page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>