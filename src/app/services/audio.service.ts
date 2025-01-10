import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  firstValueFrom,
  Observable,
  of,
  take,
  withLatestFrom,
  map,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { Track, PlayerStatus } from '../models/audio.models';
import { AudioManagerService } from './audio-manager.service';
import { AppState } from '../store/app.state';
import * as AudioActions from '../store/audio/audio.actions';
import {
  setAudioState,
  setCurrentTime,
  setDuration,
} from '../store/audio/audio.actions';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private currentTrackSubject = new BehaviorSubject<Track | null>(null);
  currentTrack$ = this.currentTrackSubject.asObservable();
  private statusSubject = new BehaviorSubject<PlayerStatus>(
    PlayerStatus.STOPPED
  );
  status$ = this.statusSubject.asObservable();

  private audioElement: HTMLAudioElement;
  private audioUrl: string | null = null;

  constructor(
    private audioManager: AudioManagerService,
    private store: Store<AppState>
  ) {
    this.audioElement = new Audio();
    this.setupAudioListeners();
  }

  private setupAudioListeners() {
    this.audioElement.addEventListener('play', () => {
      this.store.dispatch(setAudioState({ status: PlayerStatus.PLAYING }));
    });

    this.audioElement.addEventListener('pause', () => {
      this.store.dispatch(setAudioState({ status: PlayerStatus.PAUSED }));
    });

    this.audioElement.addEventListener('timeupdate', () => {
      this.store.dispatch(
        setCurrentTime({ time: this.audioElement.currentTime })
      );
    });

    this.audioElement.addEventListener('durationchange', () => {
      this.store.dispatch(
        setDuration({ duration: this.audioElement.duration })
      );
    });
  }

  playTrack(track: Track): Observable<void> {
    return new Observable((observer) => {
      if (!track.audioUrl) {
        observer.error(new Error('No audio URL provided'));
        return;
      }

      // Stop any current playback
      if (this.audioElement.src) {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      }

      try {
        this.audioElement.src = track.audioUrl;
        this.audioElement.load();
        this.currentTrackSubject.next(track);
        this.statusSubject.next(PlayerStatus.LOADING);

        this.audioElement
          .play()
          .then(() => {
            this.statusSubject.next(PlayerStatus.PLAYING);
            observer.next();
            observer.complete();
          })
          .catch((error) => {
            this.statusSubject.next(PlayerStatus.ERROR);
            observer.error(error);
          });
      } catch (error) {
        this.statusSubject.next(PlayerStatus.ERROR);
        observer.error(error);
      }
    });
  }

  playNext(): void {
    this.store
      .select((state) => state.audio.tracks)
      .pipe(
        take(1),
        withLatestFrom(this.currentTrack$),
        map(([tracks, currentTrack]) => {
          if (currentTrack && tracks.length > 0) {
            const currentIndex = tracks.findIndex(
              (t) => t.id === currentTrack.id
            );
            if (currentIndex < tracks.length - 1) {
              this.store.dispatch(
                AudioActions.playTrack({ track: tracks[currentIndex + 1] })
              );
            }
          }
        })
      )
      .subscribe();
  }

  playPrevious(): void {
    this.store
      .select((state) => state.audio.tracks)
      .pipe(
        take(1),
        withLatestFrom(this.currentTrack$),
        map(([tracks, currentTrack]) => {
          if (currentTrack && tracks.length > 0) {
            const currentIndex = tracks.findIndex(
              (t) => t.id === currentTrack.id
            );
            if (currentIndex > 0) {
              this.store.dispatch(
                AudioActions.playTrack({ track: tracks[currentIndex - 1] })
              );
            }
          }
        })
      )
      .subscribe();
  }

  pause() {
    this.audioElement.pause();
    this.statusSubject.next(PlayerStatus.PAUSED);
  }

  resume() {
    this.audioElement
      .play()
      .then(() => {
        this.statusSubject.next(PlayerStatus.PLAYING);
      })
      .catch((error) => {
        this.statusSubject.next(PlayerStatus.ERROR);
        console.error('Resume failed:', error);
      });
  }

  stop() {
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
    this.statusSubject.next(PlayerStatus.STOPPED);
    this.currentTrackSubject.next(null);
  }

  setVolume(volume: number) {
    this.audioElement.volume = volume;
  }

  getCurrentTime(): number {
    return this.audioElement.currentTime;
  }

  getDuration(): number {
    return this.audioElement.duration;
  }

  seek(time: number) {
    this.audioElement.currentTime = time;
  }

  searchTracks(query: string): Observable<Track[]> {
    return this.store.select((state) => {
      const tracks = state.audio.tracks;
      if (!query) return tracks;

      const searchTerm = query.toLowerCase();
      return tracks.filter(
        (track) =>
          track.title.toLowerCase().includes(searchTerm) ||
          track.artist.toLowerCase().includes(searchTerm) ||
          (track.description &&
            track.description.toLowerCase().includes(searchTerm))
      );
    });
  }
}
