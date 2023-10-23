//tslint:disable:no-unsafe-any
import { ActivatedRoute, ParamMap } from '@angular/router';
import { IListItemBrief } from '@sneat/dto';
import { IListContext } from '@sneat/team-models';
import { ListusComponentBaseParams } from '../listus-component-base-params';
import { BaseListPage } from './base-list-page';

export abstract class BaseListItemPage extends BaseListPage {
	protected itemId?: string;
	protected listItemInfo?: IListItemBrief;

	protected constructor(
		className: string,
		route: ActivatedRoute,
		params: ListusComponentBaseParams,
		// listService: ListService,
	) {
		super(className, route, params);
		try {
			this.listItemInfo = window.history.state.listItemInfo as IListItemBrief;
			if (this.listItemInfo) {
				this.itemId = this.listItemInfo.id;
				this.onListItemInfoChanged(this.listItemInfo);
			}
			route.queryParamMap.subscribe((queryParams) => {
				const itemId = queryParams.get('item');
				if (itemId !== this.itemId) {
					this.itemId = itemId || undefined;
				}
				this.onQueryParamsChanged(queryParams);
			});
		} catch (e) {
			params.teamParams.errorLogger.logError(
				e,
				'failed in BaseListItemPage.constructor()',
			);
		}
	}

	override setList(list: IListContext): void {
		super.setList(list);
		// tslint:disable-next-line:no-this-assignment
		const { itemId } = this;
		if (itemId && list.dto?.items) {
			const listItemInfo = list.dto.items.find((item) => item.id === itemId);
			this.listItemInfo = listItemInfo;
			this.onListItemInfoChanged(listItemInfo);
		}
	}

	// NO_tslint:disable-next-line:prefer-function-over-method
	protected onQueryParamsChanged(queryParams: ParamMap): void {
		console.log('BaseListItemPage.onQueryParamsChanged', queryParams);
	}

	// tslint:disable-next-line:prefer-function-over-method
	protected onListItemInfoChanged(listItemInfo?: IListItemBrief): void {
		console.log('BaseListItemPage.onListItemInfoChanged', listItemInfo);
	}
}
