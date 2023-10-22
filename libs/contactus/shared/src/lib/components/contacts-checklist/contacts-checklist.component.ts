import { CommonModule } from '@angular/common';
import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ContactusTeamService } from '@sneat/contactus-services';
import { IIdAndOptionalBrief, IContactBrief } from '@sneat/dto';
import { ITeamContext } from '@sneat/team/models';
import { Subscription } from 'rxjs';

@Component({
	selector: 'sneat-contacts-checklist',
	templateUrl: './contacts-checklist.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule],
})
export class ContactsChecklistComponent implements OnChanges {
	@Input({ required: true }) team?: ITeamContext;
	@Input() roles: string[] = ['member'];
	@Input() checkedContactIDs: string[] = [];
	@Input() noContactsMessage = 'No members found';
	@Output() readonly checkedChange = new EventEmitter<{
		event: CustomEvent;
		id: string;
		checked: boolean;
	}>();

	private teamID?: string;
	private contactusTeamSubscription?: Subscription;
	protected contacts?: IIdAndOptionalBrief<IContactBrief>[];

	constructor(private readonly contactusTeamService: ContactusTeamService) {}

	private subscribeForContactBriefs(team: ITeamContext): void {
		this.contactusTeamSubscription = this.contactusTeamService
			.watchContactBriefs(team)
			.subscribe({
				next: (contacts) => {
					const roles = this.roles;
					this.contacts = contacts
						.filter((c) => roles?.some((r) => c.brief?.roles?.includes(r)))
						.map((c) => ({ id: c.id, brief: c.brief as IContactBrief }));
				},
			});
	}

	public ngOnChanges(changes: SimpleChanges): void {
		console.log('ContactsChecklistComponent.ngOnChanges()', changes);
		if (changes['team']) {
			const team = this.team;
			if (team?.id !== this.teamID) {
				this.contactusTeamSubscription?.unsubscribe();
				if (team) {
					this.subscribeForContactBriefs(team);
				}
			}
		}
	}

	protected isChecked(id: string): boolean {
		return this.checkedContactIDs.includes(id);
	}

	protected onCheckboxChange(event: Event, id: string): void {
		const ce = event as CustomEvent;
		console.log('onCheckboxChange()', ce);
		const checked = !!ce.detail.checked;
		if (checked) {
			this.checkedContactIDs = [...this.checkedContactIDs, id];
		} else {
			this.checkedContactIDs = this.checkedContactIDs.filter((v) => v !== id);
		}
		this.checkedChange.emit({ event: ce, id, checked });
	}
}
