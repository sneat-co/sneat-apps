import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Input, OnInit, inject } from '@angular/core';
import {
  ITelegramAuthData,
  SneatAuthWithTelegramService,
} from './sneat-auth-with-telegram.service';

let authWithTelegramService: SneatAuthWithTelegramService;

@Component({
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
export class LoginWithTelegramComponent implements OnInit {
  private readonly el = inject(ElementRef);
  private readonly document = inject<Document>(DOCUMENT);
  readonly authWithTelegram = inject(SneatAuthWithTelegramService);

  // TODO: Article about Telegram login
  constructor() {
    const authWithTelegram = this.authWithTelegram;

    authWithTelegramService = authWithTelegram;
  }

  @Input() public isUserAuthenticated = false;

  @Input() public botID: string = location.hostname.startsWith('local')
    ? 'AlextDevBot'
    : 'SneatBot';

  @Input() public size: 'small' | 'medium' | 'large' = 'large';
  @Input() public requestAccess: 'write' | 'read' = 'write';
  @Input() public userPic = true;

  ngOnInit() {
    const botID = this.botID;
    if (botID) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.onTelegramAuth = (tgAuthData: ITelegramAuthData) => {
        // https://core.telegram.org/widgets/login#receiving-authorization-data
        // After a successful authorization, the widget returns data
        // by calling the callback function data-onauth with the JSON-object containing
        // id, first_name, last_name, username, photo_url, auth_date and hash fields.
// console.log('window.onTelegramAuth(): Logged in', tgAuthData);
        authWithTelegramService.loginWithTelegram(
          botID,
          tgAuthData,
          this.isUserAuthenticated,
        );
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
