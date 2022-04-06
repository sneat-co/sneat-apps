//tslint:disable:no-unsafe-any
import {BaseListPage} from './base-list-page';
import {CommuneBasePageParams} from '../../../services/params';
import {IListService} from '../services/interfaces';
import {OnInit} from '@angular/core';
import {IListDto, IListItemInfo} from '../../../models/dto/dto-list';
import {ParamMap} from '@angular/router';
import {IMovie} from '../../../models/movie-models';

export abstract class BaseListItemPage extends BaseListPage implements OnInit {
	protected itemId?: string;
	protected listItemInfo?: IListItemInfo;

	protected constructor(
		params: CommuneBasePageParams,
		listService: IListService,
	) {
		super('list', 'lists', params, listService);
	}

	ngOnInit(): void {
		super.ngOnInit();
		try {
			this.listItemInfo = window.history.state.listItemInfo as IMovie;
			if (this.listItemInfo) {
				this.itemId = this.listItemInfo.id;
				this.onListItemInfoChanged(this.listItemInfo);
			}
			this.route.queryParamMap.subscribe(queryParams => {
				const itemId = queryParams.get('item');
				if (itemId !== this.itemId) {
					this.itemId = itemId || undefined;
				}
				this.onQueryParamsChanged(queryParams);
			});
		} catch (e) {
			console.error('BaseListItemPage.ngOnInit():', e);
		}
	}

	// tslint:disable-next-line:prefer-function-over-method
	protected onQueryParamsChanged(queryParams: ParamMap): void {
	}

	// tslint:disable-next-line:prefer-function-over-method
	protected onListItemInfoChanged(listItemInfo?: IListItemInfo): void {
		console.log('BaseListItemPage.onListItemInfoChanged', listItemInfo);
	}

	setListDto(listDto: IListDto): void {
		super.setListDto(listDto);
		// tslint:disable-next-line:no-this-assignment
		const {itemId} = this;
		if (itemId && listDto.items) {
			const listItemInfo = listDto.items.find(item => item.id === itemId);
			this.listItemInfo = listItemInfo;
			this.onListItemInfoChanged(listItemInfo);
		}
	}
}
