import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageListComponent } from './usage-list.component';

describe('UsageListComponent', () => {
  let component: UsageListComponent;
  let fixture: ComponentFixture<UsageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsageListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
