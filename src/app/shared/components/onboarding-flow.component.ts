import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-onboarding-flow',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="onboarding-overlay" *ngIf="showOnboarding">
      <div class="onboarding-modal">
        <div class="progress-bar">
          <div class="progress-fill" [style.width.%]="(currentStep / totalSteps) * 100"></div>
        </div>
        
        <div class="step-content">
          <div class="step" *ngIf="currentStep === 1">
            <div class="step-icon">👋</div>
            <h2>Welcome to UpskillBro!</h2>
            <p>Let's personalize your learning journey in just a few steps.</p>
          </div>
          
          <div class="step" *ngIf="currentStep === 2">
            <div class="step-icon">🎯</div>
            <h2>What's your main goal?</h2>
            <div class="options-grid">
              <div class="option-card" 
                   *ngFor="let goal of goals" 
                   [class.selected]="selectedGoal === goal.id"
                   (click)="selectedGoal = goal.id">
                <div class="option-icon">{{goal.icon}}</div>
                <span>{{goal.label}}</span>
              </div>
            </div>
          </div>
          
          <div class="step" *ngIf="currentStep === 3">
            <div class="step-icon">💼</div>
            <h2>Current experience level?</h2>
            <div class="options-grid">
              <div class="option-card" 
                   *ngFor="let level of experienceLevels" 
                   [class.selected]="selectedLevel === level.id"
                   (click)="selectedLevel = level.id">
                <div class="option-icon">{{level.icon}}</div>
                <span>{{level.label}}</span>
              </div>
            </div>
          </div>
          
          <div class="step" *ngIf="currentStep === 4">
            <div class="step-icon">⏰</div>
            <h2>How much time can you dedicate daily?</h2>
            <div class="options-grid">
              <div class="option-card" 
                   *ngFor="let time of timeCommitments" 
                   [class.selected]="selectedTime === time.id"
                   (click)="selectedTime = time.id">
                <div class="option-icon">{{time.icon}}</div>
                <span>{{time.label}}</span>
              </div>
            </div>
          </div>
          
          <div class="step" *ngIf="currentStep === 5">
            <div class="step-icon">🚀</div>
            <h2>You're all set!</h2>
            <p>We've created a personalized learning path just for you. Ready to start your journey?</p>
            <div class="preview-stats">
              <div class="stat">
                <span class="stat-value">{{estimatedWeeks}}</span>
                <span class="stat-label">weeks to goal</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{recommendedSkills}}</span>
                <span class="stat-label">skills to learn</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="step-actions">
          <button class="btn-secondary" 
                  *ngIf="currentStep > 1" 
                  (click)="previousStep()">
            Back
          </button>
          <button class="btn-primary" 
                  (click)="nextStep()"
                  [disabled]="!canProceed()">
            {{currentStep === totalSteps ? 'Start Learning!' : 'Next'}}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .onboarding-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .onboarding-modal {
      background: var(--background-white);
      border-radius: 20px;
      padding: 2rem;
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    }

    .progress-bar {
      height: 4px;
      background: var(--border-color);
      border-radius: 2px;
      margin-bottom: 2rem;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: var(--primary-gradient);
      transition: width 0.3s ease;
    }

    .step {
      text-align: center;
      min-height: 300px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .step-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .step h2 {
      color: var(--black-text);
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }

    .step p {
      color: var(--secondary-gray);
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .options-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .option-card {
      padding: 1.5rem 1rem;
      border: 2px solid var(--border-color);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
    }

    .option-card:hover {
      border-color: var(--primary-blue);
      transform: translateY(-2px);
    }

    .option-card.selected {
      border-color: var(--primary-blue);
      background: rgba(0, 56, 255, 0.05);
    }

    .option-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .preview-stats {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-top: 2rem;
    }

    .stat {
      text-align: center;
    }

    .stat-value {
      display: block;
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary-blue);
    }

    .stat-label {
      font-size: 0.8rem;
      color: var(--secondary-gray);
    }

    .step-actions {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      margin-top: 2rem;
    }

    .btn-primary, .btn-secondary {
      flex: 1;
      padding: 1rem;
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

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: transparent;
      color: var(--primary-blue);
      border: 2px solid var(--primary-blue);
    }
  `]
})
export class OnboardingFlowComponent {
  @Output() completed = new EventEmitter<any>();
  
  showOnboarding = true;
  currentStep = 1;
  totalSteps = 5;
  
  selectedGoal = '';
  selectedLevel = '';
  selectedTime = '';
  
  goals = [
    { id: 'job', icon: '💼', label: 'Get a Job' },
    { id: 'promotion', icon: '📈', label: 'Get Promoted' },
    { id: 'skills', icon: '🛠️', label: 'Learn New Skills' },
    { id: 'freelance', icon: '💻', label: 'Start Freelancing' }
  ];
  
  experienceLevels = [
    { id: 'beginner', icon: '🌱', label: 'Beginner' },
    { id: 'intermediate', icon: '🌿', label: 'Intermediate' },
    { id: 'advanced', icon: '🌳', label: 'Advanced' }
  ];
  
  timeCommitments = [
    { id: '30min', icon: '⏱️', label: '30 min/day' },
    { id: '1hour', icon: '🕐', label: '1 hour/day' },
    { id: '2hours', icon: '🕑', label: '2+ hours/day' }
  ];
  
  get estimatedWeeks(): number {
    const timeMultiplier = { '30min': 16, '1hour': 12, '2hours': 8 };
    return timeMultiplier[this.selectedTime as keyof typeof timeMultiplier] || 12;
  }
  
  get recommendedSkills(): number {
    const goalSkills = { 'job': 8, 'promotion': 5, 'skills': 6, 'freelance': 7 };
    return goalSkills[this.selectedGoal as keyof typeof goalSkills] || 6;
  }
  
  canProceed(): boolean {
    switch (this.currentStep) {
      case 1: return true;
      case 2: return !!this.selectedGoal;
      case 3: return !!this.selectedLevel;
      case 4: return !!this.selectedTime;
      case 5: return true;
      default: return false;
    }
  }
  
  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    } else {
      this.completeOnboarding();
    }
  }
  
  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  
  completeOnboarding() {
    const userData = {
      goal: this.selectedGoal,
      level: this.selectedLevel,
      timeCommitment: this.selectedTime
    };
    this.completed.emit(userData);
    this.showOnboarding = false;
  }
}