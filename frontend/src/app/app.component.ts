import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  currentTheme: string = 'auto';

  constructor(private route: ActivatedRoute) { }

  setTheme(theme: string): void {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
  }

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme') || this.currentTheme;
    this.setTheme(savedTheme);

    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        localStorage.setItem('auth_token', token);
        // Optionally decode token to get user info
      }
    });
  }

  loginWithFacebook() {
    window.location.href = 'http://localhost:8000/auth/facebook';
  }

  logout() {
    localStorage.clear();
  }

  guestlogin(){
    window.location.href = 'http://localhost:8000/auth/guest';
  }
}

