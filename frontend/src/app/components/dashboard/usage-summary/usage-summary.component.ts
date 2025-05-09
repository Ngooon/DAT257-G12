import { Component, Input, OnInit } from '@angular/core';
import { Garment } from '../../../interfaces/garment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usage-summary',
  standalone: false,
  templateUrl: './usage-summary.component.html',
  styleUrls: ['./usage-summary.component.css']
})
export class UsageSummaryComponent implements OnInit {
  @Input() garments: Garment[] = []; // Tar emot top 10 usages från DashboardComponent
  categories: { id: number; name: string }[] = []; // Lista över kategorier
  selectedCategory = -1;  // Vald kategori

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchCategories(); // Hämta kategorier vid initiering
  }

  // Hämta kategorier från backend
  fetchCategories(): void {
    this.http.get<{ id: number; name: string }[]>('/api/Categories').subscribe({
      next: (data) => {
        this.categories = [{ id: -1, name: 'All' }, ...data]; // Lägg till "All" som standardval
        console.log('Categories fetched:', this.categories); // Logga kategorier
      },
      error: (error) => {
        console.error('Failed to load categories', error);
      }
    });
  }

  // Hämta plagg baserat på vald kategori
  filterByCategory(): void {
    // Bas-URL utan kategori-param
    let url = `/api/garments/?ordering=-usage_count`;
  
    // Lägg bara till &category= om ett riktigt kategori-id valts (> 0)
    if (this.selectedCategory > 0) {
      url += `&category=${this.selectedCategory}`;
    }
  
    this.http.get<Garment[]>(url).subscribe({
      next: data => {
        // Vill du visa TOP 10 när en specifik kategori är vald?
        if (this.selectedCategory > 0) {
          this.garments = data.slice(0, 10);
        } else {
          // All valt → visa alla plagg
          this.garments = data;
        }
      },
      error: err => console.error(err)
    });
  }
  

  getFriendlyGarmentId(garment: Garment): string {
    return garment.name; // Anpassa om du vill använda en vänlig ID-generator
  }

  onRowClick(garmentId: number): void {
    this.router.navigate(['/garments', garmentId]);
  }
}