import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CountryInputModule, CountrySelectorModule } from '@sneat/components';
import { ContactInputModule } from '@sneat/extensions/contactus';
import { FreightOrdersServiceModule } from '../../services/freight-orders.service';
import { OrdersListModule } from '../../components/orders-list/orders-list.module';
import { ExpressOrdersPageComponent } from './express-orders-page.component';

const routes: Routes = [
	{
		path: '',
		component: ExpressOrdersPageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule.forChild(routes),
		FormsModule,
		OrdersListModule,
		FreightOrdersServiceModule,
		ContactInputModule,
		CountrySelectorModule,
		CountryInputModule,
		CountryInputModule,
		CountryInputModule,
	],
	declarations: [
		ExpressOrdersPageComponent,
	],
})
export class ExpressOrdersPageModule {
}
