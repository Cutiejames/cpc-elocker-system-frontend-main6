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
            alt="Logo"
            class="rounded-circle"
            width="50"
            height="50"
            role="button"
            title="Open Sidebar"
            :style="{ cursor: isCollapsed ? 'pointer' : 'default' }"
            @click="isCollapsed ? openSidebar() : null"
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
          style="cursor: pointer"
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
            class="d-flex align-items-center text-white text-decoration-none w-100 sidebar-link"
            :class="{ 'justify-content-center': isCollapsed }"
            :title="isCollapsed ? item.label : ''"
          >
            <img
              :src="item.img"
              alt="nav icon"
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
          to="/dashboard/user-settings"
          class="d-flex align-items-center text-white text-decoration-none w-100 sidebar-link"
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
          class="d-flex align-items-center text-white text-decoration-none w-100 sidebar-link"
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
          class="dropdown-item text-white py-2 mobile-nav-link"
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
          to="/dashboard/user-settings"
          class="dropdown-item text-white py-2 mobile-nav-link"
          @click="mobileMenuOpen = false"
        >
          <img :src="settingsIcon" alt="settings" width="25" height="25" class="me-2" />
          Settings
        </RouterLink>

        <div
          class="dropdown-item py-2 text-danger mobile-nav-link"
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
      <!-- 🔔 Notification Bell -->
      <div class="position-absolute top-0 end-0 mt-3 me-4">
        <div class="position-relative">
          <img
            :src="notifIcon"
            alt="Notifications"
            width="35"
            height="35"
            role="button"
            @click="toggleNotifications"
          />
          <span
            v-if="unreadCount > 0"
            class="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill"
            style="font-size: 0.7rem"
          >
            {{ unreadCount }}
          </span>
        </div>

        <!-- Notification Dropdown -->
        <div
          v-if="showNotifications"
          class="card shadow-sm position-absolute end-0 mt-2"
          style="width: 320px; z-index: 1050;"
        >
          <div class="card-header d-flex justify-content-between align-items-center">
            <span class="fw-bold">Notifications</span>
            <button class="btn btn-sm btn-outline-primary" @click="markAllRead">Mark all as read</button>
          </div>

          <ul class="list-group list-group-flush">
            <li
              v-for="notif in notifications"
              :key="notif.notif_id"
              class="list-group-item small"
              :class="{ 'bg-light': notif.is_read === 1 }"
              role="button"
              @click="markRead(notif.notif_id)"
            >
              <div>{{ notif.message }}</div>
              <div class="text-muted small">{{ formatDate(notif.created_at) }}</div>
            </li>
            <li v-if="notifications.length === 0" class="list-group-item text-center text-muted">
              No notifications
            </li>
          </ul>
        </div>
      </div>

      <!-- Page Content -->
      <!-- Page Content with transition -->
<transition name="page-fade" mode="out-in">
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
import axios from "axios";
import { useLogout } from "@/composables/useLogout";
import { API_BASE_URL } from '@/config/api'
// Import Bootstrap's JavaScript bundle for modal functionality
import bootstrap from "bootstrap/dist/js/bootstrap.bundle";

// Assets
import logo from "@/assets/cpc-logo.jpg";
import brandIcon from "@/assets/hamburger.png";
// User specific icons
import lockerIcon from "@/assets/locker.png";
import rentalIcon from "@/assets/rentalstatus.png";
import supportIcon from "@/assets/contactus.png";
import settingsIcon from "@/assets/settings.png";
import logoutIcon from "@/assets/logout.png";
import notifIcon from "@/assets/notification.png";

export default {
  // Custom directive to close notification dropdown when clicking outside
  directives: {
    'click-outside': {
      mounted(el, binding) {
        el.__clickOutsideHandler = (event) => {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value(event);
          }
        };
        document.body.addEventListener('click', el.__clickOutsideHandler);
      },
      unmounted(el) {
        document.body.removeEventListener('click', el.__clickOutsideHandler);
      },
    },
  },
  setup() {
    const isCollapsed = ref(true);
    const mobileMenuOpen = ref(false);
    const showNotifications = ref(false);
    const notifications = ref([]);
    const unreadCount = ref(0);
    const { logout } = useLogout();
    
    // State for the Bootstrap Modal instance
    let logoutModalInstance = null;

    // --- Sidebar/Menu Handlers ---
    const openSidebar = () => (isCollapsed.value = false);
    const closeSidebar = () => (isCollapsed.value = true);
    const toggleMobileMenu = () => (mobileMenuOpen.value = !mobileMenuOpen.value);
    
    // --- Notification Handlers ---
    const toggleNotifications = () => (showNotifications.value = !showNotifications.value);
    const closeNotifications = () => (showNotifications.value = false);

    // --- Logout Modal Handlers ---
    const showLogoutModal = () => {
        // Ensure mobile menu is closed before showing modal
        mobileMenuOpen.value = false;
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


    // 🔔 Fetch notifications
const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${API_BASE_URL}/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        notifications.value = data;
        unreadCount.value = data.filter((n) => n.is_read === 0).length;
      } catch (err) {
        console.error("❌ Error fetching notifications:", err);
      }
    };
    // 🔔 Mark one as read
    const markRead = async (notif_id) => {
      try {
        const token = localStorage.getItem("token");
        await axios.put(`${API_BASE_URL}/notifications/${notif_id}/read`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await fetchNotifications();
      } catch (err) {
        console.error("❌ Error marking notification as read:", err);
      }
    };

    // 🔔 Mark all as read
    const markAllRead = async () => {
      try {
        const token = localStorage.getItem("token");
        await axios.put(`${API_BASE_URL}/notifications/read-all`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await fetchNotifications();
      } catch (err) {
        console.error("❌ Error marking all notifications as read:", err);
      }
    };

    const formatDate = (dateString) => new Date(dateString).toLocaleString();

    const navLinks = [
      { label: "Locker", path: "/dashboard/user-locker", img: lockerIcon },
      { label: "Rental Status", path: "/dashboard/user-rental", img: rentalIcon },
      { label: "Support", path: "/dashboard/user-support", img: supportIcon },
    ];

    onMounted(() => {
        // Initialize Bootstrap Modal
        const modalElement = document.getElementById('logoutConfirmModal');
        if (modalElement) {
            logoutModalInstance = new bootstrap.Modal(modalElement);
        }

        // Initial data fetch
        fetchNotifications();
    });

    return {
      logo,
      brandIcon,
      settingsIcon,
      logoutIcon,
      notifIcon,
      isCollapsed,
      mobileMenuOpen,
      navLinks,
      openSidebar,
      closeSidebar,
      toggleMobileMenu,
      // Updated logout/modal handlers
      showLogoutModal,
      confirmLogout,
      // Notification handlers/state
      showNotifications,
      notifications,
      unreadCount,
      toggleNotifications,
      closeNotifications,
      markRead,
      markAllRead,
      formatDate,
    };
  },
};
</script>

<style scoped>
/* Ensure Bootstrap Icons (bi) are available for the modal icon */
@import 'bootstrap-icons/font/bootstrap-icons.css';

/*
|--------------------------------------------------------------------------
| BASE STYLES
|--------------------------------------------------------------------------
*/
main {
  /* Inherits transition from inline style for margin-left */
  transition: margin-left 0.3s ease;
}

.card {
  max-height: 400px;
  overflow-y: auto;
}

/* |--------------------------------------------------------------------------
| MOBILE/COLLAPSED LAYOUT ADJUSTMENTS
|--------------------------------------------------------------------------
*/
/* Mobile layout - Main content takes full width */
@media (max-width: 991px) {
  main {
    margin-left: 0 !important;
    /* Add padding for mobile menu button not to obstruct content */
    padding-top: 70px !important;
  }
}
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


/* |--------------------------------------------------------------------------
| TRANSITION EFFECTS
|--------------------------------------------------------------------------
*/
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* |--------------------------------------------------------------------------
| HOVER AND ACTIVE STYLES
|--------------------------------------------------------------------------
*/

/* --- Desktop Sidebar Links (.sidebar-link) --- */

/* The shared class for RouterLink and Logout div */
.sidebar-link {
  /* Set base padding/radius for a clean block background */
  padding: 8px 10px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

/* HOVER STATE: Dark blue background on hover */
.sidebar-link:hover {
  background-color: #004a94 !important; /* A professional dark blue */
}

/* ACTIVE STATE: Background stays dark blue when the link is active (RouterLink) */
/* Targets the classes Vue Router applies to the active link */
a.sidebar-link.router-link-exact-active,
a.sidebar-link.router-link-active {
  background-color: #004a94 !important;
}

/* --- Mobile Dropdown Menu Items (.mobile-nav-link) --- */

.mobile-nav-link {
  /* The default dropdown-item uses transparent background, we need to set it up for hover */
  background-color: transparent !important;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.mobile-nav-link:hover {
  /* Apply dark blue hover for mobile items */
  background-color: rgba(0, 77, 153, 0.7) !important;
  color: #fff !important; /* Ensure text stays white */
}

/* Active State for Mobile Router Links */
.mobile-nav-link.router-link-exact-active,
.mobile-nav-link.router-link-active {
  background-color: #004a94 !important;
  color: #fff !important;
}

/* Ensure mobile logout link has hover effect */
.mobile-nav-link[role="button"]:hover {
  background-color: #004a94 !important;
}
/* Smooth page transition */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.7s ease;
}
.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
/* .modal-header {
  background-color: #0d6efd;
} 
.modal-title{
  color: white;
} */
</style>
