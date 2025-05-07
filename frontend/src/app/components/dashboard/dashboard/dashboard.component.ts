import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Listing } from '../../../interfaces/listing';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  usages: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  listings: Listing[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.getListings();
  }

  getListings() {
    this.http.get<Listing[]>('/api/listings').subscribe({
      next: data => {
        this.listings = data;
      },
      error: error => {
        console.error('Failed to load listings', error);
      }
    });
  }
}
