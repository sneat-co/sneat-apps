import { ParamMap } from '@angular/router';
import { emptyTimestamp } from '@sneat/dto';
import { SpaceItemPageBaseComponent } from '@sneat/team-components';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IListContext } from '../contexts';
import { IListBrief, IListDbo, IMovie, ListType } from '../dto';
import { ListusComponentBaseParams } from '../listus-component-base-params';

export abstract class BaseListPage extends SpaceItemPageBaseComponent<
	IListBrief,
	IListDbo
> {
	protected list?: IListContext;
	protected listGroupTitle?: string;
	protected listID?: string;
	protected listType?: ListType;

	protected constructor(
		className: string,
		// defaultBackPage: DefaultBackPage,
		protected readonly params: ListusComponentBaseParams,
	) {
		super(className, 'lists', 'list', params.listService);
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
		return {}; // TODO: implement
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
		if (!this.space) {
			this.errorLogger.logError('not able to navigate without team context');
			return;
		}
		const url = `space/${this.space.id}`;
		this.spaceParams.spaceNavService
			.navigateForwardToSpacePage(this.space, url, {
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
						space: this.space,
					});
				}

				return `${this.listType}!${this.listID}`;
			}),
		);
	}
}
