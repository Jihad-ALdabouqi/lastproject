document.getElementById("loginform").addEventListener("submit", function (event) {
  event.preventDefault();

  const emailInput = document.getElementById("username").value.trim();
  const passwordInput = document.getElementById("password").value.trim();

  // ✅ Admin login: store identity before redirect
  if (emailInput === "admin@gmail.com" && passwordInput === "admin123") {
    // ⚠ Avoid storing passwords or raw credentials — only identity/role
    // Use sessionStorage for temporary session (cleared on tab close)
    sessionStorage.setItem("loggedInUser", "admin");
    // Optional: localStorage for cross-tab persistence (e.g., if admin opens quiz in new tab)
    // But prefer sessionStorage for security-sensitive roles [[1], [4], [8]]
    localStorage.setItem("loggedInUser", "admin"); // kept for your current flow compatibility

    window.location.href = "admin.html";
    return;
  }

  // Regular user login
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const foundUser = users.find(
    (u) => u.email === emailInput && u.password === passwordInput
  );

  if (foundUser) {
    // ✅ Store only non-sensitive user identity (not password/email)
    sessionStorage.setItem("loggedInUser", foundUser.username);
    localStorage.setItem("loggedInUser", foundUser.username); // for cross-tab support

    window.location.href = "User.html";
  } else {
    const msg = document.getElementById("msg");
    if (msg) {
      msg.innerText = "Invalid Email or password";
      msg.style.color = "red";
    }
  }
});



// document.getElementById("loginform").addEventListener("submit", function (event) {
//     event.preventDefault();

//     const emailInput = document.getElementById("username").value.trim();
//     const passwordInput = document.getElementById("password").value.trim();

//     // ✅ تحقق من المشرف أولاً
//     if (emailInput === "admin@gmail.com" && passwordInput === "admin123") {
//         // احفظ بيانات المشرف في localStorage
//         localStorage.setItem("currentUser", JSON.stringify({
//             email: "admin@gmail.com",
//             role: "admin"
//         }));
//         window.location.href = "admin.html";
//         return;
//     }

//     // ✅ تسجيل دخول المستخدم العادي
//     const users = JSON.parse(localStorage.getItem("users")) || [];
//     const foundUser = users.find(
//         (u) => u.email === emailInput && u.password === passwordInput
//     );

//     if (foundUser) {
//         localStorage.setItem("currentUser", JSON.stringify({
//             username: foundUser.username,
//             email: foundUser.email,
//             role: "user"
//         }));
//         window.location.href = "User.html";
//     } else {
//         const msg = document.getElementById("msg");
//         if (msg) {
//             msg.innerText = "Invalid Email or password";
//             msg.style.color = "red";
//         }
//     }
// });