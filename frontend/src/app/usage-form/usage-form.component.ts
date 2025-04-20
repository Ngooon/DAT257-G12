import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

interface Usage {
  id: number;
  garmentId: number;
  time: string;
  notes: string;
}

interface Garment {
  id: number;
  name: string;
}

@Component({
  selector: 'app-usage-form',
  standalone: false,
  templateUrl: './usage-form.component.html',
  styleUrls: ['./usage-form.component.css']
})
export class UsageFormComponent implements OnInit {
  usageForm: FormGroup;
  usageId: number | null = null;
  usage: Usage | null = null;
  garments: Garment[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    this.usageForm = this.fb.group({
      garmentId: [null, Validators.required],
      time: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadGarments();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.usageId = +params['id'];
        this.loadUsage(this.usageId);
      }
    });
  }

  loadGarments(): void {
    this.http.get<Garment[]>('/api/garments/').subscribe({
      next: data => {
        this.garments = data;
      },
      error: error => {
        console.error('Failed to load garments', error);
      }
    });
  }

  loadUsage(id: number): void {
    this.http.get<Usage>(`/api/usages/${id}/`).subscribe(data => {
      this.usage = data;
      this.usageForm.patchValue({
        garmentId: data.garmentId,
        time: data.time,
        notes: data.notes
      });
    });
  }

  onSubmit(): void {
    const usage = {
      ...this.usageForm.value,
      id: this.usageId ?? 0
    };

    if (this.usageId) {
      this.http.put(`/api/usages/${this.usageId}/`, usage).subscribe({
        next: () => {
          console.log('Usage updated');
          window.location.href = '/usages';
        },
        error: err => {
          console.error('Update failed', err);
          alert('Update failed. Try again.');
        }
      });
    } else {
      this.http.post('/api/usages/', usage).subscribe({
        next: () => {
          console.log('Usage created');
          window.location.href = '/usages';
        },
        error: err => {
          console.error('Create failed', err);
          alert('Creation failed. Try again.');
        }
      });
    }
  }
}
