import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WardrobeListComponent } from './wardrobe-list.component';

describe('WardrobeListComponent', () => {
  let component: WardrobeListComponent;
  let fixture: ComponentFixture<WardrobeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WardrobeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WardrobeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
