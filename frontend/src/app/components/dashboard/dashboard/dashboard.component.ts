import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usage } from '../../../interfaces/usage';
import { Garment } from '../../../interfaces/garment';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // public usages: Usage[] = []; // Alla usages hämtade från backend
  public topUsages: Garment[] = []; // Top 10 mest använda plaggen

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUsages();
  }

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