import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AppVersionComponent, AuthMenuItemComponent } from '@sneat/components';
import { TeamsMenuComponentModule } from '@sneat/team/components';
import { LogistMenuComponent } from './logist-menu.component';


@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule,
		AuthMenuItemComponent,
		TeamsMenuComponentModule,
		AppVersionComponent,
	],
	declarations: [
		LogistMenuComponent,
	],
	exports: [
		LogistMenuComponent,
	],
})
export class LogistMenuModule {

}
