import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IContactContext, ITeamContext } from '@sneat/team/models';
import { IExpressOrderContext, IOrderContainer } from '../..';

@Component({
	selector: 'sneat-new-segment',
	templateUrl: './new-segment.component.html',
})
export class NewSegmentComponent implements OnInit {
	@Input() order?: IExpressOrderContext;
	@Input() container?: IOrderContainer;

	byContact?: IContactContext;
	fromContact?: IContactContext;
	toContact?: IContactContext;

	readonly = false;

	from: 'port' | 'dispatcher' = 'port';
	to: 'port' | 'dispatcher' = 'dispatcher';

	containerIDs: string[] = [];

	constructor(
		protected readonly modalController: ModalController,
	) {
	}

	onFromChanged(): void {
		if (this.from === 'port' && this.to === 'port') {
			this.to = 'dispatcher';
		}
		this.fromContact = undefined;
	}

	onToChanged(): void {
		if (this.to === 'port' && this.from === 'port') {
			this.from = 'dispatcher';
		}
		this.toContact = undefined;
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
		// this.contact = contact;
	}

	ngOnInit(): void {
		this.containerIDs = this.order?.dto?.containers?.map(c => c.id) || [];
	}
}
