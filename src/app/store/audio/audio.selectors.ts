import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { AudioState } from './audio.state';

export const selectAudioState = (state: AppState) => state.audio;

export const selectTracks = createSelector(
  selectAudioState,
  (state: AudioState) => state.tracks
);

export const selectCurrentTrack = createSelector(
  selectAudioState,
  (state: AudioState) => state.currentTrack
);

export const selectPlayerStatus = createSelector(
  selectAudioState,
  (state: AudioState) => state.status
);
