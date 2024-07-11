import { Inject, Injectable } from '@angular/core';
import { ILogistOrderContext } from '../dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

export interface IOrderPrintedDocContext extends ILogistOrderContext {
	params?: unknown;
}

@Injectable()
export class OrderPrintService {
	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {}

	openOrderPrintedDocument(
		event: Event,
		docID: string,
		orderDocContext: IOrderPrintedDocContext,
	): void {
		console.log('openOrderPrintedDocument()', docID, orderDocContext);
		const { id, space } = orderDocContext;
		let url = `/space/${space.type}/${space.id}/order/${id}/print/${docID}?`;
		Object.entries(orderDocContext.params as object).forEach(([k, v]) => {
			url += `${k}=${encodeURIComponent('' + v)}`;
		});
		window.open(url + '#print');
	}
}
