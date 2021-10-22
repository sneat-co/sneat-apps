import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DataboardsPageRoutingModule } from './boards-routing.module';

import { BoardsPageComponent } from './boards-page.component';
import { SneatCardListModule } from '@sneat/components/card-list';
import { BoardServiceModule } from '../../board.service.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		BoardServiceModule,
		DataboardsPageRoutingModule,
		SneatCardListModule,
	],
	declarations: [BoardsPageComponent],
})
export class BoardsPageModule {}
