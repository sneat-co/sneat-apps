import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TeamPageTitleComponent } from '../team-page-title/team-page-title.component';
import { TeamContextComponent } from './team-context.component';

const exports: any[] = [
	TeamContextComponent,
	TeamPageTitleComponent,
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		IonicModule,
	],
	declarations: [...exports],
	exports,
})
export class TeamComponentContextModule {
}
