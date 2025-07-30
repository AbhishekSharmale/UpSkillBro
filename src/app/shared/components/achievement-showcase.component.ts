import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Achievement } from '../services/gamification.service';

@Component({
  selector: 'app-achievement-showcase',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="achievement-showcase">
      <h3>Recent Achievements</h3>
      <div class="achievements-grid">
        <div class="achievement-card" 
             *ngFor="let achievement of achievements" 
             [class.unlocked]="achievement.unlocked"
             [class]="achievement.rarity">
          <div class="achievement-icon">{{achievement.icon}}</div>
          <div class="achievement-info">
            <h4>{{achievement.title}}</h4>
            <p>{{achievement.description}}</p>
            <span class="achievement-date" *ngIf="achievement.unlocked">
              {{achievement.unlockedAt | date:'short'}}
            </span>
          </div>
          <div class="achievement-glow"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .achievement-showcase {
      background: var(--background-white);
      border-radius: 16px;
      padding: 2rem;
      box-shadow: var(--card-shadow);
    }

    .achievement-showcase h3 {
      margin: 0 0 1.5rem 0;
      color: var(--black-text);
      font-size: 1.25rem;
    }

    .achievements-grid {
      display: grid;
      gap: 1rem;
    }

    .achievement-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border-radius: 12px;
      border: 2px solid var(--border-color);
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
      opacity: 0.6;
    }

    .achievement-card.unlocked {
      opacity: 1;
      border-color: var(--primary-blue);
    }

    .achievement-card.common.unlocked {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    }

    .achievement-card.rare.unlocked {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border-color: #22c55e;
    }

    .achievement-card.epic.unlocked {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border-color: #f59e0b;
    }

    .achievement-card.legendary.unlocked {
      background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
      border-color: #ec4899;
      animation: legendary-glow 2s infinite;
    }

    @keyframes legendary-glow {
      0%, 100% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.3); }
      50% { box-shadow: 0 0 30px rgba(236, 72, 153, 0.5); }
    }

    .achievement-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }

    .achievement-info {
      flex: 1;
    }

    .achievement-info h4 {
      margin: 0 0 0.25rem 0;
      color: var(--black-text);
      font-size: 1rem;
    }

    .achievement-info p {
      margin: 0 0 0.25rem 0;
      color: var(--secondary-gray);
      font-size: 0.85rem;
    }

    .achievement-date {
      font-size: 0.75rem;
      color: var(--primary-blue);
      font-weight: 500;
    }

    .achievement-glow {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      transition: left 0.6s ease;
    }

    .achievement-card.unlocked:hover .achievement-glow {
      left: 100%;
    }
  `]
})
export class AchievementShowcaseComponent {
  @Input() achievements: Achievement[] = [];
}