import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Listing } from '../../../interfaces/listing';

@Component({
  selector: 'app-listing-details',
  standalone: false,
  templateUrl: './listing-details.component.html',
  styleUrl: './listing-details.component.css'
})
export class ListingDetailsComponent implements OnInit {
  public id: number = 0;
  public listing: Listing | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    const idString = this.route.snapshot.paramMap.get('id');
    if (idString) {
      this.id = parseInt(idString, 10);
    }
    this.getListing();
  }

  getListing() {
    this.http.get<Listing>(`/api/listings/${this.id}/`).subscribe(
      (result) => {
        this.listing = result;
      },
      (error) => {
        console.error('Failed to fetch listing:', error);
      }
    );
  }
}
