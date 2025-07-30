import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  selector: 'app-career-assessment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="assessment">
      <div class="container">
        <div class="assessment-header">
          <h1>🎯 Career Assessment</h1>
          <p>Tell us about your current situation and career goals</p>
          
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
            {{currentStep === questions.length - 1 ? 'Generate Roadmap' : 'Next'}}
          </button>
        </div>

        <div *ngIf="isGenerating" class="generating-roadmap">
          <div class="spinner"></div>
          <p>🤖 AI is creating your personalized roadmap...</p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./assessment.component.scss']
})
export class CareerAssessmentComponent implements OnInit {
  currentStep = 0;
  isGenerating = false;
  
  questions: Question[] = [
    {
      id: 1,
      type: 'multiple-choice',
      category: 'Current Role',
      question: 'What is your current role?',
      options: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Mobile Developer', 'Data Scientist', 'Student/Beginner']
    },
    {
      id: 2,
      type: 'multiple-choice',
      category: 'Experience',
      question: 'How many years of experience do you have?',
      options: ['0-1 years', '1-3 years', '3-5 years', '5-8 years', '8+ years']
    },
    {
      id: 3,
      type: 'multiple-choice',
      category: 'Current Salary',
      question: 'What is your current salary range?',
      options: ['$0-30k', '$30k-50k', '$50k-70k', '$70k-100k', '$100k-150k', '$150k+']
    },
    {
      id: 4,
      type: 'multiple-choice',
      category: 'Target Salary',
      question: 'What is your target salary range?',
      options: ['$50k-70k', '$70k-100k', '$100k-150k', '$150k-200k', '$200k+']
    },
    {
      id: 5,
      type: 'checkbox',
      category: 'Skills',
      question: 'Which technologies do you currently know?',
      options: ['JavaScript', 'Python', 'React', 'Node.js', 'Java', 'C#', 'AWS', 'Docker', 'TypeScript', 'SQL'],
      value: []
    },
    {
      id: 6,
      type: 'slider',
      category: 'Skill Level',
      question: 'Rate your overall technical skill level (1-10)',
      min: 1,
      max: 10,
      value: 5
    },
    {
      id: 7,
      type: 'multiple-choice',
      category: 'Timeline',
      question: 'In how much time do you want to achieve your target salary?',
      options: ['6 months', '1 year', '2 years', '3+ years']
    }
  ];

  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private googleAuth: GoogleAuthService,
    private huggingFace: HuggingFaceService
  ) {}

  ngOnInit() {
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
      this.generateRoadmap();
    }
  }

  previousQuestion() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  async generateRoadmap() {
    const currentUser = this.googleAuth.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.isGenerating = true;

    // Prepare assessment data
    const assessmentData = {
      userId: currentUser.uid,
      userEmail: currentUser.email,
      userName: currentUser.name,
      currentRole: this.getAnswer('Current Role'),
      experience: this.getAnswer('Experience'),
      currentSalary: this.getAnswer('Current Salary'),
      targetSalary: this.getAnswer('Target Salary'),
      skills: this.getAnswer('Skills'),
      skillLevel: this.getAnswer('Skill Level'),
      timeline: this.getAnswer('Timeline'),
      completedAt: new Date().toISOString()
    };

    try {
      // Generate roadmap using AI
      const roadmap = this.huggingFace.generateOfflineRoadmap(assessmentData);
      
      // Save to Firebase
      const saveData = {
        ...assessmentData,
        roadmap: roadmap
      };

      await this.firebaseService.saveAssessment(saveData).toPromise();
      
      // Save locally
      localStorage.setItem('assessment_completed', 'true');
      localStorage.setItem('assessment_data', JSON.stringify(saveData));
      localStorage.setItem('roadmap_data', JSON.stringify(roadmap));
      
      // Navigate to roadmap
      this.router.navigate(['/roadmap']);
      
    } catch (error) {
      console.error('Error generating roadmap:', error);
      // Still save locally and continue
      localStorage.setItem('assessment_completed', 'true');
      localStorage.setItem('assessment_data', JSON.stringify(assessmentData));
      this.router.navigate(['/roadmap']);
    }
  }

  private getAnswer(category: string): any {
    const question = this.questions.find(q => q.category === category);
    return question?.value;
  }
}