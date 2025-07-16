// Authentication Module
class AuthManager {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.token = localStorage.getItem('skillforge_token');
        this.init();
    }

    async init() {
        // Check if user is already authenticated
        if (this.token) {
            await this.checkAuthStatus();
        }
        
        this.setupEventListeners();
        this.updateUI();
    }

    setupEventListeners() {
        // Auth modal triggers
        document.getElementById('getStarted')?.addEventListener('click', () => {
            this.showAuthModal('signup');
        });

        // Close modal
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('auth-overlay')) {
                this.hideAuthModal();
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideAuthModal();
            }
        });
    }

    showAuthModal(mode = 'login') {
        if (!document.getElementById('authModal')) {
            this.createAuthModal();
        }
        
        const modal = document.getElementById('authModal');
        const loginTab = document.getElementById('loginTab');
        const signupTab = document.getElementById('signupTab');
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');

        // Reset forms
        this.resetForms();
        
        // Set active tab
        if (mode === 'signup') {
            signupTab.classList.add('active');
            loginTab.classList.remove('active');
            signupForm.style.display = 'block';
            loginForm.style.display = 'none';
        } else {
            loginTab.classList.add('active');
            signupTab.classList.remove('active');
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hideAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            this.resetForms();
        }
    }

    createAuthModal() {
        const modalHTML = `
            <div class="auth-overlay" id="authModal">
                <div class="auth-container">
                    <div class="auth-header">
                        <button class="auth-close" onclick="window.Auth.hideAuthModal()">×</button>
                        <div class="auth-logo">
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                <circle cx="20" cy="20" r="18" stroke="url(#authLogoGradient)" stroke-width="2" fill="none" opacity="0.3"/>
                                <circle cx="20" cy="20" r="8" fill="url(#authLogoGradient)"/>
                                <defs>
                                    <linearGradient id="authLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stop-color="#00ff88"/>
                                        <stop offset="100%" stop-color="#00d4ff"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                            <span class="auth-logo-text">UpskillBro</span>
                        </div>
                        <div class="auth-tabs">
                            <button class="auth-tab active" id="loginTab" onclick="window.Auth.switchTab('login')">
                                Sign In
                            </button>
                            <button class="auth-tab" id="signupTab" onclick="window.Auth.switchTab('signup')">
                                Sign Up
                            </button>
                        </div>
                    </div>

                    <!-- Login Form -->
                    <form class="auth-form" id="loginForm" style="display: block;">
                        <div id="loginAlert"></div>
                        
                        <div class="auth-form-group">
                            <label class="auth-label" for="loginEmail">Email</label>
                            <input type="email" id="loginEmail" class="auth-input" placeholder="Enter your email" required>
                            <div class="auth-error" id="loginEmailError"></div>
                        </div>

                        <div class="auth-form-group">
                            <label class="auth-label" for="loginPassword">Password</label>
                            <input type="password" id="loginPassword" class="auth-input" placeholder="Enter your password" required>
                            <div class="auth-error" id="loginPasswordError"></div>
                        </div>

                        <div class="auth-checkbox-group">
                            <input type="checkbox" id="rememberMe" class="auth-checkbox">
                            <label for="rememberMe" class="auth-checkbox-label">Remember me</label>
                        </div>

                        <button type="submit" class="auth-submit" id="loginSubmit">
                            <div class="loading-spinner"></div>
                            Sign In
                        </button>
                    </form>

                    <!-- Signup Form -->
                    <form class="auth-form" id="signupForm" style="display: none;">
                        <div id="signupAlert"></div>
                        
                        <div class="auth-form-row">
                            <div class="auth-form-group">
                                <label class="auth-label" for="firstName">First Name</label>
                                <input type="text" id="firstName" class="auth-input" placeholder="First name" required>
                                <div class="auth-error" id="firstNameError"></div>
                            </div>
                            <div class="auth-form-group">
                                <label class="auth-label" for="lastName">Last Name</label>
                                <input type="text" id="lastName" class="auth-input" placeholder="Last name" required>
                                <div class="auth-error" id="lastNameError"></div>
                            </div>
                        </div>

                        <div class="auth-form-group">
                            <label class="auth-label" for="signupEmail">Email</label>
                            <input type="email" id="signupEmail" class="auth-input" placeholder="Enter your email" required>
                            <div class="auth-error" id="signupEmailError"></div>
                        </div>

                        <div class="auth-form-group">
                            <label class="auth-label" for="signupPassword">Password</label>
                            <input type="password" id="signupPassword" class="auth-input" placeholder="Create a password" required>
                            <div class="password-strength" id="passwordStrength" style="display: none;">
                                <div class="strength-bar">
                                    <div class="strength-fill" id="strengthFill"></div>
                                </div>
                                <div class="strength-text" id="strengthText"></div>
                            </div>
                            <div class="auth-error" id="signupPasswordError"></div>
                        </div>

                        <button type="submit" class="auth-submit" id="signupSubmit">
                            <div class="loading-spinner"></div>
                            Create Account
                        </button>
                    </form>

                    <div class="auth-footer">
                        <div class="auth-footer-text" id="authFooterText">
                            Don't have an account? <a class="auth-footer-link" onclick="window.Auth.switchTab('signup')">Sign up</a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.setupFormListeners();
    }

    setupFormListeners() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Signup form
        document.getElementById('signupForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup();
        });

        // Password strength checker
        document.getElementById('signupPassword').addEventListener('input', (e) => {
            this.checkPasswordStrength(e.target.value);
        });

        // Real-time validation
        this.setupRealTimeValidation();
    }

    setupRealTimeValidation() {
        const inputs = document.querySelectorAll('.auth-input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    }

    validateField(input) {
        const value = input.value.trim();
        const fieldName = input.id;
        let isValid = true;
        let errorMessage = '';

        // Clear previous error
        input.classList.remove('error');
        const errorElement = document.getElementById(fieldName + 'Error');
        if (errorElement) errorElement.textContent = '';

        switch (fieldName) {
            case 'loginEmail':
            case 'signupEmail':
                if (!value) {
                    errorMessage = 'Email is required';
                    isValid = false;
                } else if (!this.isValidEmail(value)) {
                    errorMessage = 'Please enter a valid email';
                    isValid = false;
                }
                break;

            case 'loginPassword':
                if (!value) {
                    errorMessage = 'Password is required';
                    isValid = false;
                }
                break;

            case 'signupPassword':
                if (!value) {
                    errorMessage = 'Password is required';
                    isValid = false;
                } else if (value.length < 6) {
                    errorMessage = 'Password must be at least 6 characters';
                    isValid = false;
                } else if (!this.isStrongPassword(value)) {
                    errorMessage = 'Password must contain uppercase, lowercase, and number';
                    isValid = false;
                }
                break;

            case 'firstName':
            case 'lastName':
                if (!value) {
                    errorMessage = `${fieldName === 'firstName' ? 'First' : 'Last'} name is required`;
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'Name must be at least 2 characters';
                    isValid = false;
                }
                break;
        }

        if (!isValid) {
            input.classList.add('error');
            if (errorElement) {
                errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${errorMessage}`;
            }
        }

        return isValid;
    }

    checkPasswordStrength(password) {
        const strengthContainer = document.getElementById('passwordStrength');
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');

        if (!password) {
            strengthContainer.style.display = 'none';
            return;
        }

        strengthContainer.style.display = 'block';

        let score = 0;
        let feedback = '';

        // Length check
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;

        // Character variety
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        // Set strength level
        if (score < 3) {
            strengthFill.className = 'strength-fill weak';
            feedback = 'Weak password';
        } else if (score < 4) {
            strengthFill.className = 'strength-fill fair';
            feedback = 'Fair password';
        } else if (score < 5) {
            strengthFill.className = 'strength-fill good';
            feedback = 'Good password';
        } else {
            strengthFill.className = 'strength-fill strong';
            feedback = 'Strong password';
        }

        strengthText.textContent = feedback;
    }

    async handleLogin() {
        const submitBtn = document.getElementById('loginSubmit');
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Validate inputs
        if (!this.validateField(document.getElementById('loginEmail')) ||
            !this.validateField(document.getElementById('loginPassword'))) {
            return;
        }

        try {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, rememberMe })
            });

            const data = await response.json();

            if (data.success) {
                this.token = data.token;
                this.currentUser = data.user;
                this.isAuthenticated = true;

                localStorage.setItem('skillforge_token', this.token);
                
                this.showAlert('loginAlert', 'Welcome back! Redirecting...', 'success');
                
                setTimeout(() => {
                    this.hideAuthModal();
                    this.updateUI();
                    window.UpskillBro?.showNotification(`Welcome back, ${data.user.firstName}!`, 'success');
                }, 1500);

            } else {
                this.showAlert('loginAlert', data.message, 'error');
            }

        } catch (error) {
            console.error('Login error:', error);
            this.showAlert('loginAlert', 'Login failed. Please try again.', 'error');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }

    async handleSignup() {
        const submitBtn = document.getElementById('signupSubmit');
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;

        // Validate all inputs
        const inputs = ['firstName', 'lastName', 'signupEmail', 'signupPassword'];
        let isValid = true;
        
        inputs.forEach(inputId => {
            if (!this.validateField(document.getElementById(inputId))) {
                isValid = false;
            }
        });

        if (!isValid) return;

        try {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstName, lastName, email, password })
            });

            const data = await response.json();

            if (data.success) {
                this.token = data.token;
                this.currentUser = data.user;
                this.isAuthenticated = true;

                localStorage.setItem('skillforge_token', this.token);
                
                this.showAlert('signupAlert', 'Account created successfully! Welcome to UpskillBro!', 'success');
                
                setTimeout(() => {
                    this.hideAuthModal();
                    this.updateUI();
                    window.UpskillBro?.showNotification(`Welcome to UpskillBro, ${data.user.firstName}!`, 'success');
                }, 1500);

            } else {
                if (data.errors && data.errors.length > 0) {
                    const errorMessage = data.errors.map(err => err.msg).join(', ');
                    this.showAlert('signupAlert', errorMessage, 'error');
                } else {
                    this.showAlert('signupAlert', data.message, 'error');
                }
            }

        } catch (error) {
            console.error('Signup error:', error);
            this.showAlert('signupAlert', 'Registration failed. Please try again.', 'error');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }

    async checkAuthStatus() {
        try {
            const response = await fetch('/api/auth/check', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            const data = await response.json();

            if (data.success && data.authenticated) {
                this.isAuthenticated = true;
                this.currentUser = data.user;
            } else {
                this.logout();
            }

        } catch (error) {
            console.error('Auth check error:', error);
            this.logout();
        }
    }

    logout() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.token = null;
        localStorage.removeItem('skillforge_token');
        this.updateUI();
        window.UpskillBro?.showNotification('Logged out successfully', 'info');
    }

    updateUI() {
        const getStartedBtn = document.getElementById('getStarted');
        
        if (this.isAuthenticated && this.currentUser) {
            // Replace "Get Started" button with user profile
            if (getStartedBtn) {
                getStartedBtn.outerHTML = this.createUserProfileHTML();
                this.setupUserProfileListeners();
            }
        } else {
            // Show "Get Started" button
            if (!getStartedBtn) {
                const nav = document.querySelector('.nav');
                const userProfile = document.getElementById('userProfile');
                if (userProfile) {
                    userProfile.outerHTML = '<button class="cta-btn" id="getStarted">Get Started</button>';
                    this.setupEventListeners();
                }
            }
        }
    }

    createUserProfileHTML() {
        const initials = `${this.currentUser.firstName[0]}${this.currentUser.lastName[0]}`.toUpperCase();
        
        return `
            <div class="user-profile" id="userProfile">
                <div class="user-avatar">${initials}</div>
                <div class="user-info">
                    <div class="user-name">${this.currentUser.firstName}</div>
                    <div class="user-email">${this.currentUser.email}</div>
                </div>
                <div class="user-dropdown" id="userDropdown">
                    <button class="dropdown-item" onclick="window.Auth.showProfile()">
                        <i class="fas fa-user"></i> Profile
                    </button>
                    <button class="dropdown-item" onclick="window.Auth.showSettings()">
                        <i class="fas fa-cog"></i> Settings
                    </button>
                    <div class="dropdown-divider"></div>
                    <button class="dropdown-item danger" onclick="window.Auth.logout()">
                        <i class="fas fa-sign-out-alt"></i> Sign Out
                    </button>
                </div>
            </div>
        `;
    }

    setupUserProfileListeners() {
        const userProfile = document.getElementById('userProfile');
        const userDropdown = document.getElementById('userDropdown');

        if (userProfile && userDropdown) {
            userProfile.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('active');
            });

            document.addEventListener('click', () => {
                userDropdown.classList.remove('active');
            });
        }
    }

    switchTab(tab) {
        const loginTab = document.getElementById('loginTab');
        const signupTab = document.getElementById('signupTab');
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const footerText = document.getElementById('authFooterText');

        this.resetForms();

        if (tab === 'signup') {
            signupTab.classList.add('active');
            loginTab.classList.remove('active');
            signupForm.style.display = 'block';
            loginForm.style.display = 'none';
            footerText.innerHTML = 'Already have an account? <a class="auth-footer-link" onclick="window.Auth.switchTab(\'login\')">Sign in</a>';
        } else {
            loginTab.classList.add('active');
            signupTab.classList.remove('active');
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
            footerText.innerHTML = 'Don\'t have an account? <a class="auth-footer-link" onclick="window.Auth.switchTab(\'signup\')">Sign up</a>';
        }
    }

    resetForms() {
        // Clear all form inputs
        document.querySelectorAll('.auth-input').forEach(input => {
            input.value = '';
            input.classList.remove('error');
        });

        // Clear all error messages
        document.querySelectorAll('.auth-error').forEach(error => {
            error.textContent = '';
        });

        // Clear alerts
        document.querySelectorAll('[id$="Alert"]').forEach(alert => {
            alert.innerHTML = '';
        });

        // Hide password strength
        const strengthContainer = document.getElementById('passwordStrength');
        if (strengthContainer) {
            strengthContainer.style.display = 'none';
        }

        // Reset submit buttons
        document.querySelectorAll('.auth-submit').forEach(btn => {
            btn.classList.remove('loading');
            btn.disabled = false;
        });
    }

    showAlert(containerId, message, type) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const alertClass = type === 'success' ? 'auth-success' : 'auth-alert';
        const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle';

        container.innerHTML = `
            <div class="${alertClass}">
                <i class="${icon}"></i>
                ${message}
            </div>
        `;
    }

    showProfile() {
        window.UpskillBro?.showNotification('Profile feature coming soon!', 'info');
    }

    showSettings() {
        window.UpskillBro?.showNotification('Settings feature coming soon!', 'info');
    }

    // Utility methods
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    isStrongPassword(password) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password);
    }

    // API helper with auth headers
    async apiCall(endpoint, options = {}) {
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(this.token && { 'Authorization': `Bearer ${this.token}` })
            }
        };

        const response = await fetch(endpoint, { ...defaultOptions, ...options });
        
        if (response.status === 401) {
            this.logout();
            throw new Error('Authentication required');
        }

        return response;
    }
}

// Initialize Auth Manager
window.Auth = new AuthManager();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}