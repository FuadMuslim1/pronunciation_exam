// GO TO LOGIN PAGE
function goLogin() {
    window.location.href = "login/login.html";
}

// REMOVE GREETING ON CLICK
document.addEventListener("click", () => {
    const g = document.getElementById("greeting");
    if (!g) return;

    g.style.transition = "0.7s";
    g.style.opacity = "0";

    setTimeout(() => g.remove(), 700);
});

// ----- FLOATING IMAGES -----

const imgNames = ["a.png", "b.png", "c.png", "d.png", "e.png", "f.png", "g.png", "h.png","i.png"];
const images = [];

function createFloatingImages() {
    imgNames.forEach((name, i) => {
        const img = document.createElement("img");
        img.src = `img/${name}`;
        img.className = "floating-img";

        img.style.left = `${window.innerWidth / 4}px`;
        img.style.top = `${window.innerHeight / 4}px`;

        document.body.appendChild(img);
        images.push(img);
    });
}

function randomMove() {
    images.forEach(img => {
        const x = Math.random() * (window.innerWidth - 150);
        const y = Math.random() * (window.innerHeight - 150);
        img.style.transform = `translate(${x}px, ${y}px)`;
    });
}

function flyToLogin() {
    const loginBtn = document.getElementById("loginBtn");
    const rect = loginBtn.getBoundingClientRect();

    images.forEach(img => {
        const targetX = rect.left + rect.width / 2 - 55;
        const targetY = rect.top + rect.height / 2 - 55;

        img.style.transition = "transform 3s ease-out, opacity 3s ease-out";
        img.style.transform = `translate(${targetX}px, ${targetY}px) scale(0.1)`;
        img.style.opacity = "0";

        setTimeout(() => img.remove(), 5000);
    });
}

// START
createFloatingImages();
setInterval(randomMove, 1000);

// After 3 seconds → fly into login button
setTimeout(flyToLogin, 10000);
