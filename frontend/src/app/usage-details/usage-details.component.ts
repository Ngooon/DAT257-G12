import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface Usage {
  id: number;
  time: string;
  garment: number;  
  notes: string;
}

@Component({
  selector: 'app-usage-details',
  standalone: false,
  templateUrl: './usage-details.component.html',
  styleUrls: ['./usage-details.component.css']
})
export class UsageDetailsComponent implements OnInit {
  public id: number = 0;
  public usage: Usage | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    const idString = this.route.snapshot.paramMap.get('id');
    if (idString) {
      this.id = parseInt(idString, 10);
    }
    this.getUsage();
  }

  getUsage() {
    this.http.get<Usage>(`/api/usages/${this.id}/`).subscribe(
      (result) => {
        this.usage = result; 
      },
      (error) => {
        console.error('Error fetching usage:', error);
      }
    );
  }
}
