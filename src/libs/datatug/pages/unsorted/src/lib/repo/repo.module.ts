import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RepoPageRoutingModule} from './repo-routing.module';
import {RepoPageComponent} from './repo-page.component';
import {SneatErrorCardModule} from '@sneat/components/error-card';
import {IonicModule} from '@ionic/angular';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RepoPageRoutingModule,
		SneatErrorCardModule,
	],
	declarations: [RepoPageComponent]
})
export class RepoPageModule {
}
