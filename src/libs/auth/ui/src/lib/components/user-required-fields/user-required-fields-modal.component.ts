import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { IInitUserRecordRequest, UserRecordService } from '@sneat/auth-core';
import { ISelectItem, SelectFromListModule } from '@sneat/components';
import { AgeGroupID, Gender } from '@sneat/dto';
import { ITeamContext } from '@sneat/team/models';

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
export class UserRequiredFieldsModalComponent {

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

	constructor(
		private readonly modalController: ModalController,
		private readonly userRecordService: UserRecordService,
	) {
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
			authProvider: 'firebase',
		};
		this.userRecordService.initUserRecord(request).subscribe({
			next: () => this.modalController.dismiss(true).catch(console.error),
			error: err => {
				console.error('Failed to init user record:', err);
				this.submitting = false;
			},
		});
		this.modalController.dismiss().catch(console.error);
	}

	protected close(): void {
		this.modalController.dismiss().catch(console.error);
	}
}
