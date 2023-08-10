import { Route } from '@angular/router';

export const membersRoutes: Route[] = [
	{
		path: 'members',
		loadChildren: () => import('./pages/members/members-page.module')
			.then(m => m.MembersPageModule),
		// ...guardRoute,
	},

	// {
	// 	path: 'pupils',
	// 	loadChildren: () => import('./pupils/pupils.module')
	// 		.then(m => m.PupilsPageModule),
	// 	// ...guardRoute,
	// },
	// {
	// 	path: 'staff',
	// 	loadChildren: () => import('./staff/staff.module')
	// 		.then(m => m.StaffPageModule),
	// 	// ...guardRoute,
	// },
];
