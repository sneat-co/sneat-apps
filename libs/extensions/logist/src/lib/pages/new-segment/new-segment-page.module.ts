import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NewSegmentModule } from '../../components/new-segment';
import { NewSegmentPageComponent } from './new-segment-page.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule.forChild([
			{
				path: '',
				component: NewSegmentPageComponent,
			},
		]),
		NewSegmentModule,
	],
	declarations: [NewSegmentPageComponent],
})
export class NewSegmentPageModule {}
