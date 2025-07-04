import { Component, Input, ViewChild, inject } from '@angular/core';
import {
	FormControl,
	ReactiveFormsModule,
	UntypedFormGroup,
	Validators,
} from '@angular/forms';
import {
	IonButton,
	IonButtons,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonList,
	IonSpinner,
} from '@ionic/angular/standalone';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IRetroItem, RetroItemType } from '@sneat/ext-scrumspace-scrummodels';
import {
	IAddRetroItemRequest,
	IRetroItemRequest,
	RetrospectiveService,
} from '../../retrospective.service';

@Component({
	selector: 'sneat-retro-my-items',
	templateUrl: './retro-my-items.component.html',
	imports: [
		IonList,
		IonItem,
		IonLabel,
		IonButtons,
		IonButton,
		ReactiveFormsModule,
		IonInput,
		IonIcon,
		IonSpinner,
	],
})
export class RetroMyItemsComponent {
	private readonly retrospectiveService = inject(RetrospectiveService);
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);

	@ViewChild(IonInput, { static: true }) titleInput?: IonInput; // TODO: strong typing : IonInput;

	@Input() public question?: RetroItemType;
	@Input() public spaceID?: string;
	@Input() public retroId?: string;

	public titleControl = new FormControl<string>('', [Validators.required]);

	public addRetroItemForm = new UntypedFormGroup({
		titleControl: this.titleControl,
	});

	public items?: IRetroItem[];

	public trackById = (i: number, item: IRetroItem) => item.ID;

	public delete(item: IRetroItem): void {
		if (!this.spaceID || !this.retroId || !item.type) {
			return;
		}
		const request: IRetroItemRequest = {
			spaceID: this.spaceID,
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
		if (!this.spaceID || !this.question || !this.retroId) {
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
				spaceID: this.spaceID,
				meeting: this.retroId,
				type: this.question,
				title,
			};
			if (!this.items) {
				this.items = [];
			}

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
					this.items = this.items?.filter(
						(item) => item.ID || item.title !== title,
					);
					if (this.titleInput && !this.titleInput?.value) {
						this.titleInput.value = title;
					}
					this.errorLogger.logError(err, 'Failed to add a retrospective item');
					if (this.titleInput) {
						this.titleInput.ionFocus.emit();
					}
				},
			);
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to add a retrospective item');
		}
	}
}
