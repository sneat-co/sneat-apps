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
import { IExpressOrderContext, IOrderContainer } from '../..';
import { NewContainerComponent } from '../new-container/new-container.component';

@Component({
	selector: 'sneat-order-containers-card',
	templateUrl: './order-containers.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderContainersComponent implements OnChanges {

	@Input() team?: ITeamContext;

	@Input() order?: IExpressOrderContext;
	@Output() orderChange = new EventEmitter<IExpressOrderContext>();

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

}
