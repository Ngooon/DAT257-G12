import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Listing } from '../../../interfaces/listing';


@Component({
  selector: 'app-market-list',
  standalone: false,
  templateUrl: './market-list.component.html',
  styleUrls: ['./market-list.component.css']
})
export class MarketListComponent implements OnInit {
  filterForm: FormGroup;

  listings: Listing[] = [];
  categories: { id: number; name: string }[] = [];

  paymentMethods: { id: number; name: string }[] = [
    { id: 1, name: 'Swish' },
    { id: 2, name: 'Cash' }
  ];

  constructor(private router: Router, private http: HttpClient, private fb: FormBuilder) {
    this.filterForm = this.fb.group({});
  }

  ngOnInit() {
    this.filterForm = this.fb.group({
      category: [''],
      color: [''],
      size: [''],
      max_price: [''],
      min_price: [''],
      ordering: [''],
      payment_method: [''],
      place: [''],
      price: ['']
    });

    this.getCategories();
    this.getListings();
  }

  getCategories() {
    this.http.get<{ id: number; name: string }[]>('/api/Categories/').subscribe({
      next: (data) => this.categories = data,
      error: (error) => console.error('Failed to load categories', error)
    });
  }

  onApplyFilters() {
    const filters = this.filterForm.value;
    this.getListings(filters);
  }

  getListings(filters: any = {}) {
    let params = new HttpParams();

    if (filters.category) params = params.set("garment_category", filters.category);
    if (filters.color) params = params.set("garment_color", filters.color);
    if (filters.size) params = params.set("garment_size", filters.size);
    if (filters.max_price) params = params.set("max_price", filters.max_price);
    if (filters.min_price) params = params.set("min_price", filters.min_price);
    if (filters.ordering) params = params.set("ordering", filters.ordering);
    if (filters.payment_method) params = params.set("payment_method", filters.payment_method);
    if (filters.place) params = params.set("place", filters.place);
    if (filters.price) params = params.set("price", filters.price);

    interface MarketListing 

    this.http.get<Listing[]>('/api/market/', { params }).subscribe({
      next: data => this.listings = data,
      error: error => console.error('Failed to load listings', error)
    });
  }

  onRowClick(garmentId: number) {
    this.router.navigate(['/listings', garmentId]);
  }

  onContact(garmentId: number): void {
    const PlaceholderUrl = 'https://www.nyan.cat/';
    window.open(PlaceholderUrl, '_blank');
  }

}
