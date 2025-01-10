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
  currentlyPlayingTrackId: string | null = null;
  private tracksList: Track[] = [];

  constructor(
    private modalService: ModalService,
    private store: Store<AppState>,
    private audioService: AudioService
  ) {
    this.tracks$ = this.store.select((state) => state.audio.filteredTracks);
    this.loading$ = this.store.select((state) => state.audio.loading);
    this.store
      .select((state) => state.audio.currentTrack)
      .subscribe((track) => {
        this.currentlyPlayingTrackId = track?.id || null;
      });

    this.tracks$.subscribe((tracks) => {
      this.tracksList = tracks;
    });
  }

  ngOnInit() {
    this.store.dispatch(AudioActions.loadTracks());
  }

  onCategoryChange(category: string) {
    this.selectedCategory = category;
    this.store.dispatch(AudioActions.filterByCategory({ category }));
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

  isCurrentlyPlaying(track: Track): boolean {
    return this.currentlyPlayingTrackId === track.id;
  }

  playTrack(track: Track) {
    if (!track) return;
    this.store.dispatch(AudioActions.loadAudioFile({ track }));
  }

}
