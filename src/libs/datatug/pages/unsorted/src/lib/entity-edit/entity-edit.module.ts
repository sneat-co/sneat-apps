import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {EntityEditPageRoutingModule} from './entity-edit-routing.module';

import {EntityEditPage} from './entity-edit.page';
import {EntityFieldDialogComponent} from './entity-field-dialog/entity-field-dialog.component';
import {SneatErrorCardModule} from '@sneat/components/error-card';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		EntityEditPageRoutingModule,
		SneatErrorCardModule,
	],
	declarations: [
		EntityEditPage,
		EntityFieldDialogComponent,
	]
})
export class EntityEditPageModule {
}
