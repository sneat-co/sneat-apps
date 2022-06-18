import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ExpressTeamPageComponent } from './express-team-page.component';

const routes: Routes = [
	{
		path: '',
		component: ExpressTeamPageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule.forChild(routes),
	],
	declarations: [
		ExpressTeamPageComponent,
	],
})
export class ExpressTeamPageModule {
}
