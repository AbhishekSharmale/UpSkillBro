// ResumeGPT Module
window.ResumeGPT = {
    currentResume: '',
    optimizedResume: null,

    init() {
        this.setupEventListeners();
        this.initCustomDropdown();
    },

    setupEventListeners() {
        const optimizeBtn = document.getElementById('optimizeResume');
        const resumeFile = document.getElementById('resumeFile');
        const roleSelector = document.getElementById('roleSelector');

        // Optimize resume
        optimizeBtn.addEventListener('click', () => this.optimizeResume());

        // File upload
        resumeFile.addEventListener('change', (e) => this.handleFileUpload(e));

        // Initialize current role
        this.currentRole = 'fullstack';

        // Auto-save resume input and update word count
        document.getElementById('resumeInput').addEventListener('input', 
            this.debounce((e) => {
                this.currentResume = e.target.value;
                localStorage.setItem('upskillbro_resume_draft', this.currentResume);
                this.updateWordCount(e.target.value);
            }, 300)
        );

        // Load saved draft
        const savedDraft = localStorage.getItem('upskillbro_resume_draft');
        if (savedDraft) {
            document.getElementById('resumeInput').value = savedDraft;
            this.currentResume = savedDraft;
        }
    },

    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const allowedTypes = ['text/plain', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            this.showNotification('Please upload a .txt or .pdf file', 'error');
            return;
        }

        try {
            let content = '';
            
            if (file.type === 'text/plain') {
                content = await this.readTextFile(file);
            } else if (file.type === 'application/pdf') {
                // In a real implementation, you'd use a PDF parsing library
                content = 'PDF content extraction would be implemented here using a library like PDF.js';
                this.showNotification('PDF parsing not implemented in demo', 'info');
                return;
            }

            document.getElementById('resumeInput').value = content;
            this.currentResume = content;
            this.showNotification('File uploaded successfully!', 'success');

        } catch (error) {
            this.showNotification('Error reading file', 'error');
        }
    },

    readTextFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    },

    async optimizeResume() {
        const resumeText = document.getElementById('resumeInput').value.trim();
        const targetRole = document.getElementById('roleSelector').value;

        if (!resumeText) {
            this.showNotification('Please enter your resume content first', 'error');
            return;
        }

        // Show loading
        window.UpskillBro?.showLoading('Making your resume 10x better...');

        try {
            // Simulate AI processing
            await new Promise(resolve => setTimeout(resolve, 2500));

            const optimizedData = this.generateOptimizedResume(resumeText, targetRole);
            this.optimizedResume = optimizedData;
            this.displayOptimizedResume(optimizedData);

            window.UpskillBro?.hideLoading();
            this.showNotification('Resume optimized successfully!', 'success');

        } catch (error) {
            window.UpskillBro?.hideLoading();
            this.showNotification('Optimization failed. Please try again.', 'error');
        }
    },

    generateOptimizedResume(originalText, targetRole) {
        // Mock AI optimization based on role
        const roleKeywords = this.getRoleKeywords(targetRole);
        const improvements = this.getImprovements(targetRole);
        
        return {
            originalText,
            targetRole,
            optimizedSummary: this.generateOptimizedSummary(targetRole),
            improvedBulletPoints: this.generateImprovedBulletPoints(targetRole),
            keywords: roleKeywords,
            improvements: improvements,
            atsScore: Math.floor(Math.random() * 30) + 70, // 70-100
            suggestions: this.generateSuggestions(targetRole)
        };
    },

    getRoleKeywords(role) {
        const keywords = {
            fullstack: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST APIs', 'Git', 'Agile', 'CI/CD'],
            backend: ['Python', 'Java', 'SQL', 'Docker', 'Microservices', 'API Design', 'Database Design'],
            frontend: ['React', 'Vue.js', 'TypeScript', 'CSS3', 'Responsive Design', 'Webpack', 'Testing'],
            devops: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Monitoring', 'Linux', 'CI/CD'],
            sre: ['Kubernetes', 'Prometheus', 'Grafana', 'Incident Response', 'SLA/SLO', 'Automation'],
            mobile: ['React Native', 'Flutter', 'iOS', 'Android', 'Mobile UI/UX', 'App Store Optimization']
        };
        return keywords[role] || keywords.fullstack;
    },

    getImprovements(role) {
        return [
            'Added quantifiable metrics to achievements',
            'Incorporated industry-specific keywords',
            'Improved action verb usage',
            'Enhanced technical skills section',
            'Optimized for ATS scanning',
            'Strengthened professional summary'
        ];
    },

    generateOptimizedSummary(role) {
        const summaries = {
            fullstack: 'Experienced Full Stack Developer with 5+ years building scalable web applications using modern JavaScript frameworks. Proven track record of delivering high-quality solutions that increased user engagement by 40% and reduced load times by 60%. Expertise in React, Node.js, and cloud deployment.',
            backend: 'Senior Backend Engineer specializing in microservices architecture and high-performance APIs. Led development of systems handling 1M+ daily requests with 99.9% uptime. Expert in Python, Java, and distributed systems design.',
            frontend: 'Creative Frontend Developer with expertise in modern JavaScript frameworks and responsive design. Built user interfaces that improved conversion rates by 35% and enhanced user experience across 10+ products. Proficient in React, Vue.js, and performance optimization.',
            devops: 'DevOps Engineer with 4+ years automating infrastructure and deployment pipelines. Reduced deployment time by 80% and improved system reliability to 99.95% uptime. Expert in AWS, Docker, Kubernetes, and Infrastructure as Code.',
            sre: 'Site Reliability Engineer focused on building resilient, scalable systems. Maintained 99.99% uptime for critical services serving 10M+ users. Specialized in incident response, monitoring, and automation.',
            mobile: 'Mobile Developer with expertise in cross-platform app development. Published 15+ apps with 4.8+ star ratings and 500K+ downloads. Proficient in React Native, Flutter, and mobile performance optimization.'
        };
        return summaries[role] || summaries.fullstack;
    },

    generateImprovedBulletPoints(role) {
        const bulletPoints = {
            fullstack: [
                '• Developed and maintained 12+ full-stack web applications using React, Node.js, and MongoDB, serving 50K+ active users',
                '• Implemented RESTful APIs and microservices architecture, reducing response time by 45% and improving scalability',
                '• Led cross-functional team of 5 developers in agile environment, delivering projects 20% ahead of schedule',
                '• Optimized database queries and implemented caching strategies, resulting in 60% performance improvement'
            ],
            backend: [
                '• Architected and built scalable backend systems handling 1M+ daily API requests with 99.9% uptime',
                '• Designed microservices architecture using Docker and Kubernetes, reducing deployment time by 70%',
                '• Implemented comprehensive testing strategies achieving 95% code coverage and reducing bugs by 40%',
                '• Optimized database performance through indexing and query optimization, improving response time by 50%'
            ],
            devops: [
                '• Automated CI/CD pipelines using Jenkins and GitLab, reducing deployment time from 2 hours to 15 minutes',
                '• Managed AWS infrastructure serving 100K+ users with 99.95% uptime and $50K annual cost savings',
                '• Implemented Infrastructure as Code using Terraform, managing 200+ cloud resources across multiple environments',
                '• Set up comprehensive monitoring and alerting systems, reducing incident response time by 60%'
            ]
        };
        return bulletPoints[role] || bulletPoints.fullstack;
    },

    generateSuggestions(role) {
        return [
            'Add specific metrics and numbers to quantify your achievements',
            'Include relevant certifications for your target role',
            'Tailor your skills section to match job requirements',
            'Use action verbs to start each bullet point',
            'Keep resume to 1-2 pages for optimal ATS scanning',
            'Include links to your portfolio and GitHub profile'
        ];
    },

    displayOptimizedResume(data) {
        const output = document.getElementById('resumeOutput');
        
        output.innerHTML = `
            <div class="resume-results">
                <div class="results-header">
                    <h3>Optimized for: ${this.getRoleDisplayName(data.targetRole)}</h3>
                    <div class="ats-score">
                        <span class="score-label">ATS Score</span>
                        <span class="score-value ${this.getScoreClass(data.atsScore)}">${data.atsScore}/100</span>
                    </div>
                </div>

                <div class="optimization-tabs">
                    <button class="tab-btn active" onclick="ResumeGPT.showTab('summary')">Summary</button>
                    <button class="tab-btn" onclick="ResumeGPT.showTab('bullets')">Bullet Points</button>
                    <button class="tab-btn" onclick="ResumeGPT.showTab('keywords')">Keywords</button>
                    <button class="tab-btn" onclick="ResumeGPT.showTab('suggestions')">Tips</button>
                </div>

                <div class="tab-content">
                    <div class="tab-panel active" id="summary-panel">
                        <h4>Optimized Professional Summary</h4>
                        <div class="optimized-content">
                            <p>${data.optimizedSummary}</p>
                        </div>
                        <button class="copy-section-btn" onclick="ResumeGPT.copyText('${data.optimizedSummary}')">
                            <i class="fas fa-copy"></i> Copy Summary
                        </button>
                    </div>

                    <div class="tab-panel" id="bullets-panel">
                        <h4>Improved Bullet Points</h4>
                        <div class="optimized-content">
                            ${data.improvedBulletPoints.map(bullet => `<p>${bullet}</p>`).join('')}
                        </div>
                        <button class="copy-section-btn" onclick="ResumeGPT.copyText('${data.improvedBulletPoints.join('\\n')}')">
                            <i class="fas fa-copy"></i> Copy Bullet Points
                        </button>
                    </div>

                    <div class="tab-panel" id="keywords-panel">
                        <h4>Recommended Keywords</h4>
                        <div class="keywords-grid">
                            ${data.keywords.map(keyword => `<span class="keyword-tag">${keyword}</span>`).join('')}
                        </div>
                        <p class="keywords-note">Include these keywords naturally throughout your resume to improve ATS compatibility.</p>
                    </div>

                    <div class="tab-panel" id="suggestions-panel">
                        <h4>Optimization Suggestions</h4>
                        <div class="suggestions-list">
                            ${data.suggestions.map(suggestion => `
                                <div class="suggestion-item">
                                    <i class="fas fa-lightbulb"></i>
                                    <span>${suggestion}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="export-actions">
                    <button class="export-btn" onclick="ResumeGPT.exportAsMarkdown()">
                        <i class="fab fa-markdown"></i> Export as Markdown
                    </button>
                    <button class="export-btn" onclick="ResumeGPT.exportAsPDF()">
                        <i class="fas fa-file-pdf"></i> Export as PDF
                    </button>
                    <button class="export-btn" onclick="ResumeGPT.copyFullResume()">
                        <i class="fas fa-copy"></i> Copy Full Resume
                    </button>
                </div>
            </div>
        `;
    },

    showTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');

        // Update tab panels
        document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
        document.getElementById(`${tabName}-panel`).classList.add('active');
    },

    getRoleDisplayName(role) {
        const names = {
            fullstack: 'Full Stack Developer',
            backend: 'Backend Developer',
            frontend: 'Frontend Developer',
            devops: 'DevOps Engineer',
            sre: 'Site Reliability Engineer',
            mobile: 'Mobile Developer'
        };
        return names[role] || 'Developer';
    },

    getScoreClass(score) {
        if (score >= 90) return 'score-excellent';
        if (score >= 80) return 'score-good';
        if (score >= 70) return 'score-fair';
        return 'score-poor';
    },

    copyText(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Copied to clipboard!', 'success');
        });
    },

    exportAsMarkdown() {
        if (!this.optimizedResume) return;
        
        const markdown = this.generateMarkdown(this.optimizedResume);
        this.downloadFile(markdown, 'optimized-resume.md', 'text/markdown');
    },

    exportAsPDF() {
        this.showNotification('PDF export would be implemented with a library like jsPDF', 'info');
    },

    copyFullResume() {
        if (!this.optimizedResume) return;
        
        const fullText = this.generateFullResumeText(this.optimizedResume);
        this.copyText(fullText);
    },

    generateMarkdown(data) {
        return `# Resume - Optimized for ${this.getRoleDisplayName(data.targetRole)}

## Professional Summary
${data.optimizedSummary}

## Key Achievements
${data.improvedBulletPoints.join('\n')}

## Technical Skills
${data.keywords.join(' • ')}

---
*ATS Score: ${data.atsScore}/100*
*Generated by UpskillBro*`;
    },

    generateFullResumeText(data) {
        return `${data.optimizedSummary}\n\n${data.improvedBulletPoints.join('\n')}\n\nKeywords: ${data.keywords.join(', ')}`;
    },

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    showNotification(message, type) {
        if (window.UpskillBro) {
            window.UpskillBro.showNotification(message, type);
        }
    },

    focus() {
        document.getElementById('resumeInput').focus();
    },
    
    updateWordCount(text) {
        const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
        const wordCountEl = document.getElementById('wordCount');
        if (wordCountEl) {
            wordCountEl.textContent = `${wordCount} words`;
        }
    },
    
    initCustomDropdown() {
        const dropdown = document.getElementById('roleDropdown');
        const trigger = document.getElementById('roleTrigger');
        const menu = document.getElementById('roleMenu');
        const selectedText = document.getElementById('roleSelectedText');
        
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
                
                // Change role
                this.currentRole = value;
                if (this.optimizedResume) {
                    this.displayOptimizedResume(this.optimizedResume);
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
        const trigger = document.getElementById('roleTrigger');
        const menu = document.getElementById('roleMenu');
        
        if (trigger && menu) {
            trigger.classList.add('active');
            menu.classList.add('show');
        }
    },
    
    closeDropdown() {
        const trigger = document.getElementById('roleTrigger');
        const menu = document.getElementById('roleMenu');
        
        if (trigger && menu) {
            trigger.classList.remove('active');
            menu.classList.remove('show');
        }
    }
};

// Add resume-specific styles
const resumeStyles = document.createElement('style');
resumeStyles.textContent = `
    .results-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--border-color);
    }
    
    .ats-score {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
    }
    
    .score-label {
        font-size: 12px;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .score-value {
        font-size: 24px;
        font-weight: 800;
        font-family: var(--font-mono);
    }
    
    .score-excellent { color: var(--accent-primary); }
    .score-good { color: var(--accent-secondary); }
    .score-fair { color: #fbbf24; }
    .score-poor { color: var(--accent-danger); }
    
    .optimization-tabs {
        display: flex;
        gap: 4px;
        margin-bottom: 20px;
        background: var(--secondary-bg);
        border-radius: 8px;
        padding: 4px;
    }
    
    .tab-btn {
        flex: 1;
        background: none;
        border: none;
        padding: 12px 16px;
        color: var(--text-secondary);
        font-weight: 600;
        font-size: 14px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .tab-btn.active {
        background: var(--accent-primary);
        color: var(--primary-bg);
    }
    
    .tab-panel {
        display: none;
    }
    
    .tab-panel.active {
        display: block;
    }
    
    .optimized-content {
        background: var(--secondary-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 20px;
        margin: 16px 0;
        line-height: 1.6;
    }
    
    .copy-section-btn {
        background: var(--accent-secondary);
        border: none;
        border-radius: 6px;
        padding: 8px 16px;
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
    }
    
    .copy-section-btn:hover {
        background: var(--accent-primary);
    }
    
    .keywords-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 16px 0;
    }
    
    .keyword-tag {
        background: var(--accent-primary);
        color: var(--primary-bg);
        padding: 6px 12px;
        border-radius: 16px;
        font-size: 12px;
        font-weight: 600;
    }
    
    .keywords-note {
        color: var(--text-secondary);
        font-style: italic;
        margin-top: 16px;
    }
    
    .suggestions-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    
    .suggestion-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 12px;
        background: var(--secondary-bg);
        border-radius: 8px;
        border-left: 3px solid var(--accent-primary);
    }
    
    .suggestion-item i {
        color: var(--accent-primary);
        margin-top: 2px;
    }
    
    .export-actions {
        display: flex;
        gap: 12px;
        margin-top: 24px;
        padding-top: 20px;
        border-top: 1px solid var(--border-color);
        flex-wrap: wrap;
    }
    
    .export-btn {
        background: var(--secondary-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 12px 16px;
        color: var(--text-primary);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
    }
    
    .export-btn:hover {
        border-color: var(--accent-primary);
        color: var(--accent-primary);
    }
`;
document.head.appendChild(resumeStyles);