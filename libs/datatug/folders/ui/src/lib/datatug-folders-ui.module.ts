import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatatugFolderComponent } from './datatug-folder.component';
import { DatatugFoldersCoreModule } from '@sneat/ext-datatug-folders-core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SneatCardListComponent } from '@sneat/components';

const exports = [DatatugFolderComponent];

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		SneatCardListComponent,
		DatatugFoldersCoreModule,
	],
	declarations: [...exports],
	exports,
})
export class DatatugFoldersUiModule {}
