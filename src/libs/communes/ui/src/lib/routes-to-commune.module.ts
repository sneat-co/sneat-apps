import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
	{
		path: "family",
		loadChildren: () => import("./commune-page/commune-page.module").then(m => m.CommunePageModule),
	},
];

@NgModule({
	imports: [
		RouterModule.forChild(routes),
	],
})
export class RoutesToCommuneModule {
}
