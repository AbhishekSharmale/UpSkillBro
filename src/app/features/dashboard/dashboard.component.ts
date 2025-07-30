import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { fadeInUp, staggerAnimation, scaleIn, progressAnimation } from '../../shared/animations/animations';
import { SkillMeterComponent } from '../../shared/components/skill-meter.component';
import { ProgressVisualizationComponent } from '../../shared/components/progress-visualization.component';

import { OnboardingFlowComponent } from '../../shared/components/onboarding-flow.component';
import { AIChatComponent } from '../../shared/components/ai-chat.component';
import { AIRoadmapGeneratorComponent } from '../../shared/components/ai-roadmap-generator.component';
import { AICodeReviewerComponent } from '../../shared/components/ai-code-reviewer.component';
import { GamificationService } from '../../shared/services/gamification.service';
import { GoogleAuthService } from '../../shared/services/google-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, SkillMeterComponent, ProgressVisualizationComponent, OnboardingFlowComponent, AIChatComponent, AIRoadmapGeneratorComponent, AICodeReviewerComponent],
  animations: [fadeInUp, staggerAnimation, scaleIn, progressAnimation],
  template: `
    <div class="dashboard">
      <div class="container">
        <app-onboarding-flow 
          *ngIf="showOnboarding" 
          (completed)="onOnboardingComplete($event)">
        </app-onboarding-flow>
        
        <div class="dashboard-header">
          <div class="welcome-section">
            <h1>Welcome back, {{getUserName()}}! 👋</h1>
            <p>Ready to level up your skills today?</p>
          </div>
          <div class="quick-actions">
            <button class="action-btn primary" (click)="startLearning()">🚀 Continue Learning</button>
            <button class="action-btn secondary" (click)="takeAssessment()">📊 Take Assessment</button>
          </div>
        </div>

        <!-- Gamification Overview -->
        <app-progress-visualization 
          [level]="userStats.level"
          [xp]="userStats.xp"
          [xpToNext]="userStats.xpToNext"
          [streak]="userStats.streak"
          [totalPoints]="userStats.totalPoints"
          [achievements]="unlockedAchievements">
        </app-progress-visualization>
        
        <!-- Main Content Grid -->
        <div class="main-grid" [@stagger]="4" *ngIf="isLoaded">
          <!-- Left Column -->
          <div class="left-column">
            <!-- AI Roadmap Generator -->
            <div class="card roadmap-card" [@scaleIn]>
              <app-ai-roadmap-generator></app-ai-roadmap-generator>
            </div>
            
            <!-- Skills Overview -->
            <div class="card skills-card" [@fadeInUp]>
              <div class="card-header">
                <h3>Skills Progress</h3>
                <button class="btn-link" routerLink="/assessment">+ Add Skills</button>
              </div>
              <div class="skills-list">
                <app-skill-meter 
                  *ngFor="let skill of skills.slice(0, 3)" 
                  [skillName]="skill.name" 
                  [percentage]="skill.level">
                </app-skill-meter>
              </div>
            </div>
          </div>
          
          <!-- Right Column -->
          <div class="right-column">
            <!-- Quick Actions -->
            <div class="card actions-card" [@fadeInUp]>
              <h3>Quick Actions</h3>
              <div class="action-grid">
                <button class="action-btn" routerLink="/interview">
                  <span class="action-icon">🎤</span>
                  <span>Interview</span>
                </button>
                <button class="action-btn" routerLink="/assessment">
                  <span class="action-icon">📊</span>
                  <span>Assessment</span>
                </button>
                <button class="action-btn" routerLink="/news">
                  <span class="action-icon">📰</span>
                  <span>News</span>
                </button>
                <button class="action-btn" routerLink="/community">
                  <span class="action-icon">👥</span>
                  <span>Community</span>
                </button>
              </div>
            </div>
            
            <!-- Recent Activity -->
            <div class="card activity-card" [@scaleIn]>
              <h3>Recent Activity</h3>
              <div class="activity-list">
                <div class="activity-item" *ngFor="let activity of recentActivities.slice(0, 3)">
                  <div class="activity-icon">{{activity.icon}}</div>
                  <div class="activity-content">
                    <div class="activity-title">{{activity.title}}</div>
                    <div class="activity-time">{{activity.time}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- AI Tools Section -->
        <div class="ai-section" *ngIf="showAITools">
          <div class="section-header">
            <h3>🤖 AI Learning Tools</h3>
            <button class="toggle-btn" (click)="showAITools = !showAITools">
              {{showAITools ? 'Hide' : 'Show'}} AI Tools
            </button>
          </div>
          
          <div class="ai-tools-grid">
            <div class="card ai-card">
              <app-ai-chat></app-ai-chat>
            </div>
            
            <div class="card code-review-card">
              <app-ai-code-reviewer></app-ai-code-reviewer>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss', './dashboard-animations.scss', './dashboard-enhancements.scss', './dashboard-clean.scss']
})
export class DashboardComponent implements OnInit {
  isLoaded = false;
  userStats: any = {};
  showOnboarding = false;
  showAITools = false;
  
  constructor(
    private gamificationService: GamificationService,
    private googleAuth: GoogleAuthService,
    private router: Router
  ) {}
  
  ngOnInit() {
    this.gamificationService.userStats$.subscribe(stats => {
      this.userStats = stats;
    });
    
    const isNewUser = !localStorage.getItem('onboarding_completed');
    this.showOnboarding = isNewUser;
    
    setTimeout(() => this.isLoaded = true, 200);
  }
  overallProgress = 68;
  currentStreak = 12;
  completedMilestones = 8;

  currentRoadmap = {
    title: 'Full Stack JavaScript Developer',
    description: 'Master modern web development with React, Node.js, and MongoDB',
    nextMilestone: 'Advanced React Patterns'
  };

  recentActivities = [
    { icon: '✅', title: 'Completed React Hooks module', time: '2 hours ago' },
    { icon: '🎤', title: 'Practiced mock interview', time: '1 day ago' },
    { icon: '📚', title: 'Read article on TypeScript', time: '2 days ago' },
    { icon: '💬', title: 'Participated in community discussion', time: '3 days ago' }
  ];

  upcomingSessions = [
    { title: 'React Performance Optimization', mentor: 'Sarah Chen', time: 'Today, 3:00 PM' },
    { title: 'System Design Interview Prep', mentor: 'Mike Rodriguez', time: 'Tomorrow, 10:00 AM' }
  ];

  achievements = [
    { badge: '🏆', title: 'JavaScript Master', date: 'Yesterday' },
    { badge: '🔥', title: '10 Day Streak', date: '2 days ago' },
    { badge: '⭐', title: 'First Mock Interview', date: '1 week ago' }
  ];
  
  skills = [
    { name: 'JavaScript', level: 85 },
    { name: 'React', level: 78 },
    { name: 'Node.js', level: 72 },
    { name: 'TypeScript', level: 65 },
    { name: 'MongoDB', level: 58 }
  ];
  
  last7Days = [
    { day: 'M', completed: true },
    { day: 'T', completed: true },
    { day: 'W', completed: true },
    { day: 'T', completed: false },
    { day: 'F', completed: true },
    { day: 'S', completed: true },
    { day: 'S', completed: true }
  ];
  
  get unlockedAchievements(): number {
    return this.userStats.achievements?.filter((a: any) => a.unlocked).length || 0;
  }
  
  startLearning() {
    this.gamificationService.addXP(50);
    this.router.navigate(['/roadmap']);
  }
  
  takeAssessment() {
    this.router.navigate(['/assessment']);
  }
  
  onOnboardingComplete(userData: any) {
    localStorage.setItem('onboarding_completed', 'true');
    localStorage.setItem('user_preferences', JSON.stringify(userData));
    this.showOnboarding = false;
    
    this.gamificationService.unlockAchievement('1');
    this.gamificationService.addXP(100);
  }
  
  getUserName(): string {
    const user = this.googleAuth.getCurrentUser();
    return user?.name || user?.email?.split('@')[0] || 'User';
  }
}