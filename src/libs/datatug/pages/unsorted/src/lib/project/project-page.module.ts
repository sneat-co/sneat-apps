import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {ProjectPageRoutingModule} from './project-routing.module';
import {ProjectPageComponent} from './project-page.component';
import {SneatCardListModule} from '@sneat/components/card-list';
import {WormholeModule} from '@sneat/wormhole';
import {DatatugComponentsProjectModule} from "@sneat/datatug/components/project";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ProjectPageRoutingModule,
		SneatCardListModule,
		DatatugComponentsProjectModule,
		WormholeModule,
	],
	declarations: [ProjectPageComponent],
})
export class ProjectPageModule {
}
