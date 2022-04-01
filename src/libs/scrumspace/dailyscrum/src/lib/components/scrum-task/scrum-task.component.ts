import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { IRecord, ITask, ITaskComment, IUser, TaskType } from '../../../models/interfaces';
import { ModalController } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat-team/ui-core';
import { UserService } from '../../../services/user-service';
import { ScrumService } from '../../../services/scrum.service';
import { IAddCommentRequest } from '../../../models/dto-models';
import { getMeetingIdFromDate } from '../../../services/meeting.service';

@Component({
	selector: 'app-scrum-task',
	templateUrl: './scrum-task.component.html',
	styleUrls: ['./scrum-task.component.scss'],
})
export class ScrumTaskComponent implements OnInit {
	@Input() teamID: string;
	@Input() date: Date;
	@Input() memberID: string;
	@Input() type: TaskType;
	@Input() task: ITask;

	@ViewChild('commentInput', { static: false }) commentInput; // TODO: strong typing : IonInput;

	public tab: 'comments' | 'thumbups' = 'comments';

	public user: IRecord<IUser>;

	constructor(
		@Inject(ErrorLogger) private errorLogger: IErrorLogger,
		public modalController: ModalController,
		private userService: UserService,
		private scrumService: ScrumService,
	) {
		this.userService.userRecord.subscribe((user) => {
			this.user = user;
		});
	}

	ngOnInit() {
		if (this.tab === 'comments') {
			setTimeout(() => {
				this.commentInput
					?.setFocus()
					.catch((err) =>
						this.errorLogger.logError(
							err,
							'Failed to set focus to comment input',
							{ feedback: false },
						),
					);
			}, 200);
		}
	}

	addComment(): void {
		const message = this.commentInput.value as string;
		this.commentInput.value = '';
		this.commentInput
			.setFocus()
			.catch((err) =>
				this.errorLogger.logError(err, 'Failed to set focus back to input'),
			);
		if (message) {
			if (!this.task.comments) {
				this.task.comments = [];
			}
			const comment: ITaskComment = {
				id: undefined as string,
				message,
				by: { userID: this.user.id, title: this.user.data.title },
			};
			this.task.comments.push(comment);
			const request: IAddCommentRequest = {
				team: this.teamID,
				meeting: getMeetingIdFromDate(this.date),
				type: this.type,
				task: this.task.id,
				member: this.memberID,
				message,
			};
			this.scrumService.addComment(request).subscribe({
				next: (id) => (comment.id = id),
				error: (err) => {
					this.errorLogger.logError(err, 'Failed to add comment');
					this.task.comments = this.task.comments.filter(
						(c) => !c.id && c.message === message,
					);
				},
			});
		}
	}
}
