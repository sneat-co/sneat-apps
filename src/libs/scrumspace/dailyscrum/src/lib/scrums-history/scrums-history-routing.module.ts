import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ScrumsHistoryPageComponent } from './scrums-history.page';

const routes: Routes = [
	{
		path: '',
		component: ScrumsHistoryPageComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ScrumsHistoryPageRoutingModule {
}
