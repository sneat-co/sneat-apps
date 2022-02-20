import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RadioGroupToSelectComponent } from "./radio-group-to-select/radio-group-to-select.component";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
	],
	declarations: [
		RadioGroupToSelectComponent,
	],
	exports: [
		RadioGroupToSelectComponent,
	],
})
export class WizardModule {
}
