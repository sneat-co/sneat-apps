import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FreightCardComponent } from '../freight-card/freight-card.component';
import { FreightsListComponent } from './freights-list.component';


@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule,
	],
	declarations: [
		FreightsListComponent,
		FreightCardComponent,
	],
	exports: [
		FreightsListComponent,
		FreightCardComponent,
	],
})
export class FreightsListModule {

}
