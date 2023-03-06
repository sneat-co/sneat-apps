import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CountryInputModule, CountrySelectorModule } from '@sneat/components';
import { ContactInputModule } from '@sneat/extensions/contactus';
import { OrdersGridModule } from '../../components/orders-grid/orders-grid.module';
import { LogistOrderServiceModule } from '../../services/logist-order.service';
import { OrdersListModule } from '../../components/orders-list/orders-list.module';
import { LogistOrdersPageComponent } from './logist-orders-page.component';
import { OrdersFilterComponent } from './orders-filter/orders-filter.component';

const routes: Routes = [
	{
		path: '',
		component: LogistOrdersPageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule.forChild(routes),
		FormsModule,
		OrdersListModule,
		OrdersGridModule,
		LogistOrderServiceModule,
		ContactInputModule,
		CountrySelectorModule,
		CountryInputModule,
		CountryInputModule,
		CountryInputModule,
	],
	declarations: [
		LogistOrdersPageComponent,
		OrdersFilterComponent,
	],
})
export class LogistOrdersPageModule {
}
