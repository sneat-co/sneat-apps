import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SelectFromListComponent } from './select-from-list.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		RouterModule,
	],
	declarations: [SelectFromListComponent],
	exports: [SelectFromListComponent],
})
export class SelectFromListModule {
}
