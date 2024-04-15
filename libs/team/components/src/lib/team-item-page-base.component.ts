import { ActivatedRoute, ParamMap } from '@angular/router';
import { INavContext, TeamItem } from '@sneat/core';
import { ModuleTeamItemService } from '@sneat/team-services';
import { distinctUntilChanged, map, Observable, Subscription, tap } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TeamPageBaseComponent } from './team-page-base-component';
import { TeamComponentBaseParams } from './team-component-base-params';

// type watchByIdFunc<Brief, Dto> = (params: ParamMap, itemId: string, teamId?: string) => Observable<INavContext<Brief, Dto>>;

export abstract class TeamItemPageBaseComponent<
	Brief,
	Dto extends Brief,
> extends TeamPageBaseComponent {
	protected item?: INavContext<Brief, Dto>;

	protected constructor(
		className: string,
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		defaultBackPage: string,
		private readonly itemName: TeamItem,
		protected readonly teamItemService: ModuleTeamItemService<Brief, Dto>,
	) {
		super(className, route, teamParams);
		this.defaultBackPage = defaultBackPage;
		const item = window.history.state[itemName] as INavContext<Brief, Dto>;
		if (item) {
			this.setItemContext(item);
		}
		this.trackRouteParamMap(route.paramMap.pipe(this.takeUntilNeeded()));
	}

	protected setItemContext(item?: INavContext<Brief, Dto>): void {
		console.log('TeamItemBaseComponent.setItemContext()', item, {
			...this.item,
		});
		if (item && this.item?.id === item?.id) {
			this.item = {
				id: item.id,
				brief: item.brief || item.dto || this.item.brief,
				dto: item.dto || this.item.dto,
			};
		} else {
			this.item = item;
		}
	}

	protected abstract briefs(): Readonly<Record<string, Brief>> | undefined;

	private itemSubscription?: Subscription;

	// Caller of this method will track changing of team & item IDs in route and close observable
	protected abstract watchItemChanges(): Observable<INavContext<Brief, Dto>>;

	protected override trackRouteParamMap(paramMap$: Observable<ParamMap>): void {
		super.trackRouteParamMap(paramMap$);
		this.trackRouteParamItemID(paramMap$);
	}

	private trackRouteParamItemID(paramMap$: Observable<ParamMap>): void {
		const itemIdParam = paramMap$.pipe(
			map((params) => params.get(this.itemName + 'ID') || ''),
			distinctUntilChanged(),
		);

		itemIdParam.subscribe({
			next: (itemID) => {
				if (itemID) {
					const item = this.item;
					if (item?.id !== itemID || !this.itemSubscription) {
						this.setItemContext({ ...item, id: itemID });
						this.setBriefFromTeam(itemID);
						this.itemSubscription?.unsubscribe();
						this.itemSubscription = this.watchItemChanges()
							.pipe(
								this.takeUntilNeeded(),
								takeUntil(this.teamIDChanged$),
								tap((item) => console.log('watchItemChanges() => item:', item)),
							)
							.subscribe({
								next: (item) => {
									this.setItemContext(item);
								},
								error: (err) => this.logError(err, 'failed to get item by ID'),
							});
					}
				} else {
					this.setItemContext(undefined);
				}
			},
			error: (err) => this.logError(err, 'failed to get paramMap'),
		});
	}

	private setBriefFromTeam(id: string): void {
		if (this.item?.brief) {
			const briefs = this.briefs();
			if (briefs) {
				const brief = briefs[id];
				if (brief) {
					const item = this.item;
					this.setItemContext({ ...item, brief });
				}
			}
		}
	}
}
