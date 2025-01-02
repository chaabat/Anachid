import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audio-volume',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audio-volume.component.html',
  styleUrl: './audio-volume.component.css',
})
export class AudioVolumeComponent {
  @Input() volume: number = 1;
  @Output() volumeChange = new EventEmitter<number>();

  onVolumeInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.volumeChange.emit(Number(input.value));
  }
}
