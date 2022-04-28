import { Component, Input, OnDestroy } from '@angular/core';
import { IHappeningWithUiState } from '@sneat/dto';
import { Subject, takeUntil } from 'rxjs';
import { HappeningComponentBaseParams } from '../happening-component-base-params';

@Component({
	selector: 'sneat-recurrings-tab',
	templateUrl: 'recurrings-tab.component.html',
	providers: [HappeningComponentBaseParams],
})
export class RecurringsTabComponent implements OnDestroy {
	private readonly destroyed = new Subject<void>();
	@Input() recurrings?: IHappeningWithUiState[];
	@Input() allRecurrings?: IHappeningWithUiState[];

	constructor(
		private readonly params: HappeningComponentBaseParams,
	) {
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}

	readonly id = (i: number, v: { id: string }): string => v.id;
	readonly index = (i: number): number => i;

	goRegular(activity: IHappeningWithUiState): void {
		this.params.teamParams.errorLogger.logError('not implemented yet');
		// this.navigateForward('regular-activity', { id: activity.id }, { happeningDto: activity }, { excludeCommuneId: true });
	}

	deleteRecurring(event: Event, happeningWithUiState: IHappeningWithUiState): void {
		console.log('deleteRecurring()', happeningWithUiState);
		event.preventDefault();
		event.stopPropagation();
		this.params.happeningService.deleteHappening(happeningWithUiState)
			.pipe(takeUntil(this.destroyed))
			.subscribe({
				error: this.params.teamParams.errorLogger.logErrorHandler('failed to delete recurring happening'),
			});
	}
}
