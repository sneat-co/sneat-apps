import {
	Component,
	Input,
	OnChanges,
	SimpleChanges,
	inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	NavController,
	IonBadge,
	IonButton,
	IonButtons,
	IonCard,
	IonIcon,
	IonItemDivider,
	IonLabel,
	IonSegment,
	IonSegmentButton,
} from '@ionic/angular/standalone';
import {
	MemberRole,
	MemberRoleContributor,
	MemberRoleSpectator,
	IContactusSpaceDbo,
	IContactusSpaceDboAndID,
} from '@sneat/contactus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { zipMapBriefsWithIDs } from '@sneat/space-models';
import { SpaceNavService, SpaceService } from '@sneat/space-services';

@Component({
	selector: 'sneat-members',
	templateUrl: './members.component.html',
	imports: [
		FormsModule,
		IonCard,
		IonItemDivider,
		IonLabel,
		IonButtons,
		IonButton,
		IonIcon,
		IonSegment,
		IonSegmentButton,
		IonBadge,
	],
}) // TODO: use or delete unused MembersComponent
export class MembersComponent implements OnChanges {
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	private readonly spaceService = inject(SpaceService);
	private readonly navController = inject(NavController);
	readonly navService = inject(SpaceNavService);

	@Input({ required: true }) public contactusSpace?: IContactusSpaceDboAndID;

	public membersRoleTab: MemberRole | '*' = MemberRoleContributor;
	public contributorsCount?: number;
	public spectatorsCount?: number;

	public goAddMember(event?: Event): void {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}
		if (!this.contactusSpace) {
			throw 'no team';
		}
		this.navService.navigateToAddMember(
			this.navController,
			this.contactusSpace,
		);
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['contactusTeam']) {
			try {
				this.setMembersCount(this.contactusSpace?.dbo);
			} catch (e) {
				this.errorLogger.logError(e, 'Failed to process team changes');
			}
		}
	}

	public onSelfRemoved(): void {
		// this.unsubscribe('onSelfRemoved');
	}

	private setMembersCount(team?: IContactusSpaceDbo | null): void {
		if (team) {
			const count = (role: MemberRole): number =>
				zipMapBriefsWithIDs(team.contacts)?.filter((m) =>
					m.brief.roles?.includes(role),
				)?.length || 0;
			this.contributorsCount = count(MemberRoleContributor);
			this.spectatorsCount = count(MemberRoleSpectator);
		} else {
			this.contributorsCount = undefined;
			this.spectatorsCount = undefined;
		}
	}
}
