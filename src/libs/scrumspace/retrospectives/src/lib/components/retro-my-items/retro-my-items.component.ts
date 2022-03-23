import { Component, Inject, Input, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IRetroItem, RetroItemType } from '@sneat/scrumspace/scrummodels';
import { IAddRetroItemRequest, IRetroItemRequest, RetrospectiveService } from '../../retrospective.service';

@Component({
	selector: 'sneat-retro-my-items',
	templateUrl: './retro-my-items.component.html',
})
export class RetroMyItemsComponent {
	@ViewChild(IonInput, { static: true }) titleInput; // TODO: strong typing : IonInput;

	@Input() public question: RetroItemType;
	@Input() public teamId: string;
	@Input() public retroId: string;

	public titleControl = new FormControl('', [Validators.required]);

	public addRetroItemForm = new FormGroup({
		titleControl: this.titleControl,
	});

	public items: IRetroItem[];

	constructor(
		private readonly retrospectiveService: RetrospectiveService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {
	}

	public trackById = (i: number, item: IRetroItem) => item.ID;

	public delete(item: IRetroItem): void {
		const request: IRetroItemRequest = {
			team: this.teamId,
			meeting: this.retroId,
			item: item.ID,
			type: item.type,
		};
		this.retrospectiveService.deleteRetroItem(request).subscribe({
			// next: v => console.log('items after deletion:', v),
			error: (err) =>
				this.errorLogger.logError(err, 'Failed to delete scrum item'),
		});
	}

	public add(): void {
		if (!this.teamId || !this.question || !this.retroId) {
			this.errorLogger.logError(
				'addFailed',
				'RetroMyItemsComponent is not properly initialized',
				{ feedback: false },
			);
			return;
		}
		try {
			this.titleControl.setValue((this.titleControl.value as string).trim());
			if (!this.titleControl.valid) {
				return;
			}
			const title = this.titleControl.value as string;
			const request: IAddRetroItemRequest = {
				team: this.teamId,
				meeting: this.retroId,
				type: this.question,
				title,
			};
			if (!this.items) {
				this.items = [];
			}
			// eslint-disable-next-line @typescript-eslint/naming-convention
			this.items.push({ ID: '', title });
			this.titleControl.setValue('');
			this.retrospectiveService.addRetroItem(request).subscribe(
				(response) => {
					console.log(response);

					// const item: IRetroItem = {id: response.id, title: request.title};
					// const items = this.itemsByType[type];
					// if (items) {
					// 	items.push(item);
					// } else {
					// 	this.itemsByType[type] = [item]
					// }
				},
				(err) => {
					this.items = this.items.filter(
						(item) => item.ID || item.title !== title,
					);
					if (!this.titleInput.value) {
						this.titleInput.value = title;
					}
					this.errorLogger.logError(err, 'Failed to add a retrospective item');
					this.titleInput.ionFocus.emit();
				},
			);
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to add a retrospective item');
		}
	}
}
