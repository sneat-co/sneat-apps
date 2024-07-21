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
import { LogistSpaceMenuItemsModule } from '../../components/logist-team-menu-items/logist-space-menu-items.module';
import { LogistSpaceSettingsModule } from '../../components/logist-team-settings/logist-space-settings.module';
import { LogistSpaceServiceModule } from '../../services/logist-space.service';
import { LogistSpacePageComponent } from './logist-space-page.component';

const routes: Routes = [
	{
		path: '',
		component: LogistSpacePageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule.forChild(routes),
		LogistSpaceMenuItemsModule,
		CountryInputComponent,
		LogistSpaceServiceModule,
		CountrySelectorComponent,
		ReactiveFormsModule,
		AddressFormComponent,
		LogistSpaceSettingsModule,
	],
	declarations: [LogistSpacePageComponent],
})
export class LogistSpacePageModule {}
