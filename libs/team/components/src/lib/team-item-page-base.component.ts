import { ActivatedRoute, ParamMap } from '@angular/router';
import { INavContext, TeamItem } from '@sneat/core';
import { ModuleSpaceItemService } from '@sneat/team-services';
import {
	distinctUntilChanged,
	map,
	Observable,
	Subject,
	Subscription,
	tap,
	throwError,
} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TeamPageBaseComponent } from './team-page-base-component';
import { TeamComponentBaseParams } from './team-component-base-params';

// type watchByIdFunc<Brief, Dto> = (params: ParamMap, itemId: string, teamId?: string) => Observable<INavContext<Brief, Dto>>;

export abstract class TeamItemPageBaseComponent<
	Brief,
	Dbo extends Brief,
> extends TeamPageBaseComponent {
	protected item?: INavContext<Brief, Dbo>;

	protected constructor(
		className: string,
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		defaultBackPage: string,
		private readonly itemName: TeamItem,
		protected readonly teamItemService: ModuleSpaceItemService<Brief, Dbo>,
	) {
		super(className, route, teamParams);
		this.defaultBackPage = defaultBackPage;
		const item = window.history.state[itemName] as INavContext<Brief, Dbo>;
		if (item) {
			this.setItemContext(item);
		}
	}

	protected setItemContext(item?: INavContext<Brief, Dbo>): void {
		console.log('TeamItemBaseComponent.setItemContext()', item, {
			...this.item,
		});
		if (item && this.item?.id === item?.id) {
			this.item = {
				id: item.id,
				brief: item.brief || item.dbo || this.item.brief,
				dbo: item.dbo || this.item.dbo,
			};
		} else {
			this.item = item;
		}
	}

	protected abstract briefs(): Readonly<Record<string, Brief>> | undefined;

	private itemSubscription?: Subscription;

	// Caller of this method will track changing of team & item IDs in route and close observable
	protected watchItemChanges(): Observable<INavContext<Brief, Dbo>> {
		console.log('TeamItemBaseComponent.watchItemChanges()', this.itemName);
		const itemID = this.item?.id;
		if (!itemID) {
			throw throwError(() => 'no item ID');
		}
		return this.teamItemService.watchTeamItemByIdWithTeamRef(
			this.space,
			itemID,
		);
	}

	protected override trackRouteParamMap(paramMap$: Observable<ParamMap>): void {
		super.trackRouteParamMap(paramMap$);
		this.trackRouteParamItemID(paramMap$);
	}

	protected trackRouteParamItemID(paramMap$: Observable<ParamMap>): void {
		console.log('TeamItemBaseComponent.trackRouteParamItemID()', this.itemName);
		if (!this.itemName) {
			return;
		}
		// Direct call like that does not work as are unsubscribing from observable once item ID changed
		// this.trackItem(this.getItemID$(paramMap$).pipe(distinctUntilChanged()));
		const itemID$ = new Subject<string>();
		this.trackItem(
			// This need to be BEFORE call to this.getItemID$()
			itemID$
				.asObservable()
				.pipe(tap((itemID) => console.log('itemID$ changed', itemID))),
		);
		this.getItemID$(paramMap$)
			.pipe(
				tap((itemID) => console.log('itemID$ pre-distinct:', itemID)),
				distinctUntilChanged(),
				tap((itemID) => console.log('itemID$ post-distinct:', itemID)),
			)
			.subscribe(itemID$);
	}

	protected getItemID$(paramMap$: Observable<ParamMap>): Observable<string> {
		return paramMap$.pipe(
			map((params) => params.get(this.itemName + 'ID') || ''),
		);
	}

	// Do not make it protected as itemID$ needs to be carefully wrapped by a Subject
	private trackItem(itemID$: Observable<string>): void {
		console.log('trackItem(), itemID$:', this.itemName, itemID$);
		itemID$.subscribe({
			next: (itemID) => this.onItemIDChanged(itemID, itemID$),
			error: (err) => this.logError(err, 'failed to get paramMap'),
		});
	}

	private onItemIDChanged(itemID: string, itemID$: Observable<string>): void {
		console.log('TeamItemBaseComponent.onItemIDChanged()', itemID);
		if (!itemID) {
			this.setItemContext(undefined);
			return;
		}
		const item = this.item;
		if (item?.id !== itemID || !this.itemSubscription) {
			this.setItemContext({ ...item, id: itemID });
			this.setBriefFromTeam(itemID);
			this.itemSubscription?.unsubscribe();
			this.itemSubscription = this.watchItemChanges()
				.pipe(
					this.takeUntilNeeded(),
					takeUntil(
						this.teamIDChanged$.pipe(
							tap((teamID) =>
								console.log(
									'cancelling item subscription as teamID changed to:',
									teamID,
								),
							),
						),
					),
					takeUntil(
						itemID$.pipe(
							tap((itemID) =>
								console.log(
									'cancelling item subscription as itemID changed to:',
									itemID,
								),
							),
						),
					),
					tap((item) => console.log('watchItemChanges() => item:', item)),
				)
				.subscribe({
					next: (item) => {
						this.setItemContext(item);
					},
					error: (err) => this.logError(err, 'failed to get item by ID'),
				});
		}
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
