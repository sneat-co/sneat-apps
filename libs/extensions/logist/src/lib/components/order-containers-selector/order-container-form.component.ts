import { NgIf, UpperCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
	IonCheckbox,
	IonCol,
	IonGrid,
	IonInput,
	IonItem,
	IonLabel,
	IonRow,
} from '@ionic/angular/standalone';
import { ShippingPointTask } from '../../dto';
import { IContainer } from './condainer-interface';

@Component({
	selector: 'sneat-order-container-form',
	templateUrl: 'order-container-form.component.html',
	imports: [
		IonGrid,
		IonRow,
		IonCol,
		IonItem,
		IonLabel,
		IonInput,
		IonCheckbox,
		UpperCasePipe,
		NgIf,
	],
})
export class OrderContainerFormComponent {
	@Input() container: IContainer = { id: '', type: 'unknown' };

	@Output() readonly toggled = new EventEmitter<IContainer>();

	get load(): boolean {
		return this.container?.tasks?.includes('load') || false;
	}

	get unload(): boolean {
		return this.container?.tasks?.includes('load') || false;
	}

	onTaskCheckChanged(event: Event, task: ShippingPointTask): void {
		const { checked } = (event as CustomEvent).detail;
		if (checked && !this.container.tasks?.includes(task)) {
			this.container = {
				...this.container,
				tasks: [...(this.container.tasks || []), task],
			};
		} else if (!checked && this.container.tasks?.includes(task)) {
			this.container = {
				...this.container,
				tasks: this.container.tasks?.filter((t) => t !== task),
			};
		}
		this.container = {
			...this.container,
			checked: !!this.container.tasks?.length,
		};
		this.toggled.emit(this.container);
	}
}
