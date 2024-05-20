import { ActivatedRoute, ParamMap } from '@angular/router';
import { INavContext } from '@sneat/core';
import { emptyTimestamp } from '@sneat/dto';
import { IListBrief, IListDto, IMovie, ListType } from '../dto';
import { IListContext } from '../contexts';
import { TeamItemPageBaseComponent } from '@sneat/team-components';
import { ITeamContext } from '@sneat/team-models';
import { NEVER, Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ListusComponentBaseParams } from '../listus-component-base-params';

export abstract class BaseListPage extends TeamItemPageBaseComponent<
	IListBrief,
	IListDto
> {
	protected list?: IListContext;
	protected listGroupTitle?: string;
	protected listID?: string;
	protected listType?: ListType;

	protected constructor(
		className: string,
		// defaultBackPage: DefaultBackPage,
		route: ActivatedRoute,
		protected readonly params: ListusComponentBaseParams,
	) {
		super(
			className,
			route,
			params.teamParams,
			'lists',
			'list',
			params.listService,
		);
	}

	protected override setItemContext(item: IListContext): void {
		console.log('BaseListPage.setItemContext()', item);
		if (item && !item?.type) {
			item = { ...item, type: item.id.split('!')[0] as ListType };
		}
		super.setItemContext(item);
		if (item) {
			this.setList(item);
		}
	}

	protected override briefs():
		| Readonly<Record<string, IListBrief>>
		| undefined {
		throw new Error('not implemented due to refactoring');
		// const briefs: IListBrief[] = [];
		// this.team?.dto?.listGroups?.forEach(lg => {
		// 	lg.lists?.forEach(l => briefs.push({id: l.id}));
		// });
		// return briefs;
	}

	protected get listService() {
		return this.params.listService;
	}

	protected setList(list: IListContext): void {
		console.log('BaseListPage.setList()', list, 'this.list:', this.list);
		if (!list.brief && list.id == this.list?.id && this.list.brief) {
			list = { ...list, brief: this.list.brief };
			console.log('BaseListPage.setList() => new this.list:', list);
		}
		this.list = list;
	}

	protected goMoviePage(movie: IMovie): void {
		console.log('goMoviePage', movie);
		if (!this.list) {
			this.errorLogger.logError('not able to navigate without list context');
		}
		if (!this.team) {
			this.errorLogger.logError('not able to navigate without team context');
			return;
		}
		const url = `space/${this.team.id}`;
		this.teamParams.teamNavService
			.navigateForwardToTeamPage(this.team, url, {
				state: {
					list: this.list,
					listItem: movie,
				},
			})
			.catch(this.errorLogger.logError);
	}

	override getItemID$(paramMap$: Observable<ParamMap>): Observable<string> {
		return paramMap$.pipe(
			map((params) => {
				this.listID = params.get('listID') || undefined;
				this.listType = params.get('listType') as ListType;

				if (this.listID && this.listType) {
					const title =
						this.listID.charAt(0).toUpperCase() + this.listID.slice(1);
					this.setList({
						id: this.listID,
						type: this.listType,
						brief: {
							createdAt: emptyTimestamp,
							createdBy: '',
							type: this.listType,
							title,
						},
						team: this.team,
					});
				}

				return `${this.listType}!${this.listID}`;
			}),
		);
	}
}
