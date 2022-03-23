import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { JoinTeamPageComponent } from './join-team-page.component';

const routes: Routes = [
	{
		path: '',
		component: JoinTeamPageComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class JoinTeamPageRoutingModule {
}
