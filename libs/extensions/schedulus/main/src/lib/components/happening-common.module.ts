import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleService } from '../services';
import { ParticipantsComponent } from './participants/participants.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
	imports: [CommonModule, IonicModule],
	declarations: [ParticipantsComponent],
	exports: [ParticipantsComponent],
	providers: [ScheduleService],
})
export class HappeningCommonModule {}
