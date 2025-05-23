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

    this.http.get(`/api/garments/${this.garmentId}/`).subscribe({
      next: (garment: any) => {
        console.log('Fetched garment:', garment);
        const garmentUpdate = {
          ...garment,
          owner: buyerId,
          category: garment.category.id
        };

        const garmentUrl = `/api/garments/${this.garmentId}/`;

        this.http.put(garmentUrl, garmentUpdate).subscribe({
          next: () => {
            this.dialogRef.close('complete');
          },
          error: err => {
            console.error('Error updating garment', err);
            this.errorMessage = 'Error updating garment';
          }
        });
      },
      error: err => {
        console.error('Error fetching garment', err);
        this.errorMessage = 'Error fetching garment';
      }
    });
  }

  onCancel() {
    this.dialogRef.close('cancel');
  }
}
