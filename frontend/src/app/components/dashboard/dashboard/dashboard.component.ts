import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Listing } from '../../../interfaces/listing';
import { Router } from '@angular/router';
import { Garment } from '../../../interfaces/garment';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public topUsages: Garment[] = [];
  listings: Listing[] = [];

  public graphData: any = {};
  public graphOptions = {
    title: {
      display: true,
      text: 'Usage over time',
      fontSize: 32,
      position: 'top',
    },
  };

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.getListings();
    this.fetchUsages();
    this.plotStats();
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


  plotStats() {
    this.http.get<any>(`/api/statistics/category/`).subscribe({
      next: (result) => {
        const labels = result.length > 0 ? Object.keys(result[0].statistics.usage_history) : [];
        const datasets = result.map((category: any) => ({
          label: category.name,
          data: Object.values(category.statistics.usage_history),
          fill: false,
          // borderColor: '#000000', // Fixed color
          tension: 0.1
        }));

        this.graphData = {
          labels: labels,
          datasets: datasets
        };

        // Force the graph to update
        this.graphData = { ...this.graphData };
      },
      error: (error) => {
        console.error('Error fetching category statistics:', error);
      }
    });
  }

  // Hjälpfunktion för att beräkna veckonummer
  getWeekNumber(date: Date): string {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    return `Week ${weekNumber}`;
  }
}
