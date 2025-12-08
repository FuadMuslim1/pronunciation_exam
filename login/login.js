// Credential Data (Stored here as a simple example, not a production best practice)
const CREDENTIALS = {
    PARTICIPANT_USER: "Fajar Sadboy",
    PARTICIPANT_PASS: "Sumbawa, May 31, 2007",
    ADMIN_USER: "Admin Examination",
    ADMIN_PASS: "SuperSecretKey123"
};

// --- MAIN FUNCTIONS ---

/**
 * Toggles the password input type between 'password' and 'text'.
 * Changes the eye icon accordingly.
 */
function togglePasswordVisibility() {
    const passwordField = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');
    
    // Check input type
    if (passwordField.type === 'password') {
        passwordField.type = 'text'; // Change to text (Show)
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash'); // Change icon to closed eye
    } else {
        passwordField.type = 'password'; // Change back to password (Hide)
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye'); // Change icon to open eye
    }
}

/**
 * Handles the login form submission process.
 */
function handleLoginSubmit(event) {
    event.preventDefault(); // Prevents page reload by default
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const messageElement = document.getElementById('message');
    
    // Determine the current mode: true if admin, false if participant
    let is_admin_mode = document.querySelector('.login-box').classList.contains('admin-mode');
    
    messageElement.textContent = ''; // Reset message
    messageElement.style.color = 'red'; // Default error message color

    let loginSuccessful = false;
    let successMessage = '';

    if (is_admin_mode) {
        // Admin Login Logic
        if (username === CREDENTIALS.ADMIN_USER && password === CREDENTIALS.ADMIN_PASS) {
            loginSuccessful = true;
            successMessage = 'Login Successful as Administrator!';
        } else {
            messageElement.textContent = 'Failed! Invalid Admin Credentials.';
        }
    } else {
        // Participant Login Logic
        if (username === CREDENTIALS.PARTICIPANT_USER && password === CREDENTIALS.PARTICIPANT_PASS) {
            loginSuccessful = true;
            successMessage = `Login Successful! Welcome, ${username}.`;
            redirectPage = '../welcome/welcome.html'; // <<< KOREKSI UTAMA: Arahkan ke welcome.html
        } else {
            messageElement.textContent = 'Failed! Invalid Full Name or Password.';
        }
    }

    if (loginSuccessful) {
        messageElement.textContent = successMessage;
        messageElement.style.color = 'green';
        
        // Redirect setelah success
        setTimeout(() => {
            // alert(successMessage + ' Redirecting...'); // Hilangkan alert jika tidak diperlukan
            window.location.href = redirectPage; // Lakukan pengalihan
        }, 1500);

    } else {
        // Clear error message after 5 seconds
        setTimeout(() => {
            messageElement.textContent = '';
        }, 5000);
    }
}


/**
 * Handles the mode change between Participant and Administrator (Requires 'admin-toggle' button in HTML).
 */
function handleAdminToggle() {
    const loginBox = document.querySelector('.login-box');
    const titleElement = document.querySelector('h2');
    const toggleButton = document.getElementById('admin-toggle'); 
    
    // Toggle 'admin-mode' class
    loginBox.classList.toggle('admin-mode');
    
    if (loginBox.classList.contains('admin-mode')) {
        titleElement.textContent = 'Administrator Login';
        if(toggleButton) {
             toggleButton.textContent = 'Admin Mode: ON';
             toggleButton.classList.add('admin-active');
        }
    } else {
        titleElement.textContent = 'Participant Login';
        if(toggleButton) {
            toggleButton.textContent = 'Admin Mode: OFF';
            toggleButton.classList.remove('admin-active');
        }
    }
}


// --- MAIN EXECUTION BLOCK (Setting up Event Listeners) ---
document.addEventListener('DOMContentLoaded', function() {
    // 1. Event Listener for Form Submit (Login)
    document.getElementById('login-form').addEventListener('submit', handleLoginSubmit);

    // 2. Event Listener for Admin Toggle 
    const adminToggleElement = document.getElementById('admin-toggle');
    if (adminToggleElement) {
        adminToggleElement.addEventListener('click', handleAdminToggle);
    }
});