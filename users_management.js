// =============== Show Inline Message ===============
function showMessage(text, type = 'danger') {
    const box = document.getElementById('messageBox');
    if (!box) return;
    box.textContent = text;
    box.className = `alert alert-${type} alert-dismissible fade show mx-3`;
    box.classList.remove('d-none');
    setTimeout(() => {
        box.classList.add('d-none');
    }, 5000);
}

// =============== Admin Access Check ===============
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // التحقق من أن المستخدم مسجل دخوله وأنه مشرف
    if (!currentUser || currentUser.role !== 'admin') {
        showMessage('Access denied! Only admins can access this page.', 'danger');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2500);
        return;
    }

    // تحميل جدول المستخدمين
    loadUsersTable();

    // ربط زر التأكيد في مودال الحذف
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            if (window.deleteUserId) {
                deleteUser(window.deleteUserId);
                const modal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
                if (modal) modal.hide();
            }
        });
    }
});

// =============== Load Users Table ===============
function loadUsersTable() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No users yet</td></tr>';
        return;
    }

    const forms = JSON.parse(localStorage.getItem('forms')) || [];

    users.forEach((user, index) => {
        const userFormsCount = forms.filter(f => f.createdBy === user.username).length;

        const statusBadge = user.status === 'active'
            ? '<span class="badge badge-active">Active</span>'
            : '<span class="badge badge-pending">Pending</span>';

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
                <td>${statusBadge}</td>
                <td>${userFormsCount}</td>
                <td>${actionButtons}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// =============== Open Edit Modal ===============
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
    document.getElementById('editStatus').value = user.status;

    const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
    modal.show();
}

// =============== Save Edited User ===============
function saveEditedUser() {
    const oldUsername = document.getElementById('editUsername').value;
    const newUsername = document.getElementById('editName').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const status = document.getElementById('editStatus').value;

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

    // تحديث بيانات المستخدم
    users[userIndex].username = newUsername;
    users[userIndex].email = email;
    users[userIndex].status = status;
    localStorage.setItem('users', JSON.stringify(users));

    // تحديث بيانات النماذج المرتبطة
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

// =============== Show Delete Confirmation ===============
function showDeleteConfirm(username) {
    window.deleteUserId = username;
    const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    modal.show();
}

// =============== Delete User ===============
function deleteUser(username) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.filter(u => u.username !== username);
    localStorage.setItem('users', JSON.stringify(users));

    // يمكنك إلغاء التعليق أدناه إذا أردت حذف النماذج أيضًا
    // let forms = JSON.parse(localStorage.getItem('forms')) || [];
    // forms = forms.filter(f => f.createdBy !== username);
    // localStorage.setItem('forms', JSON.stringify(forms));

    showMessage('User deleted successfully.', 'success');
    loadUsersTable();
}