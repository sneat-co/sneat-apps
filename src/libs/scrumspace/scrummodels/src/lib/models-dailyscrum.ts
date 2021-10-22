import { IBy, MemberRole } from '@sneat/team-models';
import { Modified } from '@sneat/data';
import { IAvatar } from '@sneat/auth-models';
import { IMeeting } from '@sneat/meeting';

export type TaskType = 'done' | 'risk' | 'todo' | 'plan' | 'qna' | 'kudos';

export interface IScrum extends IMeeting {
	// Key as: YYYY-MM-DD
	scrumIds?: {
		prev?: string; // 'YYYY-MM-DD'
		next?: string; // 'YYYY-MM-DD'
	};
	readonly risksCount?: number;
	readonly questionsCount?: number;
	statuses: IStatus[];
}

export interface IStatus {
	member: IScrumStatusMember;
	byType: {
		plan?: ITask[]; // For now for UI only
		done?: ITask[];
		todo?: ITask[];
		risk?: ITask[];
		qna?: IQuestion[];
		kudos?: ITask[];
	}; // TODO: consider mapped object type
}

export interface IScrumStatusMember {
	id: string;
	roles?: MemberRole[];
	title: string;
	avatar?: IAvatar;
}

interface IQuestion extends ITask {
	isAnswered?: boolean;
	isAnswerAccepted?: boolean;
}

export interface ITask {
	id: string;
	title: string;
	by?: IBy;
	progress?: number;
	added?: Modified;
	thumbUps?: string[];
	lastModified?: Modified;
	comments?: ITaskComment[];
}

export interface ITaskComment {
	id: string;
	by: IBy;
	message: string;
}
