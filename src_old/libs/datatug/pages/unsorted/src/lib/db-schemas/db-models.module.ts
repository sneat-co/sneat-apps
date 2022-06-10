import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DbModelsPageRoutingModule } from './db-models-routing.module';

import { DbModelsPage } from './db-models-page.component';

@NgModule({
	imports: [CommonModule, FormsModule, IonicModule, DbModelsPageRoutingModule],
	declarations: [DbModelsPage],
})
export class DbModelsPageModule {
}
