import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StorePageRoutingModule} from './store-routing.module';
import {StorePageComponent} from './store-page.component';
import {SneatErrorCardModule} from '@sneat/components/error-card';
import {IonicModule} from '@ionic/angular';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		StorePageRoutingModule,
		SneatErrorCardModule,
	],
	declarations: [StorePageComponent]
})
export class StorePageModule {
}
