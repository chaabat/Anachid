import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SearchTrackComponent } from '../search-track/search-track.component';
import { Track, MusicCategory } from '../../../models/audio.models';
import { ModalService } from '../../../services/modal.service';
import { AudioManagerService } from '../../../services/audio-manager.service';
import { AudioService } from '../../../services/audio.service';

@Component({
  selector: 'app-tracks-list',
  standalone: true,
  imports: [CommonModule, RouterLink, SearchTrackComponent],
  templateUrl: './tracks-list.component.html',
})
export class TracksListComponent implements OnInit {
  tracks: Track[] = [];
  filteredTracks: Track[] = [];
  categories = Object.values(MusicCategory);
  selectedCategory: string = 'all';
  searchTerm: string = '';

  constructor(
    private modalService: ModalService,
    private audioManager: AudioManagerService,
    private audioService: AudioService
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

  playTrack(track: Track) {
    this.audioService.playTrack(track);
  }

  filterTracks() {
    let filtered =
      this.selectedCategory === 'all'
        ? this.tracks
        : this.tracks.filter(
            (track) =>
              track.category.toLowerCase() ===
              this.selectedCategory.toLowerCase()
          );

    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (track) =>
          track.title.toLowerCase().includes(search) ||
          track.artist.toLowerCase().includes(search) ||
          (track.description &&
            track.description.toLowerCase().includes(search))
      );
    }

    this.filteredTracks = filtered;
  }

  onCategoryChange(category: string) {
    this.selectedCategory = category;
    this.filterTracks();
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.filterTracks();
  }

  openUploadModal() {
    this.modalService.open();
  }
}
