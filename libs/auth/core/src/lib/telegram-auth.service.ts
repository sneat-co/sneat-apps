import { Injectable, inject } from '@angular/core';
import { SneatApiService } from '@sneat/api';
import { SneatAuthStateService } from './sneat-auth-state-service';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

@Injectable({
	providedIn: 'root',
})
export class TelegramAuthService {
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	private readonly authStateService = inject(SneatAuthStateService);
	private readonly sneatApiService = inject(SneatApiService);

	public authenticateIfTelegramWebApp() {
		const telegramWebApp = (
			window as unknown as {
				Telegram?: {
					WebApp?: {
						initData: unknown;
						ready: () => void;
					};
				};
			}
		).Telegram?.WebApp;
		if (telegramWebApp?.initData) {
			this.sneatApiService
				.postAsAnonymous<{
					token: string;
				}>('auth/login-from-telegram-miniapp', telegramWebApp?.initData)
				.subscribe({
					next: (response) => {
						this.authStateService
							.signInWithToken(response.token)
							.then(() => {
								telegramWebApp.ready();
							})
							.catch(
								this.errorLogger.logErrorHandler(
									'Failed to sign-in to Firebase auth with a token issued for telegram web-app credentials',
								),
							);
					},
					error: this.errorLogger.logErrorHandler(
						'Failed to get Firebase auth token issued using telegram web-app credentials',
					),
				});
		}
	}
}
