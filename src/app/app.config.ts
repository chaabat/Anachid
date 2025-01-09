import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { routes } from './app.routes';
import { audioReducer } from './store/audio/audio.reducer';
import { AudioEffects } from './store/audio/audio.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore({
      audio: audioReducer,
    }),
    provideEffects([AudioEffects]),
  ],
};
