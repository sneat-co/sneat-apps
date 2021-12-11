import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RetroMyItemsComponent } from './components/retro-my-items/retro-my-items.component';

@NgModule({
	imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
	declarations: [RetroMyItemsComponent],
	exports: [
		RetroMyItemsComponent
	]
})
export class ScrumspaceRetrospectivesModule {}
