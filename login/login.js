// ===================================
// HARD-CODED CREDENTIALS (ADMIN ONLY)
// ===================================
const CREDENTIALS = {
    ADMIN_USER: "Admin Examination",
    ADMIN_PASS: "SuperSecretKey123"
};

// ===============================
// SHOW / HIDE PASSWORD HANDLER
// ===============================
function togglePasswordVisibility() {
    const passwordField = document.getElementById("password");
    const toggleIcon = document.getElementById("toggleIcon");

    if (passwordField.type === "password") {
        passwordField.type = "text";
        toggleIcon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        passwordField.type = "password";
        toggleIcon.classList.replace("fa-eye-slash", "fa-eye");
    }
}

// =====================================
// TOGGLE ADMIN LOGIN MODE
// =====================================
function handleAdminToggle() {
    const loginBox = document.querySelector(".login-box");
    const title = document.getElementById("login-title");
    const toggleBtn = document.getElementById("admin-toggle");

    loginBox.classList.toggle("admin-mode");

    if (loginBox.classList.contains("admin-mode")) {
        title.textContent = "Administrator Login";
        toggleBtn.textContent = "Switch to Participant Login";
    } else {
        title.textContent = "Participant Login";
        toggleBtn.textContent = "Switch to Admin Login";
    }
}

// ===============================================
// MAIN LOGIN FUNCTION (PARTICIPANT + ADMIN)
// ===============================================
async function handleLoginSubmit(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const messageElement = document.getElementById("message");
    const isAdminMode = document.querySelector(".login-box").classList.contains("admin-mode");

    messageElement.textContent = "";
    messageElement.style.color = "red";

    // ===============================
    // ADMIN LOGIN CHECK
    // ===============================
    if (isAdminMode) {
        if (username === CREDENTIALS.ADMIN_USER && password === CREDENTIALS.ADMIN_PASS) {
            messageElement.style.color = "green";
            messageElement.textContent = "Login Successful as Administrator!";
            setTimeout(() => window.location.href = "../welcome/welcome.html", 1500);
        } else {
            messageElement.textContent = "Invalid Admin Credentials!";
        }
        return;
    }

    // ===============================
    // PARTICIPANT LOGIN (FIRESTORE)
    // ===============================

    // convert "Hilman Nur" → "hilman_nur"
    const docId = username.toLowerCase().replace(/ /g, "_");
    const participantDocRef = db.collection("participants").doc(docId);

    try {
        const docSnap = await participantDocRef.get();

        if (!docSnap.exists) {
            messageElement.textContent = "User not found!";
            return;
        }

        const userData = docSnap.data();

        if (userData.password !== password) {
            messageElement.textContent = "Incorrect password!";
            return;
        }

        const currentAttempts = userData.login_attempts || 0;

        if (currentAttempts >= 2) {
            messageElement.textContent = `Access Denied! Login limit reached (${currentAttempts}/2).`;
            return;
        }

        // ========== FIX: BUG DI SINI ==========
        await participantDocRef.set({
            login_attempts: currentAttempts + 1,
            last_login: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        // =======================================

        // SUCCESS
        messageElement.style.color = "green";
        messageElement.textContent = `Login Successful! Welcome, ${username}.`;

        setTimeout(() => {
            window.location.href = "../welcome/welcome.html";
        }, 1500);

    } catch (error) {
        console.error("Firestore Error:", error);
        messageElement.textContent = "Login error — cannot connect to server!";
    }
}
