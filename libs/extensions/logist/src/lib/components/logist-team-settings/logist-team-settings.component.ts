import {
	AfterViewInit,
	Component,
	Inject,
	Input,
	OnChanges,
	OnDestroy,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
	AddressForm,
	AddressFormComponent,
	IAddressFormControls,
} from '@sneat/components';
import { ContactService } from '@sneat/contactus-services';
import { excludeUndefined } from '@sneat/core';
import { IAddress } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team-models';
import { Subject, takeUntil } from 'rxjs';
import { ILogistTeamContext, ISetLogistTeamSettingsRequest } from '../../dto';
import { LogistTeamService } from '../../services';

interface ILogistTeamSettingsFormControls extends IAddressFormControls {
	vatNumber: FormControl<string | null>;
	orderNumberPrefix: FormControl<string | null>;
}

type LogistTeamSettingsForm = FormGroup<ILogistTeamSettingsFormControls>;

@Component({
	selector: 'sneat-logist-team-settings',
	templateUrl: './logist-team-settings.component.html',
})
export class LogistTeamSettingsComponent
	implements OnChanges, OnDestroy, AfterViewInit
{
	@Input({ required: true }) team?: ITeamContext;
	@Input() logistTeam?: ILogistTeamContext;

	@ViewChild(AddressFormComponent) addressFormComponent?: AddressFormComponent;

	private readonly destroyed = new Subject<void>();
	private addressForm?: AddressForm;
	protected address?: IAddress | null; // undefined means loading, null means no address

	protected roles: readonly string[] = [];

	readonly vatNumber = new FormControl<string>('', {
		validators: [Validators.minLength(5), Validators.maxLength(20)],
	});
	readonly orderNumberPrefix = new FormControl<string>('', {
		validators: [Validators.maxLength(5)],
	});

	form = new FormGroup({
		vatNumber: this.vatNumber,
		orderNumberPrefix: this.orderNumberPrefix,
	}) as unknown as LogistTeamSettingsForm; // TODO: get rid of unknown

	isSubmitting = false;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly logistTeamService: LogistTeamService,
		private readonly contactService: ContactService, // private readonly navController: NavController,
	) {}

	ngAfterViewInit(): void {
		const c = this.addressFormComponent;
		if (c) {
			Object.entries(c.form.controls).forEach(([key /*, control*/]) => {
				const k = key as keyof ILogistTeamSettingsFormControls;
				this.form.addControl(k, c.form.controls.countryID);
			});
		}

		console.log(
			'LogistTeamSettingsComponent.ngAfterViewInit():',
			c,
			this.form.controls,
		);
	}

	ngOnDestroy(): void {
		this.destroyed.next();
	}

	protected onAddressFormChanged(addressForm: AddressForm): void {
		this.addressForm = addressForm;
	}

	protected onAddressChanged(address: IAddress): void {
		this.address = address;
	}

	submit(): void {
		this.form.markAllAsTouched();
		if (this.form.invalid) {
			alert('Please fill in all required fields.');
			return;
		}
		if (this.addressFormComponent?.form?.invalid) {
			alert('Please make sure address form data are correct.');
			return;
		}
		if (!this.team) {
			this.errorLogger.logError('No team context provided.');
			return;
		}
		const address = this.address;
		if (!address) {
			return;
		}
		const request: ISetLogistTeamSettingsRequest = excludeUndefined({
			roles: this.roles,
			teamID: this.team.id,
			address,
			vatNumber: this.vatNumber.value?.trim() || undefined,
			orderNumberPrefix: this.orderNumberPrefix.value || undefined,
		});
		this.isSubmitting = true;
		this.logistTeamService.setLogistTeamSettings(request).subscribe({
			next: () => {
				console.log('success');
			},
			error: (err) => {
				this.errorLogger.logError(err, 'Failed to set logist team settings.');
				this.isSubmitting = false;
			},
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		console.log('LogistTeamSettingsComponent.ngOnChanges()', changes);
		if (changes['logistTeam']) {
			if (!this.orderNumberPrefix.dirty) {
				this.orderNumberPrefix.setValue(
					this.logistTeam?.dto?.orderNumberPrefix || '',
				);
			}
			const contactID = this.logistTeam?.dto?.contactID;
			if (!contactID) {
				if (this.logistTeam?.dto == null) {
					this.address = null;
				}
				return;
			}
			const team = this.team;
			if (!team) {
				return;
			}
			this.contactService
				.watchContactById(team, contactID)
				.pipe(takeUntil(this.destroyed))
				.subscribe((contact) => {
					this.address = contact?.dto?.address || this.address;
					this.roles = contact?.dto?.roles || [];
					console.log(
						'LogistTeamSettingsComponent.ngOnChanges(): roles:',
						this.roles,
					);
				});
		}
	}
}
