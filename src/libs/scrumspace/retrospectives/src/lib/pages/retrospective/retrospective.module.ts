import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RetrospectivePageRoutingModule } from './retrospective-routing.module';

import { RetrospectivePage } from './retrospective.page';
import { MyRetroItemsComponentModule } from '../../components/my-retro-items/my-retro-items.module';
import { CommonComponentsModule } from '../../../components/common-components.module';
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
		CommonComponentsModule,
	],
	declarations: [
		RetroMembersComponent,
		RetroFeedbackStageComponent,
		RetroReviewStageComponent,
		RetrospectivePage,
	],
})
export class RetrospectivePageModule {}
