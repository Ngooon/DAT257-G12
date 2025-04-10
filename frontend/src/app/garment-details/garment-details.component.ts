import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-garment-details',
  standalone: false,
  templateUrl: './garment-details.component.html',
  styleUrl: './garment-details.component.css'
})
export class GarmentDetailsComponent implements OnInit {
  public id: number = 0;
  public garment: Garment | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    const idString = this.route.snapshot.paramMap.get('id');
    if (idString) {
      this.id = parseInt(idString, 10);
    }
    this.getGarment();
  }

  getGarment() {
    this.http.get<Garment>(`/api/garments/${this.id}/`).subscribe(
      (result) => {
        this.garment = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
