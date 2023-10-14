import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ScrumPageRoutingModule } from './scrum-page/scrum-page-routing.module';

import { ScrumPageComponent } from './scrum-page/scrum-page.component';
import { ScrumCardComponent } from './components/scrum-card/scrum-card.component';
import { ScrumTasksComponent } from './components/scrum-tasks/scrum-tasks.component';
import { ScrumQnaComponent } from './components/srum-qna/scrum-qna.component';
import { ScrumBlockersComponent } from './components/scrum-blockers/scrum-blockers.component';
import { MetricsComponent } from './components/metrics/metrics.component';
import { ScrumTaskComponent } from './components/scrum-task/scrum-task.component';
// import { TimerModule } from '@sneat/timer';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		IonicModule,
		ScrumPageRoutingModule,
		// TimerModule,
	],
	declarations: [
		ScrumPageComponent,
		ScrumCardComponent,
		ScrumTasksComponent,
		ScrumTaskComponent,
		ScrumQnaComponent,
		ScrumBlockersComponent,
		MetricsComponent,
	],
})
export class ScrumPageModule {}
