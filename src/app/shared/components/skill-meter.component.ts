import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skill-meter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skill-meter">
      <div class="skill-info">
        <span class="skill-name">{{skillName}}</span>
        <span class="skill-percentage">{{percentage}}%</span>
      </div>
      <div class="meter-container">
        <div class="meter-bg"></div>
        <div class="meter-fill" [style.width.%]="animatedPercentage">
          <div class="meter-glow"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .skill-meter {
      margin-bottom: 1.5rem;
    }

    .skill-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }

    .skill-name {
      font-weight: 600;
      color: var(--black-text);
    }

    .skill-percentage {
      color: var(--primary-blue);
      font-weight: 700;
    }

    .meter-container {
      position: relative;
      height: 8px;
      border-radius: 4px;
      overflow: hidden;
    }

    .meter-bg {
      position: absolute;
      width: 100%;
      height: 100%;
      background: var(--border-color);
      border-radius: 4px;
    }

    .meter-fill {
      position: relative;
      height: 100%;
      background: var(--primary-gradient);
      border-radius: 4px;
      transition: width 2s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
    }

    .meter-glow {
      position: absolute;
      top: 0;
      right: 0;
      width: 20px;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6));
      animation: glow-move 2s infinite;
    }

    @keyframes glow-move {
      0% { transform: translateX(-20px); }
      100% { transform: translateX(20px); }
    }
  `]
})
export class SkillMeterComponent implements OnInit {
  @Input() skillName: string = '';
  @Input() percentage: number = 0;
  
  animatedPercentage: number = 0;

  ngOnInit() {
    setTimeout(() => {
      this.animatedPercentage = this.percentage;
    }, 500);
  }
}