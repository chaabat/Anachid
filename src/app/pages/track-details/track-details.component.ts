import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Track } from '../../models/audio.models';
import { AudioManagerService } from '../../services/audio-manager.service';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-track-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      @if (track) {
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="relative h-64">
          <img
            [src]="track.imageUrl || 'assets/default-album.png'"
            [alt]="track.title"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="p-6">
          <h1 class="text-3xl font-bold mb-2">{{ track.title }}</h1>
          <p class="text-gray-600 text-lg mb-4">{{ track.artist }}</p>
          @if (track.description) {
          <p class="text-gray-700 mb-4">{{ track.description }}</p>
          }
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">
              Added {{ track.addedDate | date }}
            </span>
            <div class="flex items-center space-x-4">
              <button
                (click)="playPrevious()"
                class="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </button>
              <button
                (click)="playTrack()"
                class="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                Play Track
              </button>
              <button
                (click)="playNext()"
                class="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      }
    </div>
  `,
})
export class TrackDetailsComponent implements OnInit {
  track: Track | null = null;
  tracks: Track[] = [];
  currentIndex: number = -1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private audioManager: AudioManagerService,
    private audioService: AudioService
  ) {}

  ngOnInit() {
    this.loadTracks();
  }

  async loadTracks() {
    this.tracks = await this.audioManager.getAllTracks();
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.currentIndex = this.tracks.findIndex((t) => t.id === params['id']);
        this.track = this.tracks[this.currentIndex];
      }
    });
  }

  playTrack() {
    if (this.track) {
      this.audioService.playTrack(this.track);
    }
  }

  async playNext() {
    if (this.currentIndex < this.tracks.length - 1) {
      const nextTrack = this.tracks[this.currentIndex + 1];
      await this.router.navigate(['/tracks', nextTrack.id]);
      this.audioService.playTrack(nextTrack);
    }
  }

  async playPrevious() {
    if (this.currentIndex > 0) {
      const previousTrack = this.tracks[this.currentIndex - 1];
      await this.router.navigate(['/tracks', previousTrack.id]);
      this.audioService.playTrack(previousTrack);
    }
  }
}
