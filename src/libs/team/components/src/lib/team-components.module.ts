import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AvatarComponent, InviteLinksComponent, MembersListComponent } from './index';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
	],
	declarations: [AvatarComponent, InviteLinksComponent, MembersListComponent],
	exports: [AvatarComponent, InviteLinksComponent, MembersListComponent],
})
export class TeamComponentsModule {
}
