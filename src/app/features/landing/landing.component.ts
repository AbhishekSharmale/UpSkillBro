import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { fadeInUp, staggerAnimation, scaleIn } from '../../shared/animations/animations';
import { ParticleBackgroundComponent } from '../../shared/components/particle-background.component';
import { FloatingElementsComponent } from '../../shared/components/floating-elements.component';
import { MorphingTextComponent } from '../../shared/components/morphing-text.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, CommonModule, ParticleBackgroundComponent, FloatingElementsComponent, MorphingTextComponent],
  animations: [fadeInUp, staggerAnimation, scaleIn],
  template: `
    <app-particle-background></app-particle-background>
    <app-floating-elements></app-floating-elements>
    <div class="landing">
      <!-- Hero Section -->
      <section class="hero section-padding">
        <div class="container">
          <div class="hero-content" [@fadeInUp] *ngIf="isLoaded">
            <h1>Accelerate Your <app-morphing-text [texts]="heroTexts"></app-morphing-text> with AI-Powered Learning</h1>
            <p class="hero-subtitle">
              Get personalized roadmaps, practice interviews, earn certificates, 
              and connect with mentors - all in one platform
            </p>
            <div class="hero-buttons">
              <button class="btn-primary pulse-btn" routerLink="/login">Get Started Free</button>
              <button class="btn-secondary">Watch Demo</button>
            </div>
            <div class="hero-stats">
              <div class="stat">
                <span class="stat-number">50,000+</span>
                <span class="stat-label">Students Enrolled</span>
              </div>
              <div class="stat">
                <span class="stat-number">95%</span>
                <span class="stat-label">Job Success Rate</span>
              </div>
              <div class="stat">
                <span class="stat-number">500+</span>
                <span class="stat-label">Partner Companies</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features section-padding bg-light">
        <div class="container">
          <div class="section-header">
            <h2>Everything You Need to Succeed</h2>
            <p>Comprehensive tools and resources for your career growth</p>
          </div>
          <div class="features-grid" [@stagger]="features.length">
            <div class="feature-card" [@scaleIn] *ngFor="let feature of features; trackBy: trackByIndex">
              <div class="feature-icon">{{feature.icon}}</div>
              <h3>{{feature.title}}</h3>
              <p>{{feature.description}}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Benefits Section -->
      <section class="benefits section-padding">
        <div class="container">
          <div class="benefits-grid" [@stagger]="benefits.length">
            <div class="benefit-item" [@fadeInUp] *ngFor="let benefit of benefits; trackBy: trackByIndex">
              <div class="benefit-icon">{{benefit.icon}}</div>
              <div class="benefit-content">
                <h3>{{benefit.title}}</h3>
                <p>{{benefit.description}}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials Section -->
      <section class="testimonials section-padding bg-light">
        <div class="container">
          <div class="section-header">
            <h2>Success Stories</h2>
            <p>See how UpskillBro transformed careers</p>
          </div>
          <div class="testimonials-grid" [@stagger]="testimonials.length">
            <div class="testimonial" [@scaleIn] *ngFor="let testimonial of testimonials; trackBy: trackByIndex">
              <div class="testimonial-content">
                <p>"{{testimonial.text}}"</p>
              </div>
              <div class="testimonial-author">
                <div class="author-avatar">{{testimonial.avatar}}</div>
                <div class="author-info">
                  <strong>{{testimonial.author}}</strong>
                  <span>{{testimonial.role}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta section-padding">
        <div class="container">
          <div class="cta-content">
            <h2>Ready to Transform Your Career?</h2>
            <p>Join thousands of developers who've accelerated their growth with UpskillBro</p>
            <button class="btn-primary" routerLink="/login">Start Your Journey Today</button>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./landing.component.scss', './landing-animations.scss']
})
export class LandingComponent implements OnInit {
  isLoaded = false;
  
  ngOnInit() {
    setTimeout(() => this.isLoaded = true, 100);
  }
  features = [
    {
      icon: '🎯',
      title: 'Personalized Roadmaps',
      description: 'AI-powered learning paths tailored to your goals and skill level'
    },
    {
      icon: '🎤',
      title: 'Mock Interviews',
      description: 'Practice with realistic interview scenarios and get instant feedback'
    },
    {
      icon: '🏆',
      title: 'Industry Certificates',
      description: 'Earn recognized certificates to showcase your expertise'
    },
    {
      icon: '👨‍🏫',
      title: 'Expert Mentorship',
      description: 'Connect with industry professionals for personalized guidance'
    },
    {
      icon: '📚',
      title: 'Curated Content',
      description: 'Access premium courses and resources from top educators'
    },
    {
      icon: '💼',
      title: 'Career Support',
      description: 'Resume building, job matching, and career advancement tools'
    }
  ];

  benefits = [
    {
      icon: '⚡',
      title: 'Learn Faster',
      description: 'AI-powered personalization helps you focus on what matters most'
    },
    {
      icon: '🎯',
      title: 'Stay Focused',
      description: 'Clear roadmaps and milestones keep you on track to your goals'
    },
    {
      icon: '🚀',
      title: 'Get Hired',
      description: 'Interview practice and career support increase your job prospects'
    },
    {
      icon: '📈',
      title: 'Advance Faster',
      description: 'Continuous learning and skill development accelerate promotions'
    }
  ];

  testimonials = [
    {
      avatar: '👨‍💻',
      text: 'UpskillBro helped me transition from junior to senior developer in just 8 months. The personalized roadmap was exactly what I needed.',
      author: 'Alex Chen',
      role: 'Senior Developer at Google'
    },
    {
      avatar: '👩‍💻',
      text: 'The mock interviews gave me the confidence to ace my dream job interview. Best investment in my career.',
      author: 'Sarah Rodriguez',
      role: 'Full Stack Developer at Microsoft'
    },
    {
      avatar: '👨‍💼',
      text: 'From bootcamp graduate to tech lead in 2 years. UpskillBro made the impossible possible.',
      author: 'Mike Patel',
      role: 'Tech Lead at Netflix'
    }
  ];
  
  trackByIndex(index: number): number {
    return index;
  }
  
  heroTexts = ['Tech Career', 'Skills', 'Knowledge', 'Future', 'Success'];
}