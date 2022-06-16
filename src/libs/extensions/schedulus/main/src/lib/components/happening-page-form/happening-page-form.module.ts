import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import { HappeningServiceModule } from '@sneat/team/services';
import { HappeningMembersFormComponent } from '../happening-members-form/happening-members-form.component';
import { HappeningSlotComponentsModule } from '../happening-slot-components.module';
import { HappeningPageFormComponent } from './happening-page-form.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		ReactiveFormsModule,
		HappeningSlotComponentsModule,
		SneatPipesModule,
		HappeningServiceModule,
	],
	declarations: [
		HappeningPageFormComponent,
		HappeningMembersFormComponent,
	],
	exports: [
		HappeningPageFormComponent,
	],
})
export class HappeningPageFormModule {

}
