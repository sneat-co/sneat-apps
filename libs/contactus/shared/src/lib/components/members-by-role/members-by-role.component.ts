import { JsonPipe } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	Output,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IContactBrief } from '@sneat/contactus-core';
import { IIdAndBrief } from '@sneat/core';
import { ISpaceContext } from '@sneat/team-models';
import { MembersListComponent } from '../members-list';
import { MembersGroup } from './member-group';

@Component({
	selector: 'sneat-members-by-role',
	templateUrl: './members-by-role.component.html',
	imports: [IonicModule, MembersListComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembersByRoleComponent {
	@Input({ required: true }) public space?: ISpaceContext;
	@Input({ required: true }) public memberGroups?: readonly MembersGroup[];
	@Output() public readonly addMember = new EventEmitter<MembersGroup>();

	public contactsByMember: Record<
		string,
		readonly IIdAndBrief<IContactBrief>[]
	> = {};
}
