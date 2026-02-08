import { JsonPipe } from '@angular/common';
import {
	AfterViewInit,
	Component,
	Input,
	OnChanges,
	OnDestroy,
	SimpleChanges,
	ViewChild,
	inject,
} from '@angular/core';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import {
	IonButton,
	IonCard,
	IonCardContent,
	IonInput,
	IonItem,
	IonLabel,
	IonSpinner,
} from '@ionic/angular/standalone';
import {
	AddressForm,
	AddressFormComponent,
	IAddressFormControls,
} from '@sneat/contactus-shared';
import { ContactService } from '@sneat/contactus-services';
import { excludeUndefined } from '@sneat/core';
import { IAddress } from '@sneat/contactus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { ISpaceContext } from '@sneat/space-models';
import { Subject, takeUntil } from 'rxjs';
import { ILogistSpaceContext, ISetLogistSpaceSettingsRequest } from '../../dto';
import { LogistSpaceService } from '../../services';
import { LogistSpaceRolesComponent } from '../logist-team-roles/logist-space-roles.component';

interface ILogistSpaceSettingsFormControls extends IAddressFormControls {
	vatNumber: FormControl<string | null>;
	orderNumberPrefix: FormControl<string | null>;
}

type LogistSpaceSettingsForm = FormGroup<ILogistSpaceSettingsFormControls>;

@Component({
	selector: 'sneat-logist-space-settings',
	templateUrl: './logist-space-settings.component.html',
	imports: [
		IonCard,
		IonCardContent,
		IonSpinner,
		ReactiveFormsModule,
		AddressFormComponent,
		LogistSpaceRolesComponent,
		IonButton,
		IonItem,
		IonLabel,
		IonInput,
		JsonPipe,
	],
})
export class LogistSpaceSettingsComponent
	implements OnChanges, OnDestroy, AfterViewInit
{
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	private readonly logistSpaceService = inject(LogistSpaceService);
	private readonly contactService = inject(ContactService);

	@Input({ required: true }) space?: ISpaceContext;
	@Input() logistSpace?: ILogistSpaceContext;

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
	}) as unknown as LogistSpaceSettingsForm; // TODO: get rid of unknown

	isSubmitting = false;

	ngAfterViewInit(): void /* Intentionally not ngOnInit */ {
		const c = this.addressFormComponent;
		if (c) {
			Object.entries(c.form.controls).forEach(([key /*, control*/]) => {
				const k = key as keyof ILogistSpaceSettingsFormControls;
				this.form.addControl(k, c.form.controls.countryID);
			});
		}

		// console.log(
		// 	'LogistTeamSettingsComponent.ngAfterViewInit():',
		// 	c,
		// 	this.form.controls,
		// );
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
		if (!this.space) {
			this.errorLogger.logError('No team context provided.');
			return;
		}
		const address = this.address;
		if (!address) {
			return;
		}
		const request: ISetLogistSpaceSettingsRequest = excludeUndefined({
			roles: this.roles,
			spaceID: this.space.id,
			address,
			vatNumber: this.vatNumber.value?.trim() || undefined,
			orderNumberPrefix: this.orderNumberPrefix.value || undefined,
		});
		this.isSubmitting = true;
		this.logistSpaceService.setLogistSpaceSettings(request).subscribe({
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
					this.logistSpace?.dbo?.orderNumberPrefix || '',
				);
			}
			const contactID = this.logistSpace?.dbo?.contactID;
			if (!contactID) {
				if (this.logistSpace?.dbo == null) {
					this.address = null;
				}
				return;
			}
			const space = this.space;
			if (!space) {
				return;
			}
			this.contactService
				.watchContactById(space, contactID)
				.pipe(takeUntil(this.destroyed))
				.subscribe((contact) => {
					this.address = contact?.dbo?.address || this.address;
					this.roles = contact?.dbo?.roles || [];
					console.log(
						'LogistTeamSettingsComponent.ngOnChanges(): roles:',
						this.roles,
					);
				});
		}
	}
}
