import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SpacesCardComponent } from './spaces-card.component';

@NgModule({
	imports: [CommonModule, FormsModule, IonicModule],
	declarations: [SpacesCardComponent],
	exports: [SpacesCardComponent],
})
export class SpacesCardModule {}
