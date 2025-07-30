import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent) },
  { path: 'login', loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) },
  { path: 'assessment', loadComponent: () => import('./features/questionnaire/questionnaire.component').then(m => m.QuestionnaireComponent) },
  { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'roadmap', loadComponent: () => import('./features/roadmap/visual-roadmap.component').then(m => m.VisualRoadmapComponent) },
  { path: 'mentorship', loadComponent: () => import('./features/mentorship/mentorship.component').then(m => m.MentorshipComponent) },
  { path: 'interview', loadComponent: () => import('./features/interview/interview.component').then(m => m.InterviewComponent) },
  { path: 'news', loadComponent: () => import('./features/news/news.component').then(m => m.NewsComponent) },
  { path: 'community', loadComponent: () => import('./features/community/community.component').then(m => m.CommunityComponent) },
  { path: 'hiring', loadComponent: () => import('./features/hiring/hiring.component').then(m => m.HiringComponent) },
  { path: '**', redirectTo: '' }
];