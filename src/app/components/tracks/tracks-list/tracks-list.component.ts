import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SearchTrackComponent } from '../search-track/search-track.component';
import { TrackCardComponent } from '../track-card/track-card.component';
import { Track, MusicCategory } from '../../../models/audio.models';
import { ModalService } from '../../../services/modal.service';
import { AudioManagerService } from '../../../services/audio-manager.service';

@Component({
  selector: 'app-tracks-list',
  standalone: true,
  imports: [CommonModule, RouterLink, SearchTrackComponent, TrackCardComponent],
  templateUrl: './tracks-list.component.html',
})
export class TracksListComponent implements OnInit {
  tracks: Track[] = [];
  filteredTracks: Track[] = [];
  categories = Object.values(MusicCategory);
  selectedCategory: string = 'all';

  constructor(
    private modalService: ModalService,
    private audioManager: AudioManagerService
  ) {}

  ngOnInit() {
    this.loadTracks();
    // Subscribe to track updates
    this.audioManager.tracks$.subscribe((tracks) => {
      this.tracks = tracks;
      this.filterTracks();
    });
  }

  async loadTracks() {
    await this.audioManager.getAllTracks();
  }

  filterTracks() {
    this.filteredTracks =
      this.selectedCategory === 'all'
        ? this.tracks
        : this.tracks.filter(
            (track) =>
              track.category.toLowerCase() ===
              this.selectedCategory.toLowerCase()
          );
  }

  onCategoryChange(category: string) {
    this.selectedCategory = category;
    this.filterTracks();
  }

  openUploadModal() {
    this.modalService.open();
  }
}
