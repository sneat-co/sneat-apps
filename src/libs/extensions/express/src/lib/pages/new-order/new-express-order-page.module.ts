import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ContactServiceModule } from '@sneat/extensions/contactus';
import { ExpressTeamServiceModule } from '../..';
import { NewSegmentModule } from '../../components/new-segment/new-segment.module';
import { OrderRouteCardModule } from '../../components/order-route-card/order-route-card.module';
import { OrderContainersModule } from '../../components/order-containers-card';
import { OrderFormModule } from '../../components/order-form.module';
import { FreightOrdersServiceModule } from '../../services/freight-orders.service';
import { NewExpressOrderPageComponent } from './new-express-order-page.component';
import { NewOrderContainersFormComponent } from './new-order-containers-form.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule.forChild([
			{
				path: '',
				component: NewExpressOrderPageComponent,
			},
		]),
		FreightOrdersServiceModule,
		OrderRouteCardModule,
		OrderContainersModule,
		OrderFormModule,
		ExpressTeamServiceModule,
		ContactServiceModule,
		FormsModule,
		NewSegmentModule,
	],
	declarations: [
		NewExpressOrderPageComponent,
		NewOrderContainersFormComponent,
	],
})
export class NewExpressOrderPageModule {

}
