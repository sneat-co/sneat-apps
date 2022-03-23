import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiffPage } from './diff.page';

const routes: Routes = [
	{
		path: '',
		component: DiffPage,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DiffPageRoutingModule {
}
