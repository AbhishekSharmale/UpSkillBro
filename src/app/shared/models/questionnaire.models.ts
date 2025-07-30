export interface QuestionnaireResponse {
  userId: string;
  startedAt: string;
  completedAt?: string;
  currentStep: number;
  totalSteps: number;
  responses: { [key: string]: any };
  isCompleted: boolean;
  profileScore: number;
}

export interface Question {
  id: string;
  step: number;
  type: 'single_select' | 'multi_select' | 'scale' | 'text';
  category: string;
  title: string;
  description?: string;
  required: boolean;
  options?: QuestionOption[];
  validation?: ValidationRule;
  conditional?: ConditionalLogic;
}

export interface QuestionOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface ValidationRule {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
}

export interface ConditionalLogic {
  dependsOn: string;
  showIf: string | string[];
  hideIf?: string | string[];
}

export interface QuestionnaireStep {
  stepNumber: number;
  title: string;
  description: string;
  questions: Question[];
  isCompleted: boolean;
  canSkip: boolean;
}