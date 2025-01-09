import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritsComponent } from './favorits.component';

describe('FavoritsComponent', () => {
  let component: FavoritsComponent;
  let fixture: ComponentFixture<FavoritsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FavoritsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
