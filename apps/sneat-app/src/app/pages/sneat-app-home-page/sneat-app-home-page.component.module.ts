import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { UserCountryComponent } from '@sneat/components';
import { TeamsListModule } from '@sneat/team/components';
import { ForEducatorsComponent } from './for-educators.component';
import { ForFamiliesComponent } from './for-families.component';
import { ForWorkComponent } from './for-work.component';
import { ForTeamTypeCardComponent } from '../../components/for-team-type-card.component';

// import { SneatAppHomePageRoutingModule } from './sneat-app-home-page-routing.module';
import { SneatAppHomePageComponent } from './sneat-app-home-page.component';

const routes: Routes = [
	{
		path: '',
		component: SneatAppHomePageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes),
		TeamsListModule,
		UserCountryComponent,
	],
	declarations: [
		SneatAppHomePageComponent,
		ForTeamTypeCardComponent,
		ForFamiliesComponent,
		ForEducatorsComponent,
		ForWorkComponent,
	],
})
export class SneatAppHomePageComponentModule {}
