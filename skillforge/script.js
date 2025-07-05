// Global State
let currentModule = 'skilltree';
let focusMode = false;
let userProgress = JSON.parse(localStorage.getItem('skillforge_progress') || '{}');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    createParticles();
});

function updateNavIndicator() {
    // Navigation indicator function
}

// Initialize Application
function initializeApp() {
    // Handle initial route
    handleInitialRoute();
    
    // Initialize module display
    initializeModules();
    
    // Load user progress
    updateUserStats();
    
    // Initialize modules
    if (window.SkillTree) SkillTree.init();
    if (window.RoadmapModule) RoadmapModule.init();
    if (window.ResumeGPT) ResumeGPT.init();
    if (window.TechNews) TechNews.init();
    if (window.TechBlogs) TechBlogs.init();
    
    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.module) {
            switchModule(e.state.module);
        } else {
            handleInitialRoute();
        }
    });
    
    // Initialize new modules
    setTimeout(() => {
        initMentorModule();
        initJobsModule();
    }, 500);
    
    // Initialize career path selector
    initCareerSelector();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize rotating taglines
    initRotatingTaglines();
    
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
        document.getElementById('careerSelector').scrollIntoView({ behavior: 'smooth' });
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
    
    // Update URL without page reload
    const routes = {
        'skilltree': '#learning-path',
        'roadmap': '#roadmaps', 
        'mentor': '#mentor',
        'jobs': '#jobs',
        'news': '#tech-news',
        'blogs': '#blogs'
    };
    
    if (routes[moduleName]) {
        history.pushState({module: moduleName}, '', routes[moduleName]);
    }
    
    // Update navigation tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Update top nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
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
            case 'mentor':
                initMentorModule();
                break;
            case 'jobs':
                initJobsModule();
                break;
            case 'resume':
                if (window.ResumeGPT) ResumeGPT.focus();
                break;
            case 'news':
                if (window.TechNews) TechNews.init();
                break;
            case 'blogs':
                if (window.TechBlogs) TechBlogs.init();
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
        case 'Escape':
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
                switchModule('roadmap');
                break;
            case '3':
                e.preventDefault();
                switchModule('mentor');
                break;
            case '4':
                e.preventDefault();
                switchModule('jobs');
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
function showLoading(text = '') {
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
    document.querySelectorAll('.skill-modal').forEach(modal => {
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

// Career Path Selector
function initCareerSelector() {
    const careerCards = document.querySelectorAll('.career-card');
    const roadmapViewer = document.getElementById('roadmapViewer');
    const careerSelector = document.getElementById('careerSelector');
    const backBtn = document.getElementById('backBtn');
    
    careerCards.forEach(card => {
        card.addEventListener('click', () => {
            const path = card.dataset.path;
            showRoadmap(path);
        });
    });
    
    backBtn?.addEventListener('click', () => {
        roadmapViewer.style.display = 'none';
        careerSelector.style.display = 'block';
    });
}

async function showRoadmap(path) {
    const roadmapViewer = document.getElementById('roadmapViewer');
    const careerSelector = document.getElementById('careerSelector');
    const roadmapTitle = document.getElementById('roadmapTitle');
    const roadmapContent = document.getElementById('roadmapContent');
    
    // Show roadmap viewer
    careerSelector.style.display = 'none';
    roadmapViewer.style.display = 'block';
    
    // Update title
    const titles = {
        frontend: 'Frontend Developer Roadmap',
        backend: 'Backend Developer Roadmap',
        devops: 'DevOps Engineer Roadmap',
        fullstack: 'Full Stack Developer Roadmap',
        android: 'Android Developer Roadmap',
        react: 'React Developer Roadmap'
    };
    
    roadmapTitle.textContent = titles[path] || 'Developer Roadmap';
    
    // Show loading
    roadmapContent.innerHTML = `
        <div class="loading-roadmap">
            <div class="loading-spinner"></div>
            <p>Loading ${titles[path]}...</p>
        </div>
    `;
    
    try {
        // Fetch roadmap data (mock implementation)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const roadmapData = await generateRoadmapData(path);
        displayRoadmap(roadmapData);
        
    } catch (error) {
        roadmapContent.innerHTML = `
            <div class="error-message">
                <h3>Unable to load roadmap</h3>
                <p>Please try again later.</p>
            </div>
        `;
    }
}

async function generateRoadmapData(path) {
    // Mock roadmap data - in real implementation, fetch from roadmap.sh API
    const roadmaps = {
        frontend: [
            { title: 'HTML & CSS Basics', description: 'Learn semantic HTML and modern CSS', completed: false },
            { title: 'JavaScript Fundamentals', description: 'Master ES6+ features and DOM manipulation', completed: false },
            { title: 'React Framework', description: 'Build interactive UIs with React', completed: false },
            { title: 'State Management', description: 'Redux, Context API, and modern state solutions', completed: false },
            { title: 'Build Tools', description: 'Webpack, Vite, and modern bundlers', completed: false }
        ],
        backend: [
            { title: 'Programming Language', description: 'Choose Node.js, Python, or Java', completed: false },
            { title: 'Database Design', description: 'SQL and NoSQL database concepts', completed: false },
            { title: 'API Development', description: 'REST and GraphQL API design', completed: false },
            { title: 'Authentication', description: 'JWT, OAuth, and security best practices', completed: false },
            { title: 'Deployment', description: 'Docker, cloud platforms, and CI/CD', completed: false }
        ],
        devops: [
            { title: 'Linux Administration', description: 'Command line and system administration', completed: false },
            { title: 'Containerization', description: 'Docker and container orchestration', completed: false },
            { title: 'Kubernetes', description: 'Container orchestration at scale', completed: false },
            { title: 'Cloud Platforms', description: 'AWS, Azure, or Google Cloud', completed: false },
            { title: 'Infrastructure as Code', description: 'Terraform and automation tools', completed: false }
        ]
    };
    
    return roadmaps[path] || roadmaps.frontend;
}

function displayRoadmap(roadmapData) {
    const roadmapContent = document.getElementById('roadmapContent');
    
    roadmapContent.innerHTML = `
        <div class="roadmap-progress">
            <div class="progress-info">
                <span>Progress: 0/${roadmapData.length}</span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
            </div>
        </div>
        <div class="roadmap-nodes">
            ${roadmapData.map((node, index) => `
                <div class="roadmap-node" data-index="${index}">
                    <div class="node-header">
                        <div class="node-number">${index + 1}</div>
                        <div class="node-title">${node.title}</div>
                        <div class="node-status">
                            <input type="checkbox" id="node-${index}" ${node.completed ? 'checked' : ''}>
                            <label for="node-${index}"></label>
                        </div>
                    </div>
                    <div class="node-description">${node.description}</div>
                </div>
            `).join('')}
        </div>
    `;
    
    // Add click handlers for roadmap nodes
    document.querySelectorAll('.roadmap-node input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateRoadmapProgress);
    });
}

function updateRoadmapProgress() {
    const checkboxes = document.querySelectorAll('.roadmap-node input[type="checkbox"]');
    const completed = Array.from(checkboxes).filter(cb => cb.checked).length;
    const total = checkboxes.length;
    const percentage = Math.round((completed / total) * 100);
    
    document.querySelector('.progress-info span').textContent = `Progress: ${completed}/${total}`;
    document.querySelector('.progress-fill').style.width = `${percentage}%`;
}

// Rotating Taglines
function initRotatingTaglines() {
    const taglines = document.querySelectorAll('.tagline');
    let currentIndex = 0;
    
    if (taglines.length === 0) return;
    
    function rotateTagline() {
        // Hide current tagline
        taglines[currentIndex].classList.remove('active');
        
        // Move to next tagline
        currentIndex = (currentIndex + 1) % taglines.length;
        
        // Show next tagline
        taglines[currentIndex].classList.add('active');
    }
    
    // Start rotation every 4 seconds
    setInterval(rotateTagline, 4000);
}

// Resize handler
window.addEventListener('resize', debounce(() => {
    // Handle responsive updates
}, 250));

// Mentor Module Functions
function initMentorModule() {
    const mentorBtns = document.querySelectorAll('.mentor-btn');
    mentorBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const mentorCard = e.target.closest('.mentor-card');
            const mentorName = mentorCard.querySelector('h3').textContent;
            showNotification(`Connected with ${mentorName}!`, 'success');
            e.target.textContent = 'Connected';
            e.target.disabled = true;
        });
    });
}

// Jobs Module Functions
function initJobsModule() {
    const jobBtns = document.querySelectorAll('.job-btn');
    jobBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.target.textContent;
            const jobCard = e.target.closest('.job-card');
            const jobTitle = jobCard.querySelector('h3').textContent;
            
            if (action === 'Save') {
                showNotification(`${jobTitle} saved to favorites!`, 'info');
                e.target.textContent = 'Saved';
            } else if (action === 'Apply Now') {
                showNotification(`Application submitted for ${jobTitle}!`, 'success');
                e.target.textContent = 'Applied';
                e.target.disabled = true;
            }
        });
    });
    
    // Filter functionality
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
        select.addEventListener('change', () => {
            showNotification('Filters applied!', 'info');
        });
    });
}

// Global function for nav links
function switchToModule(moduleName) {
    switchModule(moduleName);
    document.querySelector('.main-content').scrollIntoView({ behavior: 'smooth' });
}

// Handle initial route based on URL hash
function handleInitialRoute() {
    const hash = window.location.hash;
    const routeMap = {
        '#learning-path': 'skilltree',
        '#roadmaps': 'roadmap',
        '#mentor': 'mentor', 
        '#jobs': 'jobs',
        '#tech-news': 'news',
        '#blogs': 'blogs'
    };
    
    const module = routeMap[hash] || 'skilltree';
    currentModule = module;
}

// Export global functions
window.UpskillBro = {
    switchModule,
    switchToModule,
    showLoading,
    hideLoading,
    showNotification,
    saveProgress,
    userProgress
};