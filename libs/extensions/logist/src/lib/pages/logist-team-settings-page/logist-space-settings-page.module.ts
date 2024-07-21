import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LogistSpaceSettingsModule } from '../../components/logist-team-settings/logist-space-settings.module';
import { LogistSpaceServiceModule } from '../../services';
import { LogistSpaceSettingsPageComponent } from './logist-space-settings-page.component';

const routes: Routes = [
	{
		path: '',
		component: LogistSpaceSettingsPageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule.forChild(routes),
		LogistSpaceSettingsModule,
		LogistSpaceServiceModule,
	],
	declarations: [LogistSpaceSettingsPageComponent],
})
export class LogistSpaceSettingsPageModule {}
