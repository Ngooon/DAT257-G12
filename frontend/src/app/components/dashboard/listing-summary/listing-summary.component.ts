import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-listing-summary',
  standalone: false,
  templateUrl: './listing-summary.component.html',
  styleUrl: './listing-summary.component.css'
})
export class ListingSummaryComponent {
@Input() listings: any[] = [];

constructor(private router: Router, private http: HttpClient) {}

onRowClick(garmentId: number) {
  this.router.navigate(['/listings', garmentId]);
}

calculateDaysSince(dateString: string): number {
  const listingDate = new Date(dateString);
  const today = new Date();
  const timeDifference = today.getTime() - listingDate.getTime();
  return Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Konvertera millisekunder till dagar
}

}
