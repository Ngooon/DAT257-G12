import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Garment } from '../../../interfaces/garment';
import { generateExampleData } from '../../../utils/data-generator.utils';

@Component({
  selector: 'app-wardrobe-list',
  templateUrl: './wardrobe-list.component.html',
  styleUrls: ['./wardrobe-list.component.css'],
  standalone: false,
})

export class WardrobeListComponent implements OnInit {
  filterForm: FormGroup;

  garments: Garment[] = [];
  filteredGarments: Garment[] = [];
  categories: { id: number; name: string }[] = [];

  constructor(private router: Router, private http: HttpClient, private fb: FormBuilder) {
    this.filterForm = this.fb.group({});
  }

  ngOnInit() {
    // Initiera formuläret
    this.filterForm = this.fb.group({
      color: [''],
      size: [''],
      category: [''],
      ordering: ['']
    });


    this.getCategories();
    this.getGarments();
  }

  getCategories() {
    this.http.get<{ id: number; name: string }[]>('/api/Categories/').subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Failed to load categories', error);
      }
    });
  }

  onApplyFilters() {
    const filters = this.filterForm.value;
    this.getGarments(filters);
  }

  getGarments(filters: any = {}) {
    let params = new HttpParams();
    if (filters.ordering) {
      params = params.set('ordering', filters.ordering);
    }
    if (filters.color) {
      params = params.set('color', filters.color);
    }
    if (filters.size) {
      params = params.set('size', filters.size);
    }
    if (filters.category) {
      params = params.set('category', filters.category);
    }


    this.http.get<any[]>('/api/garments/', { params }).subscribe({
      next: data => {
        this.garments = data;
      },
      error: error => {
        console.error('Failed to load garments', error);
      }
    });
  }

  onRowClick(garmentId: number) {
    this.router.navigate(['/garments', garmentId]);
  }

  onFilterChange() {
    this.getGarments();
  }

  onDelete(garmentId: number) {
    this.http.delete(`/api/garments/${garmentId}/`).subscribe(
      () => {
        this.garments = this.garments.filter(garment => garment.id !== garmentId);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onEdit(garmentId: number) {
    this.router.navigate(['/garments/edit', garmentId]);
  }

  generateExampleData() {
    generateExampleData();
  }
}
