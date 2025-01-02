import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SearchTrackComponent } from '../../components/tracks/search-track/search-track.component';
import { TrackCardComponent } from '../../components/tracks/track-card/track-card.component';
import { Track, MusicCategory } from '../../models/audio.models';
import { ModalService } from '../../services/modal.service';
import { AudioManagerService } from '../../services/audio-manager.service';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, RouterLink, SearchTrackComponent, TrackCardComponent],
  templateUrl: './library.component.html',
})
export class LibraryComponent implements OnInit {
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
  }

  async loadTracks() {
    const metadata = await this.audioManager.getAllTracks();
    this.tracks = metadata as Track[];
    this.filterTracks();
  }

  filterTracks() {
    this.filteredTracks =
      this.selectedCategory === 'all'
        ? this.tracks
        : this.tracks.filter(
            (track) => track.category === this.selectedCategory
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
