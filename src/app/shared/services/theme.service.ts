import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkTheme = new BehaviorSubject<boolean>(false);
  isDarkTheme$ = this.isDarkTheme.asObservable();

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      this.setDarkTheme(true);
    } else {
      this.setDarkTheme(false);
    }
  }

  toggleTheme(): void {
    this.setDarkTheme(!this.isDarkTheme.value);
  }

  setDarkTheme(isDark: boolean): void {
    this.isDarkTheme.next(isDark);
    
    if (isDark) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }

  getCurrentTheme(): boolean {
    return this.isDarkTheme.value;
  }
}