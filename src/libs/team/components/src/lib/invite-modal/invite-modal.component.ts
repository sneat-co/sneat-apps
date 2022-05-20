import { Component, Inject, Input, Pipe, PipeTransform } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { TeamType } from '@sneat/auth-models';
import { excludeEmpty, excludeUndefined } from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ICreatePersonalInviteRequest, IMemberContext, ITeamContext } from '@sneat/team/models';
import { InviteService } from '@sneat/team/services';

@Pipe({ name: 'encodeSmsText' })
export class EncodeSmsText implements PipeTransform {
	// tslint:disable-next-line:prefer-function-over-method
	transform(text: string): string | undefined {
		return encodeURIComponent(text);
	}
}

@Component({
	selector: 'sneat-invite-modal',
	templateUrl: 'invite-modal.component.html',
})
export class InviteModalComponent {
	@Input() team?: ITeamContext;
	@Input() member?: IMemberContext;

	tab: 'email' | 'sms' | 'link' = 'email';
	link?: string;
	error?: string;

	creatingInvite = false;

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

	getInviteText(invite: { id: string; pin: string }): string {
		let m = `Join our family @ Sneat.app - https://sneat.app/join/family?id=${invite.id}#pin=${invite.pin}`;
		if (this.message.value) {
			m += '\n\n' + this.message.value;
		}
		return m;
	}

	async composeSMS(): Promise<void> {
		this.creatingInvite = true;
		setTimeout(() => {
			const m = this.getInviteText({ id: '123', pin: '456' });
			const body = encodeURIComponent(m);
			const url = `sms:${this.phone.value}?&body=${body}`;
			this.creatingInvite = false;
			window.open(url);
		}, 1000);
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
		this.inviteService.createInviteForMember(request).subscribe({
			next: async response => {
				console.log('personal invite created:', response);
				await this.showToast('Invite has been created and will be sent shortly', 2000);
				await this.modalController.dismiss();
			},
			error: this.errorLogger.logErrorHandler('failed to create an invite for a member'),
		});
	}

	async copyToClipboard() {
		if (!this.link) {
			return;
		}
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

	onTabChanged(event: Event): void {
		if (this.tab === 'link' && !this.link && !this.creatingInvite) {
			this.generateLink();
		}
	}

	private generateLink(): void {
		if (!this.team) {
			return;
		}
		if (!this.member) {
			return;
		}
		this.creatingInvite = true;
		const request: ICreatePersonalInviteRequest = excludeEmpty({
			teamID: this.team.id,
			to: {
				channel: 'link',
				memberID: this.member.id,
			},
			message: this.message.value,
		});
		this.inviteService.getInviteLinkForMember(request).subscribe({
			next: response => {
				console.log('response', response);
				const {id, pin} = response.invite;
				this.link = `https://sneat.app/pwa/join/${this.team?.brief?.type}?id=${id}#pin=${pin}`;
				this.creatingInvite = false;
			},
			error: this.errorLogger.logErrorHandler('failed to generate an invite link'),
		});
	}
}
