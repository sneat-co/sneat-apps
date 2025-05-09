import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	IonButton,
	IonButtons,
	IonCard,
	IonCol,
	IonGrid,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonRow,
	IonSegment,
	IonSegmentButton,
	IonText,
} from '@ionic/angular/standalone';
import { CountryInputComponent } from '@sneat/components';
import { ContactInputComponent } from '@sneat/contactus-shared';
import { excludeEmpty } from '@sneat/core';
import { IContactContext, ContactRole } from '@sneat/contactus-core';
import { ISpaceContext } from '@sneat/space-models';
import { IOrdersFilter, OrderDirection } from '../../../dto';

@Component({
	selector: 'sneat-orders-filter',
	templateUrl: 'orders-filter.component.html',
	imports: [
		IonSegment,
		IonSegmentButton,
		IonCard,
		IonItem,
		IonLabel,
		IonText,
		IonInput,
		FormsModule,
		IonButtons,
		IonButton,
		NgIf,
		ContactInputComponent,
		CountryInputComponent,
		IonGrid,
		IonRow,
		IonCol,
		IonIcon,
	],
})
export class OrdersFilterComponent {
	@Input({ required: true }) space?: ISpaceContext;

	@Output() readonly filterChange = new EventEmitter<IOrdersFilter>();

	contactByRole: Record<string, IContactContext | undefined> = {};
	direction: OrderDirection | '' = '';
	status: 'draft' | 'active' | 'complete' | 'canceled' = 'active';
	counterpartyID = '';
	countryID = '';
	refNumber = '';
	isRefNumberChanged = false;

	viewMode: 'list' | 'grid' = 'grid';
	@Output() viewModeChange = new EventEmitter<'list' | 'grid'>();

	protected onDirectionChanged(): void {
		this.emitFilterChange();
	}

	protected onContactChanged(
		role: ContactRole,
		contact?: IContactContext,
	): void {
		this.contactByRole[role] = contact;
		this.counterpartyID = contact?.id || '';
		this.emitFilterChange();
	}

	protected refNumberChanged(): void {
		this.isRefNumberChanged = true;
	}

	protected findByRefNumber(event: Event): void {
		event.stopPropagation();
		this.isRefNumberChanged = false;
		this.emitFilterChange();
	}

	protected clearRefNumber(event: Event): void {
		event.stopPropagation();
		this.refNumber = '';
		this.emitFilterChange();
		setTimeout(() => {
			this.isRefNumberChanged = false;
		}, 10);
	}

	emitViewModeChange(): void {
		this.viewModeChange.emit(this.viewMode);
	}

	emitFilterChange(): void {
		const filter: IOrdersFilter = excludeEmpty({
			direction: this.direction || undefined,
			status: this.status,
			countryID: this.countryID,
			contactID: this.counterpartyID,
			refNumber: this.refNumber,
		});
		this.filterChange.emit(filter);
	}
}
