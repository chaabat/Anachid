import { createReducer, on } from '@ngrx/store';
import { AudioState, initialState } from './audio.state';
import { PlayerStatus, Track } from '../../models/audio.models';
import * as AudioActions from './audio.actions';
export const audioReducer = createReducer(
  initialState,
  on(AudioActions.loadTracks, (state) => ({
    ...state,
    loading: true,
  })),

  on(AudioActions.loadTracksSuccess, (state, { tracks }) => ({
    ...state,
    tracks,
    filteredTracks: tracks,
    loading: false,
    error: null,
  })),

  on(AudioActions.loadTracksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AudioActions.filterByCategory, (state, { category }) => {
    let filtered = state.tracks;

    // Apply category filter
    if (category !== 'all') {
      filtered = filtered.filter((track: Track) => track.category === category);
    }

    // Re-apply search filter if exists
    if (state.searchTerm) {
      const term = state.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (track: Track) =>
          track.title.toLowerCase().includes(term) ||
          track.artist.toLowerCase().includes(term) ||
          (track.description && track.description.toLowerCase().includes(term))
      );
    }

    return {
      ...state,
      currentCategory: category,
      filteredTracks: filtered,
    };
  }),

  on(AudioActions.searchTracks, (state, { term }) => {
    let filtered = state.tracks;

    // Apply category filter if not 'all'
    if (state.currentCategory !== 'all') {
      filtered = filtered.filter(
        (track: Track) => track.category === state.currentCategory
      );
    }

    // Apply search filter
    if (term) {
      const searchTerm = term.toLowerCase();
      filtered = filtered.filter(
        (track: Track) =>
          track.title.toLowerCase().includes(searchTerm) ||
          track.artist.toLowerCase().includes(searchTerm) ||
          (track.description &&
            track.description.toLowerCase().includes(searchTerm))
      );
    }

    return {
      ...state,
      searchTerm: term,
      filteredTracks: filtered,
    };
  }),

  on(AudioActions.playTrack, (state, { track }) => ({
    ...state,
    currentTrack: track,
    status: PlayerStatus.PLAYING,
  })),

  on(AudioActions.pauseTrack, (state) => ({
    ...state,
    status: PlayerStatus.PAUSED,
  })),

  on(AudioActions.stopTrack, (state) => ({
    ...state,
    currentTrack: null,
    status: PlayerStatus.STOPPED,
    currentTime: 0,
  })),

  on(AudioActions.setVolume, (state, { volume }) => ({
    ...state,
    volume,
  })),

  on(AudioActions.updateCurrentTime, (state, { time }) => ({
    ...state,
    currentTime: time,
  })),

  on(AudioActions.toggleFavorite, (state, { trackId }) => {
    const updatedTracks = state.tracks.map((track: Track) =>
      track.id === trackId ? { ...track, isFavorite: !track.isFavorite } : track
    );

    return {
      ...state,
      tracks: updatedTracks,
      filteredTracks:
        state.currentCategory === 'all'
          ? updatedTracks
          : updatedTracks.filter(
              (track: Track) => track.category === state.currentCategory
            ),
    };
  }),

  on(AudioActions.updateFavoriteSuccess, (state, { track }) => {
    const updatedTracks = state.tracks.map((t: Track) =>
      t.id === track.id ? track : t
    );

    return {
      ...state,
      tracks: updatedTracks,
      filteredTracks:
        state.currentCategory === 'all'
          ? updatedTracks
          : updatedTracks.filter(
              (t: Track) => t.category === state.currentCategory
            ),
    };
  })
);
