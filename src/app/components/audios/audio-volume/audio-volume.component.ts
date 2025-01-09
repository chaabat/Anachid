import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-audio-volume',
  standalone: true,
  imports: [CommonModule,  FormsModule],
  templateUrl: './audio-volume.component.html',
})
export class AudioVolumeComponent {
  @Input() volume: number = 1;
  @Output() volumeChange = new EventEmitter<number>();
  previousVolume: number = 1;

  onVolumeInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.volume = Number(input.value);
    this.volumeChange.emit(this.volume);
  }

  toggleMute() {
    if (this.volume > 0) {
      this.previousVolume = this.volume;
      this.volume = 0;
    } else {
      this.volume = this.previousVolume;
    }
    this.volumeChange.emit(this.volume);
  }
}
