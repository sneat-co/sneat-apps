import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
	ContactusSpaceService,
} from '@sneat/contactus-services';
import { MembersShortListCardComponent } from '@sneat/contactus-shared';
import { IIdAndOptionalDbo, TopMenuService } from '@sneat/core';
import { SpaceComponentBaseParams } from '@sneat/team-components';
import { SpaceServiceModule } from '@sneat/team-services';
import { SpacePageBaseComponent } from './SpacePageBaseComponent';
import { CalendarBriefComponent } from '@sneat/extensions-schedulus-shared';

@Component({
	selector: 'sneat-space-page',
	templateUrl: './space-page.component.html',
	providers: [SpaceComponentBaseParams],
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
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
		// HappeningServiceModule,
	],
})
export class SpacePageComponent extends SpacePageBaseComponent {
	protected contactusSpace?: IIdAndOptionalDbo<IContactusSpaceDbo>;

	constructor(
		params: SpaceComponentBaseParams,
		topMenuService: TopMenuService,
		cd: ChangeDetectorRef, // readonly navService: TeamNavService,
		contactusTeamService: ContactusSpaceService,
	) {
		super('SpacePageComponent', topMenuService, cd);
		new ContactusSpaceContextService(
			params.errorLogger,
			this.destroyed$,
			this.spaceIDChanged$,
			contactusTeamService,
			this.userService,
		).contactusSpaceContext$.subscribe(
			(contactusSpace) => (this.contactusSpace = contactusSpace),
		);
		// this.userService.userChanged.pipe(this.takeUntilNeeded()).subscribe({
		// 	next: (uid) => {
		// 		if (uid) {
		// 			this.subscribeForContactusSpaceChanges();
		// 		} else {
		// 			this.contactusSpaceSub?.unsubscribe();
		// 		}
		// 	},
		// });
	}
}
