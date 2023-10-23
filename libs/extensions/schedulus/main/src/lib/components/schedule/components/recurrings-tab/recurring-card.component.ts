import {
	Component,
	EventEmitter,
	Inject,
	Input,
	OnDestroy,
} from '@angular/core';
import { IHappeningWithUiState } from '@sneat/team-models';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IHappeningContext, ITeamContext } from '@sneat/team-models';
import { HappeningService, TeamNavService } from '@sneat/team-services';
import { takeUntil } from 'rxjs';

@Component({
	selector: 'sneat-recurring-card',
	templateUrl: './recurring-card.component.html',
})
export class RecurringCardComponent implements OnDestroy {
	private readonly destroyed = new EventEmitter<void>();
	@Input() recurring?: IHappeningWithUiState;
	@Input({ required: true }) team?: ITeamContext;

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
		if (!this.team) {
			this.errorLogger.logErrorHandler(
				'not able to navigate to happening without team context',
			);
			return;
		}
		this.teamNavService
			.navigateForwardToTeamPage(this.team, `happening/${happening?.id}`, {
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
		if (!this.team?.id) {
			return;
		}
		const happening: IHappeningContext = {
			id: happeningWithUiState.id,
			team: { id: this.team?.id },
			brief: happeningWithUiState.brief,
			dto: happeningWithUiState.dto,
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
