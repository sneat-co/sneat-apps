import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DialogHeaderModule } from '@sneat/components';
import { ContactInputModule } from '@sneat/extensions/contactus';
import { OrderNavServiceModule } from '../../services';
import { ContactWithRefNumModule } from '../contact-with-refnum/contact-with-ref-num.module';
import { OrderContainersSelectorModule } from '../order-containers-selector/order-containers-selector.module';
import { OrderFormModule } from '../order-form.module';
import { NewShippingPointDialogComponent } from './new-shipping-point-dialog.component';
import { NewShippingPointService } from './new-shipping-point.service';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		DialogHeaderModule,
		ContactInputModule,
		FormsModule,
		OrderFormModule,
		OrderContainersSelectorModule,
		OrderNavServiceModule,
		ContactWithRefNumModule,
	],
	declarations: [
		NewShippingPointDialogComponent,
	],
	providers: [
		NewShippingPointService,
	]
})
export class NewShippingPointModule {

}
