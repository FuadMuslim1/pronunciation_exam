/* ==========================
   NAVIGATION
========================== */
// GO TO LOGIN PAGE
function goLogin() {
    window.location.href = "login/login.html";
}

/* ==========================
   GREETING OVERLAY
========================== */
// REMOVE GREETING ON CLICK
document.addEventListener("click", () => {
    const g = document.getElementById("greeting");
    if (!g) return;

    g.style.transition = "0.7s";
    g.style.opacity = "0";

    setTimeout(() => g.remove(), 700);
});


