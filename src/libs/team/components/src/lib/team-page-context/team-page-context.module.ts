import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamPageContextComponent } from './team-page-context.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

const exports: any[] = [TeamPageContextComponent];

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		IonicModule,
	],
	declarations: [...exports],
	exports,
})
export class TeamPageContextModule {
}
