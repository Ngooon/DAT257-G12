import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';

interface Garment {
  id: number;
  description: string;
  color: string;
  size: string;
  date_added: string;
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
    // this.http.get<Garment[]>('/api/garments').subscribe(
    //   (result) => {
    //     this.garments = result;
    //   },
    //   (error) => {
    //     console.error(error);
    //   }
    // );
    this.garments = [
      { id: 1, description: 'T-shirt', color: 'Red', size: 'M', date_added: '2023-10-01' },
      { id: 2, description: 'Jeans', color: 'Blue', size: 'L', date_added: '2023-10-02' },
      { id: 3, description: 'Jacket', color: 'Black', size: 'XL', date_added: '2023-10-03' },
      { id: 4, description: 'Sweater', color: 'Green', size: 'S', date_added: '2023-10-04' },
    ];
  }

  onRowClick(garmentId: number) {
    this.router.navigate(['/garments', garmentId]);
  }

  onDelete(garmentId: number) {
    this.http.delete(`/api/garments/${garmentId}`).subscribe(
      () => {
        this.garments = this.garments.filter(garment => garment.id !== garmentId);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
