import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginWithTelegramComponent } from '../../pages/login-page/login-with-telegram.component';

@Component({
	selector: 'sneat-user-messaging-apps',
	templateUrl: './user-messaging-apps.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule, LoginWithTelegramComponent, FormsModule],
})
export class UserMessagingAppsComponent {
	protected integrations: 'messaging-apps' | 'quick-logins' = 'messaging-apps';
}
