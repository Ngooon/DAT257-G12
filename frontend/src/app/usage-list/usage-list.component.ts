import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Usage {
  id: number;
  time: string;
  garmentId: number;
  notes: string;
}

@Component({
  selector: 'app-usage-list',
  standalone: false,
  templateUrl: './usage-list.component.html',
  styleUrl: './usage-list.component.css'
})
export class UsageListComponent implements OnInit {
  public usages: Usage[] = [];

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.getUsages();
  }

  getUsages() {
    this.http.get<{ id: number; time: string; garment: number; notes: string }[]>('/api/usages/').subscribe({
      next: data => {
        this.usages = data.map(usage => ({
          ...usage,
          garmentId: usage.garment,
        }));
      },
      error: error => {
        console.error('Failed to load categories from API, using mock data.', error);
        this.usages = [
          {
            id: 1,
            time: '2023-10-01',
            garmentId: 1,
            notes: 'Wore this on a sunny day.'
          },
          {
            id: 2,
            time: '2023-10-02',
            garmentId: 2,
            notes: 'Perfect for a casual outing.'
          },
          {
            id: 3,
            time: '2023-10-03',
            garmentId: 3,
            notes: 'Great for a formal event.'
          }
        ];
      }
    });
  }

  onRowClick(usageId: number) {
    this.router.navigate(['/usages', usageId]);
  }
}
