import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EntityEditPageRoutingModule } from './entity-edit-routing.module';

import { EntityEditPageComponent } from './entity-edit-page.component';
import { EntityFieldDialogComponent } from './entity-field-dialog/entity-field-dialog.component';
import { SneatErrorCardComponent } from '@sneat/components';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		EntityEditPageRoutingModule,
		SneatErrorCardComponent,
	],
	declarations: [EntityEditPageComponent, EntityFieldDialogComponent],
})
export class EntityEditPageModule {
}
