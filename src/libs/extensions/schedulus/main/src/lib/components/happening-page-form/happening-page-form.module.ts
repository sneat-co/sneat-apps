import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import { HappeningServiceModule } from '../../services/happening.service';
import { RecurringCommonModule } from '../recurring-common.module';
import { HappeningPageFormComponent } from './happening-page-form.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		ReactiveFormsModule,
		RecurringCommonModule,
		SneatPipesModule,
		HappeningServiceModule,
	],
	declarations: [
		HappeningPageFormComponent,
	],
	exports: [
		HappeningPageFormComponent,
	],
})
export class HappeningPageFormModule {

}
