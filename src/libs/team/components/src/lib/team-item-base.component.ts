import { ActivatedRoute, ParamMap } from '@angular/router';
import { INavContext, TeamItem } from '@sneat/core';
import { Observable, Subscription } from 'rxjs';
import { TeamBaseComponent } from './team-base.component';
import { TeamComponentBaseParams } from './team-component-base-params';

// type watchByIdFunc<Brief, Dto> = (params: ParamMap, itemId: string, teamId?: string) => Observable<INavContext<Brief, Dto>>;

export abstract class TeamItemBaseComponent<Brief, Dto extends Brief> extends TeamBaseComponent {

	protected constructor(
		className: string,
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		defaultBackPage: string,
		private readonly itemName: TeamItem,
	) {
		super(className, route, teamParams);
		this.defaultBackPage = defaultBackPage;
		this.setItemContext(window.history.state[itemName] as INavContext<Brief, Dto>);
		this.trackUrlParams();
	}


	protected abstract setItemContext(item?: INavContext<Brief, Dto>): void;

	protected abstract get item(): INavContext<Brief, Dto> | undefined;

	protected abstract briefs(): { [id: string]: Brief } | undefined;

	private itemSubscription?: Subscription;

	protected abstract onRouteParamsChanged(params: ParamMap, itemID?: string, teamID?: string): void;

	protected abstract watchItemChanges(): Observable<INavContext<Brief, Dto>>;

	private trackUrlParams(): void {
		this.route.paramMap
			.pipe(this.takeUntilNeeded())
			.subscribe({
				next: params => {
					const itemID = params.get(this.itemName + 'ID') || undefined;
					const teamID = params.get('teamID') || this.team?.id;
					this.onRouteParamsChanged(params, itemID, teamID);
					if (itemID) {
						const item = this.item;
						if (item?.id !== itemID) {
							this.setItemContext({ ...item, id: itemID });
							this.setBriefFromTeam(itemID);
							if (this.itemSubscription) {
								this.itemSubscription.unsubscribe();
							}
							this.onRouteParamsChanged(params, itemID, teamID);
							this.itemSubscription = this.watchItemChanges()
								.pipe(this.takeUntilNeeded())
								.subscribe({
									next: item => {
										this.setItemContext(item);
									},
									error: err => this.logError(err, 'failed to get item by ID'),
								});
						}
					} else {
						this.setItemContext(undefined);
					}

				},
				error: err => this.logError(err, 'failed to get paramMap'),
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
