import { Component, Inject, Input } from '@angular/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team/models';
import { FreightOrdersService, IContainerRequest, IExpressOrderContext, IOrderContainer } from '../..';

@Component({
	selector: 'sneat-order-container-form',
	templateUrl: './container-form.component.html',
})
export class ContainerFormComponent {
	@Input() container?: IOrderContainer;
	@Input() order?: IExpressOrderContext;
	@Input() team?: ITeamContext;
	@Input() i = 0;

	deleting = false;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly orderService: FreightOrdersService,
	) {
	}

	delete(event: Event): void {
		console.log('delete()', this.container);
		event.stopPropagation();
		event.preventDefault();
		if (!this.container) {
			this.errorLogger.logError('ContainerFormComponent.delete(): container is undefined');
			return;
		}
		if (!this.order) {
			this.errorLogger.logError('ContainerFormComponent.delete(): order is undefined');
			return;
		}
		if (!this.team) {
			this.errorLogger.logError('ContainerFormComponent.delete(): team is undefined');
			return;
		}
		const request: IContainerRequest = {
			teamID: this.team.id,
			orderID: this.order.id,
			containerID: this.container.id,
		};
		this.deleting = true;
		this.orderService.deleteContainer(request).subscribe({
			next: () => {
				this.deleting = false;
			},
			error: (err) => {
				this.errorLogger.logError(err, 'Failed to delete container');
				this.deleting = false;
			}
		});
	}
}
