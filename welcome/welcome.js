// ==========================
// GLOBAL VARIABLES
// ==========================
const startButton = document.getElementById('start-button');
const accessStatus = document.getElementById('access-status');
const cameraPreview = document.getElementById('camera-preview');

let mediaStream = null;
const TARGET_EXAM_PAGE = '../stage/stage_1.html'; // Halaman tujuan ujian


// ==========================
// REQUEST CAMERA & MICROPHONE ACCESS
// ==========================
/**
 * Meminta akses kamera dan mikrofon.
 * Menampilkan pratinjau kamera jika akses diizinkan.
 * Mengaktifkan tombol Start jika sukses.
 */
async function requestMediaAccess() {
    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });

        // Tampilkan pratinjau kamera
        cameraPreview.srcObject = mediaStream;
        document.querySelector('.media-preview').style.display = 'flex';

        accessStatus.innerHTML = `
            <i class="fas fa-check-circle"></i> Camera & Microphone Access Granted. Ready to start.
        `;
        accessStatus.style.color = 'green';

        startButton.disabled = false;

    } catch (err) {
        console.error("Access denied or device not found:", err);

        accessStatus.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i> Access Denied. Please enable your Camera and Microphone to proceed.
        `;
        accessStatus.style.color = 'red';

        startButton.disabled = true;
    }
}


// ==========================
// STOP MEDIA PREVIEW
// ==========================
/**
 * Menghentikan kamera & mikrofon:
 * - Menghentikan semua track video/audio
 * - Menghilangkan video preview
 */
function stopMediaPreview() {
    if (mediaStream) {
        const tracks = mediaStream.getTracks();
        tracks.forEach(track => track.stop());
    }

    cameraPreview.srcObject = null;
    document.querySelector('.media-preview').style.display = 'none';
}


// ==========================
// STARTING EXAMINATION
// ==========================
/**
 * Dipanggil ketika tombol Start ditekan.
 * Memastikan media tersedia, lalu mematikan preview
 * sebelum masuk ke halaman ujian.
 */
function startExam() {
    if (!mediaStream) {
        alert("Media access not granted. Cannot start exam.");
        return;
    }

    alert("Camera and Microphone access confirmed. Starting the exam...");

    // MATIKAN PREVIEW KAMERA SEBELUM MASUK UJIAN
    stopMediaPreview();

    // Pindah halaman
    window.location.href = TARGET_EXAM_PAGE;
}


// ==========================
// INITIALIZATION
// ==========================
window.onload = requestMediaAccess;
startButton.addEventListener('click', startExam);
