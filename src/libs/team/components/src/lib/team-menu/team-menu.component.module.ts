import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthMenuItemModule, SneatAuthServicesModule } from '@sneat/auth';
import { TeamMenuComponent } from './team-menu.component';

const exports = [TeamMenuComponent];

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		RouterModule,
		AuthMenuItemModule,
	],
	declarations: [...exports],
	exports,
})
export class TeamMenuComponentModule {
}
