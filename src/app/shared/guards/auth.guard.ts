import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { GoogleAuthService } from '../services/google-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private googleAuth: GoogleAuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const isAuthenticated = this.googleAuth.isAuthenticated();
    const currentUser = this.googleAuth.getCurrentUser();
    
    if (!isAuthenticated || !currentUser) {
      // Clear any stale data
      localStorage.clear();
      this.router.navigate(['/login']);
      return false;
    }
    
    return true;
  }
}