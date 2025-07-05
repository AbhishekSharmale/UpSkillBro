// SkillTree Module
window.SkillTree = {
    currentSkillId: null,
    currentRoadmap: 'frontend',
    roadmaps: {},
    
    async loadRoadmaps() {
        try {
            const response = await fetch('./data/roadmaps.json');
            this.roadmaps = await response.json();
        } catch (error) {
            console.error('Failed to load roadmaps:', error);
            // Fallback to basic skills if JSON fails
            this.roadmaps = this.getFallbackRoadmaps();
        }
    },
    
    getFallbackRoadmaps() {
        return {
            frontend: {
                title: "Frontend Developer",
                description: "Your fast-track to frontend mastery",
                levels: [{
                    level: 1,
                    title: "Web Fundamentals",
                    skills: [
                        { id: "html-css", name: "HTML & CSS", type: "skill", resources: ["#"] },
                        { id: "javascript", name: "JavaScript", type: "skill", resources: ["#"] }
                    ]
                }]
            },
            backend: {
                title: "Backend Developer",
                description: "Master backend development fast",
                levels: [{
                    level: 1,
                    title: "Programming Language",
                    skills: [
                        { id: "nodejs", name: "Node.js", type: "language", resources: ["#"] },
                        { id: "python-backend", name: "Python", type: "language", resources: ["#"] }
                    ]
                }]
            },
            devops: {
                title: "DevOps Engineer",
                description: "Level up to DevOps mastery",
                levels: [{
                    level: 1,
                    title: "Foundation",
                    skills: [
                        { id: "linux-devops", name: "Linux", type: "skill", resources: ["#"] },
                        { id: "docker-basics", name: "Docker", type: "tool", resources: ["#"] }
                    ]
                }]
            },
            fullstack: {
                title: "Full Stack Developer",
                description: "Master both frontend and backend development",
                levels: [{
                    level: 1,
                    title: "Full Stack Basics",
                    skills: [
                        { id: "react-fs", name: "React", type: "framework", resources: ["#"] },
                        { id: "nodejs-fs", name: "Node.js", type: "language", resources: ["#"] }
                    ]
                }]
            },
            python: {
                title: "Python Developer",
                description: "Master Python for web and data science",
                levels: [{
                    level: 1,
                    title: "Python Fundamentals",
                    skills: [
                        { id: "python-basics", name: "Python Syntax", type: "language", resources: ["#"] },
                        { id: "django", name: "Django", type: "framework", resources: ["#"] }
                    ]
                }]
            },
            java: {
                title: "Java Developer",
                description: "Enterprise Java development",
                levels: [{
                    level: 1,
                    title: "Java Fundamentals",
                    skills: [
                        { id: "java-basics", name: "Java OOP", type: "language", resources: ["#"] },
                        { id: "spring-boot", name: "Spring Boot", type: "framework", resources: ["#"] }
                    ]
                }]
            },
            golang: {
                title: "Go Developer",
                description: "Build scalable systems with Go",
                levels: [{
                    level: 1,
                    title: "Go Fundamentals",
                    skills: [
                        { id: "go-syntax", name: "Go Syntax", type: "language", resources: ["#"] },
                        { id: "gin", name: "Gin Framework", type: "framework", resources: ["#"] }
                    ]
                }]
            },
            blockchain: {
                title: "Blockchain Developer",
                description: "Web3 and smart contract development",
                levels: [{
                    level: 1,
                    title: "Blockchain Basics",
                    skills: [
                        { id: "solidity", name: "Solidity", type: "language", resources: ["#"] },
                        { id: "web3js", name: "Web3.js", type: "tool", resources: ["#"] }
                    ]
                }]
            },
            "ai-ml": {
                title: "AI/ML Engineer",
                description: "Machine learning and AI systems",
                levels: [{
                    level: 1,
                    title: "ML Fundamentals",
                    skills: [
                        { id: "python-ml", name: "Python for ML", type: "language", resources: ["#"] },
                        { id: "tensorflow", name: "TensorFlow", type: "framework", resources: ["#"] }
                    ]
                }]
            },
            python: {
                title: "Python Developer",
                description: "Master Python for web and data science",
                levels: [{
                    level: 1,
                    title: "Python Fundamentals",
                    skills: [
                        { id: "python-basics", name: "Python Syntax", type: "language", resources: ["#"] },
                        { id: "django", name: "Django", type: "framework", resources: ["#"] },
                        { id: "fastapi", name: "FastAPI", type: "framework", resources: ["#"] }
                    ]
                }]
            },
            java: {
                title: "Java Developer",
                description: "Enterprise Java development",
                levels: [{
                    level: 1,
                    title: "Java Fundamentals",
                    skills: [
                        { id: "java-basics", name: "Java OOP", type: "language", resources: ["#"] },
                        { id: "spring-boot", name: "Spring Boot", type: "framework", resources: ["#"] },
                        { id: "hibernate", name: "Hibernate", type: "tool", resources: ["#"] }
                    ]
                }]
            },
            golang: {
                title: "Go Developer",
                description: "Build scalable systems with Go",
                levels: [{
                    level: 1,
                    title: "Go Fundamentals",
                    skills: [
                        { id: "go-syntax", name: "Go Syntax", type: "language", resources: ["#"] },
                        { id: "goroutines", name: "Goroutines", type: "concept", resources: ["#"] },
                        { id: "gin", name: "Gin Framework", type: "framework", resources: ["#"] }
                    ]
                }]
            },
            blockchain: {
                title: "Blockchain Developer",
                description: "Web3 and smart contract development",
                levels: [{
                    level: 1,
                    title: "Blockchain Basics",
                    skills: [
                        { id: "solidity", name: "Solidity", type: "language", resources: ["#"] },
                        { id: "web3js", name: "Web3.js", type: "tool", resources: ["#"] },
                        { id: "smart-contracts", name: "Smart Contracts", type: "concept", resources: ["#"] }
                    ]
                }]
            },
            "ai-ml": {
                title: "AI/ML Engineer",
                description: "Machine learning and AI systems",
                levels: [{
                    level: 1,
                    title: "ML Fundamentals",
                    skills: [
                        { id: "python-ml", name: "Python for ML", type: "language", resources: ["#"] },
                        { id: "scikit-learn", name: "Scikit-learn", type: "tool", resources: ["#"] },
                        { id: "tensorflow", name: "TensorFlow", type: "framework", resources: ["#"] }
                    ]
                }]
            }
        };
    },

    async init() {
        await this.loadRoadmaps();
        this.setupEventListeners();
        this.renderRoadmap();
    },

    renderRoadmap() {
        const roadmap = this.roadmaps[this.currentRoadmap];
        if (!roadmap) return;
        
        // Update header - target the specific roadmap title in skilltree container
        const roadmapTitleEl = document.querySelector('.skilltree-container #roadmapTitle');
        const roadmapDescEl = document.querySelector('.skilltree-container #roadmapDescription');
        
        if (roadmapTitleEl) roadmapTitleEl.textContent = roadmap.title + ' Path';
        if (roadmapDescEl) roadmapDescEl.textContent = roadmap.description;
        
        // Update progress
        this.updateProgress();
        
        // Render levels
        const container = document.getElementById('roadmapLevels');
        const userProgress = window.UpskillBro?.userProgress || {};
        
        container.innerHTML = roadmap.levels.map(level => {
            const levelProgress = this.getLevelProgress(level, userProgress);
            const isLevelUnlocked = this.isLevelUnlocked(level, userProgress);
            
            return `
                <div class="roadmap-level ${isLevelUnlocked ? 'unlocked' : 'locked'}">
                    <div class="level-header">
                        <div class="level-info">
                            <h4>Level ${level.level}: ${level.title}</h4>
                            <div class="level-progress">
                                <div class="level-progress-bar">
                                    <div class="level-progress-fill" style="width: ${levelProgress}%"></div>
                                </div>
                                <span>${levelProgress}% Complete</span>
                            </div>
                        </div>
                        <div class="level-badge">${level.level}</div>
                    </div>
                    <div class="level-skills">
                        ${level.skills.map(skill => {
                            const isCompleted = userProgress[skill.id];
                            const isSkillLocked = !isLevelUnlocked;
                            
                            return `
                                <div class="skill-node ${isCompleted ? 'completed' : ''} ${isSkillLocked ? 'locked' : ''} skill-${skill.type}" 
                                     data-skill-id="${skill.id}"
                                     onclick="SkillTree.openSkillModal('${skill.id}', ${JSON.stringify(skill).replace(/"/g, '&quot;')})">
                                    <div class="skill-icon">
                                        <i class="${this.getSkillIcon(skill.type)}"></i>
                                    </div>
                                    <div class="skill-name">${skill.name}</div>
                                    <div class="skill-type">${skill.type}</div>
                                    ${isCompleted ? '<div class="completion-badge"><i class="fas fa-check"></i></div>' : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }).join('');
    },

    isLevelUnlocked(level, userProgress) {
        if (level.level === 1) return true;
        
        // Check if previous level is mostly complete (80%)
        const roadmap = this.roadmaps[this.currentRoadmap];
        const prevLevel = roadmap.levels.find(l => l.level === level.level - 1);
        if (!prevLevel) return true;
        
        const prevLevelProgress = this.getLevelProgress(prevLevel, userProgress);
        return prevLevelProgress >= 80;
    },
    
    getLevelProgress(level, userProgress) {
        const totalSkills = level.skills.length;
        const completedSkills = level.skills.filter(skill => userProgress[skill.id]).length;
        return totalSkills > 0 ? Math.round((completedSkills / totalSkills) * 100) : 0;
    },
    
    updateProgress() {
        const roadmap = this.roadmaps[this.currentRoadmap];
        const userProgress = window.UpskillBro?.userProgress || {};
        
        let totalSkills = 0;
        let completedSkills = 0;
        
        roadmap.levels.forEach(level => {
            totalSkills += level.skills.length;
            completedSkills += level.skills.filter(skill => userProgress[skill.id]).length;
        });
        
        const progressPercent = totalSkills > 0 ? Math.round((completedSkills / totalSkills) * 100) : 0;
        
        document.getElementById('progressFill').style.width = progressPercent + '%';
        document.getElementById('progressText').textContent = progressPercent + '% Complete';
    },
    
    getSkillIcon(type) {
        const icons = {
            concept: 'fas fa-lightbulb',
            skill: 'fas fa-code',
            tool: 'fas fa-wrench',
            framework: 'fas fa-layer-group',
            language: 'fas fa-terminal',
            database: 'fas fa-database',
            cloud: 'fas fa-cloud'
        };
        return icons[type] || 'fas fa-circle';
    },

    openSkillModal(skillId, skillData) {
        let skill;
        
        if (skillData) {
            skill = skillData;
        } else {
            const roadmap = this.roadmaps[this.currentRoadmap];
            for (const level of roadmap.levels) {
                const foundSkill = level.skills.find(s => s.id === skillId);
                if (foundSkill) {
                    skill = foundSkill;
                    break;
                }
            }
        }
        
        if (!skill) return;

        this.currentSkillId = skillId;
        
        // Close any existing expanded skill
        this.closeExpandedSkill();
        
        // Find the clicked skill node
        const skillNode = document.querySelector(`[data-skill-id="${skillId}"]`);
        if (!skillNode) return;
        
        // Create expanded content
        const expandedContent = this.createExpandedSkillContent(skill, skillId);
        
        // Insert after the skill node
        skillNode.insertAdjacentHTML('afterend', expandedContent);
        
        // Add expanded class to skill node
        skillNode.classList.add('expanded');
        
        // Smooth scroll to expanded content
        setTimeout(() => {
            const expandedElement = document.querySelector('.skill-expanded');
            if (expandedElement) {
                expandedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 100);
    },
    
    createExpandedSkillContent(skill, skillId) {
        const userProgress = window.UpskillBro?.userProgress || {};
        const isCompleted = userProgress[skillId];
        const checklist = this.getSkillChecklist(skill.type);
        
        return `
            <div class="skill-expanded" data-skill-id="${skillId}">
                <div class="skill-expanded-header">
                    <h3>${skill.name}</h3>
                    <button class="close-expanded" onclick="SkillTree.closeExpandedSkill()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="skill-expanded-content">
                    <div class="skill-meta">
                        <span class="skill-type-badge skill-${skill.type}">${skill.type}</span>
                    </div>
                    <div class="skill-resources">
                        <h4>Learning Resources</h4>
                        <div class="resources-list">
                            ${skill.resources.map((resource, index) => `
                                <div class="resource-item">
                                    <i class="fas fa-external-link-alt"></i>
                                    <span>Resource ${index + 1}</span>
                                    <a href="${resource}" target="_blank" class="resource-link">
                                        <i class="fas fa-arrow-right"></i>
                                    </a>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="skill-checklist">
                        <h4>Learning Checklist</h4>
                        <div class="checklist">
                            ${checklist.map((item, index) => `
                                <label class="checklist-item">
                                    <input type="checkbox" data-skill="${skillId}" data-item="${index}">
                                    <span class="checkmark"></span>
                                    <span class="checklist-text">${item}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                    <div class="skill-actions">
                        <button class="btn-complete ${isCompleted ? 'completed' : ''}" 
                                onclick="SkillTree.completeSkill('${skillId}')" 
                                ${isCompleted ? 'disabled' : ''}>
                            <i class="fas fa-check"></i>
                            ${isCompleted ? 'Completed' : 'Mark Complete'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    
    closeExpandedSkill() {
        const expanded = document.querySelector('.skill-expanded');
        if (expanded) {
            expanded.remove();
        }
        document.querySelectorAll('.skill-node.expanded').forEach(node => {
            node.classList.remove('expanded');
        });
    },
    
    completeSkill(skillId) {
        if (skillId) {
            window.UpskillBro?.saveProgress(skillId, true);
            this.renderRoadmap();
            this.closeExpandedSkill();
        }
    },

    getResourceIcon(type) {
        const icons = {
            video: 'play',
            article: 'book',
            practice: 'code',
            course: 'graduation-cap'
        };
        return icons[type] || 'link';
    },

    setupEventListeners() {
        // Custom dropdown functionality
        this.initCustomDropdown();
        
        // Close expanded skill on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeExpandedSkill();
            }
        });
        
        // Close expanded skill when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.skill-expanded') && !e.target.closest('.skill-node')) {
                this.closeExpandedSkill();
            }
        });

        // Checklist items
        document.addEventListener('change', (e) => {
            if (e.target.matches('input[type="checkbox"][data-skill]')) {
                const skillId = e.target.dataset.skill;
                const itemIndex = e.target.dataset.item;
                this.saveChecklistProgress(skillId, itemIndex, e.target.checked);
            }
        });
    },
    
    getSkillChecklist(type) {
        const checklists = {
            concept: [
                'Understand the core concepts',
                'Read documentation thoroughly',
                'Watch explanatory videos',
                'Discuss with peers or mentors'
            ],
            skill: [
                'Complete hands-on tutorials',
                'Build a practice project',
                'Write clean, documented code',
                'Test your implementation'
            ],
            tool: [
                'Install and configure the tool',
                'Follow official getting started guide',
                'Complete basic tutorials',
                'Use in a real project'
            ],
            framework: [
                'Understand framework architecture',
                'Build a sample application',
                'Learn best practices',
                'Deploy to production'
            ]
        };
        return checklists[type] || checklists.skill;
    },

    saveChecklistProgress(skillId, itemIndex, completed) {
        const key = `checklist_${skillId}_${itemIndex}`;
        localStorage.setItem(key, completed);
    },

    refresh() {
        this.renderRoadmap();
    },
    
    initCustomDropdown() {
        const dropdown = document.getElementById('roadmapDropdown');
        const trigger = document.getElementById('dropdownTrigger');
        const menu = document.getElementById('dropdownMenu');
        const selectedText = document.getElementById('selectedText');
        
        if (!dropdown || !trigger || !menu || !selectedText) return;
        
        // Toggle dropdown
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = menu.classList.contains('show');
            
            if (isOpen) {
                this.closeDropdown();
            } else {
                this.openDropdown();
            }
        });
        
        // Handle item selection
        menu.addEventListener('click', (e) => {
            const item = e.target.closest('.dropdown-item');
            if (item) {
                const value = item.dataset.value;
                const title = item.querySelector('.item-title').textContent;
                
                // Update active state
                menu.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                // Update selected text
                selectedText.textContent = title;
                
                // Change roadmap
                if (this.currentRoadmap !== value) {
                    this.currentRoadmap = value;
                    this.closeExpandedSkill();
                    this.renderRoadmap();
                }
                
                // Close dropdown
                this.closeDropdown();
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                this.closeDropdown();
            }
        });
    },
    
    openDropdown() {
        const trigger = document.getElementById('dropdownTrigger');
        const menu = document.getElementById('dropdownMenu');
        
        if (trigger && menu) {
            trigger.classList.add('active');
            menu.classList.add('show');
        }
    },
    
    closeDropdown() {
        const trigger = document.getElementById('dropdownTrigger');
        const menu = document.getElementById('dropdownMenu');
        
        if (trigger && menu) {
            trigger.classList.remove('active');
            menu.classList.remove('show');
        }
    }
};

// Add skill modal styles
const skillModalStyles = document.createElement('style');
skillModalStyles.textContent = `
    .skill-meta {
        display: flex;
        gap: 16px;
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid var(--border-color);
    }
    
    .skill-type-badge {
        background: var(--accent-primary);
        color: var(--primary-bg);
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .skill-type-badge.skill-concept { background: #fbbf24; }
    .skill-type-badge.skill-tool { background: #8b5cf6; }
    .skill-type-badge.skill-framework { background: #06b6d4; }
    .skill-type-badge.skill-language { background: #f59e0b; }
    .skill-type-badge.skill-database { background: #10b981; }
    .skill-type-badge.skill-cloud { background: #3b82f6; }
    
    .prerequisites {
        color: var(--text-secondary);
        font-size: 14px;
    }
    
    .resources-list, .checklist {
        margin-top: 12px;
    }
    
    .resource-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 0;
        border-bottom: 1px solid var(--border-color);
    }
    
    .resource-item:last-child {
        border-bottom: none;
    }
    
    .resource-link {
        margin-left: auto;
        color: var(--accent-primary);
        text-decoration: none;
    }
    
    .checklist-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 0;
        cursor: pointer;
    }
    
    .checkmark {
        width: 20px;
        height: 20px;
        border: 2px solid var(--border-color);
        border-radius: 4px;
        position: relative;
        transition: all 0.2s ease;
    }
    
    .checklist-item input:checked + .checkmark {
        background: var(--accent-primary);
        border-color: var(--accent-primary);
    }
    
    .checklist-item input:checked + .checkmark::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: var(--primary-bg);
        font-weight: bold;
        font-size: 12px;
    }
    
    .checklist-item input {
        display: none;
    }
    
    .completion-badge {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 24px;
        height: 24px;
        background: var(--accent-primary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary-bg);
        font-size: 12px;
    }
    
    /* Inline Expandable Skill Styles */
    .skill-expanded {
        grid-column: 1 / -1;
        background: var(--bg-secondary);
        border: 2px solid var(--accent-primary);
        border-radius: 16px;
        margin: 1rem 0;
        animation: expandIn 0.3s ease;
        overflow: hidden;
    }
    
    .skill-expanded-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 2rem;
        border-bottom: 1px solid var(--border-color);
        background: rgba(0, 255, 136, 0.05);
    }
    
    .skill-expanded-header h3 {
        color: var(--accent-primary);
        margin: 0;
        font-size: 1.25rem;
    }
    
    .close-expanded {
        background: none;
        border: none;
        color: var(--text-secondary);
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 50%;
        transition: all 0.2s ease;
    }
    
    .close-expanded:hover {
        background: rgba(255, 255, 255, 0.1);
        color: var(--accent-primary);
    }
    
    .skill-expanded-content {
        padding: 2rem;
        display: grid;
        gap: 2rem;
    }
    
    .skill-expanded .skill-resources,
    .skill-expanded .skill-checklist {
        background: var(--bg-card);
        border-radius: 12px;
        padding: 1.5rem;
    }
    
    .skill-expanded h4 {
        color: var(--text-primary);
        margin-bottom: 1rem;
        font-size: 1.1rem;
    }
    
    .skill-actions {
        display: flex;
        justify-content: center;
        padding-top: 1rem;
        border-top: 1px solid var(--border-color);
    }
    
    .btn-complete.completed {
        background: var(--text-muted);
        cursor: not-allowed;
    }
    
    .skill-node.expanded {
        border-color: var(--accent-primary);
        background: rgba(0, 255, 136, 0.1);
        transform: scale(1.02);
    }
    
    @keyframes expandIn {
        from {
            opacity: 0;
            transform: translateY(-20px) scaleY(0.8);
        }
        to {
            opacity: 1;
            transform: translateY(0) scaleY(1);
        }
    }
`;
document.head.appendChild(skillModalStyles);