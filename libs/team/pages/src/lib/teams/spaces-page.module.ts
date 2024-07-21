import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { SpacesCardModule } from '@sneat/team-components';

import { SpacesPageComponent } from './spaces-page.component';
import { IntroComponent } from './intro/intro.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild([
			{
				path: '',
				component: SpacesPageComponent,
			},
		]),
		SpacesCardModule,
	],
	declarations: [SpacesPageComponent, IntroComponent],
})
export class SpacesPageModule {}
