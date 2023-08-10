import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthMenuItemModule } from '@sneat/components';
import { TeamsMenuComponentModule } from '@sneat/team/components';
import { LogistTeamMenuItemsComponent } from './logist-team-menu-items.component';


@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule,
		AuthMenuItemModule,
		TeamsMenuComponentModule,
	],
	declarations: [
		LogistTeamMenuItemsComponent,
	],
	exports: [
		LogistTeamMenuItemsComponent,
	],
})
export class LogistTeamMenuItemsModule {
}
