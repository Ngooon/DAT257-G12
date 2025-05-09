import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Garment } from '../../../interfaces/garment';
import { ChartModule } from 'primeng/chart';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-garment-details',
  standalone: false,
  templateUrl: './garment-details.component.html',
  styleUrl: './garment-details.component.css'
})
export class GarmentDetailsComponent implements OnInit {
  public id: number = 0;
  public garment: Garment | null = null;

  public graphData: any = {};
  public graphOptions = {
    title: {
      display: true,
      text: 'Usage over time',
      fontSize: 32,
      position: 'top',
    },
  };

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    const idString = this.route.snapshot.paramMap.get('id');
    if (idString) {
      this.id = parseInt(idString, 10);
    }
    this.getGarment();
    this.plotStats();
  }

  getGarment() {
    this.http.get<Garment>(`/api/garments/${this.id}/`).subscribe(
      (result) => {
        this.garment = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  async plotStats() {
    try {
      const usageStatistics = await this.getUsageStatistics().toPromise();
      const categoryStatistics = await this.getCategoryStatistics().toPromise();

      const weekLabels = usageStatistics?.labels ?? [];

      this.graphData = {
        labels: weekLabels,
        datasets: [
          {
            label: 'Garment Usage',
            data: usageStatistics?.data ?? [],
            fill: false,
            borderColor: '#4bc0c0',
            tension: 0.1
          },
          {
            label: 'Category Average Usage',
            data: categoryStatistics?.data ?? [],
            fill: false,
            borderColor: '#565656',
            tension: 0.1
          }
        ]
      };

      // Tvinga grafen att uppdateras
      this.graphData = { ...this.graphData };
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  }

  getUsageStatistics() {
    return this.http.get<any>(`/api/statistics/garment/?id=${this.id}`).pipe(
      map((result) => {
        const garmentStatistics = result.find((item: any) => item.id === this.id);
        if (garmentStatistics) {
          const usageHistory = garmentStatistics.statistics.usage_history;

          // Transformera datum till veckonummer
          const weekLabels = Object.keys(usageHistory).map(date => this.getWeekNumber(new Date(date)));

          return {
            labels: weekLabels,
            data: Object.values(usageHistory)
          };
        } else {
          throw new Error(`No statistics found for garment with id ${this.id}`);
        }
      })
    );
  }

  getCategoryStatistics() {
    return this.http.get<any>(`/api/statistics/category/?id=${this.garment?.category.id}`).pipe(
      map((result) => {
        const categoryStatistics = result.find((item: any) => item.id === this.garment?.category.id);
        if (categoryStatistics) {
          const categoryUsageHistory = categoryStatistics.statistics.usage_history;

          return {
            data: Object.values(categoryUsageHistory)
          };
        } else {
          throw new Error(`No category statistics found for garment with id ${this.garment?.category.id}`);
        }
      })
    );
  }

  // Hjälpfunktion för att beräkna veckonummer
  getWeekNumber(date: Date): string {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    return `Week ${weekNumber}`;
  }
}
