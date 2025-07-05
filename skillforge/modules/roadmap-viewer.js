// Professional Roadmap Viewer Module
window.RoadmapViewer = {
    roadmaps: {},
    currentPath: null,

    async init() {
        await this.loadRoadmaps();
        this.setupEventListeners();
    },

    async loadRoadmaps() {
        try {
            const response = await fetch('./data/comprehensive-roadmaps.json');
            this.roadmaps = await response.json();
        } catch (error) {
            console.error('Failed to load roadmaps:', error);
            this.roadmaps = this.getFallbackRoadmaps();
        }
    },

    setupEventListeners() {
        // Handle roadmap navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-roadmap-path]')) {
                const path = e.target.dataset.roadmapPath;
                this.showRoadmap(path);
            }
        });

        // Handle back button
        document.getElementById('roadmapBackBtn')?.addEventListener('click', () => {
            this.hideRoadmap();
        });

        // Handle resource links
        document.addEventListener('click', (e) => {
            if (e.target.matches('.resource-link')) {
                e.preventDefault();
                this.trackResourceClick(e.target.textContent);
                // In a real app, you'd open the actual resource
                window.UpskillBro?.showNotification('Resource opened!', 'info');
            }
        });
    },

    showRoadmap(path) {
        const roadmap = this.roadmaps[path];
        if (!roadmap) return;

        this.currentPath = path;
        this.renderRoadmapView(roadmap);
        this.showRoadmapModal();
    },

    renderRoadmapView(roadmap) {
        const container = document.getElementById('roadmapViewerContent');
        if (!container) return;

        container.innerHTML = `
            <div class="roadmap-viewer">
                <div class="roadmap-header">
                    <div class="roadmap-title-section">
                        <h1 class="roadmap-title">${roadmap.title} Roadmap</h1>
                        <p class="roadmap-description">${roadmap.description}</p>
                        <div class="roadmap-meta">
                            <span class="meta-item">
                                <i class="fas fa-clock"></i>
                                ${roadmap.duration}
                            </span>
                            <span class="meta-item">
                                <i class="fas fa-signal"></i>
                                ${roadmap.difficulty}
                            </span>
                        </div>
                    </div>
                    <button class="btn-close-roadmap" id="roadmapBackBtn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="roadmap-progress-overview">
                    <div class="progress-stats">
                        <div class="stat">
                            <span class="stat-number">${roadmap.sections.length}</span>
                            <span class="stat-label">Sections</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">${this.getTotalItems(roadmap)}</span>
                            <span class="stat-label">Topics</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">0%</span>
                            <span class="stat-label">Complete</span>
                        </div>
                    </div>
                </div>

                <div class="roadmap-sections">
                    ${roadmap.sections.map((section, index) => this.renderSection(section, index)).join('')}
                </div>

                <div class="roadmap-footer">
                    <p class="inspiration-note">
                        <i class="fas fa-heart"></i>
                        Inspired by <a href="https://roadmap.sh" target="_blank" rel="noopener">roadmap.sh</a>
                    </p>
                    <div class="roadmap-actions">
                        <button class="btn-primary" onclick="RoadmapViewer.startLearning()">
                            <i class="fas fa-play"></i>
                            Start Learning Path
                        </button>
                        <button class="btn-secondary" onclick="RoadmapViewer.downloadRoadmap()">
                            <i class="fas fa-download"></i>
                            Download PDF
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    renderSection(section, index) {
        return `
            <div class="roadmap-section" data-section="${index}">
                <div class="section-header">
                    <div class="section-number">${index + 1}</div>
                    <div class="section-info">
                        <h3 class="section-title">${section.title}</h3>
                        <div class="section-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 0%"></div>
                            </div>
                            <span class="progress-text">0/${section.items.length} completed</span>
                        </div>
                    </div>
                    <button class="section-toggle" onclick="RoadmapViewer.toggleSection(${index})">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
                <div class="section-content">
                    <div class="roadmap-items">
                        ${section.items.map((item, itemIndex) => this.renderItem(item, index, itemIndex)).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    renderItem(item, sectionIndex, itemIndex) {
        const typeClass = `item-${item.type}`;
        const typeIcon = this.getTypeIcon(item.type);
        
        return `
            <div class="roadmap-item ${typeClass}" data-section="${sectionIndex}" data-item="${itemIndex}">
                <div class="item-header">
                    <div class="item-icon">
                        <i class="${typeIcon}"></i>
                    </div>
                    <div class="item-info">
                        <h4 class="item-name">${item.name}</h4>
                        <span class="item-type">${item.type}</span>
                    </div>
                    <div class="item-actions">
                        <button class="item-complete-btn" onclick="RoadmapViewer.toggleItemComplete(${sectionIndex}, ${itemIndex})">
                            <i class="fas fa-check"></i>
                        </button>
                    </div>
                </div>
                <div class="item-resources">
                    <div class="resources-header">
                        <i class="fas fa-book"></i>
                        <span>Learning Resources</span>
                    </div>
                    <div class="resources-list">
                        ${item.resources.map(resource => `
                            <a href="#" class="resource-link" data-resource="${resource}">
                                <i class="fas fa-external-link-alt"></i>
                                ${resource}
                            </a>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    getTypeIcon(type) {
        const icons = {
            essential: 'fas fa-star',
            important: 'fas fa-exclamation-circle',
            recommended: 'fas fa-thumbs-up',
            optional: 'fas fa-circle',
            alternative: 'fas fa-exchange-alt',
            emerging: 'fas fa-rocket',
            advanced: 'fas fa-graduation-cap'
        };
        return icons[type] || 'fas fa-circle';
    },

    getTotalItems(roadmap) {
        return roadmap.sections.reduce((total, section) => total + section.items.length, 0);
    },

    showRoadmapModal() {
        const modal = document.getElementById('roadmapModal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    },

    hideRoadmap() {
        const modal = document.getElementById('roadmapModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    },

    toggleSection(sectionIndex) {
        const section = document.querySelector(`[data-section="${sectionIndex}"]`);
        const content = section.querySelector('.section-content');
        const toggle = section.querySelector('.section-toggle i');
        
        if (content.style.display === 'none') {
            content.style.display = 'block';
            toggle.style.transform = 'rotate(180deg)';
        } else {
            content.style.display = 'none';
            toggle.style.transform = 'rotate(0deg)';
        }
    },

    toggleItemComplete(sectionIndex, itemIndex) {
        const item = document.querySelector(`[data-section="${sectionIndex}"][data-item="${itemIndex}"]`);
        const button = item.querySelector('.item-complete-btn');
        
        item.classList.toggle('completed');
        
        if (item.classList.contains('completed')) {
            button.innerHTML = '<i class="fas fa-check-circle"></i>';
            window.UpskillBro?.showNotification('Topic completed!', 'success');
        } else {
            button.innerHTML = '<i class="fas fa-check"></i>';
        }
        
        this.updateSectionProgress(sectionIndex);
    },

    updateSectionProgress(sectionIndex) {
        const section = document.querySelector(`[data-section="${sectionIndex}"]`);
        const items = section.querySelectorAll('.roadmap-item');
        const completedItems = section.querySelectorAll('.roadmap-item.completed');
        
        const progress = Math.round((completedItems.length / items.length) * 100);
        
        const progressFill = section.querySelector('.progress-fill');
        const progressText = section.querySelector('.progress-text');
        
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${completedItems.length}/${items.length} completed`;
    },

    startLearning() {
        if (this.currentPath) {
            this.hideRoadmap();
            // Switch to learning path with the current roadmap
            if (window.startLearningPath) {
                window.startLearningPath(this.currentPath);
            }
            window.UpskillBro?.showNotification(`Started ${this.currentPath} learning path!`, 'success');
        }
    },

    downloadRoadmap() {
        window.UpskillBro?.showNotification('PDF download feature coming soon!', 'info');
    },

    trackResourceClick(resourceName) {
        // Analytics tracking would go here
        console.log(`Resource clicked: ${resourceName}`);
    },

    getFallbackRoadmaps() {
        return {
            frontend: {
                title: "Frontend Developer",
                description: "Master modern frontend development",
                duration: "12-16 weeks",
                difficulty: "Beginner to Advanced",
                sections: [
                    {
                        title: "Web Fundamentals",
                        items: [
                            { name: "HTML5", type: "essential", resources: ["MDN HTML Guide"] },
                            { name: "CSS3", type: "essential", resources: ["CSS Guide"] },
                            { name: "JavaScript", type: "essential", resources: ["JavaScript.info"] }
                        ]
                    }
                ]
            }
        };
    }
};