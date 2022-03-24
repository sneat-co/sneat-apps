import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { SneatAppHomePageRoutingModule } from './sneat-app-home-page-routing.module';
import { SneatAppHomePageComponent } from './sneat-app-home-page.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		SneatAppHomePageRoutingModule,
	],
	declarations: [SneatAppHomePageComponent],
})
export class SneatAppHomePageComponentModule {
}
