import { Component, Input, OnInit } from '@angular/core';
import { Period } from 'sneat-shared/models/types';
import { Asset } from 'sneat-shared/models/ui/ui-asset';

@Component({
	selector: 'sneat-asset-card',
	templateUrl: './asset-card.component.html',
})
export class AssetCardComponent implements OnInit {
	@Input() period: Period;
	@Input() asset: Asset;

	segment: 'expenses' | 'income' = 'expenses';

	ngOnInit(): void {
		const { incomes, expenses } = this.asset.totals;
		if (incomes && (!expenses || incomes.count > expenses.count)) {
			this.segment = 'income';
		}
	}

	segmentChanged(ev: CustomEvent): void {
		console.log('Segment changed', ev);
		this.segment = ev.detail.value;
	}
}
