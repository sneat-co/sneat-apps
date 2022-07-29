import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DialogHeaderComponent } from './dialog-header.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
	],
	declarations: [
		DialogHeaderComponent,
	],
	exports: [
		DialogHeaderComponent,
	],
})
export class DialogHeaderModule {
}
