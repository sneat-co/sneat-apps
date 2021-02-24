import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {JoinTeamPageRoutingModule} from './join-team-routing.module';

import {JoinTeamPage} from './join-team.page';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		JoinTeamPageRoutingModule
	],
	declarations: [JoinTeamPage]
})
export class JoinTeamPageModule {
}
