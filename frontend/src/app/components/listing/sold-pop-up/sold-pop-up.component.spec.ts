import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoldPopUpComponent } from './sold-pop-up.component';

describe('SoldPopUpComponent', () => {
  let component: SoldPopUpComponent;
  let fixture: ComponentFixture<SoldPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoldPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoldPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
