/* eslint-disable @typescript-eslint/naming-convention */
import { ChangeDetectorRef, Component, Inject } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { RetrospectiveService } from '../../retrospective.service';
import { takeUntil } from 'rxjs/operators';
import { TeamBaseComponent } from '@sneat/team-components';
import {
	IRetroItem,
	IRetrospective,
	RetrospectiveStage,
} from '@sneat/scrumspace/scrummodels';
import { TeamService } from '@sneat/team-services';
import { SneatUserService } from '@sneat/auth-core';
import { getMeetingIdFromDate } from '@sneat/meeting';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

@Component({
	selector: 'sneat-retro-tree',
	templateUrl: './retro-tree-page.component.html',
	styleUrls: ['./retro-tree-page.component.scss'],
})
export class RetroTreePageComponent extends TeamBaseComponent {
	public meetingId: string;
	public retrospective: IRetrospective;

	public treeSpec: unknown /*IDndTreeSpec<IRetroItem>*/ = {
		itemId: (item: unknown) => (item as { ID: string }).ID,
		getChildItems: (item: unknown) =>
			(item as { children: unknown[] }).children,
		autoExpand: () => true /*node => {
			const result = node.data.id !== 'doing';
			// console.log('autoExpand', node.data.id, result);
			return result;
		},*/,
		maxDepth: 2,
		childrenCount: (item: { children?: unknown[] }) =>
			item?.children?.length || 0,
		childrenSize: undefined, //(node) => node.level >= 1 ? ChildrenSizeMode.fixed : ChildrenSizeMode.flexible,
	};

	public readonly positive: IRetroItem = {
		ID: 'positive',
		title: 'Positives',
		children: [
			{
				ID: 'todo',
				title: 'ToDo',
				children: [
					{ ID: 'spanish', title: 'Learn Spanish' },
					{ ID: 'guitar', title: 'Play guitar' },
					{ ID: 'kite-surfing', title: 'Kite-surf' },
					{ ID: 'sleep-mode', title: 'Sleep more' },
				],
			},
			{
				ID: 'item1',
				title: 'Item #1',
			},
			{
				ID: 'item2',
				title: 'Item #2',
			},
		],
	};

	public readonly opportunities: IRetroItem = {
		ID: 'opportunities',
		title: 'Opportunities',
		children: [
			{
				ID: 'devOps',
				title: 'DevOps',
				children: [
					{ ID: 'CI', title: 'CI' },
					{ ID: 'CD', title: 'CD' },
				],
			},
		],
	};

	public readonly risks: IRetroItem = {
		ID: 'risks',
		title: 'Risks',
		children: [
			{
				ID: 'devOps',
				title: 'DevOps',
				children: [
					{ ID: 'CI', title: 'CI' },
					{ ID: 'CD', title: 'CD' },
				],
			},
		],
	};

	public readonly kudos: IRetroItem = {
		ID: 'kudos',
		title: 'Kudos',
		children: [
			{
				ID: 'Jack',
				title: 'Jack',
			},
		],
	};

	public readonly categories: IRetroItem[] = [
		this.positive,
		this.opportunities,
		this.risks,
		this.kudos,
	];

	constructor(
		readonly changeDetectorRef: ChangeDetectorRef,
		readonly route: ActivatedRoute,
		@Inject(ErrorLogger) readonly errorLogger: IErrorLogger,
		readonly navController: NavController,
		readonly teamService: TeamService,
		readonly userService: SneatUserService,
		private retrospectiveService: RetrospectiveService,
	) {
		super(
			changeDetectorRef,
			route,
			errorLogger,
			navController,
			teamService,
			userService,
		);
		route.queryParamMap.subscribe((queryParams) => {
			this.meetingId = queryParams.get('date');
			if (this.meetingId === 'today') {
				this.meetingId = getMeetingIdFromDate(new Date());
			}
			if (!this.team) {
				return;
			}
			// TODO: Make this call after team decided
			this.retrospectiveService
				.watchRetro(this.team.id, this.meetingId)
				.pipe(takeUntil(this.destroyed.asObservable())) // TODO(StackOverflow): Do we need .asObservable() here?
				.subscribe({
					next: (retrospective) => {
						this.retrospective = retrospective;
					},
				});
		});
	}

	public itemMoved(item: unknown /*IDraggedTreeItem<IRetroItem>*/): void {
		const itm = item as { node: { id: string }; dropTo: unknown };
		console.log(`itemMoved: ${itm.node?.id}`, itm.dropTo);
	}

	public isAllowedToAddItems(): boolean {
		if (!this.retrospective) {
			return false;
		}
		const { stage } = this.retrospective;
		return (
			stage === RetrospectiveStage.review ||
			stage === RetrospectiveStage.feedback
		);
	}
}
