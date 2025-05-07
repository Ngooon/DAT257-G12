import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Listing } from '../../../interfaces/listing';
import { Router } from '@angular/router';
import { Garment } from '../../../interfaces/garment';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public topUsages: Garment[] = [];
  listings: Listing[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.getListings();
    this.fetchUsages();
  }

  getListings() {
    this.http.get<Listing[]>('/api/listings').subscribe({
      next: data => {
        this.listings = data.slice(0, 10); // Begränsa till de 10 första resultaten
      },
      error: error => {
        console.error('Failed to load listings', error);
      }
    });
  }

  // public usages: Usage[] = []; // Alla usages hämtade från backend
   // Top 10 mest använda plaggen


  // Hämta alla usages från backend
  fetchUsages(): void {
    this.http.get<Garment[]>('/api/garments/?ordering=-usage_count').subscribe({
      next: (data) => {
        this.topUsages = data.slice(0, 10); // Begränsa till de 10 första resultaten
        console.log('Top 10 garments fetched:', this.topUsages);
      },
      error: (error) => {
        console.error('Failed to load top usages from API.', error);
      }
    });
  }
}
