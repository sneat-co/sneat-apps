import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DialogComponent } from './dialog.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
	],
	declarations: [
		DialogComponent,
	],
	exports: [
		DialogComponent,
	],
})
export class DialogModule {
}
