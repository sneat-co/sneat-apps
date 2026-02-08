import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
	inject,
} from '@angular/core';
import {
	IonButton,
	IonButtons,
	IonCheckbox,
	IonCol,
	IonGrid,
	IonIcon,
	IonItem,
	IonItemDivider,
	IonItemGroup,
	IonLabel,
	IonRow,
} from '@ionic/angular/standalone';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { IContactContext } from '@sneat/contactus-core';
import {
	ILogistOrderContext,
	IOrderContainer,
	IOrderShippingPoint,
	ShippingPointTask,
} from '../../dto';
import { NewShippingPointService } from '../new-shipping-point/new-shipping-point.service';

interface selected {
	readonly tasks: readonly ShippingPointTask[];
	readonly dirty: boolean;
}

export type TasksByID = Record<string, selected | undefined>;

@Component({
	selector: 'sneat-shipping-points-selector',
	templateUrl: './shipping-points-selector.component.html',
	imports: [
		IonItemDivider,
		IonLabel,
		IonButtons,
		IonButton,
		IonIcon,
		IonItemGroup,
		IonGrid,
		IonRow,
		IonCol,
		IonItem,
		IonCheckbox,
	],
})
export class ShippingPointsSelectorComponent implements OnChanges {
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	private readonly newShippingPointService = inject(NewShippingPointService);

	@Input() order?: ILogistOrderContext;
	@Input() container?: IOrderContainer;
	@Output() tasksByShippingPointChange = new EventEmitter<TasksByID>();

	tab: 'new' | 'existing' = 'existing';

	protected newContact?: IContactContext;
	protected newShippingPoints?: readonly IOrderShippingPoint[];
	protected shippingPoints?: readonly IOrderShippingPoint[];

	protected readonly tasksByShippingPoint: TasksByID = {};

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['order']) {
			this.setShippingPoints();
		}
	}

	setShippingPoints(): void {
		console.log('setShippingPoints()');
		this.order?.dbo?.shippingPoints?.forEach((sp) => {
			const selected = this.tasksByShippingPoint[sp.id];
			if (!selected?.dirty) {
				const container = this.container;
				let tasks: readonly ShippingPointTask[] = [];
				if (container) {
					tasks =
						this.order?.dbo?.containerPoints?.find(
							(cp) =>
								cp.containerID === container.id && cp.shippingPointID === sp.id,
						)?.tasks || [];
				}
				this.tasksByShippingPoint[sp.id] = { tasks, dirty: false };
			}
		});
		this.shippingPoints = [
			...(this.order?.dbo?.shippingPoints || []),
			...(this.newShippingPoints || []),
		];
	}

	protected addShippingPoint(): void {
		if (!this.order) {
			return;
		}
		this.newShippingPointService
			.openNewShippingPointDialog({
				order: this.order,
				container: this.container,
			})
			.catch(
				this.errorLogger.logErrorHandler(
					'Failed to open new shipping point dialog',
				),
			);
	}

	protected checkboxChanged(
		event: Event,
		shippingPointID: string,
		task: ShippingPointTask,
	): void {
		const ce = event as CustomEvent;
		console.log('checkboxChanged', ce);
		const selected = this.tasksByShippingPoint[shippingPointID] || {
			tasks: [],
			dirty: false,
		};
		const checked = !!ce.detail.checked;
		let tasks: readonly ShippingPointTask[] = [];
		if (checked) {
			if (!selected.tasks.includes(task)) {
				tasks = [...selected.tasks, task];
				this.tasksByShippingPoint[shippingPointID] = { tasks, dirty: true };
			}
		} else {
			tasks = selected.tasks.filter((t) => t !== task);
			this.tasksByShippingPoint[shippingPointID] = { tasks, dirty: true };
		}
		if (tasks) {
			const container = this.container;
			if (container) {
				const containerTasks =
					this.order?.dbo?.containerPoints?.find(
						(cp) =>
							cp.containerID === container.id &&
							cp.shippingPointID === shippingPointID,
					)?.tasks || [];
				if (
					[...tasks].toSorted().join(';') ===
					[...containerTasks].toSorted().join(';')
				) {
					this.tasksByShippingPoint[shippingPointID] = { tasks, dirty: false };
				}
			}
		}

		const dirtyTasksByShippingPointChange: TasksByID = {};
		Object.entries(this.tasksByShippingPoint).forEach(([k, v]) => {
			if (v?.dirty) {
				dirtyTasksByShippingPointChange[k] = v;
			}
		});
		this.tasksByShippingPointChange.emit(dirtyTasksByShippingPointChange);
	}

	protected onContactChanged(contact: IContactContext): void {
		console.log('onContactChanged()', contact);
		if (!contact) {
			return;
		}
		this.newContact = contact;
		setTimeout(() => (this.newContact = undefined), 10);
		if (
			!this.newShippingPoints?.find(
				(sp) => sp.location?.contactID === contact.id,
			)
		) {
			this.newShippingPoints = [
				...(this.newShippingPoints || []),
				{
					id: '',
					tasks: [],
					status: 'pending',
					counterparty: {
						contactID: contact.parentContact?.id || '',
						title:
							contact?.parentContact?.brief?.title ||
							contact.parentContact?.id ||
							'',
					},
					location: {
						contactID: contact.id,
						countryID: contact.dbo?.countryID || '--',
						title: contact?.dbo?.title || contact.id,
					},
				},
			];
			this.setShippingPoints();
		}
	}
}
