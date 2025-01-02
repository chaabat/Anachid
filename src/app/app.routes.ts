import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/tracks',
    pathMatch: 'full',
  },
  {
    path: 'tracks',
    loadComponent: () =>
      import('./components/tracks/tracks-list/tracks-list.component').then(
        (m) => m.TracksListComponent
      ),
  },
  {
    path: 'tracks/:id',
    loadComponent: () =>
      import('./components/tracks/track-details/track-details.component').then(
        (m) => m.TrackDetailsComponent
      ),
  },
];
