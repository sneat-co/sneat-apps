import { Component, inject } from '@angular/core';
import {
	IonCard,
	IonCardContent,
	IonContent,
	IonItem,
	IonItemDivider,
	IonLabel,
	IonText,
	IonTextarea,
} from '@ionic/angular/standalone';
import { IAddress } from '@sneat/contactus-core';
import { ClassName } from '@sneat/ui';
import {
	IContainerPoint,
	ILogistOrderContext,
	IOrderContainer,
	IOrderCounterparty,
	IOrderShippingPoint,
} from '../../dto';
import { LogistOrderService } from '../../services';
import { OrderPrintPageBaseComponent } from '../order-print-page-base.component';

interface IPoint {
	containerPoint: IContainerPoint;
	shippingPoint?: IOrderShippingPoint;
	address?: IAddress;
	location?: IOrderCounterparty;
	counterparty?: IOrderCounterparty;
}

@Component({
	selector: 'sneat-container-print-doc',
	templateUrl: './container-print-doc.component.html',
	imports: [
		IonContent,
		IonCard,
		IonItemDivider,
		IonLabel,
		IonItem,
		IonText,
		IonCardContent,
		IonTextarea,
	],
	providers: [{ provide: ClassName, useValue: 'ContainerPrintDocComponent' }],
})
export class ContainerPrintDocComponent extends OrderPrintPageBaseComponent {
	protected containerID?: string | null;

	protected container?: IOrderContainer;
	protected points?: IPoint[];
	protected firstArrivalScheduledDate?: string;
	protected by?: IOrderCounterparty;

	protected total? = { numberOfPallets: 0, grossWeightKg: 0 };

	public constructor() {
		super(inject(LogistOrderService));
		this.route.queryParamMap
			.pipe(this.takeUntilDestroyed())
			.subscribe((params) => {
				this.containerID = params.get('id');
			});
	}

	protected showArrivalLabel(cp: IContainerPoint): boolean {
		return this.showDeparture(cp);
	}

	protected showArrival(cp: IContainerPoint): boolean {
		const { scheduledDate, scheduledTime } = cp.arrival || {};
		return !!scheduledTime || !!scheduledDate;
	}

	protected showDeparture(cp: IContainerPoint): boolean {
		const { scheduledDate, scheduledTime } = cp.departure || {};
		return (
			!!scheduledTime ||
			(!!scheduledDate && scheduledDate !== cp.arrival?.scheduledDate)
		);
	}

	protected showDepartureDate(cp: IContainerPoint): boolean {
		const { scheduledDate } = cp.departure || {};
		return !!scheduledDate && scheduledDate !== cp.arrival?.scheduledDate;
	}

	override onOrderChanged(order: ILogistOrderContext): void {
		if (this.containerID) {
			this.container = order.dbo?.containers?.find(
				(c) => c.id === this.containerID,
			);
		} else if (order.dbo?.containers?.length) {
			this.container = order.dbo?.containers?.[0];
			if (!this.containerID) {
				this.containerID = this.container?.id;
			}
		}
		if (this.containerID) {
			this.points = this.order?.dbo?.containerPoints
				?.filter((p) => p.containerID === this.containerID)
				.map((containerPoint) => {
					const shippingPoint = this.order?.dbo?.shippingPoints?.find(
						(p) => p.id === containerPoint.shippingPointID,
					);
					const counterparty = shippingPoint
						? this.order?.dbo?.counterparties?.find(
								(p) => p.contactID === shippingPoint.counterparty.contactID,
							)
						: undefined;
					const location = shippingPoint
						? this.order?.dbo?.counterparties?.find(
								(p) => p.contactID === shippingPoint.location.contactID,
							)
						: undefined;
					const point: IPoint = {
						containerPoint,
						shippingPoint,
						counterparty,
						location,
						address: shippingPoint?.location?.address,
					};
					return point;
				});
			this.total =
				this.points?.reduce(
					(acc, p) => {
						acc.grossWeightKg += p.containerPoint.toLoad?.grossWeightKg || 0;
						acc.numberOfPallets +=
							p.containerPoint.toLoad?.numberOfPallets || 0;
						return acc;
					},
					{ numberOfPallets: 0, grossWeightKg: 0 },
				) || undefined;

			const byContactID = this.points?.find(
				(p) => !!p.containerPoint.arrival?.byContactID,
			)?.containerPoint.arrival?.byContactID;
			this.by = this.order?.dbo?.counterparties?.find(
				(c) => c.contactID === byContactID,
			);
			this.points = this.points?.toSorted((a, b) => {
				const d1 = a.containerPoint.arrival?.scheduledDate || '',
					d2 = b.containerPoint.arrival?.scheduledDate || '';
				return d1 == d2 ? 0 : d1 > d2 ? 1 : -1;
			});
			this.firstArrivalScheduledDate = this.points?.length
				? this.points[0].containerPoint.arrival?.scheduledDate
				: undefined;
		}
	}
}
