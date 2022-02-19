import { NgModule } from "@angular/core";
import { NewFamilyWizardComponent } from "./new-family-wizard.component";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
	],
	declarations: [
		NewFamilyWizardComponent,
	],
	exports: [
		NewFamilyWizardComponent,
	],
})
export class NewFamilyWizardModule {

}
