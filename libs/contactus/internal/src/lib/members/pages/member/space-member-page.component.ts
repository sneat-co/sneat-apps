import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import { ContactusServicesModule } from '@sneat/contactus-services';
import {
	ContactComponentBaseParamsModule,
	ContactDetailsComponent,
} from '@sneat/contactus-shared';
import { MemberRelationship } from '@sneat/contactus-core';
import { MemberComponentBaseParams } from '../../member-component-base-params';
import { MemberBasePage } from '../member-base-page';

@Component({
	selector: 'sneat-space-member-page',
	templateUrl: './space-member-page.component.html',
	providers: [MemberComponentBaseParams],
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		SneatPipesModule,
		ContactDetailsComponent,
		ContactComponentBaseParamsModule,
		ContactusServicesModule,
	],
})
export class SpaceMemberPageComponent extends MemberBasePage {
	public relatedAs?: MemberRelationship;

	constructor(route: ActivatedRoute, params: MemberComponentBaseParams) {
		super('SpaceMemberPageComponent', route, params);
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
