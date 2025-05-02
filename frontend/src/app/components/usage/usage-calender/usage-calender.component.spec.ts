import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageCalenderComponent } from './usage-calender.component';

describe('UsageCalenderComponent', () => {
  let component: UsageCalenderComponent;
  let fixture: ComponentFixture<UsageCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsageCalenderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsageCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
