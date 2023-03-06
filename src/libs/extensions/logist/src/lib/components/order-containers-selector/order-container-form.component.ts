import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IContainer } from './condainer-interface';

@Component({
	selector: 'sneat-order-container-form',
	templateUrl: 'order-container-form.component.html'
})
export class OrderContainerFormComponent {
	@Input() container: IContainer = {id: '', type: 'unknown'};

	@Output() readonly toggled = new EventEmitter<IContainer>();

}
