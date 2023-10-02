import { Route } from "@angular/router";

export const membersRoutes: Route[] = [
	{
		path: "members",
		loadComponent: () => import("./pages/members/members-page.component")
			.then(m => m.MembersPageComponent),
		// ...guardRoute,
	},
	{
		path: "new-member",
		loadComponent: () => import("./pages/new-member").then(m => m.NewMemberPageComponent),
		// ...guardRoute,
	},
	{
		path: "member/:contactID",
		loadChildren: () => import("./pages/member-routing").then(m => m.MemberRoutingModule),
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
