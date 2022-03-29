import { Route } from '@angular/router';
// import { guardRoute } from '../../../utils/guard-route';

export const memberRoutes: Route[] = [
	{
		path: 'member/:id',
		loadChildren: () => import('./member/team-member-page.module')
			.then(m => m.TeamMemberPageModule),
		// ...guardRoute,
	},
	// {
	// 	path: 'remove-member',
	// 	loadChildren: () => import('./member/commune-member.module')
	// 		.then(m => m.TeamMemberPageModule),
	// 	...guardRoute,
	// },
	// {
	// 	path: 'member-assets',
	// 	loadChildren: () => import('./member-assets/member-assets.module')
	// 		.then(m => m.MemberAssetsPageModule),
	// 	...guardRoute,
	// },
	// {
	// 	path: 'member-budget',
	// 	loadChildren: () => import('./member-budget/member-budget.module')
	// 		.then(m => m.MemberBudgetPageModule),
	// 	...guardRoute,
	// },
	// {
	// 	path: 'member-contacts',
	// 	loadChildren: () => import('./member-contacts/member-contacts.module')
	// 		.then(m => m.MemberContactsPageModule),
	// 	...guardRoute,
	// },
	// {
	// 	path: 'member-documents',
	// 	loadChildren: () => import('./member-documents/member-documents.module')
	// 		.then(m => m.MemberDocumentsPageModule),
	// 	...guardRoute,
	//
	// },
	// {
	// 	path: 'member-schedule',
	// 	loadChildren: () => import('../../schedule/schedule/schedule-page.module')
	// 		.then(m => m.SchedulePageModule),
	// 	...guardRoute,
	// },
	// {
	// 	path: 'new-member',
	// 	loadChildren: () => import('./member-new/member-new.module')
	// 		.then(m => m.MemberNewPageModule),
	// 	...guardRoute,
	// },
	// {
	// 	path: 'new-staff',
	// 	loadChildren: () => import('./member-new/member-new.module')
	// 		.then(m => m.MemberNewPageModule),
	// 	...guardRoute,
	// },
];
