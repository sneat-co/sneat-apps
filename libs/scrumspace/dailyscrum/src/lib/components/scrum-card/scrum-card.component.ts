import { Attribute, Component, EventEmitter, Input, Output } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IRecord } from '@sneat/data';
import { NavService } from '@sneat/datatug/core';
import { IMemberBrief, ITeamDto } from '@sneat/dto';
import { Timer } from '@sneat/meeting';
import { IScrumDto, IStatus, ITask } from '@sneat/scrumspace/scrummodels';
import { Md5 } from 'ts-md5/dist/md5';
import {TaskType} from '@sneat/scrumspace/scrummodels';

@Component({
	selector: 'sneat-scrum-card',
	templateUrl: './scrum-card.component.html',
	styleUrls: ['./scrum-card.component.scss'],
})
export class ScrumCardComponent {
	@Input() team?: IRecord<ITeamDto>;
	@Input() currentMemberId?: string;
	@Input() public scrumId?: string;
	@Input() public scrum?: IScrumDto;
	@Input() public status?: IStatus;
	// @Input() public taskType: TaskType;
	@Input() public isExpanded = false;
	@Input() public timer?: Timer;

	@Output() newTask = new EventEmitter<{
		member: IMemberBrief;
		task: ITask;
		// type: TaskType;
	}>();
	@Output() expandChanged = new EventEmitter<boolean>();

	public readonly taskTypes: TaskType[] = [
		'done',
		'todo',
		'risk',
		'qna',
		'kudos',
	];

	constructor(
		@Attribute('showMember') public showMember: boolean,
		@Attribute('viewMode') public viewMode: 'single' | 'team',
		private readonly navController: NavController,
		private readonly navService: NavService,
	) {
	}

	expandCollapseMember(event: Event): void {
		if (event) {
			event.stopPropagation();
		}
		this.isExpanded = !this.isExpanded;
		this.expandChanged.emit(this.isExpanded);
	}

	public goMember(member?: IMemberBrief) {
    if (!this.team) {
      throw new Error('!this.team');
    }
    if (!member) {
      throw new Error('!this.member');
    }
		this.navService.navigateToMember(this.navController, this.team, member);
	}

	public get gravatar(): string {
		const m = this.status?.member;
		return (
			m?.avatar?.gravatar ||
			m?.avatar?.external?.url ||
      m?.title && `//www.gravatar.com/avatar/${Md5.hashStr(m.title.trim().toLowerCase())}`
      || ''
		);
	}

	public count = (type: TaskType) => this.status?.byType?.[type]?.length || 0;

	public onTimerToggled(expand: boolean): void {
		if (expand && !this.isExpanded) {
			this.isExpanded = true;
			this.expandChanged.emit(this.isExpanded);
		}
	}
}
