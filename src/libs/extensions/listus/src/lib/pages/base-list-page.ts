//tslint:disable:no-unsafe-any
import { ActivatedRoute } from '@angular/router';
import { IMovie, ListType } from '@sneat/dto';
import { TeamItemBaseComponent } from '@sneat/team/components';
import { IListContext } from '@sneat/team/models';
import { Subscription } from 'rxjs';
import { ListusComponentBaseParams } from '../listus-component-base-params';

export abstract class BaseListPage extends TeamItemBaseComponent {

	public list?: IListContext;
	public listGroupTitle?: string;
	protected listSubscription?: Subscription;

	protected constructor(
		className: string,
		// defaultBackPage: DefaultBackPage,
		route: ActivatedRoute,
		protected readonly params: ListusComponentBaseParams,
	) {
		super(className, route, params.teamParams, 'lists');
		this.trackListParamsFromUrl();
	}

	public get listService() {
		return this.params.listService;
	}

	public setList(list: IListContext): void {
		console.log('BaseListPage.setList()', list, 'this.list:', this.list);
		if (!list.brief && list.id == this.list?.id && this.list.brief) {
			list = { ...list, brief: this.list.brief };
			console.log('BaseListPage.setList() => new this.list:', list);
		}
		this.list = list;
	}

	goMoviePage(movie: IMovie): void {
		console.log('goMoviePage', movie);
		if (!this.list) {
			this.errorLogger.logError('not able to navigate without list context');
		}
		if (!this.team) {
			this.errorLogger.logError('not able to navigate without team context');
			return;
		}
		const url = `space/${this.team.id}`;
		this.teamParams.teamNavService.navigateForwardToTeamPage(this.team,
			url,
			{
				state: {
					list: this.list,
					listItem: movie,
				},
			},
		).catch(this.errorLogger.logError);
	}

	protected subscribeForListChanges(teamID: string, listType: ListType, listID: string): void {
		console.log(`BaseListPage.subscribeForListChanges(${teamID}, ${listType}, ${listID})`);
		if (this.listSubscription) {
			this.errorLogger.logError('got duplicate attempt to subscribe to list changes');
			return;
		}
		this.listService.watchList(teamID, listType, listID).pipe(
			this.takeUntilNeeded(),
		).subscribe({
			next: list => this.setList(list),
			error: this.errorLogger.logErrorHandler('failed to load list'),
		});
	}

	private trackListParamsFromUrl(): void {
		try {
			this.route?.paramMap
				.pipe(this.takeUntilNeeded())
				.subscribe(params => {
					const id = params.get('listID'),
						type = params.get('listType'),
						teamID = params.get('teamID') || this.team?.id;
					if (!id) {
						this.listSubscription?.unsubscribe();
						this.listSubscription = undefined;
						return;
					}
					if (this.list?.id != id) {
						this.listSubscription?.unsubscribe();
						this.listSubscription = undefined;
						const title = id.charAt(0).toUpperCase() + id.slice(1);
						this.setList({ id, brief: { id, type: type as ListType, title } });
						if (!teamID) {
							throw new Error('no team context');
						}
						if (!this.list?.brief?.type) {
							throw new Error('unknown list type');
						}
						this.subscribeForListChanges(teamID, this.list.brief.type, id);
					}
				});
		} catch (e) {
			this.errorLogger.logError(e, 'trackListParamsFromUrl() failed');
		}
	}
}
