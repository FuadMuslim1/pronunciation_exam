// script.js

const startButton = document.getElementById('start-button');
const accessStatus = document.getElementById('access-status');
const cameraPreview = document.getElementById('camera-preview');
let mediaStream = null;
const TARGET_EXAM_PAGE = 'stage1.html'; // Halaman tujuan ujian

/**
 * Meminta akses kamera dan mikrofon.
 * Mengaktifkan tombol Start jika akses berhasil.
 */
async function requestMediaAccess() {
    try {
        // Minta akses untuk video (kamera) dan audio (mikrofon)
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        // Tampilkan pratinjau kamera
        cameraPreview.srcObject = mediaStream;
        document.querySelector('.media-preview').style.display = 'flex';

        accessStatus.innerHTML = '<i class="fas fa-check-circle"></i> Camera & Microphone Access Granted. Ready to start.';
        accessStatus.style.color = 'green';
        startButton.disabled = false; // Aktifkan tombol start

    } catch (err) {
        console.error("Access denied or device not found:", err);
        accessStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Access Denied. Please enable your Camera and Microphone to proceed.';
        accessStatus.style.color = 'red';
        startButton.disabled = true; // Nonaktifkan tombol start
    }
}

/**
 * Fungsi yang dipanggil saat tombol START ditekan.
 * Hanya berfungsi jika mediaStream berhasil didapatkan.
 */
function startExam() {
    if (!mediaStream) {
        alert("Media access not granted. Cannot start exam.");
        return;
    }
    
    alert("Camera and Microphone access confirmed. Starting the exam...");
    
    // Pindah ke halaman ujian (stage_1.html)
    window.location.href = '../stage/stage_1.html'; 
}

// Panggil fungsi requestMediaAccess secara otomatis saat halaman dimuat
window.onload = requestMediaAccess;

// Hubungkan tombol start ke fungsi startExam
startButton.addEventListener('click', startExam);