import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HuggingFaceService } from './huggingface.service';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  estimatedWeeks: number;
  skills: string[];
  resources: Resource[];
  completed: boolean;
  progress: number;
}

export interface Resource {
  type: 'video' | 'article' | 'course' | 'project';
  title: string;
  url: string;
  duration?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface LearningRoadmap {
  id: string;
  title: string;
  description: string;
  totalWeeks: number;
  milestones: Milestone[];
  skillsToLearn: string[];
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AIRoadmapService {
  private currentRoadmap = new BehaviorSubject<LearningRoadmap | null>(null);
  currentRoadmap$ = this.currentRoadmap.asObservable();

  constructor(private huggingFace: HuggingFaceService) {}

  async generatePersonalizedRoadmap(userProfile: any): Promise<LearningRoadmap> {
    // For demo, return mock data. In production, use HuggingFace API
    const mockRoadmap: LearningRoadmap = {
      id: 'roadmap-' + Date.now(),
      title: `${userProfile.goal} Learning Path`,
      description: `Personalized roadmap for ${userProfile.level} developer`,
      totalWeeks: this.calculateTotalWeeks(userProfile.timeCommitment),
      skillsToLearn: this.getRecommendedSkills(userProfile),
      createdAt: new Date(),
      milestones: [
        {
          id: 'milestone-1',
          title: 'Foundation Setup',
          description: 'Set up development environment and learn basics',
          estimatedWeeks: 2,
          skills: ['Git', 'VS Code', 'Terminal'],
          resources: [
            {
              type: 'course',
              title: 'Git Fundamentals',
              url: '#',
              duration: '3 hours',
              difficulty: 'beginner'
            }
          ],
          completed: false,
          progress: 0
        },
        {
          id: 'milestone-2',
          title: 'Core Programming',
          description: 'Master programming fundamentals',
          estimatedWeeks: 4,
          skills: ['JavaScript', 'Data Structures', 'Algorithms'],
          resources: [
            {
              type: 'course',
              title: 'JavaScript Mastery',
              url: '#',
              duration: '20 hours',
              difficulty: 'intermediate'
            }
          ],
          completed: false,
          progress: 0
        },
        {
          id: 'milestone-3',
          title: 'Framework Mastery',
          description: 'Learn modern frameworks and tools',
          estimatedWeeks: 6,
          skills: ['React', 'Node.js', 'Database'],
          resources: [
            {
              type: 'project',
              title: 'Build Full Stack App',
              url: '#',
              duration: '40 hours',
              difficulty: 'advanced'
            }
          ],
          completed: false,
          progress: 0
        }
      ]
    };

    this.currentRoadmap.next(mockRoadmap);
    return mockRoadmap;
  }

  updateMilestoneProgress(milestoneId: string, progress: number): void {
    const roadmap = this.currentRoadmap.value;
    if (roadmap) {
      const milestone = roadmap.milestones.find(m => m.id === milestoneId);
      if (milestone) {
        milestone.progress = progress;
        milestone.completed = progress >= 100;
        this.currentRoadmap.next(roadmap);
      }
    }
  }

  private calculateTotalWeeks(timeCommitment: string): number {
    const timeMap: { [key: string]: number } = {
      '1-3 hours': 16,
      '4-7 hours': 12,
      '8-15 hours': 8,
      '16-25 hours': 6,
      '25+ hours': 4
    };
    return timeMap[timeCommitment] || 12;
  }

  private getRecommendedSkills(userProfile: any): string[] {
    const goalSkills: { [key: string]: string[] } = {
      'Get my first developer job': ['HTML', 'CSS', 'JavaScript', 'React', 'Git'],
      'Switch to a new technology stack': ['TypeScript', 'Node.js', 'MongoDB', 'Docker'],
      'Advance to senior level': ['System Design', 'Architecture', 'Leadership', 'Mentoring'],
      'Become a tech lead': ['Project Management', 'Team Leadership', 'Code Review'],
      'Start my own company': ['Business', 'Product Management', 'Marketing', 'Finance']
    };
    return goalSkills[userProfile.goal] || ['JavaScript', 'React', 'Node.js'];
  }
}