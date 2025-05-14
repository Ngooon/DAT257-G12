import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Listing } from '../../../interfaces/listing';
import { PaymentMethod } from '../../../interfaces/payment_method';
import { Garment } from '../../../interfaces/garment';
import { generateFriendlyId } from '../../../utils/friendly-id.utils';

@Component({
  selector: 'app-listing-form',
  standalone: false,
  templateUrl: './listing-form.component.html',
  styleUrl: './listing-form.component.css'
})
export class ListingFormComponent implements OnInit {
  listingForm: FormGroup;
  listingId: number | null = null;
  listing: Listing | null = null;
  paymentMethods: PaymentMethod[] = [];
  garments: Garment[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    this.listingForm = this.fb.group({
      garment: ['', Validators.required],
      description: ['', Validators.required],
      time: ['', Validators.required],
      place: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      payment_method: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadPaymentMethods();
    this.loadGarments();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.listingId = +params['id'];
        this.loadListing(this.listingId);
      }
    });
  }

  loadPaymentMethods(): void {
    this.http.get<PaymentMethod[]>('/api/payment_methods/').subscribe({
      next: data => {
        this.paymentMethods = data;
      },
      error: error => {
        console.error('Failed to load payment methods, using mock data.', error);
        this.paymentMethods = [
          { id: 1, name: 'Swish' },
          { id: 2, name: 'Cash' }
        ];
      }
    });
  }

  loadGarments(): void {
    this.http.get<Garment[]>('/api/garments/?ordering=usage_count').subscribe({
      next: (data) => {
        this.garments = data;
        console.log('Garments loaded:', this.garments);
      },
      error: (err) => {
        console.error('Error fetching garments', err);
        alert('Failed to load garments.');
      }
    });
  }

  getFriendlyGarmentId(garment: Garment): string {
    if (garment) {
      return generateFriendlyId(garment);
    }
    return '';
  }

  loadListing(id: number): void {
    this.http.get<Listing>(`/api/listings/${id}/`).subscribe(data => {
      this.listing = data;
      this.listingForm.patchValue({
        garment: data.garment,
        description: data.description,
        place: data.place,
        price: data.price,
        payment_method: data.payment_method
      });
    });
  }

  onSubmit(): void {
    const listing = {
      ...Object.fromEntries(
        Object.entries(this.listingForm.value).map(([key, value]) => [key, value || null])
      ),
      id: this.listingId ? this.listingId : 0
    };

    if (this.listingId) {
      this.http.put(`/api/listings/${this.listingId}/`, listing).subscribe({
        next: () => {
          console.log('Listing updated successfully');
          window.location.href = '/listings';
        },
        error: error => {
          console.error('Failed to update listing', error);
          alert('Failed to update listing. Please try again.');
        }
      });
    } else {
      this.http.post('/api/listings/', listing).subscribe({
        next: () => {
          console.log('Listing created successfully');
          window.location.href = '/listings';
        },
        error: error => {
          console.error('Failed to create listing', error);
          alert('Failed to create listing. Please try again.');
        }
      });
    }
  }
}


