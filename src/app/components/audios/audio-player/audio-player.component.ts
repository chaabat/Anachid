import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioControlsComponent } from '../audio-controls/audio-controls.component';
import { AudioVolumeComponent } from '../audio-volume/audio-volume.component';
import { AudioService } from '../../../services/audio.service';
import { Track, PlayerStatus } from '../../../models/audio.models';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule, AudioControlsComponent, AudioVolumeComponent],
  template: `
    <div class="fixed bottom-0 left-0 right-0 bg-gray-900 text-white">
      @if (currentTrack$ | async; as track) {
      <div
        class="container mx-auto px-4 py-3 flex items-center justify-between"
      >
        <div class="flex items-center space-x-4">
          <img
            [src]="track.imageUrl || 'assets/default-album.png'"
            class="w-12 h-12 rounded"
            [alt]="track.title"
          />
          <div>
            <h3 class="font-medium">{{ track.title }}</h3>
            <p class="text-sm text-gray-400">{{ track.artist }}</p>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <button
            class="p-2 hover:bg-gray-700 rounded-full"
            (click)="onPrevious()"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          <button
            class="p-3 hover:bg-gray-700 rounded-full"
            (click)="onPlayPause()"
          >
            @if ((status$ | async) === PlayerStatus.PLAYING) {
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
            } @else {
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            }
          </button>

          <button class="p-2 hover:bg-gray-700 rounded-full" (click)="onNext()">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>
        </div>

        <app-audio-volume
          [volume]="volume"
          (volumeChange)="onVolumeChange($event)"
        ></app-audio-volume>
      </div>
      }
    </div>
  `,
})
export class AudioPlayerComponent implements OnInit {
  currentTrack$ = this.audioService.currentTrack$;
  status$ = this.audioService.status$;
  volume: number = 1;
  PlayerStatus = PlayerStatus;

  constructor(private audioService: AudioService) {}

  ngOnInit() {
    // Subscribe to current track changes if needed
  }

  async onPlayPause() {
    const currentStatus = await this.status$.pipe(take(1)).toPromise();
    if (currentStatus === PlayerStatus.PLAYING) {
      this.audioService.pause();
    } else {
      this.audioService.resume();
    }
  }

  onVolumeChange(volume: number) {
    this.volume = volume;
    this.audioService.setVolume(volume);
  }

  onNext() {
    this.audioService.playNext();
  }

  onPrevious() {
    this.audioService.playPrevious();
  }
}
