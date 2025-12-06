document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const formId = urlParams.get('formId');

    // 🔐 التحقق من تسجيل الدخول
    const username = localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser');
    if (!username) {
        Swal.fire({
            icon: "warning",
            title: "Not Logged In",
            text: "You must be logged in to take a quiz.",
        }).then(() => {
            window.location.href = 'Login.html';
        });
        return;
    }

    if (!formId) {
        Swal.fire({
            icon: "error",
            title: "Invalid Quiz",
            text: "No quiz selected.",
        }).then(() => {
            window.location.href = 'user.html';
        });
        return;
    }

    // 📥 جلب الفورم من localStorage
    const forms = JSON.parse(localStorage.getItem('forms')) || [];
    const form = forms.find(f => f.formId === formId && f.status === 'active');

    if (!form || !form.questions || form.questions.length === 0) {
        Swal.fire({
            icon: "error",
            title: "Quiz Not Found",
            text: "This quiz is no longer available.",
        }).then(() => {
            window.location.href = 'user.html';
        });
        return;
    }

    // 🖥️ عرض الفورم
    document.getElementById('quiz-title').textContent = form.title || 'Untitled Quiz';

    let html = '';
    form.questions.forEach((q, i) => {
        if (q.type === 'text') {
            html += `
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title mb-2">Question ${i + 1}</h5>
                        <p class="fw-bold mb-3">${q.text}</p>
                        <textarea class="form-control" name="q${i}" rows="3" placeholder="Your answer..."></textarea>
                    </div>
                </div>
            `;
        } else {
            html += `
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title mb-2">Question ${i + 1}</h5>
                        <p class="fw-bold mb-3">${q.text}</p>
            `;
            q.options.forEach((opt, j) => {
                const letter = String.fromCharCode(65 + j);
                html += `
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="radio" name="q${i}" id="q${i}_${j}" value="${opt}" required>
                        <label class="form-check-label" for="q${i}_${j}">${letter}. ${opt}</label>
                    </div>
                `;
            });
            html += `</div></div>`;
        }
    });

    html += `
        <div class="text-center mt-4">
            <button type="button" id="submitBtn" class="btn btn-success btn-lg px-5">
                <i class="fas fa-paper-plane me-2"></i> Submit Quiz
            </button>
        </div>
    `;

    document.getElementById('quizForm').innerHTML = html;

    // 📤 معالجة الإرسال
    document.getElementById('submitBtn').addEventListener('click', function () {
        let score = 0;
        let unanswered = 0;

        form.questions.forEach((q, i) => {
            const answerField = document.querySelector(`[name="q${i}"]`);
            if (!answerField) return;

            let userAnswer = '';
            if (q.type === 'text') {
                userAnswer = answerField.value.trim();
            } else {
                const selected = document.querySelector(`input[name="q${i}"]:checked`);
                if (selected) {
                    userAnswer = selected.value;
                } else {
                    unanswered++;
                    return;
                }
            }

            if (userAnswer.toLowerCase() === (q.correctAnswer || '').toLowerCase()) {
                score++;
            }
        });

        if (unanswered > 0) {
            Swal.fire({
                icon: "warning",
                title: "Incomplete Quiz",
                text: "Please answer all questions before submitting."
            });
            return;
        }

        const total = form.questions.length;
        const percent = Math.round((score / total) * 100);
        const status = percent >= 50 ? "Passed" : "Failed";

        Swal.fire({
            icon: percent >= 50 ? "success" : "error",
            title: `Quiz Completed`,
            html: `
                <b>Score:</b> ${score}/${total} (${percent}%)<br>
                <b>Status:</b> ${status}
            `,
            confirmButtonText: "View Results"
        }).then(() => {

            // 💾 حفظ النتيجة
            const userKey = `quizHistory_${username}`;
            const history = JSON.parse(localStorage.getItem(userKey) || "[]");
            history.push({
                language: form.title,
                score,
                total,
                date: new Date().toLocaleString()
            });
            localStorage.setItem(userKey, JSON.stringify(history));

            window.location.href = 'my_results.html';
        });
    });
});
