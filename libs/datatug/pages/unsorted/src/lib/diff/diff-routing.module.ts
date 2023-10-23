import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiffPageComponent } from './diff-page.component';

const routes: Routes = [
	{
		path: '',
		component: DiffPageComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DiffPageRoutingModule {}
