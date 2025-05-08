import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FolderPageComponent } from './folder-page.component';

const routes: Routes = [
	{
		path: '',
		component: FolderPageComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class FolderPageRoutingModule {
}
