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
  const username = localStorage.getItem('loggedInUser');
  if (username !== 'admin') {
    showMessage('⛔ Access denied! Admins only.', 'danger');
    setTimeout(() => {
      window.location.href = 'Login.html';
    }, 2000);
    return false;
  }
  return true;
}

// =============== Handle Logout ===============
function handleLogout() {
  localStorage.removeItem('loggedInUser');
  sessionStorage.removeItem('loggedInUser');
  showMessage('✅ Logged out.', 'success');
  setTimeout(() => {
    window.location.href = 'Login.html';
  }, 1000);
}

// =============== Initialize Form Builder ===============
let currentForm = {
  title: '',
  description: '',
  status: 'active',
  questions: []
};

function initFormBuilder() {
  // Buttons
  document.getElementById('clearQuestionBtn').addEventListener('click', clearQuestion);
  document.getElementById('addOptionBtn').addEventListener('click', addOption);
  document.getElementById('addQuestionToFormBtn').addEventListener('click', addQuestionToForm);
  document.getElementById('saveFormBtn').addEventListener('click', saveForm);
  document.getElementById('questionType').addEventListener('change', updateOptionsSection);

  // Setup logout link (same as admin.html)
  const logoutLink = document.querySelector('.sidebar .nav-item:last-child a');
  if (logoutLink) {
    logoutLink.addEventListener('click', function(e) {
      e.preventDefault();
      handleLogout();
    });
  }

  // Initial UI state
  updateOptionsSection();
}

// =============== Clear Question ===============
function clearQuestion() {
  document.getElementById('questionText').value = '';
  document.getElementById('requiredCheck').checked = true;
  document.getElementById('fontSelect').value = 'sans-serif';
  document.getElementById('optionInput').value = '';
  document.getElementById('optionsList').innerHTML = '';
  document.getElementById('correctAnswerList').innerHTML = '';
  updateOptionsSection();
}

// =============== Update Options Section ===============
function updateOptionsSection() {
  const type = document.getElementById('questionType').value;
  const optionsSection = document.getElementById('optionsSection');
  
  if (type === 'text') {
    optionsSection.style.display = 'none';
  } else {
    optionsSection.style.display = 'block';
    // Add first option if empty
    const optionsList = document.getElementById('optionsList');
    if (optionsList.innerHTML === '') {
      addOption();
    }
  }
}

// =============== Add Option ===============
function addOption() {
  const optionInput = document.getElementById('optionInput');
  const optionValue = optionInput.value.trim();
  if (!optionValue) {
    showMessage('Please enter an option.', 'warning');
    return;
  }

  const optionsList = document.getElementById('optionsList');
  const correctAnswerList = document.getElementById('correctAnswerList');
  const optionId = 'opt_' + Date.now();

  // Add to options list
  const optDiv = document.createElement('div');
  optDiv.className = 'option-item';
  optDiv.innerHTML = `
    <div class="form-check">
      <input class="form-check-input" type="radio" name="opt_group" id="opt_${optionId}">
      <label class="form-check-label" for="opt_${optionId}">${optionValue}</label>
    </div>
    <button type="button" class="btn btn-sm btn-remove remove-opt" data-id="${optionId}">Remove</button>
  `;
  optionsList.appendChild(optDiv);

  // Add to correct answer list
  const correctDiv = document.createElement('div');
  correctDiv.className = 'option-item';
  correctDiv.innerHTML = `
    <div class="form-check">
      <input class="form-check-input" type="radio" name="correct_group" id="corr_${optionId}" ${correctAnswerList.children.length === 0 ? 'checked' : ''}>
      <label class="form-check-label" for="corr_${optionId}">${optionValue}</label>
    </div>
    <button type="button" class="btn btn-sm btn-remove remove-corr" data-id="${optionId}">Remove</button>
  `;
  correctAnswerList.appendChild(correctDiv);

  optionInput.value = '';

  // Attach remove handlers
  optDiv.querySelector('.remove-opt').onclick = () => removeOption(optionId);
  correctDiv.querySelector('.remove-corr').onclick = () => removeCorrectOption(optionId);
}

// =============== Remove Option ===============
function removeOption(id) {
  // Remove from options list
  const optEl = document.querySelector(`#opt_${id}`)?.closest('.option-item');
  if (optEl) optEl.remove();
  // Also remove from correct list
  removeCorrectOption(id);
}

// =============== Remove Correct Option ===============
function removeCorrectOption(id) {
  const corrEl = document.querySelector(`#corr_${id}`)?.closest('.option-item');
  if (corrEl) corrEl.remove();
}

// =============== Add Question to Form ===============
function addQuestionToForm() {
  const text = document.getElementById('questionText').value.trim();
  const type = document.getElementById('questionType').value;
  const required = document.getElementById('requiredCheck').checked;
  const font = document.getElementById('fontSelect').value;

  if (!text) {
    showMessage('Please enter a question.', 'warning');
    return;
  }

  let options = [];
  let correctAnswer = '';

  if (type !== 'text') {
    // Collect options
    document.querySelectorAll('#optionsList .form-check-label').forEach(el => {
      options.push(el.textContent);
    });

    // Get correct answer
    const selected = document.querySelector('#correctAnswerList input[type="radio"]:checked');
    if (selected) {
      correctAnswer = selected.nextElementSibling.textContent;
    }
  }

  currentForm.questions.push({
    text: text,
    type: type,
    required: required,
    font: font,
    options: options,
    correctAnswer: correctAnswer
  });

  renderQuestionsList();
  clearQuestion();
}

// =============== Render Questions List ===============
function renderQuestionsList() {
  const list = document.getElementById('formQuestionsList');
  list.innerHTML = '';

  currentForm.questions.forEach((q, i) => {
    const div = document.createElement('div');
    div.className = 'question-preview';
    div.innerHTML = `
      <span><strong>Q${i + 1}:</strong> ${q.text} (${q.type})</span>
      <button type="button" class="btn btn-sm btn-remove del-btn" data-index="${i}">Delete</button>
    `;
    list.appendChild(div);

    div.querySelector('.del-btn').onclick = () => {
      currentForm.questions.splice(i, 1);
      renderQuestionsList();
    };
  });
}

// =============== Save Form ===============
function saveForm() {
  const title = document.getElementById('formTitle').value.trim();
  if (!title) {
    showMessage('Form title is required.', 'warning');
    return;
  }
  if (currentForm.questions.length === 0) {
    showMessage('Add at least one question.', 'warning');
    return;
  }

  const form = {
    formId: 'form_' + Date.now(),
    title: title,
    description: document.getElementById('formDescription').value.trim(),
    status: document.getElementById('formStatus').value,
    questions: currentForm.questions,
    createdAt: new Date().toLocaleString()
  };

  let forms = JSON.parse(localStorage.getItem('forms')) || [];
  forms.push(form);
  localStorage.setItem('forms', JSON.stringify(forms));

  showMessage('✅ Form saved successfully!', 'success');

  // Reset
  currentForm = { title: '', description: '', status: 'active', questions: [] };
  document.getElementById('formTitle').value = '';
  document.getElementById('formDescription').value = '';
  document.getElementById('formStatus').value = 'active';
  renderQuestionsList();
}

// =============== Start Everything ===============
document.addEventListener('DOMContentLoaded', function () {
  if (!checkAdminAccess()) return;
  initFormBuilder();
});