import { Route } from '@angular/router';

export const membersRoutes: Route[] = [
	{
		path: 'members',
		loadChildren: () => import('./pages/members/members-page.module')
			.then(m => m.MembersPageModule),
		// ...guardRoute,
	},
	{
		path: 'new-member',
		loadChildren: () => import('./pages/new-member/new-member-page.module')
			.then(m => m.NewMemberPageModule),
		// ...guardRoute,
	},
	{
		path: 'member',
		loadChildren: () => import('./pages/member-routing').then(m => m.MemberRoutingModule),
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
