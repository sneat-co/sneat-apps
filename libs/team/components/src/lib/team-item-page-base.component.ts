import { ActivatedRoute, ParamMap } from '@angular/router';
import { INavContext, TeamItem } from '@sneat/core';
import { ModuleTeamItemService } from '@sneat/team/services';
import { Observable, Subscription, tap } from 'rxjs';
import { TeamPageBaseComponent } from './team-page-base-component.service';
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
		private readonly teamItemService: ModuleTeamItemService<Brief, Dto>,
	) {
		super(className, route, teamParams);
		this.defaultBackPage = defaultBackPage;
		const item = window.history.state[itemName] as INavContext<Brief, Dto>;
		if (item) {
			this.setItemContext(item);
		}
		this.trackUrlParams();
	}

	protected setItemContext(item?: INavContext<Brief, Dto>): void {
		console.log('TeamItemBaseComponent/setItemContext', item);
		this.item = item;
	}

	protected abstract briefs(): Readonly<{ [id: string]: Brief }> | undefined;

	private itemSubscription?: Subscription;

	protected abstract onRouteParamsChanged(
		params: ParamMap,
		itemID?: string,
		teamID?: string,
	): void;

	protected abstract watchItemChanges(): Observable<INavContext<Brief, Dto>>;

	private trackUrlParams(): void {
		this.route.paramMap.pipe(this.takeUntilNeeded()).subscribe({
			next: (params) => {
				const itemID = params.get(this.itemName + 'ID') || undefined;
				const teamID = params.get('teamID') || this.team?.id;
				this.onRouteParamsChanged(params, itemID, teamID);
				if (itemID) {
					const item = this.item;
					if (item?.id !== itemID || !this.itemSubscription) {
						this.setItemContext({ ...item, id: itemID });
						this.setBriefFromTeam(itemID);
						this.itemSubscription?.unsubscribe();
						this.onRouteParamsChanged(params, itemID, teamID);
						this.itemSubscription = this.watchItemChanges()
							.pipe(
								this.takeUntilNeeded(),
								tap((item) => console.log('watchItemChanges', item)),
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

	setBriefFromTeam(id: string): void {
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
