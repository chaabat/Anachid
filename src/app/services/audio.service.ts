import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Track, PlayerStatus } from '../models/audio.models';
import { AudioManagerService } from './audio-manager.service';

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

  private playlist: Track[] = [];
  private currentIndex = -1;

  private audioElement: HTMLAudioElement;
  private audioUrl: string | null = null;

  constructor(private audioManager: AudioManagerService) {
    this.audioElement = new Audio();
    this.setupAudioListeners();
    this.loadPlaylist();
  }

  private async loadPlaylist() {
    this.playlist = await this.audioManager.getAllTracks();
    console.log('Playlist loaded:', this.playlist.length, 'tracks');
  }

  private setupAudioListeners() {
    this.audioElement.addEventListener('play', () => {
      this.statusSubject.next(PlayerStatus.PLAYING);
    });

    this.audioElement.addEventListener('pause', () => {
      this.statusSubject.next(PlayerStatus.PAUSED);
    });

    this.audioElement.addEventListener('ended', () => {
      this.playNext();
    });
  }

  async playTrack(track: Track) {
    try {
      await this.loadPlaylist(); // Ensure playlist is loaded
      this.currentIndex = this.playlist.findIndex((t) => t.id === track.id);
      console.log('Playing track at index:', this.currentIndex);

      if (this.audioUrl) {
        URL.revokeObjectURL(this.audioUrl);
      }

      const audioBlob = await this.audioManager.getAudioFile(track.id);
      this.audioUrl = URL.createObjectURL(audioBlob);
      this.audioElement.src = this.audioUrl;
      this.currentTrackSubject.next(track);
      await this.audioElement.play();
    } catch (error) {
      console.error('Error playing track:', error);
    }
  }

  async playNext() {
    console.log(
      'Playing next. Current index:',
      this.currentIndex,
      'Playlist length:',
      this.playlist.length
    );
    if (this.currentIndex < this.playlist.length - 1) {
      const nextTrack = this.playlist[this.currentIndex + 1];
      console.log('Next track:', nextTrack);
      await this.playTrack(nextTrack);
    }
  }

  async playPrevious() {
    console.log('Playing previous. Current index:', this.currentIndex);
    if (this.currentIndex > 0) {
      const previousTrack = this.playlist[this.currentIndex - 1];
      console.log('Previous track:', previousTrack);
      await this.playTrack(previousTrack);
    }
  }

  pause() {
    this.audioElement.pause();
  }

  resume() {
    this.audioElement.play();
  }

  stop() {
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
    this.statusSubject.next(PlayerStatus.STOPPED);
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
}
