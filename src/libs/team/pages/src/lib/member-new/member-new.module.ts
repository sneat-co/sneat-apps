import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MemberNewPageRoutingModule } from './member-new-routing.module';
import { MemberNewPageComponent } from './member-new-page.component';
import { TeamComponentsModule } from '@sneat/team/components';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		ReactiveFormsModule,
		MemberNewPageRoutingModule,
		TeamComponentsModule,
	],
	declarations: [MemberNewPageComponent],
})
export class MemberNewPageModule {
}
