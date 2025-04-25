import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	IonCard,
	IonIcon,
	IonItem,
	IonItemDivider,
	IonLabel,
	IonSegment,
	IonSegmentButton,
} from '@ionic/angular/standalone';
import { QueriesMenuComponent } from '@sneat/ext-datatug-queries';
import { ProjectMenuTopComponent } from '../project-menu-top/project-menu-top.component';

@Component({
	selector: 'sneat-datatug-project-menu',
	templateUrl: './project-menu.component.html',
	imports: [
		IonCard,
		IonItemDivider,
		IonSegment,
		IonSegmentButton,
		IonIcon,
		ProjectMenuTopComponent,
		QueriesMenuComponent,
		IonLabel,
		IonItem,
		NgIf,
		FormsModule,
	],
})
export class ProjectMenuComponent {
	public tab: 'project' | 'queries' | 'boards' = 'project';
}
