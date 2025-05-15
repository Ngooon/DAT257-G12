import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageSummaryComponent } from './usage-summary.component';

describe('UsageSummaryComponent', () => {
  let component: UsageSummaryComponent;
  let fixture: ComponentFixture<UsageSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsageSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsageSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
