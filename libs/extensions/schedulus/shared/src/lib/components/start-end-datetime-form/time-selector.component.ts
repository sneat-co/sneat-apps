import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	IonButton,
	IonButtons,
	IonCol,
	IonGrid,
	IonIcon,
	IonItem,
	IonLabel,
	IonRow,
	IonSegment,
	IonSegmentButton,
	ModalController,
} from '@ionic/angular/standalone';

const morningHours: string[] = [
	'00',
	'01',
	'02',
	'03',
	'04',
	'05',
	'06',
	'07',
	'08',
];

const dayHours: string[] = [
	'09',
	'10',
	'11',
	'12',
	'13',
	'14',
	'15',
	'16',
	'17',
];

const eveningHours: string[] = [
	'16',
	'17',
	'18',
	'19',
	'20',
	'21',
	'22',
	'23',
	'00',
];

@Component({
	selector: 'sneat-time-selector',
	templateUrl: './time-selector.component.html',
	imports: [
		FormsModule,
		IonItem,
		IonLabel,
		IonButtons,
		IonButton,
		IonSegment,
		IonSegmentButton,
		IonIcon,
		IonGrid,
		IonRow,
		IonCol,
	],
})
export class TimeSelectorComponent {
	private readonly modalController = inject(ModalController);

	@Input() hideHeader = false;
	@Output() readonly selected = new EventEmitter<string>();

	tab: 'morning' | 'day' | 'evening' = 'day';

	public hours: string[] = dayHours;

	constructor() {
		console.log('TimeSelectorComponent.constructor()');
	}

	select(hh: string, mm: string) {
		this.selected.emit(hh + ':' + mm);
	}

	close(): void {
		this.modalController.dismiss().catch(console.error);
	}

	onTabChanged(event: Event): boolean {
		event.stopPropagation();
		switch (this.tab) {
			case 'morning':
				this.hours = morningHours;
				break;
			case 'day':
				this.hours = dayHours;
				break;
			case 'evening':
				this.hours = eveningHours;
				break;
		}
		return false;
	}
}
