import { Injectable, inject } from '@angular/core';
import { ILogistOrderContext } from '../dto';
import { ErrorLogger, IErrorLogger } from '@sneat/core';

export interface IOrderPrintedDocContext extends ILogistOrderContext {
  params?: unknown;
}

@Injectable()
export class OrderPrintService {
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);

  openOrderPrintedDocument(
    event: Event,
    docID: string,
    orderDocContext: IOrderPrintedDocContext,
  ): void {
// console.log('openOrderPrintedDocument()', docID, orderDocContext);
    const { id, space } = orderDocContext;
    let url = `/space/${space.type}/${space.id}/order/${id}/print/${docID}?`;
    Object.entries(orderDocContext.params as object).forEach(([k, v]) => {
      url += `${k}=${encodeURIComponent('' + v)}`;
    });
    window.open(url + '#print');
  }
}
