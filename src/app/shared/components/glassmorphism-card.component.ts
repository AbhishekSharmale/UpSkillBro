import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-glassmorphism-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="glass-card" [class.elevated]="elevated">
      <div class="glass-content">
        <ng-content></ng-content>
      </div>
      <div class="glass-shine"></div>
    </div>
  `,
  styles: [`
    .glass-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      padding: 2rem;
      position: relative;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
      }
      
      &.elevated {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(0, 56, 255, 0.1);
      }
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 15px 30px rgba(0, 56, 255, 0.15);
        
        .glass-shine {
          opacity: 1;
          transform: translateX(100%);
        }
      }
    }

    .glass-content {
      position: relative;
      z-index: 2;
    }

    .glass-shine {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
      opacity: 0;
      transition: all 0.6s ease;
      z-index: 1;
    }

    .dark-theme .glass-card {
      background: rgba(45, 45, 45, 0.3);
      border-color: rgba(255, 255, 255, 0.1);
    }
  `]
})
export class GlassmorphismCardComponent {
  @Input() elevated: boolean = false;
}