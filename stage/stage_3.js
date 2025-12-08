// stage3.js

const cameraPreview = document.getElementById('camera-preview');
const nextButton = document.getElementById('next-button');
const statusMessage = document.getElementById('status-message');
const timerDisplay = document.getElementById('timer');

let mediaRecorder;
let mediaStream = null;
let recordedChunks = [];
let timerInterval;

const DB_NAME = 'ExamRecordsDB';
const STORE_NAME = 'videos';
// KOREKSI: Kunci untuk Stage 3
const RECORD_KEY = 'stage_3_video';
const DURATION_SECONDS = 60; // 1 menit

// --- IndexedDB Setup ---

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            console.error('Database error:', event.target.errorCode);
            reject('Database error: ' + event.target.errorCode);
        };
    });
}

async function saveRecording(blob) {
    let db;
    try {
        db = await openDatabase();
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        const request = store.put(blob, RECORD_KEY);

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                db.close(); // ✨ Tutup DB setelah sukses
                resolve('Video saved successfully!');
            }
            request.onerror = () => {
                db.close(); // ✨ Tutup DB setelah gagal
                reject('Failed to save video to DB.');
            }
        });

    } catch (error) {
        if (db) db.close(); // ✨ Tutup DB jika gagal di awal
        console.error("Error during DB operation:", error);
        return Promise.reject('Database operation failed.');
    }
}

// --- Timer Control ---

function startTimer() {
    let timeLeft = DURATION_SECONDS;

    const initialMinutes = Math.floor(timeLeft / 60);
    const initialSeconds = timeLeft % 60;
    timerDisplay.textContent = `${initialMinutes.toString().padStart(2, '0')}:${initialSeconds.toString().padStart(2, '0')}`;

    timerInterval = setInterval(() => {
        timeLeft--;

        const currentMinutes = Math.floor(timeLeft / 60);
        const currentSeconds = timeLeft % 60;
        timerDisplay.textContent = `${currentMinutes.toString().padStart(2, '0')}:${currentSeconds.toString().padStart(2, '0')}`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = 'TIME UP';

            stopRecordingAndProceed();
        }
    }, 1000);
}

// --- Recording Control ---

async function startRecording() {
    // Media access (kamera dan mikrofon)
    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        cameraPreview.srcObject = mediaStream;

        mediaRecorder = new MediaRecorder(mediaStream);

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = async () => {
            statusMessage.textContent = 'Saving recording... Please wait.';

            clearInterval(timerInterval);

            // Hentikan stream perangkat keras (kamera/mikrofon)
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }

            const blob = new Blob(recordedChunks, { type: 'video/webm' });

            // URL navigasi akhir
            const finalUrl = '../download_page/download_page.html';

            try {
                await saveRecording(blob);
                statusMessage.textContent = 'Recording saved. Redirecting to download page...'; // Pesan diperbarui

                // Pindah ke halaman download
                setTimeout(() => {
                    window.location.href = finalUrl;
                }, 1000); // Tunda sebentar untuk pesan konfirmasi

            } catch (error) {
                statusMessage.textContent = 'ERROR: Failed to save video. Redirecting anyway.';
                console.error(error);
                // Tetap pindah halaman meskipun gagal simpan
                setTimeout(() => {
                    window.location.href = finalUrl;
                }, 2000);
            }
        };

        // Mulai merekam dan timer
        mediaRecorder.start();
        startTimer(); // Mulai timer 60 detik
        statusMessage.textContent = 'Recording is ACTIVE (Border RED). Start reading now.';
        nextButton.disabled = false;

    } catch (error) {
        statusMessage.textContent = 'FATAL ERROR: Media access failed. Cannot start exam.';
        console.error('Media access failed:', error);
        nextButton.disabled = true;
    }
}

function stopRecordingAndProceed() {
    // URL navigasi akhir
    const finalUrl = '../download_page/download_page.html';

    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();

        // Nonaktifkan tombol untuk mencegah klik ganda selama proses penyimpanan
        nextButton.disabled = true;
        nextButton.textContent = 'Processing...';
    } else if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        // Ini menangani kasus jika mediaRecorder.stop() sudah dipanggil tetapi onstop belum selesai.
        nextButton.disabled = true;
        nextButton.textContent = 'Processing...';
    } else {
        // Jika rekaman sudah berhenti, langsung navigasi
        window.location.href = finalUrl;
    }
}

// --- Initialization ---

window.onload = startRecording; // Mulai merekam dan timer secara otomatis
nextButton.addEventListener('click', stopRecordingAndProceed);