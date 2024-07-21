import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddressFormComponent } from '@sneat/components';
import { LogistSpaceRolesComponent } from '../logist-team-roles/logist-space-roles.component';
import { LogistSpaceSettingsComponent } from './logist-space-settings.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		ReactiveFormsModule,
		AddressFormComponent,
	],
	declarations: [LogistSpaceSettingsComponent, LogistSpaceRolesComponent],
	exports: [LogistSpaceSettingsComponent],
})
export class LogistSpaceSettingsModule {}
