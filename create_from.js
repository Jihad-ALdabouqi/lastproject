// =============== Utility: Show Message ===============
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

// =============== Admin Access Check ===============
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

// =============== Logout Handler ===============
function handleLogout() {
    localStorage.removeItem('loggedInUser');
    sessionStorage.removeItem('loggedInUser');
    showMessage('✅ Logged out.', 'success');
    setTimeout(() => {
        window.location.href = 'Login.html';
    }, 1000);
}

// =============== Form Data State ===============
let currentForm = {
    title: '',
    description: '',
    status: 'active',
    questions: []
};

// =============== Initialize App ===============
function initFormBuilder() {
    const editor = document.getElementById('questionText');
    const fontSelectLive = document.getElementById('fontSelectLive');
    const fontSelect = document.getElementById('fontSelect');

    // === Formatting Controls ===
    document.getElementById('btnBold').addEventListener('click', () => {
        document.execCommand('bold', false, null);
        editor.focus();
    });

    document.getElementById('btnItalic').addEventListener('click', () => {
        document.execCommand('italic', false, null);
        editor.focus();
    });

    // Live font updater
    fontSelectLive.addEventListener('change', () => {
        const font = fontSelectLive.value;
        // Sync classes
        editor.className = 'rich-text-editor ' + font;
        // Sync save dropdown
        fontSelect.value = font;
    });

    // Sync save font → live font
    fontSelect.addEventListener('change', () => {
        fontSelectLive.value = fontSelect.value;
        fontSelectLive.dispatchEvent(new Event('change'));
    });

    // Prevent <div> on Enter (use <br>)
    editor.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            document.execCommand('insertHTML', false, '<br>');
        }
    });

    // === Core Buttons ===
    document.getElementById('clearQuestionBtn').addEventListener('click', clearQuestion);
    document.getElementById('addOptionBtn').addEventListener('click', addOption);
    document.getElementById('addQuestionToFormBtn').addEventListener('click', addQuestionToForm);
    document.getElementById('saveFormBtn').addEventListener('click', saveForm);
    document.getElementById('questionType').addEventListener('change', updateOptionsSection);

    // === Logout Link ===
    const logoutLink = document.querySelector('.sidebar .nav-item:last-child a');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }

    // Init UI
    updateOptionsSection();
    // Set initial font
    fontSelectLive.value = 'sans-serif';
    fontSelect.value = 'sans-serif';
    editor.className = 'rich-text-editor sans-serif';
}

// =============== Clear Question ===============
function clearQuestion() {
    document.getElementById('questionText').innerHTML = '';
    document.getElementById('requiredCheck').checked = true;
    document.getElementById('fontSelect').value = 'sans-serif';
    document.getElementById('optionInput').value = '';
    document.getElementById('optionsList').innerHTML = '';
    document.getElementById('correctAnswerList').innerHTML = '';
    updateOptionsSection();
}

// =============== Toggle Options Section ===============
function updateOptionsSection() {
    const type = document.getElementById('questionType').value;
    const optionsSection = document.getElementById('optionsSection');
    
    if (type === 'text') {
        optionsSection.style.display = 'none';
    } else {
        optionsSection.style.display = 'block';
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
    const optEl = document.querySelector(`#opt_${id}`)?.closest('.option-item');
    if (optEl) optEl.remove();
    removeCorrectOption(id);
}

function removeCorrectOption(id) {
    const corrEl = document.querySelector(`#corr_${id}`)?.closest('.option-item');
    if (corrEl) corrEl.remove();
}

// =============== Add Question to Form ===============
function addQuestionToForm() {
    const editor = document.getElementById('questionText');
    let text = editor.innerHTML.trim();

    if (text === '<br>' || text === '') {
        text = '';
    }

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
        document.querySelectorAll('#optionsList .form-check-label').forEach(el => {
            options.push(el.textContent);
        });

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
            <span><strong>Q${i + 1}:</strong> <span class="question-content"></span> (${q.type})</span>
            <button type="button" class="btn btn-sm btn-remove del-btn" data-index="${i}">Delete</button>
        `;
        list.appendChild(div);

        const contentSpan = div.querySelector('.question-content');
        contentSpan.innerHTML = q.text;
        contentSpan.style.fontFamily = q.font || 'sans-serif'; // ✅ Respect saved font

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

    // Reset form
    currentForm = { title: '', description: '', status: 'active', questions: [] };
    document.getElementById('formTitle').value = '';
    document.getElementById('formDescription').value = '';
    document.getElementById('formStatus').value = 'active';
    renderQuestionsList();
}

// =============== DOM Ready ===============
document.addEventListener('DOMContentLoaded', () => {
    if (checkAdminAccess()) {
        initFormBuilder();
    }
});
