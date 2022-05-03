import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ScheduleNavServiceModule } from '@sneat/extensions/schedulus/shared';
import { MembersListComponent } from './members-list.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		ScheduleNavServiceModule,
	],
	declarations: [MembersListComponent],
	exports: [MembersListComponent],
})
export class MembersListModule {

}
