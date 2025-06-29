// Global State
let currentModule = 'skilltree';
let focusMode = false;
let userProgress = JSON.parse(localStorage.getItem('skillforge_progress') || '{}');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    createParticles();
    updateNavIndicator();
});

// Initialize Application
function initializeApp() {
    // Initialize module display
    initializeModules();
    
    // Load user progress
    updateUserStats();
    
    // Initialize modules
    if (window.SkillTree) SkillTree.init();
    if (window.TerminalGPT) TerminalGPT.init();
    if (window.ResumeGPT) ResumeGPT.init();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    console.log('🚀 UpskillBro initialized');
}

// Event Listeners
function setupEventListeners() {
    // Navigation tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => switchModule(tab.dataset.module));
    });
    
    // Hero CTAs
    document.getElementById('startLearning')?.addEventListener('click', () => {
        switchModule('skilltree');
        document.querySelector('.main-content').scrollIntoView({ behavior: 'smooth' });
    });
    
    document.getElementById('exploreTools')?.addEventListener('click', () => {
        switchModule('terminal');
        document.querySelector('.main-content').scrollIntoView({ behavior: 'smooth' });
    });
    
    document.getElementById('getStarted')?.addEventListener('click', () => {
        document.querySelector('.main-content').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Konami Code Easter Egg
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.code);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
            activateGodMode();
            konamiCode = [];
        }
    });
}

// Module Switching
function switchModule(moduleName) {
    console.log('Switching to module:', moduleName);
    
    if (moduleName === currentModule) return;
    
    // Update navigation tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    const activeTab = document.querySelector(`[data-module="${moduleName}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Hide all modules first
    document.querySelectorAll('.module').forEach(module => {
        module.classList.remove('active');
        module.style.display = 'none';
    });
    
    // Show only the selected module
    const activeModule = document.getElementById(moduleName);
    if (activeModule) {
        activeModule.style.display = 'block';
        activeModule.classList.add('active');
        console.log('Module activated:', moduleName);
    }
    
    currentModule = moduleName;
    
    // Module-specific initialization
    setTimeout(() => {
        switch(moduleName) {
            case 'skilltree':
                if (window.SkillTree) SkillTree.refresh();
                break;
            case 'terminal':
                if (window.TerminalGPT) TerminalGPT.focus();
                break;
            case 'resume':
                if (window.ResumeGPT) ResumeGPT.focus();
                break;
        }
    }, 100);
}

// Initialize first module
function initializeModules() {
    // Hide all modules initially
    document.querySelectorAll('.module').forEach(module => {
        module.style.display = 'none';
        module.classList.remove('active');
    });
    
    // Remove active from all tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show first module (skilltree)
    const firstModule = document.getElementById('skilltree');
    if (firstModule) {
        firstModule.style.display = 'block';
        firstModule.classList.add('active');
    }
    
    // Set first tab as active
    const firstTab = document.querySelector('.nav-tab[data-module="skilltree"]');
    if (firstTab) {
        firstTab.classList.add('active');
    }
    
    currentModule = 'skilltree';
}

// Focus Mode
function toggleFocusMode() {
    focusMode = !focusMode;
    document.body.classList.toggle('focus-mode', focusMode);
    
    const focusToggle = document.getElementById('focusToggle');
    focusToggle.innerHTML = focusMode 
        ? '<i class="fas fa-eye-slash"></i>' 
        : '<i class="fas fa-eye"></i>';
    
    showNotification(focusMode ? 'Focus Mode ON' : 'Focus Mode OFF');
}

// Search Functionality
function openSearch() {
    document.getElementById('searchModal').classList.add('active');
    document.getElementById('searchInput').focus();
}

function closeSearch() {
    document.getElementById('searchModal').classList.remove('active');
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResults').innerHTML = '';
}

// Keyboard Shortcuts
function handleKeyboardShortcuts(e) {
    // Prevent shortcuts when typing in inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        if (e.key === 'Escape') {
            e.target.blur();
        }
        return;
    }
    
    switch(e.key) {
        case '/':
            e.preventDefault();
            openSearch();
            break;
        case 'Escape':
            closeSearch();
            closeModal();
            break;
        case 'f':
        case 'F':
            if (e.ctrlKey || e.metaKey) return;
            e.preventDefault();
            toggleFocusMode();
            break;
    }
    
    // Module switching shortcuts
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                switchModule('skilltree');
                break;
            case '2':
                e.preventDefault();
                switchModule('terminal');
                break;
            case '3':
                e.preventDefault();
                switchModule('resume');
                break;
        }
    }
}

// User Progress Management
function updateUserStats() {
    const stats = calculateUserStats();
    
    document.getElementById('userLevel').textContent = stats.level;
    document.getElementById('userXP').textContent = stats.xp.toLocaleString();
    document.getElementById('completedSkills').textContent = stats.completedSkills;
}

function calculateUserStats() {
    const completed = Object.values(userProgress).filter(Boolean).length;
    const xp = completed * 200 + Math.floor(Math.random() * 500);
    const level = Math.floor(xp / 500) + 1;
    
    return {
        level,
        xp,
        completedSkills: completed
    };
}

function saveProgress(skillId, completed = true) {
    userProgress[skillId] = completed;
    localStorage.setItem('skillforge_progress', JSON.stringify(userProgress));
    updateUserStats();
    
    if (completed) {
        showNotification(`Skill completed! +200 XP`, 'success');
        createCelebrationEffect();
    }
}

// Visual Effects
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        particlesContainer.appendChild(particle);
    }
}

function createCelebrationEffect() {
    const colors = ['#00ff88', '#00d4ff', '#ff0040'];
    
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: 50%;
            left: 50%;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            animation: confetti 2s ease-out forwards;
        `;
        
        const angle = (Math.PI * 2 * i) / 20;
        const velocity = 100 + Math.random() * 100;
        
        confetti.style.setProperty('--dx', Math.cos(angle) * velocity + 'px');
        confetti.style.setProperty('--dy', Math.sin(angle) * velocity + 'px');
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 2000);
    }
}

// Add confetti animation
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confetti {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

// Loading States
function showLoading(text = 'Processing...') {
    const overlay = document.getElementById('loadingOverlay');
    const loadingText = overlay.querySelector('.loading-text');
    loadingText.textContent = text;
    overlay.classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

// Notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const colors = {
        info: 'var(--accent-secondary)',
        success: 'var(--accent-primary)',
        error: 'var(--accent-danger)'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: var(--primary-bg);
        padding: 16px 24px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 14px;
        z-index: 9999;
        animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
}

// Add notification animations
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyle);

// Modal Management
function closeModal() {
    document.querySelectorAll('.skill-modal, .search-modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// God Mode Easter Egg
function activateGodMode() {
    document.body.style.filter = 'hue-rotate(180deg) saturate(2)';
    document.body.style.animation = 'pulse 0.5s infinite alternate';
    
    showNotification('🔥 GOD MODE ACTIVATED! 🔥', 'success');
    
    // Add pulse animation
    const godModeStyle = document.createElement('style');
    godModeStyle.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            100% { transform: scale(1.02); }
        }
    `;
    document.head.appendChild(godModeStyle);
    
    // Reset after 10 seconds
    setTimeout(() => {
        document.body.style.filter = '';
        document.body.style.animation = '';
        showNotification('God Mode deactivated', 'info');
    }, 10000);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    document.querySelectorAll('.card, .skill-node, .roadmap-level').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Resize handler
window.addEventListener('resize', debounce(() => {
    // Handle responsive updates
}, 250));

// Export global functions
window.UpskillBro = {
    switchModule,
    showLoading,
    hideLoading,
    showNotification,
    saveProgress,
    userProgress
};