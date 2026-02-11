import { Route } from '@angular/router';

export const trackusSpaceRoutes: Route[] = [
  {
    path: 'trackers',
    data: { title: 'Trackers' },
    pathMatch: 'full',
    loadComponent: () =>
      import('./trackers-page/trackers-page.component').then(
        (m) => m.TrackersPageComponent,
      ),
  },
  {
    path: 'trackers/new-tracker',
    data: { title: 'New tracker' },
    pathMatch: 'full',
    loadComponent: () =>
      import('./new-tracker/new-tracker-page.component').then(
        (m) => m.NewTrackerPageComponent,
      ),
  },
  {
    path: 'trackers/:trackerID',
    data: { title: 'Tracker' },
    pathMatch: 'full',
    loadComponent: () =>
      import('./tracker-page/tracker-page.component').then(
        (m) => m.TrackerPageComponent,
      ),
  },
];
