import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { GoogleAuthService } from '../services/google-auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  constructor(
    private googleAuth: GoogleAuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const isAuthenticated = this.googleAuth.isAuthenticated();
    
    if (isAuthenticated) {
      // Redirect authenticated users to dashboard
      this.router.navigate(['/dashboard']);
      return false;
    }
    
    return true;
  }
}