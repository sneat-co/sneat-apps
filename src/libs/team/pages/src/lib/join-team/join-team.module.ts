import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JoinTeamPageRoutingModule } from './join-team-routing.module';

import { JoinTeamPageComponent } from './join-team-page.component';

@NgModule({
	imports: [CommonModule, FormsModule, IonicModule, JoinTeamPageRoutingModule],
	declarations: [JoinTeamPageComponent],
})
export class JoinTeamPageModule {
}
