import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Milestone {
  id: number;
  title: string;
  duration: string;
  salaryImpact: string;
  skills: string[];
  tasks: string[];
  resources: string[];
  completed?: boolean;
}

interface Roadmap {
  title: string;
  currentSalary: string;
  targetSalary: string;
  timeline: string;
  milestones: Milestone[];
}

@Component({
  selector: 'app-visual-roadmap',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="roadmap">
      <div class="container">
        <div class="roadmap-header">
          <h1>🗺️ Your Personalized Career Roadmap</h1>
          <div class="salary-progression">
            <div class="salary-item current">
              <span class="label">Current</span>
              <span class="value">{{roadmap?.currentSalary}}</span>
            </div>
            <div class="arrow">→</div>
            <div class="salary-item target">
              <span class="label">Target</span>
              <span class="value">{{roadmap?.targetSalary}}</span>
            </div>
            <div class="timeline">
              <span>Timeline: {{roadmap?.timeline}}</span>
            </div>
          </div>
        </div>

        <div class="roadmap-visual" *ngIf="roadmap">
          <div class="milestone-timeline">
            <div *ngFor="let milestone of roadmap.milestones; let i = index" 
                 class="milestone-container">
              
              <div class="milestone-connector" *ngIf="i > 0"></div>
              
              <div class="milestone-card" [class.completed]="milestone.completed">
                <div class="milestone-header">
                  <div class="milestone-number">{{milestone.id}}</div>
                  <div class="milestone-info">
                    <h3>{{milestone.title}}</h3>
                    <div class="milestone-meta">
                      <span class="duration">⏱️ {{milestone.duration}}</span>
                      <span class="salary-impact">💰 {{milestone.salaryImpact}}</span>
                    </div>
                  </div>
                </div>

                <div class="milestone-content">
                  <div class="skills-section">
                    <h4>🎯 Skills to Learn</h4>
                    <div class="skills-list">
                      <span *ngFor="let skill of milestone.skills" class="skill-tag">
                        {{skill}}
                      </span>
                    </div>
                  </div>

                  <div class="tasks-section">
                    <h4>✅ Key Tasks</h4>
                    <ul class="tasks-list">
                      <li *ngFor="let task of milestone.tasks">{{task}}</li>
                    </ul>
                  </div>

                  <div class="resources-section">
                    <h4>📚 Resources</h4>
                    <div class="resources-list">
                      <span *ngFor="let resource of milestone.resources" class="resource-tag">
                        {{resource}}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="milestone-actions">
                  <button class="btn-primary" (click)="startMilestone(milestone)">
                    {{milestone.completed ? 'Review' : 'Start Learning'}}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="roadmap-actions">
          <button class="btn-secondary" (click)="retakeAssessment()">
            🔄 Retake Assessment
          </button>
          <button class="btn-primary" (click)="goToDashboard()" *ngIf="!isGuest">
            📊 View Dashboard
          </button>
          <button class="btn-primary" (click)="signUpToSave()" *ngIf="isGuest">
            💾 Sign Up to Save Progress
          </button>
        </div>
        
        <div class="guest-notice" *ngIf="isGuest">
          <p>👤 You're viewing as a guest. Sign up to save your roadmap and track progress!</p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./roadmap.component.scss']
})
export class VisualRoadmapComponent implements OnInit {
  roadmap: Roadmap | null = null;
  isGuest = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Security check - verify user authentication
    const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}');
    
    if (!currentUser || !currentUser.uid) {
      // Clear stale data and redirect to login
      localStorage.clear();
      this.router.navigate(['/login']);
      return;
    }
    
    this.checkUserType();
    this.loadRoadmap();
  }
  
  checkUserType() {
    const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}');
    this.isGuest = currentUser.isGuest || false;
  }

  loadRoadmap() {
    const roadmapData = localStorage.getItem('roadmap_data');
    if (roadmapData) {
      this.roadmap = JSON.parse(roadmapData);
    } else {
      // Generate default roadmap if none exists
      this.generateDefaultRoadmap();
    }
  }

  generateDefaultRoadmap() {
    this.roadmap = {
      title: 'Full Stack Developer Career Path',
      currentSalary: '$50k',
      targetSalary: '$100k',
      timeline: '1 year',
      milestones: [
        {
          id: 1,
          title: 'Foundation Building',
          duration: '2-3 months',
          salaryImpact: '+15%',
          skills: ['JavaScript ES6+', 'React Basics', 'Node.js'],
          tasks: [
            'Complete JavaScript fundamentals',
            'Build 3 React projects',
            'Learn Node.js basics'
          ],
          resources: ['MDN Docs', 'React Documentation', 'Node.js Guides']
        },
        {
          id: 2,
          title: 'Intermediate Development',
          duration: '3-4 months',
          salaryImpact: '+25%',
          skills: ['TypeScript', 'Database Design', 'API Development'],
          tasks: [
            'Master TypeScript',
            'Build full-stack applications',
            'Learn database optimization'
          ],
          resources: ['TypeScript Handbook', 'Database Courses', 'API Best Practices']
        },
        {
          id: 3,
          title: 'Advanced & Leadership',
          duration: '4-6 months',
          salaryImpact: '+40%',
          skills: ['System Design', 'DevOps', 'Team Leadership'],
          tasks: [
            'Design scalable systems',
            'Implement CI/CD pipelines',
            'Lead development projects'
          ],
          resources: ['System Design Courses', 'AWS Certification', 'Leadership Training']
        }
      ]
    };
  }

  startMilestone(milestone: Milestone) {
    const resources = this.getResourceLinks(milestone);
    
    // Create modal with resource links
    const modal = document.createElement('div');
    modal.className = 'resource-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>📚 ${milestone.title} - Learning Resources</h3>
          <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
        </div>
        <div class="modal-body">
          <p>Start your learning journey with these curated resources:</p>
          <div class="resource-links">
            ${resources.map(resource => `
              <div class="resource-item">
                <h4>${resource.category}</h4>
                ${resource.links.map(link => `
                  <a href="${link.url}" target="_blank" class="resource-link">
                    <span class="link-icon">${link.icon}</span>
                    <span class="link-text">${link.title}</span>
                    <span class="link-type">${link.type}</span>
                  </a>
                `).join('')}
              </div>
            `).join('')}
          </div>
          <div class="modal-actions">
            <button class="btn-primary" onclick="this.parentElement.parentElement.parentElement.remove()">Start Learning 🚀</button>
          </div>
        </div>
      </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
      .resource-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }
      .modal-content {
        background: white;
        border-radius: 12px;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      }
      .modal-header {
        padding: 20px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .close-btn {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
      }
      .modal-body {
        padding: 20px;
      }
      .resource-item {
        margin-bottom: 20px;
      }
      .resource-item h4 {
        color: #0038FF;
        margin-bottom: 10px;
        font-size: 16px;
      }
      .resource-link {
        display: flex;
        align-items: center;
        padding: 12px;
        margin-bottom: 8px;
        background: #f8f9fa;
        border-radius: 8px;
        text-decoration: none;
        color: #333;
        transition: all 0.2s;
      }
      .resource-link:hover {
        background: #e9ecef;
        transform: translateY(-1px);
      }
      .link-icon {
        margin-right: 12px;
        font-size: 18px;
      }
      .link-text {
        flex: 1;
        font-weight: 500;
      }
      .link-type {
        background: #0038FF;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        text-transform: uppercase;
      }
      .modal-actions {
        text-align: center;
        margin-top: 20px;
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
  }
  
  getResourceLinks(milestone: Milestone): any[] {
    const resourceMap: { [key: string]: any[] } = {
      'Foundation Building': [
        {
          category: '📖 Documentation & Guides',
          links: [
            { title: 'MDN Web Docs - JavaScript', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', icon: '📚', type: 'Docs' },
            { title: 'React Official Documentation', url: 'https://react.dev/', icon: '⚛️', type: 'Docs' },
            { title: 'Node.js Official Guide', url: 'https://nodejs.org/en/docs/', icon: '🟢', type: 'Docs' }
          ]
        },
        {
          category: '🎥 Video Courses',
          links: [
            { title: 'JavaScript Fundamentals - freeCodeCamp', url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg', icon: '📺', type: 'Free' },
            { title: 'React Tutorial - Traversy Media', url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8', icon: '📺', type: 'Free' },
            { title: 'Node.js Crash Course', url: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4', icon: '📺', type: 'Free' }
          ]
        },
        {
          category: '💻 Practice Platforms',
          links: [
            { title: 'freeCodeCamp', url: 'https://www.freecodecamp.org/', icon: '🔥', type: 'Free' },
            { title: 'Codecademy', url: 'https://www.codecademy.com/', icon: '🎓', type: 'Freemium' },
            { title: 'JavaScript30', url: 'https://javascript30.com/', icon: '⚡', type: 'Free' }
          ]
        }
      ],
      'Skill Enhancement': [
        {
          category: '📖 Advanced Documentation',
          links: [
            { title: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/', icon: '🔷', type: 'Docs' },
            { title: 'React Testing Library', url: 'https://testing-library.com/docs/react-testing-library/intro/', icon: '🧪', type: 'Docs' },
            { title: 'Express.js Guide', url: 'https://expressjs.com/en/guide/routing.html', icon: '🚀', type: 'Docs' }
          ]
        },
        {
          category: '🎥 Advanced Courses',
          links: [
            { title: 'Advanced React Patterns', url: 'https://www.youtube.com/watch?v=6YbBfPFzuuI', icon: '📺', type: 'Free' },
            { title: 'TypeScript Course - Net Ninja', url: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9gUgr39Q_yD6v-bSyMwDPUI', icon: '📺', type: 'Free' },
            { title: 'Database Design Course', url: 'https://www.youtube.com/watch?v=ztHopE5Wnpc', icon: '📺', type: 'Free' }
          ]
        },
        {
          category: '🛠️ Tools & Platforms',
          links: [
            { title: 'GitHub Learning Lab', url: 'https://lab.github.com/', icon: '🐙', type: 'Free' },
            { title: 'Postman Learning Center', url: 'https://learning.postman.com/', icon: '📮', type: 'Free' },
            { title: 'Docker Getting Started', url: 'https://docs.docker.com/get-started/', icon: '🐳', type: 'Free' }
          ]
        }
      ],
      'Career Advancement': [
        {
          category: '🏗️ System Design',
          links: [
            { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', icon: '🏗️', type: 'Free' },
            { title: 'High Scalability', url: 'http://highscalability.com/', icon: '📈', type: 'Free' },
            { title: 'AWS Architecture Center', url: 'https://aws.amazon.com/architecture/', icon: '☁️', type: 'Free' }
          ]
        },
        {
          category: '👥 Leadership & Soft Skills',
          links: [
            { title: 'Tech Lead Survival Guide', url: 'https://www.youtube.com/watch?v=kOpHykNIxF0', icon: '👨‍💼', type: 'Free' },
            { title: 'Engineering Management', url: 'https://www.youtube.com/watch?v=iLS6NXMXtLI', icon: '📊', type: 'Free' },
            { title: 'Code Review Best Practices', url: 'https://google.github.io/eng-practices/review/', icon: '🔍', type: 'Free' }
          ]
        },
        {
          category: '🎯 Certifications',
          links: [
            { title: 'AWS Certified Solutions Architect', url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/', icon: '🏆', type: 'Paid' },
            { title: 'Google Cloud Professional', url: 'https://cloud.google.com/certification', icon: '🏆', type: 'Paid' },
            { title: 'Kubernetes Certification', url: 'https://www.cncf.io/certification/cka/', icon: '🏆', type: 'Paid' }
          ]
        }
      ]
    };
    
    return resourceMap[milestone.title] || [
      {
        category: '📚 General Resources',
        links: [
          { title: 'MDN Web Docs', url: 'https://developer.mozilla.org/', icon: '📚', type: 'Free' },
          { title: 'Stack Overflow', url: 'https://stackoverflow.com/', icon: '❓', type: 'Free' },
          { title: 'GitHub', url: 'https://github.com/', icon: '🐙', type: 'Free' }
        ]
      }
    ];
  }

  retakeAssessment() {
    localStorage.removeItem('assessment_completed');
    localStorage.removeItem('assessment_data');
    localStorage.removeItem('roadmap_data');
    this.router.navigate(['/assessment']);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
  
  signUpToSave() {
    // Store current roadmap data for after signup
    localStorage.setItem('pending_roadmap_save', 'true');
    this.router.navigate(['/login']);
  }
}