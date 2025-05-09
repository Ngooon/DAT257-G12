import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingSummaryComponent } from './listing-summary.component';

describe('ListingSummaryComponent', () => {
  let component: ListingSummaryComponent;
  let fixture: ComponentFixture<ListingSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListingSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListingSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
