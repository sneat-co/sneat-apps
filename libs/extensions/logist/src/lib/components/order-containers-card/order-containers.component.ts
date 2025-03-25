import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ISpaceContext } from '@sneat/space-models';
import { ILogistOrderContext, IOrderContainer } from '../../dto';

@Component({
	selector: 'sneat-order-containers-card',
	templateUrl: './order-containers.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: false,
})
export class OrderContainersComponent implements OnChanges {
	@Input({ required: true }) space?: ISpaceContext;

	@Input() order?: ILogistOrderContext;
	@Output() orderChange = new EventEmitter<ILogistOrderContext>();

	protected selectedContainer?: IOrderContainer;

	containers?: readonly IOrderContainer[];

	constructor(private readonly modalController: ModalController) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['order']) {
			this.containers = this.order?.dbo?.containers || [];
			if (this.containers?.length) {
				const selectedContainer = this.selectedContainer;
				if (selectedContainer) {
					this.selectedContainer = this.containers?.find(
						(c) => c.id === selectedContainer.id,
					);
				}
				if (!selectedContainer) {
					this.selectedContainer = this.containers?.[0];
				}
			} else {
				this.selectedContainer = undefined;
			}
		}
	}

	// async openNewContainerForm() {
	// 	const modal = await this.modalController.create({
	// 		component: NewContainerComponent,
	// 		componentProps: {
	// 			order: this.order,
	// 			team: this.team,
	// 		}
	// 	});
	// 	await modal.present();
	// }

	onContainerSelected(container: IOrderContainer) {
		console.log('OrderContainersComponent.onContainerSelected():', container);
		this.selectedContainer = container;
	}

	indexOfContainer(container: IOrderContainer): number | undefined {
		return this.containers?.findIndex((c) => c.id === container.id);
	}
}
