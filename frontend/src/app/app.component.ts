import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  currentTheme: string = 'auto';

  setTheme(theme: string): void {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
  }

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme') || this.currentTheme;
    this.setTheme(savedTheme);
  }
}
