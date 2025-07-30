import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-ring',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="progress-ring-container">
      <svg class="progress-ring" [attr.width]="size" [attr.height]="size">
        <circle
          class="progress-ring-background"
          [attr.cx]="center"
          [attr.cy]="center"
          [attr.r]="radius"
          fill="transparent"
          [attr.stroke-width]="strokeWidth"
        />
        <circle
          class="progress-ring-progress"
          [attr.cx]="center"
          [attr.cy]="center"
          [attr.r]="radius"
          fill="transparent"
          [attr.stroke-width]="strokeWidth"
          [attr.stroke-dasharray]="circumference"
          [attr.stroke-dashoffset]="strokeDashoffset"
        />
      </svg>
      <div class="progress-text">
        <span class="progress-value">{{progress}}%</span>
        <span class="progress-label" *ngIf="label">{{label}}</span>
      </div>
    </div>
  `,
  styles: [`
    .progress-ring-container {
      position: relative;
      display: inline-block;
    }

    .progress-ring {
      transform: rotate(-90deg);
    }

    .progress-ring-background {
      stroke: var(--border-color);
    }

    .progress-ring-progress {
      stroke: var(--primary-blue);
      stroke-linecap: round;
      transition: stroke-dashoffset 1s ease-in-out;
    }

    .progress-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }

    .progress-value {
      display: block;
      font-size: 1.5rem;
      font-weight: 700;
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .progress-label {
      display: block;
      font-size: 0.8rem;
      color: var(--secondary-gray);
      margin-top: 4px;
    }
  `]
})
export class ProgressRingComponent implements OnInit {
  @Input() progress: number = 0;
  @Input() size: number = 120;
  @Input() strokeWidth: number = 8;
  @Input() label: string = '';

  center: number = 0;
  radius: number = 0;
  circumference: number = 0;
  strokeDashoffset: number = 0;

  ngOnInit() {
    this.center = this.size / 2;
    this.radius = this.center - this.strokeWidth / 2;
    this.circumference = 2 * Math.PI * this.radius;
    this.strokeDashoffset = this.circumference - (this.progress / 100) * this.circumference;
  }
}