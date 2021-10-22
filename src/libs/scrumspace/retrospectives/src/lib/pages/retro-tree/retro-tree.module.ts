import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RetroTreePageRoutingModule } from './retro-tree-routing.module';

import { RetroTreePage } from './retro-tree.page';
import { AngularDndCoreModule } from '@angular-dnd/core';
import { AngularDndTreeModule } from '@angular-dnd/tree';
import { RetroItemCardComponent } from '../retro-item-card/retro-item-card.component';
import { AddRetroItemComponent } from '../../components/add-retro-item/add-retro-item.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ReactiveFormsModule,
		AngularDndCoreModule,
		AngularDndTreeModule,
		RetroTreePageRoutingModule,
	],
	declarations: [AddRetroItemComponent, RetroItemCardComponent, RetroTreePage],
})
export class RetroTreePageModule {}
