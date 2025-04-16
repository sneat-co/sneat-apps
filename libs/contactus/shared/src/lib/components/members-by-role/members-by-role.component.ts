import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	Output,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IContactWithBriefAndSpace } from '@sneat/contactus-core';
import { WithSpaceInput } from '@sneat/space-components';
import { MembersListComponent } from '../members-list';
import { MemberGroup } from './member-group';

@Component({
	selector: 'sneat-members-by-role',
	templateUrl: './members-by-role.component.html',
	imports: [IonicModule, MembersListComponent],
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
