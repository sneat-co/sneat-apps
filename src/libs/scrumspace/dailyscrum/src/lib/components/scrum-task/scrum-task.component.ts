import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { IonInput, ModalController } from '@ionic/angular';
import { SneatUserService } from '@sneat/auth';
import { IRecord } from '@sneat/data';
import { IUserDto } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ScrumService } from '../../services/scrum.service';
import { ITask, TaskType } from '@sneat/scrumspace/scrummodels';

@Component({
	selector: 'sneat-scrum-task',
	templateUrl: './scrum-task.component.html',
	styleUrls: ['./scrum-task.component.scss'],
})
export class ScrumTaskComponent implements OnInit {
	@Input() teamID?: string;
	@Input() date?: Date;
	@Input() memberID?: string;
	@Input() type?: TaskType;
	@Input() task?: ITask;

	@ViewChild('commentInput', { static: false }) commentInput?: IonInput; // TODO: strong typing : IonInput;

	public tab: 'comments' | 'thumbups' = 'comments';

	public user: IRecord<IUserDto>;

	constructor(
		@Inject(ErrorLogger) private errorLogger: IErrorLogger,
		public modalController: ModalController,
		private userService: SneatUserService,
		private scrumService: ScrumService,
	) {
		// this.userService.userRecord.subscribe((user) => {
		// 	this.user = user;
		// });
    throw new Error('not implemented yet')
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
		// const message = this.commentInput?.value as string;
		// this.commentInput.value = '';
		// this.commentInput
		// 	.setFocus()
		// 	.catch((err) =>
		// 		this.errorLogger.logError(err, 'Failed to set focus back to input'),
		// 	);
		// if (message) {
		// 	if (!this.task.comments) {
		// 		this.task.comments = [];
		// 	}
		// 	const comment: ITaskComment = {
		// 		id: undefined as unknown as string,
		// 		message,
		// 		by: { userID: this.user.id, title: this.user.data.title },
		// 	};
		// 	this.task?.comments.push(comment);
    //   if (!this.type) {
    //     throw new Error('!this.type');
    //   }
    //   if (!this.teamID) {
    //     throw new Error('!this.teamID');
    //   }
    //   if (!this.date) {
    //     throw new Error('!this.date');
    //   }
    //   if (!this.task) {
    //     throw new Error('!this.task');
    //   }
			// const request: IAddCommentRequest = {
			// 	teamID: this.teamID || '',
			// 	meetingID: getMeetingIdFromDate(this.date),
			// 	type: this.type,
			// 	task: this.task.id,
			// 	member: this.memberID,
			// 	message,
			// };
			// this.scrumService.addComment(request).subscribe({
			// 	next: (id) => (comment.id = id),
			// 	error: (err) => {
			// 		this.errorLogger.logError(err, 'Failed to add comment');
			// 		this.task.comments = this.task.comments.filter(
			// 			(c) => !c.id && c.message === message,
			// 		);
			// 	},
			// });
		// }
    throw new Error('not implemented yet')
	}
}
