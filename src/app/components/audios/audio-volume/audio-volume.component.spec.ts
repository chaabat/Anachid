import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioVolumeComponent } from './audio-volume.component';

describe('AudioVolumeComponent', () => {
  let component: AudioVolumeComponent;
  let fixture: ComponentFixture<AudioVolumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioVolumeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AudioVolumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
