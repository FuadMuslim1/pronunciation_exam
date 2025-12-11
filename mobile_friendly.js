// ============================
// Mobile-Friendly Modul (Final)
// ============================
(function() {

    // ============================
    // Inject CSS untuk mobile-friendly
    // ============================
    const style = document.createElement('style');
    style.textContent = `
        /* Login Box untuk mobile */
        .login-box.mobile-login {
            padding: 20px !important;
            border-radius: 15px !important;
        }

        /* Navbar mobile */
        .navbar.mobile-nav {
            font-size: 0.9em !important;
        }

        /* Word Example mobile */
        .focus-word.mobile-word {
            font-size: 0.8em !important;
        }

        /* Button responsive */
        button.mobile-btn {
            font-size: 0.95em !important;
            padding: 10px !important;
        }

        /* Global container responsive */
        .container.mobile-container {
            padding: 10px !important;
        }
    `;
    document.head.appendChild(style);

    // ============================
    // Function untuk mengatur responsive class
    // ============================
    function adjustLayout() {
        const width = window.innerWidth;

        // Login Box
        const loginBox = document.querySelector('.login-box');
        if (loginBox) {
            if (width <= 480) {
                loginBox.classList.add('mobile-login');
            } else {
                loginBox.classList.remove('mobile-login');
            }
        }

        // Navbar
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (width <= 768) {
                navbar.classList.add('mobile-nav');
            } else {
                navbar.classList.remove('mobile-nav');
            }
        }

        // Word Example Modul
        const words = document.querySelectorAll('.focus-word');
        words.forEach(word => {
            if (width <= 480) {
                word.classList.add('mobile-word');
            } else {
                word.classList.remove('mobile-word');
            }
        });

        // Semua tombol
        const buttons = document.querySelectorAll('button');
        buttons.forEach(btn => {
            if (width <= 480) {
                btn.classList.add('mobile-btn');
            } else {
                btn.classList.remove('mobile-btn');
            }
        });

        // Container global
        const containers = document.querySelectorAll('.container');
        containers.forEach(c => {
            if (width <= 480) {
                c.classList.add('mobile-container');
            } else {
                c.classList.remove('mobile-container');
            }
        });
    }

    // Jalankan saat DOM siap
    window.addEventListener('DOMContentLoaded', adjustLayout);
    // Jalankan saat resize
    window.addEventListener('resize', adjustLayout);

})();
