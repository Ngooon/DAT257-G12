import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Wardrobe Curator Application';

  constructor(private route: ActivatedRoute) {}

  loginWithFacebook() {
    window.location.href = 'http://localhost:8000/auth/facebook';

  }

  logout(){
    localStorage.clear();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        localStorage.setItem('auth_token', token);
        // Optionally decode token to get user info
      }
    });
  }
  
}

