import { NgModule } from '@angular/core';
import { TimerFactory } from '../../../meeting/src/lib/timer/timer.service';
import { SneatLoggingModule } from '@sneat/logging';
import { RetroTimerComponent } from './components/retro-timer/retro-timer.component';
import { TimerMeetingButtonComponent } from './components/timer/timer-meeting-button/timer-meeting-button.component';
import { TimerMemberButtonComponent } from './components/timer/timer-member-button/timer-member-button.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
	imports: [CommonModule, IonicModule, FormsModule, SneatLoggingModule],
	providers: [TimerFactory],
	declarations: [
		RetroTimerComponent,
		TimerMeetingButtonComponent,
		TimerMemberButtonComponent,
	],
	exports: [
		RetroTimerComponent,
		TimerMeetingButtonComponent,
		TimerMemberButtonComponent,
	],
})
export class TimerModule {}
