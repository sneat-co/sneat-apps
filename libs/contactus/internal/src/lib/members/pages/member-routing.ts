import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

export const memberRoutes: Route[] = [
	{
		path: '',
		pathMatch: 'full',
		loadComponent: () =>
			import('./member').then((m) => m.TeamMemberPageComponent),
	},
];

const routes: Route[] = [
	...memberRoutes,
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
	// 	path: 'new-staff',
	// 	loadChildren: () => import('./member-new/member-new.module')
	// 		.then(m => m.MemberNewPageModule),
	// 	...guardRoute,
	// },
];

@NgModule({
	imports: [RouterModule.forChild(routes), CommonModule, IonicModule],
	exports: [RouterModule],
	declarations: [],
})
export class MemberRoutingModule {}
