import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { generateFriendlyId } from '../../../utils/friendly-id.utils';
import { Garment } from '../../../interfaces/garment';
import { Usage } from '../../../interfaces/usage';

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

    this.http.get<Usage[]>('/api/usages/', { params }).subscribe({
      next: (data) => {
        this.usages = data;
      },
      error: error => {
        console.error('Failed to load usages from API.', error);
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

  getFriendlyGarmentId(garment: Garment): string {
    if (garment) {
      return generateFriendlyId(garment);
    }
    return '';
  }
}
