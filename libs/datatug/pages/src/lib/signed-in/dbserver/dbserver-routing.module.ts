import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DbserverPageComponent } from './dbserver-page.component';

const routes: Routes = [
	{
		path: '',
		component: DbserverPageComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DbserverPageRoutingModule {}
