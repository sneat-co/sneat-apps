import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getMeetingIdFromDate } from '../../../services/meeting.service';

export interface IRetroQuestion {
	id: string;
	title: string;
}

@Component({
	selector: 'app-retro-my-feedback',
	templateUrl: './retro-my-feedback.page.html',
	styleUrls: ['./retro-my-feedback.page.scss'],
})
export class RetroMyFeedbackPage {
	teamId: string;
	retroId: string;

	questions: IRetroQuestion[] = [
		{ id: 'good', title: 'What went well?' },
		{ id: 'bad', title: 'What went bad?' },
		{ id: 'ideas', title: 'What to improve?' },
	];

	constructor(
		route: ActivatedRoute
		// private navService: NavService,
	) {
		this.teamId = route.snapshot.queryParamMap.get('team');
		this.retroId = getMeetingIdFromDate(new Date());
	}

	trackById = (i: number, item: { id: string }) => item.id;

	public goRetroReview(): void {
		// this.navService.navigateToRetroReview('today', {id: this.teamId});
	}
}
