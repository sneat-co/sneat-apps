import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TeamPageRoutingModule } from './team-page-routing.module';
import { TeamPageComponent } from './team-page.component';
import { MetricsComponent } from './metrics/metrics.component';
import { RetrospectivesComponent } from './retrospectives/retrospectives.component';
import { ScrumsComponent } from './scrums/scrums.component';
import { MembersComponent } from './members/members.component';
import { TeamMenuComponentModule, TeamPageContextModule } from '@sneat/team/components';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		TeamPageRoutingModule,
		TeamPageContextModule,
		TeamMenuComponentModule,
	],
	declarations: [
		MembersComponent,
		MetricsComponent,
		RetrospectivesComponent,
		ScrumsComponent,
		TeamPageComponent,
	],
})
export class TeamPageModule {
}
