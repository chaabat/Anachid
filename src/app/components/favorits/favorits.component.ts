import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Track } from '../../models/audio.models';
import { AudioService } from '../../services/audio.service';
import { Observable } from 'rxjs';
import { AppState } from '../../store/app.state';
import * as AudioActions from '../../store/audio/audio.actions';

@Component({
  selector: 'app-favorits',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './favorits.component.html',
})
export class FavoritsComponent implements OnInit {
  favoriteTracks$: Observable<Track[]>;

  constructor(
    private store: Store<AppState>,
    private audioService: AudioService
  ) {
    this.favoriteTracks$ = this.store.select((state) =>
      state.audio.tracks.filter((track) => track.isFavorite)
    );
  }

  ngOnInit() {
    this.store.dispatch(AudioActions.loadTracks());
  }

  async playTrack(track: Track) {
    try {
      this.store.dispatch(AudioActions.playTrack({ track }));
    } catch (error) {
      console.error('Error playing track:', error);
      this.store.dispatch(
        AudioActions.playTrackFailure({
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      );
    }
  }

  removeFromFavorites(track: Track) {
    this.store.dispatch(AudioActions.toggleFavorite({ trackId: track.id }));
  }

  // showDetails(track: Track) {
  //   // You might want to navigate to a details page or open a modal
  //   console.log('Show details for track:', track);
  //   // Example: this.router.navigate(['/tracks', track.id]);
  // }
}
