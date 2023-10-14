import { NgIf } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ISneatUserState, SneatUserService } from '@sneat/auth-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { map, race } from 'rxjs';
import { countries, ICountry } from '../country-selector';

@Component({
	standalone: true,
	selector: 'sneat-user-country',
	templateUrl: './user-country.component.html',
	imports: [IonicModule, NgIf],
})
export class UserCountryComponent {
	protected ipCountryID?: string;
	protected ipCountry?: ICountry;
	protected user?: ISneatUserState;
	protected saving = false;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly httpClient: HttpClient,
		private readonly userService: SneatUserService,
	) {
		race(
			httpClient
				.get<{ country: string }>('https://api.country.is')
				.pipe(map((response) => ({ source: '', country: response.country }))),
			httpClient
				.get<string>('https://ipapi.co/country', {
					headers: new HttpHeaders({
						Accept: 'text/plain',
					}),
					responseType: 'text' as 'json',
				})
				.pipe(
					map((country) => ({ source: 'https://ipapi.co/country', country })),
				),
		).subscribe((response) => {
			console.log('Got IP country from', response.source);
			this.ipCountryID = response.country;
			this.ipCountry = countries.find((c) => c.id === this.ipCountryID);
		});

		userService.userState.subscribe((user) => {
			this.user = user;
		});
	}

	protected setCountry(countryID?: string): void {
		if (!countryID) {
			return;
		}
		this.saving = true;
		this.userService.setUserCountry(countryID).subscribe({
			next: () => {
				console.log('User country set to', countryID);
			},
			error: (err) => {
				this.errorLogger.logError('Failed to set user country', err);
				this.saving = false;
			},
		});
	}
}
