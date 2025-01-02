import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerStatus } from '../../../models/audio.models';

@Component({
  selector: 'app-audio-controls',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center space-x-4">
      <button
        class="p-2 hover:bg-gray-700 rounded-full"
        (click)="previous.emit()"
      >
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
        </svg>
      </button>

      <button
        class="p-3 hover:bg-gray-700 rounded-full"
        (click)="playPause.emit()"
      >
        @if (status === PlayerStatus.PLAYING) {
        <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        </svg>
        } @else {
        <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
        }
      </button>

      <button class="p-2 hover:bg-gray-700 rounded-full" (click)="next.emit()">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
        </svg>
      </button>
    </div>
  `,
})
export class AudioControlsComponent {
  @Input() status: PlayerStatus = PlayerStatus.STOPPED;
  @Output() playPause = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();

  PlayerStatus = PlayerStatus;
}
