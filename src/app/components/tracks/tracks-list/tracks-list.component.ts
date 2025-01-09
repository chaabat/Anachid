import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SearchTrackComponent } from '../search-track/search-track.component';
import { Track, MusicCategory } from '../../../models/audio.models';
import { ModalService } from '../../../services/modal.service';
import { AppState } from '../../../store/app.state';
import * as AudioActions from '../../../store/audio/audio.actions';
import { AudioService } from '../../../services/audio.service';

@Component({
  selector: 'app-tracks-list',
  standalone: true,
  imports: [CommonModule, RouterLink, SearchTrackComponent],
  templateUrl: './tracks-list.component.html',
})
export class TracksListComponent implements OnInit {
  tracks$: Observable<Track[]>;
  loading$: Observable<boolean>;
  categories = Object.values(MusicCategory);
  selectedCategory: string = 'all';
  isDropdownOpen = false;

  constructor(
    private modalService: ModalService,
    private store: Store<AppState>,
    private audioService: AudioService
  ) {
    this.tracks$ = this.store.select((state) => state.audio.filteredTracks);
    this.loading$ = this.store.select((state) => state.audio.loading);
  }

  ngOnInit() {
    this.store.dispatch(AudioActions.loadTracks());
  }

  onCategoryChange(category: string) {
    this.selectedCategory = category;
    this.store.dispatch(AudioActions.filterByCategory({ category }));
  }

  async playTrack(track: Track) {
    if (!track) return;

    try {
      await this.audioService.playTrack(track);
      this.store.dispatch(AudioActions.playTrack({ track }));
    } catch (error) {
      console.error('Error playing track:', error);
    }
  }

  openUploadModal() {
    this.modalService.open();
  }

  toggleFavorite(track: Track, event: Event) {
    event.stopPropagation();
    this.store.dispatch(AudioActions.toggleFavorite({ trackId: track.id }));
  }

  onSearch(searchTerm: string) {
    this.store.dispatch(AudioActions.searchTracks({ term: searchTerm }));
  }

  onCategorySelect(category: string) {
    this.onCategoryChange(category);
    this.isDropdownOpen = false;
  }
}
