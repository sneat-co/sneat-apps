import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { distinctUntilChanged, map, Observable, Subject, takeUntil } from 'rxjs';
import { HappeningService } from '../../services/happening.service';
import { HappeningBasePage } from './happening-base-page';

@Component({
	selector: 'sneat-happening-page',
	templateUrl: './happening-page.component.html',
	providers: [TeamComponentBaseParams],
})
export class HappeningPageComponent extends HappeningBasePage {

	private readonly happeningID$ = new Subject<string>();

	constructor(
		route: ActivatedRoute,
		params: TeamComponentBaseParams,
		private readonly happeningService: HappeningService,
		// regularService: IRegularHappeningService,
	) {
		super('HappeningPageComponent', route, params);
		route.params.pipe(
			this.takeUntilNeeded(),
			map(params => params['happeningID']),
			distinctUntilChanged(),
		).subscribe(this.happeningID$);
		this.happeningID$
			.subscribe({
				next: this.onHappeningIDChanged,
			});
	}

	private readonly onHappeningIDChanged = (id: string): void => {
		if (!id) {
			this.happening = undefined;
			return;
		}
		if (this.happening?.id !== id) {
			this.setHappening({ id });
		}
		this.happeningService.watchHappeningByID(id)
			.pipe(
				this.takeUntilNeeded(),
				takeUntil(this.happeningID$),
			)
			.subscribe({
				next: this.setHappening,
				error: this.logErrorHandler('failed to get happening by ID'),
			});
	};
}
