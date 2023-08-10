import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DialogHeaderModule } from '@sneat/components';
import { ContactInputModule } from '@sneat/contactus/shared';
import { OrderNavServiceModule } from '../../services';
import { ContactWithRefNumModule } from '../contact-with-refnum/contact-with-ref-num.module';
import { OrderContainersSelectorModule } from '../order-containers-selector/order-containers-selector.module';
import { NewShippingPointDialogComponent } from './new-shipping-point-dialog.component';
import { NewShippingPointFormComponent } from './new-shipping-point-form.component';
import { NewShippingPointService } from './new-shipping-point.service';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		DialogHeaderModule,
		ContactInputModule,
		FormsModule,
		// OrderFormModule,
		OrderContainersSelectorModule,
		OrderNavServiceModule,
		ContactWithRefNumModule,
	],
	declarations: [
		NewShippingPointDialogComponent,
		NewShippingPointFormComponent,
	],
	providers: [
		NewShippingPointService,
	]
})
export class NewShippingPointModule {
}
