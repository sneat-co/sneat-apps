import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddressFormModule } from '@sneat/components';
import { ContactServiceModule } from '@sneat/extensions/contactus';
import { LogistTeamRolesComponent } from '../logist-team-roles/logist-team-roles.component';
import { LogistTeamSettingsComponent } from './logist-team-settings.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		ContactServiceModule,
		ReactiveFormsModule,
		AddressFormModule,
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
