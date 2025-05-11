import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { SoldPopUpComponent } from '../sold-pop-up/sold-pop-up.component'; // Adjust path

@Component({
  selector: 'app-listing-list',
  standalone: false,
  templateUrl: './listing-list.component.html',
  styleUrls: ['./listing-list.component.css']
})

export class ListingListComponent implements OnInit {
  filterForm: FormGroup;
  listings: any[] = [];
  categories: { id: number; name: string }[] = [];

  paymentMethods: { id: number; name: string }[] = [
    { id: 1, name: 'Swish' },
    { id: 2, name: 'Cash' }
  ];

  constructor(
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder,
    private dialog: MatDialog // Inject MatDialog service
  ) {
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

    this.http.get<any[]>('/api/listings/', { params }).subscribe({
      next: data => {
        this.listings = data;
      },
      error: error => {
        console.error('Failed to load listings', error);
      }
    });
  }

  onRowClick(garmentId: number) {
    this.router.navigate(['/listings', garmentId]);
  }

  onSold(garmentId: number, listingId: number) {
    const dialogRef = this.dialog.open(SoldPopUpComponent, {
      width: '400px',
      data: { garmentId: garmentId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'complete') {
        this.http.delete(`/api/listings/${listingId}/`).subscribe(
          () => {
            this.listings = this.listings.filter(garment => garment.id !== garmentId);
          },
          (error) => {
            console.error(error);
          }
        );
        alert('Garment sold successfully!');
      } else {
        console.log('Action canceled');
      }
    });
  }

  onEdit(garmentId: number) {
    this.router.navigate(['/listings/edit', garmentId]);
  }


  onDelete(garmentId: number) {
    this.http.delete(`/api/listings/${garmentId}/`).subscribe(
      () => {
        this.listings = this.listings.filter(garment => garment.id !== garmentId);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
