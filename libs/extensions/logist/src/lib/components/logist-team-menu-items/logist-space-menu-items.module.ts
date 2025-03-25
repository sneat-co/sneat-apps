import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthMenuItemComponent } from '@sneat/components';
import { SpacesMenuComponent } from '@sneat/space-components';
import { LogistSpaceMenuItemsComponent } from './logist-space-menu-items.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule,
		AuthMenuItemComponent,
		SpacesMenuComponent,
	],
	declarations: [LogistSpaceMenuItemsComponent],
	exports: [LogistSpaceMenuItemsComponent],
})
export class LogistSpaceMenuItemsModule {}
