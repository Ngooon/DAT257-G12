import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Listing } from '../../../interfaces/listing';
import { Router } from '@angular/router';
import { Garment } from '../../../interfaces/garment';
import { map } from 'rxjs/operators';
import { User } from '../../../interfaces/user';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public topUsages: Garment[] = [];
  listings: Listing[] = [];
  loggedIn: boolean = false; // Flagga för att kontrollera inloggning
  user: any; // Användardata

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
    if (localStorage.getItem('auth_token')) {
      this.loggedIn = true;
    }
    this.getListings();
    this.fetchUsages();
    this.plotStats();
    this.getUser(); // Hämta användardata vid initiering
  }

  getListings() {
    this.http.get<Listing[]>('/api/listings/?ordering=-time').subscribe({
      next: data => {
        this.listings = data.slice(0, 5); // Begränsa till de 10 första resultaten
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
        const labels = result.length > 0 ? Object.keys(result[0].statistics.usage_history).map(date => this.getWeekNumber(new Date(date))) : [];

        let categoryMap: Record<string, string> = {};

        this.http.get<any[]>('/api/Categories/').subscribe({
          next: (categories) => {
            categoryMap = categories.reduce((map, category) => {
              map[category.id] = category.name;
              return map;
            }, {} as Record<string, string>);
            console.log('Category map:', categoryMap);
            const datasets = result.map((category: any) => ({
              label: categoryMap[category.id],
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
            console.error('Error fetching categories:', error);
          }
        });
        console.log('Category map:', categoryMap);

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
  getUser(): void {
    this.http.get<any>('/api/users/me').subscribe({
      next: (data) => {
        this.user = data;
        console.log('User fetched:', this.user);
      },
      error: (error) => {
        console.error('Failed to load user from API.', error);
        // mock
        this.user = {
          id: 1,
          username: 'mockuser'
        };
        console.log('Mock user:', this.user);
      }
    });
  }
}
