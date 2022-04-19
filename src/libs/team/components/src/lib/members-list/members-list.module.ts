import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MembersListComponent } from './members-list.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
	],
	declarations: [MembersListComponent],
	exports: [MembersListComponent],
})
export class MembersListModule {

}
