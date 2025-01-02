import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Track } from '../../../models/audio.models';

@Component({
  selector: 'app-track-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div
      class="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
    >
      <a [routerLink]="['/tracks', track.id]" class="block">
        <img
          [src]="track.imageUrl || 'assets/default-album.png'"
          [alt]="track.title"
          class="w-full h-48 object-cover rounded-md mb-4"
        />
        <h3 class="text-lg font-semibold">{{ track.title }}</h3>
        <p class="text-gray-600">{{ track.artist }}</p>
      </a>
    </div>
  `,
})
export class TrackCardComponent {
  @Input() track!: Track;
}
