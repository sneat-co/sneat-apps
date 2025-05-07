import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	IonBackButton,
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonMenuButton,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { PersonTitle } from '@sneat/components';
import {
	ContactService,
	ContactusServicesModule,
} from '@sneat/contactus-services';
import { ContactDetailsComponent } from '@sneat/contactus-shared';
import { MemberRelationship } from '@sneat/contactus-core';
import { SpaceServiceModule } from '@sneat/space-services';
import { MemberBasePage } from '../member-base-page';

@Component({
	selector: 'sneat-space-member-page',
	templateUrl: './space-member-page.component.html',
	imports: [
		FormsModule,
		ContactDetailsComponent,
		ContactusServicesModule,
		PersonTitle,
		SpaceServiceModule,
		IonHeader,
		IonToolbar,
		IonButtons,
		IonBackButton,
		IonTitle,
		IonIcon,
		IonMenuButton,
		IonContent,
		IonButton,
	],
})
export class SpaceMemberPageComponent extends MemberBasePage {
	public relatedAs?: MemberRelationship;

	constructor(contactService: ContactService) {
		super('SpaceMemberPageComponent', contactService);
	}

	// protected setMemberId(memberId: string): void {
	// 	super.setMemberId(memberId);
	// 	if (this.currentUserDto && this.communeRealId) {
	// 		this.setRelatedAs();
	// 	}
	// }

	// protected setPageCommuneIds(source: string, communeIds: ICommuneIds, communeDto?: ICommuneDto): void {
	// 	super.setPageCommuneIds(source, communeIds, communeDto);
	// 	if (this.currentUserDto && this.memberId) {
	// 		this.setRelatedAs();
	// 	}
	// }

	// protected setCurrentUser(dto: IUserDto): void {
	// 	super.setCurrentUser(dto);
	// 	this.logger.debug('CommuneMemberPage.setCurrentUser()', dto);
	// 	if (this.memberId && this.communeRealId) {
	// 		this.setRelatedAs();
	// 	}
	// }

	public removeMember() {
		if (
			!confirm(
				`Are you sure you want to remove ${
					this.member?.brief?.title || this.member?.id
				} from ${this.space?.brief?.title}?`,
			)
		) {
			return;
		}
		if (!this.space) {
			this.errorLogger.logError(
				'Can not remove team member without team context',
			);
			return;
		}
		if (!this.member?.id) {
			this.errorLogger.logError(
				'Can not remove team member without knowing member ID',
			);
			return;
		}
		this.contactService
			.removeSpaceMember({ spaceID: this.space.id, contactID: this.member?.id })
			.subscribe({
				next: () => {
					this.navController
						.pop()
						.catch((err) =>
							this.errorLogger.logError(err, 'Failed to pop navigator state'),
						);
				},
				error: (err) =>
					this.errorLogger.logError(err, 'Failed to remove member'),
			});
	}

	private setRelatedAs(): void {
		// this.logger.debug('CommuneMemberPage.setRelatedAs()', this.currentUserDto);
		// if (!this.currentUserDto) {
		// 	return;
		// }
		// const userCommunes = this.currentUserDto && this.currentUserDto.communes;
		// if (userCommunes) {
		// 	const userCommuneInfo = userCommunes.find(c => eq(c.id, this.communeRealId));
		// 	if (userCommuneInfo && userCommuneInfo.members) {
		// 		const memberInfo = userCommuneInfo.members[this.memberId];
		// 		if (memberInfo) {
		// 			this.relatedAs = memberInfo.relatedAs;
		// 		}
		// 	}
		// }
	}
}
