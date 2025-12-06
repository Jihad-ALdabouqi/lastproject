document.addEventListener('DOMContentLoaded', function () {

    // ✅ "Get Started" button → always go to Login page
    const getStartedBtn = document.querySelector('.hero-section .btn.btn-lg');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function (e) {
            e.preventDefault(); // prevent any default form/button behavior
            window.location.href = "Login.html"; // always redirect to login
        });
    }

    // ✅ Register button
    const btnRegister = document.getElementById("btnRegister");
    if (btnRegister) {
        btnRegister.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = "Signup.html";
        });
    }

    // ✅ Sign In button
    const btnSignIn = document.getElementById("btnSignIn");
    if (btnSignIn) {
        btnSignIn.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = "Login.html";
        });
    }

});


document.addEventListener('DOMContentLoaded', function () {

    // ✅ "Get Started" button → always go to Login page
    const getStartedBtn = document.querySelector('.hero-section .btn.btn-lg');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function (e) {
            e.preventDefault(); // prevent any default form/button behavior
            window.location.href = "Login.html"; // always redirect to login
        });
    }

    // ✅ Register button
    const btnRegister = document.getElementById("btnRegister");
    if (btnRegister) {
        btnRegister.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = "signup.html";
        });
    }

    // ✅ Sign In button
    const btnSignIn = document.getElementById("btnSignIn");
    if (btnSignIn) {
        btnSignIn.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = "login.html";
        });
    }

});






