// src/composables/useLogout.js
export function useLogout() {
  const logout = ({ showAlert = true } = {}) => {
    // 🧹 Remove auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();

    // ✅ Optional alert
    if (showAlert) {
      alert("Logout successful!");
    }

    // 🔁 Redirect to login page
    window.location.href = "/";
  };

  return { logout };
}
