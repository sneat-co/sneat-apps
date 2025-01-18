import { Component } from '@angular/core';
import { IContactBrief } from '@sneat/contactus-core';
import { IIdAndBrief } from '@sneat/core';
import { getRelatedItemIDs } from '@sneat/dto';
import {
	HappeningBaseComponent,
	HappeningComponent,
} from '../happening-base.component';
import { IHappeningContactRequest } from '../../services/happening.service';

@Component({
	selector: 'sneat-happening-card',
	templateUrl: 'happening-card.component.html',
	styleUrls: ['happening-card.component.scss'],
	providers: [...HappeningBaseComponent.providers],
	...HappeningBaseComponent.metadata,
	standalone: false,
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
		if (!this.space) {
			return;
		}
		const request: IHappeningContactRequest = {
			spaceID: this.space.id,
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
