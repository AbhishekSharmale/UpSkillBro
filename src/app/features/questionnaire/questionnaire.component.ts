import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { QuestionnaireService } from '../../shared/services/questionnaire.service';
import { DynamicQuestionService } from '../../shared/services/dynamic-question.service';
import { Question, QuestionnaireResponse } from '../../shared/models/questionnaire.models';

@Component({
  selector: 'app-questionnaire',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="questionnaire">
      <div class="container">
        <div class="progress-header">
          <div class="progress-info">
            <h1>🎯 Career Assessment</h1>
            <p>Help us create your personalized roadmap</p>
          </div>
          
          <div class="progress-bar-container">
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="progressPercentage"></div>
            </div>
            <span class="progress-text">Step {{currentStep}} of {{totalSteps}}</span>
          </div>
        </div>

        <div class="question-card" *ngIf="currentQuestion">
          <div class="question-header">
            <div class="question-category">{{currentQuestion.category}}</div>
            <h2>{{currentQuestion.title}}</h2>
            <p *ngIf="currentQuestion.description" class="question-description">
              {{currentQuestion.description}}
            </p>
          </div>

          <form [formGroup]="questionForm" class="question-form">
            <div *ngIf="currentQuestion.type === 'single_select'" class="single-select-options">
              <div *ngFor="let option of currentQuestion.options" 
                   class="option-card"
                   [class.selected]="questionForm.get('answer')?.value === option.value"
                   (click)="selectOption(option.value)">
                <div class="option-icon" *ngIf="option.icon">{{option.icon}}</div>
                <div class="option-content">
                  <div class="option-label">{{option.label}}</div>
                  <div class="option-description" *ngIf="option.description">
                    {{option.description}}
                  </div>
                </div>
                <div class="option-check">
                  <div class="check-circle" [class.checked]="questionForm.get('answer')?.value === option.value">
                    ✓
                  </div>
                </div>
              </div>
            </div>

            <div *ngIf="currentQuestion.type === 'multi_select'" class="multi-select-options">
              <div *ngFor="let option of currentQuestion.options" 
                   class="option-card multi"
                   [class.selected]="isOptionSelected(option.value)"
                   (click)="toggleMultiOption(option.value)">
                <div class="option-content">
                  <div class="option-label">{{option.label}}</div>
                </div>
                <div class="option-check">
                  <div class="check-circle" [class.checked]="isOptionSelected(option.value)">
                    ✓
                  </div>
                </div>
              </div>
            </div>

            <div *ngIf="currentQuestion.type === 'scale'" class="scale-input">
              <div class="scale-container">
                <input type="range" 
                       formControlName="answer"
                       [min]="currentQuestion.validation?.min || 1"
                       [max]="currentQuestion.validation?.max || 10"
                       class="scale-slider">
                <div class="scale-labels">
                  <span>Beginner</span>
                  <span class="scale-value">{{questionForm.get('answer')?.value || 5}}</span>
                  <span>Expert</span>
                </div>
              </div>
            </div>

            <div *ngIf="currentQuestion.type === 'text'" class="text-input">
              <textarea formControlName="answer" 
                        [placeholder]="'Enter your ' + currentQuestion.category.toLowerCase()"
                        class="text-area"></textarea>
            </div>
          </form>
        </div>

        <div class="navigation-buttons">
          <button class="btn-secondary" 
                  (click)="previousStep()" 
                  [disabled]="currentStep === 1">
            ← Previous
          </button>
          
          <div class="nav-center">
            <button class="btn-outline" (click)="saveAndExit()">
              💾 Save & Exit
            </button>
          </div>
          
          <button class="btn-primary" 
                  (click)="nextStep()"
                  [disabled]="!isCurrentStepValid()">
            {{isLastStep ? '🚀 Generate Roadmap' : 'Next →'}}
          </button>
        </div>

        <div *ngIf="isGenerating" class="generating-overlay">
          <div class="generating-content">
            <div class="spinner"></div>
            <h3>🤖 Creating Your Personalized Roadmap</h3>
            <p>Our AI is analyzing your responses and building your career path...</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./questionnaire.component.scss']
})
export class QuestionnaireComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  questionForm: FormGroup;
  currentQuestion: Question | null = null;
  currentResponse: QuestionnaireResponse | null = null;
  isGenerating = false;

  constructor(
    private fb: FormBuilder,
    private questionnaireService: QuestionnaireService,
    private dynamicQuestionService: DynamicQuestionService,
    private router: Router
  ) {
    this.questionForm = this.fb.group({
      answer: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Check if assessment is already completed (but allow guests to retake)
    const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}');
    const assessmentCompleted = localStorage.getItem('assessment_completed');
    
    if (assessmentCompleted === 'true' && !currentUser.isGuest) {
      // Redirect registered users to dashboard if already completed
      this.router.navigate(['/dashboard']);
      return;
    }
    
    // Clear previous guest data if starting fresh
    if (currentUser.isGuest) {
      localStorage.removeItem('assessment_completed');
      localStorage.removeItem('assessment_data');
      localStorage.removeItem('roadmap_data');
    }
    
    const savedProgress = this.questionnaireService.loadProgress();
    
    if (!savedProgress) {
      this.currentResponse = this.questionnaireService.initializeQuestionnaire();
    }

    this.questionnaireService.currentResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.currentResponse = response;
        this.loadCurrentQuestion();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get currentStep(): number {
    return this.currentResponse?.currentStep || 1;
  }

  get totalSteps(): number {
    return this.currentResponse?.totalSteps || 8;
  }

  get progressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  get isLastStep(): boolean {
    return this.currentStep === this.totalSteps;
  }

  private loadCurrentQuestion() {
    this.currentQuestion = this.questionnaireService.getCurrentQuestion();
    
    if (this.currentQuestion && this.currentResponse) {
      const existingAnswer = this.currentResponse.responses[this.currentQuestion.id];
      
      if (existingAnswer !== undefined) {
        this.questionForm.patchValue({ answer: existingAnswer });
      } else {
        if (this.currentQuestion.type === 'scale') {
          this.questionForm.patchValue({ answer: 5 });
        } else if (this.currentQuestion.type === 'multi_select') {
          this.questionForm.patchValue({ answer: [] });
        } else {
          this.questionForm.patchValue({ answer: '' });
        }
      }
    }
  }

  selectOption(value: string) {
    this.questionForm.patchValue({ answer: value });
    this.updateResponse();
  }

  toggleMultiOption(value: string) {
    const currentAnswers = this.questionForm.get('answer')?.value || [];
    const index = currentAnswers.indexOf(value);
    
    if (index > -1) {
      currentAnswers.splice(index, 1);
    } else {
      currentAnswers.push(value);
    }
    
    this.questionForm.patchValue({ answer: [...currentAnswers] });
    this.updateResponse();
  }

  isOptionSelected(value: string): boolean {
    const currentAnswers = this.questionForm.get('answer')?.value || [];
    return currentAnswers.includes(value);
  }

  private updateResponse() {
    if (this.currentQuestion) {
      const answer = this.questionForm.get('answer')?.value;
      this.questionnaireService.updateResponse(this.currentQuestion.id, answer);
    }
  }

  nextStep() {
    this.updateResponse();
    
    if (this.isLastStep) {
      this.completeQuestionnaire();
    } else {
      this.questionnaireService.nextStep();
    }
  }

  previousStep() {
    this.questionnaireService.previousStep();
  }

  async completeQuestionnaire() {
    this.isGenerating = true;
    
    try {
      // Complete questionnaire and generate roadmap data
      await this.questionnaireService.completeQuestionnaire().toPromise();
      
      // Generate roadmap data for visual component
      const roadmapData = this.generateRoadmapData();
      localStorage.setItem('roadmap_data', JSON.stringify(roadmapData));
      localStorage.setItem('assessment_completed', 'true');
      
      // Check if user is guest
      const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}');
      if (currentUser.isGuest) {
        // For guests, show a prompt to sign up after seeing roadmap
        localStorage.setItem('show_signup_prompt', 'true');
      }
      
      this.router.navigate(['/roadmap']);
    } catch (error) {
      console.error('Error completing questionnaire:', error);
      // Still generate roadmap with available data
      const roadmapData = this.generateRoadmapData();
      localStorage.setItem('roadmap_data', JSON.stringify(roadmapData));
      localStorage.setItem('assessment_completed', 'true');
      this.router.navigate(['/roadmap']);
    }
  }

  private generateRoadmapData(): any {
    if (!this.currentResponse) return null;
    
    const responses = this.currentResponse.responses;
    const role = responses['role'] || 'Full Stack Developer';
    const currentSalary = responses['current_salary'] || '₹6L';
    const targetSalary = responses['target_salary'] || '₹12L';
    const currentSituation = responses['current_situation'] || 'student';
    const timeline = responses['timeline'] || '1 year';
    const skills = responses['skills'] || [];
    
    return {
      title: `${role} Career Roadmap`,
      currentSalary: currentSalary,
      targetSalary: targetSalary,
      timeline: timeline,
      milestones: this.generateMilestones(role, skills, timeline, currentSituation)
    };
  }

  private generateMilestones(role: string, skills: string[], timeline: string, currentSituation: string): any[] {
    // Adjust milestones based on current situation
    if (currentSituation === 'existing_role') {
      return this.generateUpskillMilestones(role, skills, timeline);
    }
    
    // Default milestones for career starters/changers
    const baseMilestones = [
      {
        id: 1,
        title: 'Foundation Building',
        duration: '2-3 months',
        salaryImpact: '+15%',
        skills: this.getFoundationSkills(role),
        tasks: [
          'Master core technologies',
          'Build portfolio projects',
          'Set up professional profiles'
        ],
        resources: ['Documentation', 'Online courses', 'Practice projects']
      },
      {
        id: 2,
        title: 'Skill Enhancement',
        duration: '3-4 months',
        salaryImpact: '+25%',
        skills: this.getIntermediateSkills(role),
        tasks: [
          'Advanced concept mastery',
          'Open source contributions',
          'Professional networking'
        ],
        resources: ['Advanced courses', 'Mentorship', 'Community involvement']
      },
      {
        id: 3,
        title: 'Career Advancement',
        duration: '4-6 months',
        salaryImpact: '+40%',
        skills: this.getAdvancedSkills(role),
        tasks: [
          'Lead development projects',
          'Develop leadership skills',
          'Prepare for senior roles'
        ],
        resources: ['Leadership training', 'Certifications', 'Speaking opportunities']
      }
    ];
    
    return baseMilestones;
  }

  private getFoundationSkills(role: string): string[] {
    const skillMap: { [key: string]: string[] } = {
      'frontend': ['HTML/CSS', 'JavaScript', 'React'],
      'backend': ['Node.js', 'Databases', 'APIs'],
      'fullstack': ['Frontend Basics', 'Backend Basics', 'Database Design'],
      'devops_engineer': ['Linux', 'Docker', 'CI/CD'],
      'data_scientist': ['Python', 'Statistics', 'SQL']
    };
    return skillMap[role] || skillMap['fullstack'];
  }

  private getIntermediateSkills(role: string): string[] {
    const skillMap: { [key: string]: string[] } = {
      'frontend': ['TypeScript', 'State Management', 'Testing'],
      'backend': ['System Design', 'Security', 'Performance'],
      'fullstack': ['Full Stack Frameworks', 'Cloud Services', 'DevOps'],
      'devops_engineer': ['Kubernetes', 'Monitoring', 'Infrastructure as Code'],
      'data_scientist': ['Machine Learning', 'Data Visualization', 'Big Data']
    };
    return skillMap[role] || skillMap['fullstack'];
  }

  private getAdvancedSkills(role: string): string[] {
    const skillMap: { [key: string]: string[] } = {
      'frontend': ['Performance Optimization', 'Architecture', 'Team Leadership'],
      'backend': ['Microservices', 'Scalability', 'Technical Leadership'],
      'fullstack': ['System Architecture', 'Performance', 'Team Management'],
      'devops_engineer': ['Platform Engineering', 'SRE', 'Cloud Architecture'],
      'data_scientist': ['MLOps', 'Research', 'Data Strategy']
    };
    return skillMap[role] || skillMap['fullstack'];
  }

  private generateUpskillMilestones(role: string, skills: string[], timeline: string): any[] {
    const upskillMilestones = [
      {
        id: 1,
        title: 'Advanced Skills Mastery',
        duration: '2-3 months',
        salaryImpact: '+20%',
        skills: this.getAdvancedSkills(role),
        tasks: [
          'Master advanced concepts in your current role',
          'Learn industry best practices',
          'Implement advanced patterns in projects'
        ],
        resources: ['Advanced courses', 'Industry blogs', 'Expert mentorship']
      },
      {
        id: 2,
        title: 'Leadership & Architecture',
        duration: '3-4 months',
        salaryImpact: '+35%',
        skills: ['System Design', 'Team Leadership', 'Code Review', 'Mentoring'],
        tasks: [
          'Lead technical decisions',
          'Mentor junior developers',
          'Design scalable systems',
          'Conduct code reviews'
        ],
        resources: ['Leadership training', 'System design courses', 'Architecture patterns']
      },
      {
        id: 3,
        title: 'Senior/Principal Level',
        duration: '4-6 months',
        salaryImpact: '+50%',
        skills: ['Strategic Planning', 'Cross-team Collaboration', 'Technical Vision'],
        tasks: [
          'Drive technical strategy',
          'Influence product decisions',
          'Build technical roadmaps',
          'Represent team in leadership meetings'
        ],
        resources: ['Executive training', 'Industry conferences', 'Thought leadership']
      }
    ];
    
    return upskillMilestones;
  }

  private async generateDynamicQuestions() {
    if (!this.currentResponse) return;
    
    this.isGenerating = true;
    
    try {
      // Generate AI-powered follow-up questions
      const dynamicQuestions = await this.dynamicQuestionService.generateDynamicQuestions(this.currentResponse);
      
      // Add dynamic questions to the questionnaire
      this.questionnaireService.addDynamicQuestions(dynamicQuestions);
      
      // Continue to next step (first dynamic question)
      this.questionnaireService.nextStep();
      
    } catch (error) {
      console.error('Error generating dynamic questions:', error);
      // Skip dynamic questions and complete
      await this.questionnaireService.completeQuestionnaire().toPromise();
      localStorage.setItem('assessment_completed', 'true');
      this.router.navigate(['/roadmap']);
    } finally {
      this.isGenerating = false;
    }
  }

  saveAndExit() {
    this.updateResponse();
    this.router.navigate(['/dashboard']);
  }

  isCurrentStepValid(): boolean {
    if (!this.currentQuestion) return false;
    
    const answer = this.questionForm.get('answer')?.value;
    
    if (this.currentQuestion.required) {
      if (this.currentQuestion.type === 'multi_select') {
        return Array.isArray(answer) && answer.length > 0;
      }
      return answer !== '' && answer !== null && answer !== undefined;
    }
    
    return true;
  }
}