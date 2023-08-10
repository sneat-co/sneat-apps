import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MembersListModule } from '../..';
import { TeamCoreComponentsModule } from '@sneat/team/components';
import { MembersPageComponent } from './members-page.component';

@NgModule({
	imports: [
		IonicModule,
		CommonModule,
		FormsModule,
		RouterModule.forChild([{ path: '', component: MembersPageComponent }]),
		TeamCoreComponentsModule,
		MembersListModule,
	],
	declarations: [MembersPageComponent],
})
export class MembersPageModule {
}
