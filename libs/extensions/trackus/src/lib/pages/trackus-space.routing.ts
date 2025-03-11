// import { NgModule } from '@angular/core';
import { Route } from '@angular/router';

export const trackusSpaceRoutes: Route[] = [
	{
		path: 'trackers',
		pathMatch: 'full',
		loadComponent: () =>
			import('./trackers-page/trackers-page.component').then(
				(m) => m.TrackersPageComponent,
			),
	},
	{
		path: 'trackers/:trackerID',
		pathMatch: 'full',
		loadComponent: () =>
			import('./tracker-page/tracker-page.component').then(
				(m) => m.TrackerPageComponent,
			),
	},
];
