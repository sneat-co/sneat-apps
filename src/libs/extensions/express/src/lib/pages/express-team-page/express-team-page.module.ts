import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CountryInputModule, CountrySelectorModule } from '@sneat/components';
import { ExpressTeamMenuItemsModule } from '../../components/express-team-menu-items/express-team-menu-items.module';
import { ExpressTeamSettingsComponent } from '../../components/express-team-settings/express-team-settings.component';
import { ExpressTeamServiceModule } from '../../services/express-team.service';
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
		ExpressTeamMenuItemsModule,
		CountryInputModule,
		ExpressTeamServiceModule,
		CountrySelectorModule,
		ReactiveFormsModule,
	],
	declarations: [
		ExpressTeamPageComponent,
		ExpressTeamSettingsComponent,
	],
})
export class ExpressTeamPageModule {
}
