import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-visualization',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="progress-viz">
      <div class="level-display">
        <div class="level-circle">
          <span class="level-number">{{level}}</span>
          <div class="level-ring">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" class="ring-bg"/>
              <circle cx="50" cy="50" r="45" class="ring-progress" 
                      [style.stroke-dashoffset]="circumference - (xpProgress * circumference)"/>
            </svg>
          </div>
        </div>
        <div class="level-info">
          <h3>Level {{level}}</h3>
          <p>{{xp}}/{{xpToNext + xp}} XP</p>
        </div>
      </div>
      
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-icon">🔥</div>
          <div class="stat-value">{{streak}}</div>
          <div class="stat-label">Day Streak</div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">⭐</div>
          <div class="stat-value">{{totalPoints | number}}</div>
          <div class="stat-label">Total Points</div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">🏆</div>
          <div class="stat-value">{{achievements}}</div>
          <div class="stat-label">Achievements</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .progress-viz {
      background: linear-gradient(135deg, var(--background-white) 0%, #f8fafc 100%);
      border-radius: 16px;
      padding: 2rem;
      box-shadow: var(--card-shadow);
    }

    .level-display {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .level-circle {
      position: relative;
      width: 80px;
      height: 80px;
    }

    .level-number {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--primary-blue);
      z-index: 2;
    }

    .level-ring {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .level-ring svg {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .ring-bg {
      fill: none;
      stroke: var(--border-color);
      stroke-width: 4;
    }

    .ring-progress {
      fill: none;
      stroke: var(--primary-blue);
      stroke-width: 4;
      stroke-linecap: round;
      stroke-dasharray: 283;
      transition: stroke-dashoffset 1s ease;
    }

    .level-info h3 {
      margin: 0 0 0.5rem 0;
      color: var(--black-text);
      font-size: 1.25rem;
    }

    .level-info p {
      margin: 0;
      color: var(--secondary-gray);
      font-size: 0.9rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }

    .stat-item {
      text-align: center;
      padding: 1rem;
      background: rgba(0, 56, 255, 0.05);
      border-radius: 12px;
      transition: transform 0.3s ease;
    }

    .stat-item:hover {
      transform: translateY(-2px);
    }

    .stat-icon {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .stat-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--primary-blue);
      margin-bottom: 0.25rem;
    }

    .stat-label {
      font-size: 0.8rem;
      color: var(--secondary-gray);
    }
  `]
})
export class ProgressVisualizationComponent {
  @Input() level: number = 1;
  @Input() xp: number = 0;
  @Input() xpToNext: number = 100;
  @Input() streak: number = 0;
  @Input() totalPoints: number = 0;
  @Input() achievements: number = 0;

  circumference = 283;

  get xpProgress(): number {
    return this.xp / (this.xp + this.xpToNext);
  }
}