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
import { HappeningService, TeamNavService } from '@sneat/team-services';
import { takeUntil } from 'rxjs';

@Component({
	selector: 'sneat-recurring-card',
	templateUrl: './recurring-card.component.html',
})
export class RecurringCardComponent implements OnDestroy {
	private readonly destroyed = new EventEmitter<void>();
	@Input() recurring?: IHappeningWithUiState;
	@Input({ required: true }) space?: ISpaceContext;

	constructor(
		private readonly happeningService: HappeningService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly teamNavService: TeamNavService,
	) {
		//
	}

	protected readonly id = (_: number, o: { id: string }) => o.id;
	protected readonly index = (i: number): number => i;

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}

	goHappening(happening?: IHappeningWithUiState): void {
		if (!this.space) {
			this.errorLogger.logErrorHandler(
				'not able to navigate to happening without team context',
			);
			return;
		}
		this.teamNavService
			.navigateForwardToTeamPage(this.space, `happening/${happening?.id}`, {
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
