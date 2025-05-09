import { Component, OnInit } from '@angular/core';
import { Listing } from '../../../interfaces/listing';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  listings: Listing[] = [];
  public id: number = 1;
  
  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    const idString = this.route.snapshot.paramMap.get('id');
    if (idString) {
      this.id = parseInt(idString, 10);
    }
    this.getListings();
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

}
