// break_page.js

const startButton = document.getElementById('start-stage2-button');
const TARGET_PAGE = '../stage/stage_3.html'; // Tentukan halaman tujuan ujian berikutnya

/**
 * Fungsi untuk navigasi ke halaman Stage 2.
 */
function navigateToStage2() {
    // Pengalihan halaman
    window.location.href = TARGET_PAGE;
}

// Tambahkan event listener ke tombol saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    startButton.addEventListener('click', navigateToStage2);
});