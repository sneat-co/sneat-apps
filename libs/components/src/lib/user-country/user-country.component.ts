import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	Input,
	OnDestroy,
	signal,
	inject,
} from '@angular/core';
import {
	IonButton,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardTitle,
	IonIcon,
	IonLabel,
} from '@ionic/angular/standalone';
import { SneatUserService } from '@sneat/auth-core';
import { SneatBaseComponent } from '@sneat/ui';
import { map, race, takeUntil } from 'rxjs';
import { CountryInputComponent } from '../country-input';
import { countries, ICountry } from '../country-selector';

let ipCountryCached: string | undefined; // TODO: Should have expiration?

@Component({
	imports: [
		CountryInputComponent,
		IonCardContent,
		IonCardHeader,
		IonCardTitle,
		IonButton,
		IonIcon,
		IonLabel,
		IonCard,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'sneat-user-country',
	templateUrl: './user-country.component.html',
})
export class UserCountryComponent
	extends SneatBaseComponent
	implements OnDestroy
{
	private readonly httpClient = inject(HttpClient);
	private readonly userService = inject(SneatUserService);

	protected readonly $ipCountryID = signal('');
	protected readonly $ipCountry = signal<ICountry | undefined>(undefined);

	protected readonly $userCountryID = signal<string>('');
	protected readonly $userHasCountry = computed(() => {
		const userCountryID = this.$userCountryID();
		return !!userCountryID && userCountryID !== '--';
	});

	protected isCountryDetectionStarted = false;
	protected readonly $detectingCountry = signal(false);
	protected readonly $saving = signal(false);

	@Input() public doNotHide = false;

	private trackUserRecord(): void {
		this.userService.userState
			.pipe(takeUntil(this.destroyed$))
			.subscribe((user) => {
				if (user.record) {
					this.$userCountryID.set(user?.record?.countryID || '--');
				}
			});
	}

	constructor() {
		super('UserCountryComponent');
		this.trackUserRecord();
		// this.getIpCountry();
		effect(() => {
			const userCountryID = this.$userCountryID();
			if (
				userCountryID === '--' &&
				// It looks like using signal here can cause an infinite loop
				!this.isCountryDetectionStarted
			) {
				this.getIpCountry();
			}
		});
	}

	protected onCountryOfResidenceChanged(countryID: string): void {
		this.setCountry(countryID);
	}

	private getIpCountry(): void {
		if (this.isCountryDetectionStarted) {
			return;
		}
		this.isCountryDetectionStarted = true;
		if (ipCountryCached) {
			this.$ipCountryID.set(ipCountryCached);
			this.$ipCountry.set(countries.find((c) => c.id === ipCountryCached));
			return;
		}
		this.$detectingCountry.set(true);
		console.log('UserCountryComponent: Detecting IP country...');
		race(
			this.httpClient
				.get<string>('https://ipapi.co/country', {
					headers: new HttpHeaders({
						Accept: 'text/plain',
					}),
					responseType: 'text' as 'json',
				})
				.pipe(
					map((country) => ({ source: 'https://ipapi.co/country', country })),
				),
		).subscribe({
			next: (response) => {
				console.log('UserCountryComponent: Got IP country:', response);
				const ipCountryID = response.country;
				ipCountryCached = ipCountryID;
				this.$ipCountryID.set(ipCountryID);
				this.$ipCountry.set(countries.find((c) => c.id === ipCountryID));
				this.$detectingCountry.set(false);
			},
			error: (err) => {
				this.$detectingCountry.set(false);
				// console.error('UserCountryComponent: Failed to get IP country', err);
				this.errorLogger.logError(
					err,
					'UserCountryComponent: Failed to get IP country',
					{
						show: false,
					},
				);
			},
		});
	}

	protected setCountry(countryID?: string): void {
		if (!countryID) {
			return;
		}
		this.$saving.set(true);
		this.userService.setUserCountry(countryID).subscribe({
			next: () => {
				console.log('UserCountryComponent: User country set to', countryID);
				this.$userCountryID.set(countryID);
			},
			error: (err) => {
				this.errorLogger.logError(
					'UserCountryComponent: Failed to set user country',
					err,
				);
				this.$saving.set(false);
			},
		});
	}
}
