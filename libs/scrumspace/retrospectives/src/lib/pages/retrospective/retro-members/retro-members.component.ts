import {
	Component,
	Input,
	OnChanges,
	SimpleChanges,
	inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	IonBadge,
	IonButton,
	IonCard,
	IonCardContent,
	IonIcon,
	IonItem,
	IonLabel,
	IonList,
	IonSegment,
	IonSegmentButton,
	IonText,
} from '@ionic/angular/standalone';
import { IMeetingMember } from '@sneat/ext-meeting';
import { IRecord } from '@sneat/data';
import { ISpaceContext } from '@sneat/space-models';
import { IRetrospective } from '@sneat/ext-scrumspace-scrummodels';
import { ErrorLogger, IErrorLogger } from '@sneat/core';

interface IRetroCount {
	title: string;
	count: number;
}

interface IMeetingMemberWithCounts extends IMeetingMember {
	id: string;
	counts?: Record<string, IRetroCount>;
}

@Component({
	selector: 'sneat-retro-members',
	templateUrl: './retro-members.component.html',
	imports: [
		IonCard,
		IonSegment,
		IonSegmentButton,
		IonLabel,
		IonBadge,
		IonText,
		IonList,
		IonItem,
		IonCardContent,
		IonButton,
		IonIcon,
		FormsModule,
	],
})
export class RetroMembersComponent implements OnChanges {
	private errorLogger = inject<IErrorLogger>(ErrorLogger);

	@Input({ required: true }) space?: ISpaceContext;
	@Input({ required: true }) retrospective?: IRecord<IRetrospective>;

	public membersTab: 'participants' | 'spectators' | 'absent' = 'participants';

	public participants?: IMeetingMemberWithCounts[];
	public spectators?: IMeetingMemberWithCounts[];
	public absents?: IMeetingMember[];

	public ngOnChanges(changes: SimpleChanges): void {
		console.log('ngOnChanges', this.space, this.retrospective);
		try {
			if (changes.retrospective) {
				const retrospective = this.retrospective?.dbo;
				if (retrospective) {
					const members = this.retrospective?.dbo?.members;
					if (members) {
						this.participants = members.filter((m) =>
							m.roles?.includes(MemberRoleEnum.contributor),
						);
						this.spectators = members?.filter((m) =>
							m.roles?.includes(MemberRoleEnum.spectator),
						);
					}
				}
			}
			if (changes.team) {
				// Check for this.retrospective?.data?.userIDs is not great
				if (this.space?.dbo && !this.retrospective?.dbo?.userIDs) {
					const { dbo } = this.space;
					this.participants = dbo.members?.filter((m) =>
						m.roles?.includes(MemberRoleEnum.contributor),
					);
					this.spectators = dbo.members?.filter((m) =>
						m.roles?.includes(MemberRoleEnum.spectator),
					);
				}
			}
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to process ngOnChanges event');
		}
	}
}
