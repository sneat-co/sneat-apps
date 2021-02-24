/* eslint-disable @typescript-eslint/naming-convention */
import {ChangeDetectorRef, Component, Inject} from '@angular/core';
import {IRetroItem, IRetrospective, RetrospectiveStage} from '../../../models/interfaces';
import {ChildrenSizeMode, IDndTreeSpec, IDraggedTreeItem} from '@angular-dnd/tree';
import {BaseTeamPageDirective} from '../../../pages/base-team-page-directive';
import {ActivatedRoute} from '@angular/router';
import {IErrorLogger, ErrorLogger} from '@sneat-team/ui-core';
import {NavController} from '@ionic/angular';
import {TeamService} from '../../../services/team.service';
import {RetrospectiveService} from '../../retrospective.service';
import {takeUntil} from 'rxjs/operators';
import {TeamContextService} from '../../../services/team-context.service';
import {UserService} from '../../../services/user-service';
import {getMeetingIdFromDate} from '../../../services/meeting.service';

@Component({
	selector: 'app-retro-tree',
	templateUrl: './retro-tree.page.html',
	styleUrls: ['./retro-tree.page.scss'],
})
export class RetroTreePage extends BaseTeamPageDirective {

	public meetingId: string;
	public retrospective: IRetrospective;

	public treeSpec: IDndTreeSpec<IRetroItem> = {
		itemId: item => item.ID,
		getChildItems: item => item.children,
		autoExpand: () => true, /*node => {
			const result = node.data.id !== 'doing';
			// console.log('autoExpand', node.data.id, result);
			return result;
		},*/
		maxDepth: 2,
		childrenCount: item => item?.children.length || 0,
		childrenSize: node => node.level >= 1 ? ChildrenSizeMode.fixed : ChildrenSizeMode.flexible,
	};

	public readonly positive: IRetroItem = {
		ID: 'positive',
		title: 'Positives',
		children: [
			{
				ID: 'todo',
				title: 'ToDo',
				children: [
					{ID: 'spanish', title: 'Learn Spanish'},
					{ID: 'guitar', title: 'Play guitar'},
					{ID: 'kite-surfing', title: 'Kite-surf'},
					{ID: 'sleep-mode', title: 'Sleep more'},
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
					{ID: 'CI', title: 'CI'},
					{ID: 'CD', title: 'CD'},
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
					{ID: 'CI', title: 'CI'},
					{ID: 'CD', title: 'CD'},
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
		readonly teamContextService: TeamContextService,
		readonly userService: UserService,
		private retrospectiveService: RetrospectiveService,

	) {
		super(changeDetectorRef, route, errorLogger, navController, teamService, teamContextService, userService);
		this.trackTeamIdFromUrl();
		route.queryParamMap.subscribe(queryParams => {
			this.meetingId = queryParams.get('date');
			if (this.meetingId === 'today') {
				this.meetingId = getMeetingIdFromDate(new Date());
			}
			if (!this.team) {
				return;
			}
			// TODO: Make this call after team decided
			this.retrospectiveService.watchRetro(this.team.id, this.meetingId)
				.pipe(takeUntil(this.destroyed.asObservable())) // TODO(StackOverflow): Do we need .asObservable() here?
				.subscribe({
					next: retrospective => {
						this.retrospective = retrospective;
					}
				})
		})
	}

	public itemMoved(item: IDraggedTreeItem<IRetroItem>): void {
		console.log(`itemMoved: ${item.node.id}`, item.dropTo);
	}

	public isAllowedToAddItems(): boolean {
		if (!this.retrospective) {
			return false;
		}
		const {stage} = this.retrospective;
		return stage === RetrospectiveStage.review || stage === RetrospectiveStage.feedback;
	}
}
