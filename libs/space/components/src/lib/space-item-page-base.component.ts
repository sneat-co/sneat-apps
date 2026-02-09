import { computed, signal } from '@angular/core';
import { ParamMap } from '@angular/router';
import { INavContext, SpaceItem } from '@sneat/core';
import { ISpaceItemNavContext } from '@sneat/space-models';
import { ModuleSpaceItemService } from '@sneat/space-services';
import {
	distinctUntilChanged,
	filter,
	map,
	Observable,
	Subject,
	Subscription,
	tap,
	throwError,
} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SpacePageBaseComponent } from './space-page-base-component.service';

// type watchByIdFunc<Brief, Dto> = (params: ParamMap, itemId: string, teamId?: string) => Observable<INavContext<Brief, Dto>>;

export abstract class SpaceItemPageBaseComponent<
	Brief,
	Dbo extends Brief,
> extends SpacePageBaseComponent {
	// protected item?: INavContext<Brief, Dbo>;
	protected readonly $item = signal<ISpaceItemNavContext<Brief, Dbo>>({
		id: '',
		space: { id: '' },
	});

	protected readonly $itemID = computed(() => this.$item()?.id);

	protected constructor(
		defaultBackPage: string,
		private readonly itemName: SpaceItem,
		protected readonly spaceItemService: ModuleSpaceItemService<Brief, Dbo>,
	) {
		super();
		this.defaultBackPage = defaultBackPage;
		const item = window.history.state?.[itemName] as ISpaceItemNavContext<
			Brief,
			Dbo
		>;
		if (item) {
			this.setItemContext(item);
		}
	}

	protected setItemContext(item?: ISpaceItemNavContext<Brief, Dbo>): void {
		console.log(
			`${this.className}.SpaceItemBaseComponent.setItemContext(itemID=${item?.id})`,
			item,
			{
				...this.$item(),
			},
		);
		const prevItem = this.$item();
		if (item && prevItem?.id === item?.id && item !== prevItem) {
			item = {
				id: item.id,
				space: this.$space() || { id: '' },
				brief: item.brief || item.dbo || prevItem.brief,
				dbo: item.dbo || prevItem.dbo,
			};
		}
		this.$item.set(item || { id: '', space: { id: '' } });
	}

	protected abstract briefs(): Readonly<Record<string, Brief>> | undefined;

	private itemSubscription?: Subscription;

	// Caller of this method will track changing of team & item IDs in route and close observable
	protected watchItemChanges(): Observable<INavContext<Brief, Dbo>> {
		console.log('SpaceItemBaseComponent.watchItemChanges()', this.itemName);
		const itemID = this.$itemID();
		if (!itemID) {
			throw throwError(() => 'no item ID');
		}
		const space = this.$space();
		return this.spaceItemService.watchSpaceItemByIdWithSpaceRef(space, itemID);
	}

	protected override trackRouteParamMap(paramMap$: Observable<ParamMap>): void {
		super.trackRouteParamMap(paramMap$);
		this.trackRouteParamItemID(paramMap$);
	}

	protected trackRouteParamItemID(paramMap$: Observable<ParamMap>): void {
		console.log(
			'SpaceItemBaseComponent.trackRouteParamItemID()',
			this.itemName,
		);
		if (!this.itemName) {
			return;
		}
		// Direct call like that does not work as are unsubscribing from observable once item ID changed
		// this.trackItem(this.getItemID$(paramMap$).pipe(distinctUntilChanged()));
		const itemID$ = new Subject<string>();
		itemID$
			.asObservable()
			.pipe(
				tap((itemID) => console.log(`itemID$ changed to "${itemID}"`)),
				this.takeUntilDestroyed(),
			)
			.subscribe({
				next: (itemID) => this.onItemIDChanged(itemID, itemID$),
				error: (err) => this.logError(err, 'failed to get paramMap'),
			});
		this.getItemID$(paramMap$)
			.pipe(
				// tap((itemID) => console.log('itemID$ pre-distinct:', itemID)),
				distinctUntilChanged(),
				// tap((itemID) => console.log('itemID$ post-distinct:', itemID)),
			)
			.subscribe(itemID$);
	}

	protected getItemID$(paramMap$: Observable<ParamMap>): Observable<string> {
		return paramMap$.pipe(
			map((params) => params.get(this.itemName + 'ID') || ''),
		);
	}

	private onItemIDChanged(itemID: string, itemID$: Observable<string>): void {
		console.log('SpaceItemBaseComponent.onItemIDChanged()', itemID);
		if (!itemID) {
			this.setItemContext(undefined);
			return;
		}
		const item = this.$item();

		if (item?.id !== itemID || !this.itemSubscription) {
			const space = this.$space();
			this.setItemContext({ ...item, id: itemID, space });
			this.setBriefFromSpace(itemID);
			this.itemSubscription?.unsubscribe();
			this.itemSubscription = this.watchItemChanges()
				.pipe(
					this.takeUntilDestroyed(),
					takeUntil(
						this.spaceIDChanged$.pipe(
							// TODO: the below filter is a workaround for a bug in our implementation
							filter((spaceID) => spaceID !== space.id),
							tap((spaceID) =>
								console.log(
									`cancelling item subscription as spaceID changed to "${spaceID}"`,
								),
							),
						),
					),
					takeUntil(
						itemID$.pipe(
							tap((itemID) =>
								console.log(
									`cancelling item subscription as itemID changed to "${itemID}"`,
								),
							),
						),
					),
					tap((item) => console.log('watchItemChanges() => item:', item)),
				)
				.subscribe({
					next: (item) => {
						const currentSpaceRef = this.$spaceRef();
						if (currentSpaceRef?.id == space.id) {
							this.setItemContext({
								...item,
								space: currentSpaceRef.type ? currentSpaceRef : space,
							});
						}
					},
					error: (err) => this.logError(err, 'failed to get item by ID'),
				});
		}
	}

	private setBriefFromSpace(id: string): void {
		const item = this.$item();
		if (item && !item.brief) {
			const briefs = this.briefs();
			if (briefs) {
				const brief = briefs[id];
				if (brief) {
					console.log('setItemContext from brief', brief);
					this.setItemContext({ ...item, brief });
				}
			}
		}
	}
}
