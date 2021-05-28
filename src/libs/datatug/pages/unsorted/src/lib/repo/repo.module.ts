import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StorePageRoutingModule} from './repo-routing.module';
import {RepoPageComponent} from './repo-page.component';
import {SneatErrorCardModule} from '@sneat/components/error-card';
import {IonicModule} from '@ionic/angular';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		StorePageRoutingModule,
		SneatErrorCardModule,
	],
	declarations: [RepoPageComponent]
})
export class RepoPageModule {
}
