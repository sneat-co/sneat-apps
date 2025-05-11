import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	computed,
} from '@angular/core';
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
	ContactsAsBadgesComponent,
	SelectedContactsPipe,
} from '@sneat/components';
import { IContactWithBrief } from '@sneat/contactus-core';
import { getRelatedItemIDs } from '@sneat/dto';
import { WdToWeekdayPipe } from '@sneat/mod-schedulus-core';
import {
	HappeningBaseComponent,
	HappeningBaseComponentParams,
} from '../happening-base.component';
import { IHappeningContactRequest } from '../../services/happening.service';
import { HappeningSlotsComponent } from '../happening-slots/happening-slots.component';

@Component({
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
		ContactsAsBadgesComponent,
		LongMonthNamePipe,
		SelectedContactsPipe,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'sneat-happening-card',
	templateUrl: 'happening-card.component.html',
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

	protected readonly $hasRelatedContacts = computed<boolean>(
		() => !!this.$relatedContactIDs()?.length,
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

	protected removeMember(member: IContactWithBrief): void {
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
