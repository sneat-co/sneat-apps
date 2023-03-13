import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DialogHeaderModule } from '@sneat/components';
import { OrderContainerFormComponent } from './order-container-form.component';
import { OrderContainersSelectorDialogComponent } from './order-containers-selector-dialog.component';
import { OrderContainersSelectorComponent } from './order-containers-selector.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		DialogHeaderModule,
	],
	declarations: [
		OrderContainerFormComponent,
		OrderContainersSelectorComponent,
		OrderContainersSelectorDialogComponent,
	],
	exports: [
		OrderContainersSelectorDialogComponent,
		OrderContainersSelectorComponent,
	],
})
export class OrderContainersSelectorModule {
}
