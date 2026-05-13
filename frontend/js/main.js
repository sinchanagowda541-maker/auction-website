// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    updateNavBasedOnAuth();
});

// Toast Notifications
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';

    toast.innerHTML = `
        <i class="fas fa-${icon} toast-icon"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Authentication Helpers
function getToken() {
    return localStorage.getItem('token');
}

function getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

function isLoggedIn() {
    return !!getToken();
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

function updateNavBasedOnAuth() {
    const navLinks = document.getElementById('nav-links');
    if (!navLinks) return;

    const user = getUser();
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const isActive = (page) => currentPage === page;
    if (user) {
        navLinks.innerHTML = `
            <a href="index.html" class="${isActive('index.html') ? 'active' : ''}"><i class="fas fa-home"></i> Home</a>
            <a href="live-auctions.html" class="${isActive('live-auctions.html') ? 'active' : ''}"><i class="fas fa-gavel"></i> Live Auctions</a>
            <a href="profile.html" class="${isActive('profile.html') ? 'active' : ''}"><i class="fas fa-user-circle"></i> Profile</a>
            <a href="#" onclick="logout()" class="btn btn-outline"><i class="fas fa-sign-out-alt"></i> Logout</a>
        `;
    } else {
        navLinks.innerHTML = `
            <a href="index.html" class="${isActive('index.html') ? 'active' : ''}"><i class="fas fa-home"></i> Home</a>
            <a href="login.html" class="${isActive('login.html') ? 'active' : ''}"><i class="fas fa-sign-in-alt"></i> Login</a>
            <a href="register.html" class="${isActive('register.html') ? 'active' : ''}"><i class="fas fa-user-plus"></i> Sign Up</a>
        `;
    }
}

// API Fetch Wrapper
async function fetchAPI(endpoint, options = {}) {
    const url = `http://localhost:5000/api${endpoint}`;
    const token = getToken();
    
    const defaultHeaders = {
        'Content-Type': 'application/json'
    };

    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
}

// Countdown Timer logic
function initTimers() {
    const timers = document.querySelectorAll('.countdown-timer');
    
    setInterval(() => {
        timers.forEach(timer => {
            const endDate = new Date(timer.dataset.end).getTime();
            const now = new Date().getTime();
            const distance = endDate - now;

            if (distance < 0) {
                timer.innerHTML = "Ended";
                timer.style.color = "var(--text-muted)";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            let display = "";
            if (days > 0) display += `${days}d `;
            display += `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            timer.innerHTML = display;
        });
    }, 1000);
}
