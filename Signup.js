// ✅ Smart feedback using SweetAlert2
function showSignupMessage(text, isSuccess = false) {
    Swal.fire({
        text: text,
        icon: isSuccess ? 'success' : 'error',
        confirmButtonText: 'OK',
        timer: isSuccess ? 2000 : undefined, // إذا نجاح، يغلق تلقائي بعد ثانيتين
        timerProgressBar: isSuccess ? true : false,
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    });
}

// 🚀 Main form handler
document.getElementById("Signup-Form").addEventListener("submit", function(event) {
    event.preventDefault();

    const form = this;

    // Gather & trim data
    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const dob = form.dateOfBirth.value.trim();
    const password = form.password.value.trim();
    const confirmPassword = form.confirmPassword.value.trim();

    // ✅ 1. Check for empty fields
    if (!username) { showSignupMessage("🔤 Please enter a username."); form.username.focus(); return; }
    if (!email) { showSignupMessage("📧 Please enter your email."); form.email.focus(); return; }
    if (!phone) { showSignupMessage("📱 Please enter your phone number."); form.phone.focus(); return; }
    if (!dob) { showSignupMessage("🗓️ Please select your date of birth."); form.dateOfBirth.focus(); return; }
    if (!password) { showSignupMessage("🔑 Please enter a password."); form.password.focus(); return; }
    if (!confirmPassword) { showSignupMessage("🔁 Please confirm your password."); form.confirmPassword.focus(); return; }

    // ✅ 2. Format & content validation
    if (password !== confirmPassword) { showSignupMessage("⚠️ Passwords do not match. Please check again."); form.confirmPassword.select(); return; }
    if (/^[0-9]/.test(username)) { showSignupMessage("📛 Username cannot start with a number."); form.username.select(); return; }

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) { showSignupMessage("📧 Invalid email format. Example: name@example.com"); form.email.select(); return; }

    const phoneRegex = /^(\+962|00962|0?7)\d{8,9}$/;
    if (!phoneRegex.test(phone)) { showSignupMessage("📱 Invalid phone number. Use Jordanian format: 07XXXXXXXX"); form.phone.select(); return; }

    const digitCount = (password.match(/\d/g) || []).length;
    if (digitCount < 4) { showSignupMessage("🔢 Password must contain at least 4 digits (e.g., Abc1234)."); form.password.select(); return; }

    // ✅ 3. Logical checks
    const age = (() => {
        const today = new Date();
        const birth = new Date(dob);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age;
    })();
    if (age < 12) { showSignupMessage("🚫 You must be at least 12 years old to register."); return; }

    // ✅ 4. Uniqueness
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some(u => u.username === username)) { showSignupMessage("📛 This username is already taken. Try another."); form.username.select(); return; }

    // ✅ All good → register
    const newUser = { username, email, phone, dateOfBirth: dob, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // 🎉 Success
    showSignupMessage("✅ Account created successfully! Redirecting to login…", true);

    setTimeout(() => { window.location.href = "Login.html"; }, 2000);
});
