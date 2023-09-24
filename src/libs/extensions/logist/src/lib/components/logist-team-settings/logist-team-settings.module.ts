import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddressFormComponent } from '@sneat/components';
import { LogistTeamRolesComponent } from '../logist-team-roles/logist-team-roles.component';
import { LogistTeamSettingsComponent } from './logist-team-settings.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		ReactiveFormsModule,
		AddressFormComponent,
	],
	declarations: [
		LogistTeamSettingsComponent,
		LogistTeamRolesComponent,
	],
	exports: [
		LogistTeamSettingsComponent,
	],
})
export class LogistTeamSettingsModule {
}
