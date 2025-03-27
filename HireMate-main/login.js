// Store captcha text for validation
let userCaptcha = '';
let professionalCaptcha = '';

// Show initial profile selection and hide other forms
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('profile-selection').style.display = 'block';
    document.getElementById('user-login').style.display = 'none';
    document.getElementById('professional-login').style.display = 'none';
    document.getElementById('user-registration').style.display = 'none';
    document.getElementById('professional-registration').style.display = 'none';
});

// Generate random captcha text
function generateCaptcha() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return captcha;
}

// Refresh captcha
function refreshCaptcha(type) {
    const captcha = generateCaptcha();
    if (type === 'user') {
        userCaptcha = captcha;
        document.getElementById('user-captcha-text').textContent = captcha;
    } else {
        professionalCaptcha = captcha;
        document.getElementById('professional-captcha-text').textContent = captcha;
    }
}

// Show login form
function showLogin(type) {
    document.getElementById('profile-selection').style.display = 'none';
    document.getElementById('user-login').style.display = 'none';
    document.getElementById('professional-login').style.display = 'none';
    document.getElementById('user-registration').style.display = 'none';
    document.getElementById('professional-registration').style.display = 'none';

    if (type === 'user') {
        document.getElementById('user-login').style.display = 'block';
        refreshCaptcha('user');
    } else {
        document.getElementById('professional-login').style.display = 'block';
        refreshCaptcha('professional');
    }
}

// Show registration form
function showRegistration(type) {
    document.getElementById('profile-selection').style.display = 'none';
    document.getElementById('user-login').style.display = 'none';
    document.getElementById('professional-login').style.display = 'none';
    document.getElementById('user-registration').style.display = 'none';
    document.getElementById('professional-registration').style.display = 'none';

    if (type === 'user') {
        document.getElementById('user-registration').style.display = 'block';
    } else {
        document.getElementById('professional-registration').style.display = 'block';
    }
}

// Handle login
function handleLogin(type) {
    const form = type === 'user' ? 
        document.getElementById('userLoginForm') : 
        document.getElementById('professionalLoginForm');
    
    const captchaInput = document.getElementById(`${type}-captcha-input`).value;
    const correctCaptcha = type === 'user' ? userCaptcha : professionalCaptcha;

    if (captchaInput !== correctCaptcha) {
        alert('Invalid captcha! Please try again.');
        refreshCaptcha(type);
        return false;
    }

    // Here you would typically handle the login authentication with a backend
    alert('Login successful!');
    window.location.href = 'index.html'; // Redirect to main page
    return false; // Prevent form submission
}

// Handle registration
function handleRegistration(type) {
    const form = type === 'user' ? 
        document.getElementById('userRegistrationForm') : 
        document.getElementById('professionalRegistrationForm');
    
    const password = form.querySelector('input[type="password"]').value;
    const confirmPassword = form.querySelectorAll('input[type="password"]')[1].value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return false;
    }

    // Here you would typically handle the registration with a backend
    alert('Registration successful! Please login.');
    showLogin(type);
    return false; // Prevent form submission
} 