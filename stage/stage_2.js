// stage2.js

const cameraPreview = document.getElementById('camera-preview');
const nextButton = document.getElementById('next-button');
const statusMessage = document.getElementById('status-message');
const timerDisplay = document.getElementById('timer');

let mediaRecorder;
let mediaStream = null;
let recordedChunks = []; // Dibiarkan sebagai global
let timerInterval;

const DB_NAME = 'ExamRecordsDB';
const STORE_NAME = 'videos';
// KONSTANTA: Dipastikan untuk Stage 2
const RECORD_KEY = 'stage_2_video';
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
                db.close(); // ✨ Tutup DB
                resolve('Video saved successfully!');
            }
            request.onerror = () => {
                db.close(); // ✨ Tutup DB
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
        // recordedChunks TIDAK direset karena ini single-use page.

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

            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }

            const blob = new Blob(recordedChunks, { type: 'video/webm' });

            // Navigasi yang diharapkan setelah Stage 2
            const nextUrl = '../break_page/break_page_1.html';

            try {
                await saveRecording(blob);
                statusMessage.textContent = 'Recording saved. Redirecting to break page 1...';
                setTimeout(() => {
                    window.location.href = nextUrl;
                }, 1000);

            } catch (error) {
                statusMessage.textContent = 'ERROR: Failed to save video. Redirecting anyway.';
                console.error(error);

                setTimeout(() => {
                    window.location.href = nextUrl;
                }, 2000);
            }
        };

        mediaRecorder.start();
        startTimer();
        statusMessage.textContent = 'Recording is ACTIVE (Border RED). Start reading now.';
        nextButton.disabled = false;

    } catch (error) {
        statusMessage.textContent = 'FATAL ERROR: Media access failed. Cannot start exam.';
        console.error('Media access failed:', error);
        nextButton.disabled = true;
    }
}

function stopRecordingAndProceed() {
    // Navigasi yang diharapkan setelah Stage 2
    const nextUrl = '../break_page/break_page_1.html';

    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();

        nextButton.disabled = true;
        nextButton.textContent = 'Processing...';
    } else if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        nextButton.disabled = true;
        nextButton.textContent = 'Processing...';
    } else {
        window.location.href = nextUrl;
    }
}

// --- Initialization ---

window.onload = startRecording;
nextButton.addEventListener('click', stopRecordingAndProceed);