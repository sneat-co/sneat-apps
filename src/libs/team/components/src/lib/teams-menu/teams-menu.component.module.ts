import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TeamsMenuComponent } from './teams-menu.component';

const exports = [TeamsMenuComponent];

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		RouterModule,
	],
	declarations: [...exports],
	exports,
})
export class TeamsMenuComponentModule {
}

