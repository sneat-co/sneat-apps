import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RepoPageRoutingModule} from './repo-routing.module';
import {RepoPageComponent} from './repo-page.component';
import {SneatErrorCardModule} from '@sneat/components/error-card';
import {DatatugServicesNavModule} from '@sneat/datatug/services/nav';
import {IonicModule} from '@ionic/angular';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RepoPageRoutingModule,
		SneatErrorCardModule,
    DatatugServicesNavModule,
	],
	declarations: [RepoPageComponent]
})
export class RepoPageModule {
}
