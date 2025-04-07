import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	Output,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IContactWithBriefAndSpace } from '@sneat/contactus-core';
import { ISpaceContext } from '@sneat/space-models';
import { MembersListComponent } from '../members-list';
import { MemberGroup } from './member-group';

@Component({
	selector: 'sneat-members-by-role',
	templateUrl: './members-by-role.component.html',
	imports: [IonicModule, MembersListComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembersByRoleComponent {
	@Input({ required: true }) public space?: ISpaceContext;
	@Input({ required: true }) public memberGroups?: readonly MemberGroup[];
	@Output() public readonly addMember = new EventEmitter<MemberGroup>();

	public contactsByMember: Record<
		string,
		readonly IContactWithBriefAndSpace[]
	> = {};
}
