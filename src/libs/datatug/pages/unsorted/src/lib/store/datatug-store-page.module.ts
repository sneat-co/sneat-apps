import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatatugStorePageRoutingModule } from './datatug-store-routing.module';
import { DatatugStorePageComponent } from './datatug-store-page.component';
import { SneatErrorCardModule } from '@sneat/components';
import { IonicModule } from '@ionic/angular';
import { NewProjectFormModule } from '@sneat/datatug/project';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		DatatugStorePageRoutingModule,
		SneatErrorCardModule,
		NewProjectFormModule,
	],
	declarations: [DatatugStorePageComponent],
})
export class DatatugStorePageModule {}
