import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-audio-volume',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex items-center space-x-2">
      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path
          d="M3 10v4h4l5 5V5l-5 5H3zm13.5 2c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03zm2.5 0c0 2.5-1.5 4.67-3.5 5.74v-1.81c1.05-.81 1.75-2.08 1.75-3.53s-.7-2.72-1.75-3.53V6.26c2 .07 3.5 2.24 3.5 4.74z"
        />
      </svg>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        [value]="volume"
        (input)="onVolumeInput($event)"
        class="w-24"
      />
    </div>
  `,
})
export class AudioVolumeComponent {
  @Input() volume: number = 1;
  @Output() volumeChange = new EventEmitter<number>();

  onVolumeInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.volumeChange.emit(Number(input.value));
  }
}
