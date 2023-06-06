import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnInit } from '@angular/core';
import { Input } from '@angular/core';

@Component({
	selector: 'sneat-login-with-telegram',
	template: `
		<script async src="https://telegram.org/js/telegram-widget.js?22" data-telegram-login="SneatBot" data-size="large"
						data-onauth="onTelegramAuth(user)" data-request-access="write"></script>
	`,
})
export class LoginWithTelegramComponent implements AfterViewInit { // TODO: Article about Telegram login
	constructor(
		private readonly el: ElementRef,
		@Inject(DOCUMENT) private readonly document: Document,
	) {
	}

	@Input({ required: true }) public telegramLogin?: string;
	@Input() public size: 'small' | 'medium' | 'large' = 'large';
	@Input() public requestAccess: 'write' | 'read' = 'write';
	@Input() public userPic = true;

	ngAfterViewInit() {
		if (this.telegramLogin) {
			const script = this.document.createElement('script');

			script.src = 'https://telegram.org/js/telegram-widget.js?22';
			script.setAttribute('data-telegram-login', this.telegramLogin);
			script.setAttribute('data-request-access', this.requestAccess);
			script.setAttribute('data-size', this.size);
			if (!this.userPic) {
				script.setAttribute('data-userpic', 'false');
			}
			script.setAttribute('data-onauth', 'onTelegramAuth(user)');
			this.el.nativeElement.appendChild(script);
		}
	}
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.onTelegramAuth = (user: any) => {
	console.log('onTelegramAuth', user);
	alert('Logged in as ' + user.first_name + ' ' + user.last_name + ' (' + user.id + (user.username ? ', @' + user.username : '') + ')');
};
