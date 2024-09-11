import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
// import { Router } from '@angular/router';
// import { SneatApiService } from '@sneat/api';
// import { SneatAuthStateService } from '@sneat/auth-core';
// import { ErrorLogger, IErrorLogger } from '@sneat/logging';

@Component({
	selector: 'sneat-telegram-menu-page',
	templateUrl: './telegram-mini-app-home-page.component.html',
	standalone: true,
	imports: [IonicModule],
})
export class TelegramMiniAppHomePageComponent {
	// constructor() // private readonly authService: SneatAuthStateService, // private readonly sneatApiService: SneatApiService, // @Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	// // private readonly router: Router,
	// {}
	// public ngOnInit(): void {
	// 	console.log('TelegramMiniAppHomePageComponent.ngAfterViewInit()');
	// 	// const telegramWebApp = (window as unknown as any).Telegram.WebApp;
	// 	// this.sneatApiService
	// 	// 	.postAsAnonymous<{
	// 	// 		token: string;
	// 	// 	}>('auth/login-from-telegram-miniapp', telegramWebApp.initData)
	// 	// 	.subscribe({
	// 	// 		next: (response) => {
	// 	// 			// alert('Token: ' + response.token);
	// 	// 			this.authService
	// 	// 				.signInWithToken(response.token)
	// 	// 				.then(() => {
	// 	// 					telegramWebApp.ready();
	// 	// 					this.router
	// 	// 						.navigate(['/'])
	// 	// 						.catch(
	// 	// 							this.errorLogger.logErrorHandler(
	// 	// 								'Failed to navigate to home page',
	// 	// 							),
	// 	// 						);
	// 	// 					// alert('Signed in!');
	// 	// 				})
	// 	// 				.catch((err) => {
	// 	// 					telegramWebApp.ready();
	// 	// 					this.errorLogger.logError(
	// 	// 						err,
	// 	// 						'Failed to sign-in with custom token',
	// 	// 					);
	// 	// 				});
	// 	// 		},
	// 	// 		error: (err) => {
	// 	// 			telegramWebApp.ready();
	// 	// 			alert(
	// 	// 				'Failed to sign-in with telegram mini-app credentials: ' +
	// 	// 					JSON.stringify(err),
	// 	// 			);
	// 	// 		},
	// 	// 	});
	// }
}
