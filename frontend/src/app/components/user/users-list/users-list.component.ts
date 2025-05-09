import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../../../interfaces/user';


@Component({
  selector: 'app-users-list',
  standalone: false,
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit {

  users: User[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.getUsers();
  }


  getUsers() {
    this.http.get<User[]>('/api/users/').subscribe({
      next: data => {
        this.users = data;
      },
      error: error => {
        console.error('Failed to load users', error);
        this.users = [
          {
          id: 1,
          username: 'mockuser'
          },
          {
          id: 2,
          username: 'mockuser2'
          }
      
      ];
      }
    });
  }

  onRowClick(userId: number) {
    this.router.navigate(['/users', userId]);
  }
}
