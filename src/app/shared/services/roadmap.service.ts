import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface RoadmapNode {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'locked';
  estimatedTime: string;
  resources: string[];
  skills: string[];
}

@Injectable({
  providedIn: 'root'
})
export class RoadmapService {
  private roadmapSubject = new BehaviorSubject<RoadmapNode[]>([]);
  public roadmap$ = this.roadmapSubject.asObservable();

  constructor() {
    this.loadRoadmap();
  }

  private loadRoadmap() {
    // Mock roadmap data
    const mockRoadmap: RoadmapNode[] = [
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
      }
    ];
    
    this.roadmapSubject.next(mockRoadmap);
  }

  updateNodeStatus(nodeId: number, status: RoadmapNode['status']) {
    const currentRoadmap = this.roadmapSubject.value;
    const updatedRoadmap = currentRoadmap.map(node => 
      node.id === nodeId ? { ...node, status } : node
    );
    this.roadmapSubject.next(updatedRoadmap);
  }

  getProgressPercentage(): number {
    const roadmap = this.roadmapSubject.value;
    const completed = roadmap.filter(node => node.status === 'completed').length;
    return Math.round((completed / roadmap.length) * 100);
  }
}