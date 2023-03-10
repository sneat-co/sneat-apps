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

	@Input() team?: ITeamContext;

	@Input() order?: ILogistOrderContext;
	@Output() orderChange = new EventEmitter<ILogistOrderContext>();

	protected selectedContainer?: IOrderContainer;

	containers?: ReadonlyArray<IOrderContainer>;

	readonly id = (_: number, container: IOrderContainer) => container.id;


	constructor(
		private readonly modalController: ModalController,
	) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['order']) {
			this.containers = this.order?.dto?.containers || [];
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

	deleteContainer(event: Event, id: string) {
		this.containers = this.containers?.filter(c => c.id !== id) || [];
	}

	onContainerSelected(container: IOrderContainer) {
		console.log('OrderContainersComponent.onContainerSelected():', container);
		this.selectedContainer = container;
	}

	indexOfContainer(container: IOrderContainer): number | undefined {
		return this.containers?.findIndex(c => c.id === container.id);
	}
}
