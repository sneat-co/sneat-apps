import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RepoPageRoutingModule} from './repo-routing.module';
import {RepoPage} from './repo.page';
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
	declarations: [RepoPage]
})
export class RepoPageModule {
}
