import { Injectable } from '@angular/core';
import { SneatApiService } from '@sneat/api';
import { Observable } from 'rxjs';

export type CurrencyCode = 'EUR' | 'USD';

export interface ICreateDebtRecordRequest {
	teamID: string;
	contactID: string;
	currency: CurrencyCode;
	amount: number;
}

@Injectable()
export class DebtusService {
	constructor(private readonly sneatApiService: SneatApiService) {}

	public createDebtRecord(
		request: ICreateDebtRecordRequest,
	): Observable<string> {
		return this.sneatApiService.post('debtus/create_debt_record', request);
	}
}
