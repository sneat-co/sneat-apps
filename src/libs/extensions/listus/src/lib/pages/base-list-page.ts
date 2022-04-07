//tslint:disable:no-unsafe-any
import { ActivatedRoute } from '@angular/router';
import { IMovie } from '@sneat/dto';
import { TeamComponentBaseParams, TeamItemBaseComponent } from '@sneat/team/components';
import { IListContext } from '@sneat/team/models';
import { Subscription } from 'rxjs';
import { ListusComponentBaseParams } from '../listus-component-base-params';
import { ListService } from '../services/list.service';

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
		this.trackListIdFromUrl();
	}

	public get listService() {
		return this.params.listService;
	}

	public setList(list: IListContext): void {
		console.log('BaseListPage.setListDto()', list);
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

	protected subscribeForListChanges(id: string): void {
		console.log(`BaseListPage.subscribeForListChanges(${id})`);
		if (this.listSubscription) {
			this.errorLogger.logError('got duplicate attempt to subscribe to list changes');
			return;
		}
		this.listService.watchListById(id).pipe(
			this.takeUntilNeeded(),
		).subscribe({
			next: list => this.setList(list),
			error: this.errorLogger.logError,
		});
	}

	private trackListIdFromUrl(): void {
		try {
			this.route?.paramMap
				.pipe(this.takeUntilNeeded())
				.subscribe(params => {
					const id = params.get('listID');
					if (!id) {
						this.listSubscription?.unsubscribe();
						this.listSubscription = undefined;
						return;
					}
					if (this.list?.id != id) {
						this.listSubscription?.unsubscribe();
						this.listSubscription = undefined;
						this.list = { id };
						this.subscribeForListChanges(id);
					}
				});
		} catch (e) {
			console.error('BaseListPage.ngOnInit():', e);
		}
	}
}
