import { Component, Inject, Input, OnDestroy } from '@angular/core';
import { IAddRetroItemRequest, RetrospectiveService } from '../../retrospective.service';
import { FormControl, Validators } from '@angular/forms';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { RetroItemType } from '@sneat/scrumspace/retrospectives';

@Component({
	selector: 'sneat-add-retro-item',
	templateUrl: './add-retro-item.component.html',
	styleUrls: ['./add-retro-item.component.scss'],
})
export class AddRetroItemComponent implements OnDestroy {
	@Input() retroItemType: RetroItemType;
	@Input() teamId: string;
	@Input() meetingId: string;
	public titleControl = new FormControl('', [Validators.required]);
	public isAdding: boolean;
	private destroyed = new Subject<boolean>();

	constructor(
		private retrospectiveService: RetrospectiveService,
		@Inject(ErrorLogger) private errorLogger: IErrorLogger,
	) {
	}

	ngOnDestroy() {
		this.destroyed.next(true);
		this.destroyed.complete();
		this.destroyed.unsubscribe();
	}

	public add(event?: Event): void {
		console.log('add()');
		event?.stopPropagation();
		event?.preventDefault();

		this.titleControl.setValue((this.titleControl.value as string).trim());
		if (!this.titleControl.valid) {
			return;
		}
		const title = this.titleControl.value as string;
		const request: IAddRetroItemRequest = {
			teamID: this.teamId,
			meeting: this.meetingId,
			type: this.retroItemType,
			title,
		};
		this.isAdding = true;
		this.retrospectiveService
			.addRetroItem(request)
			.pipe(takeUntil(this.destroyed))
			.subscribe({
				next: (response) => {
					console.log(
						'retrospectiveService.addRetroItem() => response:',
						response,
					);
					this.isAdding = false;
				},
				error: (err) => {
					this.errorLogger.logError(err, 'Failed to add a retrospective item');
					this.isAdding = false;
				},
			});
	}
}
