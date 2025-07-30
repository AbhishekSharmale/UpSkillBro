import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quantum-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="quantum-btn" 
      [class.loading]="loading"
      (click)="onClick()"
      [disabled]="loading">
      <div class="quantum-bg">
        <div class="quantum-particle" *ngFor="let particle of particles" 
             [style.left.%]="particle.x"
             [style.top.%]="particle.y"
             [style.animation-delay]="particle.delay + 's'">
        </div>
      </div>
      <div class="quantum-content">
        <div class="loading-spinner" *ngIf="loading">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <span class="btn-text" [class.hidden]="loading">{{text}}</span>
      </div>
      <div class="quantum-ripple"></div>
    </button>
  `,
  styles: [`
    .quantum-btn {
      position: relative;
      padding: 1rem 2rem;
      background: transparent;
      border: 2px solid var(--primary-blue);
      border-radius: 8px;
      color: var(--primary-blue);
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      overflow: hidden;
      transition: all 0.3s ease;
      min-width: 150px;
      height: 50px;
      
      &:hover:not(:disabled) {
        color: white;
        box-shadow: 0 0 30px rgba(0, 56, 255, 0.5);
        transform: translateY(-2px);
      }
      
      &:disabled {
        cursor: not-allowed;
        opacity: 0.7;
      }
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: var(--primary-gradient);
        transition: left 0.3s ease;
        z-index: 1;
      }
      
      &:hover:not(:disabled)::before {
        left: 0;
      }
    }

    .quantum-bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
    }

    .quantum-particle {
      position: absolute;
      width: 2px;
      height: 2px;
      background: var(--primary-blue);
      border-radius: 50%;
      animation: quantum-float 3s infinite linear;
      opacity: 0.6;
    }

    @keyframes quantum-float {
      0% {
        transform: translateY(100%) scale(0);
        opacity: 0;
      }
      10% {
        opacity: 0.6;
      }
      90% {
        opacity: 0.6;
      }
      100% {
        transform: translateY(-100%) scale(1);
        opacity: 0;
      }
    }

    .quantum-content {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    .loading-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .spinner-ring {
      width: 20px;
      height: 20px;
      border: 2px solid transparent;
      border-top: 2px solid var(--primary-blue);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 2px;
    }

    .spinner-ring:nth-child(2) {
      animation-delay: -0.1s;
      border-top-color: rgba(0, 56, 255, 0.7);
    }

    .spinner-ring:nth-child(3) {
      animation-delay: -0.2s;
      border-top-color: rgba(0, 56, 255, 0.4);
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .btn-text {
      transition: opacity 0.3s ease;
    }

    .btn-text.hidden {
      opacity: 0;
    }

    .quantum-ripple {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: rgba(0, 56, 255, 0.3);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      transition: all 0.6s ease;
    }

    .quantum-btn:active .quantum-ripple {
      width: 300px;
      height: 300px;
    }

    .loading .quantum-particle {
      animation-duration: 1s;
    }
  `]
})
export class QuantumButtonComponent {
  @Input() text: string = 'Submit';
  @Input() loading: boolean = false;
  @Output() clicked = new EventEmitter<void>();

  particles = Array.from({ length: 15 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3
  }));

  onClick() {
    if (!this.loading) {
      this.clicked.emit();
    }
  }
}