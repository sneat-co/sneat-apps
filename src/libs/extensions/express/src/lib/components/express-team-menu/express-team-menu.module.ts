import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthMenuItemModule } from '@sneat/auth';
import { TeamsMenuComponentModule } from '@sneat/team/components';
import { ExpressTeamMenuComponent } from './express-team-menu.component';


@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule,
		AuthMenuItemModule,
		TeamsMenuComponentModule,
	],
	declarations: [
		ExpressTeamMenuComponent,
	],
	exports: [
		ExpressTeamMenuComponent,
	],
})
export class ExpressTeamMenuModule {

}
