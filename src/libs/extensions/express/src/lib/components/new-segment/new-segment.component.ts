import { AfterViewInit, Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IContactContext, ITeamContext } from '@sneat/team/models';
import { IExpressOrderContext, IOrderContainer } from '../..';

@Component({
	selector: 'sneat-new-segment',
	templateUrl: './new-segment.component.html',
})
export class NewSegmentComponent implements AfterViewInit {
	@Input() order?: IExpressOrderContext;
	@Input() container?: IOrderContainer;
	contact?: IContactContext;
	readonly = false;

	containerIDs: string[] = [];

	constructor(
		protected readonly modalController: ModalController,
	) {
	}

	isContainerSelected(id: string): boolean {
		return this.containerIDs.includes(id);
	}

	onContainerChecked(event: Event): void {
		console.log('onContainerChecked()', event);
		const ce = event as CustomEvent;
		if (ce.detail.checked) {
			this.containerIDs.push(ce.detail.value);
		} else {
			this.containerIDs = this.containerIDs.filter(id => id !== ce.detail.value);
		}
	}

	onContactChanged(contact: IContactContext): void {
		this.contact = contact;
	}

	ngAfterViewInit(): void {
		this.containerIDs = this.order?.dto?.containers?.map(c => c.id) || [];
	}
}
