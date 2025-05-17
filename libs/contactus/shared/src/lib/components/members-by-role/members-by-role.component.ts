import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	Output,
} from '@angular/core';
import {
	IonButton,
	IonButtons,
	IonIcon,
	IonItem,
	IonItemGroup,
	IonLabel,
	IonSpinner,
} from '@ionic/angular/standalone';
import { IContactWithBriefAndSpace } from '@sneat/contactus-core';
import { WithSpaceInput } from '@sneat/space-services';
import { MembersListComponent } from '../members-list';
import { MemberGroup } from './member-group';

@Component({
	selector: 'sneat-members-by-role',
	templateUrl: './members-by-role.component.html',
	imports: [
		MembersListComponent,
		IonItemGroup,
		IonLabel,
		IonButtons,
		IonButton,
		IonIcon,
		IonItem,
		IonSpinner,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembersByRoleComponent extends WithSpaceInput {
	@Input({ required: true }) public memberGroups?: readonly MemberGroup[];
	@Output() public readonly addMember = new EventEmitter<MemberGroup>();

	public contactsByMember: Record<
		string,
		readonly IContactWithBriefAndSpace[]
	> = {};

	public constructor() {
		super('MembersByRoleComponent');
	}
}
