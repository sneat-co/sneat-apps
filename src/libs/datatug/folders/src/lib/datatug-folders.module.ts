import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatatugFolderComponent } from './datatug-folder.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SneatCardListModule } from '@sneat/components/card-list';
import { BoardServiceModule } from '@sneat/datatug/board';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		SneatCardListModule,
		BoardServiceModule,
	],
	declarations: [DatatugFolderComponent],
	exports: [DatatugFolderComponent],
})
export class DatatugFoldersModule {}
