import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GamificationService } from '../../shared/services/gamification.service';
import { FirebaseService } from '../../shared/services/firebase.service';
import { GoogleAuthService } from '../../shared/services/google-auth.service';
import { HuggingFaceService } from '../../shared/services/huggingface.service';

interface Question {
  id: number;
  type: 'multiple-choice' | 'slider' | 'checkbox';
  category: string;
  question: string;
  options?: string[];
  min?: number;
  max?: number;
  value?: any;
}

@Component({
  selector: 'app-assessment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="assessment">
      <div class="container">
        <div class="assessment-header">
          <h1>Skills Assessment</h1>
          <p>Help us understand your current skills and career goals</p>
          
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="progressPercentage"></div>
          </div>
          <span class="progress-text">{{currentStep + 1}} of {{questions.length}}</span>
        </div>

        <div class="question-card" *ngIf="currentQuestion">
          <div class="question-category">{{currentQuestion.category}}</div>
          <h2>{{currentQuestion.question}}</h2>
          
          <!-- Multiple Choice -->
          <div *ngIf="currentQuestion.type === 'multiple-choice'" class="options">
            <label *ngFor="let option of currentQuestion.options" class="option">
              <input type="radio" 
                     [name]="'question-' + currentQuestion.id" 
                     [value]="option"
                     [(ngModel)]="currentQuestion.value">
              <span>{{option}}</span>
            </label>
          </div>
          
          <!-- Slider -->
          <div *ngIf="currentQuestion.type === 'slider'" class="slider-container">
            <input type="range" 
                   [min]="currentQuestion.min" 
                   [max]="currentQuestion.max"
                   [(ngModel)]="currentQuestion.value"
                   class="slider">
            <div class="slider-labels">
              <span>Beginner</span>
              <span>Expert</span>
            </div>
            <div class="slider-value">Level: {{currentQuestion.value}}/{{currentQuestion.max}}</div>
          </div>
          
          <!-- Checkbox -->
          <div *ngIf="currentQuestion.type === 'checkbox'" class="checkbox-options">
            <label *ngFor="let option of currentQuestion.options" class="checkbox-option">
              <input type="checkbox" 
                     [value]="option"
                     (change)="onCheckboxChange($event, option)">
              <span>{{option}}</span>
            </label>
          </div>
        </div>

        <div class="navigation-buttons">
          <button class="btn-secondary" 
                  (click)="previousQuestion()" 
                  [disabled]="currentStep === 0">
            Previous
          </button>
          
          <button class="btn-primary" 
                  (click)="nextQuestion()"
                  [disabled]="!isCurrentQuestionAnswered()">
            {{currentStep === questions.length - 1 ? 'Complete Assessment' : 'Next'}}
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./assessment.component.scss']
})
export class AssessmentComponent implements OnInit {
  currentStep = 0;
  
  constructor(
    private router: Router,
    private gamificationService: GamificationService,
    private firebaseService: FirebaseService,
    private googleAuth: GoogleAuthService
  ) {}
  questions: Question[] = [
    {
      id: 1,
      type: 'multiple-choice',
      category: 'Experience Level',
      question: 'What best describes your current programming experience?',
      options: ['Complete Beginner', 'Some Experience (< 1 year)', 'Junior Developer (1-2 years)', 'Mid-level Developer (3-5 years)', 'Senior Developer (5+ years)']
    },
    {
      id: 2,
      type: 'checkbox',
      category: 'Technical Skills',
      question: 'Which programming languages are you familiar with?',
      options: ['JavaScript', 'Python', 'Java', 'C#', 'Go', 'Rust', 'TypeScript', 'PHP', 'Ruby', 'Swift'],
      value: []
    },
    {
      id: 3,
      type: 'slider',
      category: 'Frontend Skills',
      question: 'Rate your frontend development skills',
      min: 1,
      max: 10,
      value: 5
    },
    {
      id: 4,
      type: 'slider',
      category: 'Backend Skills',
      question: 'Rate your backend development skills',
      min: 1,
      max: 10,
      value: 5
    },
    {
      id: 5,
      type: 'multiple-choice',
      category: 'Career Goals',
      question: 'What is your primary career goal?',
      options: ['Get my first developer job', 'Switch to a new technology stack', 'Advance to senior level', 'Become a tech lead', 'Start my own company']
    },
    {
      id: 6,
      type: 'multiple-choice',
      category: 'Learning Preference',
      question: 'How do you prefer to learn?',
      options: ['Video tutorials', 'Reading documentation', 'Hands-on projects', 'Interactive coding', 'Mentorship/guidance']
    },
    {
      id: 7,
      type: 'multiple-choice',
      category: 'Time Commitment',
      question: 'How much time can you dedicate to learning per week?',
      options: ['1-3 hours', '4-7 hours', '8-15 hours', '16-25 hours', '25+ hours']
    }
  ];

  ngOnInit() {
    // Initialize checkbox values
    this.questions.forEach(q => {
      if (q.type === 'checkbox' && !q.value) {
        q.value = [];
      }
    });
  }

  get currentQuestion() {
    return this.questions[this.currentStep];
  }

  get progressPercentage() {
    return ((this.currentStep + 1) / this.questions.length) * 100;
  }

  onCheckboxChange(event: any, option: string) {
    const question = this.currentQuestion;
    if (event.target.checked) {
      question.value.push(option);
    } else {
      const index = question.value.indexOf(option);
      if (index > -1) {
        question.value.splice(index, 1);
      }
    }
  }

  isCurrentQuestionAnswered(): boolean {
    const question = this.currentQuestion;
    if (question.type === 'checkbox') {
      return question.value && question.value.length > 0;
    }
    return question.value !== undefined && question.value !== null && question.value !== '';
  }

  nextQuestion() {
    if (this.currentStep < this.questions.length - 1) {
      this.currentStep++;
    } else {
      this.completeAssessment();
    }
  }

  previousQuestion() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  completeAssessment() {
    const currentUser = this.googleAuth.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Calculate profile score
    const profileScore = this.calculateProfileScore();
    
    // Prepare assessment data
    const assessmentData = {
      userId: currentUser.uid,
      userEmail: currentUser.email,
      userName: currentUser.name,
      photoURL: currentUser.photoURL,
      questions: this.questions,
      profileScore: profileScore,
      completedAt: new Date().toISOString(),
      role: this.getSelectedRole(),
      experience: this.getSelectedExperience(),
      skills: this.getSelectedSkills(),
      careerGoal: this.getSelectedCareerGoal(),
      learningPreference: this.getSelectedLearningPreference(),
      timeCommitment: this.getSelectedTimeCommitment(),
      frontendSkills: this.getFrontendSkillLevel(),
      backendSkills: this.getBackendSkillLevel()
    };

    // Save to Firebase
    this.firebaseService.saveAssessment(assessmentData).subscribe({
      next: (response) => {
        console.log('Assessment saved successfully:', response);
        
        // Save locally as backup
        localStorage.setItem('assessment_completed', 'true');
        localStorage.setItem('assessment_results', JSON.stringify(assessmentData));
        
        // Award XP and unlock achievement
        this.gamificationService.addXP(200);
        this.gamificationService.unlockAchievement('2');
        
        // Navigate to dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error saving assessment:', error);
        // Still save locally and continue
        localStorage.setItem('assessment_completed', 'true');
        localStorage.setItem('assessment_results', JSON.stringify(assessmentData));
        this.router.navigate(['/dashboard']);
      }
    });
  }

  private calculateProfileScore(): number {
    let score = 0;
    
    // Profile completeness (40 points)
    score += 40; // Assessment completed
    
    // Skills assessment (30 points)
    const frontendLevel = this.getFrontendSkillLevel();
    const backendLevel = this.getBackendSkillLevel();
    const skillsCount = this.getSelectedSkills().length;
    
    score += Math.min(15, (frontendLevel + backendLevel) * 1.5);
    score += Math.min(15, skillsCount * 2);
    
    // Activity and engagement (30 points)
    score += 20; // Recent assessment completion
    score += 10; // Platform engagement
    
    return Math.min(100, Math.round(score));
  }

  private getSelectedRole(): string {
    return this.questions.find(q => q.category === 'Experience Level')?.value || '';
  }

  private getSelectedExperience(): string {
    return this.questions.find(q => q.category === 'Experience Level')?.value || '';
  }

  private getSelectedSkills(): string[] {
    return this.questions.find(q => q.category === 'Technical Skills')?.value || [];
  }

  private getSelectedCareerGoal(): string {
    return this.questions.find(q => q.category === 'Career Goals')?.value || '';
  }

  private getSelectedLearningPreference(): string {
    return this.questions.find(q => q.category === 'Learning Preference')?.value || '';
  }

  private getSelectedTimeCommitment(): string {
    return this.questions.find(q => q.category === 'Time Commitment')?.value || '';
  }

  private getFrontendSkillLevel(): number {
    return this.questions.find(q => q.category === 'Frontend Skills')?.value || 5;
  }

  private getBackendSkillLevel(): number {
    return this.questions.find(q => q.category === 'Backend Skills')?.value || 5;
  }
}