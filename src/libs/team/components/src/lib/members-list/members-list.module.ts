import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import { ScheduleNavServiceModule } from '@sneat/extensions/schedulus/shared';
import { MembersListComponent } from './members-list.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		ScheduleNavServiceModule,
		SneatPipesModule,
	],
	declarations: [MembersListComponent],
	exports: [MembersListComponent],
})
export class MembersListModule {

}
