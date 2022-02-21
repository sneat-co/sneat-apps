import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { RoutesToCommuneModule } from "@sneat/communes/ui";

const routes: Routes = [
	{
		path: "communes",
		loadChildren: () =>
			import("@sneat/communes/ui").then(m => m.CommunesRoutingModule),
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
		RoutesToCommuneModule,
	],
	exports: [RouterModule],
})
export class AppRoutingModule {
}
