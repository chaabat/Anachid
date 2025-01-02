import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioControlsComponent } from '../audio-controls/audio-controls.component';
import { AudioVolumeComponent } from '../audio-volume/audio-volume.component';
import { Track, PlayerStatus } from '../../../models/audio.models';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule, AudioControlsComponent, AudioVolumeComponent],
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.css',
})
export class AudioPlayerComponent implements OnInit {
  currentTrack: Track | null = null;
  playerStatus: PlayerStatus = PlayerStatus.STOPPED;
  currentTime: number = 0;
  duration: number = 0;
  volume: number = 1;

  ngOnInit() {
    // Initialize audio player
  }

  onPlayPause() {
    if (this.playerStatus === PlayerStatus.PLAYING) {
      this.playerStatus = PlayerStatus.PAUSED;
    } else {
      this.playerStatus = PlayerStatus.PLAYING;
    }
  }

  onVolumeChange(volume: number) {
    this.volume = volume;
  }

  onTimeUpdate(time: number) {
    this.currentTime = time;
  }
}
