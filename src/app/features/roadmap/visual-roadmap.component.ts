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
    alert(`Starting milestone: ${milestone.title}\\n\\nThis will redirect to learning resources and track your progress.`);
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