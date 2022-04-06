import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {ListPageComponent, NewListItemComponent} from './list.page';
import {ListDialogsService} from '../dialogs/ListDialogs.service';
import {CopyListItemsPageModule} from '../dialogs/copy-list-items/copy-list-items.module';
import {ListItemComponent} from './list-item/list-item.component';
import {MovieCardComponentModule} from '../../movie-card/movie-card.component.module';
import {SharedWithModule} from '../../../contactus/components/shared-with.module';

const routes: Routes = [
	{
		path: '',
		component: ListPageComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		CopyListItemsPageModule,
		RouterModule.forChild(routes),
		MovieCardComponentModule,
		SharedWithModule,
	],
	declarations: [
		ListItemComponent,
		NewListItemComponent,
		ListPageComponent,
	],
	providers: [
		ListDialogsService,
	],
})
export class ListPageModule {
}
