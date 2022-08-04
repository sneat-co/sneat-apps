import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OrderContainersSelectorComponent } from './order-containers-selector.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
	],
	declarations: [
		OrderContainersSelectorComponent,
	],
	exports: [
		OrderContainersSelectorComponent,
	],
})
export class OrderContainersSelectorModule {
}
