document.addEventListener('DOMContentLoaded', function () {

    function swalMsg(icon, title, text) {
        Swal.fire({
            icon: icon,
            title: title,
            text: text
        });
    }

    // 🔐 Check login status
    const loggedInUsername = localStorage.getItem('loggedInUser');
    if (!loggedInUsername) {
        Swal.fire({
            icon: "warning",
            title: "Not Logged In",
            text: "You must be logged in to view your profile."
        }).then(() => window.location.href = "Login.html");
        return;
    }

    // 📦 Load users
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = users.find(u => u.username === loggedInUsername);

    if (!currentUser) {
        Swal.fire({
            icon: "error",
            title: "User Not Found",
            text: "User data not found. Please log in again."
        }).then(() => window.location.href = "Login.html");
        return;
    }

    // 📅 Helper: Format date for display
    function formatDateForDisplay(dateStr) {
        if (!dateStr) return "—";
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString('en-US', options);
    }

    // ✅ Populate profile view
    document.getElementById("profile-username").textContent = currentUser.username;
    document.getElementById("profile-email").textContent = currentUser.email;
    document.getElementById("profile-phone").textContent = currentUser.phone;
    document.getElementById("profile-dob").textContent = formatDateForDisplay(currentUser.dateOfBirth);

    // 🧩 DOM Elements
    const editBtn = document.getElementById("edit-profile-btn");
    const cancelBtn = document.getElementById("cancel-edit");
    const editForm = document.getElementById("profile-edit-form");
    const profileViewSection = document.getElementById("profile-view-section");
    const editFormSection = document.getElementById("edit-form-section");

    // ✏️ Edit → Show form
    editBtn.addEventListener('click', function () {
        document.getElementById("edit-username").value = currentUser.username;
        document.getElementById("edit-email").value = currentUser.email;
        document.getElementById("edit-phone").value = currentUser.phone;
        document.getElementById("edit-dob").value = currentUser.dateOfBirth;

        profileViewSection.style.display = 'none';
        editFormSection.style.display = 'block';
    });

    // 🚫 Cancel
    cancelBtn.addEventListener('click', function () {
        profileViewSection.style.display = 'block';
        editFormSection.style.display = 'none';
    });

    // 💾 Save
    editForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const updated = {
            username: document.getElementById("edit-username").value.trim(),
            email: document.getElementById("edit-email").value.trim(),
            phone: document.getElementById("edit-phone").value.trim(),
            dateOfBirth: document.getElementById("edit-dob").value.trim()
        };

        // Validation
        if (!updated.username || !updated.email || !updated.phone || !updated.dateOfBirth) {
            swalMsg("warning", "Missing Fields", "All fields are required.");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(updated.email)) {
            swalMsg("error", "Invalid Email", "Please enter a valid email address.");
            return;
        }

        const usernameExists = users.some(u =>
            u.username === updated.username && u.username !== currentUser.username
        );
        if (usernameExists) {
            swalMsg("error", "Username Taken", "Please choose another username.");
            return;
        }

        function calculateAge(dob) {
            const today = new Date();
            const birthDate = new Date(dob);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        }

        if (calculateAge(updated.dateOfBirth) < 12) {
            swalMsg("error", "Age Restriction", "You must be at least 12 years old.");
            return;
        }

        // Save
        const index = users.findIndex(u => u.username === loggedInUsername);
        users[index] = { ...currentUser, ...updated };

        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("loggedInUser", updated.username);
        sessionStorage.setItem("loggedInUser", updated.username);

        // UI update
        document.getElementById("profile-username").textContent = updated.username;
        document.getElementById("profile-email").textContent = updated.email;
        document.getElementById("profile-phone").textContent = updated.phone;
        document.getElementById("profile-dob").textContent = formatDateForDisplay(updated.dateOfBirth);
        cancelBtn.click();

        Swal.fire({
            icon: "success",
            title: "Profile Updated",
            text: "Your profile information has been saved successfully.",
            timer: 1800,
            showConfirmButton: false
        });
    });
});
