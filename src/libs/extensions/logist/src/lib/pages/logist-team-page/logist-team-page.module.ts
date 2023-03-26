import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AddressFormModule, CountryInputModule, CountrySelectorModule } from '@sneat/components';
import { ContactServiceModule } from '@sneat/extensions/contactus';
import { LogistTeamMenuItemsModule } from '../../components/logist-team-menu-items/logist-team-menu-items.module';
import { LogistTeamRolesComponent } from '../../components/logist-team-roles/logist-team-roles.component';
import { LogistTeamSettingsComponent } from '../../components/logist-team-settings/logist-team-settings.component';
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
		CountryInputModule,
		LogistTeamServiceModule,
		CountrySelectorModule,
		ReactiveFormsModule,
		AddressFormModule,
		LogistTeamSettingsModule,
	],
	declarations: [
		LogistTeamPageComponent,
	],
})
export class LogistTeamPageModule {
}
