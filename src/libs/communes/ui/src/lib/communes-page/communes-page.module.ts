import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { CommunesPageComponent } from "./communes-page.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
	{
		path: "",
		component: CommunesPageComponent,
	},
];


@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule.forChild(routes),
	],
	declarations: [CommunesPageComponent],
})
export class CommunesPageModule {
}
