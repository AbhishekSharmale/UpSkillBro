import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FirebaseService } from '../../shared/services/firebase.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<any>(null);
  
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private firebase: FirebaseService,
    private router: Router
  ) {}

  async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await this.firebase.getUsers().toPromise();
      
      if (response) {
        const users = Object.values(response);
        const user = users.find((u: any) => u.email === email && u.password === password);
        
        if (user) {
          this.isLoggedInSubject.next(true);
          this.currentUserSubject.next(user);
          localStorage.setItem('upskillbro_auth', 'true');
          localStorage.setItem('currentUser', JSON.stringify(user));
          return true;
        }
      }
      
      // Auto-register new users
      return this.register(email, password);
    } catch (error) {
      console.log('Database not configured, using local storage');
      // Fallback - accept any credentials for demo
      this.isLoggedInSubject.next(true);
      localStorage.setItem('upskillbro_auth', 'true');
      localStorage.setItem('currentUser', JSON.stringify({ email, name: email.split('@')[0] }));
      return true;
    }
  }

  async register(email: string, password: string): Promise<boolean> {
    try {
      const userData: any = {
        email,
        password, // In production, hash this
        name: email.split('@')[0],
        level: 1,
        xp: 0,
        streak: 0,
        achievements: [],
        preferences: {},
        createdAt: new Date()
      };
      
      const response = await this.firebase.createUser(userData).toPromise();
      
      if (response.name) {
        userData.id = response.name;
        this.isLoggedInSubject.next(true);
        this.currentUserSubject.next(userData);
        localStorage.setItem('upskillbro_auth', 'true');
        localStorage.setItem('currentUser', JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      // Fallback to local storage for demo
      this.isLoggedInSubject.next(true);
      localStorage.setItem('upskillbro_auth', 'true');
      return true;
    }
  }

  logout() {
    this.isLoggedInSubject.next(false);
    this.currentUserSubject.next(null);
    localStorage.removeItem('upskillbro_auth');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }

  checkAuthStatus() {
    const isAuth = localStorage.getItem('upskillbro_auth') === 'true';
    const userData = localStorage.getItem('currentUser');
    
    if (isAuth) {
      this.isLoggedInSubject.next(true);
      if (userData) {
        this.currentUserSubject.next(JSON.parse(userData));
      }
    }
    return isAuth;
  }

  isAuthenticated(): boolean {
    return this.isLoggedInSubject.value;
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  async updateUserProgress(progressData: any): Promise<void> {
    const user = this.getCurrentUser();
    if (user && user.id) {
      try {
        await this.firebase.updateUser(user.id, progressData).toPromise();
        const updatedUser = { ...user, ...progressData };
        this.currentUserSubject.next(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Failed to update progress:', error);
      }
    }
  }
}