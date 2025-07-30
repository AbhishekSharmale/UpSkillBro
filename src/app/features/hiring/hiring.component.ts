import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../shared/services/firebase.service';

interface Developer {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  role: string;
  experience: string;
  currentSalary: string;
  targetSalary: string;
  location: string;
  skills: string[];
  profileScore: number;
  lastActive: string;
  assessmentCompleted: boolean;
  learningProgress: number;
  achievements: number;
}

@Component({
  selector: 'app-hiring',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="hiring">
      <div class="container">
        <div class="hiring-header">
          <h1>🎯 Talent Marketplace</h1>
          <p>Discover pre-qualified developers with verified skills and transparent salary expectations</p>
        </div>

        <div class="filters">
          <div class="filter-group">
            <label>Role</label>
            <select [(ngModel)]="filters.role" (change)="applyFilters()">
              <option value="">All Roles</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
              <option value="Mobile Developer">Mobile Developer</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Experience</label>
            <select [(ngModel)]="filters.experience" (change)="applyFilters()">
              <option value="">All Levels</option>
              <option value="Junior (1-2 years)">Junior (1-2 years)</option>
              <option value="Mid-level (3-5 years)">Mid-level (3-5 years)</option>
              <option value="Senior (5+ years)">Senior (5+ years)</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Salary Range</label>
            <select [(ngModel)]="filters.salary" (change)="applyFilters()">
              <option value="">Any Salary</option>
              <option value="0-50k">$0 - $50k</option>
              <option value="50k-80k">$50k - $80k</option>
              <option value="80k-120k">$80k - $120k</option>
              <option value="120k+">$120k+</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Skills</label>
            <input type="text" 
                   [(ngModel)]="filters.skills" 
                   (input)="applyFilters()"
                   placeholder="e.g. React, Node.js">
          </div>
        </div>

        <div class="results-header">
          <h3>{{filteredDevelopers.length}} Developers Found</h3>
          <div class="sort-options">
            <select [(ngModel)]="sortBy" (change)="sortDevelopers()">
              <option value="score">Profile Score</option>
              <option value="salary">Target Salary</option>
              <option value="experience">Experience</option>
              <option value="lastActive">Last Active</option>
            </select>
          </div>
        </div>

        <div class="developers-grid">
          <div *ngFor="let dev of filteredDevelopers" class="developer-card">
            <div class="card-header">
              <div class="developer-info">
                <img *ngIf="dev.photoURL" [src]="dev.photoURL" [alt]="dev.name" class="avatar">
                <div *ngIf="!dev.photoURL" class="avatar-placeholder">
                  {{dev.name.charAt(0)}}
                </div>
                <div class="basic-info">
                  <h4>{{dev.name}}</h4>
                  <p class="role">{{dev.role}}</p>
                  <p class="location">📍 {{dev.location}}</p>
                </div>
              </div>
              <div class="profile-score">
                <div class="score-circle" [class]="getScoreClass(dev.profileScore)">
                  {{dev.profileScore}}
                </div>
                <span>Profile Score</span>
              </div>
            </div>

            <div class="salary-info">
              <div class="salary-item">
                <span class="label">Current:</span>
                <span class="value">{{dev.currentSalary}}</span>
              </div>
              <div class="salary-item target">
                <span class="label">Target:</span>
                <span class="value">{{dev.targetSalary}}</span>
              </div>
            </div>

            <div class="skills-section">
              <h5>Skills</h5>
              <div class="skills-list">
                <span *ngFor="let skill of dev.skills.slice(0, 6)" class="skill-tag">
                  {{skill}}
                </span>
                <span *ngIf="dev.skills.length > 6" class="more-skills">
                  +{{dev.skills.length - 6}} more
                </span>
              </div>
            </div>

            <div class="activity-info">
              <div class="activity-item">
                <span class="icon">📈</span>
                <span>{{dev.learningProgress}}% Learning Progress</span>
              </div>
              <div class="activity-item">
                <span class="icon">🏆</span>
                <span>{{dev.achievements}} Achievements</span>
              </div>
              <div class="activity-item">
                <span class="icon">⏰</span>
                <span>Active {{dev.lastActive}}</span>
              </div>
            </div>

            <div class="card-actions">
              <button class="btn-secondary" (click)="saveCandidate(dev)">
                💾 Save
              </button>
              <button class="btn-primary" (click)="contactCandidate(dev)">
                📧 Contact
              </button>
            </div>
          </div>
        </div>

        <div *ngIf="filteredDevelopers.length === 0" class="no-results">
          <h3>No developers found</h3>
          <p>Try adjusting your filters to see more candidates</p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./hiring.component.scss']
})
export class HiringComponent implements OnInit {
  developers: Developer[] = [];
  filteredDevelopers: Developer[] = [];
  
  filters = {
    role: '',
    experience: '',
    salary: '',
    skills: ''
  };
  
  sortBy = 'score';

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.loadDevelopers();
    this.loadFirebaseData();
    this.applyFilters();
  }

  loadDevelopers() {
    this.developers = [
      {
        id: '1',
        name: 'Sarah Chen',
        email: 'sarah.chen@email.com',
        photoURL: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        role: 'Frontend Developer',
        experience: 'Mid-level (3-5 years)',
        currentSalary: '$65,000',
        targetSalary: '$85,000',
        location: 'San Francisco, CA',
        skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL', 'Jest'],
        profileScore: 92,
        lastActive: '2 hours ago',
        assessmentCompleted: true,
        learningProgress: 78,
        achievements: 12
      },
      {
        id: '2',
        name: 'Marcus Johnson',
        email: 'marcus.j@email.com',
        role: 'Full Stack Developer',
        experience: 'Senior (5+ years)',
        currentSalary: '$95,000',
        targetSalary: '$130,000',
        location: 'Austin, TX',
        skills: ['Node.js', 'React', 'PostgreSQL', 'AWS', 'Docker', 'Python'],
        profileScore: 88,
        lastActive: '1 day ago',
        assessmentCompleted: true,
        learningProgress: 85,
        achievements: 18
      },
      {
        id: '3',
        name: 'Priya Patel',
        email: 'priya.patel@email.com',
        role: 'Backend Developer',
        experience: 'Mid-level (3-5 years)',
        currentSalary: '$70,000',
        targetSalary: '$90,000',
        location: 'Remote',
        skills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Kubernetes', 'GCP'],
        profileScore: 85,
        lastActive: '3 hours ago',
        assessmentCompleted: true,
        learningProgress: 72,
        achievements: 9
      },
      {
        id: '4',
        name: 'Alex Rodriguez',
        email: 'alex.r@email.com',
        role: 'DevOps Engineer',
        experience: 'Senior (5+ years)',
        currentSalary: '$105,000',
        targetSalary: '$140,000',
        location: 'Seattle, WA',
        skills: ['AWS', 'Terraform', 'Kubernetes', 'Docker', 'Jenkins', 'Python'],
        profileScore: 94,
        lastActive: '5 hours ago',
        assessmentCompleted: true,
        learningProgress: 91,
        achievements: 22
      },
      {
        id: '5',
        name: 'Emily Zhang',
        email: 'emily.zhang@email.com',
        role: 'Mobile Developer',
        experience: 'Junior (1-2 years)',
        currentSalary: '$55,000',
        targetSalary: '$75,000',
        location: 'New York, NY',
        skills: ['React Native', 'Swift', 'Kotlin', 'Firebase', 'Redux', 'Jest'],
        profileScore: 76,
        lastActive: '1 hour ago',
        assessmentCompleted: true,
        learningProgress: 65,
        achievements: 7
      }
    ];
  }

  applyFilters() {
    this.filteredDevelopers = this.developers.filter(dev => {
      const roleMatch = !this.filters.role || dev.role === this.filters.role;
      const experienceMatch = !this.filters.experience || dev.experience === this.filters.experience;
      const skillsMatch = !this.filters.skills || 
        dev.skills.some(skill => 
          skill.toLowerCase().includes(this.filters.skills.toLowerCase())
        );
      
      let salaryMatch = true;
      if (this.filters.salary) {
        const targetSalary = parseInt(dev.targetSalary.replace(/[$,k]/g, '')) * 1000;
        switch (this.filters.salary) {
          case '0-50k':
            salaryMatch = targetSalary <= 50000;
            break;
          case '50k-80k':
            salaryMatch = targetSalary > 50000 && targetSalary <= 80000;
            break;
          case '80k-120k':
            salaryMatch = targetSalary > 80000 && targetSalary <= 120000;
            break;
          case '120k+':
            salaryMatch = targetSalary > 120000;
            break;
        }
      }
      
      return roleMatch && experienceMatch && skillsMatch && salaryMatch;
    });
    
    this.sortDevelopers();
  }

  sortDevelopers() {
    this.filteredDevelopers.sort((a, b) => {
      switch (this.sortBy) {
        case 'score':
          return b.profileScore - a.profileScore;
        case 'salary':
          const aSalary = parseInt(a.targetSalary.replace(/[$,k]/g, ''));
          const bSalary = parseInt(b.targetSalary.replace(/[$,k]/g, ''));
          return bSalary - aSalary;
        case 'experience':
          return b.experience.localeCompare(a.experience);
        case 'lastActive':
          return a.lastActive.localeCompare(b.lastActive);
        default:
          return 0;
      }
    });
  }

  getScoreClass(score: number): string {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'average';
    return 'below-average';
  }

  saveCandidate(developer: Developer) {
    alert(`Saved ${developer.name} to your candidates list!`);
  }

  contactCandidate(developer: Developer) {
    alert(`Contact ${developer.name} at ${developer.email}`);
  }

  loadFirebaseData() {
    // Load real assessment data from Firebase
    this.firebaseService.getUsers().subscribe({
      next: (assessments) => {
        if (assessments) {
          const firebaseDevelopers = Object.keys(assessments).map(key => {
            const assessment = assessments[key];
            return this.convertAssessmentToDeveloper(assessment);
          }).filter(dev => dev.assessmentCompleted);
          
          // Merge with mock data
          this.developers = [...this.developers, ...firebaseDevelopers];
          this.applyFilters();
        }
      },
      error: (error) => {
        console.error('Error loading Firebase data:', error);
      }
    });
  }

  private convertAssessmentToDeveloper(assessment: any): Developer {
    const experienceMap: { [key: string]: string } = {
      'Complete Beginner': 'Junior (1-2 years)',
      'Some Experience (< 1 year)': 'Junior (1-2 years)',
      'Junior Developer (1-2 years)': 'Junior (1-2 years)',
      'Mid-level Developer (3-5 years)': 'Mid-level (3-5 years)',
      'Senior Developer (5+ years)': 'Senior (5+ years)'
    };

    const roleMap: { [key: string]: string } = {
      'Get my first developer job': 'Full Stack Developer',
      'Switch to a new technology stack': 'Full Stack Developer',
      'Advance to senior level': 'Senior Developer',
      'Become a tech lead': 'Tech Lead',
      'Start my own company': 'Entrepreneur'
    };

    return {
      id: assessment.userId || Math.random().toString(),
      name: assessment.userName || 'Anonymous Developer',
      email: assessment.userEmail || 'contact@example.com',
      photoURL: assessment.photoURL,
      role: this.determineRole(assessment) || 'Full Stack Developer',
      experience: experienceMap[assessment.experience] || 'Mid-level (3-5 years)',
      currentSalary: this.estimateCurrentSalary(assessment),
      targetSalary: this.estimateTargetSalary(assessment),
      location: 'Remote',
      skills: assessment.skills || ['JavaScript', 'React', 'Node.js'],
      profileScore: assessment.profileScore || 75,
      lastActive: this.getLastActive(assessment.completedAt),
      assessmentCompleted: true,
      learningProgress: Math.floor(Math.random() * 40) + 60,
      achievements: Math.floor(Math.random() * 15) + 5
    };
  }

  private determineRole(assessment: any): string {
    const frontendSkills = assessment.frontendSkills || 5;
    const backendSkills = assessment.backendSkills || 5;
    
    if (frontendSkills > backendSkills + 2) {
      return 'Frontend Developer';
    } else if (backendSkills > frontendSkills + 2) {
      return 'Backend Developer';
    } else {
      return 'Full Stack Developer';
    }
  }

  private estimateCurrentSalary(assessment: any): string {
    const experience = assessment.experience || '';
    const skills = assessment.skills || [];
    
    let baseSalary = 50000;
    
    if (experience.includes('Senior')) {
      baseSalary = 90000;
    } else if (experience.includes('Mid-level')) {
      baseSalary = 70000;
    }
    
    // Adjust for skills
    baseSalary += skills.length * 2000;
    
    return `$${(baseSalary / 1000).toFixed(0)}k`;
  }

  private estimateTargetSalary(assessment: any): string {
    const currentSalary = parseInt(this.estimateCurrentSalary(assessment).replace(/[$k]/g, '')) * 1000;
    const targetSalary = currentSalary * 1.3; // 30% increase
    
    return `$${(targetSalary / 1000).toFixed(0)}k`;
  }

  private getLastActive(completedAt: string): string {
    if (!completedAt) return '1 week ago';
    
    const completed = new Date(completedAt);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - completed.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} days ago`;
    }
  }
}