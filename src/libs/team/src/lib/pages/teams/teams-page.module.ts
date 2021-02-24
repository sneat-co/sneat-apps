import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';

import {TeamsPage} from './teams-page.component';
import {IntroComponent} from './intro/intro.component';
import {TeamsCardComponent} from './teams-card/teams-card.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild([
			{
				path: '',
				component: TeamsPage
			}
		])
	],
	declarations: [TeamsPage, IntroComponent, TeamsCardComponent]
})
export class TeamsPageModule {
}
