import { Component, Inject, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { excludeEmpty, excludeUndefined } from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ICreatePersonalInviteRequest, IMemberContext, ITeamContext } from '@sneat/team/models';
import { InviteService } from '@sneat/team/services';

@Component({
	selector: 'sneat-invite-modal',
	templateUrl: 'invite-modal.component.html',
})
export class InviteModalComponent {
	@Input() team?: ITeamContext;
	@Input() member?: IMemberContext;

	tab: 'email' | 'sms' | 'link' = 'email';
	link = 'https://sneat.app/join/family?id=';
	error?: string;

	readonly email = new FormControl('', Validators.required);
	readonly phone = new FormControl('', Validators.required);
	readonly message = new FormControl('');

	readonly emailForm = new FormGroup({
		email: this.email,
		message: this.message,
	});

	readonly smsForm = new FormGroup({
		phone: this.phone,
		message: this.message,
	});

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly modalController: ModalController,
		private readonly toastController: ToastController,
		private readonly inviteService: InviteService,
	) {

	}

	async close(): Promise<void> {
		await this.modalController.dismiss();
	}

	async sendInvite(): Promise<void> {
		if (!this.team) {
			this.errorLogger.logError('can not send invite without team context');
			return;
		}
		if (!this.member) {
			this.errorLogger.logError('can not send invite without member context');
			return;
		}
		switch (this.tab) {
			case 'email':
				this.emailForm.markAllAsTouched();
				break;
			case 'sms':
				this.smsForm.markAllAsTouched();
				break;
		}

		if (this.tab === 'email' && !this.email.value) {
			this.error = 'Email address is required';
			return;
		}
		if (this.tab === 'sms' && !this.phone.value) {
			this.error = 'Phone number is required';
			return;
		}
		const address = this.tab === 'email' ? this.email.value : this.phone.value;

		const request: ICreatePersonalInviteRequest = excludeEmpty({
			teamID: this.team.id,
			to: {
				channel: this.tab,
				address,
				memberID: this.member.id,
			},
			message: this.message.value,
		});
		this.inviteService.CreatePersonalInvite(request).subscribe({
			next: async response => {
				console.log('personal invite created:', response);
				await this.showToast('Invite has been created and will be sent shortly', 2000);
				await this.modalController.dismiss();
			},
			error: this.errorLogger.logErrorHandler('failed to create an invite for a member'),
		});
	}

	async copyToClipboard() {
		await navigator.clipboard.writeText(this.link);
		await this.showToast('Invite link has been copied to your clipboard');
	}

	private async showToast(message: string, duration = 1500): Promise<void> {
		await this.modalController.dismiss();
		const toast = await this.toastController.create({
			message,
			duration,
			position: 'middle',
			keyboardClose: true,
			color: 'tertiary',
			buttons: [{ role: 'cancel', icon: 'close' }],
		});
		await toast.present();
	}
}
