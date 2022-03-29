import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AvatarComponent, InviteLinksComponent, MembersListComponent } from './index';

const exports = [
	AvatarComponent,
	InviteLinksComponent,
	MembersListComponent,
];

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
	],
	declarations: [
		...exports,
	],
	exports: exports,
})
export class TeamComponentsModule {
}
