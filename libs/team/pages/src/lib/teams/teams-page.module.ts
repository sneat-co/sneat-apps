import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TeamsCardModule } from '@sneat/team/components';

import { TeamsPageComponent } from './teams-page.component';
import { IntroComponent } from './intro/intro.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild([
			{
				path: '',
				component: TeamsPageComponent,
			},
		]),
		TeamsCardModule,
	],
	declarations: [TeamsPageComponent, IntroComponent],
})
export class TeamsPageModule {}
