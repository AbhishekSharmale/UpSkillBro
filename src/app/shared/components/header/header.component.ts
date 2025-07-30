import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../features/auth/auth.service';
import { GoogleAuthService } from '../../services/google-auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <header class="header">
      <div class="container">
        <nav class="nav">
          <div class="logo">
            <a routerLink="/">
              <span class="logo-text">UpskillBro</span>
            </a>
          </div>
          
          <!-- Mobile Menu Button -->
          <button class="mobile-menu-btn mobile-only" (click)="toggleMobileMenu()">
            <span class="hamburger"></span>
            <span class="hamburger"></span>
            <span class="hamburger"></span>
          </button>
          
          <ul class="nav-links" [class.mobile-open]="mobileMenuOpen" *ngIf="isLoggedIn">
            <li><a routerLink="/dashboard" routerLinkActive="active" (click)="closeMobileMenu()">Dashboard</a></li>
            <li><a routerLink="/roadmap" routerLinkActive="active" (click)="closeMobileMenu()">Roadmap</a></li>
            <li><a routerLink="/mentorship" routerLinkActive="active" (click)="closeMobileMenu()">Mentorship</a></li>
            <li><a routerLink="/interview" routerLinkActive="active" (click)="closeMobileMenu()">Interview</a></li>
            <li><a routerLink="/news" routerLinkActive="active" (click)="closeMobileMenu()">News</a></li>
            <li><a routerLink="/community" routerLinkActive="active" (click)="closeMobileMenu()">Community</a></li>
          </ul>
          
          <div class="auth-buttons">
            <button class="theme-toggle" (click)="toggleTheme()" [title]="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'">
              <div class="toggle-container" [class.dark]="isDarkMode">
                <div class="icon-wrapper">
                  <svg class="sun-icon" [class.active]="isDarkMode" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="4" fill="currentColor"/>
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 6.34L4.93 4.93M19.07 19.07l-1.41-1.41" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                  <svg class="moon-icon" [class.active]="!isDarkMode" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
                  </svg>
                </div>
                <div class="glow-effect"></div>
              </div>
            </button>
            
            <div *ngIf="!isLoggedIn" class="login-buttons">
              <button class="btn-secondary mobile-hidden" routerLink="/login">Login</button>
              <button class="btn-primary" routerLink="/login">Get Started</button>
            </div>
            
            <div *ngIf="isLoggedIn" class="user-profile">
              <img *ngIf="getCurrentUser()?.photoURL" 
                   [src]="getCurrentUser()?.photoURL" 
                   [alt]="getCurrentUser()?.name"
                   class="user-avatar">
              <div *ngIf="!getCurrentUser()?.photoURL" class="user-avatar-placeholder">
                {{getCurrentUser()?.name?.charAt(0) || 'U'}}
              </div>
              <span class="user-name mobile-hidden">{{getCurrentUser()?.name || 'User'}}</span>
              <button class="btn-secondary logout-btn" (click)="logout()">Logout</button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  isDarkMode = false;
  mobileMenuOpen = false;

  constructor(
    private authService: AuthService,
    private googleAuth: GoogleAuthService,
    private themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit() {
    // Only use Google Auth
    this.googleAuth.isLoggedIn$.subscribe((status: boolean) => {
      this.isLoggedIn = status;
    });

    this.themeService.isDarkTheme$.subscribe((isDark: boolean) => {
      this.isDarkMode = isDark;
    });
  }

  async logout() {
    await this.googleAuth.signOut();
    this.closeMobileMenu();
    // Redirect to login page after logout
    this.router.navigate(['/login']);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }
  
  getCurrentUser(): any {
    return this.googleAuth.getCurrentUser();
  }
}