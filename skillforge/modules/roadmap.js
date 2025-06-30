// Visual Roadmap Module
window.RoadmapModule = {
    currentRole: 'devops',
    
    roadmaps: {
        devops: {
            title: 'DevOps Engineer',
            sections: [
                {
                    title: 'Foundation',
                    skills: [
                        { id: 'linux', title: 'Linux', subtitle: 'Command Line', icon: '🐧', completed: true },
                        { id: 'networking', title: 'Networking', subtitle: 'TCP/IP, DNS', icon: '🌐', completed: false },
                        { id: 'scripting', title: 'Scripting', subtitle: 'Bash, Python', icon: '📜', completed: false }
                    ]
                },
                {
                    title: 'Version Control & CI/CD',
                    skills: [
                        { id: 'git', title: 'Git', subtitle: 'Version Control', icon: '📚', completed: false },
                        { id: 'github-actions', title: 'GitHub Actions', subtitle: 'CI/CD Pipeline', icon: '⚡', completed: false },
                        { id: 'jenkins', title: 'Jenkins', subtitle: 'Automation', icon: '🔧', completed: false }
                    ]
                },
                {
                    title: 'Containerization',
                    skills: [
                        { id: 'docker', title: 'Docker', subtitle: 'Containers', icon: '🐳', completed: false },
                        { id: 'kubernetes', title: 'Kubernetes', subtitle: 'Orchestration', icon: '☸️', completed: false },
                        { id: 'helm', title: 'Helm', subtitle: 'Package Manager', icon: '⛵', completed: false }
                    ]
                },
                {
                    title: 'Cloud & Infrastructure',
                    skills: [
                        { id: 'aws', title: 'AWS', subtitle: 'Cloud Platform', icon: '☁️', completed: false },
                        { id: 'terraform', title: 'Terraform', subtitle: 'Infrastructure as Code', icon: '🏗️', completed: false },
                        { id: 'monitoring', title: 'Monitoring', subtitle: 'Prometheus, Grafana', icon: '📊', completed: false }
                    ]
                }
            ]
        },
        frontend: {
            title: 'Frontend Developer',
            sections: [
                {
                    title: 'Web Fundamentals',
                    skills: [
                        { id: 'html', title: 'HTML', subtitle: 'Structure', icon: '🏗️', completed: false },
                        { id: 'css', title: 'CSS', subtitle: 'Styling', icon: '🎨', completed: false },
                        { id: 'javascript', title: 'JavaScript', subtitle: 'Interactivity', icon: '⚡', completed: false }
                    ]
                },
                {
                    title: 'Modern Frameworks',
                    skills: [
                        { id: 'react', title: 'React', subtitle: 'Component Library', icon: '⚛️', completed: false },
                        { id: 'vue', title: 'Vue.js', subtitle: 'Progressive Framework', icon: '💚', completed: false },
                        { id: 'angular', title: 'Angular', subtitle: 'Full Framework', icon: '🅰️', completed: false }
                    ]
                },
                {
                    title: 'Build Tools',
                    skills: [
                        { id: 'webpack', title: 'Webpack', subtitle: 'Module Bundler', icon: '📦', completed: false },
                        { id: 'vite', title: 'Vite', subtitle: 'Build Tool', icon: '⚡', completed: false },
                        { id: 'npm', title: 'npm/yarn', subtitle: 'Package Manager', icon: '📋', completed: false }
                    ]
                }
            ]
        },
        backend: {
            title: 'Backend Developer',
            sections: [
                {
                    title: 'Programming Languages',
                    skills: [
                        { id: 'nodejs', title: 'Node.js', subtitle: 'JavaScript Runtime', icon: '💚', completed: false },
                        { id: 'python', title: 'Python', subtitle: 'Versatile Language', icon: '🐍', completed: false },
                        { id: 'java', title: 'Java', subtitle: 'Enterprise Language', icon: '☕', completed: false }
                    ]
                },
                {
                    title: 'Databases',
                    skills: [
                        { id: 'sql', title: 'SQL', subtitle: 'Relational DB', icon: '🗃️', completed: false },
                        { id: 'mongodb', title: 'MongoDB', subtitle: 'NoSQL DB', icon: '🍃', completed: false },
                        { id: 'redis', title: 'Redis', subtitle: 'Caching', icon: '🔴', completed: false }
                    ]
                },
                {
                    title: 'APIs & Services',
                    skills: [
                        { id: 'rest', title: 'REST APIs', subtitle: 'Web Services', icon: '🌐', completed: false },
                        { id: 'graphql', title: 'GraphQL', subtitle: 'Query Language', icon: '📊', completed: false },
                        { id: 'microservices', title: 'Microservices', subtitle: 'Architecture', icon: '🏗️', completed: false }
                    ]
                }
            ]
        },
        fullstack: {
            title: 'Full Stack Developer',
            sections: [
                {
                    title: 'Frontend Skills',
                    skills: [
                        { id: 'react-fs', title: 'React', subtitle: 'UI Library', icon: '⚛️', completed: false },
                        { id: 'typescript', title: 'TypeScript', subtitle: 'Type Safety', icon: '🔷', completed: false },
                        { id: 'tailwind', title: 'Tailwind CSS', subtitle: 'Utility CSS', icon: '🎨', completed: false }
                    ]
                },
                {
                    title: 'Backend Skills',
                    skills: [
                        { id: 'nodejs-fs', title: 'Node.js', subtitle: 'Server Runtime', icon: '💚', completed: false },
                        { id: 'express', title: 'Express.js', subtitle: 'Web Framework', icon: '🚂', completed: false },
                        { id: 'database-fs', title: 'Databases', subtitle: 'Data Storage', icon: '🗃️', completed: false }
                    ]
                },
                {
                    title: 'DevOps & Deployment',
                    skills: [
                        { id: 'docker-fs', title: 'Docker', subtitle: 'Containerization', icon: '🐳', completed: false },
                        { id: 'aws-fs', title: 'AWS/Vercel', subtitle: 'Cloud Deployment', icon: '☁️', completed: false },
                        { id: 'cicd-fs', title: 'CI/CD', subtitle: 'Automation', icon: '⚡', completed: false }
                    ]
                }
            ]
        }
    },

    init() {
        this.setupEventListeners();
        this.renderRoadmap();
    },

    setupEventListeners() {
        // Role dropdown
        this.initCustomDropdown();
        
        // Flow node clicks
        document.addEventListener('click', (e) => {
            const flowNode = e.target.closest('.flow-node');
            if (flowNode) {
                this.toggleNodeCompletion(flowNode);
            }
        });
    },

    initCustomDropdown() {
        const dropdown = document.getElementById('roadmapRoleDropdown');
        const trigger = document.getElementById('roadmapRoleTrigger');
        const menu = document.getElementById('roadmapRoleMenu');
        const selectedText = document.getElementById('roadmapRoleSelectedText');
        
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
                this.currentRole = value;
                this.renderRoadmap();
                
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
        const trigger = document.getElementById('roadmapRoleTrigger');
        const menu = document.getElementById('roadmapRoleMenu');
        
        if (trigger && menu) {
            trigger.classList.add('active');
            menu.classList.add('show');
        }
    },

    closeDropdown() {
        const trigger = document.getElementById('roadmapRoleTrigger');
        const menu = document.getElementById('roadmapRoleMenu');
        
        if (trigger && menu) {
            trigger.classList.remove('active');
            menu.classList.remove('show');
        }
    },

    renderRoadmap() {
        const roadmap = this.roadmaps[this.currentRole];
        if (!roadmap) return;

        const flowDiagram = document.getElementById('flowDiagram');
        if (!flowDiagram) return;

        flowDiagram.innerHTML = roadmap.sections.map(section => `
            <div class="flow-section">
                <div class="section-title">${section.title}</div>
                <div class="flow-row">
                    ${section.skills.map((skill, index) => `
                        <div class="flow-node ${skill.completed ? 'completed' : ''}" data-skill="${skill.id}">
                            <div class="node-icon">${skill.icon}</div>
                            <div class="node-title">${skill.title}</div>
                            <div class="node-subtitle">${skill.subtitle}</div>
                        </div>
                        ${index < section.skills.length - 1 ? '<div class="flow-arrow">→</div>' : ''}
                    `).join('')}
                </div>
            </div>
        `).join('');
    },

    toggleNodeCompletion(node) {
        const skillId = node.dataset.skill;
        const isCompleted = node.classList.contains('completed');
        
        if (isCompleted) {
            node.classList.remove('completed');
        } else {
            node.classList.add('completed');
        }
        
        // Save progress
        this.saveProgress(skillId, !isCompleted);
    },

    saveProgress(skillId, completed) {
        const progressKey = `roadmap_${this.currentRole}_${skillId}`;
        localStorage.setItem(progressKey, completed);
        
        if (completed) {
            this.showNotification('Skill completed! 🎉', 'success');
        }
    },

    showNotification(message, type) {
        if (window.UpskillBro) {
            window.UpskillBro.showNotification(message, type);
        }
    }
};