import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FreightLoadFormComponent } from './freight-load-form.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		ReactiveFormsModule,
	],
	declarations: [
		FreightLoadFormComponent,
	],
	exports: [
		FreightLoadFormComponent,
	],
	// exports: [
	// 	FreightLoadFormComponent,
	// ],
})
export class FreightLoadFormModule {
}
