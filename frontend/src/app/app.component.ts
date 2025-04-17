import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Wardrobe Curator Application';
  loginWithFacebook() {
    window.location.href = 'http://localhost:8000/auth/facebook';
  }
}

