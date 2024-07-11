import { Component } from '@angular/core';
import { IContactBrief } from '@sneat/contactus-core';
import { IIdAndBrief } from '@sneat/core';
import { getRelatedItemIDs } from '@sneat/dto';
import { IHappeningContactRequest } from '@sneat/team-services';
import {
	HappeningBaseComponent,
	HappeningComponent,
} from '../happening-base.component';

@Component({
	selector: 'sneat-happening-card',
	templateUrl: 'happening-card.component.html',
	styleUrls: ['happening-card.component.scss'],
	providers: [...HappeningBaseComponent.providers],
	...HappeningBaseComponent.metadata,
})
export class HappeningCardComponent extends HappeningComponent {
	protected hasRelatedContacts(): boolean {
		return !!getRelatedItemIDs(
			this.happening?.brief?.related,
			'contactus',
			'contacts',
		).length;
	}

	protected getRelatedContactIDs(): readonly string[] {
		return getRelatedItemIDs(
			this.happening?.dbo?.related || this.happening?.brief?.related,
			'contactus',
			'contacts',
		);
	}

	protected removeMember(member: IIdAndBrief<IContactBrief>): void {
		console.log('removeMember', member);
		if (!this.happening) {
			return;
		}
		if (!this.team) {
			return;
		}
		const request: IHappeningContactRequest = {
			spaceID: this.team.id,
			happeningID: this.happening.id,
			contact: { id: member.id },
		};
		this.happeningService.removeParticipant(request).subscribe({
			next: () => {
				this.changeDetectorRef.markForCheck();
			},
			error: this.errorLogger.logErrorHandler(
				'Failed to remove member from happening',
			),
		});
	}
}
