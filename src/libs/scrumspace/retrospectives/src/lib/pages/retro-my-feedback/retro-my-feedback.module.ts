import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {RetroMyFeedbackPageRoutingModule} from './retro-my-feedback-routing.module';

import {RetroMyFeedbackPage} from './retro-my-feedback.page';
import {CommonComponentsModule} from '../../../components/common-components.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RetroMyFeedbackPageRoutingModule,
		CommonComponentsModule,
	],
	declarations: [RetroMyFeedbackPage]
})
export class RetroMyFeedbackPageModule {
}
