import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HuggingFaceService } from './huggingface.service';

export interface InterviewQuestion {
  id: string;
  type: 'technical' | 'behavioral' | 'system-design';
  question: string;
  expectedAnswer?: string;
  hints: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number; // in minutes
}

export interface InterviewSession {
  id: string;
  role: string;
  level: string;
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  answers: { [questionId: string]: string };
  startTime: Date;
  endTime?: Date;
  score?: number;
  feedback?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AIInterviewService {
  private currentSession = new BehaviorSubject<InterviewSession | null>(null);
  currentSession$ = this.currentSession.asObservable();

  constructor(private huggingFace: HuggingFaceService) {}

  async startInterviewSession(role: string, level: string): Promise<InterviewSession> {
    const questions = await this.generateQuestions(role, level);
    
    const session: InterviewSession = {
      id: 'session-' + Date.now(),
      role,
      level,
      questions,
      currentQuestionIndex: 0,
      answers: {},
      startTime: new Date()
    };

    this.currentSession.next(session);
    return session;
  }

  submitAnswer(questionId: string, answer: string): void {
    const session = this.currentSession.value;
    if (session) {
      session.answers[questionId] = answer;
      this.currentSession.next(session);
    }
  }

  nextQuestion(): boolean {
    const session = this.currentSession.value;
    if (session && session.currentQuestionIndex < session.questions.length - 1) {
      session.currentQuestionIndex++;
      this.currentSession.next(session);
      return true;
    }
    return false;
  }

  async completeSession(): Promise<InterviewSession> {
    const session = this.currentSession.value;
    if (session) {
      session.endTime = new Date();
      session.score = await this.calculateScore(session);
      session.feedback = await this.generateFeedback(session);
      this.currentSession.next(session);
    }
    return session!;
  }

  private async generateQuestions(role: string, level: string): Promise<InterviewQuestion[]> {
    // Mock questions for demo. In production, use HuggingFace API
    const mockQuestions: InterviewQuestion[] = [
      {
        id: 'q1',
        type: 'technical',
        question: 'Explain the difference between let, const, and var in JavaScript.',
        hints: ['Think about scope', 'Consider hoisting', 'Mutability matters'],
        difficulty: 'easy',
        timeLimit: 5
      },
      {
        id: 'q2',
        type: 'technical',
        question: 'How would you optimize a React component for performance?',
        hints: ['React.memo', 'useMemo and useCallback', 'Code splitting'],
        difficulty: 'medium',
        timeLimit: 8
      },
      {
        id: 'q3',
        type: 'behavioral',
        question: 'Tell me about a time you had to learn a new technology quickly.',
        hints: ['STAR method', 'Show learning process', 'Highlight results'],
        difficulty: 'medium',
        timeLimit: 10
      },
      {
        id: 'q4',
        type: 'system-design',
        question: 'Design a URL shortener like bit.ly',
        hints: ['Database design', 'Scalability', 'Caching strategy'],
        difficulty: 'hard',
        timeLimit: 15
      }
    ];

    return mockQuestions.slice(0, level === 'junior' ? 2 : 4);
  }

  private async calculateScore(session: InterviewSession): Promise<number> {
    // Simple scoring logic - in production, use AI for evaluation
    const answeredQuestions = Object.keys(session.answers).length;
    const totalQuestions = session.questions.length;
    const completionScore = (answeredQuestions / totalQuestions) * 100;
    
    // Add quality scoring based on answer length and keywords
    let qualityScore = 0;
    Object.values(session.answers).forEach(answer => {
      if (answer.length > 50) qualityScore += 20;
      if (answer.length > 200) qualityScore += 10;
    });

    return Math.min(Math.round((completionScore + qualityScore) / 2), 100);
  }

  private async generateFeedback(session: InterviewSession): Promise<string> {
    const score = session.score || 0;
    
    if (score >= 80) {
      return 'Excellent performance! You demonstrated strong technical knowledge and communication skills.';
    } else if (score >= 60) {
      return 'Good job! Focus on providing more detailed examples and technical depth in your answers.';
    } else {
      return 'Keep practicing! Work on technical fundamentals and structure your answers using the STAR method.';
    }
  }
}