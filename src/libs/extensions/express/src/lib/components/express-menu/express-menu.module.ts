import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthMenuItemModule } from '@sneat/auth';
import { AppVersionModule } from '@sneat/components';
import { TeamsMenuComponentModule } from '@sneat/team/components';
import { ExpressMenuComponent } from './express-menu.component';


@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule,
		AuthMenuItemModule,
		TeamsMenuComponentModule,
		AppVersionModule,
		AppVersionModule,
		AppVersionModule,
	],
	declarations: [
		ExpressMenuComponent,
	],
	exports: [
		ExpressMenuComponent,
	],
})
export class ExpressMenuModule {

}
