import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RetrospectivePageRoutingModule } from './retrospective-routing.module';

import { RetrospectivePageComponent } from './retrospective-page.component';
import { MyRetroItemsComponentModule } from '../../components/my-retro-items/my-retro-items.module';
import { RetroMembersComponent } from './retro-members/retro-members.component';
import { RetroFeedbackStageComponent } from './stages/retro-feedback-stage/retro-feedback-stage.component';
import { RetroReviewStageComponent } from './stages/retro-review-stage/retro-review-stage.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RetrospectivePageRoutingModule,
		MyRetroItemsComponentModule,
	],
	declarations: [
		RetroMembersComponent,
		RetroFeedbackStageComponent,
		RetroReviewStageComponent,
		RetrospectivePageComponent,
	],
})
export class RetrospectivePageModule {
}
