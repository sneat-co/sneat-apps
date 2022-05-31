import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { PersonFormModule } from '@sneat/components';

import { JoinTeamPageRoutingModule } from './join-team-routing.module';

import { JoinTeamPageComponent } from './join-team-page.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		JoinTeamPageRoutingModule,
		PersonFormModule,
	],
	declarations: [JoinTeamPageComponent],
})
export class JoinTeamPageModule {
}
