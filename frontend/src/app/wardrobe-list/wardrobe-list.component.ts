import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';

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
  // imports: [CommonModule],
  selector: 'app-wardrobe-list',
  templateUrl: './wardrobe-list.component.html',
  styleUrls: ['./wardrobe-list.component.css'],
  standalone: false,
})

export class WardrobeListComponent implements OnInit {
  public garments: Garment[] = [];

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.getGarments();
  }

  getGarments() {
    this.http.get<Garment[]>('/api/garments/').subscribe(
      (result) => {
        this.garments = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onRowClick(garmentId: number) {
    this.router.navigate(['/garments', garmentId]);
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
}
