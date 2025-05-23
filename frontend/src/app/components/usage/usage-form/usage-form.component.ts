import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Usage } from '../../../interfaces/usage';
import { Garment } from '../../../interfaces/garment';
import { generateFriendlyId } from '../../../utils/friendly-id.utils';

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
  garments: Garment[] = [];  // Add the garments property

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    this.usageForm = this.fb.group({
      garmentId: [null, Validators.required],
      time: [new Date().toISOString().slice(0, 16), Validators.required], // Set current time as default
      notes: ['']
    });
  }

  ngOnInit(): void {
    // 1) Hämta alla plagg
    this.loadGarments();

    // 2) Prefill med garmentId från query-param (om det finns)
    this.route.queryParams.subscribe(params => {
      if (params['garmentId']) {
        this.usageForm.patchValue({
          garmentId: +params['garmentId']
        });
      }
    });

    // 3) Om vi är i edit-läge (id i path), hämta existerande usage
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.usageId = +params['id'];
        this.loadUsage(this.usageId);
      }
    });
  }

  // Method to load garments
  loadGarments(): void {
    this.http.get<Garment[]>('/api/garments/?ordering=-usage_count').subscribe({
      next: (data) => {
        this.garments = data;
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

  // Method to load a specific usage by id
  loadUsage(id: number): void {
    this.http.get<Usage>(`/api/usages/${id}/`).subscribe(data => {
      this.usage = data;
      this.usageForm.patchValue({
        garmentId: data.garment.id,
        time: data.time,
        notes: data.notes
      });
    });
  }

  onSubmit(): void {
    // Map the form value to the format expected by the API
    const usage = {
      garment: this.usageForm.value.garmentId, // Use "garment" instead of "garmentId"
      time: this.usageForm.value.time,
      notes: this.usageForm.value.notes        // Include the notes
    };

    if (this.usageId) {
      // Update existing usage
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
      // Create new usage
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
