// =============== Show Inline Message ===============
function showMessage(text, type = 'danger') {
    const box = document.getElementById('messageBox');
    if (!box) return;
    box.textContent = text;
    box.className = `alert alert-${type} alert-dismissible fade show mx-3`;
    box.classList.remove('d-none');
    setTimeout(() => box.classList.add('d-none'), 5000);
}

// =============== ✅ FIXED: Admin Access Check (matches login.js) ===============
function checkAdminAccess() {
    // 🔑 Your login stores "admin" as STRING in localStorage (for now)
    const username = localStorage.getItem('loggedInUser');  // ✅ NOT 'currentUser'
    if (username !== 'admin') {
        showMessage('⛔ Access denied! Only admins can access this page.', 'danger');
        setTimeout(() => {
            window.location.href = 'Login.html'; // ✅ fixed redirect target
        }, 2500);
        return false;
    }
    return true;
}

// =============== Initialize Page ===============
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAdminAccess()) return; // ✅ Early exit

    loadUsersTable();

    // Setup delete confirmation
    document.getElementById('confirmDeleteBtn')?.addEventListener('click', () => {
        if (window.deleteUserId) {
            deleteUser(window.deleteUserId);
            bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'))?.hide();
            delete window.deleteUserId;
        }
    });

    // 🔐 Optional: Add logout handler (like other admin pages)
    const logoutLink = document.querySelector('.sidebar .nav-item:last-child a');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('loggedInUser');
            sessionStorage.removeItem('loggedInUser');
            window.location.href = 'Login.html';
        });
    }
});

// =============== User Table Functions ===============
function loadUsersTable() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">No users yet</td></tr>';
        return;
    }

    users.forEach((user, index) => {
        const actionButtons = `
            <button class="btn btn-sm btn-edit me-1" onclick="openEditModal('${user.username}')">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-sm btn-delete" onclick="showDeleteConfirm('${user.username}')">
                <i class="fas fa-trash"></i> Delete
            </button>
        `;

        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${actionButtons}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function openEditModal(username) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username);
    if (!user) {
        showMessage('User not found.', 'danger');
        return;
    }

    document.getElementById('editUsername').value = user.username;
    document.getElementById('editName').value = user.username;
    document.getElementById('editEmail').value = user.email;
    // ⚠️ Removed status field

    const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
    modal.show();
}

function saveEditedUser() {
    const oldUsername = document.getElementById('editUsername').value;
    const newUsername = document.getElementById('editName').value.trim();
    const email = document.getElementById('editEmail').value.trim();

    if (!newUsername || !email) {
        showMessage('All fields are required.', 'warning');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email.', 'warning');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.username === oldUsername);

    if (userIndex === -1) {
        showMessage('User not found.', 'danger');
        return;
    }

    if (newUsername !== oldUsername) {
        const usernameExists = users.some(u => u.username === newUsername);
        if (usernameExists) {
            showMessage('Username already exists.', 'warning');
            return;
        }
    }

    // Update user data (no status)
    users[userIndex].username = newUsername;
    users[userIndex].email = email;
    localStorage.setItem('users', JSON.stringify(users));

    // Update forms if needed (optional but kept for data consistency)
    let forms = JSON.parse(localStorage.getItem('forms')) || [];
    forms = forms.map(form => {
        if (form.createdBy === oldUsername) {
            return { ...form, createdBy: newUsername };
        }
        return form;
    });
    localStorage.setItem('forms', JSON.stringify(forms));

    showMessage('User updated successfully!', 'success');
    loadUsersTable();

    const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
    if (modal) modal.hide();
}

function showDeleteConfirm(username) {
    window.deleteUserId = username;
    const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    modal.show();
}

function deleteUser(username) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.filter(u => u.username !== username);
    localStorage.setItem('users', JSON.stringify(users));

    showMessage('User deleted successfully.', 'success');
    loadUsersTable();
}
