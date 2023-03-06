import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthMenuItemModule } from '@sneat/auth';
import { TeamsMenuComponentModule } from '@sneat/team/components';
import { LogistTeamMenuItemsModule } from '../express-team-menu-items/logist-team-menu-items.module';
import { LogistTeamMenuComponent } from './logist-team-menu.component';


@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule,
		AuthMenuItemModule,
		TeamsMenuComponentModule,
		LogistTeamMenuItemsModule,
	],
	declarations: [
		LogistTeamMenuComponent,
	],
	exports: [
		LogistTeamMenuComponent,
	],
})
export class LogistTeamMenuModule {

}
