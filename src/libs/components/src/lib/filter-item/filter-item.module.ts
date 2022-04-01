import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FilterItemComponent } from './filter-item.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		RouterModule,
	],
	declarations: [FilterItemComponent],
	exports: [FilterItemComponent],
})
export class FilterItemModule { // TODO: unlikely needs to be a dedicated module?
}
