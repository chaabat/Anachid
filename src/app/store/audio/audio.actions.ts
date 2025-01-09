import { createAction, props } from '@ngrx/store';
import { Track, PlayerStatus } from '../../models/audio.models';

// Track Management
export const loadTracks = createAction('[Audio] Load Tracks');
export const loadTracksSuccess = createAction(
  '[Audio] Load Tracks Success',
  props<{ tracks: Track[] }>()
);
export const loadTracksFailure = createAction(
  '[Audio] Load Tracks Failure',
  props<{ error: string }>()
);

// Playback Controls
export const playTrack = createAction(
  '[Audio] Play Track',
  props<{ track: Track }>()
);
export const pauseTrack = createAction('[Audio] Pause Track');
export const pauseTrackSuccess = createAction('[Audio] Pause Track Success');
export const pauseTrackFailure = createAction(
  '[Audio] Pause Track Failure',
  props<{ error: string }>()
);
export const stopTrack = createAction('[Audio] Stop Track');
export const setVolume = createAction(
  '[Audio] Set Volume',
  props<{ volume: number }>()
);
export const updateCurrentTime = createAction(
  '[Audio] Update Current Time',
  props<{ time: number }>()
);

// Track Operations
export const addTrack = createAction(
  '[Audio] Add Track',
  props<{ track: Track; audioFile: File }>()
);
export const deleteTrack = createAction(
  '[Audio] Delete Track',
  props<{ trackId: string }>()
);
export const updateTrack = createAction(
  '[Audio] Update Track',
  props<{ trackId: string; updates: Partial<Track> }>()
);

// Add these new actions
export const filterByCategory = createAction(
  '[Audio] Filter By Category',
  props<{ category: string }>()
);

export const searchTracks = createAction(
  '[Audio] Search Tracks',
  props<{ term: string }>()
);

export const playTrackSuccess = createAction(
  '[Audio] Play Track Success',
  props<{ track: Track }>()
);

export const playTrackFailure = createAction(
  '[Audio] Play Track Failure',
  props<{ error: string }>()
);

export const toggleFavorite = createAction(
  '[Audio] Toggle Favorite',
  props<{ trackId: string }>()
);

export const updateFavoriteSuccess = createAction(
  '[Audio] Update Favorite Success',
  props<{ track: Track }>()
);

export const updateFavoriteFailure = createAction(
  '[Audio] Update Favorite Failure',
  props<{ error: string }>()
);
export function loadFavoritesSuccess(arg0: { favorites: string[] }): any {
  throw new Error('Function not implemented.');
}

// Add these actions
export const setAudioState = createAction(
  '[Audio] Set Audio State',
  props<{ status: PlayerStatus }>()
);

export const setCurrentTime = createAction(
  '[Audio] Set Current Time',
  props<{ time: number }>()
);

export const setDuration = createAction(
  '[Audio] Set Duration',
  props<{ duration: number }>()
);

export const loadAudioFile = createAction(
  '[Audio] Load Audio File',
  props<{ track: Track }>()
);

export const loadAudioFileSuccess = createAction(
  '[Audio] Load Audio File Success',
  props<{ track: Track; audioUrl: string }>()
);

export const loadAudioFileFailure = createAction(
  '[Audio] Load Audio File Failure',
  props<{ error: string }>()
);

export const resumeTrack = createAction('[Audio] Resume Track');
export const resumeTrackSuccess = createAction('[Audio] Resume Track Success');
export const resumeTrackFailure = createAction(
  '[Audio] Resume Track Failure',
  props<{ error: string }>()
);

export const playNext = createAction('[Audio] Play Next');
export const playPrevious = createAction('[Audio] Play Previous');
