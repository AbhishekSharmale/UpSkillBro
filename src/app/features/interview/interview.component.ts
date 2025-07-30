import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoiceInterviewComponent } from '../../shared/components/voice-interview.component';

@Component({
  selector: 'app-interview',
  standalone: true,
  imports: [CommonModule, VoiceInterviewComponent],
  template: `
    <div class="interview">
      <div class="container">
        <h1>AI Mock Interview Practice</h1>
        <p>Practice with AI-generated questions and get real-time feedback</p>
        
        <div class="interview-types">
          <div class="interview-type" *ngFor="let type of interviewTypes" (click)="selectType(type)">
            <div class="type-icon">{{type.icon}}</div>
            <h3>{{type.title}}</h3>
            <p>{{type.description}}</p>
            <div class="type-stats">
              <span>{{type.questions}} questions</span>
              <span>{{type.duration}} minutes</span>
            </div>
          </div>
        </div>
        
        <!-- Voice Interview Section -->
        <div class="voice-section">
          <app-voice-interview></app-voice-interview>
        </div>
        
        <div class="recent-interviews" *ngIf="recentInterviews.length > 0">
          <h2>Recent Practice Sessions</h2>
          <div class="interview-history">
            <div class="interview-item" *ngFor="let interview of recentInterviews">
              <div class="interview-info">
                <h4>{{interview.type}}</h4>
                <p>{{interview.date}}</p>
              </div>
              <div class="interview-score">
                <span class="score">{{interview.score}}%</span>
                <button class="btn-secondary">Review</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./interview.component.scss']
})
export class InterviewComponent {
  interviewTypes = [
    {
      icon: '💻',
      title: 'Technical Interview',
      description: 'Coding problems and algorithm questions',
      questions: 15,
      duration: 45
    },
    {
      icon: '🗣️',
      title: 'Behavioral Interview',
      description: 'Soft skills and experience questions',
      questions: 10,
      duration: 30
    },
    {
      icon: '🏗️',
      title: 'System Design',
      description: 'Architecture and scalability questions',
      questions: 5,
      duration: 60
    }
  ];

  recentInterviews = [
    { type: 'Technical Interview', date: '2 days ago', score: 85 },
    { type: 'Behavioral Interview', date: '1 week ago', score: 92 }
  ];

  selectType(type: any) {
    console.log('Starting interview:', type);
  }
}