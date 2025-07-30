import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Question, QuestionnaireResponse, QuestionnaireStep } from '../models/questionnaire.models';
import { FirebaseService } from './firebase.service';
import { GoogleAuthService } from './google-auth.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {
  private currentResponseSubject = new BehaviorSubject<QuestionnaireResponse | null>(null);
  private questionsSubject = new BehaviorSubject<Question[]>([]);
  
  currentResponse$ = this.currentResponseSubject.asObservable();
  questions$ = this.questionsSubject.asObservable();

  private questions: Question[] = [
    {
      id: 'domain',
      step: 1,
      type: 'single_select',
      category: 'Domain Selection',
      title: 'Which IT domain interests you most?',
      description: 'Select your primary area of interest',
      required: true,
      options: [
        { value: 'software_development', label: 'Software Development', icon: '💻' },
        { value: 'data_science', label: 'Data Science & Analytics', icon: '📊' },
        { value: 'cybersecurity', label: 'Cybersecurity', icon: '🔒' },
        { value: 'cloud_devops', label: 'Cloud & DevOps', icon: '☁️' },
        { value: 'ai_ml', label: 'AI & Machine Learning', icon: '🤖' },
        { value: 'product_management', label: 'Product Management', icon: '📋' }
      ]
    },
    {
      id: 'role',
      step: 2,
      type: 'single_select',
      category: 'Role Selection',
      title: 'What specific role are you targeting?',
      description: 'Choose your desired position',
      required: true,
      options: [], // Will be populated based on domain selection
      conditional: {
        dependsOn: 'domain',
        showIf: ['software_development', 'data_science', 'cybersecurity', 'cloud_devops', 'ai_ml', 'product_management']
      }
    },
    {
      id: 'current_situation',
      step: 3,
      type: 'single_select',
      category: 'Current Situation',
      title: 'What best describes your current situation?',
      required: true,
      options: [
        { value: 'student', label: 'Student/Recent Graduate' },
        { value: 'career_change', label: 'Career Change (from different field)' },
        { value: 'existing_role', label: 'Already working in this role (want to upskill)' },
        { value: 'different_tech_role', label: 'Working in different tech role (want to switch)' },
        { value: 'unemployed', label: 'Currently unemployed/seeking opportunities' }
      ]
    },
    {
      id: 'experience',
      step: 4,
      type: 'single_select',
      category: 'Experience Level',
      title: 'What is your current experience level in tech?',
      required: true,
      options: [
        { value: 'entry', label: '0-2 years (Entry Level)' },
        { value: 'junior', label: '2-4 years (Junior)' },
        { value: 'mid', label: '4-7 years (Mid-Level)' },
        { value: 'senior', label: '7-10 years (Senior)' },
        { value: 'lead', label: '10+ years (Lead/Principal)' }
      ]
    },
    {
      id: 'current_salary',
      step: 5,
      type: 'single_select',
      category: 'Current Compensation',
      title: 'What is your current salary range?',
      required: true,
      options: [
        { value: '0-3L', label: '₹0 - ₹3 Lakhs' },
        { value: '3L-6L', label: '₹3 - ₹6 Lakhs' },
        { value: '6L-12L', label: '₹6 - ₹12 Lakhs' },
        { value: '12L-25L', label: '₹12 - ₹25 Lakhs' },
        { value: '25L-50L', label: '₹25 - ₹50 Lakhs' },
        { value: '50L+', label: '₹50+ Lakhs' }
      ]
    },
    {
      id: 'target_salary',
      step: 6,
      type: 'single_select',
      category: 'Target Compensation',
      title: 'What is your target salary range?',
      required: true,
      options: [
        { value: '6L-12L', label: '₹6 - ₹12 Lakhs' },
        { value: '12L-25L', label: '₹12 - ₹25 Lakhs' },
        { value: '25L-50L', label: '₹25 - ₹50 Lakhs' },
        { value: '50L-1Cr', label: '₹50 Lakhs - ₹1 Crore' },
        { value: '1Cr+', label: '₹1+ Crore' }
      ]
    },
    {
      id: 'skills',
      step: 7,
      type: 'multi_select',
      category: 'Technical Skills',
      title: 'Which technologies do you currently know?',
      description: 'Select all that apply',
      required: true,
      options: [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'python', label: 'Python' },
        { value: 'java', label: 'Java' },
        { value: 'react', label: 'React' },
        { value: 'nodejs', label: 'Node.js' },
        { value: 'aws', label: 'AWS' },
        { value: 'docker', label: 'Docker' },
        { value: 'sql', label: 'SQL' }
      ]
    },
    {
      id: 'skill_level',
      step: 8,
      type: 'scale',
      category: 'Skill Assessment',
      title: 'Rate your overall technical skill level',
      description: '1 = Beginner, 10 = Expert',
      required: true,
      validation: { min: 1, max: 10 }
    },
    {
      id: 'timeline',
      step: 9,
      type: 'single_select',
      category: 'Timeline',
      title: 'When do you want to achieve your target role?',
      required: true,
      options: [
        { value: '3-months', label: '3 months' },
        { value: '6-months', label: '6 months' },
        { value: '1-year', label: '1 year' },
        { value: '2-years', label: '2 years' },
        { value: '3-years', label: '3+ years' }
      ]
    }
  ];

  constructor(
    private firebaseService: FirebaseService,
    private googleAuth: GoogleAuthService
  ) {
    this.questionsSubject.next(this.questions);
  }

  initializeQuestionnaire(): QuestionnaireResponse {
    const user = this.googleAuth.getCurrentUser();
    const response: QuestionnaireResponse = {
      userId: user?.uid || '',
      startedAt: new Date().toISOString(),
      currentStep: 1,
      totalSteps: 9,
      responses: {},
      isCompleted: false,
      profileScore: 0
    };
    
    this.currentResponseSubject.next(response);
    this.saveProgress(response);
    return response;
  }

  updateResponse(questionId: string, value: any): void {
    const current = this.currentResponseSubject.value;
    if (current) {
      current.responses[questionId] = value;
      
      // Update role options based on domain selection
      if (questionId === 'domain') {
        this.updateRoleOptions(value);
      }
      
      this.currentResponseSubject.next(current);
      this.saveProgress(current);
    }
  }

  nextStep(): boolean {
    const current = this.currentResponseSubject.value;
    if (current && current.currentStep < current.totalSteps) {
      current.currentStep++;
      this.currentResponseSubject.next(current);
      this.saveProgress(current);
      return true;
    }
    return false;
  }

  previousStep(): boolean {
    const current = this.currentResponseSubject.value;
    if (current && current.currentStep > 1) {
      current.currentStep--;
      this.currentResponseSubject.next(current);
      return true;
    }
    return false;
  }

  completeQuestionnaire(): Observable<any> {
    const current = this.currentResponseSubject.value;
    if (current) {
      current.isCompleted = true;
      current.completedAt = new Date().toISOString();
      current.profileScore = this.calculateProfileScore(current);
      
      this.currentResponseSubject.next(current);
      return this.firebaseService.saveAssessment(current);
    }
    throw new Error('No active questionnaire');
  }

  private updateRoleOptions(domain: string): void {
    const roleQuestion = this.questions.find(q => q.id === 'role');
    if (roleQuestion) {
      const roleOptions = this.getRolesByDomain(domain);
      roleQuestion.options = roleOptions;
      this.questionsSubject.next([...this.questions]);
    }
  }

  private getRolesByDomain(domain: string): any[] {
    const roleMap: { [key: string]: any[] } = {
      software_development: [
        { value: 'frontend', label: 'Frontend Developer' },
        { value: 'backend', label: 'Backend Developer' },
        { value: 'fullstack', label: 'Full Stack Developer' },
        { value: 'mobile', label: 'Mobile Developer' }
      ],
      data_science: [
        { value: 'data_scientist', label: 'Data Scientist' },
        { value: 'data_analyst', label: 'Data Analyst' },
        { value: 'ml_engineer', label: 'ML Engineer' }
      ],
      cybersecurity: [
        { value: 'security_analyst', label: 'Security Analyst' },
        { value: 'penetration_tester', label: 'Penetration Tester' },
        { value: 'security_architect', label: 'Security Architect' }
      ],
      cloud_devops: [
        { value: 'devops_engineer', label: 'DevOps Engineer' },
        { value: 'cloud_architect', label: 'Cloud Architect' },
        { value: 'sre', label: 'Site Reliability Engineer' }
      ],
      ai_ml: [
        { value: 'ai_engineer', label: 'AI Engineer' },
        { value: 'ml_researcher', label: 'ML Researcher' },
        { value: 'ai_product_manager', label: 'AI Product Manager' }
      ],
      product_management: [
        { value: 'product_manager', label: 'Product Manager' },
        { value: 'technical_pm', label: 'Technical Product Manager' },
        { value: 'product_owner', label: 'Product Owner' }
      ]
    };
    
    return roleMap[domain] || [];
  }

  private calculateProfileScore(response: QuestionnaireResponse): number {
    let score = 0;
    
    // Completion bonus (40 points)
    score += 40;
    
    // Experience level (20 points)
    const experience = response.responses['experience'];
    const expScores = { entry: 5, junior: 10, mid: 15, senior: 18, lead: 20 };
    score += expScores[experience as keyof typeof expScores] || 0;
    
    // Skills count (20 points)
    const skills = response.responses['skills'] || [];
    score += Math.min(20, skills.length * 2.5);
    
    // Skill level (20 points)
    const skillLevel = response.responses['skill_level'] || 0;
    score += skillLevel * 2;
    
    return Math.min(100, Math.round(score));
  }

  private saveProgress(response: QuestionnaireResponse): void {
    localStorage.setItem('questionnaire_progress', JSON.stringify(response));
  }

  loadProgress(): QuestionnaireResponse | null {
    const saved = localStorage.getItem('questionnaire_progress');
    if (saved) {
      const response = JSON.parse(saved);
      this.currentResponseSubject.next(response);
      return response;
    }
    return null;
  }

  getCurrentQuestion(): Question | null {
    const current = this.currentResponseSubject.value;
    const questions = this.questionsSubject.value;
    
    if (current) {
      return questions.find(q => q.step === current.currentStep) || null;
    }
    return null;
  }

  addDynamicQuestions(dynamicQuestions: Question[]): void {
    this.questions = [...this.questions, ...dynamicQuestions];
    this.questionsSubject.next(this.questions);
    
    // Update total steps
    const current = this.currentResponseSubject.value;
    if (current) {
      current.totalSteps = this.questions.length;
      this.currentResponseSubject.next(current);
    }
  }

  isStepValid(step: number): boolean {
    const current = this.currentResponseSubject.value;
    const question = this.questions.find(q => q.step === step);
    
    if (!current || !question) return false;
    
    const response = current.responses[question.id];
    
    if (question.required && (!response || response === '')) {
      return false;
    }
    
    if (question.type === 'multi_select' && question.required) {
      return Array.isArray(response) && response.length > 0;
    }
    
    return true;
  }
}