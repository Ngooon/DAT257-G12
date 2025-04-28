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
  garments: Garment[] = [];  // Add the garments property

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    this.usageForm = this.fb.group({
      garmentId: [null, Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    // Fetch the list of garments
    this.loadGarments();

    // Fetch usage details if we're editing
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.usageId = +params['id'];
        this.loadUsage(this.usageId);
      }
    });
  }

  // Method to load garments
  loadGarments(): void {
    this.http.get<Garment[]>('/api/garments/').subscribe({
      next: (data) => {
        this.garments = data;
      },
      error: (err) => {
        console.error('Error fetching garments', err);
        alert('Failed to load garments.');
      }
    });
  }

  // Method to load a specific usage by id
  loadUsage(id: number): void {
    this.http.get<Usage>(`/api/usages/${id}/`).subscribe(data => {
      this.usage = data;
      this.usageForm.patchValue({
        garmentId: data.garmentId,
        notes: data.notes
      });
    });
  }

  onSubmit(): void {
    // Map the form value to the format expected by the API
    const usage = {
      garment: this.usageForm.value.garmentId, // Use "garment" instead of "garmentId"
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
