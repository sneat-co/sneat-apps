import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LogistTeamSettingsModule } from '../../components/logist-team-settings/logist-team-settings.module';
import { LogistTeamServiceModule } from '../../services';
import { LogistTeamSettingsPageComponent } from './logist-team-settings-page.component';

const routes: Routes = [
	{
		path: '',
		component: LogistTeamSettingsPageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule.forChild(routes),
		LogistTeamSettingsModule,
		LogistTeamServiceModule,
	],
	declarations: [LogistTeamSettingsPageComponent],
})
export class LogistTeamSettingsPageModule {}
