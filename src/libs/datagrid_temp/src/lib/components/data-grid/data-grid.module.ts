import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataGridComponent } from './data-grid.component';
import { CellPopoverComponent } from '../cell-popover/cell-popover.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

const exports = [
	DataGridComponent,
];

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule,
		FormsModule,
		// CodemirrorModule,
	],
	declarations: [
		...exports,
		CellPopoverComponent,
	],
	exports,
})
export class DatagridModule {
}
