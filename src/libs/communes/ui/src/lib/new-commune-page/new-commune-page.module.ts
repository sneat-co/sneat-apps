import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { RouterModule, Routes } from "@angular/router";
import { NewCommunePageComponent } from "./new-commune-page.component";
import { FormsModule } from "@angular/forms";

const routes: Routes = [
	{
		path: "",
		component: NewCommunePageComponent,
	},
];


@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		RouterModule.forChild(routes),
	],
	declarations: [NewCommunePageComponent],
})
export class NewCommunePageModule {
}
