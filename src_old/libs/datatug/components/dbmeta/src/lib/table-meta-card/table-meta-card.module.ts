import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableMetaCardComponent } from './table-meta-card.component';

//
@NgModule({
	declarations: [TableMetaCardComponent],
	exports: [TableMetaCardComponent],
	imports: [IonicModule, FormsModule, CommonModule, RouterModule],
})
export class TableMetaCardModule {
}
