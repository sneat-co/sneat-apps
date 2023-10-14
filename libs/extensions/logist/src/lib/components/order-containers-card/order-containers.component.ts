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
import { ITeamContext } from '@sneat/team/models';
import { ILogistOrderContext, IOrderContainer } from '../../dto';

@Component({
	selector: 'sneat-order-containers-card',
	templateUrl: './order-containers.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderContainersComponent implements OnChanges {
	@Input({ required: true }) team?: ITeamContext;

	@Input() order?: ILogistOrderContext;
	@Output() orderChange = new EventEmitter<ILogistOrderContext>();

	protected selectedContainer?: IOrderContainer;

	containers?: ReadonlyArray<IOrderContainer>;

	protected readonly id = (_: number, o: { id: string }) => o.id;

	constructor(private readonly modalController: ModalController) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['order']) {
			this.containers = this.order?.dto?.containers || [];
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
