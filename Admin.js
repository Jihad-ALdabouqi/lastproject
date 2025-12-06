// =============== Show Message (Success or Error) ===============
function showMessage(text, type = 'danger') {
  const box = document.getElementById('messageBox');
  if (!box) return;

  box.textContent = text;
  box.className = `alert alert-${type} d-block`;
  box.classList.remove('d-none');

  setTimeout(() => {
    box.classList.add('d-none');
  }, 3000);
}

// =============== Check Admin Access ===============
function checkAdminAccess() {
  // 🔑 Use YOUR existing system: loggedInUser (string), not currentUser (object)
  const username = localStorage.getItem('loggedInUser');

  // ✅ Only user with username "admin" can access
  if (username !== 'admin') {
    showMessage('⛔ Access denied! Only admin can view this page.', 'danger');
    setTimeout(() => {
      window.location.href = 'Login.html'; // ✅ Fixed: was 'index.html'
    }, 2000);
    return false;
  }
  return true;
}

// =============== Update Stats ===============
function updateStats() {
  // 📊 Total Users: from 'users' array (used in Signup/Login)
  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  // 📝 Total Forms: from 'forms' array (used in create_forms)
  const forms = JSON.parse(localStorage.getItem('forms')) || [];

  document.getElementById('totalUsers').textContent = users.length;
  document.getElementById('totalForms').textContent = forms.length;
}

// =============== Handle Logout ===============
function handleLogout() {
  // 🧹 Clear ALL auth data (matches your user system)
  localStorage.removeItem('loggedInUser');
  sessionStorage.removeItem('loggedInUser');

  setTimeout(() => {
    window.location.href = 'Login.html'; // ✅ Fixed redirect
  }, 1000);
}

// =============== Initialize Page ===============
document.addEventListener('DOMContentLoaded', function () {
  // 1️⃣ Check access first
  if (!checkAdminAccess()) return;

  // 2️⃣ Update dashboard stats
  updateStats();

  // 3️⃣ Attach logout to the sidebar link (✅ fixes non-working logout)
  const logoutLink = document.querySelector('.sidebar .nav-item:last-child a');
  if (logoutLink) {
    logoutLink.addEventListener('click', function (e) {
      e.preventDefault(); // prevent default link jump
      handleLogout();
    });
  }
});