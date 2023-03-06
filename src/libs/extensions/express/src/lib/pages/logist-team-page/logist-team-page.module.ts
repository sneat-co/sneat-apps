import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CountryInputModule, CountrySelectorModule } from '@sneat/components';
import { LogistTeamMenuItemsModule } from '../../components/logist-team-menu-items/logist-team-menu-items.module';
import { LogistTeamSettingsComponent } from '../../components/logist-team-settings/logist-team-settings.component';
import { LogistTeamServiceModule } from '../../services/logist-team.service';
import { LogistTeamPageComponent } from './logist-team-page.component';

const routes: Routes = [
	{
		path: '',
		component: LogistTeamPageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule.forChild(routes),
		LogistTeamMenuItemsModule,
		CountryInputModule,
		LogistTeamServiceModule,
		CountrySelectorModule,
		ReactiveFormsModule,
	],
	declarations: [
		LogistTeamPageComponent,
		LogistTeamSettingsComponent,
	],
})
export class LogistTeamPageModule {
}
