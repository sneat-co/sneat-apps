import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TeamsListComponent } from './teams-list.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule,
	],
	declarations: [
		TeamsListComponent,
	],
	exports: [
		TeamsListComponent,
	]
})
export class TeamsListModule {

}
