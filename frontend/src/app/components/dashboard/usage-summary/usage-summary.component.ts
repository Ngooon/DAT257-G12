import { Component, Input } from '@angular/core';
import { Usage } from '../../../interfaces/usage';
import { generateFriendlyId } from '../../../utils/friendly-id.utils';
import { Garment } from '../../../interfaces/garment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-usage-summary',
  standalone: false,
  templateUrl: './usage-summary.component.html',
  styleUrls: ['./usage-summary.component.css']
})
export class UsageSummaryComponent {
  @Input() garments: Garment[] = []; // Tar emot top 10 usages från DashboardComponent

  constructor(private router: Router, private http: HttpClient){}

  getFriendlyGarmentId(garment: Garment): string {
    if (garment) {
      return generateFriendlyId(garment);
    }
    return 'nåt blev knas';
  }
  onRowClick(garmentId: number) {
    this.router.navigate(['/garments', garmentId]);
  }
}