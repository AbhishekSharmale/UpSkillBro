import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AIRoadmapService, LearningRoadmap } from '../services/ai-roadmap.service';

@Component({
  selector: 'app-ai-roadmap-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="roadmap-generator">
      <div class="generator-header">
        <h3>🚀 AI Roadmap Generator</h3>
        <p>Get a personalized learning path in seconds!</p>
      </div>
      
      <div class="quick-form" *ngIf="!generatedRoadmap">
        <div class="form-row">
          <select [(ngModel)]="userProfile.goal" class="form-select">
            <option value="">Select your goal...</option>
            <option value="Get my first developer job">Get my first job</option>
            <option value="Switch to a new technology stack">Switch tech stack</option>
            <option value="Advance to senior level">Become senior</option>
            <option value="Become a tech lead">Become tech lead</option>
          </select>
        </div>
        
        <div class="form-row">
          <select [(ngModel)]="userProfile.level" class="form-select">
            <option value="">Experience level...</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        
        <div class="form-row">
          <select [(ngModel)]="userProfile.timeCommitment" class="form-select">
            <option value="">Time per week...</option>
            <option value="1-3 hours">1-3 hours</option>
            <option value="4-7 hours">4-7 hours</option>
            <option value="8-15 hours">8-15 hours</option>
          </select>
        </div>
        
        <button 
          class="generate-btn" 
          (click)="generateRoadmap()"
          [disabled]="!canGenerate() || isGenerating">
          <span *ngIf="!isGenerating">✨ Generate My Roadmap</span>
          <span *ngIf="isGenerating">🤖 AI is thinking...</span>
        </button>
      </div>
      
      <div class="roadmap-preview" *ngIf="generatedRoadmap">
        <div class="roadmap-header">
          <h4>{{generatedRoadmap.title}}</h4>
          <p>{{generatedRoadmap.description}}</p>
          <div class="roadmap-stats">
            <span class="stat">📅 {{generatedRoadmap.totalWeeks}} weeks</span>
            <span class="stat">🎯 {{generatedRoadmap.milestones.length}} milestones</span>
            <span class="stat">🛠️ {{generatedRoadmap.skillsToLearn.length}} skills</span>
          </div>
        </div>
        
        <div class="milestones-preview">
          <div class="milestone" *ngFor="let milestone of generatedRoadmap.milestones.slice(0, 3)">
            <div class="milestone-number">{{milestone.id.split('-')[1]}}</div>
            <div class="milestone-content">
              <h5>{{milestone.title}}</h5>
              <p>{{milestone.description}}</p>
              <div class="milestone-duration">⏱️ {{milestone.estimatedWeeks}} weeks</div>
            </div>
          </div>
        </div>
        
        <div class="roadmap-actions">
          <button class="btn-primary" (click)="startRoadmap()">🚀 Start Learning</button>
          <button class="btn-secondary" (click)="generateNew()">🔄 Generate New</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .roadmap-generator {
      background: var(--background-white);
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: var(--card-shadow);
    }

    .generator-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .generator-header h3 {
      margin: 0 0 0.5rem 0;
      color: var(--primary-blue);
    }

    .generator-header p {
      margin: 0;
      color: var(--secondary-gray);
      font-size: 0.9rem;
    }

    .form-row {
      margin-bottom: 1rem;
    }

    .form-select {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid var(--border-color);
      border-radius: 8px;
      font-size: 0.9rem;
      background: var(--background-white);
      color: var(--black-text);
      
      &:focus {
        outline: none;
        border-color: var(--primary-blue);
      }
    }

    .generate-btn {
      width: 100%;
      padding: 1rem;
      background: var(--primary-gradient);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 56, 255, 0.3);
      }
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }
    }

    .roadmap-preview {
      animation: fadeIn 0.5s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .roadmap-header h4 {
      margin: 0 0 0.5rem 0;
      color: var(--black-text);
    }

    .roadmap-header p {
      margin: 0 0 1rem 0;
      color: var(--secondary-gray);
      font-size: 0.9rem;
    }

    .roadmap-stats {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .stat {
      background: rgba(0, 56, 255, 0.1);
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--primary-blue);
    }

    .milestones-preview {
      margin-bottom: 1.5rem;
    }

    .milestone {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      padding: 1rem;
      background: var(--light-gray-bg);
      border-radius: 8px;
    }

    .milestone-number {
      width: 30px;
      height: 30px;
      background: var(--primary-gradient);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.9rem;
      flex-shrink: 0;
    }

    .milestone-content h5 {
      margin: 0 0 0.25rem 0;
      color: var(--black-text);
      font-size: 0.95rem;
    }

    .milestone-content p {
      margin: 0 0 0.5rem 0;
      color: var(--secondary-gray);
      font-size: 0.85rem;
    }

    .milestone-duration {
      font-size: 0.8rem;
      color: var(--primary-blue);
      font-weight: 600;
    }

    .roadmap-actions {
      display: flex;
      gap: 0.75rem;
    }

    .btn-primary, .btn-secondary {
      flex: 1;
      padding: 0.75rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: var(--primary-gradient);
      color: white;
      border: none;
    }

    .btn-secondary {
      background: transparent;
      color: var(--primary-blue);
      border: 2px solid var(--primary-blue);
    }
  `]
})
export class AIRoadmapGeneratorComponent {
  userProfile = {
    goal: '',
    level: '',
    timeCommitment: '',
    skills: ['JavaScript', 'HTML', 'CSS']
  };
  
  generatedRoadmap: LearningRoadmap | null = null;
  isGenerating = false;

  constructor(private roadmapService: AIRoadmapService) {}

  canGenerate(): boolean {
    return !!(this.userProfile.goal && this.userProfile.level && this.userProfile.timeCommitment);
  }

  async generateRoadmap() {
    this.isGenerating = true;
    
    try {
      this.generatedRoadmap = await this.roadmapService.generatePersonalizedRoadmap(this.userProfile);
    } catch (error) {
      console.error('Failed to generate roadmap:', error);
    } finally {
      this.isGenerating = false;
    }
  }

  startRoadmap() {
    // Navigate to full roadmap view or save to user profile
    console.log('Starting roadmap:', this.generatedRoadmap);
  }

  generateNew() {
    this.generatedRoadmap = null;
  }
}