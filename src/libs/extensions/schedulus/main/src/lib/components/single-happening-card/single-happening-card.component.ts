import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IHappeningContext } from '@sneat/team/models';
import { HappeningService } from '../../services/happening.service';

@Component({
	selector: 'sneat-single-happening-card',
	templateUrl: 'single-happening-card.component.html',
	styleUrls: ['single-happening-card.component.scss'],
})
export class SingleHappeningCardComponent {
	@Input() happening?: IHappeningContext;
	@Output() readonly deleted = new EventEmitter<string>();

	public deleting = false;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly happeningService: HappeningService,
	) {
	}

	public notImplemented(): void {
		alert('Sorry, not implemented yet.');
	}

	delete(): void {
		if (!this.happening) {
			this.errorLogger.logError(new Error('Single happening card has no happening context at moment of delete attempt'));
			return;
		}
		this.deleting = true;

		this.happeningService
			.deleteHappening(this.happening)
			.subscribe({
				next: () => this.deleted.emit(),
				error: e => {
					this.errorLogger.logError(e, 'Failed to delete happening');
					this.deleting = false
				},
			})
	}
}
