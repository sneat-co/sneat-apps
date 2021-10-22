import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { MyRetroItemsComponent } from './my-retro-items.component';

const exports = [MyRetroItemsComponent];

@NgModule({
	imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule],
	declarations: exports,
	exports,
})
export class MyRetroItemsComponentModule {}
