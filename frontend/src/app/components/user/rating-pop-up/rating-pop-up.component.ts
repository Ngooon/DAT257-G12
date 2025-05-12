import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-rating-pop-up',
  standalone: false,
  templateUrl: './rating-pop-up.component.html',
  styleUrl: './rating-pop-up.component.css'
})
export class RatingPopUpComponent {
  rateForm: FormGroup;
  errorMessage: string = '';
  stars = [1, 2, 3, 4, 5];
  hoverRating = 0;

  constructor(
    public dialogRef: MatDialogRef<RatingPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.rateForm = this.fb.group({
      userId: [data.userId, Validators.required],
      rating: [0, Validators.required],
    });
    console.log('Received userId in dialog:', data.userId);
  }

  setRating(rating: number) {
    this.rateForm.get('rating')?.setValue(rating);
  }

  getStarImage(star: number): string {
    const rating = this.rateForm.get('rating')?.value;
    if (this.hoverRating >= star || rating >= star) {
      return 'assets/star-filled.png';
    } else {
      return 'assets/star-empty.png';
    }
  }

  rateUser() {

    const { userId, rating } = this.rateForm.value;

    const payload = {
      rated_user: userId,
      score: rating,
    }

    console.log('Payload:', payload);

    this.http.post('/api/rating/rate_user/', payload).subscribe({
      next: (response) => {
        console.log('Rating submitted:', response);
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Failed to submit rating', error);
        this.errorMessage = 'Failed to submit rating. Please try again.';
      }
    });
  }

  onCancel() {
    this.dialogRef.close('cancel');
  }

}
