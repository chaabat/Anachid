import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerStatus } from '../../../models/audio.models';

@Component({
  selector: 'app-audio-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audio-controls.component.html',
})
export class AudioControlsComponent {
  @Input() status: PlayerStatus = PlayerStatus.STOPPED;
  @Output() playPause = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();

  PlayerStatus = PlayerStatus;
}
