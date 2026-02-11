import {
  Component,
  EventEmitter,
  Input,
  Output,
  HostAttributeToken,
  inject,
} from '@angular/core';
import {
  NavController,
  IonAvatar,
  IonBadge,
  IonButton,
  IonButtons,
  IonCardHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
} from '@ionic/angular/standalone';
import { IRecord } from '@sneat/data';
import { NavService } from '@sneat/datatug-main';
import { IMemberBrief, ISpaceDbo } from '@sneat/dto';
import { Timer } from '@sneat/ext-meeting';
import { IScrumDbo, IStatus, ITask } from '@sneat/ext-scrumspace-scrummodels';
import { TimerMemberButtonComponent } from '@sneat/timer';
import { Md5 } from 'ts-md5';
import { TaskType } from '@sneat/ext-scrumspace-scrummodels';
import { ScrumTasksComponent } from '../scrum-tasks/scrum-tasks.component';

@Component({
  selector: 'sneat-scrum-card',
  templateUrl: './scrum-card.component.html',
  styleUrls: ['./scrum-card.component.scss'],
  imports: [
    IonCardHeader,
    IonList,
    IonItem,
    IonAvatar,
    IonImg,
    IonIcon,
    IonLabel,
    IonButtons,
    IonButton,
    IonBadge,
    TimerMemberButtonComponent,
    ScrumTasksComponent,
  ],
})
export class ScrumCardComponent {
  showMember = inject(new HostAttributeToken('showMember'), { optional: true });
  viewMode = inject(new HostAttributeToken('viewMode'), { optional: true });
  private readonly navController = inject(NavController);
  private readonly navService = inject(NavService);

  @Input() space?: IRecord<ISpaceDbo>;
  @Input() currentMemberId?: string;
  @Input() public scrumId?: string;
  @Input() public scrum?: IScrumDbo;
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

  expandCollapseMember(event: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.isExpanded = !this.isExpanded;
    this.expandChanged.emit(this.isExpanded);
  }

  public goMember(member?: IMemberBrief) {
    if (!this.space) {
      throw new Error('!this.team');
    }
    if (!member) {
      throw new Error('!this.member');
    }
    this.navService.navigateToMember(this.navController, this.space, member);
  }

  public get gravatar(): string {
    const m = this.status?.member;
    return (
      m?.avatar?.gravatar ||
      m?.avatar?.external?.url ||
      (m?.title &&
        `//www.gravatar.com/avatar/${Md5.hashStr(
          m.title.trim().toLowerCase(),
        )}`) ||
      ''
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
