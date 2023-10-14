import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {
	AddressFormComponent,
	CountryInputComponent,
	CountrySelectorComponent,
} from '@sneat/components';
import { LogistTeamMenuItemsModule } from '../../components/logist-team-menu-items/logist-team-menu-items.module';
import { LogistTeamSettingsModule } from '../../components/logist-team-settings/logist-team-settings.module';
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
		CountryInputComponent,
		LogistTeamServiceModule,
		CountrySelectorComponent,
		ReactiveFormsModule,
		AddressFormComponent,
		LogistTeamSettingsModule,
	],
	declarations: [LogistTeamPageComponent],
})
export class LogistTeamPageModule {}
