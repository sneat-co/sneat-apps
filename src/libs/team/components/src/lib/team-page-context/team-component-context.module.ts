import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamContextComponent } from './team-context.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

const exports: any[] = [TeamContextComponent];

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
