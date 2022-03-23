import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatatugFolderComponent } from './datatug-folder.component';
import { DatatugFoldersCoreModule } from '@sneat/datatug/folders/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SneatCardListModule } from '@sneat/components';

const exports = [
	DatatugFolderComponent,
];

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		SneatCardListModule,
		DatatugFoldersCoreModule,
	],
	declarations: [
		...exports,
	],
	exports,
})
export class DatatugFoldersUiModule {
}
