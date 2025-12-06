document.getElementById("Signup-Form").addEventListener("submit", function(event) {
    event.preventDefault();

    const form = this;

    const data = {
        username: form.username.value.trim(),
        email: form.email.value.trim(),
        dateOfBirth: form.dateOfBirth.value.trim(),
        phone: form.phone.value.trim(),
        password: form.password.value.trim(),
        confirmPassword: form.confirmPassword.value.trim()
    };

    // التحقق من الحقول الفارغة
    if (!data.username || !data.email || !data.dateOfBirth || !data.phone || !data.password || !data.confirmPassword) {
        Swal.fire({
            icon: "error",
            title: "Missing Data",
            text: "All fields are required."
        });
        return;
    }

    // تطابق كلمة المرور
    if (data.password !== data.confirmPassword) {
        Swal.fire({
            icon: "error",
            title: "Password Error",
            text: "Passwords do not match."
        });
        return;
    }

    // اسم المستخدم لا يبدأ برقم
    if (/^[0-9]/.test(data.username)) {
        Swal.fire({
            icon: "error",
            title: "Invalid Username",
            text: "Username must not start with a number."
        });
        return;
    }

    // صيغة الإيميل
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(data.email)) {
        Swal.fire({
            icon: "error",
            title: "Invalid Email",
            text: "Please enter a valid email format."
        });
        return;
    }

    // حساب العمر
    function calculateAge(dob) {
        const today = new Date();
        const birth = new Date(dob);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    }

    const age = calculateAge(data.dateOfBirth);
    if (age < 12) {
        Swal.fire({
            icon: "error",
            title: "Age Restriction",
            text: "You must be at least 12 years old to register."
        });
        return;
    }

    // التحقق إذا المستخدم موجود
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some(u => u.username === data.username)) {
        Swal.fire({
            icon: "error",
            title: "Username Taken",
            text: "Username already exists!"
        });
        return;
    }

    // تسجيل المستخدم
    delete data.confirmPassword;
    users.push(data);
    localStorage.setItem("users", JSON.stringify(users));

    // رسالة نجاح
    Swal.fire({
        icon: "success",
        title: "Account Created",
        text: "Registered successfully!",
        showConfirmButton: false,
        timer: 1700
    });

    setTimeout(() => {
        window.location.href = "Login.html";
    }, 1700);
});
