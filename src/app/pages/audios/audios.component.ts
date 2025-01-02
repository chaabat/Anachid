import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Track } from '../../models/audio.models';
import { AudioManagerService } from '../../services/audio-manager.service';

@Component({
  selector: 'app-audios',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Audio Player</h1>
      <div class="space-y-4">
        @for (track of tracks; track track.id) {
        <div
          class="bg-white rounded-lg shadow p-4 flex items-center justify-between"
        >
          <div class="flex items-center space-x-4">
            <img
              [src]="track.imageUrl || 'assets/default-album.png'"
              class="w-12 h-12 rounded"
              [alt]="track.title"
            />
            <div>
              <h3 class="font-medium">{{ track.title }}</h3>
              <p class="text-sm text-gray-600">{{ track.artist }}</p>
            </div>
          </div>
          <button
            class="p-2 hover:bg-gray-100 rounded-full"
            (click)="playTrack(track)"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
        }
      </div>
    </div>
  `,
})
export class AudiosComponent {
  tracks: Track[] = [];

  constructor(private audioManager: AudioManagerService) {
    this.loadTracks();
  }

  async loadTracks() {
    const metadata = await this.audioManager.getAllTracks();
    this.tracks = metadata as Track[];
  }

  playTrack(track: Track) {
    // Implement play functionality
    console.log('Playing track:', track.title);
  }
}
