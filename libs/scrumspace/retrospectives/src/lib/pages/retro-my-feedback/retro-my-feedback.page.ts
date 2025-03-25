import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getMeetingIdFromDate } from '@sneat/ext-meeting';

export interface IRetroQuestion {
	id: string;
	title: string;
}

@Component({
	selector: 'sneat-retro-my-feedback',
	templateUrl: './retro-my-feedback.page.html',
	styleUrls: ['./retro-my-feedback.page.scss'],
	standalone: false,
})
export class RetroMyFeedbackPageComponent {
	spaceID: string;
	retroId: string;

	questions: IRetroQuestion[] = [
		{ id: 'good', title: 'What went well?' },
		{ id: 'bad', title: 'What went bad?' },
		{ id: 'ideas', title: 'What to improve?' },
	];

	constructor(
		route: ActivatedRoute,
		// private navService: NavService,
	) {
		this.spaceID = route.snapshot.queryParamMap.get('space');
		this.retroId = getMeetingIdFromDate(new Date());
	}

	trackById = (i: number, item: { id: string }) => item.id;

	public goRetroReview(): void {
		// this.navService.navigateToRetroReview('today', {id: this.teamId});
	}
}
