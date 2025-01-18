import {
	Component,
	EventEmitter,
	Inject,
	Input,
	OnDestroy,
} from '@angular/core';
import {
	IHappeningContext,
	IHappeningWithUiState,
} from '@sneat/mod-schedulus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/team-models';
import { SpaceNavService } from '@sneat/team-services';
import { takeUntil } from 'rxjs';
import { HappeningService } from '../../../../services';

@Component({
	selector: 'sneat-recurring-card',
	templateUrl: './recurring-card.component.html',
	standalone: false,
})
export class RecurringCardComponent implements OnDestroy {
	private readonly destroyed = new EventEmitter<void>();
	@Input() recurring?: IHappeningWithUiState;
	@Input({ required: true }) space?: ISpaceContext;

	constructor(
		private readonly happeningService: HappeningService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly spaceNavService: SpaceNavService,
	) {
		//
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}

	goHappening(happening?: IHappeningWithUiState): void {
		if (!this.space) {
			this.errorLogger.logErrorHandler(
				'not able to navigate to happening without a space context',
			);
			return;
		}
		this.spaceNavService
			.navigateForwardToSpacePage(this.space, `happening/${happening?.id}`, {
				state: { happening },
			})
			.catch(
				this.errorLogger.logErrorHandler(
					'failed to navigate to happening page',
				),
			);
		// this.navigateForward('regular-activity', { id: activity.id }, { happeningDto: activity }, { excludeCommuneId: true });
	}

	deleteRecurring(
		event: Event,
		happeningWithUiState?: IHappeningWithUiState,
	): void {
		console.log('deleteRecurring()', happeningWithUiState);
		event.stopPropagation();
		if (!happeningWithUiState) {
			return;
		}
		if (!this.space?.id) {
			return;
		}
		const happening: IHappeningContext = {
			id: happeningWithUiState.id,
			space: { id: this.space?.id },
			brief: happeningWithUiState.brief,
			dbo: happeningWithUiState.dbo,
		};
		this.happeningService
			.deleteHappening(happening)
			.pipe(takeUntil(this.destroyed))
			.subscribe({
				error: this.errorLogger.logErrorHandler(
					'failed to delete recurring happening',
				),
			});
	}
}
