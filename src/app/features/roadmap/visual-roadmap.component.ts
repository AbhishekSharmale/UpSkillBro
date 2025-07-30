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
            ${resources.map((resource: any) => `
              <div class="resource-item">
                <h4>${resource.category}</h4>
                ${resource.links.map((link: any) => `
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
    // Get current user's role from roadmap data
    const roadmapData = JSON.parse(localStorage.getItem('roadmap_data') || '{}');
    const role = roadmapData.title?.toLowerCase() || 'fullstack';
    
    // Role-specific resource mapping
    const roleResourceMap: { [key: string]: { [key: string]: any[] } } = {
      // FRONTEND DEVELOPER RESOURCES
      'frontend': {
        'Foundation Building': [
          {
            category: '🎯 Frontend Fundamentals',
            links: [
              { title: 'HTML & CSS Complete Course - freeCodeCamp', url: 'https://www.youtube.com/watch?v=mU6anWqZJcc', icon: '🎨', type: 'Free' },
              { title: 'JavaScript Complete Course - Jonas Schmedtmann', url: 'https://www.udemy.com/course/the-complete-javascript-course/', icon: '⚡', type: 'Paid' },
              { title: 'CSS Grid & Flexbox - Wes Bos', url: 'https://cssgrid.io/', icon: '📐', type: 'Free' },
              { title: 'MDN Web Docs - CSS', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS', icon: '📚', type: 'Docs' }
            ]
          },
          {
            category: '⚛️ React Ecosystem',
            links: [
              { title: 'React Official Tutorial', url: 'https://react.dev/learn', icon: '⚛️', type: 'Free' },
              { title: 'React Course - Maximilian Schwarzmüller', url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/', icon: '🎓', type: 'Paid' },
              { title: 'React Hooks Course - Ben Awad', url: 'https://www.youtube.com/watch?v=f687hBjwFcM', icon: '🪝', type: 'Free' }
            ]
          }
        ],
        'Skill Enhancement': [
          {
            category: '🔷 Advanced JavaScript & TypeScript',
            links: [
              { title: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/', icon: '🔷', type: 'Docs' },
              { title: 'Advanced TypeScript - Marius Schulz', url: 'https://www.youtube.com/playlist?list=PLNqp92_EXZBJYFrpEzdO2EapvU0GOJ09n', icon: '🎓', type: 'Free' },
              { title: 'JavaScript Design Patterns', url: 'https://www.patterns.dev/', icon: '🎨', type: 'Free' }
            ]
          },
          {
            category: '🧪 Testing & Quality',
            links: [
              { title: 'React Testing Library Course', url: 'https://testingjavascript.com/', icon: '🧪', type: 'Paid' },
              { title: 'Jest Testing Framework', url: 'https://jestjs.io/docs/getting-started', icon: '🃏', type: 'Docs' },
              { title: 'Cypress E2E Testing', url: 'https://learn.cypress.io/', icon: '🌲', type: 'Free' }
            ]
          }
        ],
        'Career Advancement': [
          {
            category: '🏗️ Frontend Architecture',
            links: [
              { title: 'Micro Frontends Architecture', url: 'https://micro-frontends.org/', icon: '🏗️', type: 'Free' },
              { title: 'Frontend System Design', url: 'https://www.youtube.com/watch?v=5vyKhm2NTfw', icon: '📐', type: 'Free' },
              { title: 'Performance Optimization Guide', url: 'https://web.dev/performance/', icon: '⚡', type: 'Free' }
            ]
          }
        ]
      },
      
      // BACKEND DEVELOPER RESOURCES
      'backend': {
        'Foundation Building': [
          {
            category: '🟢 Node.js & Server Development',
            links: [
              { title: 'Node.js Complete Course - Mosh Hamedani', url: 'https://www.youtube.com/watch?v=TlB_eWDSMt4', icon: '🟢', type: 'Free' },
              { title: 'Express.js Crash Course', url: 'https://www.youtube.com/watch?v=L72fhGm1tfE', icon: '🚀', type: 'Free' },
              { title: 'RESTful API Design Course', url: 'https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/', icon: '🔗', type: 'Paid' }
            ]
          },
          {
            category: '🗄️ Database Fundamentals',
            links: [
              { title: 'MongoDB Complete Course', url: 'https://www.youtube.com/watch?v=4yqu8YF29cU', icon: '🍃', type: 'Free' },
              { title: 'PostgreSQL Tutorial', url: 'https://www.postgresqltutorial.com/', icon: '🐘', type: 'Free' },
              { title: 'Database Design Course - freeCodeCamp', url: 'https://www.youtube.com/watch?v=ztHopE5Wnpc', icon: '🗄️', type: 'Free' }
            ]
          }
        ],
        'Skill Enhancement': [
          {
            category: '🏗️ Advanced Architecture',
            links: [
              { title: 'Microservices with Node.js', url: 'https://www.udemy.com/course/microservices-with-node-js-and-react/', icon: '🏗️', type: 'Paid' },
              { title: 'GraphQL Complete Course', url: 'https://www.howtographql.com/', icon: '📊', type: 'Free' },
              { title: 'Event-Driven Architecture', url: 'https://www.youtube.com/watch?v=STKCRSUsyP0', icon: '⚡', type: 'Free' }
            ]
          }
        ],
        'Career Advancement': [
          {
            category: '📈 System Design & Scalability',
            links: [
              { title: 'System Design Interview Course', url: 'https://www.educative.io/courses/grokking-the-system-design-interview', icon: '🏗️', type: 'Paid' },
              { title: 'High Scalability Blog', url: 'http://highscalability.com/', icon: '📈', type: 'Free' },
              { title: 'Designing Data-Intensive Applications', url: 'https://dataintensive.net/', icon: '📚', type: 'Book' }
            ]
          }
        ]
      },
      
      // DATA SCIENTIST RESOURCES
      'data_scientist': {
        'Foundation Building': [
          {
            category: '🐍 Python for Data Science',
            links: [
              { title: 'Python Data Science Handbook', url: 'https://jakevdp.github.io/PythonDataScienceHandbook/', icon: '📚', type: 'Free' },
              { title: 'Pandas Complete Course', url: 'https://www.youtube.com/watch?v=vmEHCJofslg', icon: '🐼', type: 'Free' },
              { title: 'NumPy Tutorial', url: 'https://numpy.org/learn/', icon: '🔢', type: 'Free' }
            ]
          },
          {
            category: '📊 Statistics & Mathematics',
            links: [
              { title: 'Statistics for Data Science - Khan Academy', url: 'https://www.khanacademy.org/math/statistics-probability', icon: '📈', type: 'Free' },
              { title: 'Linear Algebra - 3Blue1Brown', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab', icon: '🧮', type: 'Free' }
            ]
          }
        ],
        'Skill Enhancement': [
          {
            category: '🤖 Machine Learning',
            links: [
              { title: 'Machine Learning Course - Andrew Ng', url: 'https://www.coursera.org/learn/machine-learning', icon: '🤖', type: 'Paid' },
              { title: 'Scikit-learn Tutorial', url: 'https://scikit-learn.org/stable/tutorial/index.html', icon: '🔬', type: 'Free' },
              { title: 'ML Engineering Course', url: 'https://www.youtube.com/watch?v=nhDuley4aMc', icon: '⚙️', type: 'Free' }
            ]
          }
        ],
        'Career Advancement': [
          {
            category: '🏭 MLOps & Production',
            links: [
              { title: 'MLOps Specialization', url: 'https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops', icon: '🏭', type: 'Paid' },
              { title: 'Docker for Data Science', url: 'https://www.youtube.com/watch?v=jbb1dbFaovg', icon: '🐳', type: 'Free' },
              { title: 'AWS SageMaker Course', url: 'https://aws.amazon.com/sagemaker/getting-started/', icon: '☁️', type: 'Free' }
            ]
          }
        ]
      },
      
      // DEVOPS ENGINEER RESOURCES
      'devops_engineer': {
        'Foundation Building': [
          {
            category: '🐧 Linux & System Administration',
            links: [
              { title: 'Linux Command Line Course', url: 'https://www.youtube.com/watch?v=2PGnYjbYuUo', icon: '🐧', type: 'Free' },
              { title: 'Linux System Administration', url: 'https://www.edx.org/course/introduction-to-linux', icon: '⚙️', type: 'Free' },
              { title: 'Shell Scripting Tutorial', url: 'https://www.shellscript.sh/', icon: '📜', type: 'Free' }
            ]
          },
          {
            category: '🐳 Containerization',
            links: [
              { title: 'Docker Complete Course', url: 'https://www.youtube.com/watch?v=3c-iBn73dDE', icon: '🐳', type: 'Free' },
              { title: 'Docker Official Tutorial', url: 'https://docs.docker.com/get-started/', icon: '📚', type: 'Free' },
              { title: 'Docker Compose Guide', url: 'https://docs.docker.com/compose/', icon: '🎼', type: 'Free' }
            ]
          }
        ],
        'Skill Enhancement': [
          {
            category: '☸️ Kubernetes',
            links: [
              { title: 'Kubernetes Course - TechWorld with Nana', url: 'https://www.youtube.com/watch?v=X48VuDVv0do', icon: '☸️', type: 'Free' },
              { title: 'Kubernetes Official Tutorial', url: 'https://kubernetes.io/docs/tutorials/', icon: '📚', type: 'Free' },
              { title: 'CKA Certification Prep', url: 'https://www.cncf.io/certification/cka/', icon: '🏆', type: 'Paid' }
            ]
          }
        ],
        'Career Advancement': [
          {
            category: '📊 Monitoring & Observability',
            links: [
              { title: 'Prometheus & Grafana Course', url: 'https://www.youtube.com/watch?v=9TJx7QTrTyo', icon: '📊', type: 'Free' },
              { title: 'ELK Stack Tutorial', url: 'https://www.elastic.co/guide/index.html', icon: '🔍', type: 'Free' },
              { title: 'Site Reliability Engineering', url: 'https://sre.google/books/', icon: '🛡️', type: 'Free' }
            ]
          }
        ]
      },
      
      // TECHNICAL PM RESOURCES
      'technical_pm': {
        'Foundation Building': [
          {
            category: '📋 Product Management Fundamentals',
            links: [
              { title: 'Product Management Course - Google', url: 'https://www.coursera.org/professional-certificates/google-project-management', icon: '📋', type: 'Paid' },
              { title: 'Product School PM Course', url: 'https://productschool.com/product-management-certification/', icon: '🎓', type: 'Paid' },
              { title: 'Lean Startup Methodology', url: 'http://theleanstartup.com/', icon: '🚀', type: 'Free' }
            ]
          },
          {
            category: '💻 Technical Understanding',
            links: [
              { title: 'Technical Skills for PMs', url: 'https://www.youtube.com/watch?v=Ce1hKGWACkE', icon: '💻', type: 'Free' },
              { title: 'API Fundamentals for PMs', url: 'https://www.postman.com/api-first/', icon: '🔗', type: 'Free' },
              { title: 'Database Basics for PMs', url: 'https://www.youtube.com/watch?v=Tk1t3WKK-ZY', icon: '🗄️', type: 'Free' }
            ]
          }
        ],
        'Skill Enhancement': [
          {
            category: '🎯 Advanced Product Strategy',
            links: [
              { title: 'Product Strategy Course - Reforge', url: 'https://www.reforge.com/', icon: '🎯', type: 'Paid' },
              { title: 'Jobs-to-be-Done Framework', url: 'https://jtbd.info/', icon: '🔧', type: 'Free' },
              { title: 'OKRs for Product Teams', url: 'https://www.whatmatters.com/', icon: '🎯', type: 'Free' }
            ]
          }
        ],
        'Career Advancement': [
          {
            category: '🚀 Senior PM Skills',
            links: [
              { title: 'VP of Product Playbook', url: 'https://www.lennysnewsletter.com/', icon: '🚀', type: 'Paid' },
              { title: 'Product Leadership Course', url: 'https://www.mindtheproduct.com/', icon: '👨‍💼', type: 'Free' },
              { title: 'Building Product Teams', url: 'https://www.svpg.com/', icon: '👥', type: 'Free' }
            ]
          }
        ]
      }
    };
    
    // Extract role from roadmap title
    let detectedRole = 'fullstack';
    if (role.includes('frontend')) detectedRole = 'frontend';
    else if (role.includes('backend')) detectedRole = 'backend';
    else if (role.includes('data')) detectedRole = 'data_scientist';
    else if (role.includes('devops')) detectedRole = 'devops_engineer';
    else if (role.includes('technical_pm') || role.includes('product')) detectedRole = 'technical_pm';
    
    return roleResourceMap[detectedRole]?.[milestone.title] || [
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