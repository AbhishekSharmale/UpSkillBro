import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface RoadmapNode {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'locked';
  estimatedTime: string;
  resources: string[];
  skills: string[];
}

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="roadmap">
      <div class="container">
        <div class="roadmap-header">
          <h1>Your Personalized Learning Roadmap</h1>
          <p>Full Stack JavaScript Developer Path</p>
          
          <div class="roadmap-stats">
            <div class="stat">
              <span class="stat-value">{{completedNodes}}/{{totalNodes}}</span>
              <span class="stat-label">Completed</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{estimatedCompletion}}</span>
              <span class="stat-label">Est. Completion</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{progressPercentage}}%</span>
              <span class="stat-label">Progress</span>
            </div>
          </div>
        </div>

        <div class="roadmap-timeline">
          <div class="timeline-line"></div>
          
          <div class="roadmap-node" 
               *ngFor="let node of roadmapNodes; let i = index"
               [class.completed]="node.status === 'completed'"
               [class.current]="node.status === 'current'"
               [class.locked]="node.status === 'locked'">
            
            <div class="node-connector"></div>
            
            <div class="node-content">
              <div class="node-header">
                <div class="node-status-icon">
                  <span *ngIf="node.status === 'completed'">✅</span>
                  <span *ngIf="node.status === 'current'">🎯</span>
                  <span *ngIf="node.status === 'locked'">🔒</span>
                </div>
                <h3>{{node.title}}</h3>
                <span class="node-time">{{node.estimatedTime}}</span>
              </div>
              
              <p class="node-description">{{node.description}}</p>
              
              <div class="node-skills">
                <span class="skill-tag" *ngFor="let skill of node.skills">{{skill}}</span>
              </div>
              
              <div class="node-resources" *ngIf="node.status !== 'locked'">
                <h4>Resources:</h4>
                <ul>
                  <li *ngFor="let resource of node.resources">{{resource}}</li>
                </ul>
              </div>
              
              <div class="node-actions" *ngIf="node.status === 'current'">
                <button class="btn-primary">Start Learning</button>
                <button class="btn-secondary">Mark Complete</button>
              </div>
            </div>
          </div>
        </div>

        <div class="roadmap-sidebar">
          <div class="card">
            <h3>Skill Progress</h3>
            <div class="skill-progress" *ngFor="let skill of skillProgress">
              <div class="skill-info">
                <span class="skill-name">{{skill.name}}</span>
                <span class="skill-level">{{skill.level}}%</span>
              </div>
              <div class="skill-bar">
                <div class="skill-fill" [style.width.%]="skill.level"></div>
              </div>
            </div>
          </div>
          
          <div class="card">
            <h3>Upcoming Milestones</h3>
            <div class="milestone" *ngFor="let milestone of upcomingMilestones">
              <div class="milestone-date">{{milestone.date}}</div>
              <div class="milestone-title">{{milestone.title}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./roadmap.component.scss']
})
export class RoadmapComponent {
  roadmapNodes: RoadmapNode[] = [
    {
      id: 1,
      title: 'HTML & CSS Fundamentals',
      description: 'Master the building blocks of web development',
      status: 'completed',
      estimatedTime: '2 weeks',
      resources: ['MDN HTML Guide', 'CSS Grid Garden', 'Flexbox Froggy'],
      skills: ['HTML5', 'CSS3', 'Responsive Design']
    },
    {
      id: 2,
      title: 'JavaScript Basics',
      description: 'Learn core JavaScript concepts and ES6+ features',
      status: 'completed',
      estimatedTime: '3 weeks',
      resources: ['JavaScript.info', 'Eloquent JavaScript', 'FreeCodeCamp JS'],
      skills: ['ES6+', 'DOM Manipulation', 'Async/Await']
    },
    {
      id: 3,
      title: 'React Fundamentals',
      description: 'Build interactive UIs with React',
      status: 'current',
      estimatedTime: '4 weeks',
      resources: ['React Official Docs', 'React Tutorial', 'Modern React Course'],
      skills: ['Components', 'Hooks', 'State Management']
    },
    {
      id: 4,
      title: 'Advanced React Patterns',
      description: 'Master advanced React concepts and patterns',
      status: 'locked',
      estimatedTime: '3 weeks',
      resources: ['Advanced React Patterns', 'React Performance', 'Testing React'],
      skills: ['Context API', 'Custom Hooks', 'Performance Optimization']
    },
    {
      id: 5,
      title: 'Node.js & Express',
      description: 'Build server-side applications with Node.js',
      status: 'locked',
      estimatedTime: '4 weeks',
      resources: ['Node.js Guide', 'Express Documentation', 'REST API Tutorial'],
      skills: ['Node.js', 'Express.js', 'REST APIs']
    },
    {
      id: 6,
      title: 'Database & MongoDB',
      description: 'Learn database design and MongoDB',
      status: 'locked',
      estimatedTime: '3 weeks',
      resources: ['MongoDB University', 'Database Design', 'Mongoose ODM'],
      skills: ['MongoDB', 'Database Design', 'Mongoose']
    }
  ];

  skillProgress = [
    { name: 'JavaScript', level: 85 },
    { name: 'React', level: 60 },
    { name: 'Node.js', level: 30 },
    { name: 'MongoDB', level: 15 },
    { name: 'TypeScript', level: 45 }
  ];

  upcomingMilestones = [
    { date: 'Next Week', title: 'Complete React Hooks' },
    { date: 'In 2 Weeks', title: 'Start Node.js Module' },
    { date: 'In 1 Month', title: 'Build First Full Stack App' }
  ];

  get completedNodes() {
    return this.roadmapNodes.filter(node => node.status === 'completed').length;
  }

  get totalNodes() {
    return this.roadmapNodes.length;
  }

  get progressPercentage() {
    return Math.round((this.completedNodes / this.totalNodes) * 100);
  }

  get estimatedCompletion() {
    return '3 months';
  }
}