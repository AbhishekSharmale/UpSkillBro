import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { GoogleAuthService } from '../../shared/services/google-auth.service';
import { SupabaseService } from '../../shared/services/supabase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modern-login">
      <div class="login-split">
        <div class="login-left">
          <div class="brand-section">
            <div class="logo-container">
              <div class="logo-icon">🚀</div>
              <h1>UpskillBro</h1>
            </div>
            <p class="tagline">Transform your career with AI-powered learning</p>
            
            <div class="features-preview">
              <div class="feature-item">
                <span class="feature-icon">⚡</span>
                <span>Personalized Learning Paths</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🎯</span>
                <span>AI Mock Interviews</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">👥</span>
                <span>Expert Mentorship</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="login-right">
          <div class="login-card">
            <div class="card-header">
              <h2>Welcome Back</h2>
              <p>Sign in to continue your learning journey</p>
            </div>
            
            <div class="auth-options">
              <p class="login-subtitle">Sign in to access your personalized learning dashboard</p>
              
              <!-- Google Sign In -->
              <button type="button" class="google-btn" (click)="signInWithGoogle()">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              
              <div class="divider">
                <span>OR</span>
              </div>
              
              <!-- Email/Phone Toggle -->
              <div class="auth-toggle">
                <button type="button" 
                        class="toggle-btn" 
                        [class.active]="authMode === 'email'"
                        (click)="authMode = 'email'">
                  📧 Email
                </button>
                <button type="button" 
                        class="toggle-btn" 
                        [class.active]="authMode === 'phone'"
                        (click)="authMode = 'phone'">
                  📱 Phone
                </button>
              </div>
              
              <!-- Simple Email Form -->
              <form *ngIf="authMode === 'email'" [formGroup]="emailForm" (ngSubmit)="handleSimpleAuth()" class="auth-form">
                <input type="text" 
                       formControlName="name" 
                       placeholder="Full Name" 
                       class="auth-input">
                       
                <input type="email" 
                       formControlName="email" 
                       placeholder="Email Address" 
                       class="auth-input">
                       
                <button type="submit" 
                        class="auth-submit-btn" 
                        [disabled]="emailForm.invalid || isLoading">
                  Continue with Email
                </button>
              </form>
              
              <!-- Simple Phone Form -->
              <form *ngIf="authMode === 'phone'" [formGroup]="phoneForm" (ngSubmit)="handleSimpleAuth()" class="auth-form">
                <input type="text" 
                       formControlName="name" 
                       placeholder="Full Name" 
                       class="auth-input">
                       
                <input type="tel" 
                       formControlName="phone" 
                       placeholder="+91 9876543210" 
                       class="auth-input">
                       
                <button type="submit" 
                        class="auth-submit-btn" 
                        [disabled]="phoneForm.invalid || isLoading">
                  Continue with Phone
                </button>
              </form>
              
              <div class="security-note">
                <p>🔒 Secure authentication with multiple options</p>
              </div>
              
              <div class="guest-option">
                <div class="divider">
                  <span>OR</span>
                </div>
                
                <button type="button" class="guest-btn" (click)="continueAsGuest()">
                  👤 Continue as Guest
                </button>
                
                <p class="guest-note">
                  Try our career assessment without creating an account
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./login.component.scss', './login-styles.scss']
})
export class LoginComponent {
  authMode: 'email' | 'phone' = 'email';
  isSignUp = false;
  showOtpInput = false;
  isLoading = false;
  confirmationResult: any = null;
  
  emailForm: FormGroup;
  phoneForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private googleAuth: GoogleAuthService,
    private supabase: SupabaseService,
    private router: Router
  ) {
    this.emailForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
    
    this.phoneForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+91[6-9]\d{9}$/)]]
    });
  }
  
  async signInWithGoogle() {
    try {
      console.log('Attempting Google sign-in...');
      const success = await this.googleAuth.signInWithGoogle();
      if (success) {
        const user = this.googleAuth.getCurrentUser();
        
        // Save user to Supabase
        try {
          await this.supabase.createUser(user);
        } catch (error: any) {
          // User might already exist, try to update
          if (error.code === '23505') {
            await this.supabase.updateUser(user.uid, { last_login: new Date().toISOString() });
          }
        }
        
        console.log('Google sign-in successful, redirecting to assessment');
        this.router.navigate(['/assessment']);
      } else {
        console.log('Google sign-in was cancelled or failed');
        alert('Sign-in was cancelled. Please try again.');
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      
      let errorMessage = 'Google sign-in failed. ';
      
      if (error.code === 'auth/unauthorized-domain') {
        errorMessage += 'Domain not authorized. Please contact support.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage += 'Popup was blocked. Please allow popups and try again.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage += 'Sign-in was cancelled.';
      } else {
        errorMessage += 'Please check your internet connection and try again.';
      }
      
      alert(errorMessage);
    }
  }
  
  async handleSimpleAuth() {
    this.isLoading = true;
    
    try {
      let userData: any = {};
      
      if (this.authMode === 'email') {
        const { name, email } = this.emailForm.value;
        userData = {
          uid: 'email_' + Date.now(),
          name: name,
          email: email,
          authMethod: 'email',
          photoURL: null,
          phone: null
        };
      } else {
        const { name, phone } = this.phoneForm.value;
        userData = {
          uid: 'phone_' + Date.now(),
          name: name,
          email: null,
          phone: phone,
          authMethod: 'phone',
          photoURL: null
        };
      }
      
      // Create user profile locally and in Supabase
      await this.createLocalUser(userData);
      
      // Save to Supabase
      try {
        await this.supabase.createUser(userData);
      } catch (error) {
        console.log('User might already exist in Supabase');
      }
      
      // Navigate to assessment
      this.router.navigate(['/assessment']);
      
    } catch (error) {
      console.error('Authentication failed:', error);
      alert('Authentication failed. Please try again.');
    } finally {
      this.isLoading = false;
    }
  }
  
  private async createLocalUser(userData: any): Promise<void> {
    const fullUserData = {
      ...userData,
      level: 1,
      xp: 0,
      streak: 0,
      totalPoints: 0,
      achievements: [],
      roadmaps: [],
      assessments: [],
      interviews: [],
      preferences: {},
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    // Store in localStorage for now
    localStorage.setItem('current_user', JSON.stringify(fullUserData));
    
    // Update auth service state
    this.googleAuth['currentUserSubject'].next(fullUserData);
    this.googleAuth['isLoggedInSubject'].next(true);
  }
  
  continueAsGuest() {
    // Create guest user profile
    const guestUser = {
      uid: 'guest_' + Date.now(),
      name: 'Guest User',
      email: null,
      phone: null,
      authMethod: 'guest',
      photoURL: null,
      level: 1,
      xp: 0,
      streak: 0,
      totalPoints: 0,
      achievements: [],
      roadmaps: [],
      assessments: [],
      interviews: [],
      preferences: {},
      isGuest: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    // Store guest user locally
    localStorage.setItem('current_user', JSON.stringify(guestUser));
    
    // Update auth service state
    this.googleAuth['currentUserSubject'].next(guestUser);
    this.googleAuth['isLoggedInSubject'].next(true);
    
    // Navigate directly to assessment
    this.router.navigate(['/assessment']);
  }
}