import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InviteModalComponent } from './invite-modal.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		ReactiveFormsModule,
	],
	declarations: [
		InviteModalComponent,
	],
	exports: [
		InviteModalComponent,
	]
})
export class InviteModalModule {
}
