import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RetroMyFeedbackPageRoutingModule } from './retro-my-feedback-routing.module';

import { RetroMyFeedbackPageComponent } from './retro-my-feedback.page';
import { ScrumspaceRetrospectivesModule } from "../../scrumspace-retrospectives.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RetroMyFeedbackPageRoutingModule,
    ScrumspaceRetrospectivesModule
  ],
	declarations: [RetroMyFeedbackPageComponent],
})
export class RetroMyFeedbackPageModule {}
