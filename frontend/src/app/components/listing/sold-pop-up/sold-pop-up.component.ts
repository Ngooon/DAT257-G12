import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sold-pop-up',
  templateUrl: './sold-pop-up.component.html',
  styleUrls: ['./sold-pop-up.component.css'],
  standalone: false,
})
export class SoldPopUpComponent {
  purchaseForm: FormGroup;
  garmentId: number;
  errorMessage: string = '';
  stars = [1, 2, 3, 4, 5];
  hoverRating = 0;

  constructor(
    public dialogRef: MatDialogRef<SoldPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.garmentId = data.garmentId;
    this.purchaseForm = this.fb.group({
      buyerId: [null, Validators.required],
      rating: [0, Validators.required],
    });
  }

  setRating(rating: number) {
    this.purchaseForm.get('rating')?.setValue(rating);
  }

  getStarImage(star: number): string {
    const rating = this.purchaseForm.get('rating')?.value;
    if (this.hoverRating >= star || rating >= star) {
      return 'assets/star-filled.png';
    } else {
      return 'assets/star-empty.png';
    }
  }

  completePurchase() {
    if (this.purchaseForm.invalid) {
      this.errorMessage = 'Please fill out the required fields.';
      return;
    }

    const { buyerId, rating } = this.purchaseForm.value;

    const garmentUpdate = { owner: buyerId };
    const garmentUrl = `/api/garments/${this.garmentId}/`;
    const listingUrl = `/api/listings/${this.garmentId}/`;
    const ratingUrl = `/api/rating/rate_user/`;

    this.http.put(garmentUrl, garmentUpdate).subscribe({
      next: () => {
        this.http.delete(listingUrl).subscribe({
          next: () => {
            const ratingPayload = { user_id: buyerId, rating: rating };
            this.http.post(ratingUrl, ratingPayload).subscribe({
              next: () => {
                alert('Purchase completed.');
                this.dialogRef.close('complete');
              },
              error: err => {
                console.error('Error submitting rating', err);
                this.errorMessage = 'Error submitting rating';
              }
            });
          },
          error: err => {
            console.error('Error deleting listing', err);
            this.errorMessage = 'Error deleting listing';
          }
        });
      },
      error: err => {
        console.error('Error updating garment', err);
        this.errorMessage = 'Error updating garment';
      }
    });
  }

  onCancel() {
    this.dialogRef.close('cancel');
  }
}
