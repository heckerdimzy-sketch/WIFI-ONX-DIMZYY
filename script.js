// ============================================
// WiFi Pass Viewer - SCRIPT FINAL (1 MENIT)
// ============================================

// === ELEMEN ===
const loginPage = document.getElementById('loginPage');
const registerPage = document.getElementById('registerPage');
const dashboardPage = document.getElementById('dashboardPage');

const loginUser = document.getElementById('loginUser');
const loginPass = document.getElementById('loginPass');
const loginBtn = document.getElementById('loginBtn');
const loginMsg = document.getElementById('loginMsg');

const regUser = document.getElementById('regUser');
const regPass = document.getElementById('regPass');
const regConfirm = document.getElementById('regConfirm');
const registerBtn = document.getElementById('registerBtn');
const regMsg = document.getElementById('regMsg');

const wifiName = document.getElementById('wifiName');
const generateBtn = document.getElementById('generateBtn');
const logoutBtn = document.getElementById('logoutBtn');

const progressArea = document.getElementById('progressArea');
const progressBar = document.getElementById('progressBar');
const timerText = document.getElementById('timerText');
const passwordValue = document.getElementById('passwordValue');

// === STATE ===
let timerInterval = null;

// === FUNGSI USER ===
function getUsers() {
    const data = localStorage.getItem('users');
    if (data) return JSON.parse(data);
    const defaultUsers = { admin: '12345' };
    localStorage.setItem('users', JSON.stringify(defaultUsers));
    return defaultUsers;
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// === PINDAH HALAMAN ===
function showPage(page) {
    [loginPage, registerPage, dashboardPage].forEach(p => p.classList.remove('active'));
    page.classList.add('active');
}

// === LOGIN ===
loginBtn.addEventListener('click', () => {
    const user = loginUser.value.trim();
    const pass = loginPass.value.trim();
    if (!user || !pass) {
        loginMsg.textContent = '⚠️ Isi Semua Kolom!';
        return;
    }
    const users = getUsers();
    if (users[user] && users[user] === pass) {
        loginMsg.textContent = '';
        showPage(dashboardPage);
        // Reset dashboard
        passwordValue.textContent = '⸻';
        progressBar.style.width = '0%';
        timerText.textContent = '⏳ Menunggu...';
        progressArea.style.display = 'none';
        generateBtn.disabled = false;
        generateBtn.textContent = '🔍 Lihat Password';
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        loginUser.value = '';
        loginPass.value = '';
    } else {
        loginMsg.textContent = '❌ Username Atau Password Salah!';
    }
});

// === REGISTER ===
registerBtn.addEventListener('click', () => {
    const user = regUser.value.trim();
    const pass = regPass.value.trim();
    const confirm = regConfirm.value.trim();
    if (!user || !pass || !confirm) {
        regMsg.textContent = '⚠️ Isi Semua Kolom!';
        return;
    }
    if (pass !== confirm) {
        regMsg.textContent = '❌ Konfirmasi Password Tidak Cocok!';
        return;
    }
    const users = getUsers();
    if (users[user]) {
        regMsg.textContent = '❌ Username Sudah Terdaftar!';
        return;
    }
    users[user] = pass;
    saveUsers(users);
    regMsg.textContent = '✅ Pendaftaran Berhasil! Silakan Login.';
    setTimeout(() => {
        showPage(loginPage);
        regMsg.textContent = '';
        regUser.value = '';
        regPass.value = '';
        regConfirm.value = '';
    }, 1500);
});

// === TOGGLE LOGIN / REGISTER ===
document.getElementById('toRegister').addEventListener('click', () => {
    showPage(registerPage);
    loginMsg.textContent = '';
});
document.getElementById('toLogin').addEventListener('click', () => {
    showPage(loginPage);
    regMsg.textContent = '';
});

// === FUNGSI GENERATE PASSWORD ===
function generateRandomPassword(length = 12) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// === FUNGSI TIMER (1 MENIT) ===
function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    progressBar.style.width = '0%';
    timerText.textContent = '⏳ Menunggu...';
    passwordValue.textContent = '⸻';
    progressArea.style.display = 'block';

    generateBtn.disabled = true;
    generateBtn.textContent = '⏳ Memproses...';

    const totalSeconds = 60; // 1 MENIT
    let elapsed = 0;
    const newPassword = generateRandomPassword(12);

    timerInterval = setInterval(() => {
        elapsed++;
        const progress = (elapsed / totalSeconds) * 100;
        progressBar.style.width = Math.min(progress, 100) + '%';

        const remaining = totalSeconds - elapsed;
        const seconds = remaining;
        timerText.textContent = `⏳ Menunggu ${seconds} Detik`;

        if (elapsed >= totalSeconds) {
            clearInterval(timerInterval);
            timerInterval = null;
            progressBar.style.width = '100%';
            timerText.textContent = '✅ Password Siap!';
            passwordValue.textContent = newPassword;
            generateBtn.disabled = false;
            generateBtn.textContent = '🔍 Lihat Password';
        }
    }, 1000);
}

// === TOMBOL GENERATE ===
generateBtn.addEventListener('click', () => {
    const name = wifiName.value.trim();
    if (!name) {
        passwordValue.textContent = '⚠️ Masukkan Nama WiFi!';
        return;
    }
    startTimer();
});

// === LOGOUT ===
logoutBtn.addEventListener('click', () => {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    showPage(loginPage);
    wifiName.value = '';
    passwordValue.textContent = '⸻';
    progressBar.style.width = '0%';
    timerText.textContent = '⏳ Menunggu...';
    progressArea.style.display = 'none';
    generateBtn.disabled = false;
    generateBtn.textContent = '🔍 Lihat Password';
});

console.log('🔥 WiFi Pass Viewer - 1 Menit | Title Case');
console.log('📌 Default: admin / 12345');
console.log('⏱️ Tombol akan lock selama 1 menit');