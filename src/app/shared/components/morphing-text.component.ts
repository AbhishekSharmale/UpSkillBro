import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-morphing-text',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="morphing-text">
      <span class="text-display">{{displayText}}</span>
      <span class="cursor">|</span>
    </span>
  `,
  styles: [`
    .morphing-text {
      display: inline-block;
      font-weight: 800;
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .text-display {
      display: inline-block;
      min-height: 1.2em;
    }

    .cursor {
      animation: blink 1s infinite;
      color: var(--primary-blue);
    }

    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }
  `]
})
export class MorphingTextComponent implements OnInit, OnDestroy {
  @Input() texts: string[] = [];
  @Input() speed: number = 100;
  
  displayText = '';
  private currentIndex = 0;
  private currentCharIndex = 0;
  private isDeleting = false;
  private timeoutId: any;

  ngOnInit() {
    if (this.texts.length > 0) {
      this.typeText();
    }
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  private typeText() {
    const currentText = this.texts[this.currentIndex];
    
    if (this.isDeleting) {
      this.displayText = currentText.substring(0, this.currentCharIndex - 1);
      this.currentCharIndex--;
    } else {
      this.displayText = currentText.substring(0, this.currentCharIndex + 1);
      this.currentCharIndex++;
    }

    let typeSpeed = this.speed;

    if (this.isDeleting) {
      typeSpeed /= 2;
    }

    if (!this.isDeleting && this.currentCharIndex === currentText.length) {
      typeSpeed = 2000;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentCharIndex === 0) {
      this.isDeleting = false;
      this.currentIndex = (this.currentIndex + 1) % this.texts.length;
      typeSpeed = 500;
    }

    this.timeoutId = setTimeout(() => this.typeText(), typeSpeed);
  }
}