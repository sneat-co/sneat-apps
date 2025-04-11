import { AsyncPipe, TitleCasePipe } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
	IonButton,
	IonButtons,
	IonCard,
	IonCol,
	IonContent,
	IonGrid,
	IonHeader,
	IonIcon,
	IonItem,
	IonLabel,
	IonMenuButton,
	IonRow,
	IonText,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { IContactusSpaceDbo } from '@sneat/contactus-core';
import {
	ContactusServicesModule,
	ContactusSpaceContextService,
} from '@sneat/contactus-services';
import { MembersShortListCardComponent } from '@sneat/contactus-shared';
import { IIdAndOptionalDbo, TopMenuService } from '@sneat/core';
import { SpaceServiceModule } from '@sneat/space-services';
import { SpacePageBaseComponent } from './SpacePageBaseComponent';
import { CalendarBriefComponent } from '@sneat/extensions-schedulus-shared';

@Component({
	imports: [
		FormsModule,
		ContactusServicesModule,
		SpaceServiceModule,
		MembersShortListCardComponent,
		CalendarBriefComponent,
		IonHeader,
		IonToolbar,
		IonButtons,
		IonMenuButton,
		IonTitle,
		IonIcon,
		IonText,
		IonGrid,
		IonRow,
		IonCol,
		IonItem,
		IonLabel,
		IonButton,
		IonCard,
		IonContent,
		AsyncPipe,
		TitleCasePipe,
		RouterLink,
		TitleCasePipe,
		SpaceServiceModule,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'sneat-space-page',
	templateUrl: './space-page.component.html',
})
export class SpacePageComponent extends SpacePageBaseComponent {
	protected readonly $contactusSpace = signal<
		IIdAndOptionalDbo<IContactusSpaceDbo> | undefined
	>(undefined);

	constructor(
		topMenuService: TopMenuService,
		cd: ChangeDetectorRef, // readonly navService: TeamNavService,
	) {
		super('SpacePageComponent', topMenuService, cd);
		new ContactusSpaceContextService(
			this.destroyed$,
			this.spaceIDChanged$,
		).contactusSpaceContext$.subscribe(this.$contactusSpace?.set);
	}
}
