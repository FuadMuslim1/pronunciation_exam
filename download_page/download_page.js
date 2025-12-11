// ===============================
// Constants
// ===============================
const DB_NAME = 'ExamRecordsDB';
const STORE_NAME = 'videos';

// ===============================
// IndexedDB Functions
// ===============================
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => {
            console.error('Database error:', event.target.errorCode);
            reject('Terjadi kesalahan database.');
        };
    });
}

async function getRecording(key) {
    let db;
    try {
        db = await openDatabase();
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);

        const request = store.get(key);

        return new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                db.close();
                resolve(event.target.result);
            };
            request.onerror = (event) => {
                db.close();
                reject(`Gagal mengambil rekaman untuk key: ${key}`);
            };
        });
    } catch (error) {
        if (db) db.close();
        console.error("Kesalahan saat mengambil data dari DB:", error);
        return null;
    }
}

// ===============================
// Download Button Setup
// ===============================
function setupDownloadButton(buttonElement, blob, key) {
    const stageName = key.replace(/_/g, ' ').replace(' video', '').toUpperCase();

    if (blob && blob instanceof Blob) {
        const url = URL.createObjectURL(blob);
        buttonElement.innerHTML = `<i class="fas fa-download"></i> Download ${stageName}`;
        buttonElement.disabled = false;

        buttonElement.addEventListener('click', () => {
            const a = document.createElement('a');
            a.href = url;
            a.download = `${key}_${new Date().toISOString().slice(0, 19).replace(/[:]/g, '-')}.webm`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });

    } else {
        buttonElement.innerHTML = `<i class="fas fa-times-circle"></i> ${stageName} (Not Found)`;
        buttonElement.style.backgroundColor = '#dc3545';
        buttonElement.disabled = true;
    }
}

// ===============================
// Load All Recordings
// ===============================
async function loadAllRecordings() {
    const downloadButtons = document.querySelectorAll('.download-list button');

    const loadingPromises = Array.from(downloadButtons).map(async (button) => {
        const key = button.getAttribute('data-key');
        const blob = await getRecording(key);
        setupDownloadButton(button, blob, key);
    });

    try {
        await Promise.all(loadingPromises);
    } catch (error) {
        console.error("Gagal memuat semua rekaman:", error);
    }
}

// ===============================
// Initialization
// ===============================
window.onload = loadAllRecordings;
