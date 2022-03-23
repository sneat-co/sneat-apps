import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { RoutesToCommuneModule } from "@sneat/communes/ui";
import { SneatAuthRoutingModule } from "@sneat/auth-ui";
import { TeamRoutingModule } from "@sneat/team/pages";

const routes: Routes = [
	{
		path: "communes",
		loadChildren: () =>
			import("@sneat/communes/ui").then(m => m.CommunesRoutingModule),
	},
	{
		path: 'signed-out',
		redirectTo: 'login',
		pathMatch: 'full',
	},
	{
		path: "",
		redirectTo: "communes",
		pathMatch: "full",
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
		SneatAuthRoutingModule,
		RoutesToCommuneModule,
		TeamRoutingModule,
	],
	exports: [RouterModule],
})
export class SneatAppRoutingModule {
}
