import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {TagsPage} from './tags.page';

const routes: Routes = [
	{
		path: '',
		component: TagsPage
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class TagsPageRoutingModule {
}
