import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { GuestGuard } from './shared/guards/guest.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent) },
  { path: 'login', loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent), canActivate: [GuestGuard] },
  { path: 'assessment', loadComponent: () => import('./features/questionnaire/questionnaire.component').then(m => m.QuestionnaireComponent) },
  { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [AuthGuard] },
  { path: 'roadmap', loadComponent: () => import('./features/roadmap/visual-roadmap.component').then(m => m.VisualRoadmapComponent) },
  { path: 'mentorship', loadComponent: () => import('./features/mentorship/mentorship.component').then(m => m.MentorshipComponent), canActivate: [AuthGuard] },
  { path: 'interview', loadComponent: () => import('./features/interview/interview.component').then(m => m.InterviewComponent), canActivate: [AuthGuard] },
  { path: 'news', loadComponent: () => import('./features/news/news.component').then(m => m.NewsComponent), canActivate: [AuthGuard] },
  { path: 'community', loadComponent: () => import('./features/community/community.component').then(m => m.CommunityComponent), canActivate: [AuthGuard] },
  { path: 'hiring', loadComponent: () => import('./features/hiring/hiring.component').then(m => m.HiringComponent), canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];