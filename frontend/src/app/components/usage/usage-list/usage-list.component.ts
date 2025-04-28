import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';

interface Usage {
  id: number;
  time: string;
  garmentId: number;
  notes: string;
}

interface Garment {
  id: number;
  wardrobe: string;
  name: string;
  color: string;
  size: string;
  brand: string;
  category: string;
}

@Component({
  selector: 'app-usage-list',
  standalone: false,
  templateUrl: './usage-list.component.html',
  styleUrl: './usage-list.component.css'
})
export class UsageListComponent implements OnInit {
  public usages: Usage[] = [];
  public garments: Garment[] = [];
  filterForm: FormGroup;

  constructor(private router: Router, private http: HttpClient, private fb: FormBuilder) {
    this.filterForm = this.fb.group({});
  }

  ngOnInit() {
    this.filterForm = this.fb.group({
      from_time: [''],
      to_time: [''],
      garment_id: ['']
    });

    this.getGarments();
    this.getUsages();
  }

  getGarments() {
    this.http.get<Garment[]>('/api/garments/').subscribe({
      next: (data) => {
        this.garments = data;
      },
      error: (error) => {
        console.error('Failed to load garments', error);
      }
    });
  }

  getUsages(filters: any = {}) {
    let params = new HttpParams();
    if (filters.from_time) {
      params = params.set('from_time', filters.from_time);
    }
    if (filters.to_time) {
      params = params.set('to_time', filters.to_time);
    }
    if (filters.garment_id) {
      params = params.set('garment_id', filters.garment_id);
    }

    this.http.get<{ id: number; time: string; garment: number; notes: string }[]>('/api/usages/', { params }).subscribe({
      next: data => {
        this.usages = data.map(usage => ({
          ...usage,
          garmentId: usage.garment,
        }));
      },
      error: error => {
        console.error('Failed to load usages from API, using mock data.', error);
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

  onApplyFilters() {
    const filters = this.filterForm.value;
    this.getUsages(filters);
  }

  onRowClick(usageId: number) {
    this.router.navigate(['/usages', usageId]);
  }

  garmentToString(garment: Garment): string {
    return `#${garment.id} ${garment.name} (${garment.color}, ${garment.size})`;
  }

  garmentIdToString(garmentId: number): string {
    const garment = this.garments.find(g => g.id === garmentId);
    if (!garment) {
      return `#${garmentId} Unknown Garment`;
    }
    return this.garmentToString(garment);
  }
}
