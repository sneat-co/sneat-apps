import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CountrySelectorModule, SelectFromListModule, SneatPipesModule } from '@sneat/components';
import { MembersSelectorModule } from '@sneat/team/components';

import { NewDocumentPageComponent } from './new-document-page.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		CountrySelectorModule,
		SneatPipesModule,
		SelectFromListModule,
		MembersSelectorModule,
	],
	exports: [
		NewDocumentPageComponent,
	],
	declarations: [NewDocumentPageComponent],
})
export class NewDocumentPageModule {
}
