import { CommonModule } from '@angular/common';
import { Component, forwardRef, Inject, Input } from '@angular/core';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IContactContext } from '@sneat/contactus-core';
import {
	ContactInputComponent,
	ContactInputModule,
} from '@sneat/contactus-shared';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team-models';
import {
	CurrencyCode,
	DebtusService,
	ICreateDebtRecordRequest,
} from '../../services/debtus-service';

@Component({
	selector: 'sneat-debtus-new-debt-form',
	templateUrl: './new-debt-form.component.html',
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
		ReactiveFormsModule,
		// ContactInputModule,
		// forwardRef(() => ContactInputComponent),
	],
	providers: [DebtusService],
})
export class NewDebtFormComponent {
	@Input({ required: true }) public team?: ITeamContext;
	@Input({ required: true }) public contact?: IContactContext;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly debtusService: DebtusService,
	) {}

	protected currency = new FormControl<CurrencyCode>('EUR');
	protected amount = new FormControl<number | undefined>(
		undefined,
		Validators.required,
	);

	protected newDebtForm = new FormGroup({
		currency: this.currency,
		amount: this.amount,
	});

	protected readonly currencies = ['EUR', 'USD'];

	protected submit() {
		console.log('NewDebtFormComponent.submit', this.newDebtForm.value);
		const teamID = this.team?.id;
		if (!teamID) {
			throw new Error('teamID is not set');
		}
		const contactID = this.contact?.id;
		if (!contactID) {
			throw new Error('contactID is not set');
		}
		if (!this.amount.value) {
			throw new Error('amount is not set');
		}
		if (!this.currency.value) {
			throw new Error('currency is not set');
		}
		const request: ICreateDebtRecordRequest = {
			teamID,
			contactID,
			amount: this.amount.value,
			currency: this.currency.value,
		};
		this.debtusService.createDebtRecord(request).subscribe({
			next: (id) => {
				console.log('Debt record created:', id);
			},
			error: (err) => {
				console.error('Failed to create debt record:', err);
			},
		});
	}
}
