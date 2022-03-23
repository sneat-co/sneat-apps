import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RetroMyFeedbackPageComponent } from './retro-my-feedback.page';

const routes: Routes = [
	{
		path: '',
		component: RetroMyFeedbackPageComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class RetroMyFeedbackPageRoutingModule {
}
