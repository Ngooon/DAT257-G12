import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GarmentDetailsComponent } from './garment-details.component';

describe('GarmentDetailsComponent', () => {
  let component: GarmentDetailsComponent;
  let fixture: ComponentFixture<GarmentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GarmentDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GarmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
