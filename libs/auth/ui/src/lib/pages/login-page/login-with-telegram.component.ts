import { CommonModule, DOCUMENT } from '@angular/common';
import {
	AfterViewInit,
	Component,
	ElementRef,
	Inject,
	Injectable,
} from '@angular/core';
import { Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SneatApiService } from '@sneat/api';
import { SneatAuthStateService } from '@sneat/auth-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

interface ITelegramAuthData {
	id: number;
	first_name: string;
	last_name: string;
	username?: string;
	photo_url?: string;
	auth_date: number;
	hash: string;
}

@Injectable()
export class SneatAuthWithTelegramService {
	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly apiService: SneatApiService,
		private readonly authService: SneatAuthStateService,
	) {}

	public loginWithTelegram(botID: string, tgAuthData: ITelegramAuthData): void {
		this.apiService
			.postAsAnonymous<{
				token: string;
			}>('auth/login-from-telegram-widget?botID=' + botID, tgAuthData)
			.subscribe({
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
				error: (err) => console.error('signInWithTelegram() error:', err),
			});
	}
}

let authWithTelegramService: SneatAuthWithTelegramService;

@Component({
	standalone: true,
	imports: [CommonModule, IonicModule],
	providers: [SneatAuthWithTelegramService],
	selector: 'sneat-login-with-telegram',
	template: `
		<!--
				<script
					async
					src="https://telegram.org/js/telegram-widget.js?22"
					data-telegram-login="SneatBot"
					data-size="large"
					data-onauth="onTelegramAuth(user)"
					data-request-access="write"
				></script>
				-->
	`,
})
export class LoginWithTelegramComponent implements AfterViewInit {
	// TODO: Article about Telegram login
	constructor(
		private readonly el: ElementRef,
		@Inject(DOCUMENT) private readonly document: Document,
		readonly authWithTelegram: SneatAuthWithTelegramService,
	) {
		authWithTelegramService = authWithTelegram;
	}

	@Input() public botID: string = location.hostname.startsWith('local')
		? 'AlextDevBot'
		: 'SneatBot';

	@Input() public size: 'small' | 'medium' | 'large' = 'large';
	@Input() public requestAccess: 'write' | 'read' = 'write';
	@Input() public userPic = true;

	ngAfterViewInit() {
		const botID = this.botID;
		if (botID) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			window.onTelegramAuth = (tgAuthData: ITelegramAuthData) => {
				// https://core.telegram.org/widgets/login#receiving-authorization-data
				// After a successful authorization, the widget returns data
				// by calling the callback function data-onauth with the JSON-object containing
				// id, first_name, last_name, username, photo_url, auth_date and hash fields.
				console.log('window.onTelegramAuth(): Logged in', tgAuthData);
				authWithTelegramService.loginWithTelegram(botID, tgAuthData);
			};

			const script = this.document.createElement('script');

			script.src = 'https://telegram.org/js/telegram-widget.js?22';
			script.setAttribute('data-telegram-login', botID);
			script.setAttribute('data-request-access', this.requestAccess);
			script.setAttribute('data-size', this.size);
			if (!this.userPic) {
				script.setAttribute('data-userpic', 'false');
			}
			// https://core.telegram.org/widgets/login#receiving-authorization-data
			// After a successful authorization, the widget returns data
			// by calling the callback function data-onauth with the JSON-object containing
			// id, first_name, last_name, username, photo_url, auth_date and hash fields.
			script.setAttribute('data-onauth', 'onTelegramAuth(user)');
			this.el.nativeElement.appendChild(script);
		}
	}
}
