// =======================
// AMBIL STATUS LOGIN & LIMIT
// =======================
const isLoggedIn = localStorage.getItem("isLoggedIn");
let remainingLogin = Number(localStorage.getItem("remainingLogin")) || 2;

// =======================
// PROTEKSI HALAMAN
// =======================
if (!isLoggedIn || remainingLogin <= 0) {
    // Hapus data login agar tidak bisa kembali
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("remainingLogin");

    // Redirect ke halaman login
    window.location.replace("../login/login.html"); // sesuaikan path
}

// =======================
// BACK BUTTON PREVENT
// =======================
history.replaceState(null, null, location.href);
history.pushState(null, null, location.href);
window.onpopstate = function () {
    history.go(1);
}

// =======================
// UPDATE LOGIN ATTEMPT (opsional, sesuaikan login gagal)
// =======================
// Contoh: jika login gagal, kurangi sisa login
// remainingLogin -= 1;
// localStorage.setItem("remainingLogin", remainingLogin);
