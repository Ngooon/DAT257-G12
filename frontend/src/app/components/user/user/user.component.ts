import { Component, OnInit } from '@angular/core';
import { Listing } from '../../../interfaces/listing';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../interfaces/user';
import { RatingPopUpComponent } from '../rating-pop-up/rating-pop-up.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  listings: Listing[] = [];
  public id: number = 1;
  user: any; // Användardata
  rating: any;
  
  
  constructor(private route: ActivatedRoute, private dialog: MatDialog, private http: HttpClient) { }

  ngOnInit(): void {
    const idString = this.route.snapshot.paramMap.get('id');
    if (idString) {
      this.id = parseInt(idString, 10);
    }
    this.getListings();
    this.getUser();
    this.getRating();
  }
  getListings() {
    this.http.get<Listing[]>(`/api/market/?ordering=-time&user_id=${this.id}`).subscribe({
      next: data => {
        this.listings = data.slice(0, 5);
      },
      error: error => {
        console.error('Failed to load listings', error);
      }
    });
  }

  getUser() {
    this.http.get(`/api/users/${this.id}`).subscribe({
      next: data => {
        this.user = data;
      },
      error: error => {
        console.error('Failed to load user data', error);
      }
    });
  }

  getRating() {
    this.http.get(`/api/rating/get-rating/?user_id=${this.id}`).subscribe({
      next: data => {
        this.rating = data;
        console.log('Rating fetched:', this.rating);
      },
      error: error => {
        console.error('Failed to load user data', error);
      }
    });
  }

  onRate() {
    const dialogRef = this.dialog.open(RatingPopUpComponent, {
      width: '400px',
      data: { userId: this.id }
      });
    }

}
