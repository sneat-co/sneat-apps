import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {EnvDbPageComponent} from './env-db-page.component';

const routes: Routes = [
	{
		path: '',
		component: EnvDbPageComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class EnvDbPageRoutingModule {
}
