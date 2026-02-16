import { ActivatedRoute, ParamMap } from '@angular/router';
import { IListContext } from '../contexts';
import { IListItemBrief } from '../dto';
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
      this.listItemInfo = window.history.state?.listItemInfo as IListItemBrief;
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
      params.spaceParams.errorLogger.logError(
        e,
        'failed in BaseListItemPage.constructor()',
      );
    }
  }

  override setList(list: IListContext): void {
    super.setList(list);
    const { itemId } = this;
    if (itemId && list.dbo?.items) {
      const listItemInfo = list.dbo.items.find((item) => item.id === itemId);
      this.listItemInfo = listItemInfo;
      this.onListItemInfoChanged(listItemInfo);
    }
  }

  // NO_tslint:disable-next-line:prefer-function-over-method
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onQueryParamsChanged(_queryParams: ParamMap): void {
    // Override in subclasses if needed
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onListItemInfoChanged(_listItemInfo?: IListItemBrief): void {
    // Override in subclasses if needed
  }
}
