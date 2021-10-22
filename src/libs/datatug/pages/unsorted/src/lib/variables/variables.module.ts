import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VariablesPageRoutingModule } from './variables-routing.module';

import { VariablesPage } from './variables.page';

@NgModule({
	imports: [CommonModule, FormsModule, IonicModule, VariablesPageRoutingModule],
	declarations: [VariablesPage],
})
export class VariablesPageModule {}
