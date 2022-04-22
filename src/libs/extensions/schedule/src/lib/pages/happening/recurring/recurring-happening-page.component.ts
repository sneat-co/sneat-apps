import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { IHappeningContext, IRecurringContext } from '@sneat/team/models';
import { RecurringHappeningService } from '../../../services/recurring-happening.service';
import { HappeningBasePage } from '../happening-base-page';

@Component({
	selector: 'sneat-recurring-happening-page',
	templateUrl: './recurring-happening.page.html',
	providers: [TeamComponentBaseParams],
})
export class RecurringHappeningPageComponent extends HappeningBasePage {

	public recurring?: IRecurringContext;

	constructor(
		route: ActivatedRoute,
		params: TeamComponentBaseParams,
		recurringService: RecurringHappeningService,
		// regularService: IRegularHappeningService,
	) {
		super('RecurringHappeningPageComponent', route, params);
		route.params
			.pipe(
				this.takeUntilNeeded(),
			)
			.subscribe({
				next: params => {
					const id = params['recurringID'];
					console.log('RecurringHappeningPageComponent => id:', id);
					if (!id) {
						return id;
					}
					recurringService.watchRecurringByID(id)
						.pipe(
							this.takeUntilNeeded(),
						)
						.subscribe({
							next: recurring => {
								console.log(`RecurringHappeningPageComponent => recurring:`, recurring);
								this.recurring = recurring;
							},
							error: this.logErrorHandler('failed to get recurring happening by ID'),
						});
				},
			});
	}

	protected override setHappening(happening: IHappeningContext): void {
		super.setHappening(happening);
		this.recurring = happening as IRecurringContext;
	}
}
