import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SelectFromListModule } from '@sneat/components';
import { NewSegmentModule } from '../../components/new-segment/new-segment.module';
import { OrderRouteCardModule } from '../../components/order-route-card/order-route-card.module';
import { OrderContainersModule } from '../../components/order-containers-card';
import { OrderFormModule } from '../../components/order-form.module';
import { LogistTeamServiceModule } from '../../services';
import { LogistOrderServiceModule } from '../../services/logist-order.service';
import { NewLogistOrderPageComponent } from './new-logist-order-page.component';
import { NewOrderContainersFormComponent } from './new-order-containers-form.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule.forChild([
			{
				path: '',
				component: NewLogistOrderPageComponent,
			},
		]),
		LogistOrderServiceModule,
		OrderRouteCardModule,
		OrderContainersModule,
		OrderFormModule,
		LogistTeamServiceModule,
		FormsModule,
		NewSegmentModule,
		SelectFromListModule,
	],
	declarations: [NewLogistOrderPageComponent, NewOrderContainersFormComponent],
})
export class NewLogistOrderPageModule {}
