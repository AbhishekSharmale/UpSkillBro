import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private readonly INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private inactivityTimer: any;

  constructor(private router: Router) {
    this.setupInactivityDetection();
  }

  // Clear all sensitive data
  clearAllData(): void {
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear any cached data
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
  }

  // Setup inactivity detection
  private setupInactivityDetection(): void {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const resetTimer = () => {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = setTimeout(() => {
        this.handleInactivity();
      }, this.INACTIVITY_TIMEOUT);
    };

    events.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });

    resetTimer();
  }

  private handleInactivity(): void {
    console.log('User inactive for 30 minutes, logging out for security');
    this.clearAllData();
    this.router.navigate(['/login']);
    alert('You have been logged out due to inactivity for security reasons.');
  }

  // Validate user session
  validateSession(): boolean {
    const currentUser = localStorage.getItem('current_user');
    
    if (!currentUser) {
      return false;
    }

    try {
      const user = JSON.parse(currentUser);
      return !!(user && user.uid);
    } catch {
      return false;
    }
  }

  // Prevent back button access after logout
  preventBackButtonAccess(): void {
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, '', window.location.href);
    };
  }
}