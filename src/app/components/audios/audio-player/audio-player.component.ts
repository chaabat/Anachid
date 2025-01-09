import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AudioControlsComponent } from '../audio-controls/audio-controls.component';
import { AudioVolumeComponent } from '../audio-volume/audio-volume.component';
import { AudioService } from '../../../services/audio.service';
import { Track, PlayerStatus } from '../../../models/audio.models';
import { take } from 'rxjs/operators';
import { interval, Subscription } from 'rxjs';
import * as AudioActions from '../../../store/audio/audio.actions';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule, AudioControlsComponent, AudioVolumeComponent],
  templateUrl: './audio-player.component.html',
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
  currentTrack$ = this.audioService.currentTrack$;
  status$ = this.audioService.status$;
  volume: number = 1;
  currentTime: number = 0;
  duration: number = 0;
  PlayerStatus = PlayerStatus;
  private timeUpdateSubscription?: Subscription;

  constructor(private audioService: AudioService, private store: Store) {}

  ngOnInit() {
    this.timeUpdateSubscription = interval(1000).subscribe(() => {
      this.currentTime = this.audioService.getCurrentTime();
      this.duration = this.audioService.getDuration() || 0;
    });
  }

  ngOnDestroy() {
    this.timeUpdateSubscription?.unsubscribe();
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  onProgressBarClick(event: MouseEvent) {
    const element = event.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    const newTime = ratio * this.duration;
    this.audioService.seek(newTime);
  }

  onPlayPause() {
    this.status$.pipe(take(1)).subscribe((status) => {
      if (status === PlayerStatus.PLAYING) {
        this.store.dispatch(AudioActions.pauseTrack());
      } else {
        this.store.dispatch(AudioActions.resumeTrack());
      }
    });
  }

  onVolumeChange(volume: number) {
    this.volume = volume;
    this.audioService.setVolume(volume);
  }

  onNext() {
    this.store.dispatch(AudioActions.playNext());
  }

  onPrevious() {
    this.store.dispatch(AudioActions.playPrevious());
  }
}
