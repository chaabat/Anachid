import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { AudioManagerService } from '../../services/audio-manager.service';
import { AudioService } from '../../services/audio.service';
import * as AudioActions from './audio.actions';
import { Track } from '../../models/audio.models';
import { IndexedDBService } from '../../services/indexed-db.service';
import { Store } from '@ngrx/store';
import { withLatestFrom } from 'rxjs/operators';

@Injectable()
export class AudioEffects {
  loadTracks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AudioActions.loadTracks),
      mergeMap(() =>
        this.audioManager.getAllTracks().pipe(
          map((tracks: Track[]) => AudioActions.loadTracksSuccess({ tracks })),
          catchError((error) =>
            of(AudioActions.loadTracksFailure({ error: error.message }))
          )
        )
      )
    )
  );

  addTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AudioActions.addTrack),
      mergeMap(({ track, audioFile }) =>
        from(this.audioManager.uploadAudio(audioFile, track)).pipe(
          map(() => AudioActions.loadTracks()),
          catchError((error) =>
            of(AudioActions.loadTracksFailure({ error: error.message }))
          )
        )
      )
    )
  );

  playTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AudioActions.playTrack),
      mergeMap(({ track }) =>
        from(this.audioService.playTrack(track)).pipe(
          map(() => AudioActions.playTrackSuccess({ track })),
          catchError((error) =>
            of(AudioActions.playTrackFailure({ error: error.message }))
          )
        )
      )
    )
  );

  playTrackSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AudioActions.playTrackSuccess),
        tap(({ track }) => {
          console.log('Track playing:', track.title);
        })
      ),
    { dispatch: false }
  );

  toggleFavorite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AudioActions.toggleFavorite),
      mergeMap(({ trackId }) =>
        from(this.indexedDB.getTrackById(trackId)).pipe(
          map((track: Track) => ({
            ...track,
            isFavorite: !track.isFavorite,
          })),
          mergeMap((updatedTrack: Track) =>
            from(this.indexedDB.updateTrack(updatedTrack)).pipe(
              map(() =>
                AudioActions.updateFavoriteSuccess({ track: updatedTrack })
              ),
              catchError((error) =>
                of(AudioActions.loadTracksFailure({ error }))
              )
            )
          )
        )
      )
    )
  );

  loadAudioFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AudioActions.loadAudioFile),
      mergeMap(({ track }) =>
        from(this.audioManager.getAudioFile(track.id)).pipe(
          map((audioBlob) => {
            if (!audioBlob) {
              throw new Error('Audio file not found');
            }
            const audioUrl = URL.createObjectURL(audioBlob);
            const trackWithUrl = { ...track, audioUrl };
            return AudioActions.loadAudioFileSuccess({
              track: trackWithUrl,
              audioUrl,
            });
          }),
          catchError((error) =>
            of(
              AudioActions.loadAudioFileFailure({
                error: error instanceof Error ? error.message : 'Unknown error',
              })
            )
          )
        )
      )
    )
  );

  loadAudioFileSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AudioActions.loadAudioFileSuccess),
      map(({ track }) => AudioActions.playTrack({ track }))
    )
  );

  pauseTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AudioActions.pauseTrack),
      mergeMap(() =>
        of(this.audioService.pause()).pipe(
          map(() => AudioActions.pauseTrackSuccess()),
          catchError((error) =>
            of(AudioActions.pauseTrackFailure({ error: error.message }))
          )
        )
      )
    )
  );

  resumeTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AudioActions.resumeTrack),
      mergeMap(() =>
        of(this.audioService.resume()).pipe(
          map(() => AudioActions.resumeTrackSuccess()),
          catchError((error) =>
            of(AudioActions.resumeTrackFailure({ error: error.message }))
          )
        )
      )
    )
  );

  playNext$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AudioActions.playNext),
      withLatestFrom(
        this.store.select((state) => state.audio.tracks),
        this.store.select((state) => state.audio.currentTrack)
      ),
      mergeMap(([_, tracks, currentTrack]) => {
        if (!currentTrack) {
          return of(
            AudioActions.playNextFailure({
              error: 'No track playing',
            })
          );
        }

        const nextTrack = this.audioService.playNext(tracks, currentTrack);
        if (!nextTrack) {
          return of(
            AudioActions.playNextFailure({
              error: 'No next track available',
            })
          );
        }

        return of(AudioActions.playTrack({ track: nextTrack }));
      })
    )
  );

  playPrevious$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AudioActions.playPrevious),
      withLatestFrom(
        this.store.select((state) => state.audio.tracks),
        this.store.select((state) => state.audio.currentTrack)
      ),
      mergeMap(([_, tracks, currentTrack]) => {
        if (!currentTrack) {
          return of(
            AudioActions.playPreviousFailure({
              error: 'No track playing',
            })
          );
        }

        const previousTrack = this.audioService.playPrevious(
          tracks,
          currentTrack
        );
        if (!previousTrack) {
          return of(
            AudioActions.playPreviousFailure({
              error: 'No previous track available',
            })
          );
        }

        return of(AudioActions.playTrack({ track: previousTrack }));
      })
    )
  );

  constructor(
    private actions$: Actions,
    private audioManager: AudioManagerService,
    private audioService: AudioService,
    private indexedDB: IndexedDBService,
    private store: Store
  ) {}
}
