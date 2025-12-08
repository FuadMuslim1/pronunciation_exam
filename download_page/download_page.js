// download_page.js

const DB_NAME = 'ExamRecordsDB';
const STORE_NAME = 'videos';

// --- IndexedDB Functions ---

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
            reject('A database error occurred.'); // Terjemahan: Terjadi kesalahan database.
        };
    });
}

async function getRecording(key) {
    let db; // Declared outside try
    try {
        db = await openDatabase();
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);

        const request = store.get(key);

        return new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                db.close(); // CORRECTION: Closing DB connection after success
                resolve(event.target.result); 
            };
            request.onerror = (event) => {
                db.close(); // CORRECTION: Closing DB connection after failure
                reject('Failed to retrieve recording for key: ' + key); // Terjemahan: Gagal mengambil rekaman...
            };
        });
    } catch (error) {
        if (db) db.close(); // CORRECTION: Ensure it closes if error before transaction
        console.error("Error fetching data from DB:", error); // Terjemahan: Kesalahan saat mengambil data...
        return null;
    }
}

// --- Download Function ---

function setupDownloadButton(buttonElement, blob, key) {
    // Using global regex replace to ensure all '_' in key are replaced
    // stage_1_video -> Stage 1 Video
    const stage_any = key.replace(/_/g, ' ').replace(' video', '').toUpperCase();

    if (blob && blob instanceof Blob) {
        // If Blob is found
        const url = URL.createObjectURL(blob);

        buttonElement.innerHTML = `<i class="fas fa-download"></i> Download ${stage_any}`; // Terjemahan: Unduh
        buttonElement.disabled = false;

        // Add event listener to initiate download
        buttonElement.addEventListener('click', () => {
            const a = document.createElement('a');
            a.href = url;
            // File name: key_YYYY-MM-DDTHH-MM-SS.webm
            a.download = `${key}_${new Date().toISOString().slice(0, 19).replace(/[:]/g, '-')}.webm`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // CORRECTION: Revoke URL immediately after download is initiated
            URL.revokeObjectURL(url);
        });

    } else {
        // If Blob is not found
        buttonElement.innerHTML = `<i class="fas fa-times-circle"></i> ${stage_any} (Not Found)`; // Terjemahan: Tidak Ditemukan
        buttonElement.style.backgroundColor = '#dc3545';
        buttonElement.disabled = true;
    }
}


async function loadAllRecordings() {
    const downloadButtons = document.querySelectorAll('.download-list button');

    // CORRECTION: Changing serial for...of to parallel Promise.all for performance
    const loadingPromises = Array.from(downloadButtons).map(async (button) => {
        const key = button.getAttribute('data-key');

        const blob = await getRecording(key);

        setupDownloadButton(button, blob, key);
    });

    try {
        await Promise.all(loadingPromises);
    } catch (error) {
        console.error("Failed to load all recordings:", error); // Terjemahan: Gagal memuat semua rekaman
    }
}

// --- Initialization ---
window.onload = loadAllRecordings;