import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HuggingFaceService } from '../services/huggingface.service';

@Component({
  selector: 'app-ai-code-reviewer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="code-reviewer">
      <div class="reviewer-header">
        <h3>🔍 AI Code Reviewer</h3>
        <p>Get instant feedback on your code!</p>
      </div>
      
      <div class="code-input">
        <div class="input-header">
          <select [(ngModel)]="selectedLanguage" class="language-select">
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="typescript">TypeScript</option>
            <option value="react">React</option>
          </select>
          <button 
            class="review-btn" 
            (click)="reviewCode()"
            [disabled]="!code.trim() || isReviewing">
            {{isReviewing ? '🤖 Analyzing...' : '✨ Review Code'}}
          </button>
        </div>
        
        <textarea 
          [(ngModel)]="code"
          placeholder="Paste your code here for AI review..."
          class="code-textarea"
          rows="8"></textarea>
      </div>
      
      <div class="review-results" *ngIf="reviewResult">
        <div class="result-header">
          <h4>📊 Code Review Results</h4>
          <div class="score-badge" [class]="getScoreClass()">
            {{reviewResult.score}}/100
          </div>
        </div>
        
        <div class="feedback-sections">
          <div class="feedback-section" *ngFor="let section of reviewResult.sections">
            <div class="section-header">
              <span class="section-icon">{{section.icon}}</span>
              <span class="section-title">{{section.title}}</span>
              <span class="section-status" [class]="section.status">{{section.status}}</span>
            </div>
            <p class="section-feedback">{{section.feedback}}</p>
            <div class="suggestions" *ngIf="section.suggestions.length">
              <strong>Suggestions:</strong>
              <ul>
                <li *ngFor="let suggestion of section.suggestions">{{suggestion}}</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="review-actions">
          <button class="btn-secondary" (click)="clearReview()">🔄 New Review</button>
          <button class="btn-primary" (click)="saveReview()">💾 Save Review</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .code-reviewer {
      background: var(--background-white);
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: var(--card-shadow);
    }

    .reviewer-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .reviewer-header h3 {
      margin: 0 0 0.5rem 0;
      color: var(--primary-blue);
    }

    .reviewer-header p {
      margin: 0;
      color: var(--secondary-gray);
      font-size: 0.9rem;
    }

    .input-header {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      align-items: center;
    }

    .language-select {
      padding: 0.5rem;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      background: var(--background-white);
      color: var(--black-text);
    }

    .review-btn {
      padding: 0.5rem 1rem;
      background: var(--primary-gradient);
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    .code-textarea {
      width: 100%;
      padding: 1rem;
      border: 2px solid var(--border-color);
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 0.9rem;
      background: #f8f9fa;
      color: var(--black-text);
      resize: vertical;
      
      &:focus {
        outline: none;
        border-color: var(--primary-blue);
      }
    }

    .review-results {
      margin-top: 1.5rem;
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .result-header h4 {
      margin: 0;
      color: var(--black-text);
    }

    .score-badge {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 700;
      font-size: 0.9rem;
      
      &.excellent { background: #d1fae5; color: #065f46; }
      &.good { background: #fef3c7; color: #92400e; }
      &.needs-work { background: #fee2e2; color: #991b1b; }
    }

    .feedback-section {
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: var(--light-gray-bg);
      border-radius: 8px;
      border-left: 4px solid var(--primary-blue);
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .section-icon {
      font-size: 1.2rem;
    }

    .section-title {
      font-weight: 600;
      color: var(--black-text);
    }

    .section-status {
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      
      &.good { background: #d1fae5; color: #065f46; }
      &.warning { background: #fef3c7; color: #92400e; }
      &.error { background: #fee2e2; color: #991b1b; }
    }

    .section-feedback {
      margin: 0.5rem 0;
      color: var(--secondary-gray);
      line-height: 1.5;
    }

    .suggestions {
      margin-top: 0.5rem;
      font-size: 0.9rem;
    }

    .suggestions ul {
      margin: 0.5rem 0 0 1rem;
      color: var(--secondary-gray);
    }

    .review-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .btn-primary, .btn-secondary {
      flex: 1;
      padding: 0.75rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-primary {
      background: var(--primary-gradient);
      color: white;
      border: none;
    }

    .btn-secondary {
      background: transparent;
      color: var(--primary-blue);
      border: 2px solid var(--primary-blue);
    }
  `]
})
export class AICodeReviewerComponent {
  code = '';
  selectedLanguage = 'javascript';
  isReviewing = false;
  reviewResult: any = null;

  constructor(private huggingFace: HuggingFaceService) {}

  async reviewCode() {
    if (!this.code.trim()) return;
    
    this.isReviewing = true;
    
    try {
      // Mock review for demo - replace with HuggingFace API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      this.reviewResult = {
        score: Math.floor(Math.random() * 30) + 70,
        sections: [
          {
            icon: '🏗️',
            title: 'Code Structure',
            status: 'good',
            feedback: 'Your code follows good structural patterns with clear separation of concerns.',
            suggestions: ['Consider extracting utility functions', 'Add more descriptive variable names']
          },
          {
            icon: '⚡',
            title: 'Performance',
            status: 'warning',
            feedback: 'There are some performance optimizations that could be applied.',
            suggestions: ['Use memoization for expensive calculations', 'Consider lazy loading']
          },
          {
            icon: '🔒',
            title: 'Security',
            status: 'good',
            feedback: 'No major security vulnerabilities detected.',
            suggestions: []
          }
        ]
      };
    } catch (error) {
      console.error('Code review failed:', error);
    } finally {
      this.isReviewing = false;
    }
  }

  getScoreClass(): string {
    const score = this.reviewResult?.score || 0;
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    return 'needs-work';
  }

  clearReview() {
    this.reviewResult = null;
    this.code = '';
  }

  saveReview() {
    // Save review to user's history
    console.log('Saving review:', this.reviewResult);
  }
}