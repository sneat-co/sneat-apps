import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { IInitUserRecordRequest, ISneatUserState, SneatUserService, UserRecordService } from '@sneat/auth-core';
import { ISelectItem, SelectFromListModule } from '@sneat/components';
import { AgeGroupID, Gender } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team/models';
import { SneatBaseComponent } from '@sneat/ui';
import { takeUntil } from 'rxjs';

@Component({
	selector: 'sneat-user-required-fields-form',
	templateUrl: './user-required-fields-modal.component.html',
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		ReactiveFormsModule,
		SelectFromListModule,
	],
})
export class UserRequiredFieldsModalComponent extends SneatBaseComponent {

	@Input({ required: true }) team: ITeamContext = { id: '' };

	protected readonly genders: ISelectItem[] = [
		{ id: 'male', emoji: '♂️', title: 'Male' },
		{ id: 'female', emoji: '♀️', title: 'Female' },
		{ id: 'other', emoji: '⚥', title: 'Other' },
		{ id: 'undisclosed', iconName: 'body', title: 'Undisclosed' },
	];

	protected readonly ageGroups: ISelectItem[] = [
		{ id: 'adult', emoji: '🧓', title: 'Adult' },
		{ id: 'child', emoji: '🧒', title: 'Child' },
	];

	protected readonly firstName = new FormControl('', Validators.required);
	protected readonly lastName = new FormControl('', Validators.required);
	protected readonly gender = new FormControl('', Validators.required);
	protected readonly ageGroup = new FormControl('', Validators.required);

	protected readonly form = new FormGroup({
		firstName: this.firstName,
		lastName: this.lastName,
		gender: this.gender,
		ageGroup: this.ageGroup,
	});

	protected submitting = false;

	protected userState?: ISneatUserState;

	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		private readonly modalController: ModalController,
		private readonly userRecordService: UserRecordService,
		private readonly sneatUserService: SneatUserService,
	) {
		super('UserRequiredFieldsModalComponent', errorLogger);
		this.sneatUserService.userState
			.pipe(
				takeUntil(this.destroyed),
			)
			.subscribe({
				next: userState => this.userState = userState,
			});
	}

	protected save(): void {
		this.submitting = true;
		if (!this.form.valid) {
			setTimeout(() => {
				alert('Please fill in all fields.');
				this.submitting = false;
			});
			return;
		}

		const gender = this.gender.value as Gender;
		const ageGroup = this.ageGroup.value as AgeGroupID;

		const request: IInitUserRecordRequest = {
			name: {
				first: this.firstName.value || undefined,
				last: this.lastName.value || undefined,
			},
			gender,
			ageGroup,
		};
		this.userRecordService.initUserRecord(request).subscribe({
			next: () => this.modalController.dismiss(true).catch(console.error),
			error: err => {
				this.errorLogger.logError('Failed to init user record:', err);
				alert('Failed to init user record');
				this.submitting = false;
			},
		});
	}

	protected close(): void {
		this.modalController.dismiss(false).catch(this.errorLogger.logErrorHandler('Failed to close modal'));
	}
}
