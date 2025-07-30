import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  currentRoadmap?: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  preferences: {
    learningStyle: string;
    timeCommitment: string;
    goals: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Mock user data
    this.setCurrentUser({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      currentRoadmap: 'Full Stack JavaScript Developer',
      skillLevel: 'intermediate',
      preferences: {
        learningStyle: 'hands-on',
        timeCommitment: '8-15 hours',
        goals: ['Get promoted', 'Learn new technologies']
      }
    });
  }

  setCurrentUser(user: User) {
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  updateUserPreferences(preferences: Partial<User['preferences']>) {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      this.setCurrentUser({
        ...currentUser,
        preferences: { ...currentUser.preferences, ...preferences }
      });
    }
  }
}