import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TeamsListModule } from '@sneat/team/components';
import { ForEducatorsComponent } from './for-educators.component';
import { ForFamiliesComponent } from './for-families.component';
import { ForWorkComponent } from './for-work.component';
import { ForTeamTypeCardComponent } from '../../components/for-team-type-card.component';

import { SneatAppHomePageRoutingModule } from './sneat-app-home-page-routing.module';
import { SneatAppHomePageComponent } from './sneat-app-home-page.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		SneatAppHomePageRoutingModule,
		TeamsListModule,
	],
	declarations: [
		SneatAppHomePageComponent,
		ForTeamTypeCardComponent,
		ForFamiliesComponent,
		ForEducatorsComponent,
		ForWorkComponent
	],
})
export class SneatAppHomePageComponentModule {
}
