
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

interface Garment {
  id: number;
  wardrobe: string;
  name: string;
  color: string;
  size: string;
  brand: string;
  category: string;
}

interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-garment-form',
  standalone: false,
  templateUrl: './garment-form.component.html',
  styleUrl: './garment-form.component.css'
})

export class GarmentFormComponent implements OnInit {
  garmentForm: FormGroup;
  garmentId: number | null = null;
  garment: Garment | null = null;
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    this.garmentForm = this.fb.group({
      name: ['', Validators.required],
      wardrobe: ['', Validators.required],
      color: ['', Validators.required],
      size: ['', Validators.required],
      brand: ['', Validators.required],
      category: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.garmentId = +params['id'];
        this.loadGarment(this.garmentId);
      }
    });
  }

  loadCategories(): void {
    this.http.get<Category[]>('/api/Categories/').subscribe({
      next: data => {
        this.categories = data;
      },
      error: error => {
        console.error('Failed to load categories from API, using mock data.', error);
        this.categories = ['Shirts', 'Pants', 'Shoes', 'Accessories'].map((name, index) => ({ id: index + 1, name }));
      }
    });
  }

  loadGarment(id: number): void {
    this.http.get<Garment>(`/api/garments/${id}/`).subscribe(data => {
      this.garment = data;
      this.garmentForm.patchValue({
        name: data.name,
        wardrobe: data.wardrobe,
        color: data.color,
        size: data.size,
        brand: data.brand,
        category: data.category
      });
    });
  }

  onSubmit(): void {
    const garment = {
      ...Object.fromEntries(
        Object.entries(this.garmentForm.value).map(([key, value]) => [key, value || null])
      ),
      id: this.garmentId ? this.garmentId : 0
    };

    if (this.garmentId) {
      this.http.put(`/api/garments/${this.garmentId}/`, garment).subscribe({
        next: () => {
          console.log('Garment updated successfully');
          window.location.href = '/wardrobe';
        },
        error: error => {
          console.error('Failed to update garment', error);
          alert('Failed to update garment. Please try again.');
        }
      });
    } else {
      this.http.post('/api/garments/', garment).subscribe({
        next: () => {
          console.log('Garment created successfully');
          window.location.href = '/wardrobe';
        },
        error: error => {
          console.error('Failed to create garment', error);
          alert('Failed to create garment. Please try again.');
        }
      });
    }
  }
}