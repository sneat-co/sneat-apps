import { ChangeDetectorRef, Component, computed } from '@angular/core';
import {
	IonButton,
	IonButtons,
	IonCard,
	IonIcon,
	IonItem,
	IonLabel,
	IonText,
} from '@ionic/angular/standalone';
import {
	LongMonthNamePipe,
	MembersAsBadgesComponent,
	SelectedContactsPipe,
} from '@sneat/components';
import { IContactBrief } from '@sneat/contactus-core';
import { IIdAndBrief } from '@sneat/core';
import { getRelatedItemIDs } from '@sneat/dto';
import { WdToWeekdayPipe } from '@sneat/mod-schedulus-core';
import {
	HappeningBaseComponent,
	HappeningBaseComponentParams,
} from '../happening-base.component';
import { IHappeningContactRequest } from '../../services/happening.service';
import { HappeningSlotsComponent } from '../happening-slots/happening-slots.component';

@Component({
	selector: 'sneat-happening-card',
	templateUrl: 'happening-card.component.html',
	styleUrls: ['happening-card.component.scss'],
	providers: [...HappeningBaseComponent.providers],
	...HappeningBaseComponent.metadata,
	imports: [
		IonText,
		WdToWeekdayPipe,
		IonLabel,
		IonCard,
		IonItem,
		IonButtons,
		IonButton,
		IonIcon,
		HappeningSlotsComponent,
		MembersAsBadgesComponent,
		LongMonthNamePipe,
		SelectedContactsPipe,
	],
})
export class HappeningCardComponent extends HappeningBaseComponent {
	protected readonly $relatedContactIDs = computed(() => {
		const happening = this.$happening();
		if (!happening) {
			return [];
		}
		return getRelatedItemIDs(
			happening.dbo?.related || happening.brief?.related,
			'contactus',
			'contacts',
		);
	});

	protected readonly $hasRelatedContacts = computed(
		() => this.$relatedContactIDs().length > 0,
	);

	constructor(
		happeningBaseComponentParams: HappeningBaseComponentParams,
		changeDetectorRef: ChangeDetectorRef,
	) {
		super(
			'HappeningCardComponent',
			happeningBaseComponentParams,
			changeDetectorRef,
		);
	}

	protected removeMember(member: IIdAndBrief<IContactBrief>): void {
		console.log('removeMember', member);
		const [space, happening] = this.spaceAndHappening();
		if (!space || !happening) {
			return;
		}
		const request: IHappeningContactRequest = {
			spaceID: space.id,
			happeningID: happening.id,
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
