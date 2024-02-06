import {
	Component,
	Inject,
	Input,
	NgZone,
	OnChanges,
	OnDestroy,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { IonInput, ModalController } from '@ionic/angular';
import { listAddRemoveAnimation } from '@sneat/core';
import { IRecord } from '@sneat/data';
import { IMemberBrief, ITeamDto } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITaskWithUiStatus, ScrumService } from '../../services/scrum.service';
import {
	IReorderTaskRequest,
	ITask,
	IThumbUpRequest,
	TaskType,
} from '@sneat/scrumspace/scrummodels';
import { Subscription } from 'rxjs';
import { ScrumTaskComponent } from '../scrum-task/scrum-task.component';

@Component({
	selector: 'sneat-scrum-tasks',
	templateUrl: './scrum-tasks.component.html',
	styleUrls: ['./scrum-tasks.component.scss'],
	animations: listAddRemoveAnimation,
})
export class ScrumTasksComponent implements OnDestroy, OnChanges {
	@Input() team?: IRecord<ITeamDto>;
	@Input() public scrumId?: string;

	@Input() member?: IMemberBrief;
	@Input() taskType?: TaskType | 'qna';

	@Input() public disabled?: boolean;

	@Input() tasks?: ITaskWithUiStatus[];
	@Input() currentMemberId?: string;
	@Input() public hideTitle?: boolean;
	@Input() public cardMode?: 'by-person';

	@ViewChild(IonInput, { static: false }) titleInput?: IonInput; // TODO: IonInput;

	public visibleTasks?: ITaskWithUiStatus[];

	addingTasks: ITask[] = [];

	// @Output() newTask = new EventEmitter<{ member: IMemberInfo, task: ITask, type: TaskType }>();

	public newTaskTitle = '';
	public isAdding?: boolean;

	public showAddInput?: boolean;

	private userSubscription?: Subscription;
	private deletingTaskIds: string[] = [];

	constructor(
		private readonly zone: NgZone,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly scrumService: ScrumService,
		private modalController: ModalController,
	) {}

	ngOnDestroy(): void {
		if (this.userSubscription) {
			this.userSubscription.unsubscribe();
		}
	}

	public trackByTaskId(index: number, task: ITask) {
		return task?.id;
	}

	public get newTaskPlaceholder(): string {
		switch (this.taskType) {
			case 'done':
				return 'New completed task';
			case 'plan':
				return 'New planned task';
			case 'risk':
				return 'New risk';
			case 'todo':
				return 'New todo task';
			case 'qna':
				return 'Ask question';
			case 'kudos':
				return 'New kudos';
			default:
				return 'New item';
		}
	}

	public taskBlur(event: Event): void {
		if (this.newTaskTitle.trim()) {
			this.addTask(event);
		}
	}

	public addTask(event: Event): void {
		console.log('addTask()');
		event.stopPropagation();
		if (this.showAddInput) {
			this.showAddInput = false;
			return;
		}
		if (!this.newTaskTitle.trim()) {
			this.showAddInput = true;
			setTimeout(() => {
				this.titleInput
					?.setFocus()
					.catch((err) =>
						this.errorLogger.logError(
							err,
							'Failed to set focus to title input',
						),
					);
			}, 99);
			return;
		}
		if (!this.tasks) {
			return;
		}
		const title = this.newTaskTitle;
		this.newTaskTitle = '';
		if (!this.member) {
			throw new Error('!this.member');
		}
		if (!this.team) {
			throw new Error('!this.team');
		}
		this.scrumService
			.addTask(
				this.team,
				this.scrumId || 'EMPTY_SCRUM_ID',
				this.member,
				this.taskType as TaskType,
				title,
			)
			.subscribe({
				next: (task) => {
					console.log('addTask() => ', { ...task });
					if (task.uiStatus === 'adding') {
						this.addingTasks.push(task);
						return;
					}
					this.addingTasks = this.addingTasks.filter((t) => t.id !== task.id);
					if (this.tasks) {
						const i =
							this.visibleTasks?.findIndex((t) => t.id === task.id) ?? -1;
						if (i < 0) {
							// if existing task update array
							this.visibleTasks?.push(task);
						}
					} else {
						this.visibleTasks = [task];
					}
					// this.newTask.emit({member: this.member, task, type: this.taskType as TaskType});
				},
				error: (err) =>
					this.errorLogger.logError(err, 'Failed to add scum task'),
				complete: () => {
					this.disabled = false;
					this.isAdding = false;
				},
			});
	}

	public thumbUp(event: Event, memberId: string, task: ITaskWithUiStatus) {
		event.stopPropagation();
		if (memberId === this.currentMemberId) {
			this.errorLogger.logError(
				'You can not upvote your own tasks',
				'You can not upvote your own tasks',
				{ show: true },
			);
			return;
		}
		if (!task.thumbUps) {
			task.thumbUps = [];
		}
		if (!this.currentMemberId) {
			throw new Error('!currentMemberId');
		}
		if (!this.team) {
			throw new Error('!team');
		}
		if (!this.taskType) {
			throw new Error('!taskType');
		}
		if (!this.member) {
			throw new Error('!member');
		}
		const oldState = task.thumbUps.includes(this.currentMemberId || '');
		if (oldState) {
			task.thumbUps = task.thumbUps.filter((v) => v !== this.currentMemberId);
		} else {
			task.thumbUps.push(this.currentMemberId);
		}
		const request: IThumbUpRequest = {
			teamID: this.team.id,
			memberID: this.member.id,
			type: this.taskType,
			// meetingID: this.scrumId,
			task: task.id,
			value: !oldState,
		};
		this.scrumService.thumbUp(request).subscribe({
			error: (err) =>
				this.errorLogger.logError(err, 'Failed to change thumbUp'),
		});
		console.log(task.thumbUps);
	}

	public deleteTask(event: Event, id: string): void {
		event.stopPropagation();
		const tasks = this.visibleTasks;
		if (!tasks) {
			throw new Error('!visibleTasks');
		}
		const index = tasks.findIndex((t) => t.id === id);
		const task = tasks[index];
		tasks.splice(index, 1);
		this.tasks = [...tasks];
		this.deletingTaskIds.push(id);
		if (!this.scrumId) {
			throw new Error('!this.scrumID');
		}
		if (!this.member) {
			throw new Error('!this.member');
		}
		if (!this.team) {
			throw new Error('!this.team');
		}
		this.scrumService
			.deleteTask(
				this.team.id,
				this.scrumId,
				this.member,
				this.taskType as TaskType,
				id,
			)
			.subscribe({
				next: () => {
					this.visibleTasks = this.visibleTasks?.filter((t) => t.id !== id);
					if (this.deletingTaskIds.find((v) => v === id)) {
						this.zone.runOutsideAngular(() => {
							this.deletingTaskIds = this.deletingTaskIds.filter(
								(v) => v !== id,
							);
						});
					}
				},
				error: (err) => {
					this.errorLogger.logError(err, 'Failed to delete task');
					if (!tasks.find((t) => t.id === id)) {
						this.tasks?.splice(index, 0, task);
					}
				},
			});
	}

	doReorder(event: CustomEvent): void {
		// console.log('doReorder():', event);
		const tasks = this.tasks;
		if (
			!tasks?.length || // TODO: Alert user tasks has been removed.
			tasks?.length === 1
		) {
			(event.detail as { complete: (v: ITaskWithUiStatus[]) => void }).complete(
				this.visibleTasks || [],
			); // Should be before setting & after values
			return;
		}
		if (!this.taskType) {
			throw new Error('!this.taskType');
		}
		if (!this.member) {
			throw new Error('!this.member');
		}
		if (!this.scrumId) {
			throw new Error('!this.scrumId');
		}
		if (!this.visibleTasks) {
			throw new Error('!this.visibleTasks');
		}
		const taskID = this.visibleTasks[event.detail.from].id;
		if (!taskID) {
			throw new Error(`!this.visibleTasks[${event.detail.from}]`);
		}
		if (!this.team) {
			throw new Error('!this.team');
		}
		const request: IReorderTaskRequest = {
			teamID: this.team.id,
			// meetingID: this.scrumId,
			type: this.taskType,
			memberID: this.member.id,
			task: taskID,
			len: this.tasks?.length || 0,
			from: event.detail.from,
			to: event.detail.to,
		};
		(event.detail as { complete: (v: ITaskWithUiStatus[]) => void }).complete(
			this.visibleTasks,
		); // Should be before setting before & after values
		if (this.tasks && request.to < this.tasks?.length - 1) {
			request.before = this.visibleTasks[request.to + 1].id;
		}
		if (request.to > 0) {
			request.after = this.visibleTasks[request.to - 1].id;
		}
		this.scrumService.reorderTask(request).subscribe({
			error: (err) => this.errorLogger.logError(err, 'Failed to reorder item'),
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['tasks']) {
			if (this.taskType === 'risk') {
				console.log(
					`ScrumTasksComponent.ngOnChanges: deletingTaskIds: ${this.deletingTaskIds}, tasks: ${this.tasks}`,
				);
			}
			this.visibleTasks = this.tasks?.filter(
				(t) => this.deletingTaskIds.findIndex((v) => v === t.id) < 0,
			);
		}
	}

	async showTaskPopover(event: Event, task: ITask) {
		console.log('showTaskPopover()', task);
		if (!this.team) {
			throw new Error('!this.team');
		}
		try {
			const modal = await this.modalController.create({
				component: ScrumTaskComponent,
				componentProps: {
					event,
					task,
					teamId: this.team.id,
					date: this.scrumId,
					memberId: this.member?.id,
					type: this.taskType,
				},
			});
			// popover.style.cssText = '--min-width: 500px;';
			return await modal.present();
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to create popover');
		}
	}
}
