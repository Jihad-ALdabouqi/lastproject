
document.addEventListener('DOMContentLoaded', function() {
    // ✅ Prefer localStorage (more persistent), fallback to sessionStorage
    const username = localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser');
    
    const tbody = document.getElementById('resultsBody');
    if (!username) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted py-4">
                    <i class="fas fa-user-times me-2"></i>
                    You are not logged in. Please <a href="Login.html">sign in</a> to view your results.
                </td>
            </tr>
        `;
        return;
    }

    // 🔑 Load ONLY this user's history
    const userKey = `quizHistory_${username}`;
    const history = JSON.parse(localStorage.getItem(userKey) || '[]');

    if (history.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted py-4">
                    <i class="fas fa-file-alt me-2"></i>
                    No quiz results yet. 
                </td>
            </tr>
        `;
        return;
    }

    // Render rows (newest first)
    history.reverse().forEach((item, revIndex) => {
        const originalIndex = history.length - 1 - revIndex;
        const percent = Math.round((item.score / item.total) * 100);
        const isPass = percent >= 50;
        const scoreClass = isPass ? 'score-pass' : 'score-fail';
        const statusText = isPass ? 'Passed' : 'Failed';
        
        const langName = item.language.charAt(0).toUpperCase() + item.language.slice(1);
        const quizName = `${langName}: General MCQ Test`;

        const row = `
            <tr>
                <td>${originalIndex + 1}</td>
                <td>${quizName}</td>
                <td>${item.date || '—'}</td>
                <td class="${scoreClass}">${percent}%</td>
                <td class="${isPass ? 'text-success fw-bold' : 'text-danger fw-bold'}">${statusText}</td>
                <td>
                    <button class="btn btn-sm btn-outline-info" onclick="alert('💡 Details: ${item.score}/${item.total}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
});

