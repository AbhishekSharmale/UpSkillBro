import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mentorship',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mentorship">
      <div class="container">
        <h1>Find Your Perfect Mentor</h1>
        <p>Connect with industry experts for personalized guidance</p>
        
        <div class="filters">
          <select class="filter-select">
            <option>All Expertise</option>
            <option>Frontend</option>
            <option>Backend</option>
            <option>Full Stack</option>
          </select>
          <select class="filter-select">
            <option>All Companies</option>
            <option>FAANG</option>
            <option>Startups</option>
            <option>Enterprise</option>
          </select>
        </div>

        <div class="mentors-grid">
          <div class="mentor-card" *ngFor="let mentor of mentors">
            <div class="mentor-avatar">{{mentor.avatar}}</div>
            <h3>{{mentor.name}}</h3>
            <p class="mentor-role">{{mentor.role}} at {{mentor.company}}</p>
            <div class="mentor-rating">⭐ {{mentor.rating}} ({{mentor.reviews}} reviews)</div>
            <div class="mentor-skills">
              <span class="skill-tag" *ngFor="let skill of mentor.skills">{{skill}}</span>
            </div>
            <div class="mentor-price">\${{mentor.price}}/hour</div>
            <button class="btn-primary">Book Session</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./mentorship.component.scss']
})
export class MentorshipComponent {
  mentors = [
    {
      avatar: '👨‍💻',
      name: 'John Smith',
      role: 'Senior Engineer',
      company: 'Google',
      rating: 4.9,
      reviews: 127,
      skills: ['React', 'Node.js', 'System Design'],
      price: 150
    },
    {
      avatar: '👩‍💻',
      name: 'Sarah Chen',
      role: 'Tech Lead',
      company: 'Microsoft',
      rating: 4.8,
      reviews: 89,
      skills: ['Angular', 'TypeScript', 'Leadership'],
      price: 120
    }
  ];
}