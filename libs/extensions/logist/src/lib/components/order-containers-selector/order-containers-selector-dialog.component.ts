import { Component, Inject, Input } from '@angular/core';
import {
	IonButton,
	IonContent,
	IonHeader,
	IonLabel,
} from '@ionic/angular/standalone';
import { DialogHeaderComponent } from '@sneat/components';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ILogistOrderContext } from '../../dto';
import { IContainer } from './condainer-interface';
import { OrderContainersSelectorComponent } from './order-containers-selector.component';

@Component({
	selector: 'sneat-order-containers-selector-dialog',
	templateUrl: './order-containers-selector-dialog.component.html',
	imports: [
		IonHeader,
		DialogHeaderComponent,
		IonContent,
		OrderContainersSelectorComponent,
		IonButton,
		IonLabel,
	],
})
export class OrderContainersSelectorDialogComponent {
	@Input() title = 'Select containers';
	@Input() order?: ILogistOrderContext;
	@Input() onSelected?: (items: IContainer[] | null) => void;

	private selectedContainers: IContainer[] = [];

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {}

	onSelectedContainersChanged(selectedContainers: IContainer[]): void {
		console.log(
			'OrderContainersSelectorDialogComponent.onSelectedContainersChanged():',
			selectedContainers,
		);
		this.selectedContainers = selectedContainers;
	}

	submit(): void {
		console.log(
			'OrderContainersSelectorDialogComponent.submit():',
			this.selectedContainers,
			this.onSelected,
		);
		this.onSelected?.(this.selectedContainers);
	}
}
