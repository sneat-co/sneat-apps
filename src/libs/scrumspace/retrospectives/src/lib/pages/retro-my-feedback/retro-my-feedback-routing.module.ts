import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {RetroMyFeedbackPage} from './retro-my-feedback.page';

const routes: Routes = [
	{
		path: '',
		component: RetroMyFeedbackPage
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class RetroMyFeedbackPageRoutingModule {
}
