import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-holographic-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HolographicInputComponent),
      multi: true
    }
  ],
  template: `
    <div class="holo-input-container" [class.focused]="isFocused" [class.filled]="value">
      <div class="holo-field">
        <input 
          #input
          [type]="type"
          [value]="value"
          (input)="onInput($event)"
          (focus)="onFocus()"
          (blur)="onBlur()"
          class="holo-input"
          [placeholder]="''"
        />
        <label class="holo-label">{{label}}</label>
        <div class="holo-border">
          <div class="border-line top"></div>
          <div class="border-line right"></div>
          <div class="border-line bottom"></div>
          <div class="border-line left"></div>
        </div>
        <div class="holo-glow"></div>
        <div class="scan-line"></div>
      </div>
    </div>
  `,
  styles: [`
    .holo-input-container {
      position: relative;
      margin: 1.5rem 0;
    }

    .holo-field {
      position: relative;
      background: rgba(0, 56, 255, 0.05);
      border-radius: 8px;
      overflow: hidden;
    }

    .holo-input {
      width: 100%;
      padding: 1rem;
      background: transparent;
      border: none;
      outline: none;
      color: var(--black-text);
      font-size: 1rem;
      z-index: 2;
      position: relative;
    }

    .holo-label {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--secondary-gray);
      font-size: 1rem;
      pointer-events: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 3;
    }

    .focused .holo-label,
    .filled .holo-label {
      top: 0.5rem;
      font-size: 0.75rem;
      color: var(--primary-blue);
      transform: translateY(0);
    }

    .holo-border {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
    }

    .border-line {
      position: absolute;
      background: var(--primary-blue);
      opacity: 0;
      transition: all 0.3s ease;
    }

    .border-line.top,
    .border-line.bottom {
      height: 2px;
      width: 0;
    }

    .border-line.left,
    .border-line.right {
      width: 2px;
      height: 0;
    }

    .border-line.top {
      top: 0;
      left: 0;
    }

    .border-line.right {
      top: 0;
      right: 0;
    }

    .border-line.bottom {
      bottom: 0;
      right: 0;
    }

    .border-line.left {
      bottom: 0;
      left: 0;
    }

    .focused .border-line {
      opacity: 1;
    }

    .focused .border-line.top {
      width: 100%;
      transition-delay: 0s;
    }

    .focused .border-line.right {
      height: 100%;
      transition-delay: 0.1s;
    }

    .focused .border-line.bottom {
      width: 100%;
      transition-delay: 0.2s;
    }

    .focused .border-line.left {
      height: 100%;
      transition-delay: 0.3s;
    }

    .holo-glow {
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: var(--primary-gradient);
      border-radius: 10px;
      opacity: 0;
      filter: blur(8px);
      transition: opacity 0.3s ease;
      z-index: -1;
    }

    .focused .holo-glow {
      opacity: 0.3;
    }

    .scan-line {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(0, 56, 255, 0.3), transparent);
      transition: left 0.6s ease;
    }

    .focused .scan-line {
      left: 100%;
    }

    .dark-theme .holo-field {
      background: rgba(79, 142, 255, 0.1);
    }
  `]
})
export class HolographicInputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = 'text';
  
  value: string = '';
  isFocused: boolean = false;
  
  private onChange = (value: string) => {};
  private onTouched = () => {};

  onInput(event: any) {
    this.value = event.target.value;
    this.onChange(this.value);
  }

  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    this.isFocused = false;
    this.onTouched();
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}