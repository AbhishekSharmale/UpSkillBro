import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-floating-elements',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="floating-container">
      <div class="floating-element" 
           *ngFor="let element of elements; trackBy: trackByIndex"
           [style.left.px]="element.x"
           [style.top.px]="element.y"
           [style.animation-delay]="element.delay + 's'"
           [style.animation-duration]="element.duration + 's'">
        {{element.icon}}
      </div>
    </div>
  `,
  styles: [`
    .floating-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
      overflow: hidden;
    }

    .floating-element {
      position: absolute;
      font-size: 2rem;
      opacity: 0.1;
      animation: float-up infinite linear;
      pointer-events: none;
    }

    @keyframes float-up {
      0% {
        transform: translateY(100vh) rotate(0deg);
        opacity: 0;
      }
      10% {
        opacity: 0.1;
      }
      90% {
        opacity: 0.1;
      }
      100% {
        transform: translateY(-100px) rotate(360deg);
        opacity: 0;
      }
    }

    .dark-theme .floating-element {
      opacity: 0.05;
    }
  `]
})
export class FloatingElementsComponent {
  elements = [
    { icon: '💻', x: 100, y: 0, delay: 0, duration: 15 },
    { icon: '🚀', x: 300, y: 0, delay: 3, duration: 18 },
    { icon: '⚡', x: 500, y: 0, delay: 6, duration: 12 },
    { icon: '🎯', x: 700, y: 0, delay: 9, duration: 20 },
    { icon: '💡', x: 900, y: 0, delay: 12, duration: 16 },
    { icon: '🔥', x: 200, y: 0, delay: 15, duration: 14 },
    { icon: '⭐', x: 400, y: 0, delay: 18, duration: 17 },
    { icon: '🎨', x: 600, y: 0, delay: 21, duration: 13 }
  ];

  trackByIndex(index: number): number {
    return index;
  }
}