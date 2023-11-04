import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { SharedWithModule } from '@sneat/contactus-shared';
import { MovieCardComponent } from '../../movie-card';
import { ListusCoreServicesModule } from '../../services/listus-core-services.module';
import { CopyListItemsPageModule } from '../dialogs/copy-list-items/copy-list-items.module';
import { ListDialogsService } from '../dialogs/ListDialogs.service';
import { ListItemComponent } from './list-item/list-item.component';

import { ListPageComponent } from './list-page.component';
import { NewListItemComponent } from './new-list-item.component';

const routes: Routes = [
	{
		path: '',
		component: ListPageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		CopyListItemsPageModule,
		RouterModule.forChild(routes),
		MovieCardComponent,
		SharedWithModule,
		ListusCoreServicesModule,
	],
	declarations: [ListItemComponent, NewListItemComponent, ListPageComponent],
	providers: [ListDialogsService],
})
export class ListPageModule {}
