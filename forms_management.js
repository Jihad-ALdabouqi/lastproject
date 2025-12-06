// =============== Show Message ===============
function showMessage(text, type = 'danger') {
  const box = document.getElementById('messageBox');
  if (!box) return;
  box.textContent = text;
  box.className = `alert alert-${type} d-block mx-3`;
  box.classList.remove('d-none');
  setTimeout(() => box.classList.add('d-none'), 3000);
}

// =============== Check Admin Access ===============
function checkAdminAccess() {
  const username = localStorage.getItem('loggedInUser');
  if (username !== 'admin') {
    showMessage('⛔ Access denied! Admins only.', 'danger');
    setTimeout(() => window.location.href = 'Login.html', 2000);
    return false;
  }
  return true;
}

// =============== Handle Logout ===============
function handleLogout() {
  localStorage.removeItem('loggedInUser');
  sessionStorage.removeItem('loggedInUser');
  showMessage('✅ Logged out.', 'success');
  setTimeout(() => window.location.href = 'Login.html', 1000);
}

// =============== Load Forms Table ===============
function loadFormsTable() {
  const forms = JSON.parse(localStorage.getItem('forms')) || [];
  const tbody = document.getElementById('formsTableBody');
  tbody.innerHTML = '';

  if (forms.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4">No forms yet</td></tr>';
    return;
  }

  forms.forEach((form, index) => {
    const statusBadge = form.status === 'active'
      ? '<span class="badge badge-active px-2 py-1">Active</span>'
      : '<span class="badge badge-inactive px-2 py-1">Inactive</span>';

    const actionButtons = `
      <button class="btn btn-sm btn-edit me-1" onclick="editFormInline('${form.formId}', this)">
        <i class="fas fa-edit"></i> Edit
      </button>
      <button class="btn btn-sm ${form.status === 'active' ? 'btn-deactivate' : 'btn-activate'} me-1"
              onclick="toggleFormStatus('${form.formId}')">
        <i class="fas fa-toggle-${form.status === 'active' ? 'off' : 'on'}"></i> 
        ${form.status === 'active' ? 'Deactivate' : 'Activate'}
      </button>
      <button class="btn btn-sm btn-delete" onclick="showDeleteConfirm('${form.formId}')">
        <i class="fas fa-trash"></i> Delete
      </button>
    `;

    const row = `
      <tr data-form-id="${form.formId}">
        <td>${index + 1}</td>
        <td>${form.title || 'Untitled'}</td>
        <td>${form.questions?.length || 0}</td>
        <td>${form.createdAt ? new Date(form.createdAt).toLocaleDateString('en-GB') : '—'}</td>
        <td>${statusBadge}</td>
        <td>${actionButtons}</td>
      </tr>
    `;
    tbody.insertAdjacentHTML('beforeend', row);
  });
}

// =============== Toggle Form Status ===============
function toggleFormStatus(formId) {
  let forms = JSON.parse(localStorage.getItem('forms')) || [];
  const form = forms.find(f => f.formId === formId);
  if (form) {
    form.status = form.status === 'active' ? 'inactive' : 'active';
    localStorage.setItem('forms', JSON.stringify(forms));
    showMessage(`✅ Form "${form.title}" is now ${form.status}.`, 'success');
    loadFormsTable();
  }
}

// =============== Show Delete Confirmation ===============
function showDeleteConfirm(formId) {
  window.deleteFormId = formId;
  const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
  modal.show();
}

// =============== Delete Form ===============
function deleteForm(formId) {
  let forms = JSON.parse(localStorage.getItem('forms')) || [];
  const title = forms.find(f => f.formId === formId)?.title || 'this form';
  forms = forms.filter(f => f.formId !== formId);
  localStorage.setItem('forms', JSON.stringify(forms));
  loadFormsTable();
  showMessage(`🗑️ Form "${title}" deleted.`, 'success');
}

// =============== 🔥 Edit Form Inline — Enhanced (Title, Status, Creation Date) ===============
function editFormInline(formId, editButton) {
  const forms = JSON.parse(localStorage.getItem('forms')) || [];
  const form = forms.find(f => f.formId === formId);
  if (!form) return;

  const row = editButton.closest('tr');
  if (!row) return;

  // Avoid duplicate edit mode
  if (row.dataset.editing === 'true') return;

  // Save original HTML for cancel
  const originalHTML = row.innerHTML;
  row.dataset.originalHTML = originalHTML; // safer than inline escaping
  row.dataset.editing = 'true';

  // Format date for <input type="date">: YYYY-MM-DD
  const dateForInput = form.createdAt
    ? new Date(form.createdAt).toISOString().split('T')[0]
    : '';

  // Build status dropdown
  const statusOptions = `
    <option value="active"${form.status === 'active' ? ' selected' : ''}>Active</option>
    <option value="inactive"${form.status === 'inactive' ? ' selected' : ''}>Inactive</option>
  `;

  // Replace cells 1 (title), 3 (date), 4 (status badge) with inputs
  // Note: ID cell (0), Q count (2), Actions (5) remain as is for now
  row.innerHTML = `
    <td>${row.cells[0].textContent}</td>
    <td><input type="text" class="form-control form-control-sm" value="${form.title || ''}" id="edit-title-${formId}"></td>
    <td>${form.questions?.length || 0}</td>
    <td><input type="date" class="form-control form-control-sm" value="${dateForInput}" id="edit-date-${formId}"></td>
    <td>
      <select class="form-select form-select-sm" id="edit-status-${formId}">
        ${statusOptions}
      </select>
    </td>
    <td>
      <button class="btn btn-sm btn-success me-1" onclick="saveEditedForm('${formId}', this)">
        <i class="fas fa-save"></i> Save
      </button>
      <button class="btn btn-sm btn-secondary" onclick="cancelEdit('${formId}', this)">
        <i class="fas fa-times"></i> Cancel
      </button>
    </td>
  `;

  // Focus title field
  document.getElementById(`edit-title-${formId}`)?.focus();
}

// =============== Save Edited Form ===============
function saveEditedForm(formId, saveButton) {
  const titleInput = document.getElementById(`edit-title-${formId}`);
  const dateInput = document.getElementById(`edit-date-${formId}`);
  const statusSelect = document.getElementById(`edit-status-${formId}`);

  if (!titleInput || !dateInput || !statusSelect) {
    showMessage('⚠️ Edit fields missing.', 'warning');
    return;
  }

  let newTitle = titleInput.value.trim();
  let newDateStr = dateInput.value; // "YYYY-MM-DD" or ""
  let newStatus = statusSelect.value;

  if (!newTitle) {
    showMessage('⚠️ Title cannot be empty.', 'warning');
    return;
  }

  // Parse date: if empty, keep original or set to now?
  let newDateISO = null;
  if (newDateStr) {
    const parsed = new Date(newDateStr);
    if (isNaN(parsed)) {
      showMessage('⚠️ Invalid date.', 'warning');
      return;
    }
    // Set to start of day (UTC-friendly)
    newDateISO = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()).toISOString();
  } else {
    // Keep existing or fallback to now
    newDateISO = new Date().toISOString();
  }

  // Update in localStorage
  let forms = JSON.parse(localStorage.getItem('forms')) || [];
  const form = forms.find(f => f.formId === formId);
  if (form) {
    form.title = newTitle;
    form.status = newStatus;
    form.createdAt = newDateISO;
    localStorage.setItem('forms', JSON.stringify(forms));
    showMessage(`✅ "${newTitle}" updated.`, 'success');
  }

  // Refresh table
  loadFormsTable();
}

// =============== Cancel Edit ===============
function cancelEdit(formId, cancelButton) {
  const row = cancelButton.closest('tr');
  if (row && row.dataset.originalHTML) {
    row.innerHTML = row.dataset.originalHTML;
    delete row.dataset.editing;
    delete row.dataset.originalHTML;
  }
}

// =============== Initialize Page ===============
document.addEventListener('DOMContentLoaded', function () {
  if (!checkAdminAccess()) return;

  loadFormsTable();

  // Setup delete confirmation
  document.getElementById('confirmDeleteBtn')?.addEventListener('click', function () {
    if (window.deleteFormId) {
      deleteForm(window.deleteFormId);
      bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'))?.hide();
      delete window.deleteFormId;
    }
  });

  // Setup logout
  const logoutLink = document.querySelector('.sidebar .nav-item:last-child a');
  if (logoutLink) {
    logoutLink.addEventListener('click', function (e) {
      e.preventDefault();
    });
  }

  // Handle logout click correctly (prevent immediate redirect)
  const logoutItem = document.querySelector('.sidebar .nav-item:last-child a');
  if (logoutItem) {
    logoutItem.addEventListener('click', function (e) {
      e.preventDefault();
      handleLogout();
    });
  }
});