import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContactRole } from '@sneat/dto';
import { IOrdersFilter, OrderDirection } from '../../..';
import { IContactContext, ITeamContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-orders-filter',
	templateUrl: 'orders-filter.component.html',
})
export class OrdersFilterComponent {
	@Input() team?: ITeamContext;

	@Output() readonly filterChange = new EventEmitter<IOrdersFilter>();

	contactByRole: { [role: string]: IContactContext | undefined } = {};
	direction: OrderDirection | '' = '';
	status: 'draft' | 'active' | 'complete' | 'canceled' = 'active';
	counterpartyID = '';
	countryID = '';
	refNumber = '';
	isRefNumberChanged = false;

	viewMode: 'list' | 'grid' = 'grid';
	@Output() viewModeChange = new EventEmitter<'list' | 'grid'>();

	protected onDirectionChanged(event: Event): void {
		this.emitFilterChange();
	}

	protected onContactChanged(role: ContactRole, contact: IContactContext): void {
		this.contactByRole[role] = contact;
		this.counterpartyID = contact?.id || '';
		this.emitFilterChange();
	}

	protected refNumberChanged(event: Event): void {
		this.isRefNumberChanged = true;
		this.emitFilterChange();
	}

	protected findByRefNumber(event: Event): void {
		event.stopPropagation();
		this.isRefNumberChanged = false;
	}

	protected clearRefNumber(event: Event): void {
		event.stopPropagation();
		this.refNumber = '';
		this.emitFilterChange();
		setTimeout(() => {
			this.isRefNumberChanged = false;
		}, 10);
	}

	emitFilterChange(): void {
		const filter: IOrdersFilter = {
			direction: this.direction || undefined,
			status: this.status,
			countryID: this.countryID,
			contactID: this.counterpartyID,
		};
		this.filterChange.emit(filter);
	}
}
