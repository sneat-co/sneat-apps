import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { RouterModule, Routes } from "@angular/router";
import { NewCommunePageComponent } from "./new-commune-page.component";
import { FormsModule } from "@angular/forms";
import { NewFamilyWizardComponent } from "../new-family-wizard/new-family-wizard.component";
import { NewFamilyWizardModule } from "../new-family-wizard/new-family-wizard.module";

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
		NewFamilyWizardModule,
	],
	declarations: [NewCommunePageComponent],
})
export class NewCommunePageModule {
}
