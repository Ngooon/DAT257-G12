import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-usage-summary',
  standalone: false,
  templateUrl: './usage-summary.component.html',
  styleUrl: './usage-summary.component.css'
})
export class UsageSummaryComponent {
  @Input() usages: any[] = [];
}
