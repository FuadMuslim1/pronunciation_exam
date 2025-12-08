// Catatan: Anda perlu menyalin fungsi togglePasswordVisibility() ke sini juga jika ingin berfungsi!
function togglePasswordVisibility() {
    // Pastikan ID input dan icon disesuaikan dengan admin_login.html jika perlu, 
    // tapi karena kita menggunakan ID 'toggleIcon' dan 'admin_password' di admin_login.html, 
    // kita harus memodifikasi fungsi ini agar bekerja di halaman admin.
    const passwordField = document.getElementById('admin_password');
    const toggleIcon = document.querySelector('.password-toggle i'); // Mengambil icon di halaman admin

    if (passwordField.type === 'password') {
        passwordField.type = 'text'; 
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordField.type = 'password'; 
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

document.getElementById('admin-login-form').addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    const username = document.getElementById('admin_username').value.trim();
    const password = document.getElementById('admin_password').value.trim();
    const messageElement = document.getElementById('admin_message');
    
    // Logika Otentikasi Admin
    const admin_user = "Admin Examination";
    const admin_pass = "SuperSecretKey123";

    messageElement.style.color = 'red';
    
    if (username === admin_user && password === admin_pass) {
        messageElement.textContent = 'Berhasil Login! Selamat datang, Administrator.';
        messageElement.style.color = 'green';
        // window.location.href = 'halaman_dashboard_admin.html'; 
    } else {
        messageElement.textContent = 'Gagal! Username atau Password Admin Salah.';
    }

    setTimeout(() => {
        messageElement.textContent = '';
    }, 5000);
});