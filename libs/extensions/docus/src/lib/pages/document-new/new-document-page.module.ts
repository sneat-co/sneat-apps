import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CountrySelectorComponent, SelectFromListModule, SneatPipesModule } from '@sneat/components';
import { MembersSelectorModule } from '@sneat/contactus-shared';

import { NewDocumentPageComponent } from './new-document-page.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		CountrySelectorComponent,
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
