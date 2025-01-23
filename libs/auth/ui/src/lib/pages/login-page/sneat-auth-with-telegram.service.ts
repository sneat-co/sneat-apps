import { Inject, Injectable } from '@angular/core';
import { SneatApiService } from '@sneat/api';
import { SneatAuthStateService } from '@sneat/auth-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { Observable } from 'rxjs';

export interface ITelegramAuthData {
	id: number;
	first_name: string;
	last_name: string;
	username?: string;
	photo_url?: string;
	auth_date: number;
	hash: string;
}

interface IResponse {
	token: string;
}

@Injectable()
export class SneatAuthWithTelegramService {
	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly apiService: SneatApiService,
		private readonly authService: SneatAuthStateService,
	) {}

	public loginWithTelegram(
		botID: string,
		tgAuthData: ITelegramAuthData,
		isUserAuthenticated: boolean,
	): void {
		const postRequest = isUserAuthenticated
			? this.apiService.post<IResponse>
			: this.apiService.postAsAnonymous<IResponse>;
		postRequest(
			'auth/login-from-telegram-widget?botID=' + botID,
			tgAuthData,
		).subscribe({
			next: (response) => {
				console.log('loginWithTelegram() response:', response);
				this.authService
					.signInWithToken(response.token)
					.then(() => {
						console.log('loginWithTelegram() signed in');
					})
					.catch(
						this.errorLogger.logErrorHandler(
							'Failed to sign-in with custom token',
						),
					);
			},
			error: this.errorLogger.logErrorHandler('signInWithTelegram() error:'),
		});
	}
}
