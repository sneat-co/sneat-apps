import { ActivatedRoute } from '@angular/router';
import { INavContext } from '@sneat/core';
import { Observable, Subscription } from 'rxjs';
import { TeamBaseComponent } from './team-base.component';
import { TeamComponentBaseParams } from './team-component-base-params';

type watchByIdFunc<Brief, Dto> = (itemId: string, teamId?: string) => Observable<INavContext<Brief, Dto>>;

export abstract class TeamItemBaseComponent<Brief extends { id: string }, Dto> extends TeamBaseComponent {

	protected constructor(
		className: string,
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		defaultBackPage: string,
		private readonly itemName: string,
		watchById?: watchByIdFunc<Brief, Dto>,
	) {
		super(className, route, teamParams);
		this.defaultBackPage = defaultBackPage;
		this.setItemContext(window.history.state[itemName] as INavContext<Brief, Dto>);
		this.trackItemID(watchById);
	}


	protected abstract setItemContext(item?: INavContext<Brief, Dto>): void;

	protected abstract get item(): INavContext<Brief, Dto> | undefined;

	protected abstract briefs(): Brief[] | undefined;

	private itemSubscription?: Subscription;

	trackItemID(watchById?: watchByIdFunc<Brief, Dto>): void {
		this.route.paramMap
			.pipe(this.takeUntilNeeded())
			.subscribe({
				next: params => {
					const itemID = params.get(this.itemName + 'ID');
					// const teamID = params.get('teamID');
					if (itemID) {
						const item = this.item;
						if (item?.id !== itemID) {
							this.setItemContext({ ...item, id: itemID });
							this.setBriefFromTeam(itemID);
							if (this.itemSubscription) {
								this.itemSubscription.unsubscribe();
							}
							if (watchById) {
								this.itemSubscription = watchById(this.team?.id, itemID)
									.pipe(this.takeUntilNeeded())
									.subscribe({
										next: item => {
											this.setItemContext(item);
										},
										error: err => this.logError(err, 'failed to get item by ID')
									});
							}
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
				const brief = briefs.find(b => b.id === id);
				if (brief) {
					const item = this.item;
					this.setItemContext({ ...item, brief });
				}
			}
		}
	}

}
