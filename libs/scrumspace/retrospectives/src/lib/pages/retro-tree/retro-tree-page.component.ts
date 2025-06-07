import { ChangeDetectorRef, Component, inject } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import {
	NavController,
	IonBackButton,
	IonCard,
	IonCol,
	IonContent,
	IonHeader,
	IonRow,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { AddRetroItemComponent } from '../../components/add-retro-item/add-retro-item.component';
import { RetrospectiveService } from '../../retrospective.service';
import { takeUntil } from 'rxjs/operators';
import { SpaceBaseComponent } from '@sneat/space-components';
import {
	IRetroItem,
	IRetrospective,
	RetrospectiveStage,
} from '@sneat/ext-scrumspace-scrummodels';
import { SpaceService } from '@sneat/space-services';
import { SneatUserService } from '@sneat/auth-core';
import { getMeetingIdFromDate } from '@sneat/ext-meeting';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

@Component({
	selector: 'sneat-retro-tree',
	templateUrl: './retro-tree-page.component.html',
	styleUrls: ['./retro-tree-page.component.scss'],
	imports: [
		IonHeader,
		IonToolbar,
		IonBackButton,
		IonTitle,
		IonContent,
		IonRow,
		IonCol,
		IonCard,
		AddRetroItemComponent,
	],
})
export class RetroTreePageComponent extends SpaceBaseComponent {
	readonly changeDetectorRef: ChangeDetectorRef;
	readonly route: ActivatedRoute;
	readonly errorLogger: IErrorLogger;
	readonly navController: NavController;
	readonly spaceService: SpaceService;
	readonly userService: SneatUserService;
	private retrospectiveService = inject(RetrospectiveService);

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

	constructor() {
		const changeDetectorRef = inject(ChangeDetectorRef);
		const route = inject(ActivatedRoute);
		const errorLogger = inject<IErrorLogger>(ErrorLogger);
		const navController = inject(NavController);
		const spaceService = inject(SpaceService);
		const userService = inject(SneatUserService);

		super(
			changeDetectorRef,
			route,
			errorLogger,
			navController,
			spaceService,
			userService,
		);
		this.changeDetectorRef = changeDetectorRef;
		this.route = route;
		this.errorLogger = errorLogger;
		this.navController = navController;
		this.spaceService = spaceService;
		this.userService = userService;

		route.queryParamMap.subscribe((queryParams) => {
			this.meetingId = queryParams.get('date');
			if (this.meetingId === 'today') {
				this.meetingId = getMeetingIdFromDate(new Date());
			}
			if (!this.space) {
				return;
			}
			// TODO: Make this call after team decided
			this.retrospectiveService
				.watchRetro(this.space.id, this.meetingId)
				.pipe(takeUntil(this.destroyed$.asObservable())) // TODO(StackOverflow): Do we need .asObservable() here?
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
