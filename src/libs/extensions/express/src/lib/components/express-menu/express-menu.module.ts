import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ExpressMenuComponent } from './express-menu.component';


@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule,
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
