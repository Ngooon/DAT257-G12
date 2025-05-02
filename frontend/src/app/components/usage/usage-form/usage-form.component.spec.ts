import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageFormComponent } from './usage-form.component';

describe('UsageFormComponent', () => {
  let component: UsageFormComponent;
  let fixture: ComponentFixture<UsageFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsageFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
