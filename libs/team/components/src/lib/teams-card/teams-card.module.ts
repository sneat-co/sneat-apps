import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TeamsCardComponent } from './teams-card.component';

@NgModule({
	imports: [CommonModule, FormsModule, IonicModule],
	declarations: [TeamsCardComponent],
	exports: [TeamsCardComponent],
})
export class TeamsCardModule {}
