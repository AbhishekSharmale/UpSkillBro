import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="community">
      <div class="container">
        <h1>Developer Community</h1>
        <p>Connect, learn, and grow with fellow developers</p>
        
        <div class="community-stats">
          <div class="stat">
            <span class="stat-value">15,000+</span>
            <span class="stat-label">Active Members</span>
          </div>
          <div class="stat">
            <span class="stat-value">500+</span>
            <span class="stat-label">Daily Discussions</span>
          </div>
          <div class="stat">
            <span class="stat-value">50+</span>
            <span class="stat-label">Study Groups</span>
          </div>
        </div>

        <div class="community-sections">
          <div class="section-card">
            <h3>💬 Discussion Forums</h3>
            <p>Ask questions, share knowledge, and help others</p>
            <div class="recent-topics">
              <div class="topic" *ngFor="let topic of recentTopics">
                <h4>{{topic.title}}</h4>
                <div class="topic-meta">
                  <span>{{topic.replies}} replies</span>
                  <span>{{topic.time}}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="section-card">
            <h3>👥 Study Groups</h3>
            <p>Join or create study groups for collaborative learning</p>
            <div class="study-groups">
              <div class="group" *ngFor="let group of studyGroups">
                <h4>{{group.name}}</h4>
                <p>{{group.description}}</p>
                <div class="group-info">
                  <span>{{group.members}} members</span>
                  <button class="btn-secondary">Join</button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="section-card">
            <h3>🏆 Challenges</h3>
            <p>Participate in coding challenges and competitions</p>
            <div class="challenges">
              <div class="challenge" *ngFor="let challenge of challenges">
                <h4>{{challenge.title}}</h4>
                <p>{{challenge.description}}</p>
                <div class="challenge-info">
                  <span>{{challenge.participants}} participants</span>
                  <span>Ends {{challenge.deadline}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent {
  recentTopics = [
    { title: 'Best practices for React hooks', replies: 23, time: '2 hours ago' },
    { title: 'How to prepare for system design interviews', replies: 45, time: '4 hours ago' },
    { title: 'Node.js vs Python for backend development', replies: 67, time: '1 day ago' }
  ];

  studyGroups = [
    { name: 'React Mastery', description: 'Advanced React patterns and best practices', members: 156 },
    { name: 'Algorithm Study Group', description: 'Daily algorithm practice and discussion', members: 89 },
    { name: 'System Design Club', description: 'Weekly system design case studies', members: 234 }
  ];

  challenges = [
    { title: 'Build a Todo App', description: 'Create a full-stack todo application', participants: 1200, deadline: 'in 5 days' },
    { title: 'Algorithm Challenge', description: 'Solve 10 medium-level problems', participants: 800, deadline: 'in 2 weeks' }
  ];
}