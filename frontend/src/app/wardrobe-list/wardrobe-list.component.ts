import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';

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
  selector: 'app-wardrobe-list',
  templateUrl: './wardrobe-list.component.html',
  styleUrls: ['./wardrobe-list.component.css'],
  standalone: false,
})

export class WardrobeListComponent implements OnInit {
  filterForm: FormGroup;

  garments: Garment[] = []; // Din lista med plagg
  filteredGarments: Garment[] = []; // Filtrerad lista

  constructor(private router: Router, private http: HttpClient, private fb: FormBuilder) {
    this.filterForm = this.fb.group({});
  }

  ngOnInit() {
    // Initiera formuläret
    this.filterForm = this.fb.group({
      color: [''],
      size: [''],
      category: ['']
    });

    // Lyssna på ändringar i formuläret
    this.filterForm.valueChanges.subscribe(filters => {
      this.applyFilters(filters);
    });

    // Ladda initiala data
    this.getGarments();
  }

  getGarments() {
    let params = new HttpParams();
    if (this.filterForm.value.color) {
      params = params.set('color', this.filterForm.value.color);
    }
    if (this.filterForm.value.size) {
      params = params.set('size', this.filterForm.value.size);
    }
    if (this.filterForm.value.category) {
      params = params.set('category', this.filterForm.value.category);
    }

    this.http.get<any[]>('/api/garments/', { params }).subscribe({
      next: data => {
        this.garments = data;
        this.filteredGarments = data;
      },
      error: error => {
        console.error('Failed to load garments', error);
      }
    });
  }

  applyFilters(filters: any): void {
    this.filteredGarments = this.garments.filter(garment =>
      (!filters.color || garment.color.includes(filters.color)) &&
      (!filters.size || garment.size.includes(filters.size)) &&
      (!filters.category || garment.category.includes(filters.category))
    );
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
        this.filteredGarments = this.filteredGarments.filter(garment => garment.id !== garmentId);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onEdit(garmentId: number) {
    this.router.navigate(['/garments/edit', garmentId]);
  }
}
